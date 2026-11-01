import { describe, it, expect } from 'vitest';

type AppRole = 'SUPER_ADMIN' | 'OPERATOR' | 'FARMER' | 'CONSUMER';

interface AccessContext {
  userId: string;
  role: AppRole;
}

interface MockResource {
  collection: 'users' | 'farmers' | 'payouts' | 'entries' | 'orders' | 'audit_logs';
  ownerId?: string;
  data: Record<string, any>;
}

function evaluateFirestoreRule(
  ctx: AccessContext | null,
  op: 'read' | 'create' | 'update' | 'delete',
  resource: MockResource
): { allowed: boolean; reason?: string } {
  const isAuth = ctx !== null;
  const isSuperAdmin = ctx?.role === 'SUPER_ADMIN';

  switch (resource.collection) {
    case 'users':
      if (op === 'read') {
        const allowed = isSuperAdmin || (isAuth && ctx.userId === resource.ownerId);
        return { allowed, reason: allowed ? undefined : 'Permission Denied: User profile private' };
      }
      return { allowed: isSuperAdmin || (isAuth && ctx.userId === resource.ownerId) };

    case 'audit_logs':
      if (op === 'read') return { allowed: isSuperAdmin };
      if (op === 'create') return { allowed: isAuth };
      return { allowed: false, reason: 'Permission Denied: Audit logs are strictly immutable' };

    case 'payouts':
      if (op === 'read') return { allowed: isAuth };
      if (op === 'create') return { allowed: isSuperAdmin };
      return { allowed: false, reason: 'Permission Denied: Finalized payouts cannot be edited or deleted' };

    case 'farmers':
      if (op === 'read') return { allowed: isAuth };
      if (op === 'create' || op === 'update') return { allowed: isAuth };
      if (op === 'delete') return { allowed: isSuperAdmin, reason: isSuperAdmin ? undefined : 'Delete restricted to SuperAdmin' };
      return { allowed: false };

    case 'orders':
      if (op === 'read') {
        const allowed = isSuperAdmin || (isAuth && ctx.userId === resource.ownerId);
        return { allowed, reason: allowed ? undefined : 'Orders are private to customer and SuperAdmin' };
      }
      if (op === 'create' || op === 'update' || op === 'delete') {
        return {
          allowed: isSuperAdmin,
          reason: isSuperAdmin ? undefined : 'All orders must be created via trusted backend API',
        };
      }
      return { allowed: false };

    default:
      return { allowed: false };
  }
}

describe('Firestore Security Rules Constraint Logic', () => {
  const adminCtx: AccessContext = { userId: 'admin-1', role: 'SUPER_ADMIN' };
  const farmerAliceCtx: AccessContext = { userId: 'farmer-alice', role: 'FARMER' };
  const farmerBobCtx: AccessContext = { userId: 'farmer-bob', role: 'FARMER' };
  const consumerCtx: AccessContext = { userId: 'consumer-1', role: 'CONSUMER' };

  it('allows user to read their own user profile, rejects other users', () => {
    const aliceProfile: MockResource = { collection: 'users', ownerId: 'farmer-alice', data: {} };
    expect(evaluateFirestoreRule(farmerAliceCtx, 'read', aliceProfile).allowed).toBe(true);
    expect(evaluateFirestoreRule(farmerBobCtx, 'read', aliceProfile).allowed).toBe(false);
    expect(evaluateFirestoreRule(adminCtx, 'read', aliceProfile).allowed).toBe(true);
  });

  it('strictly FORBIDS updating or deleting audit logs for all roles including SuperAdmin', () => {
    const auditLog: MockResource = { collection: 'audit_logs', data: {} };
    expect(evaluateFirestoreRule(adminCtx, 'update', auditLog).allowed).toBe(false);
    expect(evaluateFirestoreRule(adminCtx, 'delete', auditLog).allowed).toBe(false);
    expect(evaluateFirestoreRule(farmerAliceCtx, 'update', auditLog).allowed).toBe(false);
  });

  it('strictly FORBIDS modifying or deleting finalized payout records', () => {
    const payout: MockResource = { collection: 'payouts', data: {} };
    expect(evaluateFirestoreRule(adminCtx, 'update', payout).allowed).toBe(false);
    expect(evaluateFirestoreRule(adminCtx, 'delete', payout).allowed).toBe(false);
  });

  it('restricts payout creation to SuperAdmin only', () => {
    const payout: MockResource = { collection: 'payouts', data: {} };
    expect(evaluateFirestoreRule(adminCtx, 'create', payout).allowed).toBe(true);
    expect(evaluateFirestoreRule(farmerAliceCtx, 'create', payout).allowed).toBe(false);
    expect(evaluateFirestoreRule(consumerCtx, 'create', payout).allowed).toBe(false);
  });

  it('rejects direct client order creation and mandates trusted backend / superadmin creation', () => {
    const clientOrder: MockResource = { collection: 'orders', data: { paymentStatus: 'PENDING' } };
    const clientRes = evaluateFirestoreRule(consumerCtx, 'create', clientOrder);
    expect(clientRes.allowed).toBe(false);
    expect(clientRes.reason).toBe('All orders must be created via trusted backend API');

    const adminRes = evaluateFirestoreRule(adminCtx, 'create', clientOrder);
    expect(adminRes.allowed).toBe(true);
  });

  it('blocks unauthenticated requests from reading user profiles or creating payouts', () => {
    const userProfile: MockResource = { collection: 'users', ownerId: 'farmer-alice', data: {} };
    expect(evaluateFirestoreRule(null, 'read', userProfile).allowed).toBe(false);

    const payout: MockResource = { collection: 'payouts', data: {} };
    expect(evaluateFirestoreRule(null, 'create', payout).allowed).toBe(false);
  });

  it('blocks operators from deleting farmers or creating payouts', () => {
    const operatorCtx: AccessContext = { userId: 'op-1', role: 'OPERATOR' };
    const farmerDoc: MockResource = { collection: 'farmers', data: {} };
    expect(evaluateFirestoreRule(operatorCtx, 'delete', farmerDoc).allowed).toBe(false);

    const payoutDoc: MockResource = { collection: 'payouts', data: {} };
    expect(evaluateFirestoreRule(operatorCtx, 'create', payoutDoc).allowed).toBe(false);
  });
});

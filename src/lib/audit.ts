import { adminDb } from "./firebase/admin";
// Assuming UserRole can be mapped or reused if needed. For now, we'll use string.

export async function logAuditAction(params: {
  tenantId: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
}) {
  return await adminDb.collection('tenants').doc(params.tenantId).collection('auditLogs').add({
    actorId: params.actorId,
    actorRole: params.actorRole,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    oldValues: params.oldValues || null,
    newValues: params.newValues || null,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent || null,
    reason: params.reason || null,
    timestamp: new Date()
  });
}

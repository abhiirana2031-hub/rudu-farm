/**
 * Tenant-Scoped Audit Logging Service
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from './client';
import { DEFAULT_TENANT_ID, TENANT_COLLECTIONS } from './firestore';

export interface AuditEventPayload {
  tenantId?: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export const logAuditEvent = async (event: AuditEventPayload): Promise<boolean> => {
  if (!db) return false;

  const tenantId = event.tenantId || DEFAULT_TENANT_ID;
  const auditId = `AUDIT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  try {
    const auditRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.AUDIT_LOGS, auditId);
    await setDoc(auditRef, {
      id: auditId,
      actorId: event.actorId,
      actorRole: event.actorRole,
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId,
      metadata: event.metadata || {},
      timestamp: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('[Audit] Log event warning:', err);
    return false;
  }
};

import { CollectionAuditEntry } from '../types';
import { saveDocument, COLLECTIONS } from '../services/firebase';

const AUDIT_STORAGE_KEY = 'rudu_collection_audit_logs';

/**
 * Log collection audit events (both locally and to Firestore)
 */
export async function logCollectionAudit(
  entry: Omit<CollectionAuditEntry, 'id' | 'timestamp'>
): Promise<CollectionAuditEntry> {
  const auditId = `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const auditRecord: CollectionAuditEntry = {
    ...entry,
    id: auditId,
    timestamp: new Date().toISOString(),
  };

  // 1. Save to local storage cache for immediate reactivity
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    const logs: CollectionAuditEntry[] = raw ? JSON.parse(raw) : [];
    logs.unshift(auditRecord);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 200)));
  } catch {
    // ignore
  }

  // 2. Persist to Firestore audit collection
  try {
    await saveDocument(COLLECTIONS.AUDIT_LOGS || 'auditLogs', auditId, auditRecord);
  } catch (err: any) {
    console.warn('[AuditLog] Failed to persist audit record to Firestore:', err.message);
  }

  return auditRecord;
}

/**
 * Retrieve cached audit logs
 */
export function getLocalAuditLogs(): CollectionAuditEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

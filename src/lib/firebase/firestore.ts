/**
 * Cloud Firestore Tenant-Scoped Operations & Repositories
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  onSnapshot,
  writeBatch,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './client';

export const DEFAULT_TENANT_ID = 'rudu-dairy-hq';

/**
 * Tenant Sub-Collection Names
 */
export const TENANT_COLLECTIONS = {
  MEMBERS: 'members',
  FARMERS: 'farmers',
  EMPLOYEES: 'employees',
  COLLECTION_CENTERS: 'collectionCenters',
  OPERATOR_SCHEDULES: 'operatorSchedules',
  OPERATOR_SESSIONS: 'operatorSessions',
  MILK_COLLECTIONS: 'milkCollections',
  MILK_RATES: 'milkRates',
  RATE_RULES: 'rateRules',
  LEDGER_TRANSACTIONS: 'ledgerTransactions',
  PAYMENTS: 'payments',
  ADVANCES: 'advances',
  RECEIPTS: 'receipts',
  EXPENSES: 'expenses',
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_TEMPLATES: 'notificationTemplates',
  AUDIT_LOGS: 'auditLogs',
  SETTINGS: 'settings',
  TANKER_DISPATCHES: 'tankerDispatches',
  QUALITY_TESTS: 'qualityTests',
} as const;

/**
 * Generate formatted Farmer Code (e.g. RF000001)
 */
export const generateFarmerCode = (sequenceNumber: number): string => {
  return `RF${sequenceNumber.toString().padStart(6, '0')}`;
};

/**
 * Get a Reference to a Tenant-scoped collection
 */
export const getTenantCollection = (tenantId: string = DEFAULT_TENANT_ID, subCollection: string) => {
  return collection(db, 'tenants', tenantId, subCollection);
};

/**
 * Get a Reference to a Tenant-scoped document
 */
export const getTenantDoc = (
  tenantId: string = DEFAULT_TENANT_ID,
  subCollection: string,
  docId: string
) => {
  return doc(db, 'tenants', tenantId, subCollection, docId);
};

/**
 * Real-time subscription to a tenant subcollection
 */
export const subscribeTenantCollection = <T = DocumentData>(
  subCollection: string,
  tenantId: string = DEFAULT_TENANT_ID,
  constraints: QueryConstraint[] = [],
  onUpdate: (data: T[]) => void,
  onError?: (err: Error) => void
) => {
  if (!db) return () => {};
  try {
    const colRef = getTenantCollection(tenantId, subCollection);
    const q = constraints.length > 0 ? query(colRef, ...constraints) : query(colRef);

    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as T[];
        onUpdate(items);
      },
      (err) => {
        console.warn(`[Firestore] Tenant (${tenantId}) subcollection ${subCollection} error:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn(`[Firestore] Failed to init listener:`, err?.message);
    return () => {};
  }
};

/**
 * Fetch a single document from a tenant collection
 */
export const fetchTenantDocument = async <T = DocumentData>(
  subCollection: string,
  docId: string,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<T | null> => {
  if (!db || !docId) return null;
  try {
    const docRef = getTenantDoc(tenantId, subCollection, docId);
    const snap = await getDoc(docRef);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
  } catch (err) {
    console.warn(`[Firestore] Error fetching ${subCollection}/${docId}:`, err);
    return null;
  }
};

/**
 * Save or update document inside tenant collection
 */
export const saveTenantDocument = async (
  subCollection: string,
  docId: string,
  data: DocumentData,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<boolean> => {
  if (!db || !docId) return false;
  try {
    const docRef = getTenantDoc(tenantId, subCollection, docId);
    await setDoc(
      docRef,
      {
        ...data,
        tenantId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err: any) {
    console.error(`[Firestore] Save failed on ${subCollection}/${docId}:`, err.message);
    return false;
  }
};

/**
 * Delete a document from a tenant collection
 */
export const deleteTenantDocument = async (
  subCollection: string,
  docId: string,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<boolean> => {
  if (!db || !docId) return false;
  try {
    const docRef = getTenantDoc(tenantId, subCollection, docId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.error(`[Firestore] Delete failed on ${subCollection}/${docId}:`, err.message);
    return false;
  }
};

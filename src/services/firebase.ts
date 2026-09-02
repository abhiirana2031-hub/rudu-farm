/**
 * Rudu Farm Firebase Service Facade
 * Connects directly to the modular src/lib/firebase architecture
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch,
  where,
  limit,
} from 'firebase/firestore';
import { type User } from 'firebase/auth';
import { app, db, auth, storage } from '../lib/firebase/client';
import { loginWithEmail, logoutUser, onAuthChange } from '../lib/firebase/auth';

export { app, db, auth, storage };

// Firestore Collection References
export const COLLECTIONS = {
  ENTRIES: 'entries',
  FARMERS: 'farmers',
  PAYOUTS: 'payouts',
  OPERATORS: 'operators',
  SETTINGS: 'settings',
  TANKER_DISPATCHES: 'tanker_dispatches',
  QUALITY_TESTS: 'quality_tests',
  NOTIFICATIONS: 'notifications',
  CENTERS: 'centers',
  USERS: 'users',
  AUDIT_LOGS: 'audit_logs',
} as const;

// ─── Firebase Auth helpers ────────────────────────────────────────────────────

/**
 * Sign in admin/operator with email + password via Firebase Auth
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; error?: string }> => {
  return loginWithEmail(email, password);
};

/**
 * Sign out the current Firebase user
 */
export const signOutUser = async () => {
  return logoutUser();
};

/**
 * Subscribe to Firebase Auth state changes
 */
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthChange(callback);
};

// Helper timeout promise
const withTimeout = <T>(promise: Promise<T>, ms: number = 3000): Promise<T | null> => {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
};

/**
 * Look up a farmer by phone number, farmer code, or ID in Firestore
 */
export const findFarmerInFirestore = async (searchInput: string) => {
  if (!db || !searchInput) return null;
  try {
    const raw = searchInput.trim();
    const cleanPhone = raw.replace(/\D/g, '').slice(-10);
    const upperInput = raw.toUpperCase();

    const fetchQuery = async () => {
      // 1. Direct doc lookup by ID
      try {
        const directDoc = await getDoc(doc(db, COLLECTIONS.FARMERS, upperInput));
        if (directDoc.exists()) {
          return { id: directDoc.id, ...directDoc.data() };
        }
      } catch {}

      // 2. Query by farmerCode
      const codeQuery = query(
        collection(db, COLLECTIONS.FARMERS),
        where('farmerCode', '==', upperInput),
        limit(1)
      );
      const codeSnap = await getDocs(codeQuery);
      if (!codeSnap.empty) {
        const d = codeSnap.docs[0];
        return { id: d.id, ...d.data() };
      }

      // 3. Query by phone if 10 digits
      if (cleanPhone.length === 10) {
        const phoneQuery = query(
          collection(db, COLLECTIONS.FARMERS),
          where('phone', '==', cleanPhone),
          limit(1)
        );
        const phoneSnap = await getDocs(phoneQuery);
        if (!phoneSnap.empty) {
          const d = phoneSnap.docs[0];
          return { id: d.id, ...d.data() };
        }

        // Broad match on phone field
        const allFarmersSnap = await getDocs(collection(db, COLLECTIONS.FARMERS));
        const match = allFarmersSnap.docs.find((d) => {
          const storedPhone: string = (d.data().phone || '').replace(/\D/g, '').slice(-10);
          return storedPhone === cleanPhone;
        });
        if (match) return { id: match.id, ...match.data() };
      }

      return null;
    };

    return await withTimeout(fetchQuery(), 3000);
  } catch (err) {
    console.warn('[Firestore] findFarmerInFirestore error:', err);
    return null;
  }
};

export const findFarmerByPhone = findFarmerInFirestore;

/**
 * Look up an operator by employee code in Firestore
 */
export const findOperatorByCode = async (employeeCode: string) => {
  if (!db) return null;
  try {
    const code = employeeCode.toUpperCase();
    const fetchQuery = async () => {
      const q = query(
        collection(db, COLLECTIONS.OPERATORS),
        where('employeeCode', '==', code),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
      }
      return null;
    };

    return await withTimeout(fetchQuery(), 2500);
  } catch (err) {
    console.warn('[Firestore] findOperatorByCode error:', err);
    return null;
  }
};

// ─── Generic Firestore helpers ────────────────────────────────────────────────

/**
 * Generic Firestore real-time listener for any collection
 */
export const subscribeToCollection = <T>(
  collectionName: string,
  onUpdate: (data: T[]) => void,
  onError?: (err: Error) => void
) => {
  if (!db) return () => {};
  try {
    const q = query(collection(db, collectionName));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as T[];
        onUpdate(items);
      },
      (error) => {
        if (!error.message?.includes('(default)') && !error.message?.includes('not found')) {
          console.warn(`[Firestore] ${collectionName} subscription note:`, error.message);
        }
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    if (!err?.message?.includes('(default)')) {
      console.warn(`[Firestore] Failed to init listener for ${collectionName}:`, err?.message);
    }
    return () => {};
  }
};

/**
 * Save or update document in Firestore
 */
export const saveDocument = async (collectionName: string, id: string, data: any) => {
  if (!db) return false;
  try {
    const savePromise = async () => {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, data, { merge: true });
      return true;
    };
    const result = await withTimeout(savePromise(), 2500);
    return result === true;
  } catch (err: any) {
    console.warn(`[Firestore] Error saving ${collectionName}/${id}:`, err.message);
    return false;
  }
};

/**
 * Delete document from Firestore
 */
export const removeDocument = async (collectionName: string, id: string) => {
  if (!db) return false;
  try {
    const removePromise = async () => {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    };
    const result = await withTimeout(removePromise(), 2500);
    return result === true;
  } catch (err: any) {
    console.warn(`[Firestore] Error deleting ${collectionName}/${id}:`, err.message);
    return false;
  }
};

/**
 * Fetch document once
 */
export const getDocument = async (collectionName: string, id: string) => {
  if (!db) return null;
  try {
    const docRef = doc(db, collectionName, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.warn(`[Firestore] Failed to get ${collectionName}/${id}`, err);
    return null;
  }
};

/**
 * Update Rate Chart Settings in Firestore
 */
export const saveRateChartSettings = async (rateChartData: any) => {
  if (!db) return false;
  try {
    const rateDocRef = doc(db, COLLECTIONS.SETTINGS, 'rate_chart');
    await setDoc(rateDocRef, rateChartData, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] Failed to update rate chart in Firestore:', err);
    return false;
  }
};

/**
 * Subscribe to Rate Chart in Firestore
 */
export const subscribeToRateChart = (onUpdate: (data: any) => void) => {
  if (!db) return () => {};
  try {
    const rateDocRef = doc(db, COLLECTIONS.SETTINGS, 'rate_chart');
    return onSnapshot(
      rateDocRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data());
        }
      },
      (error) => {
        if (!error.message?.includes('(default)') && !error.message?.includes('not found')) {
          console.warn('[Firestore] Rate chart subscription note:', error.message);
        }
      }
    );
  } catch (err: any) {
    if (!err?.message?.includes('(default)')) {
      console.warn('[Firestore] Failed to subscribe to rate_chart:', err);
    }
    return () => {};
  }
};

/**
 * Seed a Firestore collection with an array of records using a batch write.
 */
export const seedCollectionIfEmpty = async (
  collectionName: string,
  records: Array<{ id: string; [key: string]: any }>
): Promise<boolean | null> => {
  if (!db) return null;
  try {
    const snap = await getDocs(query(collection(db, collectionName), limit(1)));
    if (!snap.empty) {
      return false;
    }

    const batch = writeBatch(db);
    for (const record of records) {
      const { id, ...data } = record;
      batch.set(doc(db, collectionName, id), data);
    }
    await batch.commit();
    return true;
  } catch (err: any) {
    console.warn(`[Seed] Error seeding ${collectionName}:`, err.message);
    return null;
  }
};

/**
 * Force-seed a Firestore collection (overwrites existing data).
 */
export const forceReseedCollection = async (
  collectionName: string,
  records: Array<{ id: string; [key: string]: any }>
): Promise<boolean> => {
  if (!db) return false;
  try {
    const batch = writeBatch(db);
    for (const record of records) {
      const { id, ...data } = record;
      batch.set(doc(db, collectionName, id), data, { merge: false });
    }
    await batch.commit();
    return true;
  } catch (err: any) {
    console.warn(`[Seed] Error force-seeding ${collectionName}:`, err.message);
    return false;
  }
};

export default app;

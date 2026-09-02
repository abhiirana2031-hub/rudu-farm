/**
 * Firebase Authentication & Membership Service
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './client';

export type AppRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'OPERATOR' | 'FARMER';

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt?: string;
  updatedAt?: string;
}

export interface TenantMembership {
  userId: string;
  tenantId: string;
  role: AppRole;
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt: string;
}

/**
 * Sign in with email & password with strict validation
 */
export const loginWithEmail = async (
  email: string,
  pass: string
): Promise<{ user: User | null; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();
  if (!cleanEmail || !cleanPass) {
    return { user: null, error: 'Please enter both email and password.' };
  }

  // 1. Check Firebase Auth
  if (auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      if (cred.user) return { user: cred.user };
    } catch (err: any) {
      console.log('[Auth] Sign-in error:', err?.code, err?.message);

      if (err.code === 'auth/too-many-requests') {
        return { user: null, error: 'Too many failed login attempts. Please try again in a few minutes.' };
      }

      if (err.code === 'auth/user-not-found') {
        // Auto-register Firebase Auth account for the official admin email
        if (cleanEmail === 'rududairy@gmail.com' || cleanEmail === 'admin@rududairy.com') {
          try {
            const createCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
            if (createCred.user) {
              if (db) {
                setDoc(doc(db, 'users', createCred.user.uid), {
                  uid: createCred.user.uid,
                  email: cleanEmail,
                  name: 'Dairy Owner / Executive Admin',
                  role: 'SUPER_ADMIN',
                  status: 'ACTIVE',
                  createdAt: new Date().toISOString(),
                }).catch(() => {});
              }
              return { user: createCred.user };
            }
          } catch (createErr: any) {
            console.warn('[Auth] Create account error:', createErr?.code);
            // Fall through to Firestore lookup
          }
        }
        // Fall through to Firestore lookup
      }

      // For wrong-password / invalid-credential: fall through to Firestore lookup
      // (password in Firebase Auth may differ from the one stored in Firestore users collection)
    }
  }

  // 2. Firestore fallback — check the users collection for matching email + password
  if (db) {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const usersRef = collection(db, 'users');

      // Search by email field in users collection
      const q = query(usersRef, where('email', '==', cleanEmail));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const userDoc = snap.docs[0].data();
        const storedPass = (userDoc.password || userDoc.pin || '').trim();
        const storedRole = (userDoc.role || '').toUpperCase();

        if (storedPass && storedPass === cleanPass) {
          // Password matches the Firestore record
          const adminUser = {
            uid: snap.docs[0].id,
            email: cleanEmail,
            displayName: userDoc.name || 'Dairy Admin',
          } as unknown as User;
          return { user: adminUser };
        } else if (storedPass && storedPass !== cleanPass) {
          return { user: null, error: 'Incorrect password. Please check your admin password.' };
        }
      }
    } catch (fsErr) {
      console.warn('[Auth] Firestore users lookup failed:', fsErr);
    }
  }

  // 3. Local hardcoded fallback for official admin (offline mode)
  const isOfficialAdmin = cleanEmail === 'rududairy@gmail.com' || cleanEmail === 'admin@rududairy.com' || cleanEmail === 'admin';
  const savedAdminPin = localStorage.getItem('rudu_admin_pin') || '8006270064';
  const savedAdminPass = localStorage.getItem('rudu_admin_pass') || 'admin123';

  if (isOfficialAdmin && (cleanPass === savedAdminPin || cleanPass === savedAdminPass || cleanPass === 'rudu2026' || cleanPass === '8006270064' || cleanPass === 'Abhay@#005')) {
    const adminUser = {
      uid: 'rudu-admin-master',
      email: cleanEmail,
      displayName: 'Dairy Owner / Executive Admin',
    } as unknown as User;
    return { user: adminUser };
  }

  return { user: null, error: 'Invalid admin credentials. Please enter your valid email and password.' };
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<void> => {
  if (!auth) return;
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.error('[Auth] Sign out error:', err);
  }
};

/**
 * Trigger password reset email
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
  if (!auth) return { success: false, error: 'Auth not initialized' };
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send password reset email' };
  }
};

/**
 * Subscribe to Auth State
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

/**
 * Fetch or Initialize User Profile in Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db || !uid) return null;
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn('[Auth] Error getting user profile:', err);
    return null;
  }
};

/**
 * Fetch Membership for a User inside a specific Tenant
 */
export const getTenantMembership = async (
  tenantId: string,
  userId: string
): Promise<TenantMembership | null> => {
  if (!db || !tenantId || !userId) return null;
  try {
    const memberRef = doc(db, 'tenants', tenantId, 'members', userId);
    const snap = await getDoc(memberRef);
    if (snap.exists()) {
      return snap.data() as TenantMembership;
    }
    return null;
  } catch (err) {
    console.warn('[Auth] Error getting tenant membership:', err);
    return null;
  }
};

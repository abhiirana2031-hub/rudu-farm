/**
 * Firebase Client Initialization
 * Supports Vite and Next.js environments with singleton guard.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const getEnv = (key: string, fallback: string = ''): string => {
  const globalProcess = typeof globalThis !== 'undefined' ? (globalThis as any).process : undefined;
  if (globalProcess && globalProcess.env && globalProcess.env[key]) {
    return globalProcess.env[key] as string;
  }
  // Vite import.meta.env
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || import.meta.env[`VITE_${key}`] || fallback;
    }
  } catch {}
  return fallback;
};

export const firebaseConfig = {
  apiKey:
    getEnv('NEXT_PUBLIC_FIREBASE_API_KEY') ||
    getEnv('VITE_FIREBASE_API_KEY') ||
    'AIzaSyBKcvVisfzb9qTgM44h_r_p6Wa81KKCkkQ',
  authDomain:
    getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') ||
    getEnv('VITE_FIREBASE_AUTH_DOMAIN') ||
    'rudu-dairy.firebaseapp.com',
  projectId:
    getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID') ||
    getEnv('VITE_FIREBASE_PROJECT_ID') ||
    'rudu-dairy',
  storageBucket:
    getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET') ||
    getEnv('VITE_FIREBASE_STORAGE_BUCKET') ||
    'rudu-dairy.firebasestorage.app',
  messagingSenderId:
    getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') ||
    getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') ||
    '997878390688',
  appId:
    getEnv('NEXT_PUBLIC_FIREBASE_APP_ID') ||
    getEnv('VITE_FIREBASE_APP_ID') ||
    '1:997878390688:web:eb184e514d4c1c66114ec5',
  measurementId:
    getEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID') ||
    getEnv('VITE_FIREBASE_MEASUREMENT_ID') ||
    'G-GC6BS7BHQ0',
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  // User's Cloud Firestore database in Firebase console is named "default"
  try {
    db = getFirestore(app, 'default');
  } catch {
    db = getFirestore(app);
  }
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.error('[Firebase Client Init Error]:', error);
  // @ts-ignore
  app = {} as FirebaseApp;
  // @ts-ignore
  db = {} as Firestore;
  // @ts-ignore
  auth = {} as Auth;
  // @ts-ignore
  storage = {} as FirebaseStorage;
}

export { app, db, auth, storage };

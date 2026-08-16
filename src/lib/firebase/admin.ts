import { initializeApp, getApps, cert, getApp, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let app: App;

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle escaped newlines in private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      app = initializeApp({ projectId: 'demo-rudu-farm' });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    app = getApp(); // Fallback if initialization failed because it was already initialized
  }
} else {
  app = getApp();
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app, "default");

try {
  adminDb.settings({ 
    projectId: process.env.FIREBASE_PROJECT_ID, 
    ignoreUndefinedProperties: true,
    preferRest: true 
  });
} catch (e) {
  // ignore
}

export const adminStorage = getStorage(app);

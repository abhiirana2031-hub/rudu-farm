import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  projectId: env.FIREBASE_PROJECT_ID,
});

const db = getFirestore(app);
db.settings({ preferRest: true, ignoreUndefinedProperties: true });

async function check() {
  try {
    console.log(`Checking project: ${env.FIREBASE_PROJECT_ID}`);
    const collections = await db.listCollections();
    console.log("Collections found:");
    collections.forEach(c => console.log("- " + c.id));
  } catch (e) {
    console.error("Firestore Error:", e.message);
  }
}

check();

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync('.env', 'utf8');
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

const db = getFirestore(app, "(default)");
db.settings({ preferRest: true, ignoreUndefinedProperties: true });

async function check() {
  try {
    console.log(`Writing test doc...`);
    await db.collection("test").doc("ping").set({ ts: Date.now() });
    console.log("Write success!");
  } catch (e) {
    console.error("Firestore Error:", e.message);
  }
}

check();

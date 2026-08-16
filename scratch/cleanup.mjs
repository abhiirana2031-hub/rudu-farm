import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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

const auth = getAuth(app);
const adminEmail = "abhayrana8272@gmail.com";

async function cleanup() {
  try {
    const listUsersResult = await auth.listUsers(1000);
    const usersToDelete = [];
    
    listUsersResult.users.forEach((userRecord) => {
      if (userRecord.email !== adminEmail) {
        usersToDelete.push(userRecord.uid);
      }
    });
    
    if (usersToDelete.length > 0) {
      console.log(`Deleting ${usersToDelete.length} non-admin users from Auth...`);
      await auth.deleteUsers(usersToDelete);
      console.log("Deleted.");
    } else {
      console.log("No other users found in Auth.");
    }

    // Since Firestore was just created, it only has the data seeded by the script.
    // So there is nothing else to delete in Firestore!
    console.log("Cleanup complete!");

  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

cleanup();

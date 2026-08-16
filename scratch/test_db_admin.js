const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

async function main() {
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

  const auth = new GoogleAuth({
    credentials: {
      client_email: env.FIREBASE_CLIENT_EMAIL,
      private_key: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: 'https://www.googleapis.com/auth/datastore'
  });

  const client = await auth.getClient();
  const projectId = env.FIREBASE_PROJECT_ID;

  try {
    // List databases
    console.log(`Requesting databases for ${projectId}...`);
    const res = await client.request({
      url: `https://firestore.googleapis.com/v1/projects/${projectId}/databases`
    });
    console.log("Databases:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

main();

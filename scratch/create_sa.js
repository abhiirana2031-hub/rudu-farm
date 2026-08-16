const fs = require('fs');

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

const serviceAccount = {
  type: "service_account",
  project_id: env.FIREBASE_PROJECT_ID,
  private_key_id: "dummy_key_id",
  private_key: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: env.FIREBASE_CLIENT_EMAIL,
  client_id: "dummy_client_id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(env.FIREBASE_CLIENT_EMAIL)}`,
  universe_domain: "googleapis.com"
};

fs.writeFileSync('serviceAccount.json', JSON.stringify(serviceAccount, null, 2));
console.log('Created serviceAccount.json');

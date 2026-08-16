const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

async function deployRules() {
  let credentials;
  if (fs.existsSync('serviceAccount.json')) {
    credentials = JSON.parse(fs.readFileSync('serviceAccount.json', 'utf8'));
  } else if (fs.existsSync('.env')) {
    const envStr = fs.readFileSync('.env', 'utf8');
    const getVal = (k) => {
      const match = envStr.match(new RegExp(`${k}=(?:["']?)(.*?)(?:["']?)$`, 'm'));
      return match ? match[1] : '';
    };
    credentials = {
      client_email: getVal('FIREBASE_CLIENT_EMAIL'),
      private_key: getVal('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      project_id: getVal('FIREBASE_PROJECT_ID') || 'rudu-dairy'
    };
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/firebase', 'https://www.googleapis.com/auth/cloud-platform']
  });
  
  const client = await auth.getClient();
  const projectId = 'rudu-dairy';
  const rulesContent = fs.readFileSync('firestore.rules', 'utf8');

  console.log('1. Creating Ruleset...');
  const rulesetRes = await client.request({
    url: `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
    method: 'POST',
    data: {
      source: {
        files: [{
          name: 'firestore.rules',
          content: rulesContent
        }]
      }
    }
  });

  const rulesetName = rulesetRes.data.name;
  console.log('Ruleset created:', rulesetName);

  console.log('2. Fetching existing releases...');
  const releasesRes = await client.request({
    url: `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
    method: 'GET'
  });

  const releases = releasesRes.data.releases || [];
  console.log('Found releases:', releases.map(r => r.name));

  if (releases.length > 0) {
    const targetRelease = releases[0];
    console.log(`Updating release ${targetRelease.name}...`);
    await client.request({
      url: `https://firebaserules.googleapis.com/v1/${targetRelease.name}`,
      method: 'PATCH',
      data: {
        release: {
          name: targetRelease.name,
          rulesetName: rulesetName
        }
      }
    });
    console.log('Release updated successfully to new ruleset!');
  }
}

deployRules().catch(console.error);

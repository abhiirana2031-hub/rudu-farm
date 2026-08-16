const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

async function deployRules() {
  const auth = new GoogleAuth({
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

  console.log('2. Updating Release...');
  // The release name for the default database is usually "cloud.firestore"
  // For named databases, it's "cloud.firestore/databases/{database_id}"
  const releaseName = `projects/${projectId}/releases/cloud.firestore`;
  
  try {
    const releaseRes = await client.request({
      url: `https://firebaserules.googleapis.com/v1/${releaseName}`,
      method: 'PATCH',
      data: {
        release: {
          name: releaseName,
          rulesetName: rulesetName
        }
      }
    });
    console.log('Release updated successfully!');
  } catch (error) {
    if (error.code === 404) {
      console.log('Release not found, creating new release...');
      const releaseRes = await client.request({
        url: `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
        method: 'POST',
        data: {
          name: releaseName,
          rulesetName: rulesetName
        }
      });
      console.log('Release created successfully!');
    } else {
      throw error;
    }
  }
}

deployRules().catch(console.error);

# DEPLOYMENT, ENVIRONMENT SETUP & VERIFICATION GUIDE
**Rudu Dairy / Rudu Farm Production Ecosystem**  

---

## 1. Prerequisites
- **Node.js:** v20.x or higher
- **Package Manager:** npm v10.x+
- **Google Cloud / Firebase Project:** `rudu-dairy` with Cloud Firestore and Firebase Authentication enabled

## 2. Environment Variables Configuration
Ensure `.env` contains the required frontend and server variables (refer to `.env.example`):
```env
# Frontend Client Credentials
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="rudu-dairy.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="rudu-dairy"
VITE_FIREBASE_STORAGE_BUCKET="rudu-dairy.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="997878390688"
VITE_FIREBASE_APP_ID="1:997878390688:web:..."

# SMS Provider Configuration
SMS_PROVIDER=fast2sms # or 'mock' for local development
FAST2SMS_API_KEY="..."
```

## 3. Pre-Flight Verification Commands
Before deploying to production, execute the 4-stage validation pipeline:

```bash
# 1. Typecheck validation
npm run typecheck

# 2. Linter audit
npm run lint

# 3. Automated unit & integration tests
npm test

# 4. Production optimized build
npm run build
```

## 4. Deploying to Hosting (Vercel / Firebase Hosting)

### 4.1 Vercel Deployment
```bash
npx vercel --prod
```
The repository includes `vercel.json` configured with SPA rewrites (`"source": "/(.*)", "destination": "/index.html"`).

### 4.2 Firebase Rules Deployment
To deploy hardened Firestore security rules:
```bash
npx firebase deploy --only firestore:rules
```

## 5. Rollback Procedure
If an issue occurs in production:
1. Revert to the prior verified git commit tag.
2. Re-run `npm run build`.
3. Promote the prior deployment in Vercel or Firebase Hosting console.

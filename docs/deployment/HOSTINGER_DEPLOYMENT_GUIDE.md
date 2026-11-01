# HOSTINGER DEPLOYMENT GUIDE — RUDU DAIRY / RUDU FARM

This guide walks you through deploying the **Rudu Dairy** production web application to **Hostinger**.

---

## 🚀 METHOD 1: Hostinger Web / Cloud Hosting (hPanel) — Recommended

Since the application is a high-performance React SPA built with Vite that connects directly to Google Cloud Firestore and Firebase Auth, you can deploy it directly to Hostinger's web hosting (`public_html`).

### Step 1: Build the Production Bundle Locally
Run the production build:
```bash
npm run build
```
This generates the optimized `dist/` directory containing:
- `index.html`
- `assets/` (JavaScript, CSS, fonts)
- `.htaccess` (Automated Apache/LiteSpeed SPA URL rewrite rules)
- Images and public assets

---

### Step 2: Upload Files via Hostinger File Manager

1. Log into your **[Hostinger Control Panel (hPanel)](https://hpanel.hostinger.com/)**.
2. Navigate to **Websites** → Select your domain (e.g., `rududairy.com`) → Click **Manage**.
3. Under the **Files** section, click **File Manager** (or access files for this domain).
4. Double-click to open the **`public_html`** directory.
5. If there is a default `default.php` file from Hostinger, delete it.
6. **Upload the contents of your local `dist/` folder into `public_html/`:**
   - *Option A (ZIP Upload - Fastest):*
     1. Compress all files **inside** `dist/` into a `.zip` archive (e.g., `build.zip`).
     2. In Hostinger File Manager, click the **Upload** icon (top right) → Choose `build.zip`.
     3. Right-click `build.zip` inside `public_html` → Select **Extract** → Choose current folder.
     4. Delete the `.zip` file after extraction.
   - *Option B (FTP):* Use FileZilla or Cyberduck with your Hostinger FTP credentials.

> [!IMPORTANT]
> Upload the **contents** of `dist/` (such that `index.html` and `.htaccess` reside directly inside `public_html/`), not the folder named `dist` itself.

---

### Step 3: Verify `.htaccess` Routing
Vite has already generated `.htaccess` in your `dist/` folder:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
This ensures that refreshing pages like `/admin` or `/operator` routes directly to the application without triggering a web server 404 error.

---

### Step 4: Enable Free SSL Certificate (HTTPS)
1. In Hostinger hPanel, go to **Security** → **SSL**.
2. Click **Install SSL** on your domain.
3. Toggle on **Force HTTPS** to ensure all traffic is encrypted.

---

## 🖥️ METHOD 2: Hostinger VPS (Ubuntu / Debian + Nginx + Node.js)

If you are using a Hostinger Virtual Private Server (VPS) and want to host both the frontend and the standalone Node.js API server (`src/server/productionServer.ts`):

### 1. SSH into your VPS
```bash
ssh root@YOUR_SERVER_IP
```

### 2. Install Node.js (v20+) & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 3. Clone and Build Project
```bash
cd /var/www
git clone YOUR_GIT_REPO_URL rudu-dairy
cd rudu-dairy
npm install
npm run build
```

### 4. Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/rududairy`:
```nginx
server {
    listen 80;
    server_name rududairy.com www.rududairy.com;

    root /var/www/rudu-dairy/dist;
    index index.html;

    # Frontend Single Page App Rewrite
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy (if running productionServer.ts)
    location /api/ {
        proxy_pass http://127.0.0.1:5176;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/rududairy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Install SSL with Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d rududairy.com -d www.rududairy.com
```

---

## 🔒 Firebase Authorized Domains Checklist

When deploying to your live Hostinger domain (e.g. `rududairy.com`), ensure Google Firebase recognizes your domain:
1. Open the **[Firebase Console](https://console.firebase.google.com/)**.
2. Select project **`rudu-dairy`**.
3. Navigate to **Authentication** → **Settings** tab → **Authorized domains**.
4. Click **Add domain** and enter:
   - `rududairy.com`
   - `www.rududairy.com`
   - *(or your Hostinger preview domain)*
5. Click **Save**.


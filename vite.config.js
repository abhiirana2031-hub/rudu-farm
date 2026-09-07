import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function smsApiPlugin() {
  return {
    name: 'sms-api-backend',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (
          url === '/api/notifications/send-sms' ||
          url === '/api/admin/notifications/test-sms' ||
          url === '/api/webhooks/fast2sms'
        ) {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
          }

          let rawBody = '';
          req.on('data', (chunk) => {
            rawBody += chunk;
          });

          req.on('end', async () => {
            try {
              const body = rawBody ? JSON.parse(rawBody) : {};
              const env = loadEnv(server.config.mode, process.cwd(), '');

              // Dynamic import of backend handler in Node environment
              const { handleSendSmsRequest, handleTestSmsRequest, handleFast2SMSWebhook } =
                await server.ssrLoadModule('/src/server/smsApiMiddleware.ts');

              // Apply env vars to process.env
              Object.assign(process.env, env);

              let result;
              const clientIp = req.socket.remoteAddress || '127.0.0.1';

              if (url === '/api/admin/notifications/test-sms') {
                const role = req.headers['x-user-role'] || 'admin';
                result = await handleTestSmsRequest(body, role, clientIp);
              } else if (url === '/api/webhooks/fast2sms') {
                result = await handleFast2SMSWebhook(body);
              } else {
                result = await handleSendSmsRequest(body, clientIp);
              }

              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.body));
            } catch (err) {
              console.error('[SMS Server Error]', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    smsApiPlugin(),
  ],
  // Serve index.html for all paths so /admin and /operator work as SPA routes
  server: {
    port: 5176,
    strictPort: false,
    historyApiFallback: true,
  },
  preview: {
    port: 5176,
    historyApiFallback: true,
  },
})

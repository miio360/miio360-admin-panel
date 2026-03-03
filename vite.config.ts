import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import type { Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Generates the firebase-messaging-sw.js content with env vars injected.
 * This SW handles FCM background push notifications.
 */
function generateFirebaseSwContent(env: Record<string, string>): string {
  return `
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '${env.VITE_FIREBASE_API_KEY || ''}',
  authDomain: '${env.VITE_FIREBASE_AUTH_DOMAIN || ''}',
  projectId: '${env.VITE_FIREBASE_PROJECT_ID || ''}',
  storageBucket: '${env.VITE_FIREBASE_STORAGE_BUCKET || ''}',
  messagingSenderId: '${env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''}',
  appId: '${env.VITE_FIREBASE_APP_ID || ''}',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const title = (payload.notification && payload.notification.title) || 'Miio Admin';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/MiioIcon.png',
    badge: '/MiioIcon.png',
    tag: 'miio-admin-notification',
    renotify: true,
    data: payload.data || {},
  };
  return self.registration.showNotification(title, options);
});
`.trimStart()
}

/**
 * Vite plugin that generates firebase-messaging-sw.js at dev-serve time
 * and injects it into the build output directory.
 */
function firebaseMessagingSw(): Plugin {
  let swContent = ''

  return {
    name: 'firebase-messaging-sw',
    enforce: 'post',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, 'VITE_')
      swContent = generateFirebaseSwContent(env)
    },
    configureServer(server) {
      // Serve the generated SW in dev mode
      server.middlewares.use('/firebase-messaging-sw.js', (_req, res) => {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        res.setHeader('Service-Worker-Allowed', '/')
        res.end(swContent)
      })
    },
    writeBundle(options) {
      // Write to the build output directory
      const outDir = (options as { dir?: string }).dir ?? path.resolve(__dirname, 'dist')
      fs.writeFileSync(path.join(outDir, 'firebase-messaging-sw.js'), swContent, 'utf-8')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: '/index.html',
        // Exclude the FCM SW from workbox pre-caching to avoid conflicts
        navigateFallbackDenylist: [/^\/firebase-messaging-sw\.js$/],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Miio Admin Panel',
        short_name: 'Miio Admin',
        description: 'Panel de administración de Miio360',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/MiioIcon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/MiioIcon.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/MiioIcon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
    firebaseMessagingSw(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

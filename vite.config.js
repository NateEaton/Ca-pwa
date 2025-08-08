// vite.config.js

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // For production, the base path is always '/'.
  // For dev, it's the environment variable. This ensures correctness.
  const base_path = (env.BASE_PATH && env.BASE_PATH !== '/') ? `${env.BASE_PATH}/` : '/';

  return {
    plugins: [
      sveltekit(),
      VitePWA({
        // Use the 'generateSW' strategy, which is the most reliable.
        strategies: 'generateSW',
        registerType: 'autoUpdate',
        injectRegister: false,

        // Explicitly set the manifest name for SvelteKit to find.
        manifestFilename: 'manifest.webmanifest',

        manifest: {
          name: 'My Calcium',
          short_name: 'Calcium',
          description: 'A simple, privacy-focused app to help you track your daily calcium intake.',
          // For a root deployment, these MUST be '/'
          start_url: '/',
          scope: '/',
          display: 'standalone',
          theme_color: '#1976D2',
          background_color: '#ffffff',
          icons: [
            // Your icons remain the same
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: [
            '**/*.{js,css,png,jpg,jpeg,gif,svg,ico,woff,woff2}'
          ],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                networkTimeoutSeconds: 3,
              },
            },
            {
              urlPattern: /\.html$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                networkTimeoutSeconds: 3,
              },
            }
          ]
        }
      })
    ]
  };
});
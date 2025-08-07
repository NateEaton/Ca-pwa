// vite.config.js

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    sveltekit(),
    VitePWA({
      // Use the simpler, fully automatic strategy
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      // Let the plugin automatically work with SvelteKit's output
      // No need to specify outDir or globDirectory here
      manifest: {
        name: 'My Calcium',
        short_name: 'Calcium',
        description: 'A simple, privacy-focused app to help you track your daily calcium intake.',
        // The %sveltekit.paths.base% in app.html will handle the base path correctly
        start_url: '.',
        scope: '.',
        display: 'standalone',
        theme_color: '#1976D2',
        background_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // This ensures all the generated files are precached
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest}'],
      }
    })
  ]
});
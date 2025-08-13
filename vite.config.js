import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const base_path =
    env.BASE_PATH && env.BASE_PATH !== "/" ? `${env.BASE_PATH}/` : "/";

  return {
    plugins: [
      sveltekit(),
      // REMOVED wasm() and topLevelAwait() plugins
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          // REMOVED wasm from globPatterns
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          additionalManifestEntries: [{ url: "index.html", revision: null }],
        },
        includeAssets: ["favicon.ico", "index.html"],
        manifest: {
          name: "My Calcium",
          short_name: "Calcium",
          description:
            "A simple, privacy-focused app to help you track your daily calcium intake.",
          theme_color: "#1976D2",
          background_color: "#ffffff",
          display: "standalone",
          scope: "/",
          start_url: "/",
          icons: [
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    // The optimizeDeps and server sections for WASM are no longer needed
  };
});

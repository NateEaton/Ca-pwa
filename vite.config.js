import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { execSync } from "child_process";

/**
 * Generates a unique build identifier combining git hash and timestamp
 * @returns {string} Build ID in format: "a1b2c3d-20240817143022" or "20240817143022" if no git
 */
function createBuildId() {
  // Create timestamp in format YYYYMMDDHHMMSS
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.]/g, "")
    .slice(0, 14);

  try {
    // Try to get git commit hash (short version)
    const gitHash = execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
    }).trim();

    // Check if working directory has uncommitted changes
    const status = execSync("git status --porcelain", {
      encoding: "utf8",
    }).trim();
    const isDirty = status.length > 0;

    return `${gitHash}${isDirty ? "-dirty" : ""}-${timestamp}`;
  } catch (error) {
    // Fallback if not in git repo or git not available
    console.warn("Git not available, using timestamp-only build ID");
    return timestamp;
  }
}

/**
 * Gets git branch name if available
 * @returns {string|null} Current git branch or null if not available
 */
function getGitBranch() {
  try {
    return execSync("git branch --show-current", { encoding: "utf8" }).trim();
  } catch (error) {
    return null;
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const base_path =
    env.BASE_PATH && env.BASE_PATH !== "/" ? `${env.BASE_PATH}/` : "/";

  return {
    plugins: [
      sveltekit(),
      // REMOVED wasm() and topLevelAwait() plugins
      VitePWA({
        registerType: "prompt",
        workbox: {
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],

          // Correct offline SPA fallback
          navigateFallback: (base_path === "/" ? "" : base_path) + "index.html",

          // Runtime caching rules (required for correct update flow)
          runtimeCaching: [
            // Navigation requests (HTML): must be NetworkFirst
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "html-pages",
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
              },
            },

            // Build assets (hashed): safe for StaleWhileRevalidate
            {
              urlPattern: /.*\.(js|css|woff2?)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-assets",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
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
          scope: base_path,
          start_url: base_path,
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
    define: {
      // Build identification
      __BUILD_ID__: JSON.stringify(createBuildId()),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __GIT_BRANCH__: JSON.stringify(getGitBranch()),

      // Application metadata
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version || "1.0.0"
      ),
      __NODE_VERSION__: JSON.stringify(process.version),
      __BUILD_PLATFORM__: JSON.stringify(process.platform),

      // Environment detection
      __APP_ENV__: JSON.stringify(mode),
    },
    build: {
      chunkSizeWarningLimit: 750,
    },
    // The optimizeDeps and server sections for WASM are no longer needed
  };
});

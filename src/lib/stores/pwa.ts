import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Stores for UI bindings
export const pwaUpdateAvailable = writable<boolean>(false);
export const pwaUpdateFunction = writable<(() => Promise<void>) | null>(null);
export const pwaOfflineReady = writable<boolean>(false);

// Only run in browser
if (browser) {
  // Lazy-import because virtual:pwa-register must not run on server
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      immediate: false,         // REQUIRED for "prompt" mode
      onNeedRefresh() {
        pwaUpdateAvailable.set(true);
      },
      onOfflineReady() {
        pwaOfflineReady.set(true);
      }
    });

    // Expose `updateSW()` so the Settings page can apply updates
    pwaUpdateFunction.set(() => updateSW());
  });
}

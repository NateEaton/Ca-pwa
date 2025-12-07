<!--
 * My Calcium Tracker PWA
 * Copyright (C) 2025 Nathan A. Eaton Jr.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
-->

<script>
  import { onMount } from "svelte";
  import { logBuildInfo } from "$lib/utils/buildInfo";
  import { page } from "$app/stores";
  import { calciumState, calciumService, showToast } from "$lib/stores/calcium";
  import { pwaUpdateAvailable, pwaUpdateFunction, pwaOfflineReady } from "$lib/stores/pwa";
  import Header from "$lib/components/Header.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import DatabaseInfoDialog from "$lib/components/DatabaseInfoDialog.svelte";
  import AboutDialog from "$lib/components/AboutDialog.svelte";
  import "../app.css";

  import { FEATURES } from "$lib/utils/featureFlags";
  import { SyncUrlHandler } from "$lib/utils/syncUrlHandler";
  import { SyncService } from "$lib/services/SyncService";
  import { NetworkStatusService } from "$lib/services/NetworkStatusService";

  let syncService = null;

  onMount(async () => {
    await calciumService.initialize();

    // Initialize network status first
    NetworkStatusService.getInstance().initialize();

    // Conditionally initialize sync services
    if (FEATURES.SYNC_ENABLED) {
      syncService = SyncService.getInstance();
      await syncService.initialize();
      await SyncUrlHandler.checkForSyncUrl();
    }

    initializeTheme();
    initializeColorScheme();
    initializeEnvironment();

    if (typeof window !== "undefined") {
      const { useRegisterSW } = await import("virtual:pwa-register/svelte");

      const {
        needRefresh,
        offlineReady,
        updateServiceWorker
      } = useRegisterSW({
        onNeedRefresh() {
        },
        onOfflineReady() {
        }
      });

      // Subscribe to needRefresh and show notification
      // For Calcium Tracker, we can defer update notification if sync is active
      needRefresh.subscribe(value => {
        pwaUpdateAvailable.set(value);
        if (value) {
          showToast('Update available! Go to Settings to update.', 'info');
        }
      });

      // Store update function for use in Settings
      pwaUpdateFunction.set(updateServiceWorker);

      // Subscribe to offlineReady
      offlineReady.subscribe(value => {
        pwaOfflineReady.set(value);
        if (value) {
          showToast('App is ready to work offline!', 'success');
        }
      });
    }
    logBuildInfo();
  });

  $: pageTitle = (() => {
    switch ($page.route?.id) {
      case "/stats":
        return "Statistics";
      case "/data":
        return "Database";
      case "/report":
        return "Report";
      case "/settings":
        return "Settings";
      case "/guide":
        return "User Guide";
      default:
        return "Tracking";
    }
  })();

  $: showInfoIcon = $page.route?.id === "/data";
  let showDatabaseInfoDialog = false;
  let showAboutDialog = false;

  function openDatabaseInfoDialog() {
    showDatabaseInfoDialog = true;
  }

  function openAboutDialog() {
    showAboutDialog = true;
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem("calcium_theme") || "auto";
    applyTheme(savedTheme);

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDark.addEventListener("change", (e) => {
      const currentThemeSetting =
        localStorage.getItem("calcium_theme") || "auto";
      if (currentThemeSetting === "auto") {
        document.documentElement.setAttribute(
          "data-theme",
          e.matches ? "dark" : "light"
        );
      }
    });
  }

  function applyTheme(theme) {
    if (theme === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light"
      );
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }

  async function initializeColorScheme() {
    try {
      const settings = await calciumService.getSettings();
      const colorScheme = settings.colorScheme || (__APP_ENV__ === 'development' ? 'orange' : 'blue');
      applyColorScheme(colorScheme);
    } catch (error) {
      console.error("Error loading color scheme:", error);
      // Apply default based on environment
      applyColorScheme(__APP_ENV__ === 'development' ? 'orange' : 'blue');
    }
  }

  function applyColorScheme(scheme) {
    const colorMap = {
      blue: { primary: '#1976d2', dark: '#1565c0' },
      purple: { primary: '#7b1fa2', dark: '#6a1b9a' },
      green: { primary: '#388e3c', dark: '#2e7d32' },
      orange: { primary: '#f57c00', dark: '#ef6c00' },
      red: { primary: '#d32f2f', dark: '#c62828' },
      teal: { primary: '#00796b', dark: '#00695c' }
    };

    const colors = colorMap[scheme];
    if (colors) {
      document.documentElement.style.setProperty('--primary-color', colors.primary);
      document.documentElement.style.setProperty('--primary-color-dark', colors.dark);

      // Update alpha variants
      const rgb = hexToRgb(colors.primary);
      if (rgb) {
        document.documentElement.style.setProperty('--primary-alpha-5', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
        document.documentElement.style.setProperty('--primary-alpha-10', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      }

      // Update theme-color meta tag for Android system bar
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', colors.primary);
      }

      // Update success-color to match primary
      document.documentElement.style.setProperty('--success-color', colors.primary);
    }
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function initializeEnvironment() {
    // Apply environment attribute for dev color scheme
    document.documentElement.setAttribute("data-env", __APP_ENV__);
  }
</script>

<div class="app-container">
    <Header
      {pageTitle}
      {showInfoIcon}
      onInfoClick={openDatabaseInfoDialog}
      onAboutClick={openAboutDialog}
    />
    <main class="main-content">
      {#if $calciumState.isLoading}
        <div class="loading">
          <div class="loading-spinner">
            <div class="spinner-container">
              <span class="material-icons">hourglass_empty</span>
            </div>
          </div>
          <p>Loading your calcium data...</p>
        </div>
      {:else}
        <slot />
      {/if}
    </main>
    <Toast />
    <DatabaseInfoDialog bind:show={showDatabaseInfoDialog} />
    <AboutDialog bind:show={showAboutDialog} />
</div>

<style>
  /* ... styles remain the same ... */
  .app-container {
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--surface);
    position: relative;
    box-shadow: var(--shadow);
  }
  .main-content {
    flex: 1;
    overflow-y: auto;
    background-color: var(--background);
  }
  .loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
    text-align: center;
    color: var(--text-secondary);
  }
  .loading-spinner {
    margin-bottom: 1rem;
    animation: spin 2s linear infinite;
  }
  .spinner-container {
    position: relative;
    display: inline-block;
    width: 2rem;
    height: 2rem;
  }
  .spinner-container .material-icons {
    font-size: 2rem;
    color: var(--primary-color);
  }
  .spinner-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2rem;
    height: 2rem;
    border: 3px solid transparent;
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
  }
  .spinner-container .material-icons:not(:empty) {
    position: relative;
    z-index: 1;
    background: var(--background);
  }
  .loading p {
    font-size: 1rem;
    margin: 0;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @media (max-width: 480px) {
    .app-container {
      max-width: 100%;
      box-shadow: none;
    }
  }
</style>

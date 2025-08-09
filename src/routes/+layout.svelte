<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { calciumState, calciumService } from "$lib/stores/calcium";
  import Header from "$lib/components/Header.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import DatabaseInfoDialog from "$lib/components/DatabaseInfoDialog.svelte";
  import "../app.css";

  // Don't show loading spinner or header on pages that have their own layout
  $: isSubPage = false; // All pages now use the main layout with Header
  
  // Determine page title based on current route
  $: pageTitle = (() => {
    switch ($page.route?.id) {
      case '/stats': return 'Statistics';
      case '/data': return 'Database';
      case '/report': return 'Report';
      case '/settings': return 'Settings';
      case '/profile': return 'Profile';
      default: return 'Tracking';
    }
  })();

  // Determine whether to show info icon (only on Database page)
  $: showInfoIcon = $page.route?.id === '/data';

  // Database info dialog state - needs to be here for Header to access
  let showDatabaseInfoDialog = false;
  
  function openDatabaseInfoDialog() {
    showDatabaseInfoDialog = true;
  }

  // Theme detection and management
  function initializeTheme() {
    const savedTheme = localStorage.getItem('calcium_theme');
    const theme = savedTheme || 'auto';
    
    applyTheme(theme);
    
    // Only listen for system changes if theme is set to auto
    if (theme === 'auto') {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      prefersDark.addEventListener("change", (e) => {
        if (localStorage.getItem('calcium_theme') === 'auto' || !localStorage.getItem('calcium_theme')) {
          document.documentElement.setAttribute(
            "data-theme",
            e.matches ? "dark" : "light"
          );
        }
      });
    }
  }

  function applyTheme(theme) {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }

  onMount(async () => {
    initializeTheme();
    await calciumService.initialize(); // Initialize the shared service
    
    // Register service worker using virtual PWA register (like vanilla JS version)
    if (typeof window !== 'undefined') {
      const { registerSW } = await import('virtual:pwa-register');
      registerSW({
        onNeedRefresh() {
          // Could add update prompt here
        },
        onOfflineReady() {
          // Could show offline ready message
        },
      });
    }
  });
</script>

{#if isSubPage}
  <slot />
{:else}
  <div class="app-container">
    <Header {pageTitle} {showInfoIcon} onInfoClick={openDatabaseInfoDialog} />

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

    <!-- Toast notifications -->
    <Toast />

    <!-- Database Info Dialog -->
    <DatabaseInfoDialog bind:show={showDatabaseInfoDialog} />
  </div>
{/if}

<style>
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

  /* Fallback CSS spinner that shows before/during font load */
  .spinner-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2rem;
    height: 2rem;
    border: 3px solid transparent;
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    /* This will be hidden once the icon loads and takes space */
  }

  /* Hide the CSS spinner when Material Icons font is loaded */
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

  /* Mobile responsive */
  @media (max-width: 480px) {
    .app-container {
      max-width: 100%;
      box-shadow: none;
    }
  }
</style>

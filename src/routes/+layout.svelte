<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { calciumState, calciumService } from "$lib/stores/calcium";
  import Header from "$lib/components/Header.svelte";
  import Toast from "$lib/components/Toast.svelte";
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
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('Service worker registered successfully');
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  });
</script>

{#if isSubPage}
  <slot />
{:else}
  <div class="app-container">
    <Header {pageTitle} />

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

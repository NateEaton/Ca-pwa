<script>
  import { onMount } from "svelte";
  import { calciumState } from "$lib/stores/calcium";
  import { getCalciumService } from "$lib/services/CalciumServiceSingleton";
  import Header from "$lib/components/Header.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import "../app.css";

  // Theme detection and management
  function initializeTheme() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Set initial theme
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark.matches ? "dark" : "light"
    );
    
    // Listen for system theme changes
    prefersDark.addEventListener("change", (e) => {
      document.documentElement.setAttribute(
        "data-theme",
        e.matches ? "dark" : "light"
      );
    });
  }

  onMount(async () => {
    initializeTheme();
    await getCalciumService(); // This will create and initialize the singleton
  });
</script>

<div class="app-container">
  <Header />

  <main class="main-content">
    {#if $calciumState.isLoading}
      <div class="loading">
        <div class="loading-spinner">
          <span class="material-icons">hourglass_empty</span>
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

  .loading-spinner .material-icons {
    font-size: 2rem;
    color: var(--primary-color);
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

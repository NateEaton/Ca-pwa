<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { showToast } from "$lib/stores/calcium";
  import { syncIcon, syncState, setSyncStatus } from "$lib/stores/sync";
  import { SyncService } from "$lib/services/SyncService";
  import SyncSettingsModal from "$lib/components/SyncSettingsModal.svelte";

  export let pageTitle = "Tracking";
  export let showInfoIcon = false;
  export let onInfoClick = null;

  let showSlideoutMenu = false;
  const syncService = SyncService.getInstance();
  let showSyncModal = false;

  // Determine current page for highlighting
  $: currentPath = $page.route?.id || "/";

  function toggleMenu() {
    showSlideoutMenu = !showSlideoutMenu;
  }

  function closeMenu() {
    showSlideoutMenu = false;
  }

  function handleMenuItemClick(path) {
    closeMenu();

    // Show "Future feature" toast for Profile only
    if (path === "/profile") {
      showToast("Future feature", "info");
      return;
    }

    goto(base + path);
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && showSlideoutMenu) {
      event.preventDefault();
      closeMenu();
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeMenu();
    }
  }

  function handleInfoClick() {
    if (onInfoClick) {
      onInfoClick();
    }
  }

  function handleSyncIconClick() {
    // Open sync settings modal
    showSyncModal = true;
  }

  // Test function for Phase 1
  async function testSyncConnection() {
    await syncService.testConnection();
  }

  async function handleManualSync() {
    // This function now correctly handles both creating and performing a sync.
    if ($syncState.isEnabled) {
      // If sync is already set up, perform a bidirectional sync.
      try {
        await syncService.performBidirectionalSync();
      } catch (error) {
        console.log("A manual sync operation failed.");
      }
    } else {
      // If sync is not set up, create a new sync document.
      try {
        const docId = await syncService.createNewSyncDoc();
        showToast(`New sync created: ${docId.substring(0, 8)}...`, "success");
      } catch (error) {
        showToast("Failed to create sync", "error");
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<header class="header">
  <div class="header-content">
    <button class="hamburger-btn" on:click={toggleMenu}>
      <span class="material-icons">menu</span>
    </button>

    <h1 class="page-title">{pageTitle}</h1>

    <div class="header-right">
      {#if showInfoIcon}
        <button
          class="info-btn"
          on:click={handleInfoClick}
          aria-label="Show database information"
        >
          <span class="material-icons">info</span>
        </button>
      {/if}

      <!-- Move sync icon here -->
      <button
        class="sync-icon-btn"
        on:click={handleSyncIconClick}
        title="Sync Status: {$syncState.status}"
        aria-label="Sync status and settings"
      >
        <span
          class="material-icons {$syncIcon.spinning ? 'spinning' : ''}"
          style="color: {$syncIcon.color}"
        >
          {$syncIcon.icon}
        </span>
      </button>

      <button
        class="manual-sync-btn"
        on:click={handleManualSync}
        title={$syncState.isEnabled ? "Sync data" : "Create sync"}
        disabled={$syncState.status === "syncing"}
      >
        Sync
      </button>
    </div>
  </div>

  <!-- Slide-out Menu -->
  {#if showSlideoutMenu}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="menu-backdrop" on:click={handleBackdropClick}>
      <div class="slide-out-menu">
        <div class="menu-header">
          <h2>My Calcium</h2>
        </div>

        <div class="menu-main">
          <button
            class="menu-item"
            class:current={currentPath === "/"}
            on:click={() => handleMenuItemClick("/")}
          >
            <span class="material-icons">home</span>
            <span>Tracking</span>
          </button>
          <button
            class="menu-item"
            class:current={currentPath === "/stats"}
            on:click={() => handleMenuItemClick("/stats")}
          >
            <span class="material-icons">analytics</span>
            <span>Statistics</span>
          </button>
          <button
            class="menu-item"
            class:current={currentPath === "/data"}
            on:click={() => handleMenuItemClick("/data")}
          >
            <span class="material-icons">table_chart</span>
            <span>Database</span>
          </button>
          <button
            class="menu-item"
            class:current={currentPath === "/report"}
            on:click={() => handleMenuItemClick("/report")}
          >
            <span class="material-icons">assessment</span>
            <span>Report</span>
          </button>
        </div>

        <div class="menu-bottom">
          <div class="menu-divider"></div>
          <button
            class="menu-item"
            class:current={currentPath === "/settings"}
            on:click={() => handleMenuItemClick("/settings")}
          >
            <span class="material-icons">settings</span>
            <span>Settings</span>
          </button>
          <button
            class="menu-item"
            class:current={currentPath === "/profile"}
            on:click={() => handleMenuItemClick("/profile")}
          >
            <span class="material-icons">person</span>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Sync Settings Modal -->
  <SyncSettingsModal
    bind:show={showSyncModal}
    on:close={() => (showSyncModal = false)}
  />
</header>

<style>
  .header {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-lg);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow);
    min-height: var(--header-height);
  }

  .header-content {
    display: grid;
    grid-template-columns: var(--touch-target-min) 1fr var(--touch-target-min);
    align-items: center;
    max-width: 30rem; /* 480px equivalent */
    margin: 0 auto;
  }

  .hamburger-btn {
    background: none;
    border: none;
    color: white;
    padding: var(--spacing-sm);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 1;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .hamburger-btn:hover {
    background-color: var(--hover-overlay);
  }

  .page-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
    text-align: left;
    padding-left: var(--spacing-md);
    grid-column: 2;
  }

  .header-right {
    grid-column: 3;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .info-btn {
    background: none;
    border: none;
    color: white;
    padding: var(--spacing-sm);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .info-btn:hover {
    background-color: var(--hover-overlay);
  }

  .info-btn .material-icons {
    font-size: var(--icon-size-lg);
  }

  .menu-backdrop {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .slide-out-menu {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 80%;
    max-width: 320px;
    background: var(--surface);
    transform: translateX(0);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
  }

  .menu-header {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-lg);
    flex-shrink: 0;
    min-height: var(--header-height);
    display: flex;
    align-items: center;
  }

  .menu-header h2 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
  }

  .menu-main {
    flex: 1;
    padding: var(--spacing-lg) 0;
  }

  .menu-bottom {
    flex-shrink: 0;
    padding-bottom: max(var(--spacing-lg), env(safe-area-inset-bottom));
  }

  .menu-divider {
    height: 1px;
    background: var(--divider);
    margin: var(--spacing-md) var(--spacing-lg);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    width: 100%;
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid var(--divider);
    font-size: var(--font-size-base);
    text-align: left;
    min-height: var(--touch-target-min);
  }

  .menu-item:last-child {
    border-bottom: none;
  }

  .menu-item:hover {
    background-color: var(--surface-variant);
  }

  .menu-item.current {
    background-color: var(--primary-alpha-10);
    color: var(--primary-color);
  }

  .menu-item.current .material-icons {
    color: var(--primary-color);
  }

  .menu-item.current:hover {
    background-color: var(--primary-alpha-10);
    opacity: 0.8;
  }

  .hamburger-btn .material-icons {
    font-size: var(--icon-size-lg);
  }

  .menu-item .material-icons {
    font-size: var(--icon-size-md);
    color: var(--text-secondary);
  }

  .sync-icon-btn {
    background: none;
    border: none;
    color: white; /* Change from var(--text-primary) to white */
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .sync-icon-btn:hover:not(:disabled) {
    background-color: var(
      --hover-overlay
    ); /* Change from var(--surface-variant) */
  }

  .sync-icon-btn .material-icons {
    font-size: 20px;
    transition: color 0.2s;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .manual-sync-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    margin-left: 8px;
  }

  .manual-sync-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Mobile responsive */
  @media (max-width: 30rem) {
    /* 480px equivalent */
    .header {
      padding: var(--spacing-md) var(--spacing-lg);
    }

    .menu-backdrop {
      left: 0;
      transform: none;
      max-width: 100%;
    }

    .slide-out-menu {
      width: 85%;
      max-width: 300px;
      height: 100vh;
      height: 100dvh; /* Use dynamic viewport height on mobile */
    }

    .page-title {
      font-size: var(--font-size-lg);
      padding-left: var(--spacing-sm);
    }
  }
</style>

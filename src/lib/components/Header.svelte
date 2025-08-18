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
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { showToast } from "$lib/stores/calcium";
  import { syncIcon, syncState, setSyncStatus } from "$lib/stores/sync";
  import { SyncService } from "$lib/services/SyncService";

  export let pageTitle = "Tracking";
  export let showInfoIcon = false;
  export let onInfoClick = null;
  export let onAboutClick = () => {};

  let showSlideoutMenu = false;
  const syncService = SyncService.getInstance();

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

  async function triggerManualSync() {
    if (!$syncState.isEnabled || $syncState.status === "syncing") {
      // Do nothing if sync isn't set up or is already in progress
      return;
    }
    try {
      await syncService.performBidirectionalSync();
      // Success toast is removed for a silent experience
    } catch (error) {
      console.log("A manual sync operation failed.");
      // Error toast is handled by the service
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

      <button
        class="sync-icon-btn"
        on:click={triggerManualSync}
        title="Sync Status: {$syncState.status}"
        aria-label="Trigger manual sync"
        disabled={$syncState.status === "syncing"}
      >
        <span
          class="material-icons {$syncIcon.spinning ? 'spinning' : ''}"
          style="color: {$syncIcon.color}"
        >
          {$syncIcon.icon}
        </span>
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
          <div class="menu-header-content">
            <h2>My Calcium</h2>
          </div>
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
            class:current={currentPath === "/guide"}
            on:click={() => handleMenuItemClick("/guide")}
          >
            <span class="material-icons">help_outline</span>
            <span>User Guide</span>
          </button>
          <button
            class="menu-item"
            on:click={() => {
              closeMenu();
              onAboutClick();
            }}
          >
            <span class="material-icons">info_outline</span>
            <span>About</span>
          </button>
        </div>
      </div>
    </div>
  {/if}
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
  }

  .menu-header-content {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    max-width: 30rem;
    margin: 0 auto;
    min-height: var(--touch-target-min);
  }

  .menu-header h2 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
    text-align: left;
    grid-column: 1;
    min-height: var(--touch-target-min);
    display: flex;
    align-items: center;
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

  .sync-icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Mobile responsive */
  @media (max-width: 30rem) {
    /* 480px equivalent */
    .header {
      padding: var(--spacing-md) var(--spacing-lg);
    }

    .menu-header {
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

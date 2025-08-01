<script>
  import { goto } from '$app/navigation';
  import AboutDialog from './AboutDialog.svelte';
  import BackupModal from './BackupModal.svelte';
  import RestoreModal from './RestoreModal.svelte';
  
  let showMenu = false;
  let showAboutDialog = false;
  let showBackupModal = false;
  let showRestoreModal = false;

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function closeMenu() {
    showMenu = false;
  }

  function handleAboutClick() {
    closeMenu();
    showAboutDialog = true;
  }

  function handleBackupClick() {
    closeMenu();
    showBackupModal = true;
  }

  function handleRestoreClick() {
    closeMenu();
    showRestoreModal = true;
  }

  function handleReportClick() {
    closeMenu();
    goto('/report');
  }


  // Close menu when clicking outside
  function handleOutsideClick(event) {
    if (
      showMenu &&
      event.target &&
      !event.target.closest(".hamburger-menu") &&
      !event.target.closest(".hamburger-btn")
    ) {
      showMenu = false;
    }
  }
</script>

<svelte:window on:click={handleOutsideClick} />

<header class="header">
  <div class="header-content">
    <button class="hamburger-btn" on:click={toggleMenu}>
      <span class="material-icons">menu</span>
    </button>

    <h1 class="app-title">My Calcium</h1>

    <div class="header-spacer"></div>
  </div>

  {#if showMenu}
    <div class="hamburger-menu">
      <button class="menu-item" on:click={handleBackupClick}>
        <span class="material-icons">backup</span>
        <span>Backup Data</span>
      </button>
      <button class="menu-item" on:click={handleRestoreClick}>
        <span class="material-icons">restore</span>
        <span>Restore Data</span>
      </button>
      <button class="menu-item" on:click={handleReportClick}>
        <span class="material-icons">assessment</span>
        <span>Generate Report</span>
      </button>
      <button class="menu-item" on:click={handleAboutClick}>
        <span class="material-icons">info</span>
        <span>About</span>
      </button>
    </div>
  {/if}
</header>

<AboutDialog bind:show={showAboutDialog} />
<BackupModal bind:show={showBackupModal} />
<RestoreModal bind:show={showRestoreModal} />

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

  .app-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
    text-align: center;
    grid-column: 2;
  }

  .header-spacer {
    grid-column: 3;
  }

  .hamburger-menu {
    position: absolute;
    top: 100%;
    left: var(--spacing-lg);
    background: var(--surface);
    border-radius: var(--spacing-sm);
    box-shadow: var(--shadow-lg);
    min-width: 12.5rem; /* 200px converted */
    z-index: 200;
    overflow: hidden;
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

  .hamburger-btn .material-icons {
    font-size: var(--icon-size-lg);
  }

  .menu-item .material-icons {
    font-size: var(--icon-size-md);
    color: var(--text-secondary);
  }

  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
    .header {
      padding: var(--spacing-md) var(--spacing-lg);
    }

    .app-title {
      font-size: var(--font-size-lg); /* Slightly smaller on mobile */
    }

    .hamburger-menu {
      left: var(--spacing-sm);
      right: var(--spacing-sm);
    }
  }
</style>

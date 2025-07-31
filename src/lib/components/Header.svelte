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
      <button class="menu-item" on:click={closeMenu}>
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
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow);
  }

  .header-content {
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    align-items: center;
    max-width: 480px;
    margin: 0 auto;
  }

  .hamburger-btn {
    background: none;
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 1;
  }

  .hamburger-btn:hover {
    background-color: var(--hover-overlay);
  }

  .app-title {
    font-size: 1.25rem;
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
    left: 1rem;
    background: var(--surface);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    min-width: 200px;
    z-index: 200;
    overflow: hidden;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    width: 100%;
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid var(--divider);
    font-size: 1rem;
    text-align: left;
  }

  .menu-item:last-child {
    border-bottom: none;
  }

  .menu-item:hover {
    background-color: var(--surface-variant);
  }

  .hamburger-btn .material-icons {
    font-size: 24px;
  }

  .menu-item .material-icons {
    font-size: 20px;
    color: var(--text-secondary);
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .header {
      padding: 0.75rem 1rem;
    }

    .app-title {
      font-size: 1.1rem;
    }

    .hamburger-menu {
      left: 0.5rem;
      right: 0.5rem;
    }
  }
</style>

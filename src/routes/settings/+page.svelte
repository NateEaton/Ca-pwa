<script>
  import { calciumState, showToast, calciumService } from "$lib/stores/calcium";
  import { onMount } from "svelte";
  import AboutDialog from "$lib/components/AboutDialog.svelte";
  import BackupModal from "$lib/components/BackupModal.svelte";
  import RestoreModal from "$lib/components/RestoreModal.svelte";
  let dailyGoal = 1000;
  let selectedTheme = "auto";
  let isLoading = true;
  let showAboutDialog = false;
  let showBackupModal = false;
  let showRestoreModal = false;

  // Update UI when state changes (like after restore) but not during user input
  let isUserEditing = false;
  
  // Only update from state when user is not actively editing
  $: if (!isUserEditing && $calciumState.settings?.dailyGoal !== undefined) {
    dailyGoal = $calciumState.settings.dailyGoal;
  }

  onMount(async () => {
    try {
      const settings = await calciumService.getSettings();
      dailyGoal = settings.dailyGoal;
      selectedTheme = settings.theme || "auto";
    } catch (error) {
      console.error("Error loading settings:", error);
      showToast("Error loading settings", "error");
    } finally {
      isLoading = false;
    }
  });

  function startEditing() {
    isUserEditing = true;
  }

  async function saveDailyGoal() {
    isUserEditing = false; // Allow state updates again
    
    if (!calciumService) return;
    
    // Validate goal range
    if (dailyGoal < 100 || dailyGoal > 5000) {
      showToast("Goal must be between 100-5000mg", "error");
      return;
    }

    try {
      await calciumService.updateSettings({ dailyGoal });
      showToast("Daily goal updated", "success");
    } catch (error) {
      console.error("Error saving daily goal:", error);
      showToast("Error saving goal", "error");
    }
  }

  function applyTheme(theme) {
    if (theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }

  async function saveTheme() {
    if (!calciumService) return;

    try {
      await calciumService.updateSettings({ theme: selectedTheme });
      applyTheme(selectedTheme);
      showToast("Theme updated", "success");
    } catch (error) {
      console.error("Error saving theme:", error);
      showToast("Error saving theme", "error");
    }
  }

  function openAboutDialog() {
    showAboutDialog = true;
  }

  function openBackupModal() {
    showBackupModal = true;
  }

  function openRestoreModal() {
    showRestoreModal = true;
  }
</script>

<svelte:head>
  <title>Settings - My Calcium</title>
</svelte:head>

<div class="settings-container">
  {#if isLoading}
    <div class="loading">
      <div class="loading-spinner">
        <span class="material-icons">settings</span>
      </div>
      <p>Loading settings...</p>
    </div>
  {:else}
    <!-- Goal Settings Section -->
    <div class="settings-section">
      <h3 class="section-title">Goal</h3>
      
      <div class="setting-item inline">
        <div class="setting-info">
          <span class="setting-title">Daily Calcium Target</span>
          <span class="setting-subtitle">Your daily calcium goal in mg</span>
        </div>
        <div class="setting-control">
          <input 
            type="number" 
            bind:value={dailyGoal}
            min="100" 
            max="5000" 
            step="50"
            class="goal-input"
            on:focus={startEditing}
            on:input={startEditing}
            on:blur={saveDailyGoal}
          />
          <span class="input-suffix">mg</span>
        </div>
      </div>
    </div>

    <!-- Appearance Section -->
    <div class="settings-section">
      <h3 class="section-title">Appearance</h3>
      
      <div class="setting-item inline">
        <div class="setting-info">
          <span class="setting-title">Theme</span>
          <span class="setting-subtitle">Choose your preferred appearance</span>
        </div>
        <div class="setting-control">
          <select bind:value={selectedTheme} on:change={saveTheme} class="theme-select">
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Data Section -->
    <div class="settings-section">
      <h3 class="section-title">Data</h3>
      
      <button class="setting-nav-item" on:click={openBackupModal}>
        <span class="material-icons setting-icon">backup</span>
        <div class="setting-info">
          <span class="setting-title">Create Backup</span>
          <span class="setting-subtitle">Download your data</span>
        </div>
        <span class="material-icons nav-chevron">chevron_right</span>
      </button>
      
      <button class="setting-nav-item" on:click={openRestoreModal}>
        <span class="material-icons setting-icon">restore</span>
        <div class="setting-info">
          <span class="setting-title">Restore Data</span>
          <span class="setting-subtitle">Import from backup file</span>
        </div>
        <span class="material-icons nav-chevron">chevron_right</span>
      </button>
    </div>

    <!-- App Section -->
    <div class="settings-section">
      <h3 class="section-title">App</h3>
      
      <button class="setting-nav-item" on:click={openAboutDialog}>
        <span class="material-icons setting-icon">info</span>
        <div class="setting-info">
          <span class="setting-title">About</span>
          <span class="setting-subtitle">Version and app information</span>
        </div>
        <span class="material-icons nav-chevron">chevron_right</span>
      </button>
    </div>
  {/if}
</div>

<!-- Modal Components -->
<AboutDialog bind:show={showAboutDialog} />
<BackupModal bind:show={showBackupModal} />
<RestoreModal bind:show={showRestoreModal} />

<style>
  .settings-container {
    padding: var(--spacing-md);
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    min-height: calc(100vh - var(--header-height));
    background-color: var(--background);
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    text-align: center;
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
    color: var(--text-secondary);
    margin: 0;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .section-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    padding-bottom: var(--spacing-xs);
    border-bottom: 1px solid var(--divider);
  }

  /* Inline Setting Items */
  .setting-item.inline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background: var(--surface-variant);
    border-radius: var(--spacing-sm);
    min-height: var(--touch-target-min);
  }

  .setting-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
  }

  .setting-title {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--text-primary);
  }

  .setting-subtitle {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .setting-control {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  /* Navigation Setting Items */
  .setting-nav-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--surface-variant);
    border: none;
    border-radius: var(--spacing-sm);
    cursor: pointer;
    transition: background-color 0.2s;
    min-height: var(--touch-target-min);
    width: 100%;
    text-align: left;
  }

  .setting-nav-item:hover {
    background: var(--hover-overlay);
  }

  .setting-icon {
    color: var(--text-secondary);
    font-size: var(--icon-size-md);
    flex-shrink: 0;
  }

  .nav-chevron {
    color: var(--text-hint);
    font-size: var(--icon-size-sm);
    margin-left: auto;
    flex-shrink: 0;
  }

  /* Form Controls */
  .goal-input {
    width: 5rem;
    padding: var(--spacing-sm);
    border: 1px solid var(--divider);
    border-radius: var(--spacing-xs);
    background: var(--surface);
    color: var(--text-primary);
    font-size: var(--font-size-base);
    text-align: center;
  }

  .goal-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-alpha-10);
  }

  .input-suffix {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .theme-select {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: 1px solid var(--divider);
    border-radius: var(--spacing-xs);
    background: var(--surface);
    color: var(--text-primary);
    font-size: var(--font-size-base);
    min-width: 6rem;
    cursor: pointer;
  }

  .theme-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-alpha-10);
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .settings-container {
      padding: var(--spacing-sm);
      gap: var(--spacing-lg);
    }

    .setting-item.inline {
      /* Keep items on same line on mobile */
      flex-direction: row;
      align-items: center;
      gap: var(--spacing-md);
    }

    .setting-info {
      /* Allow text to wrap and shrink */
      flex: 1;
      min-width: 0;
    }

    .setting-control {
      /* Keep controls aligned to the right */
      justify-content: flex-end;
      flex-shrink: 0;
    }

    .goal-input {
      width: 5rem;
      font-size: var(--font-size-sm);
    }

    .theme-select {
      min-width: 5rem;
      font-size: var(--font-size-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
    }

    .input-suffix {
      font-size: var(--font-size-xs);
    }
  }
</style>
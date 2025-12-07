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
  import { calciumState, showToast, calciumService } from "$lib/stores/calcium";
  import { pwaUpdateAvailable, pwaUpdateFunction } from "$lib/stores/pwa";
  import { onMount } from "svelte";
  import { FEATURES } from "$lib/utils/featureFlags";
  import BackupModal from "$lib/components/BackupModal.svelte";
  import ExportModal from "$lib/components/ExportModal.svelte";
  import RestoreModal from "$lib/components/RestoreModal.svelte";
  import SyncSettingsModal from "$lib/components/SyncSettingsModal.svelte";

  let dailyGoal = 1000;
  let selectedTheme = "auto";
  let selectedColorScheme = "blue";
  let isLoading = true;
  let showBackupModal = false;
  let showExportModal = false;
  let showRestoreModal = false;
  let showSyncModal = false;

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
      selectedColorScheme = settings.colorScheme || "blue";

      // Apply the color scheme on mount
      applyColorScheme(selectedColorScheme);
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

  // Apply color scheme to document
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
        document.documentElement.style.setProperty('--error-alpha-10', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      }

      // Update theme-color meta tag for Android system bar
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', colors.primary);
      }

      // Also update success-color to match primary
      document.documentElement.style.setProperty('--success-color', colors.primary);
    }
  }

  // Helper function to convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Update color scheme setting
  async function updateColorScheme(newScheme) {
    if (!calciumService) return;

    try {
      await calciumService.updateSettings({ colorScheme: newScheme });
      selectedColorScheme = newScheme;

      // Apply the color scheme immediately
      applyColorScheme(newScheme);

      showToast("Color scheme updated", "success");
    } catch (error) {
      console.error("Error updating color scheme:", error);
      showToast("Error saving color scheme", "error");
    }
  }

  function openBackupModal() {
    showBackupModal = true;
  }

  function openExportModal() {
    showExportModal = true;
  }

  function openRestoreModal() {
    showRestoreModal = true;
  }

  function openSyncModal() {
    showSyncModal = true;
  }

  // PWA Update handling
  async function checkForUpdate() {
    try {
      if ('serviceWorker' in navigator) {
        showToast('Checking for updates...', 'info');
        const registration = await navigator.serviceWorker.getRegistration();
        await registration?.update();

        // If no update is found after a short delay, notify user
        setTimeout(() => {
          if (!$pwaUpdateAvailable) {
            showToast('You\'re running the latest version', 'success');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Update check failed:', error);
      showToast('Failed to check for updates', 'error');
    }
  }

  async function installUpdate() {
    const updateFn = $pwaUpdateFunction;
    if (updateFn) {
      try {
        await updateFn();
        // Page will reload automatically after update
      } catch (error) {
        console.error('Update installation failed:', error);
        showToast('Failed to install update', 'error');
      }
    }
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
        <span class="material-icons setting-icon">flag</span>
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
        <span class="material-icons setting-icon">brightness_6</span>
        <div class="setting-info">
          <span class="setting-title">Theme</span>
          <span class="setting-subtitle">Light, dark, or auto mode</span>
        </div>
        <div class="setting-control">
          <select
            bind:value={selectedTheme}
            on:change={saveTheme}
            class="theme-select"
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div class="setting-item inline">
        <span class="material-icons setting-icon">palette</span>
        <div class="setting-info">
          <span class="setting-title">Color</span>
          <span class="setting-subtitle">Choose your accent color</span>
        </div>
        <div class="setting-control">
          <div class="color-scheme-selector">
            <button
              class="color-swatch"
              class:active={selectedColorScheme === 'blue'}
              style="--swatch-color: #1976d2;"
              on:click={() => updateColorScheme('blue')}
              aria-label="Blue color scheme"
            >
              {#if selectedColorScheme === 'blue'}
                <span class="material-icons">check</span>
              {/if}
            </button>
            <button
              class="color-swatch"
              class:active={selectedColorScheme === 'purple'}
              style="--swatch-color: #7b1fa2;"
              on:click={() => updateColorScheme('purple')}
              aria-label="Purple color scheme"
            >
              {#if selectedColorScheme === 'purple'}
                <span class="material-icons">check</span>
              {/if}
            </button>
            <button
              class="color-swatch"
              class:active={selectedColorScheme === 'green'}
              style="--swatch-color: #388e3c;"
              on:click={() => updateColorScheme('green')}
              aria-label="Green color scheme"
            >
              {#if selectedColorScheme === 'green'}
                <span class="material-icons">check</span>
              {/if}
            </button>
            <button
              class="color-swatch"
              class:active={selectedColorScheme === 'orange'}
              style="--swatch-color: #f57c00;"
              on:click={() => updateColorScheme('orange')}
              aria-label="Orange color scheme"
            >
              {#if selectedColorScheme === 'orange'}
                <span class="material-icons">check</span>
              {/if}
            </button>
            <button
              class="color-swatch"
              class:active={selectedColorScheme === 'red'}
              style="--swatch-color: #d32f2f;"
              on:click={() => updateColorScheme('red')}
              aria-label="Red color scheme"
            >
              {#if selectedColorScheme === 'red'}
                <span class="material-icons">check</span>
              {/if}
            </button>
            <button
              class="color-swatch"
              class:active={selectedColorScheme === 'teal'}
              style="--swatch-color: #00796b;"
              on:click={() => updateColorScheme('teal')}
              aria-label="Teal color scheme"
            >
              {#if selectedColorScheme === 'teal'}
                <span class="material-icons">check</span>
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Section -->
    <div class="settings-section">
      <h3 class="section-title">Data</h3>

      {#if FEATURES.SYNC_ENABLED}
        <button class="setting-nav-item" on:click={openSyncModal}>
          <span class="material-icons setting-icon">sync</span>
          <div class="setting-info">
            <span class="setting-title">Sync</span>
            <span class="setting-subtitle"
              >Manage device pairing and sync status</span
            >
          </div>
          <span class="material-icons nav-chevron">chevron_right</span>
        </button>
      {/if}

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

      <button class="setting-nav-item" on:click={openExportModal}>
        <span class="material-icons setting-icon">file_download</span>
        <div class="setting-info">
          <span class="setting-title">Export to CSV</span>
          <span class="setting-subtitle">Download entries as spreadsheet</span>
        </div>
        <span class="material-icons nav-chevron">chevron_right</span>
      </button>
    </div>

    <!-- App Section -->
    <div class="settings-section">
      <h3 class="section-title">App</h3>

      <button
        class="setting-nav-item {$pwaUpdateAvailable ? 'update-available' : ''}"
        on:click={$pwaUpdateAvailable ? installUpdate : checkForUpdate}
      >
        <span class="material-icons setting-icon">{$pwaUpdateAvailable ? 'system_update' : 'refresh'}</span>
        <div class="setting-info">
          <span class="setting-title">{$pwaUpdateAvailable ? 'Update App' : 'Check for Updates'}</span>
          <span class="setting-subtitle">
            {#if $pwaUpdateAvailable}
              New version available - tap to update
            {:else}
              Manually check for app updates
            {/if}
          </span>
        </div>
        <span class="material-icons nav-chevron">{$pwaUpdateAvailable ? 'download' : 'chevron_right'}</span>
      </button>
    </div>
  {/if}
</div>

<!-- Modal Components -->
<BackupModal bind:show={showBackupModal} />
<ExportModal bind:show={showExportModal} />
<RestoreModal bind:show={showRestoreModal} />
{#if FEATURES.SYNC_ENABLED}
  <SyncSettingsModal bind:show={showSyncModal} />
{/if}

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
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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
    gap: var(--spacing-sm);
  }

  .setting-item.inline .setting-icon {
    margin-right: var(--spacing-sm);
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

  .setting-nav-item.update-available {
    background: var(--primary-alpha-10);
    border: 1px solid var(--primary-color);
  }

  .setting-nav-item.update-available:hover {
    background: var(--primary-alpha-20);
  }

  .setting-nav-item.update-available .setting-icon {
    color: var(--primary-color);
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

  /* Color Scheme Selector */
  .color-scheme-selector {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .color-swatch {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid var(--divider);
    background-color: var(--swatch-color);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .color-swatch:hover {
    transform: scale(1.1);
    border-color: var(--text-secondary);
  }

  .color-swatch.active {
    border-color: var(--swatch-color);
    border-width: 3px;
    box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--swatch-color);
  }

  .color-swatch .material-icons {
    font-size: 1.25rem;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .color-swatch:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--text-secondary);
  }

  .color-swatch.active:focus {
    box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--swatch-color), 0 0 0 6px var(--text-secondary);
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

    /* Smaller color swatches on mobile */
    .color-swatch {
      width: 2rem;
      height: 2rem;
    }

    .color-swatch .material-icons {
      font-size: 1rem;
    }
  }
</style>

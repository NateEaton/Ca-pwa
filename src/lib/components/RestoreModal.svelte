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
  import { showToast, calciumService } from "$lib/stores/calcium";
  import { onDestroy } from "svelte";
  import { syncState } from "$lib/stores/sync";
  import { SyncService } from "$lib/services/SyncService";

  /** Whether the restore modal is visible */
  export let show = false;

  let isRestoring = false;
  let restoreError = "";
  let fileInput;
  let showPreview = false;
  let backupData = null;
  let previewStats = "";
  let restoreSyncOption = "disconnect"; // Default to the safest option

  // Prevent body scroll when modal is open (mobile fix)
  $: if (typeof window !== "undefined") {
    if (show) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        const scrollPosition = parseInt(scrollY || "0") * -1;
        window.scrollTo(0, scrollPosition);
      }
    }
  }

  // Cleanup on unmount
  onDestroy(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    }
  });

  function handleClose() {
    if (isRestoring) {
      return;
    }
    resetModalState();
  }

  function resetModalState() {
    show = false;
    restoreError = "";
    showPreview = false;
    backupData = null;
    previewStats = "";
    isRestoring = false;

    if (fileInput) {
      fileInput.value = "";
    }
  }

  function handleBackdropClick(event) {
    // Only close if clicking the backdrop itself
    if (event.target === event.currentTarget && !isRestoring) {
      handleClose();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && show && !isRestoring) {
      event.preventDefault();
      handleClose();
    }
  }

  function triggerFileSelect() {
    if (isRestoring) {
      return;
    }

    // Add small delay for mobile to ensure modal state is stable
    setTimeout(() => {
      fileInput?.click();
    }, 100);
  }

  function calculateStats(backupData) {
    const dates = Object.keys(backupData.journalEntries || {});
    const totalDays = dates.length;
    const totalFoodEntries = Object.values(
      backupData.journalEntries || {}
    ).reduce((sum, dayFoods) => sum + dayFoods.length, 0);
    const customFoodsCount = (backupData.customFoods || []).length;
    const favoritesCount = (backupData.favorites || []).length;
    const servingPreferencesCount = (backupData.servingPreferences || []).length;
    const hiddenFoodsCount = (backupData.hiddenFoods || []).length;
    const createdAt = backupData.metadata?.createdAt
      ? new Date(backupData.metadata.createdAt).toLocaleDateString()
      : "Unknown";

    let dateRange = "No journal entries";
    if (dates.length > 0) {
      dates.sort();
      const firstDate = new Date(dates[0]).toLocaleDateString();
      const lastDate = new Date(dates[dates.length - 1]).toLocaleDateString();
      dateRange =
        dates.length === 1 ? `${firstDate}` : `${firstDate} to ${lastDate}`;
    }

    return `
• Created: ${createdAt}<br>
• ${totalDays} journal days with ${totalFoodEntries} food entries<br>
• ${customFoodsCount} custom food definitions<br>
• ${favoritesCount} favorite foods<br>
• ${servingPreferencesCount} serving preferences<br>
• ${hiddenFoodsCount} hidden foods<br>
• Date range: ${dateRange}`;
  }

  async function handleFileSelect(event) {
    // Small delay to handle mobile file picker return properly
    await new Promise((resolve) => setTimeout(resolve, 50));

    const file = event.target?.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/json") {
      restoreError = "Please select a valid JSON backup file";
      return;
    }

    restoreError = "";

    try {
      const fileContent = await file.text();
      const parsedBackupData = JSON.parse(fileContent);

      if (!parsedBackupData.metadata || !parsedBackupData.journalEntries) {
        throw new Error("Invalid backup file format");
      }

      backupData = parsedBackupData;
      previewStats = calculateStats(backupData);
      showPreview = true;
    } catch (error) {
      console.error("Error processing backup file:", error);
      restoreError =
        error instanceof Error ? error.message : "Failed to read backup file";
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  }

  function handleBackToFileSelect() {
    showPreview = false;
    backupData = null;
    previewStats = "";
    restoreError = "";
  }

  async function handleConfirmRestore() {
    if (!backupData || isRestoring) return;

    isRestoring = true;
    restoreError = "";
    const syncService = SyncService.getInstance();

    try {
      const preserveSync =
        $syncState.isEnabled && restoreSyncOption === "replace";

      await calciumService.restoreFromBackup(backupData, { preserveSync });

      if (preserveSync) {
        showToast("Local data restored. Updating cloud...", "info");
        await syncService.pushToCloud();
        showToast("Synced devices updated successfully!", "success");
      } else {
        if ($syncState.isEnabled) {
          await syncService.disconnectSync();
        }
        showToast("Data restored successfully!", "success");
      }

      isRestoring = false;
      handleClose();
    } catch (error) {
      console.error("Restore process failed:", error);
      const errorMessage = `Restore failed: ${error instanceof Error ? error.message : "Unknown error"}`;
      showToast(errorMessage, "error");

      isRestoring = false;
      handleClose();
    }
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="modal-backdrop"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="button"
    tabindex="0"
  >
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      class="modal-container"
      role="dialog"
      aria-labelledby="restore-title"
      aria-modal="true"
      on:click|stopPropagation
      on:keydown|stopPropagation
    >
      <!-- Modal Header -->
      <div class="modal-header">
        <button
          class="back-btn"
          on:click={handleClose}
          aria-label="Close restore dialog"
          disabled={isRestoring}
          type="button"
        >
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 id="restore-title" class="modal-title">
          {showPreview ? "Confirm Restore" : "Restore Backup"}
        </h2>
        <div class="header-spacer"></div>
      </div>

      <!-- Modal Content -->
      <div class="modal-content">
        <div class="restore-content">
          {#if !showPreview}
            <!-- Step 1: File Selection -->
            <div class="restore-info">
              <div class="info-icon">
                <span class="material-icons">restore</span>
              </div>
              <div class="info-text">
                <h3>Select Backup File</h3>
                <p>
                  Choose a backup file to restore. This will replace all current
                  data.
                </p>
              </div>
            </div>

            <div class="warning-box">
              <span class="material-icons">warning</span>
              <div class="warning-content">
                <strong>Warning:</strong> This action will permanently replace all
                your current tracking data, custom foods, and preferences with the
                backup data. This cannot be undone.
              </div>
            </div>

            {#if restoreError}
              <div class="error-message">
                <span class="material-icons">error</span>
                <span>{restoreError}</span>
              </div>
            {/if}

            <div class="restore-actions">
              <input
                bind:this={fileInput}
                type="file"
                accept=".json"
                on:change={handleFileSelect}
                style="display: none;"
                aria-hidden="true"
              />

              <button
                class="restore-btn primary"
                on:click={triggerFileSelect}
                type="button"
              >
                <span class="material-icons">upload_file</span>
                Select Backup File
              </button>
            </div>
          {:else}
            <!-- Step 2: Preview and Confirmation -->
            <div class="restore-info">
              <div class="info-icon">
                <span class="material-icons">preview</span>
              </div>
              <div class="info-text">
                <h3>Review & Confirm</h3>
                <p>Check the backup contents below before proceeding.</p>
              </div>
            </div>

            <div class="backup-preview">
              <h4>What Will Be Restored:</h4>
              <div class="preview-stats">{@html previewStats}</div>
            </div>

            {#if $syncState.isEnabled}
              <div class="sync-options-section">
                <h4>Sync Connection Detected</h4>
                <p class="section-subtitle">
                  This restore will affect your synced devices.
                </p>
                <div class="radio-group">
                  <label class="radio-option warning">
                    <input
                      type="radio"
                      bind:group={restoreSyncOption}
                      value="disconnect"
                    />
                    <div class="radio-content">
                      <span class="radio-title"
                        >Disconnect and Restore Here Only</span
                      >
                      <span class="radio-desc"
                        >This is the safest option. This device will be removed
                        from the sync group. Other devices will be unaffected.</span
                      >
                    </div>
                  </label>
                  <label class="radio-option">
                    <input
                      type="radio"
                      bind:group={restoreSyncOption}
                      value="replace"
                    />
                    <div class="radio-content">
                      <span class="radio-title"
                        >Replace Data on All Devices</span
                      >
                      <span class="radio-desc"
                        >This backup will become the new master data for all
                        your synced devices. Use this to populate all devices
                        with this backup's data.</span
                      >
                    </div>
                  </label>
                </div>
              </div>
            {/if}

            <div class="warning-box">
              <span class="material-icons">warning</span>
              <div class="warning-content">
                <strong>Final Warning:</strong> This will permanently replace all
                your current data. Make sure you have a recent backup if needed.
              </div>
            </div>

            {#if restoreError}
              <div class="error-message">
                <span class="material-icons">error</span>
                <span>{restoreError}</span>
              </div>
            {/if}

            <div class="restore-actions two-button">
              <button
                class="restore-btn secondary"
                on:click={handleBackToFileSelect}
                disabled={isRestoring}
                type="button"
              >
                <span class="material-icons">arrow_back</span>
                Back to File Select
              </button>

              <button
                class="restore-btn primary"
                on:click={handleConfirmRestore}
                disabled={isRestoring}
                type="button"
              >
                {#if isRestoring}
                  <span class="material-icons spinning">sync</span>
                  Restoring...
                {:else}
                  <span class="material-icons">restore</span>
                  Restore Data
                {/if}
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:window on:keydown={handleKeydown} />

<style>
  /* Modal backdrop - full screen */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--modal-backdrop);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Prevent scrolling on iOS */
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  /* Modal container - full app width */
  .modal-container {
    width: 100%;
    height: 100%;
    max-width: 480px; /* Match app container */
    background-color: var(--surface);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* Prevent touch callouts on iOS */
    -webkit-touch-callout: none;
  }

  /* Desktop: take full app container space like mobile */
  @media (min-width: 481px) {
    .modal-container {
      width: 100%;
      height: 100%;
      max-width: 480px; /* Match app container */
      border-radius: 0; /* No rounded corners to match app */
      box-shadow: none; /* Remove shadow to match app */
    }
  }

  /* Modal header */
  .modal-header {
    display: grid;
    grid-template-columns: 48px 1fr 48px;
    align-items: center;
    padding: var(--spacing-lg);
    background-color: var(--primary-color);
    color: white;
    min-height: 64px;
    flex-shrink: 0;
  }

  .back-btn {
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
    width: 40px;
    height: 40px;
    /* Remove tap highlight */
    -webkit-tap-highlight-color: transparent;
  }

  /* Use active state instead of hover for mobile */
  .back-btn:active:not(:disabled) {
    background-color: var(--hover-overlay);
  }

  /* Desktop hover */
  @media (hover: hover) {
    .back-btn:hover:not(:disabled) {
      background-color: var(--hover-overlay);
    }
  }

  .back-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
    text-align: left;
  }

  .header-spacer {
    width: 48px;
  }

  /* Modal content */
  .modal-content {
    flex: 1;
    padding: var(--spacing-xl);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    /* Add bottom padding for iOS safe area */
    padding-bottom: calc(var(--spacing-xl) + env(safe-area-inset-bottom, 0));
  }

  .restore-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    color: var(--text-primary);
  }

  .restore-info {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--primary-alpha-5);
    border-radius: 8px;
    border: 1px solid var(--primary-alpha-10);
  }

  .info-icon {
    flex-shrink: 0;
  }

  .info-icon .material-icons {
    font-size: 24px;
    color: var(--primary-color);
  }

  .info-text h3 {
    color: var(--text-primary);
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-lg);
  }

  .info-text p {
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  .warning-box {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: rgba(255, 152, 0, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 152, 0, 0.2);
  }

  .warning-box .material-icons {
    font-size: 24px;
    color: #ff9800;
    flex-shrink: 0;
  }

  .warning-content {
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .warning-content strong {
    color: var(--text-primary);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: rgba(244, 67, 54, 0.1);
    color: #f44336;
    border-radius: 8px;
    border: 1px solid rgba(244, 67, 54, 0.2);
  }

  .error-message .material-icons {
    font-size: 20px;
  }

  .backup-preview {
    background-color: var(--surface-variant);
    border-radius: 8px;
    padding: var(--spacing-lg);
    border: 1px solid var(--divider);
  }

  .backup-preview h4 {
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }

  .preview-stats {
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .restore-actions {
    text-align: center;
  }

  .restore-actions.two-button {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .restore-btn {
    border: none;
    border-radius: 8px;
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    transition: background-color 0.2s;
    min-height: var(--touch-target-min);
    /* Remove iOS button styling */
    -webkit-appearance: none;
    appearance: none;
    /* Remove tap highlight */
    -webkit-tap-highlight-color: transparent;
  }

  .restore-btn.primary {
    background-color: #d32f2f;
    color: white;
  }

  .restore-btn.primary:active:not(:disabled) {
    background-color: #b71c1c;
  }

  .restore-btn.secondary {
    background-color: var(--surface-variant);
    color: var(--text-primary);
    border: 1px solid var(--divider);
  }

  .restore-btn.secondary:active:not(:disabled) {
    background-color: var(--divider);
  }

  /* Desktop hover states */
  @media (hover: hover) {
    .restore-btn.primary:hover:not(:disabled) {
      background-color: #b71c1c;
    }

    .restore-btn.secondary:hover:not(:disabled) {
      background-color: var(--divider);
    }
  }

  .restore-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .restore-btn .material-icons {
    font-size: 20px;
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

  /* Sync options styles */
  .sync-options-section {
    background-color: var(--surface-variant);
    border-radius: 8px;
    padding: var(--spacing-lg);
    border: 1px solid var(--divider);
  }
  .sync-options-section h4 {
    color: var(--text-primary);
    margin: 0 0 var(--spacing-xs) 0;
  }
  .section-subtitle {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin: 0 0 var(--spacing-md) 0;
  }
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  .radio-option {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--surface);
    border: 2px solid var(--divider);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .radio-option:hover {
    border-color: var(--primary-color);
  }
  .radio-option.warning:has(input:checked) {
    border-color: var(--warning-color);
    background-color: rgba(255, 152, 0, 0.05);
  }
  .radio-option:has(input:checked) {
    border-color: var(--primary-color);
    background-color: var(--primary-alpha-5);
  }
  .radio-option input[type="radio"] {
    margin-top: 4px;
    flex-shrink: 0;
    accent-color: var(--primary-color);
  }
  .radio-content {
    display: flex;
    flex-direction: column;
  }
  .radio-title {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }
  .radio-desc {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    line-height: 1.4;
  }

  /* Mobile-specific adjustments */
  @media (max-width: 480px) {
    .modal-container {
      height: 100vh;
      height: 100dvh; /* Dynamic viewport height for mobile browsers */
      border-radius: 0;
    }

    .modal-content {
      padding: var(--spacing-lg);
    }

    .restore-info {
      padding: var(--spacing-md);
      gap: var(--spacing-md);
    }

    .warning-box {
      padding: var(--spacing-md);
      gap: var(--spacing-sm);
    }

    .backup-preview {
      padding: var(--spacing-md);
    }
  }
</style>

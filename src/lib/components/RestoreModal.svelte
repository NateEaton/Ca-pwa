<script>
  import { showToast, calciumService } from "$lib/stores/calcium";
  import { onDestroy } from "svelte";

  export let show = false;

  let isRestoring = false;
  let restoreError = "";
  let fileInput;
  let showPreview = false;
  let backupData = null;
  let previewStats = "";

  // Prevent body scroll when modal is open (mobile fix)
  $: if (typeof window !== "undefined") {
    console.log("🔄 RestoreModal show state changed:", show);
    if (show) {
      console.log("📱 Modal opening - applying body scroll lock");
      // Store current scroll position
      const scrollY = window.scrollY;
      console.log("   - Current scroll position:", scrollY);
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      console.log("   - Body styles applied for modal");
    } else {
      console.log("📱 Modal closing - restoring body scroll");
      // Restore scroll position
      const scrollY = document.body.style.top;
      console.log("   - Restoring scroll position:", scrollY);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        const scrollPosition = parseInt(scrollY || "0") * -1;
        console.log("   - Scrolling to position:", scrollPosition);
        window.scrollTo(0, scrollPosition);
      }
      console.log("   - Body styles restored");
    }
  }

  // Cleanup on unmount
  onDestroy(() => {
    console.log("💀 RestoreModal onDestroy called - cleaning up body styles");
    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      console.log("   - Body styles cleaned up on destroy");
    }
  });

  function handleClose() {
    console.log("🚪 handleClose() called");
    console.log("   - isRestoring:", isRestoring);
    console.log("   - show:", show);
    if (isRestoring) {
      console.log("❌ handleClose() blocked - currently restoring");
      return;
    }
    console.log("✅ Proceeding with modal close");
    resetModalState();
  }

  function resetModalState() {
    console.log("🧹 resetModalState() called");
    console.log("   - Current show value:", show);
    show = false;
    console.log("   - Set show = false");
    
    restoreError = "";
    console.log("   - Cleared restoreError");
    
    showPreview = false;
    console.log("   - Set showPreview = false");
    
    backupData = null;
    console.log("   - Cleared backupData");
    
    previewStats = "";
    console.log("   - Cleared previewStats");
    
    isRestoring = false;
    console.log("   - Set isRestoring = false");
    
    if (fileInput) {
      fileInput.value = "";
      console.log("   - Cleared file input");
    }
    console.log("✅ resetModalState() completed");
  }

  function handleBackdropClick(event) {
    console.log("🎯 handleBackdropClick triggered");
    console.log("   - event.target:", event.target.className || event.target.tagName);
    console.log("   - event.currentTarget:", event.currentTarget.className || event.currentTarget.tagName);
    console.log("   - target === currentTarget:", event.target === event.currentTarget);
    console.log("   - isRestoring:", isRestoring);
    
    // Only close if clicking the backdrop itself
    if (event.target === event.currentTarget && !isRestoring) {
      console.log("✅ Valid backdrop click - closing modal");
      handleClose();
    } else {
      console.log("❌ Invalid backdrop click - ignoring");
    }
  }

  function handleKeydown(event) {
    console.log("⌨️  handleKeydown triggered:", event.key);
    console.log("   - show:", show);
    console.log("   - isRestoring:", isRestoring);
    
    if (event.key === "Escape" && show && !isRestoring) {
      console.log("✅ Valid Escape key press - closing modal");
      event.preventDefault();
      handleClose();
    } else {
      console.log("❌ Escape key ignored due to conditions");
    }
  }

  function triggerFileSelect() {
    console.log("📁 triggerFileSelect() called");
    console.log("   - isRestoring:", isRestoring);
    
    if (isRestoring) {
      console.log("❌ File select blocked - currently restoring");
      return;
    }

    console.log("⏳ Adding 100ms delay for mobile stability");
    // Add small delay for mobile to ensure modal state is stable
    setTimeout(() => {
      console.log("📂 Triggering file input click");
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
• Date range: ${dateRange}`;
  }

  async function handleFileSelect(event) {
    console.log("📄 handleFileSelect() called");
    console.log("   - event.target:", event.target);
    console.log("   - files length:", event.target?.files?.length || 0);
    
    // Small delay to handle mobile file picker return properly
    console.log("⏳ Adding 50ms delay for mobile file picker stability");
    await new Promise((resolve) => setTimeout(resolve, 50));

    const file = event.target?.files?.[0];
    console.log("📂 Selected file:", file?.name || "none");
    
    if (!file) {
      console.log("❌ No file selected");
      return;
    }

    console.log("📋 File details:");
    console.log("   - name:", file.name);
    console.log("   - type:", file.type);
    console.log("   - size:", file.size);

    if (file.type !== "application/json") {
      console.log("❌ Invalid file type:", file.type);
      restoreError = "Please select a valid JSON backup file";
      return;
    }

    console.log("✅ File type valid - processing file");
    restoreError = "";

    try {
      console.log("📖 Reading file content...");
      const fileContent = await file.text();
      console.log("   - File content length:", fileContent.length);
      
      console.log("🔍 Parsing JSON...");
      const parsedBackupData = JSON.parse(fileContent);
      console.log("   - Parsed backup data keys:", Object.keys(parsedBackupData));

      if (!parsedBackupData.metadata || !parsedBackupData.journalEntries) {
        console.log("❌ Invalid backup structure - missing required fields");
        throw new Error("Invalid backup file format");
      }

      console.log("✅ Backup file structure valid");
      backupData = parsedBackupData;
      
      console.log("📊 Calculating preview statistics...");
      previewStats = calculateStats(backupData);
      console.log("   - Preview stats generated");
      
      console.log("🎯 Setting showPreview = true");
      showPreview = true;
      
    } catch (error) {
      console.error("❌ Error processing backup file:", error);
      restoreError =
        error instanceof Error ? error.message : "Failed to read backup file";
    } finally {
      if (event.target) {
        console.log("🧹 Clearing file input value");
        event.target.value = "";
      }
    }
  }

  function handleBackToFileSelect() {
    console.log("⬅️  handleBackToFileSelect() called");
    console.log("   - Returning to file selection from preview");
    
    showPreview = false;
    console.log("   - Set showPreview = false");
    
    backupData = null;
    console.log("   - Cleared backupData");
    
    previewStats = "";
    console.log("   - Cleared previewStats");
    
    restoreError = "";
    console.log("   - Cleared restoreError");
    
    console.log("✅ Back to file select completed");
  }

  async function handleConfirmRestore() {
    console.log("🔄 handleConfirmRestore() called");
    console.log("   - backupData exists:", !!backupData);
    console.log("   - isRestoring:", isRestoring);
    
    if (!backupData || isRestoring) {
      console.log("❌ Restore blocked - no backup data or already restoring");
      return;
    }

    console.log("🚀 Starting restore process");
    isRestoring = true;
    restoreError = "";
    console.log("   - Set isRestoring = true");
    console.log("   - Cleared restoreError");

    try {
      console.log("💾 Calling calciumService.restoreFromBackup...");
      await calciumService.restoreFromBackup(backupData);
      console.log("✅ Backup restore completed successfully");

      // Sequentially reload all application data.
      console.log("🔄 Starting sequential data reload...");
      
      console.log("   📂 Loading settings...");
      await calciumService.loadSettings();
      console.log("   ✅ Settings loaded");
      
      console.log("   🍽️  Loading daily foods...");
      await calciumService.loadDailyFoods();
      console.log("   ✅ Daily foods loaded");
      
      console.log("   🥗 Loading custom foods...");
      await calciumService.loadCustomFoods();
      console.log("   ✅ Custom foods loaded");
      
      console.log("   ⭐ Loading favorites...");
      await calciumService.loadFavorites();
      console.log("   ✅ Favorites loaded");
      
      console.log("   🍴 Loading serving preferences...");
      await calciumService.loadServingPreferences();
      console.log("   ✅ Serving preferences loaded");
      
      console.log("   🔄 Applying food sorting...");
      await calciumService.applySortToFoods();
      console.log("   ✅ Food sorting applied");

      console.log("🏁 All data reload completed successfully");

      // Reset restoring state before closing modal
      console.log("🔄 Setting isRestoring = false before closing modal");
      isRestoring = false;

      // Close the modal after successful restoration and data reload.
      console.log("🚪 Attempting to close modal...");
      handleClose();
      console.log("✅ Modal close initiated");

      // Show a success message after the modal is closed and data is refreshed.
      console.log("🎉 Showing success toast notification");
      showToast("Data restored successfully!", "success");
      
    } catch (error) {
      console.error("❌ Restore process failed:", error);
      console.log("   - Error type:", typeof error);
      console.log("   - Error message:", error?.message);

      // Reset restoring state before closing modal
      console.log("🔄 Setting isRestoring = false after error");
      isRestoring = false;

      // Show error toast and close modal
      const errorMessage = `Restore failed: ${error instanceof Error ? error.message : "Unknown error"}`;
      console.log("💥 Showing error toast:", errorMessage);
      showToast(errorMessage, "error");
      
      console.log("🚪 Closing modal after error");
      handleClose();
    }
    
    console.log("🏁 handleConfirmRestore() completed");
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal-backdrop" on:click={handleBackdropClick}>
    <div
      class="modal-container"
      role="dialog"
      aria-labelledby="restore-title"
      aria-modal="true"
      on:click|stopPropagation
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

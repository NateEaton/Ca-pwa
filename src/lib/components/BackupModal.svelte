<script>
  import { calciumState, calciumService } from "$lib/stores/calcium";

  export let show = false;

  let isGenerating = false;
  let backupStats = "";

  function handleClose() {
    show = false;
  }

  function handleBackdropClick(event) {
    // Prevent accidental closing during backup generation
    if (isGenerating) return;

    // Only close if clicking the backdrop itself, not child elements
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(event) {
    // Prevent closing during backup generation
    if (event.key === "Escape" && !isGenerating) {
      handleClose();
    }
  }

  // Generate backup stats when modal opens
  $: if (show && !isGenerating) {
    generateBackupStats();
  }

  async function generateBackupStats() {
    try {
      if (!calciumService) {
        backupStats = "Service not initialized yet";
        return;
      }
      const backupData = await calciumService.generateBackup();
      const stats = calculateStats(backupData);
      backupStats = stats;
    } catch (error) {
      console.error("Error generating backup stats:", error);
      backupStats = "Error loading backup statistics";
    }
  }

  function calculateStats(backupData) {
    const dates = Object.keys(backupData.journalEntries);
    const totalDays = dates.length;
    const totalFoodEntries = Object.values(backupData.journalEntries).reduce(
      (sum, dayFoods) => sum + dayFoods.length,
      0
    );
    const customFoodsCount = backupData.customFoods.length;
    const favoritesCount = backupData.favorites
      ? backupData.favorites.length
      : 0;

    let dateRange = "No journal entries";
    if (dates.length > 0) {
      dates.sort();
      const firstDate = new Date(dates[0]).toLocaleDateString();
      const lastDate = new Date(dates[dates.length - 1]).toLocaleDateString();
      dateRange =
        dates.length === 1 ? `${firstDate}` : `${firstDate} to ${lastDate}`;
    }

    return `
• ${totalDays} journal days with ${totalFoodEntries} food entries<br>
• ${customFoodsCount} custom food definitions<br>
• ${favoritesCount} favorite foods<br>
• Date range: ${dateRange}`;
  }

  async function handleBackupDownload() {
    if (isGenerating) return;

    isGenerating = true;
    try {
      if (!calciumService) {
        throw new Error("CalciumService not initialized");
      }
      const backupData = await calciumService.generateBackup();

      // Create filename with current date (local timezone)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const filename = `calcium-tracker-backup-${dateStr}.json`;

      // Create and download file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      handleClose();
    } catch (error) {
      console.error("Error creating backup:", error);
      // Could add toast notification here
    } finally {
      isGenerating = false;
    }
  }
</script>

{#if show}
  <div class="modal-backdrop full-screen" on:click={handleBackdropClick} on:keydown={handleKeydown} role="button" tabindex="0">
    <div
      class="modal-container full-screen"
      role="dialog"
      aria-labelledby="backup-title"
      aria-modal="true"
    >
      <!-- Modal Header -->
      <div class="modal-header">
        <button
          class="back-btn"
          on:click={handleClose}
          aria-label="Close backup dialog"
        >
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 id="backup-title" class="modal-title">Backup</h2>
        <div class="header-spacer"></div>
      </div>

      <!-- Modal Content -->
      <div class="modal-content">
        <div class="backup-content">
          <!-- Backup Info Section -->
          <div class="backup-info">
            <div class="info-icon">
              <span class="material-icons">backup</span>
            </div>
            <div class="info-text">
              <h3>Download Your Data</h3>
              <p>
                Creates a backup file with all journal entries, custom foods,
                and preferences.
              </p>
            </div>
          </div>

          <!-- Current Data Summary -->
          <div class="data-summary">
            <h4>What Will Be Backed Up:</h4>
            <div class="backup-stats">
              {@html backupStats}
            </div>
          </div>

          <!-- Action Button -->
          <div class="backup-actions">
            <button
              class="backup-btn primary"
              on:click={handleBackupDownload}
              disabled={isGenerating}
            >
              {#if isGenerating}
                <span class="material-icons spinning">sync</span>
                Creating Backup...
              {:else}
                <span class="material-icons">download</span>
                Download Backup
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:window on:keydown={handleKeydown} />

<style>
  /* Full-screen modal backdrop */
  .modal-backdrop.full-screen {
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
  }

  /* Full-screen modal container */
  .modal-container.full-screen {
    width: 100%;
    height: 100%;
    max-width: 480px; /* Match app container width */
    background-color: var(--surface);
    border-radius: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Modal header */
  .modal-header {
    display: grid;
    grid-template-columns: var(--touch-target-min) 1fr var(--touch-target-min);
    align-items: center;
    padding: var(--spacing-lg);
    background-color: var(--primary-color);
    color: white;
    min-height: var(--header-height);
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
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .back-btn:hover {
    background-color: var(--hover-overlay);
  }

  .modal-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
    text-align: left;
  }

  .header-spacer {
    /* Balances the back button */
  }

  /* Modal content */
  .modal-content {
    flex: 1;
    padding: var(--spacing-xl);
    overflow-y: auto;
  }

  .backup-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    color: var(--text-primary);
  }

  .backup-info {
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

  .data-summary {
    background-color: var(--surface-variant);
    border-radius: 8px;
    padding: var(--spacing-lg);
    border: 1px solid var(--divider);
  }

  .data-summary h4 {
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }

  .backup-stats {
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .backup-actions {
    text-align: center;
  }

  .backup-btn.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: background-color 0.2s;
    min-height: var(--touch-target-min);
  }

  .backup-btn.primary:hover:not(:disabled) {
    background-color: var(--primary-color-dark);
  }

  .backup-btn.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .backup-btn .material-icons {
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

  /* Mobile responsive */
  @media (max-width: 480px) {
    .modal-backdrop.full-screen {
      /* Prevent touch scrolling on backdrop */
      touch-action: none;
    }

    .modal-container.full-screen {
      width: 100vw;
      height: 100vh;
      max-width: none;
      /* Re-enable touch scrolling inside modal content */
      touch-action: auto;
    }

    .backup-info {
      padding: var(--spacing-md);
      gap: var(--spacing-md);
    }

    .data-summary {
      padding: var(--spacing-md);
    }

    .backup-btn.primary {
      padding: var(--spacing-sm) var(--spacing-lg);
      font-size: var(--font-size-sm);
    }
  }
</style>

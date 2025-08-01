<script>
  import { getCalciumServiceSync } from "$lib/services/CalciumServiceSingleton";
  import { calciumState } from "$lib/stores/calcium";

  export let show = false;
  
  let isGenerating = false;
  let backupStats = "";

  function handleClose() {
    show = false;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  // Generate backup stats when modal opens
  $: if (show && !isGenerating) {
    generateBackupStats();
  }

  async function generateBackupStats() {
    try {
      const calciumService = getCalciumServiceSync();
      if (!calciumService) {
        backupStats = "Service not initialized yet";
        return;
      }
      const backupData = await calciumService.generateBackup();
      const stats = calculateStats(backupData);
      backupStats = stats;
    } catch (error) {
      console.error('Error generating backup stats:', error);
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

    let dateRange = "No journal entries";
    if (dates.length > 0) {
      dates.sort();
      const firstDate = new Date(dates[0]).toLocaleDateString();
      const lastDate = new Date(dates[dates.length - 1]).toLocaleDateString();
      dateRange = dates.length === 1 
        ? `${firstDate}`
        : `${firstDate} to ${lastDate}`;
    }

    return `<strong>What will be backed up:</strong><br>
• ${totalDays} journal days with ${totalFoodEntries} food entries<br>
• ${customFoodsCount} custom food definitions<br>
• Date range: ${dateRange}`;
  }

  async function handleBackupDownload() {
    if (isGenerating) return;
    
    isGenerating = true;
    try {
      const calciumService = getCalciumServiceSync();
      if (!calciumService) {
        throw new Error('CalciumService not initialized');
      }
      const backupData = await calciumService.generateBackup();
      
      // Create filename with current date (local timezone)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const filename = `calcium-tracker-backup-${dateStr}.json`;
      
      // Create and download file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      handleClose();
    } catch (error) {
      console.error('Error creating backup:', error);
      // Could add toast notification here
    } finally {
      isGenerating = false;
    }
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click={handleBackdropClick}>
    <div class="modal" role="dialog" aria-labelledby="backup-title" aria-modal="true">
      <div class="modal-header">
        <div class="modal-header-left">
          <button class="back-btn" on:click={handleClose} aria-label="Close backup dialog">
            <span class="material-icons">arrow_back</span>
          </button>
        </div>
        <div class="modal-header-center">
          <h2 id="backup-title" class="modal-title">Create Backup</h2>
        </div>
      </div>
      
      <div class="modal-body">
        <div class="backup-content">
          <div class="backup-warning">
            <div class="warning-icon">
              <span class="material-icons">backup</span>
            </div>
            <div class="warning-text">
              <strong>Create backup of your data</strong>
              <p>This will save all your journal entries, custom foods, and preferences to a file on your device.</p>
            </div>
          </div>
          
          <div class="backup-stats">
            {@html backupStats}
          </div>
          
          <div class="backup-actions">
            <button 
              class="backup-btn" 
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
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    width: 90%;
    max-width: 432px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--divider);
    background-color: var(--surface);
    flex-shrink: 0;
    position: relative;
  }

  .modal-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modal-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .back-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .back-btn .material-icons {
    font-size: 24px;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
  }

  .modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }

  .backup-content {
    color: var(--text-primary);
  }

  .backup-warning {
    display: flex;
    gap: 12px;
    padding: 16px;
    background-color: var(--primary-alpha-5);
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid var(--primary-alpha-10);
  }

  .warning-icon {
    flex-shrink: 0;
  }

  .warning-icon .material-icons {
    font-size: 24px;
    color: var(--primary-color);
  }

  .warning-text strong {
    display: block;
    color: var(--text-primary);
    margin-bottom: 4px;
    font-size: 1.1rem;
  }

  .warning-text p {
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  .backup-stats {
    background-color: var(--surface-variant);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    border: 1px solid var(--divider);
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .backup-actions {
    text-align: center;
  }

  .backup-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
  }

  .backup-btn:hover:not(:disabled) {
    background-color: var(--primary-color-dark);
  }

  .backup-btn:disabled {
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
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .modal-backdrop {
      padding: 0.5rem;
    }

    .modal {
      max-height: 95vh;
    }

    .modal-header {
      padding: 1rem;
    }

    .modal-body {
      padding: 1rem;
    }

    .backup-warning {
      padding: 12px;
      gap: 8px;
    }

    .backup-stats {
      padding: 12px;
    }

    .backup-btn {
      padding: 10px 20px;
      font-size: 0.9rem;
    }
  }
</style>
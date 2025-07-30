<script>
  import { getCalciumServiceSync } from "$lib/services/CalciumServiceSingleton";

  export let show = false;
  
  let isRestoring = false;
  let restoreMessage = "";
  let restoreError = "";
  let fileInput;

  function handleClose() {
    show = false;
    restoreMessage = "";
    restoreError = "";
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

  function triggerFileSelect() {
    if (isRestoring) return;
    fileInput.click();
  }

  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      restoreError = "Please select a valid JSON backup file";
      return;
    }

    isRestoring = true;
    restoreError = "";
    restoreMessage = "Reading backup file...";

    try {
      const fileContent = await file.text();
      const backupData = JSON.parse(fileContent);
      
      // Validate backup structure
      if (!backupData.metadata || !backupData.journalEntries || !backupData.customFoods) {
        throw new Error("Invalid backup file format");
      }

      restoreMessage = "Restoring data...";
      
      const calciumService = getCalciumServiceSync();
      if (!calciumService) {
        throw new Error('CalciumService not initialized');
      }

      await calciumService.restoreFromBackup(backupData);
      
      restoreMessage = "✅ Data restored successfully! Refreshing page...";
      
      // Refresh the page after successful restore
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error restoring backup:', error);
      restoreError = error.message || "Failed to restore backup";
      restoreMessage = "";
    } finally {
      isRestoring = false;
      // Reset file input
      event.target.value = "";
    }
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click={handleBackdropClick}>
    <div class="modal" role="dialog" aria-labelledby="restore-title" aria-modal="true">
      <div class="modal-header">
        <div class="modal-header-left">
          <button class="back-btn" on:click={handleClose} aria-label="Close restore dialog">
            <span class="material-icons">arrow_back</span>
          </button>
        </div>
        <div class="modal-header-center">
          <h2 id="restore-title" class="modal-title">Restore Backup</h2>
        </div>
      </div>
      
      <div class="modal-body">
        <div class="restore-content">
          <div class="restore-warning">
            <div class="warning-icon">
              <span class="material-icons">restore</span>
            </div>
            <div class="warning-text">
              <strong>Restore from backup file</strong>
              <p>This will replace all current data with the contents of your backup file. This action cannot be undone.</p>
            </div>
          </div>
          
          {#if restoreMessage}
            <div class="restore-status success">
              {restoreMessage}
            </div>
          {/if}
          
          {#if restoreError}
            <div class="restore-status error">
              <span class="material-icons">error</span>
              {restoreError}
            </div>
          {/if}
          
          <div class="restore-actions">
            <!-- Hidden file input -->
            <input
              bind:this={fileInput}
              type="file"
              accept=".json"
              on:change={handleFileSelect}
              style="display: none;"
            />
            
            <button 
              class="restore-btn" 
              on:click={triggerFileSelect}
              disabled={isRestoring}
            >
              {#if isRestoring}
                <span class="material-icons spinning">sync</span>
                Restoring...
              {:else}
                <span class="material-icons">upload_file</span>
                Select Backup File
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

  .restore-content {
    color: var(--text-primary);
  }

  .restore-warning {
    display: flex;
    gap: 12px;
    padding: 16px;
    background-color: rgba(255, 152, 0, 0.1);
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 152, 0, 0.2);
  }

  .warning-icon {
    flex-shrink: 0;
  }

  .warning-icon .material-icons {
    font-size: 24px;
    color: #ff9800;
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

  .restore-status {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .restore-status.success {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4caf50;
    border: 1px solid rgba(76, 175, 80, 0.2);
  }

  .restore-status.error {
    background-color: rgba(244, 67, 54, 0.1);
    color: #f44336;
    border: 1px solid rgba(244, 67, 54, 0.2);
  }

  .restore-actions {
    text-align: center;
  }

  .restore-btn {
    background-color: #ff9800;
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

  .restore-btn:hover:not(:disabled) {
    background-color: #f57c00;
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

    .restore-warning {
      padding: 12px;
      gap: 8px;
    }

    .restore-btn {
      padding: 10px 20px;
      font-size: 0.9rem;
    }
  }
</style>
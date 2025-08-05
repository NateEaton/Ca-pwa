<script>
  import { getCalciumServiceSync } from "$lib/services/CalciumServiceSingleton";
  import { showToast } from "$lib/stores/calcium";
  import { tick } from 'svelte';

  export let show = false;
  
  let isRestoring = false;
  let restoreComplete = false;
  let restoreError = "";
  let fileInput;
  let showPreview = false;
  let backupData = null;
  let previewStats = "";
  let restoreStats = "";
  let disableHandlers = false; // Disable handlers temporarily during transitions
  
  // Button references for autofocus
  let confirmButton;
  let completeButton;
  
  // Autofocus buttons when states change
  $: if (showPreview && confirmButton && !isRestoring) {
    console.log('🎯 RESTORE MODAL - Autofocusing confirm button');
    setTimeout(() => confirmButton?.focus(), 100);
  }
  
  $: if (restoreComplete && completeButton) {
    console.log('🎯 RESTORE MODAL - Autofocusing complete button');
    setTimeout(() => completeButton?.focus(), 100);
  }
  
  // Log show state changes
  $: {
    console.log('📺 RESTORE MODAL - Show state changed:', {
      show,
      isRestoring,
      restoreComplete,
      showPreview,
      disableHandlers,
      timestamp: new Date().toISOString()
    });
  }

  function handleClose(reason = 'unknown') {
    // Enhanced logging for debugging
    console.log('🔍 RESTORE MODAL - Close attempt:', {
      reason,
      show,
      isRestoring,
      restoreComplete, 
      showPreview,
      disableHandlers,
      timestamp: new Date().toISOString(),
      callStack: new Error().stack
    });

    // Only allow closing if not in critical states
    if (isRestoring) {
      console.log('🚫 RESTORE MODAL - Prevented close during restore');
      return;
    }
    
    if (restoreComplete) {
      console.log('🚫 RESTORE MODAL - Prevented close during completion display');
      return;
    }

    // Additional protection: don't close if handlers are disabled
    if (disableHandlers) {
      console.log('🚫 RESTORE MODAL - Prevented close during handler cooldown');
      return;
    }
    
    console.log('✅ RESTORE MODAL - Closing modal, calling resetModalState');
    resetModalState();
  }

  // Separate function for clean state reset
  function resetModalState() {
    console.log('🔄 RESTORE MODAL - resetModalState called, current state:', {
      show,
      isRestoring,
      restoreComplete,
      showPreview,
      disableHandlers
    });
    
    show = false;
    restoreComplete = false;
    restoreError = "";
    showPreview = false;
    backupData = null;
    previewStats = "";
    restoreStats = "";
    isRestoring = false;
    disableHandlers = false;
    
    console.log('🔄 RESTORE MODAL - resetModalState complete, new state:', {
      show,
      isRestoring,
      restoreComplete,
      showPreview,
      disableHandlers
    });
  }

  function handleBackdropClick(event) {
    console.log('🖱️ RESTORE MODAL - Backdrop click detected:', {
      target: event.target?.tagName,
      currentTarget: event.currentTarget?.tagName,
      isTargetCurrentTarget: event.target === event.currentTarget,
      targetClasses: event.target?.className,
      currentTargetClasses: event.currentTarget?.className,
      isRestoring,
      restoreComplete,
      disableHandlers,
      timestamp: new Date().toISOString()
    });
    
    // Prevent accidental closing during restore process or when showing completion
    if (isRestoring || restoreComplete) {
      console.log('🚫 RESTORE MODAL - Backdrop click blocked:', isRestoring ? 'restoring' : 'completed');
      return;
    }
    
    // Only close if clicking the backdrop itself, not child elements
    if (event.target === event.currentTarget) {
      console.log('✅ RESTORE MODAL - Valid backdrop click, calling handleClose');
      handleClose('backdrop-click');
    } else {
      console.log('⚠️ RESTORE MODAL - Backdrop click ignored: hit child element');
    }
  }

  function handleKeydown(event) {
    console.log('⌨️ RESTORE MODAL - Keydown event:', {
      key: event.key,
      code: event.code,
      isRestoring,
      restoreComplete,
      disableHandlers,
      timestamp: new Date().toISOString()
    });
    
    if (event.key === "Escape") {
      // Prevent closing during restore process or when showing completion
      if (isRestoring || restoreComplete) {
        console.log('🚫 RESTORE MODAL - Escape key blocked:', isRestoring ? 'restoring' : 'completed');
        return;
      }
      console.log('✅ RESTORE MODAL - Valid escape key, calling handleClose');
      handleClose('escape-key');
    }
  }

  function triggerFileSelect() {
    if (isRestoring) return;
    fileInput.click();
  }

  function calculateStats(backupData) {
    const dates = Object.keys(backupData.journalEntries || {});
    const totalDays = dates.length;
    const totalFoodEntries = Object.values(backupData.journalEntries || {}).reduce(
      (sum, dayFoods) => sum + dayFoods.length,
      0
    );
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
      dateRange = dates.length === 1 
        ? `${firstDate}`
        : `${firstDate} to ${lastDate}`;
    }

    return `<strong>Backup contents:</strong><br>
• Created: ${createdAt}<br>
• ${totalDays} journal days with ${totalFoodEntries} food entries<br>
• ${customFoodsCount} custom food definitions<br>
• ${favoritesCount} favorite foods<br>
• Date range: ${dateRange}`;
  }

  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      restoreError = "Please select a valid JSON backup file";
      return;
    }

    restoreError = "";

    try {
      const fileContent = await file.text();
      const parsedBackupData = JSON.parse(fileContent);
      
      // Validate backup structure
      if (!parsedBackupData.metadata || !parsedBackupData.journalEntries) {
        throw new Error("Invalid backup file format");
      }

      // Store backup data and show preview
      backupData = parsedBackupData;
      previewStats = calculateStats(backupData);
      showPreview = true;
      
    } catch (error) {
      console.error('Error reading backup file:', error);
      restoreError = error.message || "Failed to read backup file";
    } finally {
      // Reset file input
      event.target.value = "";
    }
  }

  function handleBackToFileSelect() {
    showPreview = false;
    backupData = null;
    previewStats = "";
    restoreError = "";
  }

  async function handleConfirmRestore() {
    console.log('🔄 RESTORE MODAL - handleConfirmRestore called:', {
      hasBackupData: !!backupData,
      isRestoring,
      timestamp: new Date().toISOString()
    });
    
    if (!backupData || isRestoring) {
      console.log('🚫 RESTORE MODAL - Restore blocked:', { hasBackupData: !!backupData, isRestoring });
      return;
    }

    console.log('▶️ RESTORE MODAL - Starting restore process');
    isRestoring = true;
    restoreError = "";

    try {
      const calciumService = getCalciumServiceSync();
      if (!calciumService) {
        throw new Error('CalciumService not initialized');
      }

      console.log('🔄 RESTORE MODAL - Calling calciumService.restoreFromBackup');
      await calciumService.restoreFromBackup(backupData);
      
      // Set completion state
      console.log('📊 RESTORE MODAL - Calculating restore stats');
      restoreStats = calculateStats(backupData);
      
      // Wait for DOM updates to complete before proceeding
      console.log('⏳ RESTORE MODAL - Waiting for DOM tick');
      await tick();
      
      console.log('✅ RESTORE MODAL - Setting restoreComplete to true');
      restoreComplete = true;
      
    } catch (error) {
      console.error('❌ RESTORE MODAL - Error restoring backup:', error);
      restoreError = error.message || "Failed to restore backup";
    } finally {
      console.log('🏁 RESTORE MODAL - Restore process complete, cleaning up');
      isRestoring = false;
      
      // Disable handlers temporarily to prevent premature closing
      console.log('🔒 RESTORE MODAL - Disabling handlers for 500ms');
      disableHandlers = true;
      
      // Re-enable handlers after brief delay
      setTimeout(() => {
        console.log('🔓 RESTORE MODAL - Re-enabling handlers');
        disableHandlers = false;
      }, 500);
    }
  }

  function handleCompleteRestore() {
    console.log('🎯 RESTORE MODAL - User initiated completion (Close & Refresh button)');
    
    // Force close and reload - override all protection
    console.log('🔄 RESTORE MODAL - Calling resetModalState before reload');
    resetModalState();
    
    console.log('🔄 RESTORE MODAL - Scheduling page reload in 100ms');
    setTimeout(() => {
      console.log('🔄 RESTORE MODAL - Executing window.location.reload()');
      window.location.reload();
    }, 100);
  }
</script>

{#if show}
  <div class="modal-backdrop full-screen" on:click={disableHandlers ? null : handleBackdropClick}>
    <div class="modal-container full-screen" role="dialog" aria-labelledby="restore-title" aria-modal="true">
      <!-- Modal Header -->
      <div class="modal-header">
        <button 
          class="back-btn" 
          class:disabled={isRestoring}
          on:click={() => handleClose('back-button')} 
          aria-label="Close restore dialog"
          disabled={isRestoring}
        >
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 id="restore-title" class="modal-title">
          {#if showPreview}
            Restore
          {:else if restoreComplete}
            Complete
          {:else}
            Restore
          {/if}
        </h2>
        <div class="header-spacer"></div>
      </div>
      
      <!-- Modal Content -->
      <div class="modal-content">
        <div class="restore-content">
          {#if !showPreview && !restoreComplete}
            <!-- Step 1: File Selection -->
            <div class="restore-info">
              <div class="info-icon">
                <span class="material-icons">restore</span>
              </div>
              <div class="info-text">
                <h3>Select Backup File</h3>
                <p>Choose a backup file to restore. This will replace all current data.</p>
              </div>
            </div>
            
            <div class="warning-box">
              <span class="material-icons">warning</span>
              <div class="warning-content">
                <strong>Warning:</strong> This action will permanently replace all your current tracking data, 
                custom foods, and preferences with the backup data. This cannot be undone.
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
              />
              
              <button 
                class="restore-btn primary" 
                on:click={triggerFileSelect}
              >
                <span class="material-icons">upload_file</span>
                Select Backup File
              </button>
            </div>
            
          {:else if showPreview && !restoreComplete}
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
              <h4>Backup Contents</h4>
              <div class="preview-stats">{@html previewStats}</div>
            </div>
            
            <div class="warning-box">
              <span class="material-icons">warning</span>
              <div class="warning-content">
                <strong>Final Warning:</strong> This will permanently replace all your current data. 
                Make sure you have a recent backup if needed.
              </div>
            </div>
            
            {#if restoreError}
              <div class="error-message">
                <span class="material-icons">error</span>
                <span>{restoreError}</span>
              </div>
            {/if}
            
            <div class="restore-actions">
              <button 
                class="restore-btn secondary" 
                on:click={handleBackToFileSelect}
                disabled={isRestoring}
              >
                <span class="material-icons">arrow_back</span>
                Choose Different File
              </button>
              
              <button 
                class="restore-btn primary" 
                on:click={handleConfirmRestore}
                disabled={isRestoring}
                bind:this={confirmButton}
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
            
          {:else if restoreComplete}
            <!-- Step 3: Completion (NO AUTO-CLOSE) -->
            <div class="restore-info">
              <div class="info-icon success">
                <span class="material-icons">check_circle</span>
              </div>
              <div class="info-text">
                <h3>Success!</h3>
                <p>Your data has been successfully restored from the backup file.</p>
              </div>
            </div>
            
            <div class="completion-message">
              <div class="completion-stats">{@html restoreStats}</div>
              <p>The page will refresh when you close this dialog to show your restored data.</p>
            </div>
            
            <div class="restore-actions">
              <button 
                class="restore-btn primary" 
                on:click={handleCompleteRestore}
                bind:this={completeButton}
              >
                <span class="material-icons">refresh</span>
                Close & Refresh
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:window on:keydown={disableHandlers ? null : handleKeydown} />

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

  .back-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .back-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
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

  .restore-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
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

  .info-icon.success .material-icons {
    color: #4caf50;
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

  .completion-message {
    background-color: var(--surface-variant);
    border-radius: 8px;
    padding: var(--spacing-lg);
    border: 1px solid var(--divider);
  }

  .completion-stats {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
    text-align: left;
  }

  .completion-message p {
    color: var(--text-secondary);
    margin: 0;
    font-style: italic;
    text-align: center;
  }

  .restore-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
  }

  .restore-actions:has(.secondary) {
    flex-direction: column;
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
    flex: 1;
    min-height: var(--touch-target-min);
  }

  .restore-btn.primary {
    background-color: #d32f2f;
    color: white;
  }

  .restore-btn.primary:hover:not(:disabled) {
    background-color: #b71c1c;
  }

  .restore-btn.secondary {
    background-color: var(--surface-variant);
    color: var(--text-primary);
    border: 1px solid var(--divider);
  }

  .restore-btn.secondary:hover:not(:disabled) {
    background-color: var(--divider);
  }

  .restore-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .restore-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-alpha-10);
  }

  .restore-btn.primary:focus {
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.3);
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
    .modal-backdrop.full-screen {
      /* Prevent any background interaction */
      position: fixed;
      width: 100vw;
      height: 100vh;
      touch-action: none;
      overscroll-behavior: none;
      /* Prevent webkit touch callouts */
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    
    .modal-container.full-screen {
      width: 100vw;
      height: 100vh;
      max-width: none;
      /* Re-enable controlled interaction inside modal */
      touch-action: auto;
      -webkit-user-select: text;
      user-select: text;
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

    .completion-message {
      padding: var(--spacing-md);
    }

    /* Larger touch targets for mobile */
    .restore-btn {
      min-height: 48px; /* Ensure minimum 48px touch target */
      padding: var(--spacing-lg) var(--spacing-xl);
      font-size: var(--font-size-sm);
    }

    /* Better mobile button spacing */
    .restore-actions {
      gap: var(--spacing-lg);
      padding: var(--spacing-lg) 0;
    }
  }
</style>
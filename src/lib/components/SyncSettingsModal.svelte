<!-- src/lib/components/SyncSettingsModal.svelte -->
<script>
  import { createEventDispatcher } from "svelte";
  import { syncState } from "$lib/stores/sync";
  import { showToast } from "$lib/stores/calcium";
  import { SyncService } from "$lib/services/SyncService";
  import QRCode from "qrcode";

  export let show = false;

  const dispatch = createEventDispatcher();
  const syncService = SyncService.getInstance();

  let qrCodeDataUrl = "";
  let syncUrl = "";
  let joinUrl = "";
  let showQRCode = false;
  let showJoinInput = false;

  // Generate sync URL and QR code when modal opens or sync state changes
  $: if (show && $syncState.isEnabled && $syncState.docId) {
    // Add a small delay to ensure settings are saved
    setTimeout(() => generateSyncUrl(), 100);
  }

  async function generateSyncUrl() {
    try {
      const settings = syncService.getSettings();
      if (settings) {
        const baseUrl = window.location.origin + window.location.pathname;
        syncUrl = `${baseUrl}#sync=${settings.docId}&key=${settings.encryptionKeyString}`;

        // Generate QR code
        qrCodeDataUrl = await QRCode.toDataURL(syncUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: "#1976D2",
            light: "#FFFFFF",
          },
        });
      }
    } catch (error) {
      console.error("Failed to generate sync URL:", error);
      showToast("Failed to generate sync URL", "error");
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function closeModal() {
    show = false;
    showQRCode = false;
    showJoinInput = false;
    dispatch("close");
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    }
  }

  async function copyToClipboard() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(syncUrl);
        showToast("Sync URL copied to clipboard", "success");
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = syncUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showToast("Sync URL copied to clipboard", "success");
      }
    } catch (error) {
      console.error("Copy failed:", error);
      showToast("Copy failed - try selecting the URL manually", "error");
    }
  }

  async function handleJoinSync() {
    if (!joinUrl.trim()) {
      showToast("Please enter a sync URL", "error");
      return;
    }

    try {
      await syncService.joinExistingSyncDoc(joinUrl.trim());
      showToast("Successfully joined sync!", "success");
      closeModal();
    } catch (error) {
      showToast("Failed to join sync", "error");
      console.error("Join sync error:", error);
    }
  }

  async function handleCreateNewSync() {
    try {
      const docId = await syncService.createNewSyncDoc();
      showToast(`New sync created: ${docId.substring(0, 8)}...`, "success");
      await generateSyncUrl();
    } catch (error) {
      showToast("Failed to create sync", "error");
      console.error("Create sync error:", error);
    }
  }

  function toggleQRCode() {
    showQRCode = !showQRCode;
  }

  function toggleJoinInput() {
    showJoinInput = !showJoinInput;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click={handleBackdropClick}>
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <button class="close-btn" on:click={closeModal} aria-label="Back">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2>Sync Settings</h2>
      </div>

      <div class="modal-body">
        {#if $syncState.isEnabled}
          <!-- Existing Sync -->
          <div class="sync-status">
            <div class="status-item">
              <span class="status-label">Status:</span>
              <span class="status-value {$syncState.status}"
                >{$syncState.status}</span
              >
            </div>
            <div class="status-item">
              <span class="status-label">Document ID:</span>
              <span class="status-value"
                >{$syncState.docId?.substring(0, 8)}...</span
              >
            </div>
            {#if $syncState.lastSync}
              <div class="status-item">
                <span class="status-label">Last Sync:</span>
                <span class="status-value"
                  >{new Date($syncState.lastSync).toLocaleString()}</span
                >
              </div>
            {/if}
          </div>

          <div class="section">
            <h3>Share This Sync</h3>
            <p class="section-desc">
              Use this URL or QR code to sync another device
            </p>

            <div class="url-section">
              <div class="url-display">
                <input type="text" readonly value={syncUrl} class="url-input" />
                <button class="copy-btn" on:click={copyToClipboard}>
                  <span class="material-icons">content_copy</span>
                </button>
              </div>

              <button class="qr-toggle-btn" on:click={toggleQRCode}>
                <span class="material-icons">qr_code</span>
                {showQRCode ? "Hide" : "Show"} QR Code
              </button>
            </div>

            {#if showQRCode && qrCodeDataUrl}
              <div class="qr-section">
                <img src={qrCodeDataUrl} alt="Sync QR Code" class="qr-code" />
                <p class="qr-instruction">Scan with another device to sync</p>
              </div>
            {/if}
          </div>
        {:else}
          <!-- No Sync Yet -->
          <div class="no-sync">
            <div class="no-sync-content">
              <span class="material-icons no-sync-icon">sync_disabled</span>
              <h3>Sync Not Enabled</h3>
              <p>Create a new sync or join an existing one</p>
            </div>

            <div class="sync-actions">
              <button class="action-btn primary" on:click={handleCreateNewSync}>
                <span class="material-icons">add</span>
                Create New Sync
              </button>

              <button class="action-btn secondary" on:click={toggleJoinInput}>
                <span class="material-icons">link</span>
                Join Existing Sync
              </button>
            </div>

            {#if showJoinInput}
              <div class="join-section">
                <input
                  type="text"
                  placeholder="Paste sync URL here..."
                  bind:value={joinUrl}
                  class="join-input"
                />
                <div class="join-actions">
                  <button class="join-btn" on:click={handleJoinSync}
                    >Join</button
                  >
                  <button class="cancel-btn" on:click={toggleJoinInput}
                    >Cancel</button
                  >
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
  }

  .modal {
    background: var(--surface);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    max-width: 480px; /* Match app container max-width */
    width: 90%; /* Don't exceed 90% of viewport */
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--divider);
    background: var(--primary-color);
    color: white;
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    flex: 1;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
    flex-shrink: 0;
  }

  .close-btn:hover {
    background-color: var(--hover-overlay);
  }

  .close-btn .material-icons {
    font-size: var(--icon-size-lg);
  }

  .modal-body {
    padding: var(--spacing-lg);
    overflow-y: auto;
    flex: 1;
  }

  .sync-status {
    background: var(--surface-variant);
    border-radius: 8px;
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
  }

  .status-item:last-child {
    margin-bottom: 0;
  }

  .status-label {
    font-weight: 500;
    color: var(--text-secondary);
  }

  .status-value {
    font-family: monospace;
    color: var(--text-primary);
  }

  .status-value.synced {
    color: #4caf50;
  }

  .status-value.syncing {
    color: var(--primary-color);
  }

  .status-value.error {
    color: #f44336;
  }

  .section {
    margin-bottom: var(--spacing-lg);
  }

  .section h3 {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--text-primary);
  }

  .section-desc {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .url-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .url-display {
    display: flex;
    gap: var(--spacing-sm);
  }

  .url-input {
    flex: 1;
    padding: var(--spacing-md);
    border: 1px solid var(--divider);
    border-radius: 4px;
    background: var(--surface);
    color: var(--text-primary);
    font-family: monospace;
    font-size: var(--font-size-sm);
  }

  .copy-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-md);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .copy-btn:hover {
    background-color: var(--primary-color);
    opacity: 0.9;
  }

  .qr-toggle-btn {
    background: var(--surface-variant);
    color: var(--text-primary);
    border: 1px solid var(--divider);
    padding: var(--spacing-md);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    justify-content: center;
    transition: background-color 0.2s;
  }

  .qr-toggle-btn:hover {
    background-color: var(--hover-overlay);
  }

  .qr-section {
    text-align: center;
    padding: var(--spacing-lg);
    background: var(--surface-variant);
    border-radius: 8px;
    margin-top: var(--spacing-md);
  }

  .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .qr-instruction {
    margin: var(--spacing-md) 0 0 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .no-sync {
    text-align: center;
  }

  .no-sync-content {
    margin-bottom: var(--spacing-xl);
  }

  .no-sync-icon {
    font-size: 48px;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
  }

  .no-sync h3 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--text-primary);
  }

  .no-sync p {
    margin: 0;
    color: var(--text-secondary);
  }

  .sync-actions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .action-btn {
    padding: var(--spacing-md) var(--spacing-lg);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-base);
    font-weight: 500;
    transition: background-color 0.2s;
    min-height: var(--touch-target-min);
  }

  .action-btn.primary {
    background: var(--primary-color);
    color: white;
  }

  .action-btn.primary:hover {
    background-color: var(--primary-color);
    opacity: 0.9;
  }

  .action-btn.secondary {
    background: var(--surface-variant);
    color: var(--text-primary);
    border: 1px solid var(--divider);
  }

  .action-btn.secondary:hover {
    background-color: var(--hover-overlay);
  }

  .join-section {
    background: var(--surface-variant);
    border-radius: 8px;
    padding: var(--spacing-lg);
  }

  .join-input {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--divider);
    border-radius: 4px;
    background: var(--surface);
    color: var(--text-primary);
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-md);
  }

  .join-actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .join-btn {
    flex: 1;
    background: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-md);
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }

  .cancel-btn {
    flex: 1;
    background: var(--surface-variant);
    color: var(--text-primary);
    border: 1px solid var(--divider);
    padding: var(--spacing-md);
    border-radius: 4px;
    cursor: pointer;
  }

  /* Mobile responsive */
  @media (max-width: 30rem) {
    .modal-backdrop {
      padding: var(--spacing-md);
    }

    .modal {
      width: 95%; /* More space on mobile */
      max-width: none;
    }

    .modal-body {
      padding: var(--spacing-md);
    }

    .url-display {
      flex-direction: column;
    }

    .sync-actions {
      gap: var(--spacing-sm);
    }
  }
</style>

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
  import { createEventDispatcher } from "svelte";
  import { syncState } from "$lib/stores/sync";
  import { showToast } from "$lib/stores/calcium";
  import { SyncService } from "$lib/services/SyncService";
  import ConfirmDialog from "$lib/components/ConfirmDialog.svelte";
  import QRCode from "qrcode";

  /** Whether the sync settings modal is visible */
  export let show = false;

  const dispatch = createEventDispatcher();
  const syncService = SyncService.getInstance();

  let qrCodeDataUrl = "";
  let syncUrl = "";
  let joinUrl = "";
  let showQRCode = false;
  let showJoinInput = false;
  let showDisconnectConfirm = false;

  $: if (show && $syncState.isEnabled && $syncState.docId) {
    setTimeout(() => generateSyncUrl(), 100);
  }

  $: if (syncUrl) {
    QRCode.toDataURL(syncUrl, { width: 256, margin: 2 })
      .then((url) => {
        qrCodeDataUrl = url;
      })
      .catch((err) => {
        console.error("QR Code generation failed:", err);
      });
  }

  // In SyncSettingsModal.svelte - Updated generateSyncUrl function

  async function generateSyncUrl() {
    try {
      // Check for screenshot mode with safe defaults
      const screenshotMode = import.meta.env.VITE_SCREENSHOT_MODE === "true";
      const exampleUrl = import.meta.env.VITE_EXAMPLE_SYNC_URL;

      // Use screenshot mode only if both flag is true AND example URL is provided
      if (screenshotMode && exampleUrl) {
        syncUrl = exampleUrl;
        return;
      }

      // Normal production logic
      const settings = syncService.getSettings();
      if (settings) {
        const baseUrl = window.location.origin + window.location.pathname;
        const safeKey = encodeURIComponent(settings.encryptionKeyString);
        syncUrl = `${baseUrl}#sync=${settings.docId}&key=${safeKey}`;
      }
    } catch (error) {
      console.error("Failed to generate sync URL:", error);
    }
  }

  function closeModal() {
    show = false;
    showQRCode = false;
    showJoinInput = false;
    dispatch("close");
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) closeModal();
  }

  function handleKeydown(event) {
    if (event.key === "Escape") closeModal();
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(syncUrl);
      showToast("Sync URL copied", "success");
    } catch (error) {
      showToast("Copy failed", "error");
    }
  }

  async function handleJoinSync() {
    if (!joinUrl.trim()) return;
    try {
      await syncService.joinExistingSyncDoc(joinUrl.trim());
      closeModal();
    } catch (error) {
      // Error is handled by the service
    }
  }

  async function handleCreateNewSync() {
    try {
      const docId = await syncService.createNewSyncDoc();
      showToast(`New sync created: ${docId.substring(0, 8)}...`, "success");
      await generateSyncUrl();
    } catch (error) {
      // Error is handled by the service
    }
  }

  async function handleDisconnectConfirm() {
    try {
      await syncService.disconnectSync();
      showDisconnectConfirm = false;
    } catch (error) {
      showToast("Failed to disconnect", "error");
    }
  }
</script>

{#if show}
  <div
    class="modal-backdrop full-screen"
    on:click={handleBackdropClick}
    on:keydown|self={handleKeydown}
    role="button"
    tabindex="0"
  >
    <div class="modal-container full-screen" role="dialog" aria-modal="true">
      <div class="modal-header">
        <button class="back-btn" on:click={closeModal} aria-label="Close">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 class="modal-title">Sync Settings</h2>
      </div>

      <div class="modal-body">
        {#if $syncState.isEnabled}
          <!-- SYNC ENABLED VIEW -->
          <div class="section">
            <h3 class="section-title">Current Status</h3>
            <div class="status-grid">
              <div class="status-item">
                <span class="status-label">Status</span>
                <span class="status-value status-{$syncState.status}"
                  >{$syncState.status}</span
                >
              </div>
              <div class="status-item">
                <span class="status-label">Document ID</span>
                <span class="status-value"
                  >{$syncState.docId?.substring(0, 8)}...</span
                >
              </div>
              <div class="status-item">
                <span class="status-label">Last Sync</span>
                <span class="status-value"
                  >{$syncState.lastSync
                    ? new Date($syncState.lastSync).toLocaleString()
                    : "Never"}</span
                >
              </div>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">Pair Another Device</h3>
            <p class="section-desc">
              Use this URL or QR code on another device to connect to this sync
              group.
            </p>
            <div class="url-display">
              <input type="text" readonly value={syncUrl} class="url-input" />
              <button
                class="copy-btn"
                on:click={copyToClipboard}
                title="Copy URL"
                ><span class="material-icons">content_copy</span></button
              >
            </div>
            <button
              class="qr-toggle-btn"
              on:click={() => (showQRCode = !showQRCode)}
            >
              <span class="material-icons">qr_code_2</span>
              {showQRCode ? "Hide" : "Show"} QR Code
            </button>
            {#if showQRCode && qrCodeDataUrl}
              <div class="qr-code-wrapper">
                <img src={qrCodeDataUrl} alt="Sync QR Code" />
              </div>
            {/if}
          </div>

          <div class="section">
            <h3 class="section-title">Unpair This Device</h3>
            <p class="section-desc">
              This will remove this device from the sync group. Other devices
              will not be affected. You will need to re-pair to sync again.
            </p>
            <button
              class="btn btn-danger"
              on:click={() => (showDisconnectConfirm = true)}
            >
              <span class="material-icons">cloud_off</span>
              Disconnect from Sync
            </button>
          </div>
        {:else}
          <!-- SYNC NOT ENABLED VIEW -->
          <div class="no-sync-view">
            <span class="material-icons no-sync-icon">sync_disabled</span>
            <h3>Sync Not Enabled</h3>
            <p>
              Create a new sync group or join an existing one from another
              device.
            </p>
            <div class="button-group">
              <button class="btn btn-primary" on:click={handleCreateNewSync}
                >Create New Sync</button
              >
              <button
                class="btn btn-secondary"
                on:click={() => (showJoinInput = !showJoinInput)}
                >Join Existing Sync</button
              >
            </div>
            {#if showJoinInput}
              <div class="join-input-group">
                <input
                  type="text"
                  placeholder="Paste sync URL here..."
                  bind:value={joinUrl}
                  class="url-input"
                />
                <button class="btn btn-primary" on:click={handleJoinSync}
                  >Join</button
                >
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<ConfirmDialog
  bind:show={showDisconnectConfirm}
  title="Disconnect Sync?"
  message="This will remove this device from the sync group. Other devices will not be affected. You will need to re-pair to sync again."
  confirmText="Disconnect"
  type="danger"
  on:confirm={handleDisconnectConfirm}
/>

<style>
  /* Using consistent full-screen modal styles from app.css */
  .modal-header {
    display: grid;
    grid-template-columns: var(--touch-target-min) 1fr var(--touch-target-min);
    align-items: center;
    padding: var(--spacing-lg);
    background-color: var(--primary-color);
    color: white;
  }
  .back-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    display: flex;
  }
  .modal-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
  }
  .modal-body {
    padding: var(--spacing-xl);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
  }
  .section-title {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-sm) 0;
    padding-bottom: var(--spacing-xs);
    border-bottom: 1px solid var(--divider);
  }
  .section-desc {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin: 0 0 var(--spacing-md) 0;
  }
  .status-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .status-label {
    color: var(--text-secondary);
  }
  .status-value {
    font-weight: 500;
    color: var(--text-primary);
  }
  .status-value.status-synced {
    color: var(--success-color);
  }
  .status-value.status-error {
    color: var(--error-color);
  }
  .url-display {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
  .url-input {
    flex: 1;
    padding: var(--spacing-md);
    border: 1px solid var(--divider);
    border-radius: 4px;
    font-size: var(--font-size-sm);
  }
  .copy-btn {
    background: var(--surface-variant);
    border: 1px solid var(--divider);
    cursor: pointer;
    padding: 0 var(--spacing-md);
    border-radius: 4px;
  }
  .qr-toggle-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--surface-variant);
    border: 1px solid var(--divider);
    border-radius: 4px;
    cursor: pointer;
  }
  .qr-code-wrapper {
    text-align: center;
    margin-top: var(--spacing-lg);
  }
  .qr-code-wrapper img {
    max-width: 200px;
    border-radius: 8px;
  }
  .danger-zone {
    border-top: 1px solid var(--divider);
    padding-top: var(--spacing-lg);
  }
  .no-sync-view {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-xl) 0;
  }
  .no-sync-icon {
    font-size: 48px;
    color: var(--text-secondary);
  }
  .no-sync-view h3 {
    margin: 0;
    font-size: var(--font-size-xl);
  }
  .no-sync-view p {
    color: var(--text-secondary);
    max-width: 30ch;
    margin-bottom: var(--spacing-md);
  }
  .button-group,
  .join-input-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
  }
  .join-input-group {
    margin-top: var(--spacing-lg);
  }
  .btn {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-sm);
  }
  .btn-primary {
    background: var(--primary-color);
    color: white;
    border: 1px solid var(--primary-color);
  }
  .btn-secondary {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--divider);
  }
  .btn-danger {
    background: var(--error-alpha-10);
    color: var(--error-color);
    border: 1px solid var(--error-color);
  }
</style>

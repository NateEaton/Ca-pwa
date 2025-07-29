<script>
  import { createEventDispatcher } from "svelte";

  export let show = false;
  export let title = "Confirm Action";
  export let message = "Are you sure?";
  export let confirmText = "Confirm";
  export let cancelText = "Cancel";
  export let type = "default"; // 'default', 'danger', 'warning'

  const dispatch = createEventDispatcher();

  function handleConfirm() {
    dispatch("confirm");
    show = false;
  }

  function handleCancel() {
    dispatch("cancel");
    show = false;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      handleCancel();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div class="modal-overlay" on:click={handleBackdropClick}>
    <div class="confirm-dialog" class:danger={type === 'danger'} class:warning={type === 'warning'}>
      <div class="dialog-icon">
        {#if type === 'danger'}
          <span class="material-icons">warning</span>
        {:else if type === 'warning'}
          <span class="material-icons">help_outline</span>
        {:else}
          <span class="material-icons">info</span>
        {/if}
      </div>

      <div class="dialog-content">
        <h3 class="dialog-title">{title}</h3>
        <p class="dialog-message">{message}</p>
      </div>

      <div class="dialog-actions">
        <button class="btn btn-secondary" on:click={handleCancel}>
          {cancelText}
        </button>
        <button 
          class="btn" 
          class:btn-danger={type === 'danger'}
          class:btn-warning={type === 'warning'}
          class:btn-primary={type === 'default'}
          on:click={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1500;
    padding: 1rem;
  }

  .confirm-dialog {
    background: var(--surface);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 400px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .dialog-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--info-color, #2196F3);
    color: white;
  }

  .confirm-dialog.danger .dialog-icon {
    background: var(--error-color, #F44336);
  }

  .confirm-dialog.warning .dialog-icon {
    background: var(--warning-color, #FF9800);
  }

  .dialog-icon .material-icons {
    font-size: 24px;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .dialog-message {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
  }

  .dialog-actions {
    display: flex;
    gap: 1rem;
    width: 100%;
    margin-top: 0.5rem;
  }

  .btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary {
    background: var(--surface-variant);
    color: var(--text-primary);
    border: 1px solid var(--divider);
  }

  .btn-secondary:hover {
    background: var(--divider);
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-color-dark, #1565C0);
  }

  .btn-danger {
    background: var(--error-color, #F44336);
    color: white;
  }

  .btn-danger:hover {
    background: #d32f2f;
  }

  .btn-warning {
    background: var(--warning-color, #FF9800);
    color: white;
  }

  .btn-warning:hover {
    background: #f57c00;
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .modal-overlay {
      padding: 0.5rem;
    }

    .confirm-dialog {
      padding: 1.25rem;
    }

    .dialog-actions {
      flex-direction: column-reverse;
    }

    .btn {
      width: 100%;
    }
  }
</style>
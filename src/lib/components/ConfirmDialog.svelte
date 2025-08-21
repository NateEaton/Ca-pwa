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

  /** Whether the dialog is visible */
  export let show = false;
  /** The title displayed at the top of the dialog */
  export let title = "Confirm Action";
  /** The message content shown to the user */
  export let message = "Are you sure?";
  /** Text for the confirm button */
  export let confirmText = "Confirm";
  /** Text for the cancel button */
  export let cancelText = "Cancel";
  /** Dialog type affecting styling and icon - 'default', 'danger', 'warning' */
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

  function handleBackdropKeydown(event) {
    if (event.key === "Escape") {
      handleCancel();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div class="modal-overlay" on:click={handleBackdropClick} on:keydown={handleBackdropKeydown} role="button" tabindex="0">
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
    background: var(--modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1500;
    padding: var(--spacing-lg);
  }

  .confirm-dialog {
    background: var(--surface);
    border-radius: var(--spacing-md);
    box-shadow: var(--shadow-lg);
    width: 80%;
    max-width: 24rem; /* 384px equivalent - 80% of 30rem app container */
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-lg);
  }

  .dialog-icon {
    width: 3rem; /* 48px equivalent */
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--info-color);
    color: white;
  }

  .confirm-dialog.danger .dialog-icon {
    background: var(--error-color);
  }

  .confirm-dialog.warning .dialog-icon {
    background: var(--warning-color);
  }

  .dialog-icon .material-icons {
    font-size: var(--icon-size-lg);
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .dialog-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .dialog-message {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
  }

  .dialog-actions {
    display: flex;
    gap: var(--spacing-lg);
    width: 100%;
    margin-top: var(--spacing-sm);
  }

  .btn {
    flex: 1;
    padding: var(--spacing-md) var(--spacing-2xl);
    border: none;
    border-radius: var(--spacing-sm);
    font-size: var(--font-size-base);
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
    background: var(--primary-color-dark);
  }

  .btn-danger {
    background: var(--error-color);
    color: white;
  }

  .btn-danger:hover {
    background: var(--error-color-dark, #d32f2f);
  }

  .btn-warning {
    background: var(--warning-color);
    color: white;
  }

  .btn-warning:hover {
    background: var(--warning-color-dark, #f57c00);
  }

  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
    .modal-overlay {
      padding: var(--spacing-sm);
    }

    .confirm-dialog {
      padding: var(--spacing-xl);
    }

    .dialog-actions {
      flex-direction: column-reverse;
    }

    .btn {
      width: 100%;
    }
  }
</style>
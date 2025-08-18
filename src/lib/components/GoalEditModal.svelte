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
  import { calciumState, calciumService } from "$lib/stores/calcium";

  export let show = false;
  export let currentGoal = 1000;

  const dispatch = createEventDispatcher();

  let goalInput = currentGoal;
  let isSubmitting = false;
  let errorMessage = "";

  // Reset form when modal opens
  $: if (show) {
    goalInput = currentGoal;
    errorMessage = "";
    isSubmitting = false;
  }

  function handleClose() {
    if (!isSubmitting) {
      show = false;
      dispatch("close");
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate goal
    const newGoal = parseInt(goalInput);
    
    if (isNaN(newGoal) || newGoal < 100 || newGoal > 5000) {
      errorMessage = "Goal must be between 100 and 5000 mg";
      return;
    }

    isSubmitting = true;
    errorMessage = "";

    try {
      // Update goal via service
      await calciumService.updateSettings({ dailyGoal: newGoal });
      
      // Close modal and dispatch success
      show = false;
      dispatch("goalUpdated", { newGoal });
      dispatch("close");
      
    } catch (error) {
      console.error("Error updating goal:", error);
      errorMessage = "Failed to update goal. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if show}
  <div class="modal-overlay" on:click={handleBackdropClick}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <button 
          class="back-btn" 
          on:click={handleClose}
          disabled={isSubmitting}
        >
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 class="modal-title">Set Daily Goal</h2>
      </div>

      <div class="modal-body">
        <form on:submit={handleSubmit}>
          <div class="form-group">
            <label for="goalInput" class="form-label">
              Daily Calcium Goal (mg)
            </label>
            <input
              id="goalInput"
              type="number"
              class="form-input"
              class:error={errorMessage}
              bind:value={goalInput}
              placeholder="1000"
              min="100"
              max="5000"
              step="50"
              required
              disabled={isSubmitting}
            />
            {#if errorMessage}
              <div class="error-message">{errorMessage}</div>
            {/if}
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-secondary"
              on:click={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              disabled={isSubmitting}
            >
              {#if isSubmitting}
                <span class="material-icons spin">hourglass_empty</span>
                Saving...
              {:else}
                Save
              {/if}
            </button>
          </div>
        </form>
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
    z-index: 1000;
    padding: var(--spacing-lg);
  }

  .modal-content {
    background: var(--surface);
    border-radius: var(--spacing-md);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 25rem; /* 400px equivalent */
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    padding: var(--spacing-lg) var(--spacing-2xl);
    border-bottom: 1px solid var(--divider);
    background: var(--surface-variant);
  }

  .back-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    margin-right: var(--spacing-lg);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-btn:hover:not(:disabled) {
    background: var(--divider);
    color: var(--text-primary);
  }

  .back-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .modal-body {
    padding: var(--spacing-2xl);
    flex: 1;
    overflow-y: auto;
  }

  .form-group {
    margin-bottom: var(--spacing-2xl);
  }

  .form-label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: var(--text-primary);
    font-size: var(--font-size-sm);
  }

  .form-input {
    width: 100%;
    padding: var(--spacing-md);
    border: 2px solid var(--divider);
    border-radius: var(--spacing-sm);
    font-size: var(--font-size-base);
    background: var(--background);
    color: var(--text-primary);
    transition: all 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.1875rem var(--primary-alpha-10); /* 3px equivalent */
  }

  .form-input.error {
    border-color: var(--error-color);
  }

  .form-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: var(--error-color);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .modal-actions {
    display: flex;
    gap: var(--spacing-lg);
    justify-content: flex-end;
    margin-top: var(--spacing-3xl);
  }

  .btn {
    padding: var(--spacing-md) var(--spacing-2xl);
    border: none;
    border-radius: var(--spacing-sm);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    min-width: 5rem; /* 80px equivalent */
    justify-content: center;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: var(--surface-variant);
    color: var(--text-primary);
    border: 1px solid var(--divider);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--divider);
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--primary-color-dark);
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
    .modal-overlay {
      padding: var(--spacing-sm);
    }

    .modal-content {
      max-height: 95vh;
    }

    .modal-header {
      padding: var(--spacing-lg);
    }

    .modal-body {
      padding: var(--spacing-lg);
    }

    .btn {
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-sm);
    }

    .modal-actions {
      flex-direction: column-reverse;
      gap: var(--spacing-md);
    }

    .btn {
      width: 100%;
    }
  }
</style>

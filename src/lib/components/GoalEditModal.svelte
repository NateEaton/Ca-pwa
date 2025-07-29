<script>
  import { createEventDispatcher } from "svelte";
  import { CalciumService } from "$lib/services/CalciumService";
  import { calciumState } from "$lib/stores/calcium";

  export let show = false;
  export let currentGoal = 1000;

  const dispatch = createEventDispatcher();
  const calciumService = new CalciumService();

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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: var(--surface);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 400px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--divider);
    background: var(--surface-variant);
  }

  .back-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    margin-right: 1rem;
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
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .modal-body {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.9rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--divider);
    border-radius: 8px;
    font-size: 1rem;
    background: var(--background);
    color: var(--text-primary);
    transition: all 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
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
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 80px;
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
    background: var(--primary-color-dark, #1565C0);
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .modal-overlay {
      padding: 0.5rem;
    }

    .modal-content {
      max-height: 95vh;
    }

    .modal-header {
      padding: 1rem;
    }

    .modal-body {
      padding: 1rem;
    }

    .btn {
      padding: 0.875rem 1.25rem;
      font-size: 0.9rem;
    }

    .modal-actions {
      flex-direction: column-reverse;
      gap: 0.75rem;
    }

    .btn {
      width: 100%;
    }
  }
</style>

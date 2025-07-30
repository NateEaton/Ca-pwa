<script>
  import { createEventDispatcher } from "svelte";
  import ConfirmDialog from "./ConfirmDialog.svelte";

  export let food;
  export let index;

  const dispatch = createEventDispatcher();

  let showDeleteConfirm = false;

  function handleEdit() {
    dispatch("edit", { food, index });
  }

  function handleDeleteClick() {
    showDeleteConfirm = true;
  }

  function handleDeleteConfirm() {
    dispatch("delete", { food, index });
    showDeleteConfirm = false;
  }

  function handleDeleteCancel() {
    showDeleteConfirm = false;
  }
</script>

<div class="food-entry" class:custom-food={food.isCustom}>
  <div class="food-main">
    <div class="food-info">
      <div class="food-name">
        {food.name}
      </div>
      <div class="food-details">
        {food.servingQuantity}
        {food.servingUnit}
        {#if food.note}
          • {food.note}
        {/if}
      </div>
    </div>

    <div class="food-calcium">
      <span class="calcium-amount">{food.calcium}</span>
      <span class="calcium-unit">mg</span>
    </div>
  </div>

  <div class="food-actions">
    <button class="action-btn edit" on:click={handleEdit} title="Edit food">
      <span class="material-icons">edit</span>
    </button>
    <button
      class="action-btn delete"
      on:click={handleDeleteClick}
      title="Delete food"
    >
      <span class="material-icons">delete</span>
    </button>
  </div>
</div>

<ConfirmDialog
  bind:show={showDeleteConfirm}
  title="Delete Food"
  message={food.name}
  confirmText="Delete"
  cancelText="Cancel"
  type="danger"
  on:confirm={handleDeleteConfirm}
  on:cancel={handleDeleteCancel}
/>

<style>
  .food-entry {
    background: var(--surface);
    border: 1px solid var(--divider);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.5rem;
    transition: all 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .food-entry:hover {
    box-shadow: var(--shadow);
  }

  .food-entry.custom-food {
    background: var(--custom-food-bg);
    border-left: 3px solid var(--secondary-color);
  }

  .food-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    gap: 1rem;
  }

  .food-info {
    flex: 1;
  }

  .food-name {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .custom-badge {
    background: var(--secondary-color, #ffc107);
    color: var(--text-primary);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.125rem 0.5rem;
    border-radius: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .food-details {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .food-calcium {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  .calcium-amount {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--primary-color);
  }

  .calcium-unit {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .food-actions {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
    margin-left: 1rem;
  }

  .action-btn {
    background: none;
    border: none;
    padding: 0.375rem;
    border-radius: 50%;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    min-height: 32px;
  }

  .action-btn:hover {
    background-color: var(--surface-variant);
  }

  .action-btn.edit:hover {
    color: var(--primary-color);
    background-color: var(--primary-alpha-10);
  }

  .action-btn.delete:hover {
    color: var(--error-color, #f44336);
    background-color: var(--error-alpha-10);
  }

  .action-btn .material-icons {
    font-size: 18px;
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .food-entry {
      padding: 0.875rem;
      flex-direction: column;
      align-items: stretch;
    }

    .food-main {
      margin-bottom: 0.5rem;
    }

    .food-actions {
      align-self: flex-end;
      margin-left: 0;
    }

    .food-name {
      font-size: 0.95rem;
    }

    .food-details {
      font-size: 0.85rem;
    }

    .calcium-amount {
      font-size: 1.125rem;
    }

    .action-btn {
      min-width: 28px;
      min-height: 28px;
      padding: 0.25rem;
    }

    .action-btn .material-icons {
      font-size: 16px;
    }
  }
</style>

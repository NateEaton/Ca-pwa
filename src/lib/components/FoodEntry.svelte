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
    border-radius: var(--spacing-sm);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
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
    gap: var(--spacing-lg);
  }

  .food-info {
    flex: 1;
  }

  .food-name {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .custom-badge {
    background: var(--secondary-color);
    color: var(--text-primary);
    font-size: var(--font-size-xs);
    font-weight: 500;
    padding: 0.125rem var(--spacing-sm);
    border-radius: 0.625rem; /* 10px equivalent */
    text-transform: uppercase;
    letter-spacing: 0.03125rem;
  }

  .food-details {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .food-calcium {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-xs);
    flex-shrink: 0;
  }

  .calcium-amount {
    font-size: var(--font-size-xl);
    font-weight: bold;
    color: var(--primary-color);
  }

  .calcium-unit {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }

  .food-actions {
    display: flex;
    gap: var(--spacing-xs);
    flex-shrink: 0;
    margin-left: var(--spacing-lg);
  }

  .action-btn {
    background: none;
    border: none;
    padding: var(--spacing-sm);
    border-radius: 50%;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem; /* 32px equivalent */
    min-height: 2rem;
  }

  .action-btn:hover {
    background-color: var(--surface-variant);
  }

  .action-btn.edit:hover {
    color: var(--primary-color);
    background-color: var(--primary-alpha-10);
  }

  .action-btn.delete:hover {
    color: var(--error-color);
    background-color: var(--error-alpha-10);
  }

  .action-btn .material-icons {
    font-size: var(--icon-size-md);
  }

  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
    .food-entry {
      padding: var(--spacing-md);
      flex-direction: column;
      align-items: stretch;
    }

    .food-main {
      margin-bottom: var(--spacing-sm);
    }

    .food-actions {
      align-self: flex-end;
      margin-left: 0;
    }

    .food-name {
      font-size: var(--font-size-sm);
    }

    .food-details {
      font-size: var(--font-size-xs);
    }

    .calcium-amount {
      font-size: var(--font-size-lg);
    }

    .action-btn {
      min-width: 1.75rem; /* 28px equivalent */
      min-height: 1.75rem;
      padding: var(--spacing-xs);
    }

    .action-btn .material-icons {
      font-size: var(--icon-size-sm);
    }
  }
</style>

<script>
  import { createEventDispatcher } from "svelte";

  export let food;
  export let index;

  const dispatch = createEventDispatcher();

  function handleCardClick() {
    dispatch("edit", { food, index });
  }

  function handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  }
</script>

<div class="food-entry" class:custom-food={food.isCustom} on:click={handleCardClick} on:keydown={handleKeydown} role="button" tabindex="0">
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
      <span class="calcium-amount">{Math.round(food.calcium)}</span>
      <span class="calcium-unit">mg</span>
    </div>
  </div>
</div>

<style>
  .food-entry {
    background: var(--surface);
    border: 1px solid var(--divider);
    border-radius: var(--spacing-sm);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    transition: all 0.2s;
    cursor: pointer;
  }

  .food-entry:hover {
    box-shadow: var(--shadow);
    background-color: var(--surface-variant);
  }

  .food-entry.custom-food {
    background: var(--custom-food-bg);
    border-left: 3px solid var(--secondary-color);
  }

  .food-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    font-size: var(--font-size-base);
  }


  .food-details {
    font-size: var(--font-size-base);
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


  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
    .food-entry {
      padding: var(--spacing-md);
    }

    .food-name {
      font-size: var(--font-size-base);
    }

    .food-details {
      font-size: var(--font-size-base);
    }

    .calcium-amount {
      font-size: var(--font-size-lg);
    }
  }
</style>

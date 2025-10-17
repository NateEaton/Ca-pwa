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
  import { formatCalcium } from "$lib/data/foodDatabase";
  import SourceIndicator from "./SourceIndicator.svelte";
  import MetadataPopup from "./MetadataPopup.svelte";

  export let food;
  export let index;

  const dispatch = createEventDispatcher();

  let showMetadataPopup = false;

  function handleCardClick() {
    dispatch("edit", { food, index });
  }

  function handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  }

  function handleInfoClick(event) {
    event.stopPropagation(); // Prevent card click
    showMetadataPopup = true;
  }
</script>

<div
  class="food-entry"
  class:custom-food={food.isCustom}
  on:click={handleCardClick}
  on:keydown={handleKeydown}
  role="button"
  tabindex="0"
>
  <div class="food-main">
    <div class="food-info">
      <div class="food-name">
        {food.name}
        {#if food.isCustom && food.sourceMetadata}
          <SourceIndicator {food} size="small" clickable={true} on:click={handleInfoClick} />
        {/if}
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
      <span class="calcium-amount">{formatCalcium(food.calcium)}</span>
      <span class="calcium-unit">mg</span>
    </div>
  </div>
</div>

<!-- Metadata popup for custom foods -->
{#if food.isCustom && food.sourceMetadata}
  <MetadataPopup
    bind:show={showMetadataPopup}
    food={food}
    on:close={() => showMetadataPopup = false}
  />
{/if}

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

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
  import {
    calciumState,
    foods,
    dailyTotal,
    dailyGoal,
    calciumService,
  } from "$lib/stores/calcium";
  import FoodEntry from "$lib/components/FoodEntry.svelte";
  import SummaryCard from "$lib/components/SummaryCard.svelte";
  import SortControls from "$lib/components/SortControls.svelte";
  import AddFoodModal from "$lib/components/AddFoodModal.svelte";

  let showAddModal = false;
  let editingFood = null;
  let editingIndex = -1;

  function handleAddFood() {
    editingFood = null;
    editingIndex = -1;
    showAddModal = true;
  }

  async function handleSortChange(event) {
    const { sortBy } = event.detail;
    // Map UI sort types to service sort types
    const sortMapping = {
      added: "time",
      name: "name",
      calcium: "calcium",
    };
    const serviceSortBy = sortMapping[sortBy] || sortBy;
    await calciumService.updateSort(serviceSortBy);
  }

  function handleEditFood(event) {
    editingFood = event.detail.food;
    editingIndex = event.detail.index;
    showAddModal = true;
  }

  async function handleDeleteFood(event) {
    await calciumService.removeFood(event.detail.index);
  }

  async function handleDateChange(event) {
    await calciumService.changeDate(event.detail.date);
  }

  function handleFoodAdded() {
    showAddModal = false;
  }

  function handleFoodUpdated() {
    showAddModal = false;
    editingFood = null;
    editingIndex = -1;
  }

  function handleModalClose() {
    showAddModal = false;
    editingFood = null;
    editingIndex = -1;
  }
</script>

<svelte:head>
  <title>My Calcium</title>
</svelte:head>

<div class="page-container">
  <!-- Summary Card -->
  <SummaryCard
    currentDate={$calciumState.currentDate}
    dailyTotal={$dailyTotal}
    dailyGoal={$dailyGoal}
    on:dateChange={handleDateChange}
  />

  <!-- Sort Controls -->
  {#if $foods.length > 1}
    <SortControls on:sortChange={handleSortChange} />
  {/if}

  <!-- Foods List -->
  <div class="foods-section">
    <div class="foods-list">
      {#each $foods as food, index (food.timestamp + index)}
        <FoodEntry
          {food}
          {index}
          on:edit={handleEditFood}
          on:delete={handleDeleteFood}
        />
      {:else}
        <div class="empty-state">
          <div class="empty-icon">🥛</div>
          <div class="empty-text">
            <h3>No foods logged today</h3>
            <p>Start tracking your calcium intake by adding your first food!</p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- FAB Container -->
  <div class="fab-container">
    <button class="fab" id="addFab" title="Add Food" on:click={handleAddFood}>
      <span class="fab-icon material-icons">add</span>
    </button>
  </div>
</div>

<!-- Modals -->
{#if showAddModal}
  <AddFoodModal
    bind:show={showAddModal}
    {editingFood}
    {editingIndex}
    on:foodAdded={handleFoodAdded}
    on:foodUpdated={handleFoodUpdated}
    on:close={handleModalClose}
  />
{/if}

<style>
  .page-container {
    position: relative;
    min-height: 100vh;
    padding-bottom: 5rem; /* 80px equivalent */
    background-color: var(--background);
  }

  .foods-section {
    margin: 0 var(--spacing-lg);
  }

  .foods-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-3xl) var(--spacing-lg);
    color: var(--text-secondary);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-2xl);
    opacity: 0.7;
  }

  .empty-text h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }

  .empty-text p {
    font-size: var(--font-size-base);
    line-height: 1.5;
    color: var(--text-secondary);
    margin: 0;
    max-width: 18.75rem; /* 300px equivalent */
    margin-left: auto;
    margin-right: auto;
  }

  /* Floating Action Button Container */
  .fab-container {
    position: fixed;
    bottom: max(var(--spacing-xl), env(safe-area-inset-bottom));
    right: max(var(--spacing-xl), env(safe-area-inset-right));
    left: max(var(--spacing-xl), env(safe-area-inset-left));
    max-width: 27.5rem; /* 440px equivalent */
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    pointer-events: none;
  }

  .fab-container .fab {
    pointer-events: auto;
    background: var(--primary-color);
    color: white;
    border: none;
    box-shadow: var(--shadow-lg);
    width: 3.5rem; /* 56px equivalent */
    height: 3.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fab-container .fab:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-lg);
  }

  .fab-container .fab .fab-icon {
    font-size: var(--icon-size-lg);
    font-family: "Material Icons";
  }

  /* Mobile responsive */
  @media (max-width: 30rem) {
    /* 480px equivalent */
    .foods-section {
      margin: 0 var(--spacing-sm);
    }

    .empty-state {
      padding: var(--spacing-3xl) var(--spacing-lg);
    }

    .empty-icon {
      font-size: 3rem;
    }

    .fab-container {
      bottom: max(var(--spacing-md), env(safe-area-inset-bottom));
      right: max(var(--spacing-xl), env(safe-area-inset-right));
      left: max(var(--spacing-xl), env(safe-area-inset-left));
      max-width: 100%;
      padding: 0 var(--spacing-sm);
    }

    .fab-container .fab .fab-icon {
      font-size: var(--icon-size-lg);
    }
  }
</style>

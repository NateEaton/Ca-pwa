<script>
  import {
    calciumState,
    foods,
    dailyTotal,
    dailyGoal,
  } from "$lib/stores/calcium";
  import { CalciumService } from "$lib/services/CalciumService";
  import FoodEntry from "$lib/components/FoodEntry.svelte";
  import SummaryCard from "$lib/components/SummaryCard.svelte";
  import SortControls from "$lib/components/SortControls.svelte";
  import AddFoodModal from "$lib/components/AddFoodModal.svelte";
  import GoalEditModal from "$lib/components/GoalEditModal.svelte";

  let showAddModal = false;
  let showGoalModal = false;
  let editingFood = null;
  let editingIndex = -1;
  let calciumService = new CalciumService();

  function handleAddFood() {
    editingFood = null;
    editingIndex = -1;
    showAddModal = true;
  }

  function handleGoalEdit() {
    showGoalModal = true;
  }

  function handleGoalUpdated() {
    showGoalModal = false;
  }

  async function handleSortChange(event) {
    const { sortBy } = event.detail;
    await calciumService.updateSort(sortBy);
  }

  function handleEditFood(event) {
    editingFood = event.detail.food;
    editingIndex = event.detail.index; // Now correctly from sorted array
    showAddModal = true;
  }

  async function handleDeleteFood(event) {
    await calciumService.removeFood(event.detail.index); // Now correctly from sorted array
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
  <title>Daily Calcium Tracker</title>
</svelte:head>

<div class="page-container">
  <!-- Summary Card with goal editing -->
  <SummaryCard
    currentDate={$calciumState.currentDate}
    dailyTotal={$dailyTotal}
    dailyGoal={$dailyGoal}
    on:dateChange={handleDateChange}
    on:goalEdit={handleGoalEdit}
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

{#if showGoalModal}
  <GoalEditModal
    bind:show={showGoalModal}
    currentGoal={$dailyGoal}
    on:goalUpdated={handleGoalUpdated}
  />
{/if}

<style>
  .page-container {
    position: relative;
    min-height: 100vh;
    padding-bottom: 80px;
    background-color: var(--background);
  }

  .foods-section {
    margin: 0 1rem;
  }

  .foods-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-secondary);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }

  .empty-text h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.75rem 0;
  }

  .empty-text p {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text-secondary);
    margin: 0;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Floating Action Button Container */
  .fab-container {
    position: fixed;
    bottom: max(1.25rem, env(safe-area-inset-bottom));
    right: max(1.25rem, env(safe-area-inset-right));
    left: max(1.25rem, env(safe-area-inset-left));
    max-width: 27.5rem;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    pointer-events: none;
    gap: 0.75rem;
  }

  .fab-container .fab {
    pointer-events: auto;
    background: var(--primary-color);
    color: white;
    border: none;
    box-shadow: var(--shadow-lg);
    width: 56px;
    height: 56px;
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
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .fab-container .fab .fab-icon {
    font-size: 1.5rem;
    font-family: "Material Icons";
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .foods-section {
      margin: 0 0.5rem;
    }

    .empty-state {
      padding: 2rem 1rem;
    }

    .empty-icon {
      font-size: 3rem;
    }

    .fab-container {
      bottom: max(0.75rem, env(safe-area-inset-bottom));
      right: max(2rem, env(safe-area-inset-right));
      left: auto;
      max-width: 100%;
    }

    .fab-container .fab .fab-icon {
      font-size: 1.25rem;
    }
  }
</style>

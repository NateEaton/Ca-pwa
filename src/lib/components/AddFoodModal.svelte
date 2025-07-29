<script>
  import { createEventDispatcher } from "svelte";
  import { CalciumService } from "$lib/services/CalciumService";
  import FoodSearch from "./FoodSearch.svelte";
  import { parseServingSize } from "$lib/data/usdaCalciumData";

  export let show = false;
  export let editingFood = null; // For edit mode
  export let editingIndex = -1;

  const dispatch = createEventDispatcher();
  const calciumService = new CalciumService();

  let isCustomMode = false;
  let selectedFood = null;
  let searchQuery = "";
  let isSubmitting = false;
  let errorMessage = "";

  // Form fields
  let foodName = "";
  let calcium = "";
  let servingQuantity = 1;
  let servingUnit = "serving";

  // Reactive calculations
  $: adjustedCalcium =
    selectedFood && servingQuantity
      ? Math.round(
          (selectedFood.calcium * servingQuantity) /
            parseServingSize(selectedFood.measure).quantity
        )
      : null;

  // Reset form when modal opens or editing changes
  $: if (show) {
    resetForm();
  }

  function resetForm() {
    if (editingFood) {
      // Edit mode - populate with existing data
      isCustomMode = editingFood.isCustom || false;
      foodName = editingFood.name;
      calcium = editingFood.calcium.toString();
      servingQuantity = editingFood.servingQuantity;
      servingUnit = editingFood.servingUnit;
      selectedFood = null;
      searchQuery = "";
    } else {
      // Add mode - reset everything
      isCustomMode = false;
      selectedFood = null;
      searchQuery = "";
      foodName = "";
      calcium = "";
      servingQuantity = 1;
      servingUnit = "serving";
    }
    errorMessage = "";
    isSubmitting = false;
  }

  function toggleMode() {
    isCustomMode = !isCustomMode;
    if (isCustomMode) {
      selectedFood = null;
      searchQuery = "";
    } else {
      foodName = "";
      calcium = "";
      servingUnit = "serving";
    }
  }

  function handleFoodSelected(event) {
    const food = event.detail;
    selectedFood = food;
    const parsed = parseServingSize(food.measure);

    foodName = food.name;
    servingUnit = parsed.unit;
    servingQuantity = 1;

    // Calculate calcium for 1 serving
    const calciumFor1 = Math.round(food.calcium / parsed.quantity);
    calcium = calciumFor1.toString();
  }

  function handleSearchCleared() {
    selectedFood = null;
    foodName = "";
    calcium = "";
    servingUnit = "serving";
  }

  function closeModal() {
    if (!isSubmitting) {
      show = false;
      editingFood = null;
      editingIndex = -1;
      dispatch("close");
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    // Validation
    if (!foodName.trim()) {
      errorMessage = "Food name is required";
      return;
    }

    const calciumValue =
      selectedFood && servingQuantity ? adjustedCalcium : parseInt(calcium);

    if (!calciumValue || calciumValue <= 0) {
      errorMessage = "Valid calcium amount is required";
      return;
    }

    if (!servingQuantity || servingQuantity <= 0) {
      errorMessage = "Valid serving quantity is required";
      return;
    }

    isSubmitting = true;
    errorMessage = "";

    try {
      const foodData = {
        name: foodName.trim(),
        calcium: calciumValue,
        servingQuantity: parseFloat(servingQuantity),
        servingUnit: servingUnit.trim(),
        isCustom: isCustomMode,
      };

      if (editingFood && editingIndex >= 0) {
        // Edit existing food
        await calciumService.updateFood(editingIndex, foodData);
        dispatch("foodUpdated", { food: foodData, index: editingIndex });
      } else {
        // Add new food
        await calciumService.addFood(foodData);
        dispatch("foodAdded", foodData);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving food:", error);
      errorMessage = "Failed to save food. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div class="modal-backdrop" on:click={handleBackdropClick}>
    <div class="modal-content">
      <div class="modal-header">
        <button class="back-btn" on:click={closeModal} disabled={isSubmitting}>
          <span class="material-icons">arrow_back</span>
        </button>

        <h2 class="modal-title">
          {editingFood ? "Edit Food" : "Add Food"}
        </h2>

        <button
          class="mode-toggle"
          class:active={isCustomMode}
          on:click={toggleMode}
          disabled={isSubmitting || editingFood}
          title={isCustomMode
            ? "Switch to Search Mode"
            : "Switch to Custom Mode"}
        >
          <span class="material-icons">
            {isCustomMode ? "search" : "add_circle"}
          </span>
        </button>
      </div>

      <form class="modal-body" on:submit|preventDefault={handleSubmit}>
        <!-- Food Search Section (only in add mode) -->
        {#if !isCustomMode && !editingFood}
          <div class="form-group">
            <label>Search for Food</label>
            <FoodSearch
              bind:searchQuery
              on:foodSelected={handleFoodSelected}
              on:searchCleared={handleSearchCleared}
            />
          </div>
        {/if}

        <!-- Selected Food Info -->
        {#if selectedFood}
          <div class="selected-food-info">
            <span class="material-icons">info</span>
            Base: {selectedFood.calcium}mg per {selectedFood.measure}
          </div>
        {/if}

        <!-- Food Name -->
        <div class="form-group">
          <label for="foodName">Food Name *</label>
          <input
            type="text"
            id="foodName"
            bind:value={foodName}
            placeholder={isCustomMode
              ? "Enter food name"
              : selectedFood
                ? selectedFood.name
                : "Search or enter food name"}
            required
            disabled={isSubmitting || (selectedFood && !isCustomMode)}
          />
        </div>

        <!-- Serving Size -->
        <div class="form-row">
          <div class="form-group">
            <label for="servingQuantity">Quantity *</label>
            <input
              type="number"
              id="servingQuantity"
              bind:value={servingQuantity}
              placeholder="1"
              min="0.01"
              step="0.01"
              required
              disabled={isSubmitting}
            />
          </div>
          <div class="form-group">
            <label for="servingUnit">Unit *</label>
            <input
              type="text"
              id="servingUnit"
              bind:value={servingUnit}
              placeholder="cups"
              required
              disabled={isSubmitting}
              readonly={selectedFood && !isCustomMode}
            />
          </div>
        </div>

        <!-- Calcium Amount -->
        <div class="form-group">
          <label for="calcium">
            Calcium (mg) *
            {#if selectedFood && adjustedCalcium}
              <span class="calcium-calculation">
                = {adjustedCalcium}mg for {servingQuantity}
                {servingUnit}
              </span>
            {/if}
          </label>
          <input
            type="number"
            id="calcium"
            bind:value={calcium}
            placeholder="100"
            min="0"
            step="1"
            required
            disabled={isSubmitting || (selectedFood && !isCustomMode)}
          />
        </div>

        <!-- Error Message -->
        {#if errorMessage}
          <div class="error-message">
            <span class="material-icons">error</span>
            {errorMessage}
          </div>
        {/if}

        <!-- Actions -->
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-secondary"
            on:click={closeModal}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
            {#if isSubmitting}
              <span class="material-icons spin">hourglass_empty</span>
              Saving...
            {:else}
              {editingFood ? "Update" : "Add"} Food
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
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
    max-width: 500px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--divider);
    background: var(--surface-variant);
    flex-shrink: 0;
  }

  .back-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
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

  .mode-toggle {
    background: none;
    border: 1px solid var(--divider);
    color: var(--text-secondary);
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mode-toggle:hover:not(:disabled) {
    background: var(--surface-variant);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .mode-toggle.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  .mode-toggle:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-body {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 500;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-group input {
    padding: 0.75rem;
    border: 1px solid var(--divider);
    border-radius: 8px;
    font-size: 1rem;
    background: var(--background);
    color: var(--text-primary);
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .form-group input:disabled {
    background: var(--surface-variant);
    opacity: 0.7;
    cursor: not-allowed;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  .form-row .form-group {
    flex: 1;
  }

  .calcium-calculation {
    color: var(--primary-color);
    font-size: 0.8rem;
    font-weight: normal;
  }

  .selected-food-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--surface-variant);
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .selected-food-info .material-icons {
    font-size: 18px;
    color: var(--info-color, #2196f3);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--error-color, #f44336);
    font-size: 0.9rem;
    padding: 0.5rem;
    background: rgba(244, 67, 54, 0.1);
    border-radius: 6px;
  }

  .error-message .material-icons {
    font-size: 18px;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-shrink: 0;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
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
    background: var(--primary-color-dark, #1565c0);
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Mobile responsive - CRITICAL HEIGHT OPTIMIZATION */
  @media (max-width: 480px) {
    .modal-backdrop {
      padding: 0;
      align-items: flex-start;
    }

    .modal-content {
      max-height: 100vh;
      border-radius: 0;
      margin: 0;
    }

    .modal-header {
      padding: 1rem;
    }

    .modal-body {
      padding: 1rem;
      gap: 0.875rem;
    }

    .modal-title {
      font-size: 1.125rem;
    }

    .form-group input {
      padding: 0.875rem;
      font-size: 16px; /* Prevent iOS zoom */
    }

    .modal-actions {
      flex-direction: column-reverse;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }

    .btn {
      width: 100%;
    }
  }
</style>

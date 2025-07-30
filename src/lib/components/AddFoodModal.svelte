<script>
  import { createEventDispatcher } from "svelte";
  import { CalciumService } from "$lib/services/CalciumService";
  import { searchFoods } from "$lib/data/usdaCalciumData";

  export let show = false;
  export let editingFood = null;
  export let editingIndex = -1;

  const dispatch = createEventDispatcher();
  const calciumService = new CalciumService();

  let isCustomMode = false;
  let isSubmitting = false;
  let errorMessage = "";
  let searchResults = [];
  let showSearchResults = false;
  let searchTimeout;

  // Form fields
  let foodName = "";
  let calcium = "";
  let servingQuantity = 1;
  let servingUnit = "serving";

  // Current selected food data for unit conversion
  let currentFoodData = null;

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
      currentFoodData = null;
    } else {
      // Add mode - reset everything
      isCustomMode = false;
      currentFoodData = null;
      foodName = "";
      calcium = "";
      servingQuantity = 1;
      servingUnit = "serving";
    }
    errorMessage = "";
    isSubmitting = false;
    searchResults = [];
    showSearchResults = false;
  }

  function toggleMode() {
    if (editingFood) return; // Don't allow mode switching when editing

    isCustomMode = !isCustomMode;

    // Clear fields when switching modes but don't call full resetForm
    currentFoodData = null;
    foodName = "";
    calcium = "";
    servingQuantity = 1;
    servingUnit = isCustomMode ? "cups" : "serving";
    searchResults = [];
    showSearchResults = false;
    errorMessage = "";

    if (!isCustomMode) {
      // Focus food name input when switching to search mode
      setTimeout(() => {
        const input = document.getElementById("foodName");
        if (input) input.focus();
      }, 0);
    }
  }

  function handleFoodNameInput() {
    if (isCustomMode || editingFood) {
      // In custom mode or edit mode, just clear search results
      searchResults = [];
      showSearchResults = false;
      return;
    }

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search
    searchTimeout = setTimeout(() => {
      if (foodName.trim().length >= 2) {
        searchResults = searchFoods(foodName.trim());
        showSearchResults = searchResults.length > 0;
      } else {
        searchResults = [];
        showSearchResults = false;
      }
    }, 300);
  }

  function selectFood(food) {
    currentFoodData = food;
    foodName = food.name;
    calcium = food.calcium.toString();

    // Parse serving from USDA measure
    const servingMatch = food.measure.match(/^(\d+(?:\.\d+)?)\s*(.+)/);
    if (servingMatch) {
      servingQuantity = parseFloat(servingMatch[1]);
      servingUnit = servingMatch[2].trim();
    } else {
      servingQuantity = 1;
      servingUnit = food.measure;
    }

    searchResults = [];
    showSearchResults = false;
  }

  function updateCalcium() {
    if (currentFoodData && servingQuantity) {
      // Calculate calcium based on quantity change
      const originalMatch = currentFoodData.measure.match(/^(\d+(?:\.\d+)?)/);
      const originalQuantity = originalMatch ? parseFloat(originalMatch[1]) : 1;
      const newCalcium = Math.round(
        (currentFoodData.calcium * servingQuantity) / originalQuantity
      );
      calcium = newCalcium.toString();
    }
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

    const calciumValue = parseInt(calcium);
    if (!calciumValue || calciumValue <= 0) {
      errorMessage = "Valid calcium amount is required";
      return;
    }

    if (!servingQuantity || servingQuantity <= 0) {
      errorMessage = "Valid serving quantity is required";
      return;
    }

    if (!servingUnit.trim()) {
      errorMessage = "Serving unit is required";
      return;
    }

    isSubmitting = true;
    errorMessage = "";

    try {
      const foodData = {
        name: foodName.trim(),
        calcium: calciumValue,
        servingQuantity: servingQuantity,
        servingUnit: servingUnit.trim(),
        isCustom: isCustomMode,
      };

      if (editingFood) {
        await calciumService.updateFood(editingIndex, foodData);
        dispatch("foodUpdated");
      } else {
        await calciumService.addFood(foodData);
        dispatch("foodAdded");
      }

      closeModal();
    } catch (error) {
      errorMessage = error.message || "Failed to save food";
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if show}
  <div class="modal-backdrop" on:click={closeModal}>
    <div
      class="modal-content"
      on:click|stopPropagation
      class:custom-food-mode={isCustomMode}
    >
      <div class="modal-header">
        <div class="modal-header-left">
          <button
            class="modal-back"
            on:click={closeModal}
            disabled={isSubmitting}
          >
            <span class="material-icons">arrow_back</span>
          </button>
        </div>

        <div class="modal-header-center">
          <h2 class="modal-title">
            {editingFood ? "Update Entry" : "Add Entry"}
          </h2>
        </div>

        <div class="modal-header-right">
          {#if !editingFood}
            <button
              class="custom-food-toggle"
              class:active={isCustomMode}
              on:click={toggleMode}
              disabled={isSubmitting}
              title={isCustomMode ? "Switch to Search Mode" : "Add Custom Food"}
            >
              <span class="material-icons">
                {isCustomMode ? "search" : "add_circle"}
              </span>
            </button>
          {/if}
        </div>
      </div>

      <form class="modal-body" on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label class="form-label">Food Name</label>
          <input
            id="foodName"
            type="text"
            class="form-input"
            bind:value={foodName}
            on:input={handleFoodNameInput}
            placeholder={isCustomMode
              ? "Enter custom food name..."
              : "Start typing to search..."}
            disabled={isSubmitting}
          />

          {#if showSearchResults && !isCustomMode}
            <div class="search-results">
              {#each searchResults as food}
                <div class="search-item" on:click={() => selectFood(food)}>
                  <div class="search-item-name">{food.name}</div>
                  <div class="search-item-details">
                    {food.calcium}mg per {food.measure}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <div class="form-group">
          <label class="form-label">Calcium (mg)</label>
          <input
            type="number"
            class="form-input"
            bind:value={calcium}
            placeholder="0"
            min="1"
            step="1"
            disabled={isSubmitting}
          />
        </div>

        <div class="form-group">
          <label class="form-label">Serving Size</label>
          <div class="serving-row">
            <div class="serving-quantity">
              <input
                type="number"
                class="form-input"
                bind:value={servingQuantity}
                on:input={updateCalcium}
                placeholder="1"
                min="0.01"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
            <div class="serving-unit">
              <input
                type="text"
                class="form-input serving-unit-input"
                bind:value={servingUnit}
                placeholder={isCustomMode ? "cups, oz, etc." : "cups"}
                readonly={!isCustomMode}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {#if errorMessage}
          <div class="error-message">
            <span class="material-icons">error</span>
            {errorMessage}
          </div>
        {/if}

        <div class="button-group">
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
            {/if}
            {editingFood ? "Update" : "Add"}
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
    background: var(--modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: var(--surface);
    border-radius: 8px;
    box-shadow: var(--shadow);
    border: 1px solid var(--divider);
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
    padding: 16px 20px;
    border-bottom: 1px solid var(--divider);
    position: relative;
  }

  .modal-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modal-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .modal-header-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modal-back {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: var(--icon-size-xl, 24px);
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-back:hover:not(:disabled) {
    background: var(--divider);
    color: var(--text-primary);
  }

  .modal-back:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-title {
    font-size: var(--font-size-lg, 18px);
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
  }

  .custom-food-toggle {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: var(--icon-size-lg, 20px);
  }

  .custom-food-toggle:hover:not(:disabled) {
    background-color: var(--divider);
    color: var(--primary-color);
  }

  .custom-food-toggle.active {
    background-color: var(--primary-color);
    color: white;
  }

  .custom-food-toggle:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-body {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
    border-left: 3px solid var(--primary-color);
    background-color: var(--primary-alpha-5);
  }

  .modal-content.custom-food-mode .modal-body {
    border-left: 3px solid var(--secondary-color);
    background-color: var(--custom-food-bg);
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--divider);
    border-radius: 4px;
    font-size: var(--input-font-ideal, 18px);
    background-color: var(--surface);
    color: var(--text-primary);
    transition: border-color 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-alpha-10);
  }

  .form-input:disabled {
    background: var(--surface-variant);
    opacity: 0.7;
    cursor: not-allowed;
  }

  .serving-row {
    display: flex;
    gap: 12px;
    align-items: end;
  }

  .serving-quantity {
    flex: 1;
  }

  .serving-unit {
    flex: 2;
  }

  .serving-unit-input[readonly] {
    background-color: transparent;
    border: 1px solid transparent;
  }

  .custom-food-mode .serving-unit-input {
    background-color: var(--surface);
    border: 1px solid var(--divider);
  }

  .search-results {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid var(--divider);
    border-radius: 4px;
    margin-top: 8px;
    background-color: var(--surface);
  }

  .search-item {
    padding: 12px;
    cursor: pointer;
    border-bottom: 1px solid var(--divider);
    transition: background-color 0.2s ease;
  }

  .search-item:hover {
    background-color: var(--divider);
  }

  .search-item:last-child {
    border-bottom: none;
  }

  .search-item-name {
    font-weight: 500;
    color: var(--text-primary);
  }

  .search-item-details {
    font-size: var(--font-size-sm, 14px);
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--error-color, #f44336);
    font-size: 0.9rem;
    padding: 8px 12px;
    background: var(--error-alpha-10);
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .error-message .material-icons {
    font-size: 18px;
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--font-size-base, 16px);
    font-weight: 500;
    transition: all 0.2s ease;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background-color: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--divider);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--divider);
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--primary-dark, #1565c0);
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

  /* Mobile responsive */
  @media (max-width: 480px) {
    .modal-backdrop {
      align-items: center;
      padding: 1rem;
    }

    .modal-content {
      max-height: 85vh;
    }

    .modal-header {
      padding: 12px 16px;
    }

    .modal-body {
      padding: 16px;
    }

    .form-input {
      font-size: 16px; /* Prevent zoom on iOS */
    }

    .btn {
      padding: 14px 20px;
      font-size: 16px;
    }
  }
</style>

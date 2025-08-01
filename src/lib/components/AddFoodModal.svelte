<script>
  import { createEventDispatcher } from "svelte";
  import { getCalciumServiceSync } from "$lib/services/CalciumServiceSingleton";
  import { calciumState } from "$lib/stores/calcium";
  import { searchFoods } from "$lib/data/foodDatabase";
  import UnitConverter from "$lib/services/UnitConverter.js";

  export let show = false;
  export let editingFood = null;
  export let editingIndex = -1;

  const dispatch = createEventDispatcher();

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
  let isSelectedFromSearch = false;
  
  // Unit conversion
  const unitConverter = new UnitConverter();
  let parsedFoodMeasure = null;
  let unitSuggestions = [];
  let showUnitSuggestions = false;

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
      isSelectedFromSearch = false;
      foodName = "";
      calcium = "";
      servingQuantity = 1;
      servingUnit = "serving";
    }
    errorMessage = "";
    isSubmitting = false;
    searchResults = [];
    showSearchResults = false;
    parsedFoodMeasure = null;
    unitSuggestions = [];
    showUnitSuggestions = false;
  }

  function toggleMode() {
    if (editingFood) return; // Don't allow mode switching when editing

    isCustomMode = !isCustomMode;

    // Clear fields when switching modes but don't call full resetForm
    currentFoodData = null;
    isSelectedFromSearch = false;
    parsedFoodMeasure = null;
    unitSuggestions = [];
    showUnitSuggestions = false;
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
        searchResults = searchFoods(foodName.trim(), $calciumState.customFoods);
        showSearchResults = searchResults.length > 0;
      } else {
        searchResults = [];
        showSearchResults = false;
      }
    }, 300);
  }

  function selectFood(food) {
    currentFoodData = food;
    isSelectedFromSearch = true;
    foodName = food.name;
    calcium = food.calcium.toString();

    // If this is a custom food, switch to custom mode
    if (food.isCustom) {
      isCustomMode = true;
    }

    // Parse food measure using UnitConverter for better parsing
    parsedFoodMeasure = unitConverter.parseUSDAMeasure(food.measure);
    
    // Set initial serving size from parsed measure
    servingQuantity = parsedFoodMeasure.originalQuantity;
    servingUnit = parsedFoodMeasure.detectedUnit;
    
    // Generate unit suggestions if the unit type is known
    if (parsedFoodMeasure.unitType !== 'unknown') {
      unitSuggestions = unitConverter.detectBestAlternativeUnits(
        parsedFoodMeasure.detectedUnit,
        parsedFoodMeasure.originalQuantity
      );
      showUnitSuggestions = unitSuggestions.length > 0;
    } else {
      unitSuggestions = [];
      showUnitSuggestions = false;
    }

    searchResults = [];
    showSearchResults = false;
  }

  function updateCalcium() {
    if (currentFoodData && servingQuantity && parsedFoodMeasure) {
      try {
        // Use UnitConverter for more sophisticated calcium calculation
        const newCalcium = unitConverter.calculateCalciumForConvertedUnits(
          currentFoodData.calcium,
          parsedFoodMeasure.originalQuantity,
          parsedFoodMeasure.detectedUnit,
          servingQuantity,
          servingUnit
        );
        calcium = newCalcium.toString();
      } catch (error) {
        // Fallback to simple calculation if unit conversion fails
        const originalMatch = currentFoodData.measure.match(/^(\d+(?:\.\d+)?)/);
        const originalQuantity = originalMatch ? parseFloat(originalMatch[1]) : 1;
        const newCalcium = Math.round(
          (currentFoodData.calcium * servingQuantity) / originalQuantity
        );
        calcium = newCalcium.toString();
      }
    }
  }

  function selectUnitSuggestion(suggestion) {
    servingQuantity = suggestion.quantity;
    servingUnit = suggestion.unit;
    updateCalcium();
    showUnitSuggestions = false;
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
      const calciumService = getCalciumServiceSync();
      if (!calciumService) {
        throw new Error('CalciumService not initialized');
      }

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
        // Only save as custom food definition if it's truly new (not selected from search)
        if (isCustomMode && !isSelectedFromSearch) {
          console.log('About to save custom food in custom mode');
          await calciumService.saveCustomFood({
            name: foodName.trim(),
            calcium: calciumValue,
            measure: `${servingQuantity} ${servingUnit.trim()}`
          });
          console.log('Custom food save completed');
        } else if (isSelectedFromSearch) {
          console.log('Custom food selected from search, not saving as new definition');
        } else {
          console.log('Not in custom mode, skipping custom food save');
        }
        
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
            autocomplete="off"
          />

          {#if showSearchResults && !isCustomMode}
            <div class="search-results">
              {#each searchResults as food}
                <div class="search-item" class:custom-food={food.isCustom} on:click={() => selectFood(food)}>
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
          
          {#if showUnitSuggestions && unitSuggestions.length > 0}
            <div class="unit-suggestions">
              <div class="unit-suggestions-label">
                <span class="material-icons">swap_horiz</span>
                Quick conversions:
              </div>
              <div class="unit-suggestions-list">
                {#each unitSuggestions.slice(0, 3) as suggestion}
                  <button 
                    type="button"
                    class="unit-suggestion"
                    class:practical={suggestion.practical}
                    on:click={() => selectUnitSuggestion(suggestion)}
                    disabled={isSubmitting}
                  >
                    {unitConverter.formatQuantity(suggestion.quantity)} {suggestion.display}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
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
    padding: var(--spacing-lg);
  }

  .modal-content {
    background: var(--surface);
    border-radius: var(--spacing-sm);
    box-shadow: var(--shadow);
    border: 1px solid var(--divider);
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
    padding: var(--spacing-lg) var(--spacing-xl);
    border-bottom: 1px solid var(--divider);
    position: relative;
  }

  .modal-header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
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
    gap: var(--spacing-sm);
  }

  .modal-back {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: var(--icon-size-xl);
    padding: var(--spacing-xs);
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
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
  }

  .custom-food-toggle {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: var(--icon-size-lg);
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
    padding: var(--spacing-xl);
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
    margin-bottom: var(--spacing-lg);
  }

  .form-label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .form-input {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--divider);
    border-radius: var(--spacing-xs);
    font-size: var(--input-font-ideal);
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
    gap: var(--spacing-md);
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
    max-height: 12.5rem; /* 200px equivalent */
    overflow-y: auto;
    border: 1px solid var(--divider);
    border-radius: var(--spacing-xs);
    margin-top: var(--spacing-sm);
    background-color: var(--surface);
  }

  .search-item {
    padding: var(--spacing-md);
    cursor: pointer;
    border-bottom: 1px solid var(--divider);
    border-left: 3px solid var(--primary-color);
    transition: background-color 0.2s ease;
  }
  
  .search-item.custom-food {
    border-left: 3px solid var(--warning-color);
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
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-top: var(--spacing-xs);
  }

  .unit-suggestions {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--surface-variant);
    border-radius: var(--spacing-xs);
    border: 1px solid var(--divider);
  }

  .unit-suggestions-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
  }

  .unit-suggestions-label .material-icons {
    font-size: var(--icon-size-sm);
  }

  .unit-suggestions-list {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }

  .unit-suggestion {
    background: var(--surface);
    border: 1px solid var(--divider);
    border-radius: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .unit-suggestion:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  .unit-suggestion.practical {
    border-color: var(--primary-color);
    background: var(--primary-alpha-5);
  }

  .unit-suggestion:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--error-color);
    font-size: var(--font-size-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--error-alpha-10);
    border-radius: var(--spacing-xs);
    margin-bottom: var(--spacing-lg);
  }

  .error-message .material-icons {
    font-size: var(--icon-size-md);
  }

  .button-group {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
  }

  .btn {
    padding: var(--spacing-md) var(--spacing-2xl);
    border: none;
    border-radius: var(--spacing-xs);
    cursor: pointer;
    font-size: var(--font-size-base);
    font-weight: 500;
    transition: all 0.2s ease;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
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
    background-color: var(--primary-color-dark);
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
  @media (max-width: 30rem) { /* 480px equivalent */
    .modal-backdrop {
      align-items: center;
      padding: var(--spacing-lg);
    }

    .modal-content {
      max-height: 85vh;
    }

    .modal-header {
      padding: var(--spacing-md) var(--spacing-lg);
    }

    .modal-body {
      padding: var(--spacing-lg);
    }

    .form-input {
      font-size: var(--input-font-min); /* Prevent zoom on iOS */
    }

    .btn {
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-base);
    }

    .unit-suggestions-list {
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .unit-suggestion {
      width: 100%;
      text-align: center;
    }
  }
</style>

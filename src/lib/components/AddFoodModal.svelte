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
  import { createEventDispatcher, onMount } from "svelte";
  import { calciumState, calciumService } from "$lib/stores/calcium";
  import { DEFAULT_FOOD_DATABASE, getPrimaryMeasure, getAllMeasures, hasMultipleMeasures } from "$lib/data/foodDatabase";
  import { SearchService } from "$lib/services/SearchService";
  import UnitConverter from "$lib/services/UnitConverter";
  import ConfirmDialog from "./ConfirmDialog.svelte";
  import SmartScanModal from './SmartScanModal.svelte';

  /** Whether the modal is visible */
  export let show = false;
  /** The food being edited (null for add mode) */
  export let editingFood = null;
  /** The index of the food being edited (-1 for add mode) */
  export let editingIndex = -1;

  const dispatch = createEventDispatcher();

  let isCustomMode = false;
  let isSubmitting = false;
  let errorMessage = "";
  let searchResults = [];
  let showSearchResults = false;
  let searchTimeout;
  let showDeleteConfirm = false;
  const foodDatabase = DEFAULT_FOOD_DATABASE;
  let isDatabaseLoading = false; // No loading needed

  // Form fields
  let foodName = "";
  let calcium = "";
  let servingQuantity = 1;
  let servingUnit = "serving";

  // Current selected food data for unit conversion
  let currentFoodData = null;
  let isSelectedFromSearch = false;
  let usingPreference = false;
  let hasResetToOriginal = false;

  // Multi-measure selection
  let selectedMeasureIndex = 0;
  let availableMeasures = [];

  // Unit conversion
  const unitConverter = new UnitConverter();
  let parsedFoodMeasure = null;
  let unitSuggestions = [];
  let showUnitSuggestions = false;

  // Smart Scanning (UPC → OCR → Manual)
  let showSmartScanModal = false;

  // Debug: Track modal state changes
  $: {
    console.log('AddFood: showSmartScanModal changed to:', showSmartScanModal);
  }

  // Initialize component on mount
  onMount(async () => {
    // Database is already available via static import
    // If the modal was opened before component mount, re-run form setup
    if (show) {
      resetForm();
    }
  });

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

      // Store original calcium per unit for recalculation in edit mode
      currentFoodData = {
        name: editingFood.name,
        calcium: parseFloat(
          (editingFood.calcium / editingFood.servingQuantity).toFixed(2)
        ), // calcium per unit
        measure: `1 ${editingFood.servingUnit}`,
        isCustom: editingFood.isCustom || false,
      };

      // If not a custom food, try to find the corresponding database food to get the ID
      if (!editingFood.isCustom) {
        const databaseFood = foodDatabase.find(
          (food) => food.name === editingFood.name
        );
        if (databaseFood) {
          currentFoodData.id = databaseFood.id;
        }
      }

      // Set up parsed measure for unit conversion
      parsedFoodMeasure = {
        originalQuantity: 1,
        detectedUnit: editingFood.servingUnit,
        unitType: "generic",
      };
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
    hasResetToOriginal = false;
    
    // Clear multi-measure state
    selectedMeasureIndex = 0;
    availableMeasures = [];

    if (!editingFood) {
      parsedFoodMeasure = null;
      unitSuggestions = [];
      showUnitSuggestions = false;
    }
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
    hasResetToOriginal = false;

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
        const allFoods = [
          ...foodDatabase,
          ...$calciumState.customFoods,
        ];

        const results = SearchService.searchFoods(foodName.trim(), allFoods, {
          mode: "add_food",
          favorites: $calciumState.favorites,
          hiddenFoods: $calciumState.hiddenFoods,
          customFoods: $calciumState.customFoods,
          maxResults: 20,
        });

        searchResults = results.map((result) => result.food);
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
    
    // Set up available measures for multi-measure selection
    availableMeasures = getAllMeasures(food);
    selectedMeasureIndex = 0; // Default to first measure
    
    // Get selected measure (initially primary/first measure)
    const selectedMeasure = availableMeasures[selectedMeasureIndex];
    calcium = selectedMeasure.calcium.toString();

    // If this is a custom food, switch to custom mode
    if (food.isCustom) {
      isCustomMode = true;
    }

    // Parse food measure using UnitConverter for better parsing
    parsedFoodMeasure = unitConverter.parseUSDAMeasure(selectedMeasure.measure);

    // Check for saved serving preferences for database foods
    usingPreference = false;

    if (!food.isCustom && food.id && calciumService) {
      const savedPreference = calciumService.getServingPreference(food.id);
      if (savedPreference) {
        servingQuantity = savedPreference.preferredQuantity;
        servingUnit = savedPreference.preferredUnit;
        usingPreference = true;

        // Recalculate calcium for preferred serving
        updateCalcium();
      }
    }

    if (!usingPreference) {
      // Use default serving size from parsed measure
      servingQuantity = parsedFoodMeasure.originalQuantity;
      // Use cleaned unit for better display (handles descriptive and compound units)
      servingUnit =
        parsedFoodMeasure.cleanedUnit || parsedFoodMeasure.detectedUnit;
    }

    updateUnitSuggestions();

    searchResults = [];
    showSearchResults = false;
  }

  function handleMeasureSelection() {
    if (availableMeasures.length > 0) {
      const selectedMeasure = availableMeasures[selectedMeasureIndex];
      calcium = selectedMeasure.calcium.toString();
      
      // Parse the new measure for unit conversion
      parsedFoodMeasure = unitConverter.parseUSDAMeasure(selectedMeasure.measure);
      
      // Update serving fields to match the selected measure
      servingQuantity = 1; // Reset to 1 unit of the selected measure
      servingUnit = selectedMeasure.measure;
      
      // Recalculate calcium for the new serving size
      updateCalcium();
    }
  }

  function updateCalcium() {
    if (currentFoodData && servingQuantity && parsedFoodMeasure) {
      // For multi-measure foods, get calcium from the currently selected measure
      let baseCalcium;
      if (availableMeasures.length > 0 && selectedMeasureIndex < availableMeasures.length) {
        // Use calcium from the currently selected measure
        baseCalcium = availableMeasures[selectedMeasureIndex].calcium;
      } else {
        // Fall back to currentFoodData.calcium for legacy foods or when no measures available
        baseCalcium = currentFoodData.calcium;
      }

      // For descriptive measures or unknown unit types, use simple proportional calculation
      if (
        parsedFoodMeasure.isDescriptive ||
        parsedFoodMeasure.unitType === "unknown"
      ) {
        const newCalcium = parseFloat(
          (
            (baseCalcium * servingQuantity) /
            parsedFoodMeasure.originalQuantity
          ).toFixed(2)
        );
        calcium = newCalcium.toString();
        return;
      }

      try {
        // For compound units like "container (6 oz)", handle conversion specially
        if (parsedFoodMeasure.isCompound) {
          // For compound units, user quantity changes are simple proportional
          const newCalcium = parseFloat(
            (
              (baseCalcium * servingQuantity) /
              parsedFoodMeasure.originalQuantity
            ).toFixed(2)
          );
          calcium = newCalcium.toString();
        } else {
          // Use UnitConverter for regular convertible units
          const newCalcium = unitConverter.calculateCalciumForConvertedUnits(
            baseCalcium,
            parsedFoodMeasure.originalQuantity,
            parsedFoodMeasure.detectedUnit,
            servingQuantity,
            servingUnit
          );
          calcium = newCalcium.toString();
        }
      } catch (error) {
        // Fallback to simple calculation if unit conversion fails
        const newCalcium = parseFloat(
          (
            (baseCalcium * servingQuantity) /
            parsedFoodMeasure.originalQuantity
          ).toFixed(2)
        );
        calcium = newCalcium.toString();
      }
    }

    updateUnitSuggestions();
  }

  function updateUnitSuggestions() {
    if (
      parsedFoodMeasure &&
      parsedFoodMeasure.unitType !== "unknown" &&
      servingQuantity
    ) {
      unitSuggestions = unitConverter.detectBestAlternativeUnits(
        servingUnit, // Use current serving unit, not original detected unit
        servingQuantity // Use current quantity, not original quantity
      );
      showUnitSuggestions = unitSuggestions.length > 0;
    } else {
      unitSuggestions = [];
      showUnitSuggestions = false;
    }
  }

  function selectUnitSuggestion(suggestion) {
    servingQuantity = suggestion.quantity;
    servingUnit = suggestion.unit;
    hasResetToOriginal = false; // User changed from reset values
    updateCalcium(); // This will also update suggestions via updateUnitSuggestions()
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

  function handleDeleteClick() {
    showDeleteConfirm = true;
  }

  async function handleDeleteConfirm() {
    try {
      if (!calciumService) {
        throw new Error("CalciumService not initialized");
      }

      await calciumService.removeFood(editingIndex);
      showDeleteConfirm = false;
      closeModal();
      dispatch("foodDeleted");
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  }

  function handleDeleteCancel() {
    showDeleteConfirm = false;
  }

  async function toggleCurrentFoodFavorite() {
    if (isCustomMode || !currentFoodData || currentFoodData.isCustom) return;

    // Validate that we have a valid food ID
    if (!currentFoodData.id || typeof currentFoodData.id !== "number") {
      console.error(
        "Cannot toggle favorite - invalid food ID:",
        currentFoodData
      );
      return;
    }

    if (calciumService) {
      await calciumService.toggleFavorite(currentFoodData.id);
    }
  }

  function resetToOriginalServing() {
    if (!parsedFoodMeasure || !currentFoodData) return;

    // Reset to original database values
    servingQuantity = parsedFoodMeasure.originalQuantity;
    // Use cleaned unit for better display (handles descriptive and compound units)
    servingUnit =
      parsedFoodMeasure.cleanedUnit || parsedFoodMeasure.detectedUnit;
    usingPreference = false;
    hasResetToOriginal = true;

    // Recalculate calcium with original serving
    updateCalcium();
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    // Validation
    if (!foodName.trim()) {
      errorMessage = "Food name is required";
      return;
    }

    const calciumValue = parseFloat(calcium);
    if (!calciumValue || calciumValue <= 0 || calciumValue > 10000) {
      errorMessage = "Please enter a calcium amount between 0.01 and 10,000 mg";
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
      if (!calciumService) {
        throw new Error("CalciumService not initialized");
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
          // console.log('About to save custom food in custom mode');
          await calciumService.saveCustomFood({
            name: foodName.trim(),
            calcium: calciumValue,
            measure: `${servingQuantity} ${servingUnit.trim()}`,
          });
          // console.log('Custom food save completed');
        } else if (isSelectedFromSearch) {
          // console.log('Custom food selected from search, not saving as new definition');
        } else {
          // console.log('Not in custom mode, skipping custom food save');
        }

        // Handle serving preference for database foods
        if (
          !isCustomMode &&
          currentFoodData &&
          !currentFoodData.isCustom &&
          currentFoodData.id
        ) {
          const defaultQuantity = parsedFoodMeasure
            ? parsedFoodMeasure.originalQuantity
            : 1;
          const defaultUnit = parsedFoodMeasure
            ? parsedFoodMeasure.detectedUnit
            : "serving";

          if (
            hasResetToOriginal ||
            (servingQuantity === defaultQuantity && servingUnit === defaultUnit)
          ) {
            // User reset to original or values match default - delete any existing preference
            await calciumService.deleteServingPreference(currentFoodData.id);
          } else if (
            servingQuantity !== defaultQuantity ||
            servingUnit !== defaultUnit
          ) {
            // Save preference if user changed the serving size/unit
            await calciumService.saveServingPreference(
              currentFoodData.id,
              servingQuantity,
              servingUnit
            );
          }
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

  function handleBackdropKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  function handleSelectFoodKeydown(event, food) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectFood(food);
    }
  }

  function handleSmartScan() {
    console.log('🎯 AddFood: Smart scan button clicked!');
    console.log('   - isSubmitting:', isSubmitting);
    console.log('   - showSmartScanModal before:', showSmartScanModal);
    showSmartScanModal = true;
    console.log('   - showSmartScanModal after:', showSmartScanModal);
  }

  function handleScanComplete(event) {
    const scanData = event.detail;
    console.log('AddFood: Scan completed:', scanData);

    // Explicitly close the smart scan modal to ensure clean state
    console.log('AddFood: Before closing modal - showSmartScanModal:', showSmartScanModal);
    showSmartScanModal = false;
    console.log('AddFood: After closing modal - showSmartScanModal:', showSmartScanModal);

    // Add a small delay to ensure DOM updates
    setTimeout(() => {
      console.log('AddFood: After timeout - showSmartScanModal:', showSmartScanModal);
    }, 100);

    // Switch to custom mode and populate the fields
    isCustomMode = true;

    // Handle different scan methods
    if (scanData.method === 'UPC') {
      // UPC scan - we have rich product data
      // Combine brandName and description for better food name
      if (scanData.brandName && scanData.productName) {
        foodName = `${scanData.brandName} ${scanData.productName}`;
      } else {
        foodName = scanData.productName || 'Scanned Product';
      }

      // Clean, simple assignment - FDCService has made all decisions
      servingQuantity = scanData.servingQuantity || 1;
      servingUnit = scanData.servingUnit || 'serving';
      console.log(`UPC: Using centralized serving data - quantity: ${servingQuantity}, unit: ${servingUnit}`);
      console.log(`UPC: Serving source: ${scanData.servingSource || 'unknown'}`);
      if (scanData.servingDisplayText) {
        console.log(`UPC: Display text was: ${scanData.servingDisplayText}`);
      }

      // Use calculated per-serving calcium if available, otherwise fall back to raw API value
      if (scanData.calciumPerServing) {
        calcium = scanData.calciumPerServing.toString();
        console.log(`UPC: Using calculated per-serving calcium: ${scanData.calciumPerServing}mg`);
      } else if (scanData.calciumValue) {
        calcium = scanData.calciumValue.toString();
        console.log(`UPC: Using raw API calcium value: ${scanData.calciumValue}mg`);
      }

      console.log(`UPC scan: ${scanData.productName} - ${scanData.calcium}`);

    } else if (scanData.method === 'OCR') {
      // OCR scan - nutrition label data
      foodName = scanData.productName || 'Scanned Food Item';

      if (scanData.servingSize) {
        servingUnit = scanData.servingSize;
      }

      if (scanData.calciumValue) {
        calcium = scanData.calciumValue.toString();
      }

      console.log(`OCR scan with ${scanData.confidence} confidence: ${scanData.calcium}`);

    } else if (scanData.method === 'Manual') {
      // User chose manual entry - just set custom mode and clear fields
      foodName = '';
      servingUnit = 'serving';
      calcium = '';

      console.log('User chose manual entry');
    }

    // Focus on the food name field so user can immediately start typing
    setTimeout(() => {
      const nameInput = document.querySelector('input[placeholder*="food name"], input[placeholder*="Food name"]');
      if (nameInput) {
        nameInput.focus();
        if (scanData.method !== 'Manual') {
          nameInput.select(); // Select the placeholder text for easy replacement
        }
      }
    }, 100);
  }
</script>

{#if show}
  <div
    class="modal-backdrop"
    on:click={closeModal}
    on:keydown={handleBackdropKeydown}
    role="button"
    tabindex="0"
  >
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      class="modal-content"
      on:click|stopPropagation
      on:keydown|stopPropagation
      class:custom-food-mode={isCustomMode}
      role="dialog"
      tabindex="-1"
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
          {#if editingFood}
            <button
              class="delete-btn"
              on:click={handleDeleteClick}
              disabled={isSubmitting}
              title="Delete Food"
            >
              <span class="material-icons">delete</span>
            </button>
          {:else}
            <!-- Smart Scan Button -->
            <button
              class="smart-scan-btn"
              on:click={handleSmartScan}
              disabled={isSubmitting}
              title="Scan Product Barcode or Nutrition Label"
            >
              <span class="material-icons">qr_code_scanner</span>
            </button>
            
            <button
              class="custom-food-toggle"
              class:active={isCustomMode}
              on:click={toggleMode}
              disabled={isSubmitting}
              title={isCustomMode ? "Switch to Search Mode" : "Add Custom Food"}
            >
              <span class="material-icons">
                {isCustomMode ? "search" : "add"}
              </span>
            </button>
          {/if}
        </div>
      </div>

      <form class="modal-body" on:submit|preventDefault={handleSubmit}>
        {#if isDatabaseLoading}
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading food database...</p>
          </div>
        {:else}
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label" for="foodName">Food Name</label>
            {#if !isCustomMode && currentFoodData && !currentFoodData.isCustom}
              <button
                class="favorite-modal-btn"
                class:favorite={$calciumState.favorites.has(currentFoodData.id)}
                on:click={toggleCurrentFoodFavorite}
                title={$calciumState.favorites.has(currentFoodData.id)
                  ? "Remove from favorites"
                  : "Add to favorites"}
                type="button"
              >
                <span class="material-icons">
                  {$calciumState.favorites.has(currentFoodData.id)
                    ? "star"
                    : "star_border"}
                </span>
              </button>
            {/if}
          </div>
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
                <div
                  class="search-item"
                  class:custom-food={food.isCustom}
                  on:click={() => selectFood(food)}
                  on:keydown={(e) => handleSelectFoodKeydown(e, food)}
                  role="button"
                  tabindex="0"
                >
                  <div class="search-item-content">
                    <div class="search-item-name">
                      {food.name}
                    </div>
                    <div class="search-item-details">
                      {Math.round(getPrimaryMeasure(food).calcium)}mg per {getPrimaryMeasure(food).measure}
                      {#if hasMultipleMeasures(food)}
                        <span class="measure-count">({getAllMeasures(food).length} servings)</span>
                      {/if}
                    </div>
                  </div>
                  {#if !food.isCustom && food.id && $calciumState.favorites.has(food.id)}
                    <div class="search-item-favorite">
                      <span class="material-icons">star</span>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Multi-measure selection dropdown -->
        {#if !isCustomMode && isSelectedFromSearch && availableMeasures.length > 1}
          <div class="form-group">
            <label class="form-label" for="measureSelect">Available Serving Sizes</label>
            <select 
              id="measureSelect"
              class="form-input" 
              bind:value={selectedMeasureIndex}
              on:change={handleMeasureSelection}
            >
              {#each availableMeasures as measure, index}
                <option value={index}>
                  {Math.round(measure.calcium)}mg per {measure.measure}
                </option>
              {/each}
            </select>
            <div class="measure-help-text">
              Choose from {availableMeasures.length} available serving sizes
            </div>
          </div>
        {/if}

        <div class="form-group">
          <label class="form-label" for="calcium">Calcium (mg)</label>
          <input
            id="calcium"
            type="number"
            class="form-input"
            bind:value={calcium}
            placeholder="0"
            min="0.01"
            step="0.01"
            disabled={isSubmitting ||
              (!isCustomMode && !editingFood && !isSelectedFromSearch)}
          />
        </div>

        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label" for="servingQuantity">Serving Size</label>
            {#if usingPreference && !isCustomMode && !editingFood}
              <button
                class="reset-serving-btn"
                on:click={resetToOriginalServing}
                title="Reset to original database serving size"
                type="button"
              >
                <span class="material-icons">refresh</span>
              </button>
            {/if}
          </div>
          <div class="serving-row">
            <div class="serving-quantity">
              <input
                id="servingQuantity"
                type="number"
                class="form-input"
                bind:value={servingQuantity}
                on:input={() => {
                  hasResetToOriginal = false;
                  updateCalcium();
                }}
                placeholder="1"
                min="0.01"
                step="0.01"
                disabled={isSubmitting ||
                  (!isCustomMode && !editingFood && !isSelectedFromSearch)}
              />
            </div>
            <div class="serving-unit">
              <input
                type="text"
                class="form-input serving-unit-input"
                bind:value={servingUnit}
                on:input={() => {
                  hasResetToOriginal = false;
                }}
                placeholder={isCustomMode ? "cups, oz, etc." : "cups"}
                readonly={!isCustomMode}
                disabled={isSubmitting ||
                  (!isCustomMode && !editingFood && !isSelectedFromSearch)}
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
                    {unitConverter.formatQuantity(suggestion.quantity)}
                    {suggestion.display}
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
          <button
            type="submit"
            class="btn btn-primary"
            disabled={isSubmitting ||
              (!isCustomMode && !editingFood && !isSelectedFromSearch)}
          >
            {#if isSubmitting}
              <span class="material-icons spin">hourglass_empty</span>
            {/if}
            {editingFood ? "Update" : "Add"}
          </button>
        </div>
        {/if}
      </form>
    </div>
  </div>
{/if}

<ConfirmDialog
  bind:show={showDeleteConfirm}
  title="Delete Food"
  message={editingFood?.name || ""}
  confirmText="Delete"
  cancelText="Cancel"
  type="danger"
  on:confirm={handleDeleteConfirm}
  on:cancel={handleDeleteCancel}
/>

<SmartScanModal bind:show={showSmartScanModal} on:scanComplete={handleScanComplete} />

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

  .delete-btn {
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

  .delete-btn:hover:not(:disabled) {
    background-color: var(--error-alpha-10);
    color: var(--error-color);
  }

  .delete-btn:disabled {
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

  .form-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
  }

  .form-label {
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .search-item-content {
    flex: 1;
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

  .search-item-favorite {
    flex-shrink: 0;
    margin-left: var(--spacing-sm);
  }

  .search-item-favorite .material-icons {
    font-size: var(--icon-size-md);
    color: var(--primary-color);
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

  .favorite-modal-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .favorite-modal-btn:hover {
    background-color: var(--divider);
    color: var(--primary-color);
  }

  .favorite-modal-btn.favorite {
    color: var(--primary-color);
  }

  .favorite-modal-btn .material-icons {
    font-size: var(--icon-size-lg);
  }

  .reset-serving-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .reset-serving-btn:hover {
    background-color: var(--divider);
    color: var(--primary-color);
  }

  .reset-serving-btn .material-icons {
    font-size: var(--icon-size-md);
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
  @media (max-width: 30rem) {
    /* 480px equivalent */
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

  /* Multi-measure styles */
  .measure-count {
    color: var(--text-tertiary);
    font-size: var(--font-size-xs);
    font-style: italic;
    margin-left: var(--spacing-xs);
  }

  .measure-help-text {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin-top: var(--spacing-xs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .measure-help-text::before {
    content: "ⓘ";
    color: var(--primary-color);
    font-weight: bold;
    font-size: var(--font-size-sm);
  }

  /* Loading state styles */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    color: var(--text-secondary);
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid var(--divider);
    border-top: 2px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-md);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .smart-scan-btn {
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

  .smart-scan-btn:hover:not(:disabled) {
    background: var(--divider);
    color: var(--primary-color);
  }

  .smart-scan-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

</style>

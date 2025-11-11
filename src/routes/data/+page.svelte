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
  import { onMount, onDestroy } from "svelte";
  import { calciumState, showToast, calciumService } from "$lib/stores/calcium";
  import { DEFAULT_FOOD_DATABASE, getPrimaryMeasure, getAllMeasures, hasMultipleMeasures, formatCalcium } from "$lib/data/foodDatabase";
  import { SearchService } from "$lib/services/SearchService";
  import { goto } from "$app/navigation";
  import SourceIndicator from "$lib/components/SourceIndicator.svelte";
  import MetadataPopup from "$lib/components/MetadataPopup.svelte";

  let searchQuery = "";
  let selectedFilter = "available"; // New default filter
  let sortBy = "calcium";
  let sortOrder = "desc";
  let filteredFoods = [];
  let isBulkOperationInProgress = false;
  let typeSortRotation = 0; // 0, 1, 2 for three-way type rotation
  const foodDatabase = DEFAULT_FOOD_DATABASE;
  let isDatabaseLoading = false; // No loading needed

  // Calcium filter state
  let calciumFilter = {
    type: "all", // 'all', 'preset', 'custom'
    preset: null, // '0mg', '1-50mg', '51-200mg', '201-500mg', '500mg+'
    min: null,
    max: null,
  };
  let showCalciumDropdown = false;

  // Delete confirmation modal state
  let showDeleteModal = false;
  let foodToDelete = null;

  // Metadata popup state
  let showMetadataPopup = false;
  let selectedFoodForMetadata = null;

  // Get food type for sorting based on current filter context
  function getFoodTypeForSort(food) {
    if (selectedFilter === "available") {
      if (food.isCustom) return "Custom";
      if ($calciumState.favorites.has(food.id)) return "Favorite";
      return "Database";
    } else if (selectedFilter === "database") {
      if ($calciumState.favorites.has(food.id)) return "Favorite";
      if ($calciumState.hiddenFoods.has(food.id)) return "Hidden";
      return "Database";
    } else if (selectedFilter === "user") {
      return "Custom"; // All are custom in user filter
    }
    return "Unknown";
  }

  // Get sort priority for type-based sorting with three-way rotation
  function getTypeSortPriority(food) {
    const type = getFoodTypeForSort(food);

    if (selectedFilter === "available") {
      // Available view: Custom / Favorite / Database rotation
      const priorities = [
        { Custom: 0, Favorite: 1, Database: 2 }, // Custom first
        { Favorite: 0, Database: 1, Custom: 2 }, // Favorite first
        { Database: 0, Custom: 1, Favorite: 2 }, // Database first
      ];
      return priorities[typeSortRotation][type] || 999;
    } else if (selectedFilter === "database") {
      // Database view: Favorite / Hidden / Database rotation
      const priorities = [
        { Favorite: 0, Hidden: 1, Database: 2 }, // Favorite first
        { Hidden: 0, Database: 1, Favorite: 2 }, // Hidden first
        { Database: 0, Favorite: 1, Hidden: 2 }, // Database (shown) first
      ];
      return priorities[typeSortRotation][type] || 999;
    }

    return 0; // User filter doesn't need rotation (all custom)
  }

  // Initialize component on mount
  onMount(async () => {
    // Database is already available via static import
    // No additional initialization needed
  });

  // Filter and sort foods
  $: {
    // Explicitly depend on typeSortRotation and calciumFilter to trigger re-sort
    typeSortRotation;
    calciumFilter;
    let foods = [];

    // Apply filter - let SearchService handle hidden foods filtering consistently
    if (selectedFilter === "available") {
      // Show all addable foods: all database foods + custom foods (SearchService will filter hidden)
      foods = [...foodDatabase, ...$calciumState.customFoods];
    } else if (selectedFilter === "database") {
      // Show all database foods for management (including hidden and favorites)
      foods = [...foodDatabase];
    } else if (selectedFilter === "user") {
      // Show only custom foods
      foods = [...$calciumState.customFoods];
    }

    // Apply enhanced search and filtering
    if (searchQuery.trim()) {
      const hiddenFoodsForSearch = selectedFilter === "database" ? new Set() : $calciumState.hiddenFoods;
      const results = SearchService.searchFoods(searchQuery, foods, {
        mode: "database",
        favorites: $calciumState.favorites,
        hiddenFoods: hiddenFoodsForSearch, // Don't filter hidden foods in database mode
        maxResults: 1000, // Show all matching foods for complete bulk operations
      });
      foods = results.map((result) => result.food);
    } else {
      // Apply hidden foods filtering when NOT searching (SearchService handles it when searching)
      if (selectedFilter === "available") {
        foods = foods.filter((food) => food.isCustom || !$calciumState.hiddenFoods.has(food.id));
      }
    }

    // Apply calcium filter
    if (calciumFilter.type !== "all") {
      foods = foods.filter((food) => passesCalciumFilter(food));
    }

    // Apply sort
    foods.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "calcium":
          comparison = getPrimaryMeasure(a).calcium - getPrimaryMeasure(b).calcium;
          break;
        case "type":
          const aPriority = getTypeSortPriority(a);
          const bPriority = getTypeSortPriority(b);
          comparison = aPriority - bPriority;
          // Secondary sort by name for foods of the same type (always ascending)
          if (comparison === 0) {
            comparison = a.name.localeCompare(b.name);
          }
          // For type sort, ignore sortOrder for the secondary name sorting
          return comparison;
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    filteredFoods = foods;
  }

  // Bulk selection reactive logic
  $: eligibleFoodsForBulk = filteredFoods.filter(
    (food) =>
      !food.isCustom && // Only database foods can be hidden
      !$calciumState.favorites.has(food.id) // Skip favorites
  );

  $: hiddenEligibleFoods = eligibleFoodsForBulk.filter((food) =>
    $calciumState.hiddenFoods.has(food.id)
  );

  $: allNonFavoritesHidden =
    eligibleFoodsForBulk.length > 0 &&
    hiddenEligibleFoods.length === eligibleFoodsForBulk.length;

  $: someNonFavoritesHidden = hiddenEligibleFoods.length > 0;

  $: favoriteCount = filteredFoods.filter(
    (food) => !food.isCustom && $calciumState.favorites.has(food.id)
  ).length;

  $: bulkActionText = allNonFavoritesHidden
    ? `Unhide all ${eligibleFoodsForBulk.length} foods`
    : `Hide all ${eligibleFoodsForBulk.length} foods`;

  $: showBulkActions =
    selectedFilter === "database" &&
    (searchQuery.trim() || calciumFilter.type !== "all") &&
    filteredFoods.length > 0 &&
    eligibleFoodsForBulk.length > 0;

  // Item count display logic
  $: {
    let totalCount = 0;
    if (selectedFilter === "available") {
      const visibleDatabaseFoods = foodDatabase.filter(
        (food) => !$calciumState.hiddenFoods.has(food.id)
      );
      totalCount =
        visibleDatabaseFoods.length + $calciumState.customFoods.length;
    } else if (selectedFilter === "database") {
      totalCount = foodDatabase.length;
    } else if (selectedFilter === "user") {
      totalCount = $calciumState.customFoods.length;
    }
  }

  $: itemCountText = (() => {
    const hasActiveFilters = searchQuery.trim() || calciumFilter.type !== "all";
    let totalCount = 0;
    let filterLabel = "";

    if (selectedFilter === "available") {
      const visibleDatabaseFoods = foodDatabase.filter(
        (food) => !$calciumState.hiddenFoods.has(food.id)
      );
      totalCount =
        visibleDatabaseFoods.length + $calciumState.customFoods.length;
      filterLabel = "available";
    } else if (selectedFilter === "database") {
      totalCount = foodDatabase.length;
      filterLabel = "database";
    } else if (selectedFilter === "user") {
      totalCount = $calciumState.customFoods.length;
      filterLabel = "custom";
    }

    if (hasActiveFilters) {
      return `${filteredFoods.length} of ${totalCount} ${filterLabel} foods`;
    } else {
      return `${totalCount} ${filterLabel} foods`;
    }
  })();

  let docsWindowRef = null;

  function openFoodDocs(food) {
    const docsUrl = `/database-docs.html#food-${food.id}`;
    
    // Check if we already have a docs window open
    if (docsWindowRef && !docsWindowRef.closed) {
      // Reuse existing window
      docsWindowRef.location.href = docsUrl;
      docsWindowRef.focus();
    } else {
      // Open new window and store reference
      docsWindowRef = window.open(docsUrl, "calcium_database_docs");
    }
  }

  function handleFilterClick(filter) {
    selectedFilter = filter;

    // If switching to User filter and Type sort is active, change to Calcium sort
    if (filter === "user" && sortBy === "type") {
      sortBy = "calcium";
      sortOrder = "desc"; // Default for calcium sort
    }
  }

  function handleSortClick(sort) {
    if (sortBy === sort) {
      if (sort === "type") {
        // Three-way rotation for type sorting
        typeSortRotation = (typeSortRotation + 1) % 3;
      } else {
        // Regular toggle for other sorts
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
      }
    } else {
      // Change sort field
      sortBy = sort;
      if (sort === "type") {
        typeSortRotation = 0; // Reset to first rotation when switching to type
      }
      sortOrder = sort === "name" ? "asc" : "desc";
    }
  }

  function getSortIcon(sort) {
    if (sortBy !== sort) return "unfold_more";
    return sortOrder === "desc" ? "expand_more" : "expand_less";
  }

  async function toggleFoodHidden(food) {
    if (food.isCustom || !food.id) return; // Can't hide custom foods

    if (calciumService) {
      // If food is currently a favorite and we're trying to hide it, remove from favorites first
      if (
        $calciumState.favorites.has(food.id) &&
        !$calciumState.hiddenFoods.has(food.id)
      ) {
        await calciumService.toggleFavorite(food.id);
      }
      await calciumService.toggleHiddenFood(food.id);
    }
  }

  async function toggleFavorite(food) {
    if (food.isCustom) return; // Only allow favorites for database foods

    if (calciumService) {
      // If food is currently hidden and we're trying to favorite it, unhide it first
      if (
        $calciumState.hiddenFoods.has(food.id) &&
        !$calciumState.favorites.has(food.id)
      ) {
        await calciumService.toggleHiddenFood(food.id);
      }
      await calciumService.toggleFavorite(food.id);
    }
  }

  function confirmDeleteFood(food) {
    foodToDelete = food;
    showDeleteModal = true;
  }

  function cancelDelete() {
    showDeleteModal = false;
    foodToDelete = null;
  }

  function handleInfoClick(food) {
    selectedFoodForMetadata = food;
    showMetadataPopup = true;
  }

  async function handleDeleteFood() {
    if (!foodToDelete || !foodToDelete.id) return;

    // Store the name before deletion in case the object becomes stale
    const foodName = foodToDelete.name;
    const foodId = foodToDelete.id;

    if (calciumService) {
      try {
        await calciumService.deleteCustomFood(foodId);
        showToast(`Deleted ${foodName}`, "success");
      } catch (error) {
        console.error("Error deleting custom food:", error);
        showToast("Failed to delete food", "error");
      }
    }

    // Close modal
    showDeleteModal = false;
    foodToDelete = null;
  }

  function handleFilterKeydown(event, filter) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleFilterClick(filter);
    }
  }

  function handleBackdropKeydown(event) {
    if (event.key === "Escape") {
      showDeleteModal = false;
      foodToDelete = null;
    }
  }

  function handleSortKeydown(event, sortType) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSortClick(sortType);
    }
  }

  function clearSearch() {
    searchQuery = "";
  }

  function toggleCalciumDropdown() {
    showCalciumDropdown = !showCalciumDropdown;
  }

  function selectCalciumFilter(type, preset = null, min = null, max = null) {
    calciumFilter = { type, preset, min, max };
    if (type !== "custom") {
      showCalciumDropdown = false;
    }
  }

  function getCalciumFilterText() {
    if (calciumFilter.type === "all") return "Ca";
    if (calciumFilter.type === "preset") return `Ca:${calciumFilter.preset}`;
    if (calciumFilter.type === "custom")
      return `Ca:${calciumFilter.min || 0}-${calciumFilter.max || "∞"}mg`;
    return "Ca";
  }

  function passesCalciumFilter(food) {
    if (calciumFilter.type === "all") return true;

    // Use getPrimaryMeasure for compatibility with both formats
    const calcium = Math.round(getPrimaryMeasure(food).calcium);

    if (calciumFilter.type === "preset") {
      switch (calciumFilter.preset) {
        case "0mg":
          return calcium === 0;
        case "1-50mg":
          return calcium >= 1 && calcium <= 50;
        case "51-200mg":
          return calcium >= 51 && calcium <= 200;
        case "201-500mg":
          return calcium >= 201 && calcium <= 500;
        case "500mg+":
          return calcium > 500;
        default:
          return true;
      }
    }

    if (calciumFilter.type === "custom") {
      const min = calciumFilter.min || 0;
      const max = calciumFilter.max || Infinity;
      return calcium >= min && calcium <= max;
    }

    return true;
  }

  function handleClickOutside(event) {
    if (
      showCalciumDropdown &&
      !event.target.closest(".calcium-filter-container")
    ) {
      showCalciumDropdown = false;
    }
  }

  async function handleBulkToggle() {
    if (isBulkOperationInProgress || !calciumService) return;

    isBulkOperationInProgress = true;

    try {
      // Capture the current state before making any changes
      const currentEligibleFoods = [...eligibleFoodsForBulk];
      const currentHiddenState = new Set($calciumState.hiddenFoods);
      const targetHidden = !allNonFavoritesHidden;

      // Process all eligible foods - don't filter, just set them all to the target state
      const batchSize = 10;
      for (let i = 0; i < currentEligibleFoods.length; i += batchSize) {
        const batch = currentEligibleFoods.slice(i, i + batchSize);

        // Process each food in the batch
        for (const food of batch) {
          const isCurrentlyHidden = currentHiddenState.has(food.id);

          // Only toggle if the current state doesn't match the target state
          if (isCurrentlyHidden !== targetHidden) {
            await calciumService.toggleHiddenFood(food.id);
          }
        }

        // Small delay between batches to keep UI responsive
        if (i + batchSize < currentEligibleFoods.length) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
    } catch (error) {
      console.error("Error during bulk operation:", error);
    } finally {
      isBulkOperationInProgress = false;
    }
  }
</script>

<svelte:head>
  <title>Database - My Calcium</title>
</svelte:head>

<div class="data-page">
  <div class="content">
    {#if isDatabaseLoading}
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading food database...</p>
      </div>
    {:else}
      <!-- Search and Calcium Filter Row -->
      <div class="search-row">
        <div class="search-container">
          <input
            type="text"
            class="data-search"
            placeholder="Search foods..."
            bind:value={searchQuery}
          />
          <span class="material-icons search-icon">search</span>

          {#if searchQuery}
            <button class="clear-search-btn" on:click={clearSearch}>
              <span class="material-icons">close</span>
            </button>
          {/if}
        </div>

        <!-- Calcium Filter Button with Dropdown -->
        <div class="calcium-filter-container">
          <button
            class="calcium-filter-btn"
            class:active={calciumFilter.type !== "all"}
            on:click={toggleCalciumDropdown}
            title="Filter by calcium content"
          >
            {getCalciumFilterText()}
            <span class="material-icons">expand_more</span>
          </button>

          <!-- Calcium Filter Dropdown -->
          {#if showCalciumDropdown}
            <div class="calcium-dropdown">
              <div class="calcium-dropdown-content">
                <div class="filter-section">
                  <h4>Calcium Filter</h4>

                  <label class="filter-option">
                    <input
                      type="radio"
                      name="calcium-filter"
                      checked={calciumFilter.type === "all"}
                      on:change={() => selectCalciumFilter("all")}
                    />
                    All levels
                  </label>

                  <label class="filter-option">
                    <input
                      type="radio"
                      name="calcium-filter"
                      checked={calciumFilter.preset === "0mg"}
                      on:change={() => selectCalciumFilter("preset", "0mg")}
                    />
                    0mg (no calcium)
                  </label>

                  <label class="filter-option">
                    <input
                      type="radio"
                      name="calcium-filter"
                      checked={calciumFilter.preset === "1-50mg"}
                      on:change={() => selectCalciumFilter("preset", "1-50mg")}
                    />
                    1-50mg (very low)
                  </label>

                  <label class="filter-option">
                    <input
                      type="radio"
                      name="calcium-filter"
                      checked={calciumFilter.preset === "51-200mg"}
                      on:change={() =>
                        selectCalciumFilter("preset", "51-200mg")}
                    />
                    51-200mg (low)
                  </label>

                  <label class="filter-option">
                    <input
                      type="radio"
                      name="calcium-filter"
                      checked={calciumFilter.preset === "201-500mg"}
                      on:change={() =>
                        selectCalciumFilter("preset", "201-500mg")}
                    />
                    201-500mg (moderate)
                  </label>

                  <label class="filter-option">
                    <input
                      type="radio"
                      name="calcium-filter"
                      checked={calciumFilter.preset === "500mg+"}
                      on:change={() => selectCalciumFilter("preset", "500mg+")}
                    />
                    500mg+ (high)
                  </label>

                  <div class="custom-range">
                    <label class="filter-option">
                      <input
                        type="radio"
                        name="calcium-filter"
                        checked={calciumFilter.type === "custom"}
                        on:change={() => {
                          calciumFilter = {
                            type: "custom",
                            preset: null,
                            min: calciumFilter.min || 0,
                            max: calciumFilter.max || 1000,
                          };
                        }}
                      />
                      Custom range:
                    </label>
                    <div class="range-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        bind:value={calciumFilter.min}
                        on:input={() => {
                          calciumFilter = {
                            type: "custom",
                            preset: null,
                            min: calciumFilter.min,
                            max: calciumFilter.max,
                          };
                        }}
                        min="0"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        bind:value={calciumFilter.max}
                        on:input={() => {
                          calciumFilter = {
                            type: "custom",
                            preset: null,
                            min: calciumFilter.min,
                            max: calciumFilter.max,
                          };
                        }}
                        min="0"
                      />
                      <span>mg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Item Count Display -->
      <div class="item-count-display">
        <span class="item-count-text">{itemCountText}</span>
      </div>

      <!-- Bulk Actions (only shown for search results in database mode) -->
      {#if showBulkActions}
        <div class="bulk-actions">
          <div class="bulk-select-container">
            <input
              type="checkbox"
              id="bulk-select"
              class="bulk-checkbox"
              checked={allNonFavoritesHidden}
              indeterminate={someNonFavoritesHidden && !allNonFavoritesHidden}
              on:change={handleBulkToggle}
              disabled={isBulkOperationInProgress}
              aria-describedby="bulk-description"
            />
            <label for="bulk-select" class="bulk-label">
              {isBulkOperationInProgress ? "Processing..." : bulkActionText}
            </label>
            {#if favoriteCount > 0}
              <span class="bulk-skip-note" id="bulk-description">
                (skipping {favoriteCount} favorite{favoriteCount === 1
                  ? ""
                  : "s"})
              </span>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Filter Controls -->
      <div class="data-filter-controls">
        <span class="material-icons filter-section-icon">filter_list</span>
        <div class="sort-options">
          <div
            class="sort-option"
            class:active={selectedFilter === "available"}
            on:click={() => handleFilterClick("available")}
            on:keydown={(e) => handleFilterKeydown(e, "available")}
            role="button"
            tabindex="0"
          >
            <span class="material-icons">visibility</span>
            <span>Available</span>
          </div>
          <div
            class="sort-option"
            class:active={selectedFilter === "database"}
            on:click={() => handleFilterClick("database")}
            on:keydown={(e) => handleFilterKeydown(e, "database")}
            role="button"
            tabindex="0"
          >
            <span class="material-icons">shield</span>
            <span>Database</span>
          </div>
          <div
            class="sort-option"
            class:active={selectedFilter === "user"}
            on:click={() => handleFilterClick("user")}
            on:keydown={(e) => handleFilterKeydown(e, "user")}
            role="button"
            tabindex="0"
          >
            <span class="material-icons">person</span>
            <span>User</span>
          </div>
        </div>
      </div>

      <!-- Sort Controls -->
      <div class="data-sort-controls">
        <span class="material-icons sort-section-icon">sort</span>
        <div class="sort-options">
          <div
            class="sort-option"
            class:active={sortBy === "name"}
            on:click={() => handleSortClick("name")}
            on:keydown={(e) => handleSortKeydown(e, "name")}
            role="button"
            tabindex="0"
          >
            <span class="material-icons">sort_by_alpha</span>
            <span>Name</span>
            <span class="material-icons sort-icon">{getSortIcon("name")}</span>
          </div>
          <div
            class="sort-option"
            class:active={sortBy === "calcium"}
            on:click={() => handleSortClick("calcium")}
            on:keydown={(e) => handleSortKeydown(e, "calcium")}
            role="button"
            tabindex="0"
          >
            <span class="material-icons">science</span>
            <span>Ca</span>
            <span class="material-icons sort-icon"
              >{getSortIcon("calcium")}</span
            >
          </div>
          <div
            class="sort-option"
            class:active={sortBy === "type"}
            class:disabled={selectedFilter === "user"}
            on:click={() =>
              selectedFilter !== "user" && handleSortClick("type")}
            on:keydown={(e) =>
              selectedFilter !== "user" && handleSortKeydown(e, "type")}
            role="button"
            tabindex={selectedFilter === "user" ? "-1" : "0"}
          >
            <span class="material-icons">category</span>
            <span>Type</span>
            <span class="material-icons sort-icon"
              >{selectedFilter === "user" ? "" : getSortIcon("type")}</span
            >
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="results-container">
        {#each filteredFoods as food}
          <div
            class="food-item"
            class:custom={food.isCustom}
            class:database-mode={selectedFilter === "database"}
          >
            {#if selectedFilter === "database" && !food.isCustom}
              <div class="hide-checkbox-container">
                <input
                  type="checkbox"
                  class="hide-checkbox"
                  checked={$calciumState.hiddenFoods.has(food.id)}
                  on:change={() => toggleFoodHidden(food)}
                  title={$calciumState.hiddenFoods.has(food.id)
                    ? "Unhide food"
                    : "Hide food"}
                />
              </div>
            {:else if selectedFilter === "available" && !food.isCustom}
              <div class="docs-link-container">
                <button
                  class="docs-link-btn"
                  on:click={() => openFoodDocs(food)}
                  title="View in database documentation"
                >
                  <span class="material-icons">open_in_new</span>
                </button>
              </div>
            {/if}
            <div class="food-info">
              <div class="food-name">
                {food.name}
                {#if food.isCustom && food.sourceMetadata}
                  <SourceIndicator {food} size="small" clickable={true} on:click={() => handleInfoClick(food)} />
                {/if}
              </div>
              <div class="food-measure">
                {getPrimaryMeasure(food).measure}
                {#if hasMultipleMeasures(food)}
                  <span class="measure-count">({getAllMeasures(food).length} servings)</span>
                {/if}
              </div>
            </div>
            <div class="food-calcium">
              <div class="calcium-amount" title="{getPrimaryMeasure(food).calcium}mg">
                {formatCalcium(getPrimaryMeasure(food).calcium)}mg
              </div>
              <div class="food-type">
                {food.isCustom ? "User" : "Database"}
              </div>
            </div>
            {#if !food.isCustom}
              <button
                class="favorite-btn"
                class:favorite={$calciumState.favorites.has(food.id)}
                on:click={() => toggleFavorite(food)}
                title={$calciumState.favorites.has(food.id)
                  ? "Remove from favorites"
                  : "Add to favorites"}
              >
                <span class="material-icons">
                  {$calciumState.favorites.has(food.id)
                    ? "star"
                    : "star_border"}
                </span>
              </button>
            {:else if selectedFilter !== "database"}
              <button
                class="delete-btn"
                on:click={() => confirmDeleteFood(food)}
                title="Delete custom food"
              >
                <span class="material-icons">delete</span>
              </button>
            {/if}
          </div>
        {:else}
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <div class="empty-text">
              <h3>No foods found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && foodToDelete}
  <div
    class="modal-backdrop"
    on:click={cancelDelete}
    on:keydown={handleBackdropKeydown}
    role="button"
    tabindex="0"
  >
    <div
      class="delete-modal"
      role="dialog"
      aria-labelledby="delete-title"
      aria-modal="true"
    >
      <div class="modal-header">
        <h3 id="delete-title">Delete Custom Food</h3>
      </div>

      <div class="modal-body">
        <p>
          Are you sure you want to delete <strong
            >{foodToDelete?.name || "this food"}</strong
          >?
        </p>
        <p class="warning-text">
          This action cannot be undone. Past journal entries will keep this
          food's data.
        </p>
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" on:click={cancelDelete}>Cancel</button>
        <button class="delete-btn-modal" on:click={handleDeleteFood}
          >Delete</button
        >
      </div>
    </div>
  </div>
{/if}

{#if showMetadataPopup && selectedFoodForMetadata && selectedFoodForMetadata.sourceMetadata}
  <MetadataPopup
    show={showMetadataPopup}
    food={selectedFoodForMetadata}
    on:close={() => {
      showMetadataPopup = false;
      selectedFoodForMetadata = null;
    }}
  />
{/if}

<svelte:window on:click={handleClickOutside} />

<style>
  .data-page {
    background-color: var(--background);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
    padding-bottom: var(--spacing-lg);
    min-height: 0; /* Important for flex child scrolling */
  }

  .search-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    position: relative;
  }

  .search-container {
    position: relative;
    flex: 1;
  }

  .data-search {
    width: 100%;
    padding: var(--spacing-md) 2.5rem var(--spacing-md) 3rem; /* Space for search icon on left and clear button on right */
    border: 1px solid var(--divider);
    border-radius: var(--spacing-sm);
    font-size: var(--input-font-min); /* Prevent iOS zoom */
    background-color: var(--surface);
    color: var(--text-primary);
  }

  .data-search:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-alpha-10);
  }

  .search-icon {
    position: absolute;
    left: var(--spacing-lg);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    font-size: var(--icon-size-lg);
  }

  .clear-search-btn {
    position: absolute;
    right: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .clear-search-btn:hover {
    background-color: var(--surface-variant);
    color: var(--text-primary);
  }

  .clear-search-btn .material-icons {
    font-size: 18px;
  }

  .data-filter-controls,
  .data-sort-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 16px;
    background-color: transparent;
    border: none;
    box-shadow: none;
    margin-bottom: 8px;
  }

  .filter-section-icon,
  .sort-section-icon {
    font-size: 18px;
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  .sort-options {
    display: flex;
    justify-content: space-between;
    flex: 1;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .sort-options::-webkit-scrollbar {
    display: none;
  }

  .sort-option {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 4px 8px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    border: 1px solid transparent;
    flex: 1;
    justify-content: center;
    text-align: center;
    min-width: 0;
  }

  .sort-option:hover {
    background-color: var(--divider);
  }

  .sort-option.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  .sort-option.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  .sort-icon {
    font-size: 16px;
  }

  .results-container {
    margin-top: 16px;
  }

  .food-item {
    background-color: var(--surface);
    border: 1px solid var(--divider);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .food-item.custom {
    border-left: 3px solid var(--secondary-color);
    background-color: var(--custom-food-bg);
  }

  .hide-checkbox-container {
    margin-right: var(--spacing-md);
    display: flex;
    align-items: center;
  }

  .hide-checkbox {
    width: 18px;
    height: 18px;
    margin: 0;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 2px solid var(--divider);
    border-radius: 3px;
    background-color: var(--surface);
    position: relative;
    transition: all 0.2s ease;
  }

  .hide-checkbox:hover {
    border-color: var(--primary-color);
  }

  .hide-checkbox:checked {
    background-color: var(--error-color);
    border-color: var(--error-color);
  }

  .hide-checkbox:checked::after {
    content: '✕';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .food-info {
    flex: 1;
    margin-right: 16px;
  }

  .food-name {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 4px;
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .food-measure {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .food-calcium {
    text-align: right;
    flex-shrink: 0;
  }

  .calcium-amount {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }

  .food-type {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
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
  }

  .favorite-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin-left: 8px;
  }

  .favorite-btn:hover {
    background-color: var(--divider);
    color: var(--primary-color);
  }

  .favorite-btn.favorite {
    color: var(--primary-color);
  }

  .favorite-btn .material-icons {
    font-size: 20px;
  }

  .delete-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin-left: 8px;
  }

  .delete-btn:hover {
    background-color: var(--divider);
    color: var(--error-color);
  }

  .delete-btn .material-icons {
    font-size: 20px;
  }

  /* Delete Confirmation Modal */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .delete-modal {
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    width: 90%;
    max-width: 400px;
    overflow: hidden;
  }

  .delete-modal .modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--divider);
    background-color: var(--surface);
  }

  .delete-modal .modal-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.125rem;
    font-weight: 600;
  }

  .delete-modal .modal-body {
    padding: 1.5rem;
  }

  .delete-modal .modal-body p {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    line-height: 1.5;
  }

  .delete-modal .modal-body p:last-child {
    margin-bottom: 0;
  }

  .warning-text {
    color: var(--text-secondary) !important;
    font-size: 0.9rem;
  }

  .modal-actions {
    padding: 1rem 1.5rem;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    background-color: var(--surface-variant);
  }

  .cancel-btn {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--divider);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .cancel-btn:hover {
    background-color: var(--divider);
  }

  .delete-btn-modal {
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .delete-btn-modal:hover {
    opacity: 0.9;
  }

  /* Mobile responsive */
  @media (max-width: 30rem) {
    /* 480px equivalent */
    .content {
      padding: var(--spacing-md);
      padding-bottom: 5rem;
    }

    .data-filter-controls .sort-option,
    .data-sort-controls .sort-option {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
      gap: 0.125rem; /* 2px equivalent */
    }

    .data-filter-controls,
    .data-sort-controls {
      padding: var(--spacing-xs) var(--spacing-sm);
      gap: var(--spacing-sm);
    }

    .data-search {
      padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 2.5rem; /* Space for search icon only */
      font-size: var(--font-size-sm);
    }

    .search-icon {
      left: var(--spacing-md);
      font-size: var(--icon-size-md);
    }

    .food-item {
      padding: var(--spacing-sm) var(--spacing-md);
    }

    .food-info {
      margin-right: var(--spacing-md);
    }
  }

  /* Hide text labels on mobile, show icons only */
  @media (max-width: 30rem) {
    /* 480px equivalent */
    .data-filter-controls .sort-option span:not(.material-icons),
    .data-sort-controls .sort-option span:not(.material-icons) {
      display: none;
    }

    .data-filter-controls .sort-option .material-icons,
    .data-sort-controls .sort-option .material-icons {
      font-size: var(--icon-size-sm) !important;
      margin: 0;
    }
  }

  /* Item Count Display */
  .item-count-display {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--surface-variant);
    border-radius: 6px;
    margin-bottom: var(--spacing-md);
    border: 1px solid var(--divider);
  }

  .item-count-text {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }

  /* Bulk Actions */
  .bulk-actions {
    background-color: var(--surface-variant);
    border: 1px solid var(--divider);
    border-radius: 8px;
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .bulk-select-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .bulk-checkbox {
    margin: 0;
    cursor: pointer;
    accent-color: var(--primary-color);
  }

  .bulk-checkbox:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .bulk-label {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    margin: 0;
  }

  .bulk-skip-note {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    font-style: italic;
  }

  /* Bulk actions mobile responsive */
  @media (max-width: 30rem) {
    .bulk-actions {
      padding: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }

    .bulk-select-container {
      flex-wrap: wrap;
      gap: var(--spacing-xs);
    }

    .bulk-label {
      font-size: var(--font-size-sm);
    }

    .bulk-skip-note {
      font-size: var(--font-size-xs);
      width: 100%;
      margin-top: var(--spacing-xs);
    }
  }

  /* Calcium Filter Styles */
  .calcium-filter-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .calcium-filter-btn {
    background: none;
    border: 1px solid var(--divider);
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--font-size-sm);
    transition: all 0.2s ease;
  }

  .calcium-filter-btn:hover {
    background-color: var(--surface-variant);
    border-color: var(--primary-color);
    color: var(--text-primary);
  }

  .calcium-filter-btn.active {
    background-color: var(--primary-alpha-10);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .calcium-filter-btn .material-icons {
    font-size: 16px;
  }

  /* Calcium Dropdown */
  .calcium-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1000;
    margin-top: 4px;
  }

  .calcium-dropdown-content {
    background: var(--surface);
    border: 1px solid var(--divider);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    min-width: 220px;
    max-width: 280px;
  }

  .filter-section {
    padding: var(--spacing-lg);
  }

  .filter-section h4 {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--text-primary);
    font-size: var(--font-size-base);
    font-weight: 600;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    cursor: pointer;
    font-size: var(--font-size-sm);
    color: var(--text-primary);
  }

  .filter-option input[type="radio"] {
    margin: 0;
    accent-color: var(--primary-color);
  }

  .custom-range {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--divider);
  }

  .range-inputs {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
    margin-left: 1.5rem;
  }

  .range-inputs input {
    width: 60px;
    padding: 0.25rem;
    border: 1px solid var(--divider);
    border-radius: 4px;
    font-size: var(--font-size-sm);
    background: var(--background);
    color: var(--text-primary);
  }

  .range-inputs span {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  /* Mobile responsive calcium filter */
  @media (max-width: 30rem) {
    .calcium-filter-btn {
      right: var(--spacing-md);
      padding: 0.4rem;
      font-size: var(--font-size-xs);
    }

    .data-search {
      padding-right: 5.5rem;
    }

    .calcium-dropdown-content {
      min-width: 200px;
      right: -20px;
    }

    .filter-section {
      padding: var(--spacing-md);
    }

    .range-inputs input {
      width: 50px;
    }
  }

  /* Loading state styles */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    color: var(--text-secondary);
    min-height: 200px;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .docs-link-container {
    margin-right: var(--spacing-md);
    display: flex;
    align-items: center;
  }

  .docs-link-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 18px;
    height: 18px;
  }

  .docs-link-btn:hover {
    background: var(--primary-alpha-10);
    color: var(--primary);
  }

  .docs-link-btn .material-icons {
    font-size: 18px;
  }

  /* Multi-measure styles */
  .measure-count {
    color: var(--text-tertiary);
    font-size: var(--font-size-xs);
    font-style: italic;
    margin-left: var(--spacing-xs);
  }
</style>

<script>
  import { onMount, onDestroy } from "svelte";
  import { calciumState } from "$lib/stores/calcium";
  import { DEFAULT_FOOD_DATABASE } from "$lib/data/foodDatabase";
  import { goto } from "$app/navigation";
  import { getCalciumServiceSync } from "$lib/services/CalciumServiceSingleton";

  let searchQuery = "";
  let selectedFilter = "all";
  let sortBy = "calcium";
  let sortOrder = "desc";
  let filteredFoods = [];

  // Filter and sort foods
  $: {
    let foods = [];
    
    // Apply filter
    if (selectedFilter === "all") {
      foods = [...DEFAULT_FOOD_DATABASE, ...$calciumState.customFoods];
    } else if (selectedFilter === "database") {
      foods = [...DEFAULT_FOOD_DATABASE].filter(food => !$calciumState.favorites.has(food.id));
    } else if (selectedFilter === "user") {
      // Include custom foods and database favorites
      const databaseFavorites = [...DEFAULT_FOOD_DATABASE].filter(food => $calciumState.favorites.has(food.id));
      foods = [...databaseFavorites, ...$calciumState.customFoods];
    }
    
    // Apply search
    if (searchQuery.trim()) {
      foods = foods.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }
    
    // Apply sort
    foods.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "calcium":
          comparison = a.calcium - b.calcium;
          break;
        case "type":
          const aType = (a.isCustom || $calciumState.favorites.has(a.id)) ? "User" : "Database";
          const bType = (b.isCustom || $calciumState.favorites.has(b.id)) ? "User" : "Database";
          comparison = aType.localeCompare(bType);
          break;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });
    
    filteredFoods = foods;
  }


  function handleFilterClick(filter) {
    selectedFilter = filter;
  }

  function handleSortClick(sort) {
    if (sortBy === sort) {
      // Toggle sort order
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      // Change sort field
      sortBy = sort;
      sortOrder = sort === "name" ? "asc" : "desc";
    }
  }

  function getSortIcon(sort) {
    if (sortBy !== sort) return "unfold_more";
    return sortOrder === "desc" ? "expand_more" : "expand_less";
  }

  async function toggleFavorite(food) {
    if (food.isCustom) return; // Only allow favorites for database foods
    
    const calciumService = getCalciumServiceSync();
    if (calciumService) {
      await calciumService.toggleFavorite(food.id);
    }
  }
</script>

<svelte:head>
  <title>Food Data - My Calcium</title>
</svelte:head>

<div class="data-page">

  <div class="content">
    <!-- Search -->
    <div class="search-container">
      <input 
        type="text" 
        class="data-search" 
        placeholder="Search foods..."
        bind:value={searchQuery}
      />
      <span class="material-icons search-icon">search</span>
    </div>

    <!-- Filter Controls -->
    <div class="data-filter-controls">
      <span class="material-icons filter-section-icon">filter_list</span>
      <div class="sort-options">
        <div 
          class="sort-option" 
          class:active={selectedFilter === "all"}
          on:click={() => handleFilterClick("all")}
        >
          <span class="material-icons">all_inclusive</span>
          <span>All</span>
        </div>
        <div 
          class="sort-option" 
          class:active={selectedFilter === "database"}
          on:click={() => handleFilterClick("database")}
        >
          <span class="material-icons">shield</span>
          <span>Database</span>
        </div>
        <div 
          class="sort-option" 
          class:active={selectedFilter === "user"}
          on:click={() => handleFilterClick("user")}
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
        >
          <span class="material-icons">sort_by_alpha</span>
          <span>Name</span>
          <span class="material-icons sort-icon">{getSortIcon("name")}</span>
        </div>
        <div 
          class="sort-option" 
          class:active={sortBy === "calcium"}
          on:click={() => handleSortClick("calcium")}
        >
          <span class="material-icons">science</span>
          <span>Ca</span>
          <span class="material-icons sort-icon">{getSortIcon("calcium")}</span>
        </div>
        <div 
          class="sort-option" 
          class:active={sortBy === "type"}
          on:click={() => handleSortClick("type")}
        >
          <span class="material-icons">category</span>
          <span>Type</span>
          <span class="material-icons sort-icon">{getSortIcon("type")}</span>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="results-container">
      {#each filteredFoods as food}
        <div class="food-item" class:custom={food.isCustom}>
          <div class="food-info">
            <div class="food-name">{food.name}</div>
            <div class="food-measure">{food.measure}</div>
          </div>
          <div class="food-calcium">
            <div class="calcium-amount">{food.calcium}mg</div>
            <div class="food-type">
              {(food.isCustom || $calciumState.favorites.has(food.id)) ? "User" : "Database"}
            </div>
          </div>
          {#if !food.isCustom}
            <button 
              class="favorite-btn"
              class:favorite={$calciumState.favorites.has(food.id)}
              on:click={() => toggleFavorite(food)}
              title={$calciumState.favorites.has(food.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <span class="material-icons">
                {$calciumState.favorites.has(food.id) ? "star" : "star_border"}
              </span>
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
  </div>

</div>

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

  .search-container {
    position: relative;
    margin-bottom: var(--spacing-lg);
  }

  .data-search {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md) 3rem; /* 48px equivalent */
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
    align-items: flex-start;
    position: relative;
  }

  .food-item.custom {
    border-left: 3px solid var(--secondary-color);
    background-color: var(--custom-food-bg);
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


  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
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
      padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 2.5rem; /* 40px equivalent */
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
  @media (max-width: 30rem) { /* 480px equivalent */
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
</style>
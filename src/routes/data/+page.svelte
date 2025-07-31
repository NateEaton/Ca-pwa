<script>
  import { calciumState } from "$lib/stores/calcium";
  import { USDA_CALCIUM_DATA } from "$lib/data/usdaCalciumData";
  import { goto } from "$app/navigation";

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
      foods = [...USDA_CALCIUM_DATA, ...$calciumState.customFoods];
    } else if (selectedFilter === "usda") {
      foods = [...USDA_CALCIUM_DATA];
    } else if (selectedFilter === "custom") {
      foods = [...$calciumState.customFoods];
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
          const aType = a.isCustom ? "Custom" : "USDA";
          const bType = b.isCustom ? "Custom" : "USDA";
          comparison = aType.localeCompare(bType);
          break;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });
    
    filteredFoods = foods;
  }

  function handleBackClick() {
    goto('/');
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
</script>

<svelte:head>
  <title>Food Data - My Calcium</title>
</svelte:head>

<div class="data-page">
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button class="back-button" on:click={handleBackClick}>
          <span class="material-icons">arrow_back</span>
        </button>
      </div>
      <div class="header-center">
        <h1>Data</h1>
      </div>
      <div class="header-right">
        <!-- Empty for symmetry -->
      </div>
    </div>
  </header>

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
          class:active={selectedFilter === "usda"}
          on:click={() => handleFilterClick("usda")}
        >
          <span class="material-icons">shield</span>
          <span>USDA</span>
        </div>
        <div 
          class="sort-option" 
          class:active={selectedFilter === "custom"}
          on:click={() => handleFilterClick("custom")}
        >
          <span class="material-icons">build</span>
          <span>Custom</span>
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
              {food.isCustom ? "Custom" : "USDA"}
            </div>
          </div>
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
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    height: 100vh;
    background-color: var(--background);
    z-index: 2000;
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .header {
    background: var(--primary-color);
    color: white;
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow);
    flex-shrink: 0;
  }

  .header-content {
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    align-items: center;
    max-width: 480px;
    margin: 0 auto;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-center {
    text-align: center;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
  }

  .header-center h1 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .back-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .back-button .material-icons {
    font-size: 24px;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    padding-bottom: 80px;
  }

  .search-container {
    position: relative;
    margin-bottom: 16px;
  }

  .data-search {
    width: 100%;
    padding: 12px 16px 12px 48px;
    border: 1px solid var(--divider);
    border-radius: 8px;
    font-size: 16px;
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
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    font-size: 20px;
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


  /* Mobile responsive */
  @media (max-width: 480px) {
    .content {
      padding: 12px;
      padding-bottom: 80px;
    }

    .data-filter-controls .sort-option,
    .data-sort-controls .sort-option {
      padding: 4px 6px;
      font-size: 0.75rem;
      gap: 2px;
    }

    .data-filter-controls,
    .data-sort-controls {
      padding: 4px 8px;
      gap: 6px;
    }

    .data-search {
      padding: 10px 14px 10px 40px;
      font-size: 14px;
    }

    .search-icon {
      left: 12px;
      font-size: 18px;
    }

    .food-item {
      padding: 10px 12px;
    }

    .food-info {
      margin-right: 12px;
    }

  }

  /* Hide text labels on mobile, show icons only */
  @media (max-width: 480px) {
    .data-filter-controls .sort-option span:not(.material-icons),
    .data-sort-controls .sort-option span:not(.material-icons) {
      display: none;
    }

    .data-filter-controls .sort-option .material-icons,
    .data-sort-controls .sort-option .material-icons {
      font-size: 16px !important;
      margin: 0;
    }
  }
</style>
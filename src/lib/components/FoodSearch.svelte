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
  import { searchFoods } from "$lib/data/foodDatabase";

  export let customFoods = [];
  export let searchQuery = "";

  const dispatch = createEventDispatcher();

  let searchResults = [];
  let searchTimeout;
  let showResults = false;

  function handleSearch(event) {
    searchQuery = event.target.value;

    clearTimeout(searchTimeout);

    if (searchQuery.length < 2) {
      showResults = false;
      searchResults = [];
      return;
    }

    searchTimeout = setTimeout(() => {
      searchResults = searchFoods(searchQuery, customFoods);
      showResults = searchResults.length > 0;
    }, 300);
  }

  function selectFood(food) {
    dispatch("foodSelected", food);
    showResults = false;
    searchQuery = food.name;
  }

  function clearSearch() {
    searchQuery = "";
    searchResults = [];
    showResults = false;
    dispatch("searchCleared");
  }

  // Close results when clicking outside
  function handleOutsideClick(event) {
    if (showResults && !event.target.closest(".food-search-container")) {
      showResults = false;
    }
  }
</script>

<svelte:window on:click={handleOutsideClick} />

<div class="food-search-container">
  <div class="search-input-container">
    <input
      type="text"
      bind:value={searchQuery}
      on:input={handleSearch}
      placeholder="Search for foods (e.g., 'milk', 'cheese', 'broccoli')..."
      class="search-input"
    />
    {#if searchQuery}
      <button class="clear-search-btn" on:click={clearSearch}>
        <span class="material-icons">close</span>
      </button>
    {/if}
  </div>

  {#if showResults}
    <div class="search-results">
      {#each searchResults as food}
        <button class="search-result-item" on:click={() => selectFood(food)}>
          <div class="food-info">
            <div class="food-name">
              {food.name}
              {#if food.isCustom}
                <span class="custom-badge">Custom</span>
              {/if}
            </div>
            <div class="food-details">
              {food.measure} • {Math.round(food.calcium)}mg calcium
            </div>
          </div>
          <div class="food-icon">
            <span class="material-icons">restaurant</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}

  {#if searchQuery.length >= 2 && searchResults.length === 0 && showResults}
    <div class="search-results">
      <div class="no-results">
        <span class="material-icons">search_off</span>
        <span>No foods found</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .food-search-container {
    position: relative;
    width: 100%;
  }

  .search-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem;
    padding-right: 2.5rem;
    border: 1px solid var(--divider);
    border-radius: 8px;
    font-size: 1rem;
    background: var(--background);
    color: var(--text-primary);
    transition: border-color 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .clear-search-btn {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .clear-search-btn:hover {
    background-color: var(--surface-variant);
  }

  .clear-search-btn .material-icons {
    font-size: 18px;
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface);
    border: 1px solid var(--divider);
    border-top: none;
    border-radius: 0 0 8px 8px;
    box-shadow: var(--shadow-lg);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
  }

  .search-result-item {
    width: 100%;
    padding: 0.75rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.2s;
    border-bottom: 1px solid var(--divider);
  }

  .search-result-item:last-child {
    border-bottom: none;
  }

  .search-result-item:hover {
    background-color: var(--surface-variant);
  }

  .food-info {
    flex: 1;
  }

  .food-name {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .custom-badge {
    background: var(--success-color);
    color: white;
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-weight: 500;
  }

  .food-details {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .food-icon {
    color: var(--text-secondary);
    margin-left: 0.5rem;
  }

  .food-icon .material-icons {
    font-size: 20px;
  }

  .no-results {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    color: var(--text-secondary);
    justify-content: center;
  }

  .no-results .material-icons {
    font-size: 20px;
  }
</style>

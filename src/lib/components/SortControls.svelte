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
  import { sortSettings } from "$lib/stores/calcium";

  const dispatch = createEventDispatcher();

  function handleSortClick(sortBy) {
    dispatch("sortChange", { sortBy });
  }
</script>

<div class="sort-controls" class:muted={$sortSettings.isLoading}>
  <div class="sort-label">
    <span class="material-icons sort-section-icon">sort</span>
  </div>

  <div class="sort-options">
    <button
      class="sort-option"
      class:active={$sortSettings.sortBy === "time"}
      data-sort="added"
      on:click={() => handleSortClick("added")}
    >
      <span class="material-icons">schedule</span>
      <span class="sort-text">Added</span>
      <span class="material-icons sort-icon">
        {$sortSettings.sortBy === "time"
          ? $sortSettings.sortOrder === "asc"
            ? "expand_less"
            : "expand_more"
          : "unfold_more"}
      </span>
    </button>

    <button
      class="sort-option"
      class:active={$sortSettings.sortBy === "name"}
      data-sort="name"
      on:click={() => handleSortClick("name")}
    >
      <span class="material-icons">sort_by_alpha</span>
      <span class="sort-text">Name</span>
      <span class="material-icons sort-icon">
        {$sortSettings.sortBy === "name"
          ? $sortSettings.sortOrder === "asc"
            ? "expand_less"
            : "expand_more"
          : "unfold_more"}
      </span>
    </button>

    <button
      class="sort-option"
      class:active={$sortSettings.sortBy === "calcium"}
      data-sort="calcium"
      on:click={() => handleSortClick("calcium")}
    >
      <span class="material-icons">science</span>
      <span class="sort-text">Ca</span>
      <span class="material-icons sort-icon">
        {$sortSettings.sortBy === "calcium"
          ? $sortSettings.sortOrder === "asc"
            ? "expand_less"
            : "expand_more"
          : "unfold_more"}
      </span>
    </button>
  </div>
</div>

<style>
  .sort-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  .sort-controls.muted {
    opacity: 0.4;
    pointer-events: none;
  }

  .sort-label {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .sort-section-icon {
    font-size: var(--icon-size-lg);
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  .sort-options {
    display: flex;
    justify-content: space-between;
    flex: 1;
    gap: var(--spacing-sm);
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
    gap: 0.1875rem;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--spacing-md);
    cursor: pointer;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    transition: all 0.2s ease;
    border: 1px solid transparent;
    flex: 1;
    justify-content: center;
    text-align: center;
    min-height: var(--touch-target-min);
    background: none;
  }

  .sort-option:hover {
    background-color: var(--surface-variant);
  }

  .sort-option.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  .sort-icon {
    font-size: var(--icon-size-sm);
  }

  .sort-option.active .sort-icon {
    color: white;
  }

  /* Responsive design - hide text on small screens, show only icons */
  @media (max-width: 30rem) { /* 480px equivalent */
    .sort-text {
      display: none;
    }

    .sort-option {
      gap: var(--spacing-xs);
      padding: var(--spacing-sm);
      min-width: var(--touch-target-min);
    }

    .sort-label span:not(.material-icons) {
      display: none;
    }
  }

  /* Large screens - show both icons and text */
  @media (min-width: 30.0625rem) { /* 481px equivalent */
    .sort-option {
      justify-content: center;
      gap: var(--spacing-sm);
    }
  }
</style>

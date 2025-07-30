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
    <span>Sort</span>
  </div>

  <div class="sort-options">
    <button
      class="sort-option"
      class:active={$sortSettings.sortBy === "added"}
      data-sort="added"
      on:click={() => handleSortClick("added")}
    >
      <span class="material-icons">schedule</span>
      <span class="sort-text">Added</span>
      <span class="material-icons sort-icon">
        {$sortSettings.sortBy === "added"
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
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  .sort-controls.muted {
    opacity: 0.4;
    pointer-events: none;
  }

  .sort-label {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--text-secondary);
    font-weight: 500;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sort-section-icon {
    font-size: var(--font-size-lg, 1.125rem);
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  .sort-options {
    display: flex;
    justify-content: space-between;
    flex: 1;
    gap: 0.5rem;
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
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    cursor: pointer;
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--text-secondary);
    transition: all 0.2s ease;
    border: 1px solid transparent;
    flex: 1;
    justify-content: center;
    text-align: center;
    min-height: var(--touch-target-min, 44px);
    background: none;
  }

  .sort-option:hover {
    background-color: var(--surface-variant, #f0f0f0);
  }

  .sort-option.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  .sort-icon {
    font-size: var(--font-size-sm, 0.875rem);
  }

  .sort-option.active .sort-icon {
    color: white;
  }

  /* Responsive design - hide text on small screens, show only icons */
  @media (max-width: 480px) {
    .sort-text {
      display: none;
    }

    .sort-option {
      gap: 0.25rem;
      padding: 0.5rem;
      min-width: 44px;
    }

    .sort-label span:not(.material-icons) {
      display: none;
    }
  }

  /* Large screens - show both icons and text */
  @media (min-width: 481px) {
    .sort-option {
      justify-content: center;
      gap: 0.375rem;
    }
  }
</style>

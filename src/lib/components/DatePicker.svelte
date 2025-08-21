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
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import {
    formatDate,
    addDays,
    isToday,
    getTodayString,
  } from "$lib/utils/dateUtils";

  export let currentDate;
  export let displayText = null; // Optional custom display text
  export let showTodayButton = true; // Always show today button option

  const dispatch = createEventDispatcher();
  let showCalendar = false;

  // Check if current date is today for styling
  $: isCurrentDateToday = isToday(currentDate);

  // Use custom display text if provided, otherwise format date
  $: dateDisplayText = displayText || formatDate(currentDate);

  function toggleCalendar() {
    showCalendar = !showCalendar;
  }

  function handleDateChange(direction) {
    const newDate = addDays(currentDate, direction === "next" ? 1 : -1);
    dispatch("dateChange", { date: newDate });
  }

  function handleCalendarChange(event) {
    const target = event.target;
    dispatch("dateChange", { date: target.value });
    showCalendar = false;
  }

  function goToToday() {
    dispatch("dateChange", { date: getTodayString() });
    showCalendar = false;
  }

  function handleOutsideClick(event) {
    if (
      showCalendar &&
      event.target &&
      !event.target.closest(".date-picker-container")
    ) {
      showCalendar = false;
    }
  }

  // Navigation event handlers
  function handleKeydown(event) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        handleDateChange("prev");
        break;
      case "ArrowRight":
        event.preventDefault();
        handleDateChange("next");
        break;
    }
  }

  onMount(() => {
    // Add keyboard event listener
    document.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    // Clean up event listeners
    document.removeEventListener("keydown", handleKeydown);
  });
</script>

<svelte:window on:click={handleOutsideClick} />

<div class="date-picker-container">
  <div class="date-navigation">
    <button class="nav-btn" on:click={() => handleDateChange("prev")}>
      <span class="material-icons">chevron_left</span>
    </button>

    <button
      class="current-date-btn"
      class:is-today={isCurrentDateToday}
      on:click={toggleCalendar}
    >
      {dateDisplayText}
      <span class="material-icons">calendar_today</span>
    </button>

    <button class="nav-btn" on:click={() => handleDateChange("next")}>
      <span class="material-icons">chevron_right</span>
    </button>
  </div>

  {#if showCalendar}
    <div class="calendar-popup">
      <input
        type="date"
        value={currentDate}
        on:change={handleCalendarChange}
        class="date-input"
      />
      {#if showTodayButton && (!isCurrentDateToday || showTodayButton === "always")}
        <button class="today-btn" on:click={goToToday}>
          <span class="material-icons">today</span>
          Today
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .date-picker-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .date-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .nav-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
    font-weight: bold;
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .nav-btn:hover {
    background-color: var(--divider);
    color: var(--text-primary);
  }

  .current-date-btn {
    background: none;
    border: none;
    color: var(--text-primary);
    font-weight: 600;
    font-size: var(--font-size-lg);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--spacing-sm);
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    min-width: 10rem; /* 160px equivalent - ensure space for text and icon */
    justify-content: center;
  }

  .current-date-btn:hover {
    background-color: var(--surface-variant);
  }

  .current-date-btn .material-icons {
    font-size: var(--icon-size-md);
    color: var(--text-secondary);
  }

  .current-date-btn.is-today {
    background-color: var(--primary-color);
    color: white;
    font-weight: 700;
  }

  .current-date-btn.is-today:hover {
    background-color: var(--primary-color-dark);
  }

  .current-date-btn.is-today .material-icons {
    color: white;
  }

  .today-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: 1.25rem; /* 20px equivalent */
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    transition: all 0.2s;
  }

  .today-btn:hover {
    background: var(--primary-color-dark);
    transform: translateY(-0.0625rem); /* -1px equivalent */
  }

  .today-btn .material-icons {
    font-size: var(--icon-size-sm);
  }

  .calendar-popup {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--surface);
    border-radius: var(--spacing-sm);
    box-shadow: var(--shadow-lg);
    padding: var(--spacing-lg);
    z-index: 1000;
    margin-top: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    border: 1px solid var(--divider);
  }

  .date-input {
    border: 1px solid var(--divider);
    border-radius: var(--spacing-xs);
    padding: var(--spacing-sm);
    font-size: var(--font-size-base);
    background: var(--background);
    color: var(--text-primary);
  }

  .date-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }
</style>

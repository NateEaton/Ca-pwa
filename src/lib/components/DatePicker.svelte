<script>
  import { createEventDispatcher } from "svelte";
  import {
    formatDate,
    addDays,
    isToday,
    getTodayString,
  } from "$lib/utils/dateUtils";

  export let currentDate;

  const dispatch = createEventDispatcher();
  let showCalendar = false;

  // Check if current date is today for styling
  $: isCurrentDateToday = isToday(currentDate);

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
      {formatDate(currentDate)}
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
      {#if !isCurrentDateToday}
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
    gap: 0.5rem;
  }

  .date-navigation {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-btn:hover {
    background-color: var(--surface-variant);
  }

  .current-date-btn {
    background: none;
    border: none;
    color: var(--text-primary);
    font-weight: 600;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 160px;
    justify-content: center;
  }

  .current-date-btn:hover {
    background-color: var(--surface-variant);
  }

  .current-date-btn .material-icons {
    font-size: 18px;
    color: var(--text-secondary);
  }

  .current-date-btn.is-today {
    background-color: var(--primary-color);
    color: white;
    font-weight: 700;
  }

  .current-date-btn.is-today:hover {
    background-color: var(--primary-color-dark, #1565c0);
  }

  .current-date-btn.is-today .material-icons {
    color: white;
  }

  .today-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s;
  }

  .today-btn:hover {
    background: var(--primary-color-dark, #1565c0);
    transform: translateY(-1px);
  }

  .today-btn .material-icons {
    font-size: 16px;
  }

  .calendar-popup {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--surface);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    padding: 1rem;
    z-index: 1000;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid var(--divider);
  }

  .date-input {
    border: 1px solid var(--divider);
    border-radius: 4px;
    padding: 0.5rem;
    font-size: 1rem;
    background: var(--background);
    color: var(--text-primary);
  }

  .date-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .current-date-btn {
      min-width: 180px; /* Increase from 140px */
      font-size: 1rem;
      padding: 0.75rem 1rem; /* Increase padding */
    }

    .date-navigation {
      gap: 0.5rem; /* Reduce gap slightly */
    }

    .date-input {
      padding: 0.75rem;
      font-size: 16px; /* Prevent iOS zoom */
      width: 100%;
    }

    .today-btn {
      width: 100%;
      justify-content: center;
      padding: 0.75rem 1rem;
    }

    .calendar-popup {
      left: 1rem;
      right: 1rem;
      transform: none;
      margin-top: 0.5rem;
      width: auto;
      max-width: none;
    }
  }
</style>

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
  import DatePicker from "./DatePicker.svelte";
  import { addDays } from "$lib/utils/dateUtils";

  export let currentDate;
  export let dailyTotal;
  export let dailyGoal;

  const dispatch = createEventDispatcher();
  let summaryCardElement;

  // Calculate progress percentage
  $: actualPercentage = (dailyTotal / dailyGoal) * 100;
  $: progressPercentage = Math.min(actualPercentage, 100);
  $: displayPercentage = Math.round(actualPercentage);

  // Touch handling
  let touchStartX = 0;
  let touchStartY = 0;
  let isScrolling = false;

  function handleDateChange(event) {
    dispatch("dateChange", event.detail);
  }


  function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isScrolling = false;
  }

  function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) return;
    
    const touch = event.touches[0];
    const diffX = touchStartX - touch.clientX;
    const diffY = touchStartY - touch.clientY;
    
    // Determine if this is a vertical scroll (ignore horizontal swipes)
    if (Math.abs(diffY) > Math.abs(diffX)) {
      isScrolling = true;
      return;
    }
  }

  function handleTouchEnd(event) {
    if (!touchStartX || !touchStartY || isScrolling) {
      touchStartX = 0;
      touchStartY = 0;
      isScrolling = false;
      return;
    }

    const touch = event.changedTouches[0];
    const diffX = touchStartX - touch.clientX;
    const diffY = touchStartY - touch.clientY;
    
    // Minimum swipe distance (50px)
    const minSwipeDistance = 50;
    
    // Ensure horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swipe left - go to next day
        const newDate = addDays(currentDate, 1);
        dispatch("dateChange", { date: newDate });
      } else {
        // Swipe right - go to previous day
        const newDate = addDays(currentDate, -1);
        dispatch("dateChange", { date: newDate });
      }
    }
    
    touchStartX = 0;
    touchStartY = 0;
    isScrolling = false;
  }

  onDestroy(() => {
    if (summaryCardElement) {
      summaryCardElement.removeEventListener("touchstart", handleTouchStart);
      summaryCardElement.removeEventListener("touchmove", handleTouchMove);
      summaryCardElement.removeEventListener("touchend", handleTouchEnd);
    }
  });

  // Set up touch listeners when summary card element becomes available
  $: if (summaryCardElement) {
    summaryCardElement.addEventListener("touchstart", handleTouchStart, { passive: false });
    summaryCardElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    summaryCardElement.addEventListener("touchend", handleTouchEnd, { passive: false });
  }
</script>

<div class="summary-card" bind:this={summaryCardElement}>
  <DatePicker {currentDate} on:dateChange={handleDateChange} />

  <div class="calcium-summary">
    <div class="summary-numbers">
      <div class="current-section">
        <div class="current-amount">{Math.round(dailyTotal)}</div>
        <div class="current-label">Total</div>
      </div>

      <div class="progress-section">
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              class:incomplete={actualPercentage < 100}
              style="width: {progressPercentage}%"
            ></div>
          </div>
          <div class="progress-text">{displayPercentage}%</div>
        </div>
      </div>

      <div class="goal-section">
        <div class="goal-display">
          <div class="goal-amount">{dailyGoal}</div>
          <div class="goal-label">Goal</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .summary-card {
    background: var(--surface);
    border: 1px solid var(--divider);
    border-radius: var(--spacing-md);
    padding: var(--spacing-lg) var(--spacing-xl);
    margin: var(--spacing-lg);
    box-shadow: var(--shadow);
  }

  .calcium-summary {
    margin-top: var(--spacing-lg);
  }

  .summary-numbers {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: var(--spacing-lg);
    align-items: center;
  }

  .current-section,
  .goal-section {
    text-align: center;
  }

  .current-amount,
  .goal-amount {
    font-size: var(--font-size-2xl);
    font-weight: bold;
    line-height: 1;
    margin-bottom: var(--spacing-xs);
    color: var(--text-primary);
  }

  .current-label,
  .goal-label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
  }

  .goal-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-sm);
  }

  .progress-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .progress-bar-container {
    position: relative;
  }

  .progress-bar {
    width: 100%;
    height: var(--spacing-sm); /* 8px equivalent */
    background: var(--surface-variant);
    border-radius: var(--spacing-xs);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: var(--spacing-xs);
    transition: width 0.3s ease;
  }

  .progress-fill.incomplete {
    background: var(--error-color);
  }

  .progress-text {
    text-align: center;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
    .summary-numbers {
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--spacing-sm);
    }

    .current-amount,
    .goal-amount {
      font-size: var(--font-size-xl);
    }

    .current-label,
    .goal-label {
      font-size: var(--font-size-xs);
    }
  }
</style>

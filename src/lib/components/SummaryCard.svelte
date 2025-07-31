<script>
  import { createEventDispatcher } from "svelte";
  import DatePicker from "./DatePicker.svelte";

  export let currentDate;
  export let dailyTotal;
  export let dailyGoal;

  const dispatch = createEventDispatcher();

  // Calculate progress percentage
  $: progressPercentage = Math.min((dailyTotal / dailyGoal) * 100, 100);

  function handleDateChange(event) {
    dispatch("dateChange", event.detail);
  }

  function handleGoalClick() {
    dispatch("goalEdit");
  }
</script>

<div class="summary-card">
  <DatePicker {currentDate} on:dateChange={handleDateChange} />

  <div class="calcium-summary">
    <div class="summary-numbers">
      <div class="current-section">
        <div class="current-amount">{dailyTotal}</div>
        <div class="current-label">Total</div>
      </div>

      <div class="progress-section">
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              style="width: {progressPercentage}%"
            ></div>
          </div>
          <div class="progress-text">{Math.round(progressPercentage)}%</div>
        </div>
      </div>

      <div class="goal-section">
        <button class="goal-button" on:click={handleGoalClick}>
          <div class="goal-amount">{dailyGoal}</div>
          <div class="goal-label">Goal</div>
          <span class="material-icons goal-edit-icon">edit</span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .summary-card {
    background: var(--surface);
    border: 1px solid var(--divider);
    border-radius: var(--spacing-sm);
    padding: var(--spacing-lg) var(--spacing-xl);
    margin-bottom: var(--spacing-lg);
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
  }

  .goal-button {
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: var(--spacing-sm);
    transition: all 0.2s;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: var(--touch-target-min);
  }

  .goal-button:hover {
    background: var(--surface-variant);
  }

  .goal-edit-icon {
    position: absolute;
    top: 0;
    right: 0;
    font-size: var(--icon-size-md);
    opacity: 0.5;
    color: var(--text-secondary);
    transition: opacity 0.2s;
  }

  .goal-button:hover .goal-edit-icon {
    opacity: 1;
    color: var(--primary-color);
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

    .goal-edit-icon {
      font-size: var(--icon-size-sm);
    }
  }
</style>

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
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
  }

  .calcium-summary {
    margin-top: 1rem;
  }

  .summary-numbers {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 1rem;
    align-items: center;
  }

  .current-section,
  .goal-section {
    text-align: center;
  }

  .current-amount,
  .goal-amount {
    font-size: 2rem;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 0.25rem;
    color: var(--text-primary);
  }

  .current-label,
  .goal-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .goal-button {
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .goal-button:hover {
    background: var(--surface-variant);
  }

  .goal-edit-icon {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 16px;
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
    gap: 0.5rem;
  }

  .progress-bar-container {
    position: relative;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--surface-variant);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .summary-numbers {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.5rem;
    }

    .current-amount,
    .goal-amount {
      font-size: 1.5rem;
    }

    .current-label,
    .goal-label {
      font-size: 0.75rem;
    }

    .goal-edit-icon {
      font-size: 14px;
    }
  }
</style>

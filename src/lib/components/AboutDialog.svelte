<script>
  export let show = false;

  function handleClose() {
    show = false;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      handleClose();
    }
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-backdrop" on:click={handleBackdropClick}>
    <div
      class="modal"
      role="dialog"
      aria-labelledby="about-title"
      aria-modal="true"
    >
      <div class="modal-header">
        <div class="modal-header-left">
          <button
            class="back-btn"
            on:click={handleClose}
            aria-label="Close about dialog"
          >
            <span class="material-icons">arrow_back</span>
          </button>
        </div>
        <div class="modal-header-center">
          <h2 id="about-title" class="modal-title">About</h2>
        </div>
      </div>

      <div class="modal-body">
        <div class="about-content">
          <div class="about-section">
            <h3>My Calcium</h3>
            <p>
              A simple, privacy-focused app to help you track your daily calcium
              intake in support of achieving your health goals.
            </p>
          </div>

          <div class="about-section">
            <h4>Features</h4>
            <ul>
              <li>Track calcium from list of USDA-verified foods</li>
              <li>Add custom foods with your own calcium values</li>
              <li>Set personalized daily calcium goals</li>
              <li>View historical data and food database</li>
              <li>Can run in browser or installed locally</li>
              <li>Your data stays private on your device</li>
            </ul>
          </div>

          <div class="about-footer">
            <p>Version 1.0 • Built with ❤️ for better nutrition tracking</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:window on:keydown={handleKeydown} />

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    width: 90%;
    max-width: 432px; /* 90% of 480px */
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--divider);
    background-color: var(--surface);
    flex-shrink: 0;
    position: relative;
  }

  .back-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .back-btn .material-icons {
    font-size: 24px;
  }

  .modal-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modal-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
  }

  .modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }

  .about-content {
    color: var(--text-primary);
  }

  .about-section {
    margin-bottom: 1.5rem;
  }

  .about-section:last-child {
    margin-bottom: 0;
  }

  .about-section h3 {
    color: var(--primary-color);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .about-section h4 {
    color: var(--text-primary);
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .about-section p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  .about-section ul {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }

  .about-section li {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0.25rem;
  }

  .about-footer {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid var(--divider);
    margin-top: 1.5rem;
  }

  .about-footer p {
    color: var(--text-hint);
    font-size: 0.875rem;
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .modal-backdrop {
      padding: 0.5rem;
    }

    .modal {
      max-height: 95vh;
    }

    .modal-header {
      padding: 1rem;
    }

    .modal-body {
      padding: 1rem;
    }

    .about-section h3 {
      font-size: 1.25rem;
    }

    .about-section h4 {
      font-size: 1.1rem;
    }

    .about-section p,
    .about-section li {
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
</style>

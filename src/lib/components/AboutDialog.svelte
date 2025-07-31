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
    background-color: var(--modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-lg);
  }

  .modal {
    background-color: var(--surface);
    border-radius: var(--spacing-sm);
    box-shadow: var(--shadow-lg);
    width: 90%;
    max-width: 27rem; /* 432px equivalent */
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    padding: var(--spacing-lg) var(--spacing-xl);
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
    font-size: var(--icon-size-xl);
  }

  .back-btn .material-icons {
    font-size: var(--icon-size-xl);
  }

  .modal-header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .modal-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .modal-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
  }

  .modal-body {
    padding: var(--spacing-xl);
    overflow-y: auto;
    flex: 1;
  }

  .about-content {
    color: var(--text-primary);
  }

  .about-section {
    margin-bottom: var(--spacing-2xl);
  }

  .about-section:last-child {
    margin-bottom: 0;
  }

  .about-section h3 {
    color: var(--primary-color);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-sm);
    font-weight: 600;
  }

  .about-section h4 {
    color: var(--text-primary);
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
  }

  .about-section p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-sm);
  }

  .about-section ul {
    margin: var(--spacing-sm) 0;
    padding-left: var(--spacing-xl);
  }

  .about-section li {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-xs);
  }

  .about-footer {
    text-align: center;
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--divider);
    margin-top: var(--spacing-2xl);
  }

  .about-footer p {
    color: var(--text-hint);
    font-size: var(--font-size-sm);
  }

  /* Mobile responsive */
  @media (max-width: 30rem) { /* 480px equivalent */
    .modal-backdrop {
      padding: var(--spacing-sm);
    }

    .modal {
      max-height: 95vh;
    }

    .modal-header {
      padding: var(--spacing-lg);
    }

    .modal-body {
      padding: var(--spacing-lg);
    }

    .about-section h3 {
      font-size: var(--font-size-xl);
    }

    .about-section h4 {
      font-size: var(--font-size-lg);
    }

    .about-section p,
    .about-section li {
      font-size: var(--font-size-sm);
      line-height: 1.5;
    }
  }
</style>

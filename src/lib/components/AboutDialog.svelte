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

  function handleBackdropKeydown(event) {
    if (event.key === "Escape") {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div class="modal-backdrop full-screen" on:click={handleBackdropClick} on:keydown={handleBackdropKeydown} role="button" tabindex="0">
    <div class="modal-container full-screen" role="dialog" aria-labelledby="about-title" aria-modal="true">
      <!-- Modal Header -->
      <div class="modal-header">
        <button class="back-btn" on:click={handleClose} aria-label="Close about dialog">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 id="about-title" class="modal-title">About</h2>
        <div class="header-spacer"></div>
      </div>
      
      <!-- Modal Content (restore original content) -->
      <div class="modal-content">
        <div class="about-content">
          <div class="app-info">
            <h3 class="app-name">My Calcium</h3>
            <p class="app-description">
              A simple, privacy-focused app to help you track your daily calcium intake 
              in support of achieving your health goals.
            </p>
          </div>
          
          <div class="features-section">
            <h4>Features</h4>
            <ul class="features-list">
              <li>Track calcium from list of Database-verified foods</li>
              <li>Add custom foods with your own calcium values</li>
              <li>Set personalized daily calcium goals</li>
              <li>View historical data and food database</li>
              <li>Can run in browser or installed locally</li>
              <li>Your data stays private on your device</li>
            </ul>
          </div>
          
          <div class="app-meta">
            <p class="version-info">Version 1.0 • Built with ❤️ for better nutrition tracking</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Full-screen modal backdrop */
  .modal-backdrop.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--modal-backdrop);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Full-screen modal container */
  .modal-container.full-screen {
    width: 100%;
    height: 100%;
    max-width: 480px; /* Match app container width */
    background-color: var(--surface);
    border-radius: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Modal header */
  .modal-header {
    display: grid;
    grid-template-columns: var(--touch-target-min) 1fr var(--touch-target-min);
    align-items: center;
    padding: var(--spacing-lg);
    background-color: var(--primary-color);
    color: white;
    min-height: var(--header-height);
  }

  .back-btn {
    background: none;
    border: none;
    color: white;
    padding: var(--spacing-sm);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }

  .back-btn:hover {
    background-color: var(--hover-overlay);
  }

  .modal-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0;
    text-align: left;
  }

  .header-spacer {
    /* Balances the back button */
  }

  /* Modal content */
  .modal-content {
    flex: 1;
    padding: var(--spacing-xl);
    overflow-y: auto;
  }

  .about-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    max-width: 100%;
  }

  .app-name {
    color: var(--primary-color);
    font-size: var(--font-size-xl);
    margin: 0 0 var(--spacing-md) 0;
  }

  .app-description {
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
  }

  .features-section h4 {
    color: var(--text-primary);
    margin: 0 0 var(--spacing-lg) 0;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .features-list li {
    position: relative;
    padding-left: var(--spacing-xl);
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .features-list li::before {
    content: "•";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: var(--spacing-sm);
  }

  .version-info {
    text-align: center;
    color: var(--text-hint);
    font-size: var(--font-size-sm);
    margin: 0;
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--divider);
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .modal-backdrop.full-screen {
      /* Prevent touch scrolling on backdrop */
      touch-action: none;
    }
    
    .modal-container.full-screen {
      width: 100vw;
      height: 100vh;
      max-width: none;
      /* Re-enable touch scrolling inside modal content */
      touch-action: auto;
    }
  }
</style>
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
  import { DATABASE_METADATA } from "$lib/data/foodDatabase";
  
  export let show = false;
  
  let notesExpanded = false;

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

  function toggleNotes() {
    notesExpanded = !notesExpanded;
  }

  function getNotesPreview(notes) {
    if (!notes) return '';
    const sentences = notes.split('. ');
    return sentences.slice(0, 2).join('. ') + '.';
  }

  function formatTextWithLineBreaks(text) {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div class="modal-backdrop full-screen" on:click={handleBackdropClick} on:keydown={handleBackdropKeydown} role="button" tabindex="0">
    <div class="modal-container full-screen" role="dialog" aria-labelledby="database-info-title" aria-modal="true">
      <!-- Modal Header -->
      <div class="modal-header">
        <button class="back-btn" on:click={handleClose} aria-label="Close database info dialog">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 id="database-info-title" class="modal-title">Database Information</h2>
        <div class="header-spacer"></div>
      </div>
      
      <!-- Modal Content -->
      <div class="modal-content">
        <div class="database-info-content">
          <div class="source-info">
            <h3 class="database-name">{DATABASE_METADATA.name}</h3>
            <p class="database-description">
              {DATABASE_METADATA.description}
            </p>
          </div>
          
          <div class="metadata-section">
            <h4>Source Details</h4>
            <div class="metadata-grid">
              <div class="metadata-item">
                <span class="metadata-label">Source:</span>
                <span class="metadata-value">{DATABASE_METADATA.label}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Version:</span>
                <span class="metadata-value">{DATABASE_METADATA.version}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Record Count:</span>
                <span class="metadata-value">{DATABASE_METADATA.recordCount.toLocaleString()}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Last Updated:</span>
                <span class="metadata-value">{DATABASE_METADATA.created}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Author:</span>
                <span class="metadata-value">{DATABASE_METADATA.author}</span>
              </div>
            </div>
          </div>
          
          <div class="notes-section">
            <h4>Processing Notes</h4>
            <div class="notes-text">
              {#if notesExpanded}
                {@html formatTextWithLineBreaks(DATABASE_METADATA.notes)}
              {:else}
                {@html formatTextWithLineBreaks(getNotesPreview(DATABASE_METADATA.notes))}
              {/if}
            </div>
            <button class="toggle-notes-btn" on:click={toggleNotes}>
              {notesExpanded ? 'Show less' : 'Read more'}
            </button>
          </div>
          
          <div class="source-link-section">
            <h4>Original Sources</h4>
            <div class="source-links">
              {#each DATABASE_METADATA.sourceUrls as source}
                <a href={source.url} target="_blank" rel="noopener noreferrer" class="source-link">
                  <span class="material-icons">open_in_new</span>
                  {source.name}
                </a>
              {/each}
            </div>
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

  .database-info-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    max-width: 100%;
  }

  .database-name {
    color: var(--primary-color);
    font-size: var(--font-size-xl);
    margin: 0 0 var(--spacing-md) 0;
  }

  .database-description {
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
  }

  .metadata-section h4,
  .notes-section h4,
  .source-link-section h4 {
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }

  .metadata-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .metadata-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--divider);
  }

  .metadata-item:last-child {
    border-bottom: none;
  }

  .metadata-label {
    color: var(--text-primary);
    font-weight: 600;
  }

  .metadata-value {
    color: var(--text-secondary);
    font-weight: 400;
  }

  .notes-text {
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
    font-style: italic;
  }

  .toggle-notes-btn {
    background: none;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.9em;
    text-decoration: none;
    margin-top: var(--spacing-sm);
    padding: var(--spacing-xs) var(--spacing-md);
    display: block;
    font-style: normal;
    border-radius: 16px;
    width: fit-content;
    transition: all 0.2s ease;
  }

  .toggle-notes-btn:hover {
    background: var(--primary-color);
    color: white;
  }

  .source-links {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .source-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    padding: var(--spacing-md);
    border: 1px solid var(--primary-color);
    border-radius: var(--spacing-sm);
    transition: all 0.2s ease;
  }

  .source-link:hover {
    background-color: var(--primary-alpha-10);
  }

  .source-link .material-icons {
    font-size: var(--icon-size-sm);
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

    .metadata-item {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xs);
    }
  }
</style>
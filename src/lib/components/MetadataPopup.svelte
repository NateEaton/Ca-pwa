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
  import { createEventDispatcher } from "svelte";
  import { calciumService } from "$lib/stores/calcium";
  import SourceIndicator from "./SourceIndicator.svelte";
  import { logger } from '$lib/utils/logger';

  /** Whether the popup is visible */
  export let show = false;
  /** The custom food to display metadata for */
  export let food = null;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch("close");
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
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleBackdropClick(event);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  }

  $: metadata = food?.sourceMetadata;
  $: scanData = metadata?.scanData;
  $: processingNotes = metadata?.processingNotes;

  $: {
    logger.debug('METADATA', 'MetadataPopup: Data update', {
      food,
      metadata,
      scanData,
      processingNotes,
      confidenceScores: processingNotes?.confidence
    });
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show && food}
  <div class="modal-backdrop" on:click={handleBackdropClick} on:keydown={handleBackdropKeydown} role="button" tabindex="0">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">
          <SourceIndicator {food} size="medium" />
          Food Source Details
        </h3>
        <button class="btn-icon" on:click={handleClose} aria-label="Close">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="modal-body">
        <div class="food-info">
          <h4>{food.name}</h4>
          <p class="food-details">{food.calcium}mg calcium per {food.measure}</p>
        </div>

        <div class="metadata-section">
          <h5>Source Information</h5>
          <div class="info-item">
            <span class="label">Source Type:</span>
            <span class="value">
              {#if calciumService}
                {calciumService.formatSourceMetadata(food)}
              {:else}
                Unknown
              {/if}
            </span>
          </div>

          {#if metadata?.dateAdded}
            <div class="info-item">
              <span class="label">Date Added:</span>
              <span class="value">{formatDate(metadata.dateAdded)}</span>
            </div>
          {/if}

          {#if metadata?.upc}
            <div class="info-item">
              <span class="label">UPC Code:</span>
              <span class="value">{metadata.upc}</span>
            </div>
          {/if}

          {#if metadata?.sourceKey}
            <div class="info-item">
              <span class="label">Source ID:</span>
              <span class="value">{metadata.sourceKey}</span>
            </div>
          {/if}
        </div>

        {#if scanData}
          <div class="metadata-section">
            <h5>Scan Details</h5>

            {#if scanData.originalName && metadata?.sourceType !== 'ocr_scan'}
              <div class="info-item">
                <span class="label">Product Name:</span>
                <span class="value">{scanData.originalName}</span>
              </div>
            {/if}

            {#if scanData.brandName}
              <div class="info-item">
                <span class="label">Brand:</span>
                <span class="value">{scanData.brandName}</span>
              </div>
            {/if}

            {#if scanData.servingSize}
              <div class="info-item">
                <span class="label">Serving Size:</span>
                <span class="value">{scanData.servingSize}</span>
              </div>
            {/if}

            {#if scanData.selectedNutrientPer}
              <div class="info-item">
                <span class="label">Standard Measure:</span>
                <span class="value">{scanData.selectedNutrientPer}</span>
              </div>
            {/if}

            {#if food.calcium}
              <div class="info-item">
                <span class="label">Calcium per Serving:</span>
                <span class="value">{food.calcium}mg</span>
              </div>
            {/if}

            {#if scanData.calciumPer100g}
              <div class="info-item">
                <span class="label">Calcium per 100g:</span>
                <span class="value">{scanData.calciumPer100g}mg</span>
              </div>
            {/if}

            {#if scanData.allergens && scanData.allergens.length > 0}
              <div class="info-item">
                <span class="label">Allergens:</span>
                <span class="value">{scanData.allergens.join(', ')}</span>
              </div>
            {/if}

            {#if scanData.ingredients}
              <div class="info-item">
                <span class="label">Ingredients:</span>
                <span class="value ingredients">{scanData.ingredients}</span>
              </div>
            {/if}
          </div>
        {/if}

        {#if processingNotes}
          <div class="metadata-section">
            <h5>Processing Notes</h5>

            {#if processingNotes.measureConversion}
              <div class="info-item">
                <span class="label">Measure:</span>
                <span class="value">{processingNotes.measureConversion}</span>
              </div>
            {/if}

            {#if processingNotes.calciumConversion}
              <div class="info-item">
                <span class="label">Calcium:</span>
                <span class="value">{processingNotes.calciumConversion}</span>
              </div>
            {/if}

            {#if processingNotes.nameNormalization}
              <div class="info-item">
                <span class="label">Name:</span>
                <span class="value">{processingNotes.nameNormalization}</span>
              </div>
            {/if}

            {#if processingNotes.confidence}
              <div class="confidence-scores">
                <span class="label">Confidence Scores:</span>
                <div class="confidence-grid">
                  {#if processingNotes.confidence.calcium !== undefined}
                    <span>Calcium: {Math.round(processingNotes.confidence.calcium * 100)}%</span>
                  {/if}
                  {#if processingNotes.confidence.measure !== undefined}
                    <span>Serving Measure: {Math.round(processingNotes.confidence.measure * 100)}%</span>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" on:click={handleClose}>Close</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-dialog {
    background: var(--surface);
    border-radius: 8px;
    width: 100%;
    max-width: 480px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .modal-body {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .food-info {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .food-info h4 {
    margin: 0 0 0.25rem 0;
    color: var(--text-primary);
    font-size: 1.125rem;
  }

  .food-details {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .metadata-section {
    margin-bottom: 1.5rem;
  }

  .metadata-section:last-child {
    margin-bottom: 0;
  }

  .metadata-section h5 {
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
  }

  .info-item {
    display: flex;
    margin-bottom: 0.5rem;
    align-items: flex-start;
  }

  .info-item .label {
    font-weight: 500;
    color: var(--text-secondary);
    min-width: 100px;
    font-size: 0.875rem;
  }

  .info-item .value {
    color: var(--text-primary);
    font-size: 0.875rem;
    flex: 1;
    word-break: break-word;
  }

  .ingredients {
    font-size: 0.8125rem;
    line-height: 1.4;
  }

  .confidence-scores {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .confidence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--text-primary);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
  }

  .btn-icon {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }

  .btn-icon:hover {
    background-color: var(--hover);
    color: var(--text-primary);
  }

  .btn-icon .material-icons {
    font-size: 1.25rem;
  }
</style>
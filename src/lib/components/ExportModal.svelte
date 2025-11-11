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
  import { calciumState, calciumService } from "$lib/stores/calcium";

  /** Whether the export modal is visible */
  export let show = false;

  let isGenerating = false;
  let exportStats = "";

  function handleClose() {
    show = false;
  }

  function handleBackdropClick(event) {
    // Prevent accidental closing during export generation
    if (isGenerating) return;

    // Only close if clicking the backdrop itself, not child elements
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(event) {
    // Prevent closing during export generation
    if (event.key === "Escape" && !isGenerating) {
      handleClose();
    }
  }

  // Generate export stats when modal opens
  $: if (show && !isGenerating) {
    generateExportStats();
  }

  async function generateExportStats() {
    try {
      if (!calciumService) {
        exportStats = "Service not initialized yet";
        return;
      }
      const journalData = await calciumService.getAllJournalData();
      const stats = calculateStats(journalData);
      exportStats = stats;
    } catch (error) {
      console.error("Error generating export stats:", error);
      exportStats = "Error loading export statistics";
    }
  }

  function calculateStats(journalData) {
    const dates = Object.keys(journalData);
    const totalDays = dates.length;
    const totalFoodEntries = Object.values(journalData).reduce(
      (sum, dayFoods) => sum + dayFoods.length,
      0
    );

    let dateRange = "No journal entries";
    if (dates.length > 0) {
      dates.sort();
      const firstDate = new Date(dates[0]).toLocaleDateString();
      const lastDate = new Date(dates[dates.length - 1]).toLocaleDateString();
      dateRange =
        dates.length === 1 ? `${firstDate}` : `${firstDate} to ${lastDate}`;
    }

    return `
• ${totalFoodEntries} total entries across ${totalDays} days<br>
• Date range: ${dateRange}<br>
• Format: CSV (Comma-Separated Values)`;
  }

  /**
   * Escape a value for CSV format
   * @param {any} value - The value to escape
   * @returns {string} The escaped value
   */
  function escapeCSV(value) {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  /**
   * Generate CSV content from journal data
   * @param {Record<string, Array>} journalData - The journal data to convert
   * @returns {string} The CSV content
   */
  function generateCSV(journalData) {
    // CSV header
    const rows = ["date,name,calcium,servingQuantity,servingUnit,timestamp"];

    // Convert each entry to CSV row
    for (const [date, entries] of Object.entries(journalData)) {
      for (const entry of entries) {
        const row = [
          escapeCSV(date),
          escapeCSV(entry.name),
          escapeCSV(entry.calcium),
          escapeCSV(entry.servingQuantity),
          escapeCSV(entry.servingUnit),
          escapeCSV(entry.timestamp),
        ].join(",");
        rows.push(row);
      }
    }

    return rows.join("\n");
  }

  async function handleExportDownload() {
    if (isGenerating) return;

    isGenerating = true;
    try {
      if (!calciumService) {
        throw new Error("CalciumService not initialized");
      }
      const journalData = await calciumService.getAllJournalData();

      // Generate CSV content
      const csvContent = generateCSV(journalData);

      // Create filename with current date (local timezone)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const filename = `calcium-tracker-export-${dateStr}.csv`;

      // Create and download file
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      handleClose();
    } catch (error) {
      console.error("Error creating export:", error);
      // Could add toast notification here
    } finally {
      isGenerating = false;
    }
  }
</script>

{#if show}
  <div class="modal-backdrop full-screen" on:click={handleBackdropClick} on:keydown={handleKeydown} role="button" tabindex="0">
    <div
      class="modal-container full-screen"
      role="dialog"
      aria-labelledby="export-title"
      aria-modal="true"
    >
      <!-- Modal Header -->
      <div class="modal-header">
        <button
          class="back-btn"
          on:click={handleClose}
          aria-label="Close export dialog"
        >
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 id="export-title" class="modal-title">Export to CSV</h2>
        <div class="header-spacer"></div>
      </div>

      <!-- Modal Content -->
      <div class="modal-content">
        <div class="export-content">
          <!-- Export Info Section -->
          <div class="export-info">
            <div class="info-icon">
              <span class="material-icons">file_download</span>
            </div>
            <div class="info-text">
              <h3>Export Journal Entries</h3>
              <p>
                Download all journal entries as a CSV file for use in
                spreadsheet applications or data analysis tools.
              </p>
            </div>
          </div>

          <!-- Current Data Summary -->
          <div class="data-summary">
            <h4>What Will Be Exported:</h4>
            <div class="export-stats">
              {@html exportStats}
            </div>
          </div>

          <!-- Action Button -->
          <div class="export-actions">
            <button
              class="export-btn primary"
              on:click={handleExportDownload}
              disabled={isGenerating}
            >
              {#if isGenerating}
                <span class="material-icons spinning">sync</span>
                Creating Export...
              {:else}
                <span class="material-icons">download</span>
                Download CSV
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:window on:keydown={handleKeydown} />

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
    font-size: var(--font-size-xl);
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

  .export-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    color: var(--text-primary);
  }

  .export-info {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--primary-alpha-5);
    border-radius: 8px;
    border: 1px solid var(--primary-alpha-10);
  }

  .info-icon {
    flex-shrink: 0;
  }

  .info-icon .material-icons {
    font-size: 24px;
    color: var(--primary-color);
  }

  .info-text h3 {
    color: var(--text-primary);
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-lg);
  }

  .info-text p {
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  .data-summary {
    background-color: var(--surface-variant);
    border-radius: 8px;
    padding: var(--spacing-lg);
    border: 1px solid var(--divider);
  }

  .data-summary h4 {
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }

  .export-stats {
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .export-actions {
    text-align: center;
  }

  .export-btn.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: background-color 0.2s;
    min-height: var(--touch-target-min);
  }

  .export-btn.primary:hover:not(:disabled) {
    background-color: var(--primary-color-dark);
  }

  .export-btn.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .export-btn .material-icons {
    font-size: 20px;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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

    .export-info {
      padding: var(--spacing-md);
      gap: var(--spacing-md);
    }

    .data-summary {
      padding: var(--spacing-md);
    }

    .export-btn.primary {
      padding: var(--spacing-sm) var(--spacing-lg);
      font-size: var(--font-size-sm);
    }
  }
</style>

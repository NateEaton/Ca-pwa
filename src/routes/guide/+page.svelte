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
  import { FEATURES } from "$lib/utils/featureFlags";
</script>

<svelte:head>
  <title>User Guide - My Calcium</title>
</svelte:head>

<div class="guide-container">
  <details class="guide-section" open>
    <summary>
      <span class="material-icons">track_changes</span>
      Tracking Your Daily Calcium
    </summary>
    <div class="section-content">
      <h4>Adding & Editing Foods</h4>
      <p>
        Tap the large <strong>+</strong> button on the main screen to open the "Add
        Entry" dialog. From there, you can:
      </p>
      <ul>
        <li>
          <strong>Search the Database:</strong> Start typing a food name. Custom
          foods and favorites that match your search will appear at the top of the
          results.
        </li>
        <li>
          <strong>Add a Custom Food:</strong> Tap the
          <span class="material-icons inline-icon">add_circle</span> icon at the
          top to switch to custom food mode, where you can enter your own food name
          and calcium values.
        </li>
        <li>
          <strong>Edit or Delete:</strong> To change an entry, simply tap it on the
          main screen to open the edit dialog. You can update its details or tap
          the trash icon to delete it.
        </li>
      </ul>

      <h4>Serving Sizes & Favorites</h4>
      <ul>
        <li>
          <strong>Adjust Servings:</strong> After selecting a food from the search
          results, you can change the serving quantity and unit. The app provides
          "Quick conversions" for common units.
        </li>
        <li>
          <strong>Serving Memory:</strong> The app automatically remembers your preferred
          serving size for any database food, making future entries faster.
        </li>
        <li>
          <strong>Favorites:</strong> Tap the
          <span class="material-icons inline-icon">star_border</span> icon in the
          "Add Entry" dialog to mark a database food as a favorite. This helps it
          appear higher in search results.
        </li>
      </ul>

      <h4>Date Navigation</h4>
      <p>
        Use the <span class="material-icons inline-icon">chevron_left</span> and
        <span class="material-icons inline-icon">chevron_right</span>
        arrows on the summary card to move between days. You can also
        <strong>swipe left or right</strong> on the summary card to quickly change
        the date.
      </p>
    </div>
  </details>

  <details class="guide-section">
    <summary>
      <span class="material-icons">apps</span>
      Other App Features
    </summary>
    <div class="section-content">
      <p>
        <strong>Statistics Page:</strong> Visualize your intake. Switch between daily,
        weekly, monthly, and yearly views. Tap a bar in the chart to see the specific
        total for that period.
      </p>
      <p>
        <strong>Database Page:</strong> Browse all foods. Use filters and
        sorting to explore the data. Here you can also manage your favorites and
        delete custom foods. Tap the
        <span class="material-icons inline-icon">info</span> icon in the header for
        details on the data source.
      </p>
      <p>
        <strong>Report Page:</strong> Generate a printable summary of your history
        to share with a healthcare provider.
      </p>
      <p>
        <strong>Settings Page:</strong> Adjust your daily goal, change the app theme,
        and manage data {#if FEATURES.SYNC_ENABLED}sync and {/if}backups.
      </p>
    </div>
  </details>

  {#if FEATURES.SYNC_ENABLED}
    <details class="guide-section">
      <summary>
        <span class="material-icons">sync</span>
        Syncing Across Devices
      </summary>
      <div class="section-content">
        <h4>What It Is</h4>
        <p>
          Sync keeps your data automatically updated across multiple devices
          (e.g., your phone and a tablet). It requires an internet connection to
          work.
        </p>

        <h4>How to Set Up</h4>
        <ol class="steps-list">
          <li>
            On your first device, go to <strong>Settings > Data > Sync</strong> and
            tap "Create New Sync".
          </li>
          <li>A QR code will be displayed on the screen.</li>
          <li>
            On your second device, go to <strong>Settings > Data > Sync</strong>,
            tap "Join Existing Sync", and scan the QR code from your first device.
          </li>
        </ol>
        <p>Your devices are now connected and will sync automatically.</p>
      </div>
    </details>
  {/if}

  <details class="guide-section">
    <summary>
      <span class="material-icons">backup</span>
      Backing Up & Restoring
    </summary>
    <div class="section-content">
      <h4>What It Is</h4>
      <p>
        This feature lets you save a single file of all your data to your device
        for safekeeping. This is different from sync, which is automatic and
        continuous.
      </p>

      <h4>How to Use</h4>
      <p>In <strong>Settings > Data</strong>, you will find two options:</p>
      <ul>
        <li>
          <strong>Create Backup:</strong> Downloads a JSON file of your entire app
          data.
        </li>
        <li>
          <strong>Restore Data:</strong> Lets you select a backup file to
          import.
          <br />
          <strong class="warning-text">Warning:</strong> Restoring from a backup
          will overwrite all current data in the app.
        </li>
      </ul>
    </div>
  </details>
</div>

<style>
  .guide-container {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .guide-section {
    background-color: var(--surface);
    border: 1px solid var(--divider);
    border-radius: var(--spacing-sm);
    transition: all 0.2s ease-in-out;
  }

  .guide-section[open] {
    border-color: var(--primary-color);
  }

  .guide-section summary {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    cursor: pointer;
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--text-primary);
    list-style: none; /* Remove default marker */
  }

  .guide-section summary::-webkit-details-marker {
    display: none; /* Hide for Safari */
  }

  .guide-section summary::after {
    content: "expand_more";
    font-family: "Material Icons";
    margin-left: auto;
    transition: transform 0.2s ease;
  }

  .guide-section[open] summary::after {
    transform: rotate(180deg);
  }

  .guide-section summary .material-icons {
    color: var(--primary-color);
  }

  .section-content {
    padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
    color: var(--text-secondary);
    line-height: 1.6;
    border-top: 1px solid var(--divider);
  }

  .section-content h4 {
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
    font-size: var(--font-size-base);
  }

  .section-content p,
  .section-content ul,
  .section-content ol {
    margin-bottom: var(--spacing-md);
  }

  .section-content ul,
  .section-content ol {
    padding-left: var(--spacing-xl);
  }

  .section-content li {
    margin-bottom: var(--spacing-sm);
  }

  .inline-icon {
    font-size: 1em; /* Match surrounding text size */
    vertical-align: -0.125em; /* Adjust vertical alignment */
  }

  .steps-list {
    list-style-type: decimal;
  }

  .warning-text {
    color: var(--error-color);
    font-weight: 500;
  }
</style>

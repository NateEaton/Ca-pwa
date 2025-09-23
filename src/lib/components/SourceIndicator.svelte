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
  /** The custom food to display source indicator for */
  export let food;
  /** Size variant: 'small' or 'medium' */
  export let size = 'small';
  /** Whether to show label text alongside icon */
  export let showLabel = false;

  // Direct source type mapping (no dependency on store)
  function getSourceColor(sourceType) {
    switch (sourceType) {
      case 'manual': return 'var(--primary)';
      case 'upc_scan': return 'var(--success)';
      case 'ocr_scan': return 'var(--warning)';
      default: return 'var(--text-secondary)';
    }
  }

  function getSourceIcon(sourceType) {
    switch (sourceType) {
      case 'manual': return 'edit';
      case 'upc_scan': return 'qr_code_scanner';
      case 'ocr_scan': return 'photo_camera';
      default: return 'help_outline';
    }
  }

  function formatSourceLabel(sourceType) {
    switch (sourceType) {
      case 'manual': return 'Added manually';
      case 'upc_scan': return 'Scanned from barcode';
      case 'ocr_scan': return 'Scanned from nutrition label';
      default: return 'Unknown source';
    }
  }

  $: sourceType = food.sourceMetadata?.sourceType;
  $: sourceColor = getSourceColor(sourceType);
  $: sourceIcon = getSourceIcon(sourceType);
  $: sourceLabel = formatSourceLabel(sourceType);
</script>

<div class="source-indicator {size}" style="--source-color: {sourceColor}">
  <span class="material-icons icon">{sourceIcon}</span>
  {#if showLabel}
    <span class="label">{sourceLabel}</span>
  {/if}
</div>

<style>
  .source-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--source-color);
  }

  .source-indicator.small .icon {
    font-size: 0.875rem;
  }

  .source-indicator.medium .icon {
    font-size: 1rem;
  }

  .label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .source-indicator.small .label {
    font-size: 0.6875rem;
  }

  .source-indicator.medium .label {
    font-size: 0.75rem;
  }

  .icon {
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .source-indicator:hover .icon {
    opacity: 1;
  }
</style>
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
  import { toastStore } from "$lib/stores/calcium";
  import { tick } from "svelte";

  let isVisible = false;
  let currentTimeout;
  let message = "";
  let type = "info";

  // Reactive statement to handle toast store changes
  $: if ($toastStore.message && $toastStore.message.trim() !== '') {
    showToast($toastStore.message, $toastStore.type);
  }

  async function showToast(newMessage, newType = "info") {
    // Clear any existing timeout
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    // Set message and type
    message = newMessage;
    type = newType;
    
    // Wait for DOM update, then show
    await tick();
    isVisible = true;

    // Auto-hide after 3 seconds
    currentTimeout = setTimeout(() => {
      hideToast();
    }, 3000);
  }

  function hideToast() {
    isVisible = false;
    
    // Clear the store after animation completes
    setTimeout(() => {
      toastStore.set({ message: "", type: "info" });
      message = "";
      type = "info";
    }, 300);
  }
</script>

<div
  class="toast"
  class:show={isVisible}
  class:toast-success={type === 'success'}
  class:toast-error={type === 'error'}
  class:toast-warning={type === 'warning'}
  class:toast-info={type === 'info'}
  aria-live="polite"
  aria-atomic="true"
>
  {message}
</div>

<style>
  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    background: var(--surface);
    color: var(--text-primary);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--divider);
    box-shadow: var(--shadow-lg);
    z-index: 1100;
    font-size: 0.9rem;
    font-weight: 500;
    max-width: min(288px, calc(100vw - 4rem)); /* 60% of 480px app container */
    text-align: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    white-space: normal;
    word-wrap: break-word;
    line-height: 1.4;
  }

  .toast.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  .toast.toast-success {
    background: var(--success-color, #4caf50);
    color: white;
    border-color: var(--success-color, #4caf50);
  }

  .toast.toast-error {
    background: var(--error-color, #f44336);
    color: white;
    border-color: var(--error-color, #f44336);
  }

  .toast.toast-warning {
    background: var(--warning-color, #ff9800);
    color: white;
    border-color: var(--warning-color, #ff9800);
  }

  .toast.toast-info {
    background: var(--info-color, #2196f3);
    color: white;
    border-color: var(--info-color, #2196f3);
  }

  /* Mobile responsive */
  /*
  @media (max-width: 480px) {
    .toast {
      bottom: 2rem;
      left: 1rem;
      right: 1rem;
      transform: translateY(100%);
      max-width: calc(100vw - 2rem);
      white-space: normal;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
    }

    .toast.show {
      transform: translateY(0);
    }
  }
  */
</style>
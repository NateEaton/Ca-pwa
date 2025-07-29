<script>
  import { toastStore } from "$lib/stores/calcium";

  let toastElement;

  // Subscribe to toast store and handle display
  $: if ($toastStore.message) {
    showToast($toastStore.message, $toastStore.type);
  }

  function showToast(message, type = "info") {
    if (toastElement) {
      toastElement.textContent = message;
      toastElement.className = `toast toast-${type} show`;

      // Auto-hide after 3 seconds
      setTimeout(() => {
        if (toastElement) {
          toastElement.classList.remove("show");
        }
        // Clear the store message after animation
        setTimeout(() => {
          toastStore.set({ message: "", type: "info" });
        }, 300);
      }, 3000);
    }
  }
</script>

<div
  bind:this={toastElement}
  class="toast"
  aria-live="polite"
  aria-atomic="true"
>
  {$toastStore.message}
</div>

<style>
  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--text-primary);
    color: var(--surface);
    padding: 0.75rem 1.5rem;
    border-radius: 24px;
    box-shadow: var(--shadow-lg);
    z-index: 1100;
    font-size: 0.9rem;
    font-weight: 500;
    max-width: calc(100vw - 2rem);
    text-align: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .toast.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  .toast-success {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .toast-error {
    background: var(--error-color, #f44336);
    color: white;
  }

  .toast-warning {
    background: var(--warning-color, #ff9800);
    color: white;
  }

  .toast-info {
    background: var(--info-color, #2196f3);
    color: white;
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .toast {
      bottom: 1.5rem;
      left: 1rem;
      right: 1rem;
      transform: translateY(100px);
      max-width: none;
    }

    .toast.show {
      transform: translateY(0);
    }
  }
</style>

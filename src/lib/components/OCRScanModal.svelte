<!--
 * OCR Scan Modal for Calcium Tracker PWA
 * Allows users to capture nutrition labels and extract calcium information
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { OCRService } from '$lib/services/OCRService.js';
  import { OCR_CONFIG } from '$lib/config/ocr.js';
  
  export let show = false;
  
  const dispatch = createEventDispatcher();
  
  let imagePreview = null;
  let ocrResult = null;
  let isLoading = false;
  let error = null;
  let fileInput;
  let cameraInput;
  let loadingState = ''; // 'compressing', 'processing', ''
  
  // Initialize OCR service with API key from config
  const ocrService = new OCRService(OCR_CONFIG.API_KEY);

  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', file);
    error = null;
    imagePreview = URL.createObjectURL(file);
    await processImage(file);
  }

  async function processImage(file) {
    isLoading = true;
    ocrResult = null;
    error = null;
    loadingState = '';

    try {
      // Show compression state if file is large
      if (file.size > 1024 * 1024) {
        loadingState = 'compressing';
        console.log('Large file detected, will compress:', file.size, 'bytes');
      }

      // Brief delay to show compression state
      if (loadingState === 'compressing') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Switch to OCR processing state
      loadingState = 'processing';
      ocrResult = await ocrService.processImage(file);
      console.log('OCR completed successfully:', ocrResult);
    } catch (err) {
      console.error('OCR processing failed:', err);
      error = err.message || 'Failed to process image';
    } finally {
      isLoading = false;
      loadingState = '';
    }
  }

  function triggerFileInput() {
    if (fileInput) {
      fileInput.click();
    }
  }

  function triggerCameraInput() {
    if (cameraInput) {
      cameraInput.click();
    }
  }

  function closeModal() {
    show = false;
    imagePreview = null;
    ocrResult = null;
    error = null;
    isLoading = false;
    if (fileInput) {
      fileInput.value = '';
    }
    if (cameraInput) {
      cameraInput.value = '';
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleBackdropKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleSaveResults() {
    if (ocrResult) {
      dispatch('ocrComplete', {
        servingSize: ocrResult.servingSize,
        calcium: ocrResult.calcium,
        confidence: ocrResult.confidence,
        rawText: ocrResult.rawText
      });
    }
    closeModal();
  }
</script>

{#if show}
  <div 
    class="modal-backdrop" 
    on:click={handleBackdropClick}
    on:keydown={handleBackdropKeydown}
    role="button"
    tabindex="0"
  >
    <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation role="dialog">
      <div class="modal-header">
        <div class="modal-header-left">
          <button class="modal-back" on:click={closeModal} disabled={isLoading}>
            <span class="material-icons">arrow_back</span>
          </button>
        </div>
        <div class="modal-header-center">
          <h2 class="modal-title">Scan Nutrition Label</h2>
        </div>
      </div>

      <div class="modal-body">
        <!-- Hidden File Inputs -->
        <input
          bind:this={cameraInput}
          type="file"
          accept="image/*"
          capture="environment"
          on:change={handleFileSelect}
          disabled={isLoading}
          class="file-input"
          id="ocr-camera-input"
        />
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          on:change={handleFileSelect}
          disabled={isLoading}
          class="file-input"
          id="ocr-file-input"
        />

        <!-- Instructions -->
        {#if !imagePreview && !isLoading && !error && !ocrResult}
          <div class="instructions">
            <div class="instruction-icon">
              <span class="material-icons">photo_camera</span>
            </div>
            <h3>Capture Nutrition Label</h3>
            <p>Take a photo of the nutrition facts panel or upload an existing image. We'll automatically extract the serving size and calcium content.</p>
          </div>
        {/if}

        <!-- File Input Section -->
        <div class="file-input-section">
          <div class="input-buttons">
            <button
              class="camera-btn"
              class:disabled={isLoading}
              on:click={triggerCameraInput}
              disabled={isLoading}
            >
              <span class="material-icons">camera_alt</span>
              Take Photo
            </button>
            <button
              class="file-btn"
              class:disabled={isLoading}
              on:click={triggerFileInput}
              disabled={isLoading}
            >
              <span class="material-icons">folder</span>
              Choose File
            </button>
          </div>

          {#if isLoading}
            <p class="status-text">
              {#if loadingState === 'compressing'}
                Compressing large image...
              {:else if loadingState === 'processing'}
                Analyzing nutrition label...
              {:else}
                Processing image...
              {/if}
            </p>
          {/if}
        </div>

        <!-- Image Preview -->
        {#if imagePreview}
          <div class="image-preview-section">
            <img src={imagePreview} alt="Label preview" class="image-preview" />
          </div>
        {/if}

        <!-- Loading State -->
        {#if isLoading}
          <div class="loading-section">
            <div class="loading-spinner"></div>
            <p>
              {#if loadingState === 'compressing'}
                Compressing large image for optimal processing...
              {:else if loadingState === 'processing'}
                Analyzing nutrition label with OCR...
              {:else}
                Processing your image...
              {/if}
            </p>
          </div>
        {/if}

        <!-- Error State -->
        {#if error}
          <div class="error-section">
            <span class="material-icons">error</span>
            <p>{error}</p>
            <div class="error-actions">
              <button class="retry-btn" on:click={triggerCameraInput}>
                <span class="material-icons">camera_alt</span>
                Take Photo
              </button>
              <button class="retry-btn" on:click={triggerFileInput}>
                <span class="material-icons">folder</span>
                Choose File
              </button>
            </div>
          </div>
        {/if}

        <!-- Results -->
        {#if ocrResult}
          <div class="results-section">
            <!-- Confidence Indicator -->
            <div class="confidence-indicator confidence-{ocrResult.confidence}">
              <span class="material-icons">
                {ocrResult.confidence === 'high' ? 'check_circle' : 
                 ocrResult.confidence === 'medium' ? 'info' : 'warning'}
              </span>
              <span>
                {ocrResult.confidence === 'high' ? 'High confidence' :
                 ocrResult.confidence === 'medium' ? 'Medium confidence' : 'Low confidence - please verify'}
              </span>
            </div>

            <!-- Parsed Results -->
            <div class="parsed-results">
              <div class="result-field">
                <label for="ocr-serving-size">Serving Size</label>
                <input 
                  id="ocr-serving-size"
                  type="text" 
                  bind:value={ocrResult.servingSize} 
                  class="result-input"
                  placeholder="Not detected - enter manually"
                />
              </div>
              
              <div class="result-field">
                <label for="ocr-calcium">Calcium</label>
                <input 
                  id="ocr-calcium"
                  type="text" 
                  bind:value={ocrResult.calcium} 
                  class="result-input"
                  placeholder="Not detected - enter manually"
                />
              </div>
            </div>

            <!-- Raw Text (Collapsible) -->
            <details class="raw-text-section">
              <summary>View Raw OCR Text</summary>
              <pre class="raw-text">{ocrResult.rawText}</pre>
            </details>

            <!-- Action Button -->
            <button class="save-btn" on:click={handleSaveResults}>
              <span class="material-icons">check</span>
              Use These Results
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-lg);
  }

  .modal-content {
    background: var(--surface);
    border-radius: 0.5rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--divider);
    width: 100%;
    max-width: 28rem;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    padding: var(--spacing-lg) 1.5rem;
    border-bottom: 1px solid var(--divider);
    position: relative;
  }

  .modal-header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .modal-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .modal-back {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 1.5rem;
    padding: 0.25rem;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-back:hover:not(:disabled) {
    background: var(--divider);
    color: var(--text-primary);
  }

  .modal-back:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-title {
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
  }

  .modal-body {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .file-input {
    display: none;
  }

  .instructions {
    text-align: center;
    padding: var(--spacing-xl) 0;
  }

  .instruction-icon {
    font-size: 4rem;
    color: var(--primary-color);
    margin-bottom: var(--spacing-lg);
  }

  .instructions h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.75rem 0;
  }

  .instructions p {
    font-size: var(--font-size-base);
    line-height: 1.5;
    color: var(--text-secondary);
    margin: 0;
  }

  .file-input-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .input-buttons {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }

  .camera-btn, .file-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: var(--spacing-lg);
    border: 2px solid var(--primary-color);
    border-radius: 0.5rem;
    background: var(--primary-color);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    font-size: var(--font-size-base);
  }

  .file-btn {
    background: var(--surface);
    color: var(--primary-color);
  }

  .camera-btn:hover:not(.disabled),
  .file-btn:hover:not(.disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  .camera-btn.disabled,
  .file-btn.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .status-text {
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .image-preview-section {
    display: flex;
    justify-content: center;
    margin: 0.75rem 0;
  }

  .image-preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 0.25rem;
    box-shadow: var(--shadow);
  }

  .loading-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid var(--divider);
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: var(--spacing-lg);
    background: var(--error-alpha-10);
    border-radius: 0.5rem;
    text-align: center;
  }

  .error-section .material-icons {
    font-size: 3rem;
    color: var(--error-color);
  }

  .error-section p {
    color: var(--error-color);
    margin: 0;
    font-size: var(--font-size-sm);
  }

  .error-actions {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .retry-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: var(--error-color);
    color: white;
    border: none;
    padding: 0.5rem var(--spacing-lg);
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 500;
  }

  .results-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .confidence-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 0.25rem;
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  .confidence-high {
    background: var(--success-alpha-10);
    color: var(--success-color);
  }

  .confidence-medium {
    background: var(--warning-alpha-10);
    color: var(--warning-color);
  }

  .confidence-low {
    background: var(--error-alpha-10);
    color: var(--error-color);
  }

  .parsed-results {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .result-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .result-field label {
    font-weight: 500;
    color: var(--text-primary);
    font-size: var(--font-size-sm);
  }

  .result-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--divider);
    border-radius: 0.25rem;
    font-size: var(--font-size-base);
    background-color: var(--surface);
    color: var(--text-primary);
    transition: border-color 0.2s;
  }

  .result-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-alpha-10);
  }

  .raw-text-section {
    margin-top: 0.75rem;
  }

  .raw-text-section summary {
    cursor: pointer;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    padding: 0.5rem;
  }

  .raw-text {
    background: var(--surface-variant);
    border: 1px solid var(--divider);
    border-radius: 0.25rem;
    padding: 0.75rem;
    margin-top: 0.5rem;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 200px;
    overflow-y: auto;
  }

  .save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem var(--spacing-lg);
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 500;
    font-size: var(--font-size-base);
    transition: all 0.2s;
    width: 100%;
  }

  .save-btn:hover {
    background: var(--primary-color-dark);
  }

  .save-btn:active {
    transform: translateY(1px);
  }

  .file-input-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .input-buttons {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }  

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .modal-content {
      max-width: 100vw;
      max-height: 95vh;  /* Changed from 100vh */
      /* Removed: height: 100vh; */
      border-radius: 0.25rem;  /* Keep some border radius */
      margin: 0.5rem;  /* Add small margin */
    }
    
    .modal-body {
      max-height: calc(95vh - 120px);  /* Account for header */
      overflow-y: auto;
    }
    
    .input-buttons {
      flex-direction: column;
      gap: 0.5rem;
    }

    .camera-btn, .file-btn {
      padding: 0.75rem;
      width: 100%;
    }

    .error-actions {
      flex-direction: column;
    }

    .retry-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
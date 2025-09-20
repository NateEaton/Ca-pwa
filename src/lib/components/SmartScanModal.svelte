<!--
 * Unified Smart Scan Modal for Calcium Tracker PWA
 * Combines Barcode (UPC) and Nutrition Label (OCR) scanning.
-->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { BrowserMultiFormatReader } from '@zxing/browser';
  import { FDCService } from '$lib/services/FDCService';
  import { OpenFoodFactsService } from '$lib/services/OpenFoodFactsService';
  import { OCRService } from '$lib/services/OCRService.js';
  import { FDC_CONFIG } from '$lib/config/fdc.js';
  import { OCR_CONFIG } from '$lib/config/ocr.js';

  export let show = false;

  const dispatch = createEventDispatcher();

  // --- Workflow State ---
  let activeTab = 'upc'; // 'upc' or 'ocr'

  // --- Barcode (UPC) State ---
  let videoElement;
  let codeReader;
  let scanningActive = false;
  let isProcessingBarcode = false;
  let scannerControls = null;
  let manualUPC = '';
  let selectedSource = 'usda';

  // --- Nutrition Label (OCR) State ---
  let imagePreview = null;
  let ocrResult = null;
  let cameraInput;
  let fileInput;
  let ocrLoadingState = ''; // 'compressing', 'processing', ''

  // --- General Modal State ---
  let isLoading = false;
  let error = null;

  // --- Service Initialization ---
  const fdcService = new FDCService(FDC_CONFIG.API_KEY);
  const openFoodFactsService = new OpenFoodFactsService();
  const ocrService = new OCRService(OCR_CONFIG.API_KEY);

  // --- Lifecycle ---
  onMount(() => {
    // Load sticky preferences
    const lastTab = localStorage.getItem('scan-default-tab');
    if (lastTab) activeTab = lastTab;

    const lastSource = localStorage.getItem('upc-data-source');
    if (lastSource) selectedSource = lastSource;
  });

  onDestroy(() => {
    stopScanning();
  });

  // --- Core Logic ---
  function closeModal(didScan = false) {
    stopScanning();
    show = false;
    if (!didScan) {
      dispatch('close');
    }
  }

  async function switchTab(tab) {
    if (isLoading) return;
    activeTab = tab;
    localStorage.setItem('scan-default-tab', tab);
    error = null;
    stopScanning(); // Stop scanner when switching tabs
    if (tab === 'upc') {
      // Delay to allow UI to render before starting camera
      setTimeout(startScanning, 100);
    }
  }

  // --- Barcode (UPC) Functions ---
  async function startScanning() {
    if (!show || scanningActive || activeTab !== 'upc') return;
    try {
      isLoading = true;
      error = null;

      codeReader = new BrowserMultiFormatReader();
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) throw new Error('No camera found.');

      let selectedDevice = videoInputDevices.find(d => d.label.toLowerCase().includes('back')) || videoInputDevices[0];
      
      scanningActive = true;
      scannerControls = await codeReader.decodeFromVideoDevice(
        selectedDevice.deviceId,
        videoElement,
        (result, err) => {
          if (result && !isProcessingBarcode && scanningActive) {
            handleBarcodeDetected(result.getText());
          }
        }
      );
    } catch (err) {
      error = err.message || 'Failed to start camera.';
      scanningActive = false;
    } finally {
      isLoading = false;
    }
  }

  function stopScanning() {
    scanningActive = false;
    if (scannerControls) {
      scannerControls.stop();
      scannerControls = null;
    }
    // BUG FIX: Removed the call to codeReader.reset() as it does not exist.
    // The library handles its own state cleanup. Re-creating the instance is sufficient.
    codeReader = null; 
  }

  async function handleBarcodeDetected(code) {
    if (isProcessingBarcode) return;
    if (!FDCService.isValidUPCFormat(code)) return;

    isProcessingBarcode = true;
    stopScanning();
    isLoading = true;
    error = null;

    try {
      let productResult = null;
      if (selectedSource === 'usda') {
        productResult = await fdcService.searchByUPC(code);
      } else {
        productResult = await openFoodFactsService.searchByUPC(code);
      }

      if (productResult) {
        dispatch('scanComplete', { ...productResult, method: 'UPC' });
        closeModal(true);
      } else {
        throw new Error(`Product not found in ${selectedSource === 'usda' ? 'USDA' : 'OpenFoodFacts'} database.`);
      }
    } catch (err) {
      error = err.message || 'Product lookup failed.';
    } finally {
      isLoading = false;
      isProcessingBarcode = false;
    }
  }

  function handleSourceChange(event) {
    selectedSource = event.target.value;
    localStorage.setItem('upc-data-source', selectedSource);
  }

  // --- Nutrition Label (OCR) Functions ---
  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    error = null;
    imagePreview = URL.createObjectURL(file);
    await processImage(file);
  }

  async function processImage(file) {
    isLoading = true;
    ocrResult = null;
    error = null;
    ocrLoadingState = 'processing';

    try {
      const result = await ocrService.processImage(file);
      if (result) {
        dispatch('scanComplete', {
          ...result,
          method: 'OCR',
          calciumValue: result.calcium ? parseFloat(result.calcium.match(/[\d\.]+/)?.[0]) : null,
        });
        closeModal(true);
      } else {
        throw new Error("Could not extract nutrition data from the image.");
      }
    } catch (err) {
      error = err.message || 'Failed to process image.';
    } finally {
      isLoading = false;
      ocrLoadingState = '';
      imagePreview = null; // Clear preview after attempt
    }
  }

  // --- Event Handlers ---
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) closeModal();
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') closeModal();
  }

  // --- Reactive Logic ---
  $: if (show && activeTab === 'upc' && !scanningActive) {
    setTimeout(startScanning, 100);
  } else if (!show) {
    stopScanning();
  }
</script>

{#if show}
  <div class="modal-backdrop" on:click={handleBackdropClick} on:keydown={handleKeydown} role="button" tabindex="0">
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation role="dialog" tabindex="-1">
      <div class="modal-header">
        <button class="modal-back" on:click={() => closeModal()}>
          <span class="material-icons">arrow_back</span>
        </button>
        <h2 class="modal-title">Smart Scan</h2>
      </div>

      <div class="tab-controls">
        <button class="tab-btn" class:active={activeTab === 'upc'} on:click={() => switchTab('upc')} disabled={isLoading}>
          <span class="material-icons">qr_code_scanner</span> Barcode
        </button>
        <button class="tab-btn" class:active={activeTab === 'ocr'} on:click={() => switchTab('ocr')} disabled={isLoading}>
          <span class="material-icons">camera_alt</span> Nutrition Label
        </button>
      </div>

      <div class="modal-body">
        {#if activeTab === 'upc'}
          <!-- Barcode Scanning UI -->
          <div class="source-selection">
             <label class="source-option">
              <input type="radio" bind:group={selectedSource} value="usda" on:change={handleSourceChange} disabled={isLoading} />
              <span class="source-label">USDA</span>
            </label>
            <label class="source-option">
              <input type="radio" bind:group={selectedSource} value="openfoodfacts" on:change={handleSourceChange} disabled={isLoading} />
              <span class="source-label">OpenFoodFacts</span>
            </label>
          </div>
          <div class="camera-section">
            <video bind:this={videoElement} class="camera-video" autoplay muted playsinline></video>
            {#if scanningActive}
              <div class="scan-overlay">
                <div class="scan-frame">
                  <div class="laser-line"></div>
                </div>
                <p class="scan-instruction">Center barcode in frame</p>
              </div>
            {/if}
          </div>
          {#if error}
            <div class="error-section">
              <span class="material-icons">error</span>
              <p>{error}</p>
              <button class="retry-btn" on:click={startScanning} disabled={isLoading}>Try Again</button>
            </div>
          {/if}
        {:else if activeTab === 'ocr'}
          <!-- OCR Scanning UI -->
          <div class="ocr-instructions">
            <span class="material-icons">photo_camera</span>
            <p>Take a photo of the nutrition label or upload an image.</p>
          </div>
          <div class="input-buttons">
            <button class="file-btn" on:click={() => cameraInput?.click()} disabled={isLoading}>
              <span class="material-icons">camera_alt</span> Take Photo
            </button>
            <button class="file-btn" on:click={() => fileInput?.click()} disabled={isLoading}>
              <span class="material-icons">folder</span> Choose File
            </button>
          </div>
          {#if isLoading}
            <div class="loading-section">
              <div class="loading-spinner"></div>
              <p>Analyzing nutrition label...</p>
            </div>
          {/if}
          {#if error}
            <div class="error-section">
              <span class="material-icons">error</span>
              <p>{error}</p>
            </div>
          {/if}
          <input bind:this={cameraInput} type="file" accept="image/*" capture="environment" on:change={handleFileSelect} disabled={isLoading} class="file-input" />
          <input bind:this={fileInput} type="file" accept="image/*" on:change={handleFileSelect} disabled={isLoading} class="file-input" />
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Base Modal Styles */
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
    border-radius: var(--spacing-sm);
    box-shadow: var(--shadow);
    width: 100%;
    max-width: 25rem;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .modal-header {
    display: flex;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--divider);
  }
  .modal-back {
    background: none; border: none; color: var(--text-secondary); cursor: pointer;
    padding: 0.25rem; border-radius: 50%;
  }
  .modal-title {
    font-size: var(--font-size-lg); font-weight: 500; color: var(--text-primary);
    margin: 0 auto;
  }

  /* Tab Controls */
  .tab-controls {
    display: flex;
    background: var(--surface-variant);
    padding: var(--spacing-xs);
  }
  .tab-btn {
    flex: 1;
    padding: var(--spacing-sm);
    border: none;
    background: transparent;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    transition: all 0.2s ease;
  }
  .tab-btn.active {
    background: var(--surface);
    color: var(--primary-color);
    box-shadow: var(--shadow);
  }

  .modal-body {
    padding: var(--spacing-lg);
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    min-height: 400px; /* Style adjustment for consistent height */
  }

  /* Barcode Tab Styles */
  .source-selection {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    margin-bottom: var(--spacing-md);
  }
  .source-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-sm);
    cursor: pointer;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 0.25rem;
    transition: all 0.2s;
  }
  .source-option:hover {
    background: var(--surface-variant);
  }

  /* Custom radio button styling */
  .source-option input[type="radio"] {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid var(--text-secondary);
    border-radius: 50%;
    margin: 0;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Unselected state - larger empty circle */
  .source-option input[type="radio"]:not(:checked) {
    width: 18px;
    height: 18px;
    border-color: var(--text-secondary);
  }

  /* Selected state - smaller circle with filled center */
  .source-option input[type="radio"]:checked {
    width: 16px;
    height: 16px;
    border-color: var(--primary-color);
    background: var(--primary-color);
    position: relative;
  }

  /* Filled center dot for selected state */
  .source-option input[type="radio"]:checked::after {
    content: '';
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    position: absolute;
  }

  .source-label {
    font-weight: 500;
    color: var(--text-primary);
  }
  .camera-section {
    position: relative;
    background: #000;
    border-radius: 0.5rem;
    overflow: hidden;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .camera-video {
    width: 100%;
    display: block;
  }
  .scan-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .scan-frame {
    width: 80%; height: 100px;
    border-radius: 0.5rem;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    position: relative;
  }
  .laser-line {
    position: absolute;
    top: 50%;
    left: 5%; right: 5%;
    height: 2px;
    background: red;
    box-shadow: 0 0 4px red;
    animation: laser-scan 2s infinite;
  }
  @keyframes laser-scan {
    0%, 100% { transform: translateY(-30px); }
    50% { transform: translateY(30px); }
  }
  .scan-instruction {
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    margin-top: 1rem;
    font-size: var(--font-size-sm);
  }

  /* OCR Tab Styles */
  .ocr-instructions {
    text-align: center;
    color: var(--text-secondary);
  }
  .ocr-instructions .material-icons {
    font-size: 3rem;
    color: var(--primary-color);
  }
  .input-buttons {
    display: flex;
    gap: var(--spacing-md);
  }
  .file-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: var(--spacing-md);
    border: 1px solid var(--divider);
    border-radius: 0.5rem;
    background: var(--surface);
    color: var(--text-primary);
    cursor: pointer;
  }
  .file-input { display: none; }

  /* Common States */
  .loading-section {
    text-align: center;
  }
  .loading-spinner {
    width: 2rem; height: 2rem;
    border: 3px solid var(--divider);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 1rem auto;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  
  .error-section {
    text-align: center;
    color: var(--error-color);
    background: var(--error-alpha-10);
    padding: var(--spacing-md);
    border-radius: 0.5rem;
  }
  .retry-btn {
    margin-top: var(--spacing-sm);
    background: var(--error-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
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

<!--
 * Unified Smart Scan Modal for Calcium Tracker PWA
 * Combines Barcode (UPC) and Nutrition Label (OCR) scanning.
-->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { BrowserMultiFormatReader } from '@zxing/browser';
  import { FDCService } from '$lib/services/FDCService';
  import { OpenFoodFactsService } from '$lib/services/OpenFoodFactsService';
  import { OCRService } from '$lib/services/OCRService.ts';
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

  // --- Camera Enhancement State ---
  let torchEnabled = false;
  let torchSupported = false;
  let showManualUPCEntry = false;
  let manualUPCValue = '';
  let cameraStream = null;
  let cameraInitialized = false;
  let cameraDeviceId = null;

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
    stopCamera();
  });

  // --- Core Logic ---
  function closeModal(didScan = false) {
    stopScanning();
    stopCamera();
    showManualUPCEntry = false;
    manualUPCValue = '';
    show = false;
    if (!didScan) {
      dispatch('close');
    }
  }

  // Enhanced tab switching
  async function switchTab(tab) {
    if (isLoading) return;

    const previousTab = activeTab;
    activeTab = tab;
    localStorage.setItem('scan-default-tab', tab);
    error = null;
    showManualUPCEntry = false;

    // Camera mode transition
    if (tab === 'upc' || tab === 'ocr') {
      // Both modes need camera
      await activateCameraForMode(tab);
    } else {
      stopCamera();
    }
  }

  // --- Unified Camera Management System ---
  async function initializeCamera() {
    if (cameraInitialized && cameraStream) {
      // Reuse existing stream
      assignStreamToVideo();
      return;
    }

    try {
      isLoading = true;
      error = null;

      // Unified camera constraints for both modes
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      cameraStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Detect torch capability
      const track = cameraStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      torchSupported = capabilities.torch || false;

      assignStreamToVideo();
      cameraInitialized = true;
      cameraDeviceId = track.getSettings().deviceId;

    } catch (err) {
      error = err.message || 'Failed to access camera.';
      cameraInitialized = false;
      throw err;
    } finally {
      isLoading = false;
    }
  }

  function assignStreamToVideo() {
    if (videoElement && cameraStream) {
      videoElement.srcObject = cameraStream;
    }
  }

  function stopBarcodeScanners() {
    scanningActive = false;
    if (scannerControls) {
      scannerControls.stop();
      scannerControls = null;
    }
    // Keep codeReader = null for compatibility
    codeReader = null;
  }

  async function startBarcodeScanning() {
    if (!show || scanningActive || activeTab !== 'upc' || !cameraInitialized || !videoElement) return;

    try {
      stopBarcodeScanners(); // Ensure clean state

      codeReader = new BrowserMultiFormatReader();

      // Use our existing video stream instead of letting ZXing manage its own
      scanningActive = true;
      scannerControls = await codeReader.decodeFromVideoElement(
        videoElement,
        (result, err) => {
          if (result && !isProcessingBarcode && scanningActive) {
            handleBarcodeDetected(result.getText());
          }
        }
      );
    } catch (err) {
      error = err.message || 'Failed to start barcode scanning.';
      scanningActive = false;
    }
  }

  // Legacy function for compatibility - now delegates to unified system
  async function startScanning() {
    await activateCameraForMode('upc');
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

  // Enhanced camera cleanup
  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    if (videoElement) {
      videoElement.srcObject = null;
    }
    cameraInitialized = false;
    scanningActive = false;
    torchEnabled = false;
    torchSupported = false;
    cameraDeviceId = null;
  }

  // Mode-specific camera activation
  async function activateCameraForMode(mode) {
    stopBarcodeScanners(); // Stop any active barcode detection

    await initializeCamera(); // Unified camera init

    if (mode === 'upc') {
      await startBarcodeScanning();
    } else if (mode === 'ocr') {
      // OCR mode just shows camera preview, no auto-scanning
      console.log('Camera ready for OCR capture');
    }
  }

  async function toggleTorch() {
    if (!cameraStream || !torchSupported) return;

    try {
      const track = cameraStream.getVideoTracks()[0];
      await track.applyConstraints({
        advanced: [{ torch: !torchEnabled }]
      });
      torchEnabled = !torchEnabled;
    } catch (error) {
      console.error('Failed to toggle torch:', error);
    }
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

  async function handleManualUPCLookup() {
    if (!manualUPCValue.trim()) return;

    isLoading = true;
    error = null;

    try {
      let productResult = null;
      if (selectedSource === 'usda') {
        productResult = await fdcService.searchByUPC(manualUPCValue.trim());
      } else {
        productResult = await openFoodFactsService.searchByUPC(manualUPCValue.trim());
      }

      if (productResult) {
        dispatch('scanComplete', { ...productResult, method: 'Manual UPC' });
        closeModal(true);
      } else {
        throw new Error(`Product not found in ${selectedSource === 'usda' ? 'USDA' : 'OpenFoodFacts'} database.`);
      }
    } catch (err) {
      error = err.message || 'Product lookup failed.';
    } finally {
      isLoading = false;
    }
  }

  // --- Nutrition Label (OCR) Functions ---
  async function captureOCRImage() {
    if (!videoElement || !cameraStream) return;

    // Create canvas to capture current video frame
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0);

    // Convert to blob and process
    canvas.toBlob(async (blob) => {
      if (blob) {
        // Convert blob to proper File object with correct metadata
        const file = new File(
          [blob],
          `nutrition-label-${Date.now()}.jpg`,
          {
            type: 'image/jpeg',
            lastModified: Date.now()
          }
        );
        await processImage(file);
      }
    }, 'image/jpeg', 0.8);
  }

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

  // --- Enhanced Reactive Logic ---
  $: if (show && (activeTab === 'upc' || activeTab === 'ocr')) {
    // Both modes trigger camera initialization
    setTimeout(() => activateCameraForMode(activeTab), 100);
  } else if (!show) {
    stopBarcodeScanners();
    stopCamera(); // Ensure camera is fully stopped when modal is closed
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
          <div class="camera-section"
               class:upc-mode={activeTab === 'upc'}
               class:ocr-mode={activeTab === 'ocr'}>
            {#if !showManualUPCEntry}
              <video bind:this={videoElement} class="camera-video"
                     class:ocr-mode={activeTab === 'ocr'} autoplay muted playsinline></video>

              <!-- Camera Controls Overlay -->
              <div class="camera-controls">
                {#if torchSupported}
                  <button class="control-btn torch-btn"
                          class:active={torchEnabled}
                          on:click={toggleTorch}>
                    <span class="material-icons">
                      {torchEnabled ? 'flashlight_on' : 'flashlight_off'}
                    </span>
                  </button>
                {/if}

                {#if activeTab === 'upc'}
                  <button class="control-btn keyboard-btn" on:click={() => showManualUPCEntry = true}>
                    <span class="material-icons">keyboard</span>
                  </button>
                {/if}
              </div>

              <!-- Scanning Frame -->
              {#if activeTab === 'upc' && cameraInitialized}
                <div class="scan-overlay">
                  <div class="scan-frame">
                    <div class="laser-line"></div>
                  </div>
                  <p class="scan-instruction">Center barcode in frame</p>
                </div>
              {/if}

              <!-- OCR Frame -->
              {#if activeTab === 'ocr' && cameraInitialized}
                <div class="ocr-overlay">
                  <div class="ocr-frame">
                    <div class="corner-guides">
                      <div class="corner top-left"></div>
                      <div class="corner top-right"></div>
                      <div class="corner bottom-left"></div>
                      <div class="corner bottom-right"></div>
                    </div>
                  </div>
                  <p class="ocr-instruction">Align nutrition label in frame</p>
                </div>
              {/if}
            {:else}
              <!-- Manual UPC Entry (replaces camera view) -->
              <div class="manual-upc-section">
                <div class="manual-upc-header">
                  <h3>Enter Barcode Number</h3>
                  <button class="close-manual" on:click={() => showManualUPCEntry = false}>
                    <span class="material-icons">close</span>
                  </button>
                </div>

                <div class="upc-input-group">
                  <input type="text"
                         bind:value={manualUPCValue}
                         placeholder="Enter UPC/EAN code"
                         class="upc-input"
                         inputmode="numeric"
                         pattern="[0-9]*">

                  <div class="barcode-example">
                    <svg class="example-barcode" viewBox="0 0 100 30">
                      <!-- Simple barcode representation -->
                      <rect x="5" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="10" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="13" y="5" width="3" height="20" fill="currentColor"/>
                      <rect x="18" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="21" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="25" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="28" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="32" y="5" width="3" height="20" fill="currentColor"/>
                      <rect x="37" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="40" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="44" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="47" y="5" width="3" height="20" fill="currentColor"/>
                      <rect x="52" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="56" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="59" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="63" y="5" width="3" height="20" fill="currentColor"/>
                      <rect x="68" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="71" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="75" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="78" y="5" width="3" height="20" fill="currentColor"/>
                      <rect x="83" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="87" y="5" width="1" height="20" fill="currentColor"/>
                      <rect x="90" y="5" width="2" height="20" fill="currentColor"/>
                      <rect x="94" y="5" width="1" height="20" fill="currentColor"/>
                    </svg>
                    <span class="example-text">Example: 123456789012</span>
                  </div>

                  <button class="lookup-button"
                          disabled={!manualUPCValue.trim()}
                          on:click={handleManualUPCLookup}>
                    Lookup Barcode
                  </button>
                </div>
              </div>
            {/if}
          </div>
          {#if error}
            <div class="error-section">
              <span class="material-icons">error</span>
              <p>{error}</p>
              <button class="retry-btn" on:click={() => activateCameraForMode(activeTab)} disabled={isLoading}>Try Again</button>
            </div>
          {/if}
        {:else if activeTab === 'ocr'}
          <!-- OCR Scanning UI - Uses shared camera section -->
          <div class="camera-section ocr-mode">
            <video bind:this={videoElement} class="camera-video"
                   class:ocr-mode={activeTab === 'ocr'} autoplay muted playsinline></video>

            <!-- Camera Controls Overlay -->
            <div class="camera-controls">
              {#if torchSupported}
                <button class="control-btn torch-btn"
                        class:active={torchEnabled}
                        on:click={toggleTorch}>
                  <span class="material-icons">
                    {torchEnabled ? 'flashlight_on' : 'flashlight_off'}
                  </span>
                </button>
              {/if}
            </div>

            <!-- OCR Frame -->
            <div class="ocr-overlay">
              <div class="ocr-frame">
                <div class="corner-guides">
                  <div class="corner top-left"></div>
                  <div class="corner top-right"></div>
                  <div class="corner bottom-left"></div>
                  <div class="corner bottom-right"></div>
                </div>
              </div>
              <p class="ocr-instruction">Align nutrition label in frame</p>
            </div>
          </div>

          <!-- OCR Action Buttons -->
          {#if cameraInitialized && !showManualUPCEntry && !isLoading}
            <div class="ocr-actions">
              <button class="capture-btn primary" on:click={captureOCRImage}>
                <span class="material-icons">camera</span>
                Capture
              </button>

              <button class="file-btn secondary" on:click={() => fileInput?.click()}>
                <span class="material-icons">folder</span>
                Choose File
              </button>
            </div>
          {/if}

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
    display: flex;
    flex-direction: column;
    /* Content-aware responsive sizing - increased height by ~15% */
    min-height: min(750px, 95vh);
    max-height: min(950px, 98vh);
    overflow: hidden;
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
    gap: var(--spacing-md); /* Reduced gap to prevent excessive spacing */
    /* Content-aware height constraints */
    min-height: 0; /* Allow flexbox to calculate natural size */
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Mode-specific camera section sizing */
  .camera-section.upc-mode {
    /* Fixed height for consistent UPC barcode scanning */
    height: clamp(350px, 45vh, 450px);
  }

  .camera-section.ocr-mode {
    /* Flexible height for OCR to use available modal space */
    flex: 1;
    min-height: clamp(350px, 45vh, 450px);
    max-height: 600px; /* Prevent excessive height */
  }
  .camera-video {
    width: 100%;
    display: block;
  }
  /* Mode-specific aspect ratios */
  .camera-section.upc-mode {
    aspect-ratio: 16/9; /* Landscape for barcode scanning */
  }

  .camera-section.ocr-mode {
    aspect-ratio: 3/4; /* Portrait for nutrition labels */
  }

  .camera-video.ocr-mode {
    /* Portrait aspect ratio for nutrition labels */
    object-fit: cover;
    aspect-ratio: 3/4;
  }

  /* Camera Controls */
  .camera-controls {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    z-index: 10;
  }

  .control-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .control-btn:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }

  .control-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
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

  /* OCR Frame Styling */
  .ocr-overlay {
    position: absolute;
    top: 8%; left: 0; right: 0; bottom: 12%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    pointer-events: none;
  }

  .ocr-frame {
    width: 80%; /* Larger frame with more height available */
    aspect-ratio: 1/2; /* Portrait nutrition label shape */
    position: relative;
    border: 2px solid var(--primary-color);
    border-radius: 8px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
    max-height: 90%; /* Increase max height to use more available space */
  }

  .corner-guides {
    position: absolute;
    inset: -6px; /* Smaller inset to keep corners more visible */
  }

  .corner {
    position: absolute;
    width: 16px; /* Smaller corner guides */
    height: 16px;
    border: 2px solid var(--primary-color);
  }

  .corner.top-left {
    top: 0; left: 0;
    border-right: none; border-bottom: none;
  }

  .corner.top-right {
    top: 0; right: 0;
    border-left: none; border-bottom: none;
  }

  .corner.bottom-left {
    bottom: 0; left: 0;
    border-right: none; border-top: none;
  }

  .corner.bottom-right {
    bottom: 0; right: 0;
    border-left: none; border-top: none;
  }

  .ocr-instruction {
    position: absolute;
    bottom: -2.5rem; /* Move below the frame */
    left: 50%;
    transform: translateX(-50%);
    color: white;
    background: rgba(0, 0, 0, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: var(--font-size-sm);
    white-space: nowrap;
  }

  /* OCR Tab Styles - Removed unused selectors */
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

  /* Manual UPC Entry */
  .manual-upc-section {
    background: var(--surface);
    border-radius: 0.5rem;
    padding: var(--spacing-lg);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .manual-upc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }

  .manual-upc-header h3 {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--text-primary);
  }

  .close-manual {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-manual:hover {
    background: var(--surface-variant);
  }

  .upc-input-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .upc-input {
    width: 100%;
    padding: var(--spacing-md);
    border: 2px solid var(--divider);
    border-radius: 0.5rem;
    font-size: var(--font-size-lg);
    text-align: center;
    font-family: monospace;
    background: var(--surface);
    color: var(--text-primary);
  }

  .upc-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .barcode-example {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-secondary);
  }

  .example-barcode {
    width: 100px;
    height: 30px;
  }

  .example-text {
    font-size: var(--font-size-sm);
  }

  .lookup-button {
    width: 100%;
    padding: var(--spacing-lg);
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: var(--font-size-lg);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .lookup-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  .lookup-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* OCR Action Buttons */
  .ocr-actions {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-md); /* Reduced margin to minimize spacing */
    flex-shrink: 0; /* Prevent shrinking */
  }

  .capture-btn {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: var(--font-size-md);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .capture-btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  .file-btn.secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--surface);
    color: var(--text-primary);
    border: 2px solid var(--divider);
    border-radius: 0.5rem;
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .file-btn.secondary:hover {
    background: var(--surface-variant);
    border-color: var(--primary-color);
  }

  /* Mobile responsive adjustments */
  @media (max-width: 480px) {
    .modal-content {
      /* Optimized for 411x729 viewport - 15% taller for more camera space */
      min-height: min(100vh, 690px); /* ~15% increase from 600px */
      max-height: 100vh;
      border-radius: 0;
    }

    .camera-section.upc-mode {
      /* Fixed height for mobile UPC */
      height: clamp(300px, 45vh, 400px);
    }

    .camera-section.ocr-mode {
      /* Flexible height for mobile OCR */
      flex: 1;
      min-height: clamp(280px, 40vh, 380px);
      max-height: 55vh;
    }

    .modal-body {
      padding: var(--spacing-md);
    }

    .camera-controls {
      top: var(--spacing-sm);
      right: var(--spacing-sm);
    }

    .control-btn {
      width: 44px;
      height: 44px;
    }
  }

  /* Desktop specific sizing */
  @media (min-width: 481px) {
    .modal-content {
      /* Fixed height for consistent desktop modal sizing across both modes */
      height: 750px;
      max-height: 90vh;
    }
  }
</style>
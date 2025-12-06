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
 */

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
  import { FEATURES } from '$lib/utils/featureFlags';
  import { logger } from '$lib/utils/logger';
  import TestDataCollector from './TestDataCollector.svelte';

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
  let focusSupported = false;
  let currentFocusMode = null;
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
  let focusIndicatorPosition = null; // { x: number, y: number } or null

  // --- Debug Mode State ---
  let debugMode = false;
  let debugData = null;
  let longPressTimer = null;
  let isLongPressing = false;

  // --- Test Data Collector State ---
  let testCollectorRef = null;
  let isTestMode = false;

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
    if (lastTab) {
      // Only restore OCR tab if OCR is enabled
      if (lastTab === 'ocr' && !FEATURES.OCR_ENABLED) {
        activeTab = 'upc';
      } else {
        activeTab = lastTab;
      }
    }

    const lastSource = localStorage.getItem('upc-data-source');
    if (lastSource) selectedSource = lastSource;

    // Initialize test mode
    isTestMode = import.meta.env.DEV || window.location.search.includes('testmode=1');
    if (isTestMode) {
      logger.debug('SMART SCAN', 'Test mode enabled');
    }
  });

  onDestroy(() => {
    stopScanning();
    stopCamera();
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  });

  // --- Core Logic ---
  function closeModal(didScan = false) {
    stopScanning();
    stopCamera();
    // Clean up image preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      imagePreview = null;
    }
    showManualUPCEntry = false;
    manualUPCValue = '';
    debugMode = false; // Reset debug mode when closing
    debugData = null;
    show = false;
    if (!didScan) {
      dispatch('close');
    }
  }

  // Enhanced tab switching
  async function switchTab(tab) {
    if (isLoading) return;

    // Prevent switching to OCR if it's disabled
    if (tab === 'ocr' && !FEATURES.OCR_ENABLED) return;

    const previousTab = activeTab;
    activeTab = tab;
    logger.debug('SMART SCAN', 'Switching tab from', previousTab, 'to', tab);
    localStorage.setItem('scan-default-tab', tab);
    error = null;
    showManualUPCEntry = false;

    // Clean up image preview when switching tabs
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      imagePreview = null;
    }

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
          height: { ideal: 720 },
          focusMode: { ideal: 'continuous' }
        }
      };

      cameraStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Detect torch capability
      const track = cameraStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      const settings = track.getSettings();

      torchSupported = capabilities.torch || false;

      // Detect focus capabilities
      focusSupported = capabilities.focusMode && capabilities.focusMode.length > 0;
      currentFocusMode = settings.focusMode || 'unknown';

      logger.debug('SCAN', 'Camera initialized with capabilities:', {
        hasTorch: torchSupported,
        hasFocus: focusSupported,
        focusMode: currentFocusMode,
        hasZoom: capabilities.zoom !== undefined
      });

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

      logger.debug('SCAN', 'Starting barcode scanning');

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
    logger.debug('SCAN', 'Activating camera for mode:', mode);

    stopBarcodeScanners(); // Stop any active barcode detection

    await initializeCamera(); // Unified camera init

    if (mode === 'upc') {
      await startBarcodeScanning();
    } else if (mode === 'ocr') {
      // OCR mode just shows camera preview, no auto-scanning
      logger.debug('SCAN', 'Camera ready for OCR mode');
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
      logger.error('Failed to toggle torch:', error);
    }
  }

  async function handleTapToFocus(event) {
    if (!cameraStream || !focusSupported || activeTab !== 'ocr') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Show focus indicator
    focusIndicatorPosition = { x, y };

    try {
      const track = cameraStream.getVideoTracks()[0];

      // Calculate normalized coordinates (0-1 range)
      const normalizedX = x / rect.width;
      const normalizedY = y / rect.height;

      await track.applyConstraints({
        advanced: [{
          focusMode: 'single-shot',
          pointsOfInterest: [{ x: normalizedX, y: normalizedY }]
        }]
      });

      // Clear indicator after brief delay
      setTimeout(() => {
        focusIndicatorPosition = null;
      }, 800);

    } catch (error) {
      logger.warn('Tap-to-focus failed:', error);
      focusIndicatorPosition = null;
    }
  }

  async function handleBarcodeDetected(code) {
    if (isProcessingBarcode) return;
    if (!FDCService.isValidUPCFormat(code)) return;

    logger.debug('SCAN', 'Barcode detected:', code);

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
        // Notify test collector if in test mode
        if (isTestMode && testCollectorRef) {
          testCollectorRef.handleUPCScan({
            detail: {
              upc: code,
              product_name: productResult.productName,
              brands: productResult.brandName || productResult.brandOwner,
              serving_size: productResult.servingSize,
              nutrients: {
                calcium_serving: productResult.calciumPerServing,
                calcium_100g: null, // Not available from FDC/OFF in this format
                calcium_unit: 'mg'
              }
            }
          });

          // In test mode, don't close the modal - let user continue to OCR scan
        } else {
          // Normal mode - dispatch and close
          const scanData = { ...productResult, method: 'UPC' };
          logger.debug('SCAN', 'Dispatching scanComplete event with data:', scanData);
          dispatch('scanComplete', scanData);
          // Add small delay to ensure event is processed before modal closes
          setTimeout(() => closeModal(true), 100);
        }
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
        // Add small delay to ensure event is processed before modal closes
        setTimeout(() => closeModal(true), 100);
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

    logger.debug('SCAN', 'Camera ready for OCR capture');

    // Clean up previous preview if exists
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      imagePreview = null;
    }

    // Create canvas to capture current video frame
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0);

    // Convert to blob and process
    canvas.toBlob(async (blob) => {
      if (blob) {
        // Create preview URL to show captured image
        imagePreview = URL.createObjectURL(blob);

        // Convert blob to proper File object with correct metadata
        const fileName = `nutrition-label-capture-${Date.now()}.jpg`;
        const file = new File(
          [blob],
          fileName,
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

    // Clean up previous preview if exists
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      imagePreview = null;
    }

    error = null;
    imagePreview = URL.createObjectURL(file);
    await processImage(file);
  }

  // Enhanced processImage function with debug data capture
  async function processImage(file) {
    isLoading = true;
    ocrResult = null;
    error = null;
    ocrLoadingState = 'processing';

    // Determine scan type and file info
    const scanType = activeTab === 'ocr' ? 'file' : 'camera';
    const fileName = file ? file.name : null;

    logger.debug('SCAN', 'Processing OCR image:', { scanType, fileName });

    try {
      const result = await ocrService.processImage(file, isTestMode);
      if (result) {
        // Capture comprehensive debug data
        debugData = {
          scanType: scanType,
          imageCapture: scanType === 'camera',
          isFile: scanType === 'file',
          fileName: fileName,
          rawOcrText: result.rawText,
          spatialResults: result.spatialResults || null, // From enhanced OCR.space API
          apiResponse: result.fullApiResponse || null, // Complete API response
          parsedElements: {
            servingQuantity: result.servingQuantity,
            servingMeasure: result.servingMeasure,
            standardMeasureValue: result.standardMeasureValue,
            standardMeasureUnit: result.standardMeasureUnit,
            calcium: result.calcium,
            confidence: result.confidence
          },
          timestamp: new Date().toLocaleTimeString(),
          processingTime: Date.now(), // Will be calculated later
          cameraInfo: cameraStream ? {
            focusSupported: focusSupported,
            currentFocusMode: currentFocusMode,
            torchSupported: torchSupported,
            deviceId: cameraDeviceId
          } : null
        };
        
        // Build serving size string for display
        let servingSize = '';
        if (result.servingQuantity && result.servingMeasure) {
          servingSize = `${result.servingQuantity} ${result.servingMeasure}`;
          if (result.standardMeasureValue && result.standardMeasureUnit) {
            servingSize += ` (${result.standardMeasureValue}${result.standardMeasureUnit})`;
          }
        }
                
        // Notify test collector if in test mode
        if (isTestMode && testCollectorRef && result.imageBlob) {
          testCollectorRef.handleOCRScan({
            detail: {
              rawText: result.rawText,
              spatialResults: result.spatialResults,
              imageBlob: result.imageBlob
            }
          });

          // In test mode, don't close the modal - let user download test data
        } else if (!debugMode) {
          // Normal mode (not debug, not test) - dispatch and close
          const ocrData = {
            ...result,
            method: 'OCR',
            calciumValue: result.calcium, // Direct numeric value in mg
            servingSize: servingSize, // Formatted string for display
            fileName: debugData.fileName || null, // Include file name for metadata
          };
          logger.debug('SCAN', 'Dispatching scanComplete event with OCR data:', {
            calcium: ocrData.calciumValue,
            servingSize: ocrData.servingSize,
            confidence: result.confidence
          });
          dispatch('scanComplete', ocrData);
          // Add small delay to ensure event is processed before modal closes
          setTimeout(() => closeModal(true), 100);
        }
      } else {
        throw new Error("Could not extract nutrition data from the image.");
      }
    } catch (err) {
      error = err.message || 'Failed to process image.';
      debugData = {
        scanType: scanType,
        imageCapture: scanType === 'camera',
        isFile: scanType === 'file',
        fileName: fileName,
        error: err.message,
        timestamp: new Date().toLocaleTimeString(),
        cameraInfo: cameraStream ? {
          focusSupported: focusSupported,
          currentFocusMode: currentFocusMode,
          torchSupported: torchSupported,
          deviceId: cameraDeviceId
        } : null
      };
    } finally {
      isLoading = false;
      ocrLoadingState = '';
      // Keep imagePreview to show captured/selected image
      // (cleaned up on tab switch, modal close, or next capture)
    }
  }

  // --- Debug Mode Functions ---
  // Long press handlers for debug mode
  function handleFileSelectStart() {
    isLongPressing = true;
    longPressTimer = setTimeout(() => {
      if (isLongPressing) {
        debugMode = !debugMode;
        logger.debug('SMART SCAN', 'Debug mode toggled:', debugMode);
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 1000); // 1 second long press
  }

  function handleFileSelectEnd() {
    isLongPressing = false;
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  // Toggle debug panel
  function toggleDebugPanel() {
    debugMode = !debugMode;
    logger.debug('SMART SCAN', 'Debug panel toggled:', debugMode);
  }

  // --- Event Handlers ---
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) closeModal();
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') closeModal();
  }

  function useDebugResults() {
    if (debugData && !debugData.error) {
      // Build serving size string for display
      let servingSize = '';
      if (debugData.parsedElements.servingQuantity && debugData.parsedElements.servingMeasure) {
        servingSize = `${debugData.parsedElements.servingQuantity} ${debugData.parsedElements.servingMeasure}`;
        if (debugData.parsedElements.standardMeasureValue && debugData.parsedElements.standardMeasureUnit) {
          servingSize += `(${debugData.parsedElements.standardMeasureValue}${debugData.parsedElements.standardMeasureUnit})`;
        }
      }

      const debugOcrData = {
        rawText: debugData.rawOcrText,
        servingQuantity: debugData.parsedElements.servingQuantity,
        servingMeasure: debugData.parsedElements.servingMeasure,
        standardMeasureValue: debugData.parsedElements.standardMeasureValue,
        standardMeasureUnit: debugData.parsedElements.standardMeasureUnit,
        calcium: debugData.parsedElements.calcium,
        confidence: debugData.parsedElements.confidence,
        method: 'OCR',
        calciumValue: debugData.parsedElements.calcium,
        servingSize: servingSize,
        fileName: debugData.fileName || null, // Include file name for metadata
      };
      dispatch('scanComplete', debugOcrData);
      // Add small delay to ensure event is processed before modal closes
      setTimeout(() => closeModal(true), 100);
    }
  }

  // Copy debug data to clipboard as JSON
  async function copyDebugDataToClipboard() {
    if (!debugData) return;

    const debugJson = {
      scanType: debugData.scanType,
      imageCapture: debugData.imageCapture,
      isFile: debugData.isFile,
      fileName: debugData.fileName || null,
      rawOcrText: debugData.rawOcrText || debugData.error || null,
      spatialResults: debugData.spatialResults || null,
      apiResponse: debugData.apiResponse || null,
      parsedElements: debugData.parsedElements || null,
      timestamp: debugData.timestamp,
      error: debugData.error || null
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(debugJson, null, 2));
      // Show brief success feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err) {
      logger.error('Failed to copy to clipboard:', err);
      // Fallback: create temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = JSON.stringify(debugJson, null, 2);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
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
        {#if FEATURES.OCR_ENABLED}
          <button class="tab-btn" class:active={activeTab === 'ocr'} on:click={() => switchTab('ocr')} disabled={isLoading}>
            <span class="material-icons">camera_alt</span> Nutrition Label
          </button>
        {/if}
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
        {:else if activeTab === 'ocr' && FEATURES.OCR_ENABLED}
          <!-- OCR Scanning UI - Uses shared camera section -->
          <div class="camera-section ocr-mode">
            {#if imagePreview}
              <!-- Show captured image -->
              <img src={imagePreview} alt="Captured nutrition label" class="camera-video ocr-mode" />
            {:else}
              <!-- Show live video feed -->
              <video bind:this={videoElement} class="camera-video"
                     class:ocr-mode={activeTab === 'ocr'}
                     on:click={handleTapToFocus}
                     autoplay muted playsinline></video>

              <!-- Camera Controls Overlay (only show for live feed) -->
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

              <!-- OCR Frame (only show for live feed) -->
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

              <!-- Focus Indicator (only show for live feed) -->
              {#if focusIndicatorPosition}
                <div class="focus-indicator"
                     style="left: {focusIndicatorPosition.x}px; top: {focusIndicatorPosition.y}px;">
                </div>
              {/if}
            {/if}
          </div>

          <!-- OCR Action Buttons -->
          {#if cameraInitialized && !showManualUPCEntry && !isLoading}
            <div class="ocr-actions">
              {#if imagePreview}
                <button class="capture-btn primary" on:click={() => {
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                    imagePreview = null;
                  }
                }}>
                  <span class="material-icons">refresh</span>
                  Retake
                </button>
              {:else}
                <button class="capture-btn primary" on:click={captureOCRImage}>
                  <span class="material-icons">camera</span>
                  Capture
                </button>
              {/if}

              <button class="file-select-btn" 
                      class:debug-active={debugMode}
                      on:touchstart={handleFileSelectStart}
                      on:touchend={handleFileSelectEnd}
                      on:mousedown={handleFileSelectStart}
                      on:mouseup={handleFileSelectEnd}
                      on:mouseleave={handleFileSelectEnd}
                      on:click={() => {
                        if (!isLongPressing) {
                          fileInput.click();
                        }
                      }}
                      disabled={isLoading}>
                <span class="material-icons">folder</span>
                Select Image File
                {#if debugMode}
                  <span class="debug-indicator">🔍</span>
                {/if}
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

          <!-- Debug Panel -->
          {#if debugMode}
            <div class="debug-panel">
              <div class="debug-header">
                <h4>🔍 Debug Mode</h4>
                <button on:click={toggleDebugPanel} class="debug-close">×</button>
              </div>
              
              {#if debugData}
                <div class="debug-content">
                  <div class="debug-section">
                    <h5>📱 Scan Info:</h5>
                    <div class="debug-grid">
                      <span>Type:</span> <span>{debugData.scanType}</span>
                      <span>Image Capture:</span> <span>{debugData.imageCapture ? 'Yes' : 'No'}</span>
                      <span>File:</span> <span>{debugData.fileName || 'N/A'}</span>
                    </div>
                  </div>

                  {#if !debugData.error}
                    <div class="debug-section">
                      <h5>🍽️ Parsed Serving:</h5>
                      <div class="debug-grid">
                        <span>Quantity:</span> <span>{debugData.parsedElements?.servingQuantity || 'null'}</span>
                        <span>Measure:</span> <span>{debugData.parsedElements?.servingMeasure || 'null'}</span>
                        <span>Standard Value:</span> <span>{debugData.parsedElements?.standardMeasureValue || 'null'}</span>
                        <span>Standard Unit:</span> <span>{debugData.parsedElements?.standardMeasureUnit || 'null'}</span>
                      </div>
                    </div>

                    <div class="debug-section">
                      <h5>🥛 Parsed Calcium:</h5>
                      <div class="debug-value">
                        {debugData.parsedElements?.calcium ? `${debugData.parsedElements.calcium}mg` : 'null'}
                      </div>
                    </div>

                    <div class="debug-section">
                      <h5>📊 Confidence:</h5>
                      <div class="debug-confidence debug-confidence-{debugData.parsedElements?.confidence}">
                        {debugData.parsedElements?.confidence || 'unknown'}
                      </div>
                    </div>

                    {#if debugData.cameraInfo}
                      <div class="debug-section">
                        <h5>📷 Camera Focus:</h5>
                        <div class="focus-status">
                          <div class="debug-grid">
                            <span>Focus Supported:</span>
                            <span class:supported={debugData.cameraInfo.focusSupported}>
                              {debugData.cameraInfo.focusSupported ? '✓ Yes' : '✗ No'}
                            </span>
                            <span>Focus Mode:</span>
                            <span>{debugData.cameraInfo.currentFocusMode}</span>
                            <span>Torch Supported:</span>
                            <span class:supported={debugData.cameraInfo.torchSupported}>
                              {debugData.cameraInfo.torchSupported ? '✓ Yes' : '✗ No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    {/if}

                    <div class="debug-section">
                      <h5>🎯 Spatial Results:</h5>
                      <div class="debug-spatial">
                        {#if debugData.spatialResults && debugData.spatialResults.length > 0}
                          <div class="spatial-summary">
                            {debugData.spatialResults.length} text elements with coordinates
                          </div>
                          <div class="spatial-preview">
                            {#each debugData.spatialResults.slice(0, 5) as element}
                              <div class="spatial-element">
                                <span class="spatial-text">"{element.text}"</span>
                                <span class="spatial-coords">({element.x}, {element.y})</span>
                              </div>
                            {/each}
                            {#if debugData.spatialResults.length > 5}
                              <div class="spatial-more">
                                ...and {debugData.spatialResults.length - 5} more
                              </div>
                            {/if}
                          </div>
                        {:else}
                          <div class="spatial-none">No spatial coordinate data available</div>
                        {/if}
                      </div>
                    </div>
                  {:else}
                    <div class="debug-section debug-error">
                      <h5>❌ Error:</h5>
                      <pre>{debugData.error}</pre>
                    </div>
                  {/if}

                  <div class="debug-footer">
                    <small>Parsed at {debugData.timestamp}</small>
                    <div class="debug-actions">
                      <button class="debug-copy-btn" on:click={copyDebugDataToClipboard}>
                        📋 Copy JSON
                      </button>
                      {#if !debugData.error}
                        <button class="debug-use-btn" on:click={useDebugResults}>
                          Use These Results
                        </button>
                      {/if}
                    </div>
                  </div>
                </div>
              {:else}
                <div class="debug-placeholder">
                  Process an image to see debug information
                </div>
              {/if}
            </div>
          {/if}

          <input bind:this={fileInput} type="file" accept="image/*" on:change={handleFileSelect} disabled={isLoading} class="file-input" />
        {/if}
      </div>
    </div>
  </div>

  <!-- Test Data Collector (dev-only) -->
  {#if isTestMode}
    <TestDataCollector bind:this={testCollectorRef} />
  {/if}
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
    cursor: pointer; /* Show it's interactive */
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

  /* Focus Indicator */
  .focus-indicator {
    position: absolute;
    width: 80px;
    height: 80px;
    border: 2px solid var(--primary-color);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    animation: focus-pulse 0.8s ease-out;
    z-index: 15;
  }

  @keyframes focus-pulse {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.5);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1);
    }
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

  /* File Select Button with Debug Mode */
  .file-select-btn {
    position: relative;
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
    user-select: none;
  }

  .file-select-btn:hover {
    background: var(--surface-variant);
    border-color: var(--primary-color);
  }

  .file-select-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .file-select-btn.debug-active {
    background: #fbbf24;
    color: #92400e;
    border: 2px solid #f59e0b;
  }

  .file-select-btn.debug-active:hover {
    background: #f59e0b;
  }

  .debug-indicator {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Debug Panel Styles */
  .debug-panel {
    margin-top: 1rem;
    border: 2px dashed #fbbf24;
    border-radius: 8px;
    background: #fffbeb;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
  }

  .debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: #fbbf24;
    color: #92400e;
    border-radius: 6px 6px 0 0;
  }

  .debug-header h4 {
    margin: 0;
    font-size: 0.9rem;
  }

  .debug-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #92400e;
  }

  .debug-content {
    padding: 0.75rem;
    color: #1f2937;
  }

  .debug-section {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #fde68a;
  }

  .debug-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .debug-section h5 {
    margin: 0 0 0.25rem 0;
    color: #92400e;
    font-size: 0.8rem;
  }

  .debug-text {
    background: #f3f4f6;
    padding: 0.5rem;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 120px;
    overflow-y: auto;
    margin: 0;
    font-size: 0.7rem;
    line-height: 1.3;
    color: #1f2937;
  }

  .debug-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25rem 0.5rem;
    font-size: 0.75rem;
    color: #1f2937;
  }

  .debug-grid span:nth-child(odd) {
    font-weight: bold;
    color: #92400e;
  }

  .debug-grid span:nth-child(even) {
    color: #1f2937; 
  }  

  .debug-value {
    font-weight: bold;
    color: #059669;
    font-size: 0.9rem;
  }

  .debug-confidence {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.7rem;
  }

  .debug-confidence-high {
    background: #d1fae5;
    color: #065f46;
  }

  .debug-confidence-medium {
    background: #fef3c7;
    color: #92400e;
  }

  .debug-confidence-low {
    background: #fee2e2;
    color: #991b1b;
  }

  .debug-error {
    background: #fee2e2;
    border-color: #fca5a5;
    border-radius: 4px;
    padding: 0.5rem;
  }

  .debug-error h5 {
    color: #991b1b;
  }

  .debug-error pre {
    margin: 0;
    color: #991b1b;
    font-size: 0.7rem;
  }

  .debug-footer {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #fde68a;
    text-align: center;
    color: #92400e;
  }

  .debug-placeholder {
    padding: 2rem;
    text-align: center;
    color: #92400e;
    font-style: italic;
  }

  .debug-header {
    position: sticky; /* Keep header visible when scrolling */
    top: 0;
    z-index: 1;
  }

  .debug-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .debug-copy-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }

  .debug-copy-btn:hover {
    background: #2563eb;
  }

  .debug-use-btn {
    background: #059669;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
    flex: 1;
  }

  .debug-use-btn:hover {
    background: #047857;
  }

  /* Spatial results styles */
  .debug-spatial {
    font-size: 0.75rem;
  }

  .spatial-summary {
    font-weight: bold;
    color: #059669;
    margin-bottom: 0.5rem;
  }

  .spatial-preview {
    max-height: 120px;
    overflow-y: auto;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 0.5rem;
  }

  .spatial-element {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
    border-bottom: 1px solid #e5e7eb;
    font-family: monospace;
  }

  .spatial-element:last-child {
    border-bottom: none;
  }

  .spatial-text {
    font-weight: bold;
    color: #374151;
    flex: 1;
    margin-right: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .spatial-coords {
    color: #6b7280;
    font-size: 0.7rem;
    white-space: nowrap;
  }

  .spatial-more {
    text-align: center;
    font-style: italic;
    color: #6b7280;
    padding: 0.25rem 0;
    border-top: 1px dashed #d1d5db;
  }

  .spatial-none {
    text-align: center;
    font-style: italic;
    color: #9ca3af;
    padding: 1rem;
  }

  /* Focus status styles */
  .focus-status {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: #f9fafb;
    border-radius: 0.25rem;
    font-size: var(--font-size-sm);
  }

  .focus-status .supported {
    color: #059669;
    font-weight: bold;
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

    .debug-panel {
      max-height: 40vh; /* Limit height on mobile */
      overflow-y: auto; /* Make it scrollable */
    }
    
    .debug-content {
      padding: 0.5rem; /* Reduce padding on mobile */
    }
    
    .debug-text {
      max-height: 80px; /* Reduce OCR text display height */
      font-size: 0.65rem; /* Smaller font on mobile */
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
<!--
 * UPC Barcode Scanner Modal for Calcium Tracker PWA
 * Uses @zxing/browser for barcode scanning and USDA FDC API for product lookup
-->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { BrowserMultiFormatReader } from '@zxing/browser';
  import { FDCService } from '$lib/services/FDCService';
  import { FDC_CONFIG } from '$lib/config/fdc.js';

  export let show = false;

  const dispatch = createEventDispatcher();

  let videoElement;
  let codeReader;
  let scanningActive = false;
  let isLoading = false;
  let error = null;
  let loadingState = ''; // 'initializing', 'scanning', 'processing', ''
  let scannedCode = '';
  let productResult = null;
  let scannerControls = null; // Store scanner controls for proper cleanup
  let isProcessingBarcode = false; // Prevent multiple simultaneous detections
  let showDebugJson = false; // For collapsed JSON debug section
  let manualUPC = ''; // Manual UPC input field

  // Initialize FDC service with API key from config
  console.log('UPC: FDC_CONFIG.API_KEY:', FDC_CONFIG.API_KEY ? `${FDC_CONFIG.API_KEY.substring(0, 8)}...` : 'undefined');
  console.log('UPC: import.meta.env.VITE_FDC_API_KEY:', import.meta.env.VITE_FDC_API_KEY ? `${import.meta.env.VITE_FDC_API_KEY.substring(0, 8)}...` : 'undefined');
  const fdcService = new FDCService(FDC_CONFIG.API_KEY);

  onMount(() => {
    codeReader = new BrowserMultiFormatReader();
  });

  onDestroy(() => {
    stopScanning();
  });

  async function startScanning() {
    if (!show || scanningActive) return;

    try {
      isLoading = true;
      loadingState = 'initializing';
      error = null;
      scannedCode = '';
      productResult = null;

      console.log('UPC: Starting barcode scanner...');

      // Get available video devices
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      console.log('UPC: Available cameras:', videoInputDevices.length);

      if (videoInputDevices.length === 0) {
        throw new Error('No camera found. Please ensure camera permissions are granted.');
      }

      // Prefer back/environment camera, but handle various device types
      let selectedDevice = videoInputDevices.find(device => {
        const label = device.label.toLowerCase();
        return label.includes('back') ||
               label.includes('environment') ||
               label.includes('rear');
      });

      // If no back camera found, prefer cameras that aren't explicitly front-facing
      if (!selectedDevice) {
        selectedDevice = videoInputDevices.find(device => {
          const label = device.label.toLowerCase();
          return !label.includes('front') &&
                 !label.includes('user') &&
                 !label.includes('facetime');
        });
      }

      // Fallback to first available camera
      if (!selectedDevice) {
        selectedDevice = videoInputDevices[0];
      }

      console.log('UPC: Using camera:', selectedDevice.label);

      loadingState = 'scanning';
      scanningActive = true;

      // Start continuous scanning
      scannerControls = await codeReader.decodeFromVideoDevice(
        selectedDevice.deviceId,
        videoElement,
        (result, error) => {
          // Guard against processing multiple barcodes simultaneously
          if (result && !isProcessingBarcode && scanningActive) {
            console.log('UPC: Barcode detected:', result.getText());
            handleBarcodeDetected(result.getText());
          }

          if (error && !(error.name === 'NotFoundException')) {
            console.error('UPC: Scanning error:', error);
          }
        }
      );

      console.log('UPC: Scanner initialized successfully');

    } catch (err) {
      console.error('UPC: Failed to start scanner:', err);
      error = err.message || 'Failed to start camera scanner';
      scanningActive = false;
    } finally {
      if (loadingState === 'initializing') {
        isLoading = false;
        loadingState = '';
      }
    }
  }

  function stopScanning() {
    console.log('UPC: Stopping scanner...');

    // First, stop any new detections
    scanningActive = false;

    // Stop the scanner using the controls if available
    if (scannerControls) {
      try {
        scannerControls.stop();
        console.log('UPC: Scanner controls stopped');
      } catch (e) {
        console.warn('UPC: Error stopping scanner controls:', e);
      }
      scannerControls = null;
    }

    // Reset the code reader
    if (codeReader && typeof codeReader.reset === 'function') {
      try {
        codeReader.reset();
        console.log('UPC: Code reader reset');
      } catch (e) {
        console.warn('UPC: Error resetting code reader:', e);
      }
    } else if (codeReader) {
      console.log('UPC: Code reader exists but no reset method available');
    }
  }

  async function handleBarcodeDetected(code) {
    // Prevent multiple simultaneous processing
    if (isProcessingBarcode) {
      console.log('UPC: Already processing a barcode, ignoring:', code);
      return;
    }

    if (!FDCService.isValidUPCFormat(code)) {
      console.log('UPC: Invalid UPC format:', code);
      return; // Continue scanning for valid UPC
    }

    console.log('UPC: Valid barcode detected:', code);

    // Immediately set processing flag and stop scanning
    isProcessingBarcode = true;
    scannedCode = code;
    stopScanning();

    // Update UI state
    isLoading = true;
    loadingState = 'processing';

    try {
      console.log('UPC: Looking up product in USDA FDC...');
      productResult = await fdcService.searchByUPC(code);

      if (productResult) {
        console.log('UPC: Product found:', productResult.productName);
      } else {
        console.log('UPC: No product found for UPC:', code);
        error = `Product not found in USDA database for UPC: ${FDCService.formatUPC(code)}`;
      }

    } catch (err) {
      console.error('UPC: Product lookup failed:', err);
      error = err.message || 'Failed to lookup product information';
    } finally {
      isLoading = false;
      loadingState = '';
      isProcessingBarcode = false; // Reset processing flag
    }
  }

  function closeModal() {
    stopScanning();
    show = false;
    error = null;
    scannedCode = '';
    productResult = null;
    manualUPC = ''; // Clear manual input
    isLoading = false;
    loadingState = '';
    isProcessingBarcode = false; // Reset processing flag
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

  function handleUseProduct() {
    if (productResult) {
      dispatch('upcComplete', {
        method: 'UPC',
        source: 'UPC',
        productName: productResult.productName,
        brandOwner: productResult.brandOwner,
        brandName: productResult.brandName,

        // Clean final data for AddFoodModal (pre-processed by FDC)
        servingQuantity: productResult.finalServingQuantity,
        servingUnit: productResult.finalServingUnit,

        calcium: productResult.calcium,
        calciumValue: productResult.calciumValue,
        calciumPercentDV: productResult.calciumPercentDV,
        calciumFromPercentDV: productResult.calciumFromPercentDV,
        calciumPerServing: productResult.calciumPerServing,
        upcCode: productResult.upcCode,
        fdcId: productResult.fdcId,
        confidence: 'high',

        // Metadata for debugging/display
        servingDisplayText: productResult.servingDisplayText,
        servingSource: productResult.servingSource,
        rawData: productResult
      });
    }
    closeModal();
  }

  function retryScanning() {
    error = null;
    scannedCode = '';
    productResult = null;
    manualUPC = ''; // Clear manual input
    isProcessingBarcode = false; // Reset processing flag
    startScanning();
  }

  function skipToOCR() {
    dispatch('skipToOCR');
    closeModal();
  }

  async function handleManualUPC() {
    if (!manualUPC.trim()) {
      error = 'Please enter a UPC code';
      return;
    }

    // Validate UPC format
    if (!FDCService.isValidUPCFormat(manualUPC)) {
      error = 'Please enter a valid UPC code (8-14 digits)';
      return;
    }

    // Stop any active scanning
    stopScanning();

    // Use the same lookup logic as barcode detection
    console.log('UPC: Manual lookup for:', manualUPC);
    await handleBarcodeDetected(manualUPC);
  }

  function formatDebugJson() {
    if (!productResult || !productResult.rawData) return '';

    const raw = productResult.rawData;
    const formatted = {
      // Top level fields
      fdcId: raw.fdcId,
      description: raw.description,
      shortDescription: raw.shortDescription,
      brandOwner: raw.brandOwner,
      brandName: raw.brandName,
      brandSource: raw.brandSource,
      foodCategory: raw.foodCategory,
      ingredients: raw.ingredients,
      servingSize: raw.servingSize,
      servingSizeUnit: raw.servingSizeUnit,
      householdServingFullText: raw.householdServingFullText,
      packageWeight: raw.packageWeight,
      modifiedDate: raw.modifiedDate,
      publishedDate: raw.publishedDate,
      score: raw.score,
      labelNutrients: raw.labelNutrients,

      // Complete calcium nutrient data from foodNutrients array (nutrient 301) - all contents
      foodNutrients_calcium: raw.foodNutrients ? raw.foodNutrients.find(n => n.nutrientNumber === "301") : null,

      // Array counts for other fields
      foodNutrients_count: raw.foodNutrients ? raw.foodNutrients.length : 0,
      foodMeasures: raw.foodMeasures && raw.foodMeasures.length > 0 ? raw.foodMeasures : null,
      foodMeasures_count: raw.foodMeasures ? raw.foodMeasures.length : 0,
      foodAttributes_count: raw.foodAttributes ? raw.foodAttributes.length : 0,
      foodPortions_count: raw.foodPortions ? raw.foodPortions.length : 0
    };

    return JSON.stringify(formatted, null, 2);
  }

  // Auto-start scanning when modal opens
  $: if (show && !scanningActive && !isLoading && !productResult && !error) {
    startScanning();
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
          <button class="modal-back" on:click={closeModal}>
            <span class="material-icons">arrow_back</span>
          </button>
        </div>
        <div class="modal-header-center">
          <h2 class="modal-title">Scan Product Barcode</h2>
        </div>
      </div>

      <div class="modal-body">
        <!-- Instructions -->
        {#if !scannedCode && !isLoading && !error && !productResult}
          <div class="instructions">
            <div class="instruction-icon">
              <span class="material-icons">qr_code_scanner</span>
            </div>
            <h3>Scan UPC Barcode</h3>
            <p>Point your camera at the product's UPC barcode. We'll automatically look up nutrition information from the USDA database.</p>
          </div>
        {/if}

        <!-- Camera Video Element -->
        {#if !productResult}
          <div class="camera-section">
            <video
              bind:this={videoElement}
              class="camera-video"
              class:scanning={scanningActive}
              autoplay
              muted
              playsinline
            ></video>

            <!-- Scanning Overlay -->
            {#if scanningActive}
              <div class="scan-overlay">
                <div class="scan-frame"></div>
                <p class="scan-instruction">Position barcode within frame</p>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Manual UPC Input -->
        {#if !productResult}
          <div class="manual-input-section">
            <div class="manual-input-header">
              <span class="material-icons">keyboard</span>
              <span>Or enter UPC code manually</span>
            </div>
            <div class="manual-input-form">
              <input
                type="text"
                bind:value={manualUPC}
                placeholder="Enter UPC code (e.g., 751746033615)"
                class="manual-upc-input"
                maxlength="14"
                pattern="[0-9]*"
                inputmode="numeric"
                on:keypress={(e) => e.key === 'Enter' && handleManualUPC()}
              />
              <button
                class="manual-lookup-btn"
                on:click={handleManualUPC}
                disabled={isLoading}
              >
                <span class="material-icons">search</span>
                Lookup
              </button>
            </div>
          </div>
        {/if}

        <!-- Loading State -->
        {#if isLoading}
          <div class="loading-section">
            <div class="loading-spinner"></div>
            <p>
              {#if loadingState === 'initializing'}
                Starting camera...
              {:else if loadingState === 'scanning'}
                Ready to scan - point camera at barcode
              {:else if loadingState === 'processing'}
                Looking up product in USDA database...
              {:else}
                Processing...
              {/if}
            </p>
          </div>
        {/if}

        <!-- Scanned Code Display -->
        {#if scannedCode && !productResult && !error}
          <div class="scanned-code-section">
            <div class="scanned-code">
              <span class="material-icons">qr_code</span>
              <div>
                <p class="code-label">Scanned UPC:</p>
                <p class="code-value">{FDCService.formatUPC(scannedCode)}</p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Error State -->
        {#if error}
          <div class="error-section">
            <span class="material-icons">error</span>
            <p>{error}</p>
            <div class="error-actions">
              <button class="retry-btn" on:click={retryScanning}>
                <span class="material-icons">qr_code_scanner</span>
                Try Again
              </button>
              <button class="skip-btn" on:click={skipToOCR}>
                <span class="material-icons">camera_alt</span>
                Scan Label Instead
              </button>
            </div>
          </div>
        {/if}

        <!-- Product Results -->
        {#if productResult}
          <div class="results-section">
            <!-- Success Indicator -->
            <div class="success-indicator">
              <span class="material-icons">check_circle</span>
              <span>Product found in USDA database</span>
            </div>

            <!-- Product Information -->
            <div class="product-info">
              <table class="product-table">
                <tbody>
                  <tr>
                    <td class="label">Product Name</td>
                    <td class="value product-name">{productResult.productName}</td>
                  </tr>

                  {#if productResult.brandName}
                    <tr>
                      <td class="label">Brand</td>
                      <td class="value">{productResult.brandName}</td>
                    </tr>
                  {/if}

                  {#if productResult.servingDisplayText}
                    <tr>
                      <td class="label">Serving Size</td>
                      <td class="value serving-size-info">
                        {productResult.servingDisplayText}
                        {#if productResult.servingSource === 'enhanced'}
                          <br><span class="smart-serving-note">✓ Smart format: household measure + weight</span>
                        {/if}
                      </td>
                    </tr>
                  {/if}

                  {#if productResult.smartServing && productResult.smartServing.validation}
                    <tr>
                      <td class="label">Measure Validation</td>
                      <td class="value validation-info">
                        <span class="confidence-{productResult.smartServing.validation.confidence}">
                          {productResult.smartServing.validation.confidence} confidence
                        </span>
                        <br>
                        <span class="validation-details">
                          {productResult.smartServing.validation.reason}
                        </span>
                      </td>
                    </tr>
                  {/if}

                  {#if productResult.householdServingFullText && !productResult.smartServing?.isEnhanced}
                    <tr>
                      <td class="label">Household Serving</td>
                      <td class="value">{productResult.householdServingFullText}</td>
                    </tr>
                  {/if}

                  <tr>
                    <td class="label">Calcium Content</td>
                    <td class="value">
                      {#if productResult.calcium}
                        <span class="calcium-value">{productResult.calcium}</span>
                        {#if productResult.calciumPercentDV}
                          <span class="percent-dv">({productResult.calciumPercentDV}% DV)</span>
                        {/if}
                      {:else}
                        <span class="no-data">Not available in database</span>
                      {/if}
                    </td>
                  </tr>

                  {#if productResult.calciumFromPercentDV}
                    <tr>
                      <td class="label">Calcium from %DV Calc</td>
                      <td class="value">{productResult.calciumFromPercentDV} mg</td>
                    </tr>
                  {/if}

                  {#if productResult.calciumPerServing}
                    <tr>
                      <td class="label">Calcium per Serving</td>
                      <td class="value calcium-per-serving">{productResult.calciumPerServing} mg</td>
                    </tr>
                  {:else}
                    <tr>
                      <td class="label">Calcium per Serving</td>
                      <td class="value calculation-info">
                        <span class="calculation-note">Not calculated</span>
                        <br>
                        <span class="calculation-debug">
                          {#if productResult.calciumValue && productResult.servingCount && productResult.servingUnit}
                            Raw: {productResult.calciumValue}mg/100g × {productResult.servingCount}{productResult.servingUnit}
                            (calculation failed - check logs)
                          {:else}
                            {#if !productResult.calciumValue}Missing calcium data{/if}
                            {#if !productResult.servingCount}Missing serving size{/if}
                            {#if !productResult.servingUnit}Missing unit{/if}
                          {/if}
                        </span>
                      </td>
                    </tr>
                  {/if}

                  <tr>
                    <td class="label">UPC Code</td>
                    <td class="value upc-code">{FDCService.formatUPC(productResult.upcCode)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Debug JSON Section -->
            <div class="debug-section">
              <button
                class="debug-toggle"
                on:click={() => showDebugJson = !showDebugJson}
              >
                <span class="material-icons">
                  {showDebugJson ? 'expand_less' : 'expand_more'}
                </span>
                API Response Data
              </button>

              {#if showDebugJson}
                <div class="debug-content">
                  <textarea
                    class="debug-json"
                    readonly
                    value={formatDebugJson()}
                  ></textarea>
                </div>
              {/if}
            </div>

            <!-- Action Buttons -->
            <div class="result-actions">
              <button class="use-btn" on:click={handleUseProduct}>
                <span class="material-icons">check</span>
                Use This Product
              </button>
              <button class="scan-again-btn" on:click={retryScanning}>
                <span class="material-icons">qr_code_scanner</span>
                Scan Different Product
              </button>
            </div>
          </div>
        {/if}

        <!-- Skip Option (always available) -->
        {#if !productResult && !error}
          <div class="skip-section">
            <button class="skip-link" on:click={skipToOCR}>
              Can't find barcode? Try scanning the nutrition label instead
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

  .instructions {
    text-align: center;
    padding: 1.5rem 0;
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

  /* Manual UPC Input */
  .manual-input-section {
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--surface-secondary);
    border-radius: 0.5rem;
    border: 1px solid var(--border);
  }

  .manual-input-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .manual-input-header .material-icons {
    font-size: 1.2rem;
    color: var(--text-hint);
  }

  .manual-input-form {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  @media (max-width: 480px) {
    .manual-input-form {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .manual-lookup-btn {
      width: 100%;
      justify-content: center;
    }
  }

  .manual-upc-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    background: var(--surface);
    color: var(--text-primary);
    font-size: var(--font-size-base);
    font-family: monospace;
  }

  .manual-upc-input::placeholder {
    color: var(--text-hint);
    font-family: inherit;
  }

  .manual-upc-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-alpha-20);
  }

  .manual-lookup-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .manual-lookup-btn:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  .manual-lookup-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .manual-lookup-btn .material-icons {
    font-size: 1.1rem;
  }

  .camera-section {
    position: relative;
    background: #000;
    border-radius: 0.5rem;
    overflow: hidden;
    min-height: 300px;
  }

  .camera-video {
    width: 100%;
    height: auto;
    min-height: 300px;
    object-fit: cover;
    display: block;
  }

  .camera-video.scanning {
    filter: brightness(1.1) contrast(1.1);
  }

  .scan-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .scan-frame {
    width: 200px;
    height: 120px;
    border: 3px solid #fff;
    border-radius: 0.5rem;
    position: relative;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  }

  .scan-frame::before,
  .scan-frame::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border: 3px solid var(--primary-color);
  }

  .scan-frame::before {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
  }

  .scan-frame::after {
    bottom: -3px;
    right: -3px;
    border-left: none;
    border-top: none;
  }

  .scan-instruction {
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    margin-top: 1rem;
    font-size: var(--font-size-sm);
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
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .scanned-code-section {
    display: flex;
    justify-content: center;
  }

  .scanned-code {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--surface-variant);
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--divider);
  }

  .scanned-code .material-icons {
    font-size: 2rem;
    color: var(--primary-color);
  }

  .code-label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin: 0 0 0.25rem 0;
  }

  .code-value {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    font-family: monospace;
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

  .retry-btn, .skip-btn {
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
    font-size: var(--font-size-sm);
  }

  .skip-btn {
    background: var(--text-secondary);
  }

  .results-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .success-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--success-alpha-10);
    color: var(--success-color);
    border-radius: 0.25rem;
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  .product-info {
    margin-bottom: 1rem;
  }

  .product-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }

  .product-table td {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }

  .product-table .label {
    font-weight: 500;
    color: var(--text-primary);
    width: 40%;
    text-align: left;
  }

  .product-table .value {
    color: var(--text-secondary);
    width: 60%;
    text-align: left;
  }

  .product-table .product-name {
    font-weight: 600;
    color: var(--text-primary) !important;
  }

  .product-table .calcium-value {
    font-weight: 600;
    color: var(--primary-color) !important;
  }

  .product-table .calcium-per-serving {
    font-weight: 600;
    color: var(--success-color) !important;
  }

  .product-table .percent-dv {
    color: var(--text-hint);
    margin-left: 0.5rem;
  }

  .product-table .no-data {
    font-style: italic;
    color: var(--text-hint) !important;
  }

  .product-table .upc-code {
    font-family: monospace;
    font-weight: 600;
    color: var(--text-primary) !important;
  }

  .product-table .calculation-info {
    color: var(--text-hint) !important;
  }

  .product-table .calculation-note {
    font-style: italic;
    color: var(--text-hint);
  }

  .product-table .calculation-debug {
    font-size: 0.8rem;
    color: var(--text-hint);
    font-family: monospace;
    line-height: 1.3;
  }

  /* Smart serving size styles */
  .smart-serving-note {
    font-size: 0.8rem;
    color: var(--success);
    font-style: italic;
  }

  .validation-info {
    font-size: 0.9rem;
  }

  .confidence-high {
    color: var(--success);
    font-weight: 500;
  }

  .confidence-medium {
    color: var(--warning);
    font-weight: 500;
  }

  .confidence-low,
  .confidence-very-low {
    color: var(--error);
    font-weight: 500;
  }

  .validation-details {
    font-size: 0.8rem;
    color: var(--text-hint);
    font-family: monospace;
  }

  .result-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .use-btn {
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

  .use-btn:hover {
    background: var(--primary-color-dark);
  }

  .scan-again-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--surface);
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 0.75rem var(--spacing-lg);
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 500;
    font-size: var(--font-size-base);
    transition: all 0.2s;
    width: 100%;
  }

  .scan-again-btn:hover {
    background: var(--primary-alpha-10);
  }

  .skip-section {
    text-align: center;
    margin-top: 1rem;
  }

  .skip-link {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: var(--font-size-sm);
    text-decoration: underline;
    padding: 0.5rem;
  }

  .skip-link:hover {
    color: var(--text-primary);
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .modal-content {
      max-width: 100vw;
      max-height: 95vh;
      border-radius: 0.25rem;
      margin: 0.5rem;
    }

    .modal-body {
      max-height: calc(95vh - 120px);
      overflow-y: auto;
    }

    .error-actions {
      flex-direction: column;
    }

    .error-actions button {
      width: 100%;
      justify-content: center;
    }

    .scan-frame {
      width: 180px;
      height: 100px;
    }
  }

  /* Debug Section */
  .debug-section {
    margin-top: 1rem;
    border-top: 1px solid var(--border);
    padding-top: 1rem;
  }

  .debug-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: var(--surface-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .debug-toggle:hover {
    background: var(--surface-hover);
  }

  .debug-toggle .material-icons {
    font-size: 1.2rem;
  }

  .debug-content {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .debug-json {
    width: 100%;
    min-height: 200px;
    padding: 0.5rem;
    background: var(--code-background, var(--surface-secondary));
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.8rem;
    line-height: 1.4;
    resize: vertical;
  }
</style>
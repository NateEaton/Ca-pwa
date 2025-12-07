// src/lib/components/TestDataCollector.svelte
// Add to SmartScanModal or create separate dev-only component

<script>
  import { onMount } from 'svelte';
  import { logger } from '$lib/utils/logger';

  // Only show in dev mode or with special URL flag
  let isTestMode = false;

  onMount(() => {
    isTestMode = import.meta.env.DEV ||
                 window.location.search.includes('testmode=1');
  });

  let upcScanResult = null;
  let ocrScanResult = null;
  let capturedImage = null;
  let status = 'ready'; // 'ready' | 'waiting-upc' | 'waiting-ocr' | 'complete'

  // Expose methods to parent component
  export function handleUPCScan(event) {
    const data = event.detail;

    // Store the OFF metadata (ground truth)
    upcScanResult = {
      upc: data.upc || data.code,
      product_name: data.product_name,
      brands: data.brands,
      serving_size: data.serving_size,
      calcium_per_serving: data.nutrients?.calcium_serving,
      calcium_per_100g: data.nutrients?.calcium_100g,
      calcium_unit: data.nutrients?.calcium_unit,
      source: 'openfoodfacts'
    };

    status = 'waiting-ocr';
    logger.debug('TEST DATA', 'TestDataCollector: UPC captured!', upcScanResult.product_name);
  }

  // Expose methods to parent component
  export function handleOCRScan(event) {
    const data = event.detail;

    // Store OCR results in lean format
    ocrScanResult = {
      rawText: data.rawText,
      words: data.spatialResults?.map(el => ({
        t: el.text,
        x: el.x,
        y: el.y,
        w: el.width,
        h: el.height
      })) || []
    };

    // Capture the image blob if available
    if (data.imageBlob) {
      capturedImage = data.imageBlob;
    }

    status = 'complete';
    logger.debug('TEST DATA', 'TestDataCollector: OCR captured!', ocrScanResult.words.length, 'words');
  }

  // Step 3: Download test data package
  async function downloadTestData() {
    if (!upcScanResult || !ocrScanResult) {
      alert('Missing data - please scan both UPC and label');
      return;
    }

    const upc = upcScanResult.upc;

    // Create metadata JSON with source tracking
    const metadata = {
      upc: upc,
      product_name: upcScanResult.product_name,
      brands: upcScanResult.brands,
      serving_size: upcScanResult.serving_size,
      calcium: {
        per_serving: upcScanResult.calcium_per_serving,
        per_100g: upcScanResult.calcium_per_100g,
        unit: upcScanResult.calcium_unit
      },
      source: 'app_capture',
      priority: 'high',
      collection_method: {
        type: 'pwa',
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        device_pixel_ratio: window.devicePixelRatio,
        platform: navigator.platform
      },
      source_url: `https://world.openfoodfacts.org/product/${upc}`,
      captured_at: new Date().toISOString()
    };

    // Create OCR JSON
    const ocrData = {
      upc: upc,
      timestamp: new Date().toISOString(),
      ...ocrScanResult
    };

    // Download metadata
    downloadJSON(metadata, `${upc}_metadata.json`);

    // Download OCR data
    downloadJSON(ocrData, `${upc}_ocr.json`);

    // Download image if available
    if (capturedImage) {
      downloadBlob(capturedImage, `${upc}_nutrition.jpg`, 'image/jpeg');
    }

    // Reset for next capture
    reset();
  }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    downloadBlob(blob, filename, 'application/json');
  }

  function downloadBlob(blob, filename, type) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    upcScanResult = null;
    ocrScanResult = null;
    capturedImage = null;
    status = 'ready';
  }
</script>

{#if isTestMode}
<div class="test-collector">
  <div class="test-header">
    <h3>🧪 Test Data Collector</h3>
    <span class="status-badge" class:active={status !== 'ready'}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  </div>

  <div class="test-content">
    {#if status === 'ready'}
      <p>Scan a UPC barcode to begin collecting test data</p>
    {:else if status === 'waiting-upc'}
      <p>✓ UPC captured: {upcScanResult?.product_name}</p>
      <p>Now scan the nutrition label...</p>
    {:else if status === 'waiting-ocr'}
      <p>✓ UPC: {upcScanResult?.product_name}</p>
      <p>Waiting for nutrition label scan...</p>
    {:else if status === 'complete'}
      <div class="complete-state">
        <p>✓ UPC: {upcScanResult?.product_name}</p>
        <p>✓ Label scanned ({ocrScanResult.words.length} words)</p>
        <button on:click={downloadTestData} class="download-btn">
          📥 Download Test Data
        </button>
        <button on:click={reset} class="reset-btn">
          🔄 Start New
        </button>
      </div>
    {/if}
  </div>
</div>
{/if}

<style>
  .test-collector {
    position: fixed;
    top: 10px;
    right: 10px;
    left: 60px;
    background: rgba(255, 243, 205, 0.95);
    border: 2px solid #ffc107;
    border-radius: 8px;
    padding: 8px 12px;
    max-width: 320px;
    margin-left: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10001;
  }

  .test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .test-header h3 {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
  }

  .status-badge {
    font-size: 9px;
    padding: 3px 6px;
    background: #6c757d;
    color: white;
    border-radius: 4px;
  }

  .status-badge.active {
    background: #28a745;
  }

  .test-content p {
    margin: 6px 0;
    font-size: 11px;
    line-height: 1.3;
  }

  .complete-state {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .download-btn, .reset-btn {
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
  }

  .download-btn {
    background: #007bff;
    color: white;
  }

  .reset-btn {
    background: #6c757d;
    color: white;
  }
</style>

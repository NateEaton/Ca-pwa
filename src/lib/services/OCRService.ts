// Enhanced OCRService.ts with targeted fixes for test image failures
// Merges proven features from pre-batch test version

import { ImageResizer } from '$lib/utils/imageResize.ts';
import { logger } from '$lib/utils/logger';

interface TextElement {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lineIndex?: number; // Track which API Line this element came from
  wordIndex?: number; // Track position within the original Line
}

interface TextLine {
  text: string;
  elements: TextElement[];
  y: number;
  height: number;
}

interface TableColumn {
  x: number;
  width: number;
  type: 'label' | 'value' | 'unit' | 'percent';
}

interface NutrientRow {
  y: number;
  height: number;
  elements: TextElement[];
  nutrient?: string;
  value?: number;
  unit?: string;
  percent?: number;
}

interface ParseStrategy {
  name: string;
  priority: number;
  parser: (textElements: TextElement[], rawText: string, result: NutritionParseResult) => boolean;
}

interface ServingInfo {
  quantity: number;
  measure: string;
  standardValue?: number;
  standardUnit?: string;
}

interface OCRResponse {
  ParsedResults: Array<{
    ParsedText: string;
    ErrorMessage: string;
    ErrorDetails: string;
    TextOverlay?: {
      HasOverlay: boolean;
      Lines: any[];
    };
  }>;
  IsErroredOnProcessing: boolean;
}

interface NutritionParseResult {
  rawText: string;
  servingQuantity: number | null;
  servingMeasure: string | null;
  standardMeasureValue: number | null;
  standardMeasureUnit: string | null;
  calcium: number | null;
  confidence: 'low' | 'medium' | 'high';
  servingSize?: string;
  calciumValue?: number;
  spatialResults?: TextElement[];
  fullApiResponse?: OCRResponse;
  imageBlob?: Blob;
}

export class OCRService {
  private apiKey: string;
  private apiEndpoint: string;
  private readonly CALCIUM_DV_MG = 1300;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = 'https://api.ocr.space/parse/image';
  }

  async processImage(file: File, captureImage: boolean = false, timeoutMs?: number): Promise<NutritionParseResult> {
    try {
      logger.debug('OCR', 'Starting OCR processing for file:', file.name, 'size:', file.size);

      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (!this.apiKey || this.apiKey === 'YOUR_OCR_SPACE_KEY') {
        throw new Error('OCR API key not configured');
      }

      // Compress if needed
      let processedFile: File = file;
      if (file.size > 1024 * 1024) {
        logger.debug('OCR', 'Image size exceeds 1MB, compressing...', 'original:', file.size);
        processedFile = await ImageResizer.compressWithFallback(file, 1024 * 1024, 3);
        logger.debug('OCR', 'Compressed size:', processedFile.size);
      }

      // Capture image blob when requested (for test data collection)
      // NOTE: We need to clone the file before reading it, otherwise FormData will fail
      let imageBlob: Blob | undefined;
      if (captureImage) {
        // Create a new blob from the file without consuming the original
        const arrayBuffer = await processedFile.arrayBuffer();
        imageBlob = new Blob([arrayBuffer], { type: processedFile.type });
        // Recreate the file for FormData since we consumed the original
        processedFile = new File([arrayBuffer], processedFile.name, { type: processedFile.type });
      }

      const formData = new FormData();
      formData.append('apikey', this.apiKey);
      formData.append('language', 'eng');
      formData.append('file', processedFile);
      formData.append('isTable', 'true');
      formData.append('isOverlayRequired', 'true');
      formData.append('iscreatesearchablepdf', 'false');

      logger.debug('OCR API', 'Sending request to OCR.space API...');

      // Create fetch promise with optional timeout
      const fetchPromise = fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      let response: Response;
      if (timeoutMs) {
        logger.debug('OCR API', 'Using timeout:', timeoutMs, 'ms');
        // Race fetch against timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('OCR_TIMEOUT')), timeoutMs);
        });
        response = await Promise.race([fetchPromise, timeoutPromise]);
      } else {
        response = await fetchPromise;
      }

      if (!response.ok) {
        throw new Error(`OCR API error: ${response.status}`);
      }

      logger.debug('OCR API', 'API response received, status:', response.status);
      const result: OCRResponse = await response.json();
      
      if (!result || result.IsErroredOnProcessing) {
        throw new Error(`OCR processing failed: ${result?.ErrorMessage || 'Unknown error'}`);
      }

      if (!result.ParsedResults || result.ParsedResults.length === 0) {
        throw new Error('No text detected in image');
      }

      const parsedResult = result.ParsedResults[0];
      const rawText = parsedResult.ParsedText;
      const overlay = parsedResult.TextOverlay;

      logger.debug('OCR', 'Raw text length:', rawText.length);
      logger.debug('OCR', 'Has overlay data:', overlay?.HasOverlay ? 'yes' : 'no');

      // Use enhanced parsing with multiple strategies
      if (overlay?.HasOverlay && overlay.Lines) {
        logger.debug('OCR', 'Using enhanced multi-strategy parsing with', overlay.Lines.length, 'lines');
        const parseResult = this.parseWithMultipleStrategies(rawText, overlay.Lines, result);
        // Add captured image blob to result if available
        if (captureImage && imageBlob) {
          parseResult.imageBlob = imageBlob;
        }
        return parseResult;
      } else {
        logger.debug('OCR', 'Using fallback text-only parsing');
        const parseResult = this.parseNutritionDataFallback(rawText, result);
        // Add captured image blob to result if available
        if (captureImage && imageBlob) {
          parseResult.imageBlob = imageBlob;
        }
        return parseResult;
      }

    } catch (error) {
      console.error('OCR processing failed:', error);
      throw error;
    }
  }

  // Add this public method to OCRService class (after processImage, before parseWithMultipleStrategies)

  /**
   * Parse nutrition data from cached OCR results (for batch testing)
   * Bypasses image processing and API calls - only executes parsing logic
   *
   * @param cachedData Pre-captured OCR data with rawText and words array
   * @returns Parsed nutrition result using same logic as live OCR
   */
  public parseFromCachedOCR(cachedData: {
    rawText: string;
    words: Array<{t: string; x: number; y: number; w: number; h: number}>;
  }): NutritionParseResult {

    // Reconstruct Lines structure from cached words
    const lines = this.reconstructLinesFromWords(cachedData.words);

    // Create minimal API response structure for parseWithMultipleStrategies
    const mockResponse: OCRResponse = {
      ParsedResults: [{
        ParsedText: cachedData.rawText,
        ErrorMessage: '',
        ErrorDetails: '',
        TextOverlay: {
          HasOverlay: true,
          Lines: lines
        }
      }],
      IsErroredOnProcessing: false
    };

    // Use existing parsing logic
    return this.parseWithMultipleStrategies(
      cachedData.rawText,
      lines,
      mockResponse
    );
  }

  /**
   * Parse nutrition data from full OCR.space API response (for batch testing)
   * Uses the complete API response structure including pre-grouped Lines with LineText
   * This is the preferred method for testing as it matches the live app data flow exactly
   *
   * @param apiResponse Full OCR.space API response with Lines structure intact
   * @returns Parsed nutrition result using same logic as live OCR
   */
  public parseFromFullAPIResponse(apiResponse: OCRResponse): NutritionParseResult {
    logger.debug('OCR PARSE', 'Parsing from full API response');

    const rawText = apiResponse.ParsedResults[0].ParsedText;
    const lines = apiResponse.ParsedResults[0].TextOverlay?.Lines || [];

    logger.debug('OCR PARSE', 'Using', lines.length, 'pre-grouped lines from API');

    // Use existing parsing logic with full API structure
    return this.parseWithMultipleStrategies(rawText, lines, apiResponse);
  }

  /**
   * Reconstruct OCR.space API Lines format from cached word array
   * Groups words into lines based on Y-coordinate proximity
   * 
   * @param words Array of word objects with text and coordinates
   * @returns Array of Line objects in OCR.space API format
   */
  private reconstructLinesFromWords(
    words: Array<{t: string; x: number; y: number; w: number; h: number}>
  ): any[] {
    // Group words by Y coordinate (lines)
    const lineMap = new Map<number, typeof words>();
    const yTolerance = 15; // Same tolerance as in original run_tests.js
    
    for (const word of words) {
      let foundLine = false;
      
      // Try to find existing line within tolerance
      for (const [lineY, lineWords] of lineMap.entries()) {
        if (Math.abs(word.y - lineY) <= yTolerance) {
          lineWords.push(word);
          foundLine = true;
          break;
        }
      }
      
      // Create new line if no match found
      if (!foundLine) {
        lineMap.set(word.y, [word]);
      }
    }
    
    // Convert to OCR.space API Lines format
    const lines = [];
    for (const [y, lineWords] of lineMap.entries()) {
      // Sort words left to right
      lineWords.sort((a, b) => a.x - b.x);
      
      // Calculate line properties
      const minTop = Math.min(...lineWords.map(w => w.y));
      const maxHeight = Math.max(...lineWords.map(w => w.h));
      const lineText = lineWords.map(w => w.t).join(' ');
      
      lines.push({
        LineText: lineText,
        MinTop: minTop,
        MaxHeight: maxHeight,
        Words: lineWords.map(w => ({
          WordText: w.t,
          Left: w.x,
          Top: w.y,
          Width: w.w,
          Height: w.h
        }))
      });
    }
    
    // Sort lines top to bottom
    lines.sort((a, b) => a.MinTop - b.MinTop);
    
    return lines;
  }  

  /**
   * NEW IMPLEMENTATION: Simple 3-layer waterfall parsing
   * Replaces the old strategy-based approach with clear sequential execution
   */
  private parseWithMultipleStrategies(rawText: string, lines: any[], apiResponse: OCRResponse): NutritionParseResult {
    logger.debug('OCR PARSE', 'Starting enhanced multi-strategy processing...');

    // Normalize OCR text to fix common mistakes BEFORE any parsing
    const normalizedText = this.normalizeOCRText(rawText);

    // Extract and preprocess spatial elements
    const textElements: TextElement[] = this.extractTextElements(lines);
    logger.debug('OCR PARSE', 'Extracted', textElements.length, 'text elements from lines');

    textElements.forEach(el => {
      el.text = this.preprocessSpatialText(el);
      el.text = this.normalizeOCRText(el.text); // Also normalize spatial text
    });

    const preprocessedText = this.preprocessText(normalizedText);

    // Initialize result
    const result: NutritionParseResult = {
      rawText: rawText,
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null,
      confidence: 'low',
      spatialResults: textElements,
      fullApiResponse: apiResponse
    };

    // LAYER 1: Spatial Structure Parsing
    logger.debug('OCR PARSE', '=== LAYER 1: Spatial Structure Parsing ===');
    const spatialResult = this.spatialParse(textElements, preprocessedText);
    Object.assign(result, spatialResult);
    logger.debug('OCR PARSE', 'Layer 1 results - serving:', result.servingQuantity, result.servingMeasure, 'calcium:', result.calcium);

    const afterLayer1 = this.isComplete(result);
    logger.debug('OCR PARSE', 'Layer 1 complete?', afterLayer1);

    // LAYER 2: Text Pattern Matching (fill gaps)
    if (!afterLayer1) {
      logger.debug('OCR PARSE', '=== LAYER 2: Text Pattern Matching ===');
      this.regexParse(preprocessedText, result);
      logger.debug('OCR PARSE', 'Layer 2 results - serving:', result.servingQuantity, result.servingMeasure, 'calcium:', result.calcium);

      const afterLayer2 = this.isComplete(result);
      logger.debug('OCR PARSE', 'Layer 2 complete?', afterLayer2);
    }

    // LAYER 3: Fuzzy Recovery (last resort)
    if (!this.isComplete(result)) {
      logger.debug('OCR PARSE', '=== LAYER 3: Fuzzy Recovery ===');
      this.fuzzyParse(textElements, preprocessedText, result);
      logger.debug('OCR PARSE', 'Layer 3 results - serving:', result.servingQuantity, result.servingMeasure, 'calcium:', result.calcium);
    }

    // Calculate confidence and finalize
    result.confidence = this.calculateConfidence(result);
    result.servingSize = this.buildLegacyServingSize(result);
    result.calciumValue = result.calcium;

    logger.debug('OCR PARSE', 'Final result - confidence:', result.confidence, 'serving:', result.servingSize, 'calcium:', result.calcium);

    return result;
  }

  /**
   * Build legacy servingSize string for backward compatibility
   */
  private buildLegacyServingSize(result: NutritionParseResult): string | undefined {
    if (!result.servingQuantity || !result.servingMeasure) {
      return undefined;
    }

    let serving = `${result.servingQuantity} ${result.servingMeasure}`;

    if (result.standardMeasureValue && result.standardMeasureUnit) {
      serving += ` (${result.standardMeasureValue}${result.standardMeasureUnit})`;
    }

    return serving;
  }

  private extractTextElements(lines: any[]): TextElement[] {
    const elements: TextElement[] = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      if (line.Words && line.Words.length > 0) {
        for (let wordIndex = 0; wordIndex < line.Words.length; wordIndex++) {
          const word = line.Words[wordIndex];
          elements.push({
            text: word.WordText,
            x: word.Left,
            y: word.Top,
            width: word.Width,
            height: word.Height,
            lineIndex: lineIndex,      // Preserve original line
            wordIndex: wordIndex        // Preserve position within line
          });
        }
      }
    }

    return elements;
  }

  private preprocessText(text: string): string {
    let cleaned = text;
    
    // Common OCR character substitutions
    const charMappings: [RegExp, string][] = [
      [/Sewing/gi, 'Serving'],
      [/\brnL\b/gi, 'mL'],
      [/\bfog\b/gi, 'mg'],
      [/\blg\b/gi, 'g'],
      [/\bOg\b/gi, '0g'],
      [/\bOmg\b/gi, '0mg'],
      [/\b0mg\b/gi, '0mg'],
      [/\bDmg\b/gi, '0mg'],
      [/\bCholest[^\s]*\b/gi, 'Cholesterol'],
      [/\bVitamin\s*D/gi, 'Vitamin D'],
      [/\bCalcium/gi, 'Calcium'],
      [/\bPotassium/gi, 'Potassium'],
    ];
    
    for (const [pattern, replacement] of charMappings) {
      cleaned = cleaned.replace(pattern, replacement);
    }
    
    // Normalize whitespace
    cleaned = cleaned.replace(/\t+/g, ' ').replace(/ +/g, ' ').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    
    return cleaned;
  }

  private preprocessSpatialText(element: TextElement): string {
    let text = element.text;
    
    // Enhanced spatial-specific OCR corrections
    const spatialMappings: [RegExp, string][] = [
      // NEW: Fix "ttbsp" misread
      [/^ttbsp$/i, '2 tbsp'],
      [/^ltbsp$/i, '1 tbsp'],
      
      // Fraction patterns
      [/^1I2$/i, '1/2'],
      [/^112$/i, '1/2'],
      [/^l\/2$/i, '1/2'],
      [/^I\/2$/i, '1/2'],
      [/^2I3$|^213$/i, '2/3'],
      [/^1I3$|^113$/i, '1/3'],
      [/^1I4$|^114$/i, '1/4'],
      [/^3I4$|^314$/i, '3/4'],
      
      // Unit corrections
      [/^(\d+(?:\.\d+)?)rng$/i, '$1mg'],
      [/^(\d+(?:\.\d+)?)fog$/i, '$1mg'],
      [/^(\d+(?:\.\d+)?)rnL$/i, '$1mL'],
      [/^(\d+(?:\.\d+)?)mL$/i, '$1mL'],
      [/^(\d+(?:\.\d+)?)ml$/i, '$1mL'],
      
      // Common OCR character fixes
      [/^O([a-zA-Z])$/i, '0$1'],
      [/^l([a-zA-Z])$/i, '1$1'],
    ];
    
    for (const [pattern, replacement] of spatialMappings) {
      text = text.replace(pattern, replacement);
    }
    
    return text;
  }

  private detectTableStructure(textElements: TextElement[]): { columns: TableColumn[]; rows: NutrientRow[] } {
    // Group elements by Y coordinate (rows)
    const rowGroups = new Map<number, TextElement[]>();
    const yTolerance = 10;
    
    for (const element of textElements) {
      let foundRow = false;
      for (const [rowY, elements] of rowGroups.entries()) {
        if (Math.abs(element.y - rowY) <= yTolerance) {
          elements.push(element);
          foundRow = true;
          break;
        }
      }
      if (!foundRow) {
        rowGroups.set(element.y, [element]);
      }
    }
    
    // Analyze X positions to identify columns
    const xPositions = textElements.map(e => e.x).sort((a, b) => a - b);
    const columns = this.identifyColumns(xPositions);
    
    // Build structured rows
    const rows: NutrientRow[] = [];
    for (const [y, elements] of rowGroups.entries()) {
      const sortedElements = elements.sort((a, b) => a.x - b.x);
      rows.push({
        y,
        height: Math.max(...elements.map(e => e.height)),
        elements: sortedElements
      });
    }
    
    return { columns, rows };
  }

  private identifyColumns(xPositions: number[]): TableColumn[] {
    // Cluster X positions to identify column boundaries
    // Reduced tolerance from 50 to 35 to better distinguish multi-column tables
    const clusterTolerance = 35;

    // Sort X positions first to improve clustering
    const sortedX = [...xPositions].sort((a, b) => a - b);
    const clusters: number[][] = [];

    for (const x of sortedX) {
      let foundCluster = false;
      for (const cluster of clusters) {
        // Check against cluster center to avoid chain-linking
        const clusterCenter = cluster.reduce((sum, cx) => sum + cx, 0) / cluster.length;
        if (Math.abs(clusterCenter - x) <= clusterTolerance) {
          cluster.push(x);
          foundCluster = true;
          break;
        }
      }
      if (!foundCluster) {
        clusters.push([x]);
      }
    }

    // Convert clusters to column definitions
    const columns: TableColumn[] = clusters.map((cluster, index) => {
      const avgX = cluster.reduce((sum, x) => sum + x, 0) / cluster.length;
      return {
        x: avgX,
        width: Math.max(...cluster) - Math.min(...cluster) + 50,
        type: index === 0 ? 'label' :
              index === 1 ? 'value' :
              index === 2 ? 'unit' : 'percent'
      };
    }).sort((a, b) => a.x - b.x);

    return columns;
  }

  private fuzzyMatch(text: string, target: string, threshold: number = 0.6): boolean {
    const distance = this.levenshteinDistance(text, target);
    const similarity = 1 - distance / Math.max(text.length, target.length);
    return similarity >= threshold;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }

  // ============================================================================
  // CENTRALIZED PARSERS (3-Layer Architecture)
  // ============================================================================

  /**
   * Centralized calcium parser - handles ALL calcium parsing patterns
   * Works with both raw text and spatial elements
   *
   * @param text - Raw text to parse (preprocessed)
   * @param elements - Optional spatial elements for coordinate-based parsing
   * @returns Calcium value in mg, or null if not found
   */
  private parseCalcium(text: string, elements?: TextElement[]): number | null {
    logger.debug('OCR PARSE', 'Parsing calcium from text and elements...');

    // Priority 1: Direct mg values from spatial elements (if available)
    if (elements && elements.length > 0) {
      const mgValue = this.parseCalciumFromSpatialElements(elements);
      if (mgValue !== null) {
        logger.debug('OCR PARSE', 'Found calcium from spatial elements:', mgValue, 'mg');
        return mgValue;
      }
    }

    // Priority 2: Pattern matching on text
    const textValue = this.parseCalciumFromText(text);
    if (textValue !== null) {
      logger.debug('OCR PARSE', 'Found calcium from text patterns:', textValue, 'mg');
      return textValue;
    }

    logger.debug('OCR PARSE', 'No calcium value found');
    return null;
  }

  /**
   * Parse calcium from spatial elements using coordinate-based logic
   */
  private parseCalciumFromSpatialElements(elements: TextElement[]): number | null {
    logger.debug('OCR PARSE', 'Parsing calcium from spatial elements, count:', elements.length);

    // Format 1: Direct mg value (highest confidence)
    // Example: "390mg", "320mg", "60mg", "21 mg" (with optional space), "Omg" (OCR error for 0mg)
    // Also match unit typos: "mv", "mq"
    const mgElements = elements.filter(el => /^\d+\s*m[gqv]$|^Omg$/i.test(el.text.trim()));
    logger.debug('OCR PARSE', 'Found', mgElements.length, 'mg elements');

    // Find calcium label for spatial reference (with fuzzy matching)
    // Matches: "calcium", "caloum", "caburn", "calclum", etc.
    const calciumLabel = elements.find(el =>
      /\bca[bl][ou]rn(?![a-z])/i.test(el.text) ||  // caburn, caourn
      /\bcal[o0]um(?![a-z])/i.test(el.text) ||     // caloum, cal0um
      /\bcalc?[l1i]um(?![a-z])/i.test(el.text)     // calcium, calclum, callum
    );

    if (calciumLabel) {
      logger.debug('OCR PARSE', 'Found calcium label:', calciumLabel.text, 'at position x:', calciumLabel.x, 'y:', calciumLabel.y);
      // Filter mg elements by spatial proximity to calcium label
      const nearbyMgElements = mgElements.filter(mgEl => {
        const yDistance = Math.abs(mgEl.y - calciumLabel.y);
        const xDistance = mgEl.x - calciumLabel.x;

        return (
          yDistance < 20 &&           // Same line tolerance
          xDistance > 0 &&            // Must be to the right of label
          xDistance < 400             // Max distance for primary column (increased from 250 to handle wider layouts)
        );
      });

      // Sort by X distance (closest first) to get primary column value
      nearbyMgElements.sort((a, b) => {
        const distA = a.x - calciumLabel.x;
        const distB = b.x - calciumLabel.x;
        return distA - distB;
      });

      logger.debug('OCR PARSE', 'Found', nearbyMgElements.length, 'nearby mg elements');

      // Use the closest mg value (primary column)
      if (nearbyMgElements.length > 0) {
        const elementText = nearbyMgElements[0].text.trim();
        logger.debug('OCR PARSE', 'Closest mg element:', elementText);

        // Handle "Omg" as OCR error for "0mg"
        let mgValue: number;
        if (/^Omg$/i.test(elementText)) {
          mgValue = 0;
        } else {
          mgValue = parseInt(elementText.replace(/[^\d]/g, ''));
        }

        if (this.isValidCalciumValue(mgValue)) {
          logger.debug('OCR PARSE', 'Valid calcium value from spatial (Format 1):', mgValue, 'mg');
          return mgValue;
        }
      }
    }

    // Format 2: Compact inline format (mg stuck to percentage)
    // Example: "320mg25%", "390mg30%"
    const compactElements = elements.filter(el =>
      /^\d+mg\d+%$/i.test(el.text.trim())
    );

    if (compactElements.length > 0) {
      logger.debug('OCR PARSE', 'Found', compactElements.length, 'compact inline calcium elements');
    }

    for (const compactEl of compactElements) {
      const match = compactEl.text.match(/^(\d+)mg/i);
      if (match) {
        const mgValue = parseInt(match[1]);
        if (this.isValidCalciumValue(mgValue)) {
          logger.debug('OCR PARSE', 'Valid calcium value from spatial (Format 2 - compact):', mgValue, 'mg');
          return mgValue;
        }
      }
    }

    // Format 3: Percentage to mg conversion
    // Example: "25%" near "Calcium" (convert assuming 1300mg = 100%)
    // Use fuzzy matching for calcium keyword
    const calciumElements = elements.filter(el =>
      /\bca[bl][ou]rn(?![a-z])/i.test(el.text) ||  // caburn, caourn
      /\bcal[o0]um(?![a-z])/i.test(el.text) ||     // caloum, cal0um
      /\bcalc?[l1i]um(?![a-z])/i.test(el.text)     // calcium, calclum, callum
    );

    for (const calciumEl of calciumElements) {
      // Skip percentage conversion if there's a nearby mg value (explicit value takes precedence)
      const nearbyMg = mgElements.find(mgEl =>
        Math.abs(mgEl.y - calciumEl.y) < 20 &&
        mgEl.x > calciumEl.x
      );

      // Also check if the calcium element itself contains an mg value
      const hasMgInElement = /\d+\s*m[gqv]/i.test(calciumEl.text);

      if (nearbyMg || hasMgInElement) {
        // Don't use percentage if explicit mg value exists nearby or in same element
        continue;
      }

      // Find nearby percentage
      const nearbyPercent = elements.find(el =>
        /^\d+%$/i.test(el.text.trim()) &&
        Math.abs(el.y - calciumEl.y) < 20 &&
        el.x > calciumEl.x // Usually to the right
      );

      if (nearbyPercent) {
        const percent = parseInt(nearbyPercent.text.replace(/[^\d]/g, ''));
        const mgValue = Math.round((percent / 100) * 1300); // FDA DV for calcium
        if (this.isValidCalciumValue(mgValue)) {
          logger.debug('OCR PARSE', 'Valid calcium value from spatial (Format 3 - percentage):', mgValue, 'mg (from', percent, '%)');
          return mgValue;
        }
      }
    }

    logger.debug('OCR PARSE', 'No valid calcium found in spatial elements');
    return null;
  }

  /**
   * Parse calcium from raw text using comprehensive regex patterns
   */
  private parseCalciumFromText(text: string): number | null {
    logger.debug('OCR PARSE', 'Parsing calcium from text patterns...');

    // Format 1: "Calcium XXXmg" (with various separators)
    // Matches: "Calcium 390mg", "Calcium: 320mg", "Calcium\t180mg", "• Calcium 60mg", "calcium60mg"
    const directMgPatterns = [
      /calcium[:\s\t]+(\d+)\s*mg/i,
      /calcium[:\s\t]+(\d+)mg/i,
      /[•·]\s*calcium\s+(\d+)\s*mg/i,
      /calcium\s+(\d+)\s*mg/i,
      /calcium(\d+)mg/i  // No space/colon: "calcium60mg", "calcium19mg"
    ];

    for (const pattern of directMgPatterns) {
      const match = text.match(pattern);
      if (match) {
        const mgValue = parseInt(match[1]);
        if (this.isValidCalciumValue(mgValue)) {
          logger.debug('OCR PARSE', 'Valid calcium from text (Format 1 - direct mg):', mgValue, 'mg');
          return mgValue;
        }
      }
    }

    // Format 2: "Calcium XXXmgYY%" (compact inline)
    // Matches: "Calcium 320mg25%", "Calcium390mg30%"
    const compactPattern = /calcium\s*(\d+)mg\d+%/i;
    const compactMatch = text.match(compactPattern);
    if (compactMatch) {
      const mgValue = parseInt(compactMatch[1]);
      if (this.isValidCalciumValue(mgValue)) {
        logger.debug('OCR PARSE', 'Valid calcium from text (Format 2 - compact inline):', mgValue, 'mg');
        return mgValue;
      }
    }

    // Format 3: "Calcium XXX mg YY%" (with space before mg)
    // Matches: "Calcium 180 mg 15%", "Calcium 130 mg"
    const spacedPattern = /calcium[:\s]+(\d+)\s+mg/i;
    const spacedMatch = text.match(spacedPattern);
    if (spacedMatch) {
      const mgValue = parseInt(spacedMatch[1]);
      if (this.isValidCalciumValue(mgValue)) {
        logger.debug('OCR PARSE', 'Valid calcium from text (Format 3 - spaced):', mgValue, 'mg');
        return mgValue;
      }
    }

    // Format 4: Direct number after calcium (no mg unit, but before percentage/junk)
    // Matches: "calcium350rV5%", "calcium450 30%" where first number is mg value
    // This must come BEFORE percentage patterns to extract mg value, not %DV
    const directNumberPattern = /calcium(\d+)/i;  // Capture all digits after calcium
    const directMatch = text.match(directNumberPattern);
    if (directMatch) {
      const mgValue = parseInt(directMatch[1]);
      // Only use if it's a valid calcium range (not a percentage like "calcium15")
      // Most calcium %DV values are 0-20%, so >20 likely indicates mg value
      if (mgValue > 20 && this.isValidCalciumValue(mgValue)) {
        logger.debug('OCR PARSE', 'Valid calcium from text (Format 4 - direct number):', mgValue, 'mg');
        return mgValue;
      }
    }

    // Format 5: Percentage-based fallback (convert %DV to mg)
    // Matches: "Calcium 25%", "Calcium: 30%", "calcium omg 15%" (corrupted mg)
    // Also handles cases where mg value is corrupted but %DV is readable
    // %DV is based on FDA Daily Value of 1300mg for calcium
    const percentPatterns = [
      /calcium[:\s]+(\d+)%/i,              // Standard: "Calcium 25%"
      /calcium[:\s]+\w+\s+(\d+)%/i,        // Corrupted mg: "calcium omg 15%"
      /calcium.*?(\d+)%/i                  // Flexible: any text between calcium and %
    ];

    for (const pattern of percentPatterns) {
      const percentMatch = text.match(pattern);
      if (percentMatch) {
        const percent = parseInt(percentMatch[1]);
        // Sanity check: DV% should be 0-200 (some fortified foods exceed 100%)
        if (percent >= 0 && percent <= 200) {
          const mgValue = Math.round((percent / 100) * 1300); // FDA DV for calcium
          logger.debug('OCR PARSE', 'Valid calcium from text (Format 5 - percentage):', mgValue, 'mg (from', percent, '%)');
          return mgValue;
        }
      }
    }

    // Format 5: Reversed order "XXmg Calcium"
    // Less common but appears in some formats
    const reversedPattern = /(\d+)\s*mg\s+calcium/i;
    const reversedMatch = text.match(reversedPattern);
    if (reversedMatch) {
      const mgValue = parseInt(reversedMatch[1]);
      if (this.isValidCalciumValue(mgValue)) {
        logger.debug('OCR PARSE', 'Valid calcium from text (Format 6 - reversed):', mgValue, 'mg');
        return mgValue;
      }
    }

    logger.debug('OCR PARSE', 'No valid calcium found in text patterns');
    return null;
  }

  /**
   * Validate calcium value is within reasonable range
   * Typical range: 0-2000mg (most products have 0-130% DV)
   */
  private isValidCalciumValue(value: number): boolean {
    // Accept 0 as valid (products with no calcium)
    return value >= 0 && value <= 2000;
  }

  /**
   * Centralized serving size parser - handles ALL serving size patterns
   * Returns structured object with quantity, measure, and optional standard measure
   *
   * @param text - Raw text to parse (preprocessed)
   * @param elements - Optional spatial elements for coordinate-based parsing
   * @returns ServingInfo object or null if not found
   */
  private parseServingSize(text: string, elements?: TextElement[]): ServingInfo | null {
    logger.debug('OCR PARSE', 'Parsing serving size from text and elements...');

    // Priority 1: Spatial parsing (if elements available)
    if (elements && elements.length > 0) {
      const spatialResult = this.parseServingSizeFromSpatialElements(elements);
      if (spatialResult) {
        logger.debug('OCR PARSE', 'Found serving size from spatial elements:', spatialResult.quantity, spatialResult.measure);
        return spatialResult;
      }
    }

    // Priority 2: Text pattern matching
    const textResult = this.parseServingSizeFromText(text);
    if (textResult) {
      logger.debug('OCR PARSE', 'Found serving size from text patterns:', textResult.quantity, textResult.measure);
      return textResult;
    }

    logger.debug('OCR PARSE', 'No serving size found');
    return null;
  }

  /**
   * Parse serving size from spatial elements using coordinate-based logic
   */
  private parseServingSizeFromSpatialElements(elements: TextElement[]): ServingInfo | null {
    // Find the "serving size" keyword line
    const servingKeywordEl = elements.find(el =>
      /serving/i.test(el.text) || /size/i.test(el.text)
    );

    if (!servingKeywordEl) return null;

    // Get elements on the same line (within Y tolerance)
    const yTolerance = 15;
    const sameLine = elements.filter(el =>
      Math.abs(el.y - servingKeywordEl.y) < yTolerance
    ).sort((a, b) => {
      // Preserve original API order when available (same lineIndex)
      if (a.lineIndex !== undefined && b.lineIndex !== undefined) {
        if (a.lineIndex === b.lineIndex) {
          // Same line - preserve word order from API
          return (a.wordIndex || 0) - (b.wordIndex || 0);
        }
        // Different lines - sort by line index
        return a.lineIndex - b.lineIndex;
      }
      // Fallback to X-coordinate if no lineIndex (backward compatibility)
      return a.x - b.x;
    });

    // Find keyword index
    const keywordIndex = sameLine.findIndex(el =>
      el.x === servingKeywordEl.x && el.y === servingKeywordEl.y
    );

    if (keywordIndex === -1) return null;

    // Parse sequentially: quantity → measure → standard measure
    let quantity: number | null = null;
    let measure: string | null = null;
    let standardValue: number | undefined;
    let standardUnit: string | undefined;

    // Look for quantity (first valid number after keyword)
    for (let i = keywordIndex + 1; i < sameLine.length; i++) {
      const text = sameLine[i].text.trim();
      const parsedQty = this.parseFraction(text);

      if (parsedQty !== null && this.validateServingQuantity(parsedQty, text)) {
        quantity = parsedQty;
        break;
      }
    }

    if (!quantity) return null;

    // Look for measure (first valid unit after quantity)
    const qtyIndex = sameLine.findIndex(el => {
      const parsed = this.parseFraction(el.text.trim());
      return parsed === quantity;
    });

    for (let i = qtyIndex + 1; i < sameLine.length; i++) {
      const text = sameLine[i].text.trim();
      if (/^(cup|tbsp|tsp|bottle|slice|container|oz|fl|g|ml|mL)s?$/i.test(text)) {
        measure = text.toLowerCase().replace(/s$/, '');
        break;
      }
    }

    if (!measure) return null;

    // Look for standard measure (parenthetical format)
    for (let i = keywordIndex + 1; i < sameLine.length; i++) {
      const standard = this.parseStandardMeasure(sameLine[i].text);
      if (standard) {
        standardValue = standard.value;
        standardUnit = standard.unit;
        break;
      }
    }

    return { quantity, measure, standardValue, standardUnit };
  }

  /**
   * Normalize common OCR mistakes to improve parsing accuracy
   * CONSERVATIVE approach to avoid breaking valid patterns
   */
  private normalizeOCRText(text: string): string {
    let normalized = text;

    // Fix common OCR typos in "calcium" keyword (specific patterns)
    // Use negative lookahead (?![a-z]) instead of \b to handle adjacent digits/symbols
    // "caburn" → "calcium" (b instead of lci, rn instead of um)
    normalized = normalized.replace(/\bca[bl][ou]rn(?![a-z])/gi, 'calcium');
    // "caloum" → "calcium" (missing ci)
    normalized = normalized.replace(/\bcal[o0]um(?![a-z])/gi, 'calcium');
    // "calclum", "callum" → "calcium" (l instead of i)
    normalized = normalized.replace(/\bcalc?[l1i]um(?![a-z])/gi, 'calcium');

    // Fix unit typos in mg (common OCR errors)
    // "mv" → "mg" (g misread as v)
    // "mq" → "mg" (g misread as q)
    // "rng" → "mg" (m misread as rn)
    // Use lookahead instead of \b to handle cases like "110mv8" (non-letter after unit)
    normalized = normalized.replace(/(\d+)\s*(mv|mq|rng)(?![a-z])/gi, '$1mg');

    // Fix digit OCR errors in numeric values (when followed by mg or %)
    // "3SO" → "350", "lO" → "10", "S5" → "55"
    // Apply multiple times to handle consecutive errors like "3SO" (both S and O need fixing)
    let prevNormalized = '';
    while (prevNormalized !== normalized) {
      prevNormalized = normalized;
      normalized = normalized.replace(/(\d*)([OS])(\d*)(\s*(?:mg|mv|mq|%))/gi, (match, before, letter, after, unit) => {
        const replacement = letter.toUpperCase() === 'O' ? '0' : '5';
        return `${before}${replacement}${after}${unit}`;
      });
    }

    // Fix lowercase 'l' to '1' in numbers (when followed by mg or %)
    normalized = normalized.replace(/(\d*)l(\d*)(\s*(?:mg|mv|mq|%))/gi, '$11$2$3');

    // Fix "0" mistaken as "o" or "O" in numeric contexts ONLY
    // "calcium omg" → "calcium 0mg" (only when followed by mg)
    normalized = normalized.replace(/(\bcalcium\s+)omg\b/gi, '$10mg');
    normalized = normalized.replace(/(\d+\s*)omg\b/gi, '$10mg');

    // Fix "I" or "l" to "1" ONLY in specific serving size contexts
    // "Serving size I packet" → "Serving size 1 packet"
    // More conservative than before - only for common single-word measures
    normalized = normalized.replace(/\bserving\s+size\s+([il])\s+(packet|pouch|bar|bottle|container|portion)\b/gi, 'Serving size 1 $2');

    // Fix common typos in "Serving size" keyword
    // "Servinq site" → "Serving size", "Serving sixo" → "Serving size"
    normalized = normalized.replace(/servin[gq]\s*si[tzx]e/gi, 'Serving size');

    return normalized;
  }

  /**
   * Parse serving size from raw text using comprehensive regex patterns
   */
  private parseServingSizeFromText(text: string): ServingInfo | null {
    // Enhanced patterns to handle quantity-first formats without "Serving size" keyword
    // Parenthetical patterns made forgiving to handle OCR corruption: (28g/abc → captures 28g)
    const patterns = [
      // Pattern 0: Quantity-first with controlled wildcard for measures
      // "1.5 Cup (39 g)", "55 pieces (30 g)", "27 crackers (30g)", "1 package (28g"
      // Allows 1-2 word measures with length constraints to prevent greedy matching
      // Forgiving: captures value+unit even if closing paren is missing or has garbage
      /([\d\.\/]+)\s+([a-zA-Z]{2,15}(?:\s+[a-zA-Z]{2,15})?)\s*\((\d+(?:\.\d+)?)\s*([gG]|ml|mL|oz|fl\s*oz)/i,

      // Pattern 1: Standard format with optional parenthetical
      // "Serving size 1/2 cup (120g)", "Serving size 2 tbsp (30ml", "Serving size 1 oz (28g/abc"
      // Forgiving: accepts corrupted parentheticals like (28g/abc or (85g extra text)
      /serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl\s*oz|g|ml|mL|pieces|crackers|bars|cookies|pretzels|chips)(?:\s*\((\d+(?:\.\d+)?)\s*([a-zA-Z]+))?/i,

      // Pattern 2: Parenthetical first, then measure
      // "Serving size (240mL) 1 cup", "Serving size (30g 1 tbsp"
      // Forgiving: doesn't require closing paren
      /serving\s*size\s*\((\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s*([\d\.\/]+)\s*(cup|tbsp|tsp|bottle|slice|container|pieces|crackers|bars)/i,

      // Pattern 3: Quantity and measure only
      // "Serving size 1 bottle"
      /serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*(cup|tbsp|tsp|bottle|slice|container|oz|g|ml|mL|pieces|crackers|bars|cookies)/i,

      // Pattern 4: Just quantity with parenthetical (single word measure)
      // "1 bottle (296ml)", "2 cup (240g/abc"
      // Forgiving: doesn't require closing paren or clean text after unit
      /^([\d\.\/]+)\s*(bottle|cup|tbsp|tsp|slice|container)\s*\((\d+(?:\.\d+)?)\s*([a-zA-Z]+)/i,

      // Pattern 5: Space-separated fractions with measure
      // "1 1/2 cup", "2 1/4 tbsp (30ml)", "1 1/2 cup (120g/extra"
      // Forgiving: handles corrupted parenthetical
      /serving\s*size\s*[:\-]?\s*(\d+)\s+(\d+\/\d+)\s+(cup|tbsp|tsp|bottle)(?:\s*\((\d+(?:\.\d+)?)\s*([a-zA-Z]+))?/i,

      // Pattern 6: Measure with parenthetical but missing quantity (assume 1)
      // "packet (34g)", "pouch (200g", "bar (24g/text"
      // Safety net for cases where OCR missed the quantity
      // Forgiving: doesn't require closing paren
      /serving\s*size\s*[:\-]?\s*(packet|pouch|bar|bottle|container|portion|serving)\s*\((\d+(?:\.\d+)?)\s*([gG]|ml|mL|oz|fl\s*oz)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let quantity: number | null = null;
        let measure: string | null = null;
        let standardValue: number | undefined;
        let standardUnit: string | undefined;

        // Extract based on pattern structure
        if (pattern.source.includes('\\(.*\\).*cup')) {
          // Pattern 2: parenthetical first
          standardValue = parseFloat(match[1]);
          standardUnit = match[2].toLowerCase();
          quantity = this.parseFraction(match[3]);
          measure = match[4].toLowerCase();
        } else if (pattern.source.startsWith('([\\d')) {
          // Pattern 0: Quantity-first with any measure word(s) and parenthetical
          // Example match: ["1.5 Cup (39 g)", "1.5", "Cup", "39", "g"]
          quantity = this.parseFraction(match[1]);
          measure = match[2].trim().toLowerCase().replace(/s$/, ''); // Normalize measure
          standardValue = parseFloat(match[3]);
          standardUnit = match[4].toLowerCase();
        } else if (pattern.source.includes('(\\d+)\\s+(\\d+\\/\\d+)')) {
          // Pattern 5: Space-separated fraction
          // Example match: ["Serving size 1 1/2 cup", "1", "1/2", "cup", "120", "g"]
          const wholePart = parseFloat(match[1]);
          const fractionPart = this.parseFraction(match[2]);
          quantity = wholePart + fractionPart;
          measure = match[3].toLowerCase();

          if (match[4] && match[5]) {
            standardValue = parseFloat(match[4]);
            standardUnit = match[5].toLowerCase();
          }
        } else if (pattern.source.includes('(packet|pouch|bar|bottle|container|portion')) {
          // Pattern 6: Missing quantity - assume 1
          // Example match: ["Serving size packet (34g)", "packet", "34", "g"]
          quantity = 1; // Default to 1 when quantity is missing
          measure = match[1].toLowerCase();
          standardValue = parseFloat(match[2]);
          standardUnit = match[3].toLowerCase();
        } else {
          // Patterns 1, 3, 4: quantity first (traditional)
          quantity = this.parseFraction(match[1]);
          measure = match[2].toLowerCase().replace(/s$/, '');

          if (match[3] && match[4]) {
            standardValue = parseFloat(match[3]);
            standardUnit = match[4].toLowerCase();
          }
        }

        if (quantity && measure && this.validateServingQuantity(quantity, text)) {
          return { quantity, measure, standardValue, standardUnit };
        }
      }
    }

    return null;
  }

  /**
   * Extract standard measure from parenthetical format
   * Examples: "(240mL)", "(30g)", "(30 g)", "(8 oz)", "(39 g)"
   */
  private parseStandardMeasure(text: string): {value: number, unit: string} | null {
    // Single pattern with optional space handles all variants
    const pattern = /\((\d+(?:\.\d+)?)\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\)/;

    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2].trim().toLowerCase();

      // Validate unit is a standard measure (handle "fl oz" as well)
      if (/^(g|ml|mL|oz|fl\s*oz)$/i.test(unit)) {
        return { value, unit };
      }
    }

    return null;
  }

  // ============================================================================
  // LAYER 1: SPATIAL STRUCTURE PARSING
  // ============================================================================

  /**
   * Layer 1: Spatial structure parsing using OCR word coordinates
   * Tries table structure detection first, falls back to line-based grouping
   * High confidence (0.8-1.0)
   *
   * @param elements - Spatial text elements with coordinates
   * @param preprocessedText - Preprocessed text for context
   * @returns Partial result with fields found via spatial analysis
   */
  private spatialParse(elements: TextElement[], preprocessedText: string): Partial<NutritionParseResult> {
    logger.debug('OCR PARSE', 'Starting spatial structure parsing with', elements.length, 'elements');

    const result: Partial<NutritionParseResult> = {
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null
    };

    // Strategy 1: Try table structure detection
    logger.debug('OCR PARSE', 'Trying table structure detection...');
    const tableResult = this.parseViaTableStructure(elements);
    if (tableResult.servingQuantity !== null || tableResult.calcium !== null) {
      logger.debug('OCR PARSE', 'Table structure found results:', 'serving:', tableResult.servingQuantity, tableResult.servingMeasure, 'calcium:', tableResult.calcium);
      Object.assign(result, tableResult);

      // If we found everything, return early
      if (this.isComplete(result)) {
        logger.debug('OCR PARSE', 'Table structure parsing complete');
        return result;
      }
    }

    // Strategy 2: Line-based grouping (for non-table layouts)
    if (!this.isComplete(result)) {
      logger.debug('OCR PARSE', 'Trying line-based grouping...');
      const lineResult = this.parseViaLineGrouping(elements);

      // Merge line results (don't overwrite existing values)
      if (result.servingQuantity === null && lineResult.servingQuantity !== null) {
        result.servingQuantity = lineResult.servingQuantity;
      }
      if (result.servingMeasure === null && lineResult.servingMeasure !== null) {
        result.servingMeasure = lineResult.servingMeasure;
      }
      if (result.standardMeasureValue === null && lineResult.standardMeasureValue !== null) {
        result.standardMeasureValue = lineResult.standardMeasureValue;
        result.standardMeasureUnit = lineResult.standardMeasureUnit;
      }
      if (result.calcium === null && lineResult.calcium !== null) {
        result.calcium = lineResult.calcium;
      }

      logger.debug('OCR PARSE', 'Line-based grouping results:', 'serving:', lineResult.servingQuantity, lineResult.servingMeasure, 'calcium:', lineResult.calcium);
    }

    return result;
  }

  /**
   * Parse using table structure detection (columns and rows)
   */
  private parseViaTableStructure(elements: TextElement[]): Partial<NutritionParseResult> {
    const result: Partial<NutritionParseResult> = {
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null
    };

    // Detect table structure
    const { columns, rows } = this.detectTableStructure(elements);
    logger.debug('OCR PARSE', 'Detected table structure:', columns.length, 'columns,', rows.length, 'rows');

    if (columns.length < 2 || rows.length < 3) {
      logger.debug('OCR PARSE', 'Table structure insufficient (need 2+ columns, 3+ rows)');
      return result;
    }

    // Identify the primary value column (first non-label column)
    // Column 0 is typically labels, Column 1 is the primary values
    const primaryValueColumn = columns.length >= 2 ? columns[1] : null;

    if (primaryValueColumn) {
      logger.debug('OCR PARSE', 'Using primary value column at x:', primaryValueColumn.x);
    }

    // Find serving size row
    const servingRow = rows.find(row =>
      row.elements.some(el => /serving\s*size/i.test(el.text))
    );

    if (servingRow) {
      // Filter to primary value column only (avoid multi-column confusion)
      const filteredElements = primaryValueColumn
        ? this.filterElementsByColumn(servingRow.elements, primaryValueColumn)
        : servingRow.elements;

      const servingText = filteredElements.map(e => e.text).join(' ');
      const servingInfo = this.parseServingSize(servingText, filteredElements);

      if (servingInfo) {
        result.servingQuantity = servingInfo.quantity;
        result.servingMeasure = servingInfo.measure;
        result.standardMeasureValue = servingInfo.standardValue;
        result.standardMeasureUnit = servingInfo.standardUnit;
      }
    }

    // Find calcium row
    const calciumRow = rows.find(row =>
      row.elements.some(el => /calcium/i.test(el.text))
    );

    if (calciumRow) {
      // Filter to primary value column only (avoid multi-column confusion)
      const filteredElements = primaryValueColumn
        ? this.filterElementsByColumn(calciumRow.elements, primaryValueColumn)
        : calciumRow.elements;

      const calciumText = filteredElements.map(e => e.text).join(' ');
      const calciumValue = this.parseCalcium(calciumText, filteredElements);

      if (calciumValue !== null) {
        result.calcium = calciumValue;
      }
    }

    return result;
  }

  /**
   * Filter text elements to only those belonging to a specific column
   * Used to extract values from the correct column in multi-column tables
   */
  private filterElementsByColumn(elements: TextElement[], column: TableColumn): TextElement[] {
    // Include elements whose X position falls within the column's range
    // Column range is defined as: column.x ± (column.width / 2)
    const columnStart = column.x - (column.width / 2);
    const columnEnd = column.x + (column.width / 2);

    const filtered = elements.filter(el => {
      const elementCenter = el.x + (el.width / 2);
      return elementCenter >= columnStart && elementCenter <= columnEnd;
    });


    return filtered;
  }

  /**
   * Parse using line-based grouping (for non-table layouts)
   */
  private parseViaLineGrouping(elements: TextElement[]): Partial<NutritionParseResult> {
    const result: Partial<NutritionParseResult> = {
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null
    };

    const lines = this.groupElementsIntoLines(elements);
    logger.debug('OCR PARSE', 'Grouped elements into', lines.length, 'lines');

    for (const line of lines) {
      const lineText = line.elements.map(e => e.text).join(' ');

      // Parse serving size
      if (!result.servingQuantity && /serving|size/i.test(lineText)) {
        const servingInfo = this.parseServingSize(lineText, line.elements);

        if (servingInfo) {
          result.servingQuantity = servingInfo.quantity;
          result.servingMeasure = servingInfo.measure;
          result.standardMeasureValue = servingInfo.standardValue;
          result.standardMeasureUnit = servingInfo.standardUnit;
        }
      }

      // Parse calcium
      if (!result.calcium && /calcium/i.test(lineText)) {
        const calciumValue = this.parseCalcium(lineText, line.elements);

        if (calciumValue !== null) {
          result.calcium = calciumValue;
        }
      }

      // Stop if we found everything
      if (this.isComplete(result)) break;
    }

    return result;
  }

  /**
   * Group elements into lines based on Y coordinate proximity
   */
  private groupElementsIntoLines(elements: TextElement[]): TextLine[] {
    if (!elements || elements.length === 0) return [];

    // Sort by Y then preserve API order when available
    const sorted = [...elements].sort((a, b) => {
      const yDiff = a.y - b.y;
      // Elements on different vertical positions
      if (Math.abs(yDiff) >= 5) return yDiff;

      // Elements on same Y level - preserve API order if available
      if (a.lineIndex !== undefined && b.lineIndex !== undefined) {
        if (a.lineIndex === b.lineIndex) {
          // Same original line - preserve word order
          return (a.wordIndex || 0) - (b.wordIndex || 0);
        }
        // Different lines - sort by line index
        return a.lineIndex - b.lineIndex;
      }

      // Fallback to X-coordinate for backward compatibility
      return a.x - b.x;
    });

    const lines: TextLine[] = [];
    let currentLine: TextLine | null = null;
    const yTolerance = 15;

    for (const el of sorted) {
      if (!currentLine) {
        currentLine = { text: el.text, elements: [el], y: el.y, height: el.height };
      } else {
        const lineCenterY = currentLine.y + currentLine.height / 2;
        const elCenterY = el.y + el.height / 2;

        if (Math.abs(elCenterY - lineCenterY) < yTolerance) {
          // Add to current line
          currentLine.elements.push(el);
          currentLine.text += ' ' + el.text;
          currentLine.height = Math.max(currentLine.height, el.height);
        } else {
          // Start new line
          lines.push(currentLine);
          currentLine = { text: el.text, elements: [el], y: el.y, height: el.height };
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Check if result has all required fields
   */
  private isComplete(result: Partial<NutritionParseResult>): boolean {
    return result.servingQuantity !== null &&
           result.servingMeasure !== null &&
           result.calcium !== null;
  }

  // ============================================================================
  // LAYER 2: TEXT PATTERN MATCHING
  // ============================================================================

  /**
   * Layer 2: Regex pattern matching on raw text
   * Uses comprehensive patterns to find missing fields
   * Medium confidence (0.5-0.7)
   *
   * @param text - Preprocessed text
   * @param result - Partial result to fill gaps in
   */
  private regexParse(text: string, result: Partial<NutritionParseResult>): void {
    logger.debug('OCR PARSE', 'Starting regex pattern matching on text...');

    // Parse serving size if not found
    if (!result.servingQuantity || !result.servingMeasure) {
      logger.debug('OCR PARSE', 'Looking for serving size in text patterns...');
      const servingInfo = this.parseServingSize(text);

      if (servingInfo) {
        logger.debug('OCR PARSE', 'Found serving size via regex:', servingInfo.quantity, servingInfo.measure);
        if (!result.servingQuantity) {
          result.servingQuantity = servingInfo.quantity;
        }
        if (!result.servingMeasure) {
          result.servingMeasure = servingInfo.measure;
        }
        if (!result.standardMeasureValue && servingInfo.standardValue) {
          result.standardMeasureValue = servingInfo.standardValue;
          result.standardMeasureUnit = servingInfo.standardUnit;
        }
      }
    }

    // Parse calcium if not found
    if (!result.calcium) {
      logger.debug('OCR PARSE', 'Looking for calcium in text patterns...');
      const calciumValue = this.parseCalcium(text);

      if (calciumValue !== null) {
        logger.debug('OCR PARSE', 'Found calcium via regex:', calciumValue, 'mg');
        result.calcium = calciumValue;
      }
    }

    logger.debug('OCR PARSE', 'Regex parsing complete');
  }

  // ============================================================================
  // LAYER 3: FUZZY RECOVERY
  // ============================================================================

  /**
   * Layer 3: Fuzzy matching and OCR error correction
   * Last resort for missing fields
   * Low confidence (0.2-0.4)
   *
   * @param elements - Spatial elements (if available)
   * @param text - Preprocessed text
   * @param result - Partial result to fill remaining gaps
   */
  private fuzzyParse(elements: TextElement[], text: string, result: Partial<NutritionParseResult>): void {
    logger.debug('OCR PARSE', 'Starting fuzzy matching and OCR error correction...');

    // OCR error corrections for common misreads
    const correctedText = this.applyOCRCorrections(text);
    logger.debug('OCR PARSE', 'Applied OCR corrections to text');

    // Try parsing again with corrected text
    if (!result.servingQuantity || !result.servingMeasure) {
      logger.debug('OCR PARSE', 'Looking for serving size in corrected text...');
      const servingInfo = this.parseServingSize(correctedText);

      if (servingInfo) {
        logger.debug('OCR PARSE', 'Found serving size via fuzzy matching:', servingInfo.quantity, servingInfo.measure);
        if (!result.servingQuantity) {
          result.servingQuantity = servingInfo.quantity;
        }
        if (!result.servingMeasure) {
          result.servingMeasure = servingInfo.measure;
        }
      }
    }

    if (!result.calcium) {
      logger.debug('OCR PARSE', 'Looking for calcium in corrected text...');
      const calciumValue = this.parseCalcium(correctedText);

      if (calciumValue !== null) {
        logger.debug('OCR PARSE', 'Found calcium via fuzzy matching:', calciumValue, 'mg');
        result.calcium = calciumValue;
      }
    }

    // Fuzzy keyword matching (if elements available)
    if (elements && elements.length > 0) {
      logger.debug('OCR PARSE', 'Trying fuzzy keyword matching on spatial elements...');
      if (!result.calcium) {
        const fuzzyCalcium = this.fuzzyMatchCalcium(elements, correctedText);
        if (fuzzyCalcium !== null) {
          logger.debug('OCR PARSE', 'Found calcium via fuzzy keyword matching:', fuzzyCalcium, 'mg');
          result.calcium = fuzzyCalcium;
        }
      }

      if (!result.servingQuantity || !result.servingMeasure) {
        const fuzzyServing = this.fuzzyMatchServing(elements);
        if (fuzzyServing) {
          logger.debug('OCR PARSE', 'Found serving via fuzzy keyword matching:', fuzzyServing.quantity, fuzzyServing.measure);
          if (!result.servingQuantity) {
            result.servingQuantity = fuzzyServing.quantity;
          }
          if (!result.servingMeasure) {
            result.servingMeasure = fuzzyServing.measure;
          }
        }
      }
    }

    logger.debug('OCR PARSE', 'Fuzzy parsing complete');
  }

  /**
   * Apply common OCR error corrections
   */
  private applyOCRCorrections(text: string): string {
    const corrections: [RegExp, string][] = [
      // Common number misreads
      [/\bO(\d)/g, '0$1'],           // O0 → 00
      [/(\d)O\b/g, '$10'],           // 1O → 10
      [/\bl(\d)/g, '1$1'],           // l1 → 11
      [/(\d)l\b/g, '$11'],           // 2l → 21

      // Unit misreads
      [/(\d+)\s*rng\b/gi, '$1mg'],   // rng → mg
      [/(\d+)\s*fog\b/gi, '$1mg'],   // fog → mg
      [/(\d+)\s*rag\b/gi, '$1mg'],   // rag → mg
      [/(\d+)\s*rnL\b/gi, '$1mL'],   // rnL → mL

      // Calcium keyword variations
      [/ca1cium/gi, 'calcium'],
      [/calclum/gi, 'calcium'],
      [/ca[li]c[il]um/gi, 'calcium'],

      // Serving size variations
      [/serv[il]ng/gi, 'serving'],
      [/s[il]ze/gi, 'size'],

      // Measure unit variations
      [/tb5p/gi, 'tbsp'],
      [/t5p/gi, 'tsp'],
      [/bott1e/gi, 'bottle'],
      [/s1ice/gi, 'slice'],
    ];

    let corrected = text;
    for (const [pattern, replacement] of corrections) {
      corrected = corrected.replace(pattern, replacement);
    }

    return corrected;
  }

  /**
   * Fuzzy match calcium using proximity and keyword similarity
   */
  private fuzzyMatchCalcium(elements: TextElement[], text: string): number | null {
    // Find elements that might be "calcium" (fuzzy match)
    const calciumCandidates = elements.filter(el => {
      const normalized = el.text.toLowerCase().replace(/[^a-z]/g, '');
      return this.fuzzyMatch(normalized, 'calcium', 0.7); // 70% similarity
    });

    if (calciumCandidates.length === 0) return null;

    // For each candidate, look for nearby numeric values
    for (const candidate of calciumCandidates) {
      const nearby = elements.filter(el =>
        Math.abs(el.y - candidate.y) < 20 && // Same line
        el.x > candidate.x && // To the right
        el.x - candidate.x < 200 // Reasonable distance
      );

      // Look for mg values
      for (const el of nearby) {
        const mgMatch = el.text.match(/(\d+)\s*mg/i);
        if (mgMatch) {
          const value = parseInt(mgMatch[1]);
          if (this.isValidCalciumValue(value)) {
            return value;
          }
        }
      }

      // Look for percentages
      for (const el of nearby) {
        const percentMatch = el.text.match(/(\d+)\s*%/);
        if (percentMatch) {
          const percent = parseInt(percentMatch[1]);
          if (percent > 0 && percent <= 100) {
            return Math.round((percent / 100) * 1300);
          }
        }
      }
    }

    return null;
  }

  /**
   * Fuzzy match serving size using keyword similarity
   */
  private fuzzyMatchServing(elements: TextElement[]): { quantity: number; measure: string } | null {
    // Find "serving" or "size" keywords (fuzzy)
    const servingCandidates = elements.filter(el => {
      const normalized = el.text.toLowerCase().replace(/[^a-z]/g, '');
      return this.fuzzyMatch(normalized, 'serving', 0.7) ||
             this.fuzzyMatch(normalized, 'size', 0.7);
    });

    if (servingCandidates.length === 0) return null;

    // For each candidate, look for nearby quantities and measures
    for (const candidate of servingCandidates) {
      const nearby = elements.filter(el =>
        Math.abs(el.y - candidate.y) < 20 && // Same line
        el.x > candidate.x // To the right
      ).sort((a, b) => a.x - b.x); // Left to right

      let quantity: number | null = null;
      let measure: string | null = null;

      // Sequential search
      for (const el of nearby) {
        if (!quantity) {
          quantity = this.parseFraction(el.text.trim());
          if (quantity && this.validateServingQuantity(quantity, el.text)) {
            continue;
          } else {
            quantity = null;
          }
        }

        if (quantity && !measure) {
          if (/^(cup|tbsp|tsp|bottle|slice|container|oz|g|ml|mL)s?$/i.test(el.text.trim())) {
            measure = el.text.toLowerCase().replace(/s$/, '');
            return { quantity, measure };
          }
        }
      }
    }

    return null;
  }

  private parseFraction(text: string): number | null {
    if (!text) return null;
    
    const fractionPatterns = [
      /^(\d+)\/(\d+)$/,
      /^(\d+)\s+(\d+)\/(\d+)$/,
      /^(\d+\.?\d*)$/,
    ];
    
    for (const pattern of fractionPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (pattern.source.includes('\\s+')) {
          // Mixed fraction: "1 1/2"
          return parseFloat(match[1]) + (parseFloat(match[2]) / parseFloat(match[3]));
        } else if (pattern.source.includes('\\/')) {
          // Simple fraction: "1/2"
          const denominator = parseFloat(match[2]);
          if (denominator !== 0) {
            return parseFloat(match[1]) / denominator;
          }
        } else {
          // Decimal: "1.5"
          return parseFloat(match[1]);
        }
      }
    }
    
    return null;
  }

  private validateServingQuantity(quantity: number, rawText: string): boolean {
    // Handle very large misreads (like "112" for "1/2")
    if (quantity > 50 && /^\d{2,3}$/.test(rawText)) {
      return false;
    }
    
    // Normal range validation
    if (quantity > 0 && quantity <= 10) {
      return true;
    }
    
    return false;
  }

  private parseNutritionDataFallback(text: string, apiResponse: OCRResponse): NutritionParseResult {
    logger.debug('OCR PARSE', 'Using fallback text-only parsing (no spatial data)');

    const result: NutritionParseResult = {
      rawText: text,
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null,
      confidence: 'low',
      spatialResults: [],
      fullApiResponse: apiResponse
    };

    const preprocessedText = this.preprocessText(text);
    // Use regex parsing since we don't have spatial data
    this.regexParse(preprocessedText, result);

    result.confidence = this.calculateConfidence(result);
    result.servingSize = this.buildLegacyServingSize(result);
    result.calciumValue = result.calcium;

    logger.debug('OCR PARSE', 'Fallback parsing complete - serving:', result.servingSize, 'calcium:', result.calcium);

    return result;
  }

  private scoreResult(result: NutritionParseResult): number {
    let score = 0;
    if (result.servingQuantity !== null) score += 2;
    if (result.servingMeasure !== null) score += 2;
    if (result.standardMeasureValue !== null) score += 1;
    if (result.standardMeasureUnit !== null) score += 1;
    if (result.calcium !== null) score += 3;
    return score;
  }

  private calculateConfidence(result: NutritionParseResult): 'low' | 'medium' | 'high' {
    const score = this.scoreResult(result);
    const maxScore = 9;

    const percentage = score / maxScore;

    if (percentage >= 0.8) return 'high';
    if (percentage >= 0.5) return 'medium';
    return 'low';
  }
}
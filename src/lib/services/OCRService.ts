// Enhanced OCRService.ts with targeted fixes for test image failures
// Merges proven features from pre-batch test version

import { ImageResizer } from '$lib/utils/imageResize.ts';

interface TextElement {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

  async processImage(file: File, captureImage: boolean = false): Promise<NutritionParseResult> {
    console.log('OCR: Starting enhanced multi-strategy processing...');

    try {
      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (!this.apiKey || this.apiKey === 'YOUR_OCR_SPACE_KEY') {
        throw new Error('OCR API key not configured');
      }

      // Compress if needed
      let processedFile: File = file;
      if (file.size > 1024 * 1024) {
        processedFile = await ImageResizer.compressWithFallback(file, 1024 * 1024, 3);
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

      console.log('OCR: Making API request...');

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OCR API error: ${response.status}`);
      }

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

      console.log('OCR: Raw text length:', rawText.length);
      console.log('OCR: Has overlay data:', overlay?.HasOverlay);

      // Use enhanced parsing with multiple strategies
      if (overlay?.HasOverlay && overlay.Lines) {
        const parseResult = this.parseWithMultipleStrategies(rawText, overlay.Lines, result);
        // Add captured image blob to result if available
        if (captureImage && imageBlob) {
          parseResult.imageBlob = imageBlob;
        }
        return parseResult;
      } else {
        console.log('OCR: No overlay data, using fallback parsing');
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
    console.log('OCR: Parsing from cached OCR data...');
    console.log('OCR: Word count:', cachedData.words.length);
    
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
    
    console.log('OCR: Reconstructed', lines.length, 'lines from', words.length, 'words');
    return lines;
  }  

  /**
   * NEW IMPLEMENTATION: Simple 3-layer waterfall parsing
   * Replaces the old strategy-based approach with clear sequential execution
   */
  private parseWithMultipleStrategies(rawText: string, lines: any[], apiResponse: OCRResponse): NutritionParseResult {
    console.log('=== Starting 3-Layer Waterfall Parse ===');
    console.log('OCR: Raw text length:', rawText.length);

    // Extract and preprocess spatial elements
    const textElements: TextElement[] = this.extractTextElements(lines);
    textElements.forEach(el => {
      el.text = this.preprocessSpatialText(el);
    });

    const preprocessedText = this.preprocessText(rawText);
    console.log('OCR: Preprocessed', textElements.length, 'spatial elements');

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
    console.log('\n--- LAYER 1: Spatial Structure ---');
    const spatialResult = this.spatialParse(textElements, preprocessedText);
    Object.assign(result, spatialResult);

    const afterLayer1 = this.isComplete(result);
    console.log('After Layer 1:', {
      servingQuantity: result.servingQuantity,
      servingMeasure: result.servingMeasure,
      calcium: result.calcium,
      complete: afterLayer1
    });

    // LAYER 2: Text Pattern Matching (fill gaps)
    if (!afterLayer1) {
      console.log('\n--- LAYER 2: Text Patterns ---');
      this.regexParse(preprocessedText, result);

      const afterLayer2 = this.isComplete(result);
      console.log('After Layer 2:', {
        servingQuantity: result.servingQuantity,
        servingMeasure: result.servingMeasure,
        calcium: result.calcium,
        complete: afterLayer2
      });
    }

    // LAYER 3: Fuzzy Recovery (last resort)
    if (!this.isComplete(result)) {
      console.log('\n--- LAYER 3: Fuzzy Recovery ---');
      this.fuzzyParse(textElements, preprocessedText, result);

      console.log('After Layer 3:', {
        servingQuantity: result.servingQuantity,
        servingMeasure: result.servingMeasure,
        calcium: result.calcium,
        complete: this.isComplete(result)
      });
    }

    // Calculate confidence and finalize
    result.confidence = this.calculateConfidence(result);
    result.servingSize = this.buildLegacyServingSize(result);
    result.calciumValue = result.calcium;

    console.log('\n=== Parse Complete ===');
    console.log('Final result:', {
      servingSize: result.servingSize,
      calcium: result.calcium,
      confidence: result.confidence
    });

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
    
    for (const line of lines) {
      if (line.Words && line.Words.length > 0) {
        for (const word of line.Words) {
          elements.push({
            text: word.WordText,
            x: word.Left,
            y: word.Top,
            width: word.Width,
            height: word.Height
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
    
    console.log(`OCR: Detected ${columns.length} columns and ${rows.length} rows`);
    return { columns, rows };
  }

  private identifyColumns(xPositions: number[]): TableColumn[] {
    // Cluster X positions to identify column boundaries
    const clusters: number[][] = [];
    const clusterTolerance = 50;
    
    for (const x of xPositions) {
      let foundCluster = false;
      for (const cluster of clusters) {
        if (cluster.some(cx => Math.abs(cx - x) <= clusterTolerance)) {
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
    console.log('parseCalcium: Starting with text:', text.substring(0, 100));

    // Priority 1: Direct mg values from spatial elements (if available)
    if (elements && elements.length > 0) {
      const mgValue = this.parseCalciumFromSpatialElements(elements);
      if (mgValue !== null) {
        console.log('parseCalcium: Found via spatial elements:', mgValue);
        return mgValue;
      }
    }

    // Priority 2: Pattern matching on text
    const textValue = this.parseCalciumFromText(text);
    if (textValue !== null) {
      console.log('parseCalcium: Found via text patterns:', textValue);
      return textValue;
    }

    console.log('parseCalcium: No calcium value found');
    return null;
  }

  /**
   * Parse calcium from spatial elements using coordinate-based logic
   */
  private parseCalciumFromSpatialElements(elements: TextElement[]): number | null {
    // Format 1: Direct mg value (highest confidence)
    // Example: "390mg", "320mg", "60mg"
    const mgElements = elements.filter(el => /^\d+mg$/i.test(el.text.trim()));

    for (const mgEl of mgElements) {
      // Check if there's a "calcium" label nearby (within reasonable Y distance)
      const hasCalciumLabel = elements.some(el =>
        /calcium/i.test(el.text) &&
        Math.abs(el.y - mgEl.y) < 20 // Same line tolerance
      );

      if (hasCalciumLabel) {
        const mgValue = parseInt(mgEl.text.replace(/[^\d]/g, ''));
        if (this.isValidCalciumValue(mgValue)) {
          return mgValue;
        }
      }
    }

    // Format 2: Compact inline format (mg stuck to percentage)
    // Example: "320mg25%", "390mg30%"
    const compactElements = elements.filter(el =>
      /^\d+mg\d+%$/i.test(el.text.trim())
    );

    for (const compactEl of compactElements) {
      const match = compactEl.text.match(/^(\d+)mg/i);
      if (match) {
        const mgValue = parseInt(match[1]);
        if (this.isValidCalciumValue(mgValue)) {
          return mgValue;
        }
      }
    }

    // Format 3: Percentage to mg conversion
    // Example: "25%" near "Calcium" (convert assuming 1300mg = 100%)
    const calciumElements = elements.filter(el => /calcium/i.test(el.text));

    for (const calciumEl of calciumElements) {
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
          return mgValue;
        }
      }
    }

    return null;
  }

  /**
   * Parse calcium from raw text using comprehensive regex patterns
   */
  private parseCalciumFromText(text: string): number | null {
    // Format 1: "Calcium XXXmg" (with various separators)
    // Matches: "Calcium 390mg", "Calcium: 320mg", "Calcium\t180mg", "• Calcium 60mg"
    const directMgPatterns = [
      /calcium[:\s\t]+(\d+)\s*mg/i,
      /calcium[:\s\t]+(\d+)mg/i,
      /[•·]\s*calcium\s+(\d+)\s*mg/i,
      /calcium\s+(\d+)\s*mg/i
    ];

    for (const pattern of directMgPatterns) {
      const match = text.match(pattern);
      if (match) {
        const mgValue = parseInt(match[1]);
        if (this.isValidCalciumValue(mgValue)) {
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
        return mgValue;
      }
    }

    // Format 4: Percentage only (convert to mg)
    // Matches: "Calcium 25%", "Calcium: 30%"
    // Only use if no mg value found (lower confidence)
    const percentPattern = /calcium[:\s]+(\d+)%/i;
    const percentMatch = text.match(percentPattern);
    if (percentMatch) {
      const percent = parseInt(percentMatch[1]);
      if (percent > 0 && percent <= 100) {
        const mgValue = Math.round((percent / 100) * 1300); // FDA DV
        return mgValue;
      }
    }

    // Format 5: Reversed order "XXmg Calcium"
    // Less common but appears in some formats
    const reversedPattern = /(\d+)\s*mg\s+calcium/i;
    const reversedMatch = text.match(reversedPattern);
    if (reversedMatch) {
      const mgValue = parseInt(reversedMatch[1]);
      if (this.isValidCalciumValue(mgValue)) {
        return mgValue;
      }
    }

    return null;
  }

  /**
   * Validate calcium value is within reasonable range
   * Typical range: 0-2000mg (most products have 0-130% DV)
   */
  private isValidCalciumValue(value: number): boolean {
    return value > 0 && value <= 2000;
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
    console.log('parseServingSize: Starting with text:', text.substring(0, 100));

    // Priority 1: Spatial parsing (if elements available)
    if (elements && elements.length > 0) {
      const spatialResult = this.parseServingSizeFromSpatialElements(elements);
      if (spatialResult) {
        console.log('parseServingSize: Found via spatial elements:', spatialResult);
        return spatialResult;
      }
    }

    // Priority 2: Text pattern matching
    const textResult = this.parseServingSizeFromText(text);
    if (textResult) {
      console.log('parseServingSize: Found via text patterns:', textResult);
      return textResult;
    }

    console.log('parseServingSize: No serving size found');
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
    ).sort((a, b) => a.x - b.x); // Left to right

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
   * Parse serving size from raw text using comprehensive regex patterns
   */
  private parseServingSizeFromText(text: string): ServingInfo | null {
    // Pattern 1: Standard format with optional parenthetical
    // "Serving size 1/2 cup (120g)", "Serving size 2 tbsp (30ml)"
    const patterns = [
      /serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl\s*oz|g|ml|mL)(?:\s*\((\d+(?:\.\d+)?)\s*([a-zA-Z]+)\))?/i,

      // Pattern 2: Parenthetical first, then measure
      // "Serving size (240mL) 1 cup"
      /serving\s*size\s*\((\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)\s*([\d\.\/]+)\s*(cup|tbsp|tsp|bottle|slice|container)/i,

      // Pattern 3: Quantity and measure only
      // "Serving size 1 bottle"
      /serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*(cup|tbsp|tsp|bottle|slice|container|oz|g|ml|mL)/i,

      // Pattern 4: Just quantity with parenthetical
      // "1 bottle (296ml)"
      /^([\d\.\/]+)\s*(bottle|cup|tbsp|tsp|slice|container)\s*\((\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)/i
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
        } else {
          // Patterns 1, 3, 4: quantity first
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
   * Examples: "(240mL)", "(30g)", "(8 oz)"
   */
  private parseStandardMeasure(text: string): {value: number, unit: string} | null {
    const patterns = [
      /\((\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)/,  // "(240mL)" or "(30 g)"
      /\((\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)/,  // No space variant
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        // Validate unit is a standard measure
        if (/^(g|ml|mL|oz|fl)$/i.test(unit)) {
          return { value, unit };
        }
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
    console.log('Layer 1: Starting spatial parse with', elements.length, 'elements');

    const result: Partial<NutritionParseResult> = {
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null
    };

    // Strategy 1: Try table structure detection
    const tableResult = this.parseViaTableStructure(elements);
    if (tableResult.servingQuantity !== null || tableResult.calcium !== null) {
      console.log('Layer 1: Table structure found data');
      Object.assign(result, tableResult);

      // If we found everything, return early
      if (this.isComplete(result)) {
        console.log('Layer 1: Complete via table structure');
        return result;
      }
    }

    // Strategy 2: Line-based grouping (for non-table layouts)
    if (!this.isComplete(result)) {
      const lineResult = this.parseViaLineGrouping(elements);
      console.log('Layer 1: Line-based grouping results:', lineResult);

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
    }

    console.log('Layer 1: Spatial parse complete:', result);
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

    if (columns.length < 2 || rows.length < 3) {
      console.log('Layer 1: Insufficient table structure');
      return result;
    }

    console.log(`Layer 1: Detected ${columns.length} columns, ${rows.length} rows`);

    // Find serving size row
    const servingRow = rows.find(row =>
      row.elements.some(el => /serving\s*size/i.test(el.text))
    );

    if (servingRow) {
      const servingText = servingRow.elements.map(e => e.text).join(' ');
      const servingInfo = this.parseServingSize(servingText, servingRow.elements);

      if (servingInfo) {
        result.servingQuantity = servingInfo.quantity;
        result.servingMeasure = servingInfo.measure;
        result.standardMeasureValue = servingInfo.standardValue;
        result.standardMeasureUnit = servingInfo.standardUnit;
        console.log('Layer 1: Found serving via table:', servingInfo);
      }
    }

    // Find calcium row
    const calciumRow = rows.find(row =>
      row.elements.some(el => /calcium/i.test(el.text))
    );

    if (calciumRow) {
      const calciumText = calciumRow.elements.map(e => e.text).join(' ');
      const calciumValue = this.parseCalcium(calciumText, calciumRow.elements);

      if (calciumValue !== null) {
        result.calcium = calciumValue;
        console.log('Layer 1: Found calcium via table:', calciumValue);
      }
    }

    return result;
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
    console.log(`Layer 1: Grouped into ${lines.length} lines`);

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
          console.log('Layer 1: Found serving via line:', servingInfo);
        }
      }

      // Parse calcium
      if (!result.calcium && /calcium/i.test(lineText)) {
        const calciumValue = this.parseCalcium(lineText, line.elements);

        if (calciumValue !== null) {
          result.calcium = calciumValue;
          console.log('Layer 1: Found calcium via line:', calciumValue);
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

    // Sort by Y then X (reading order)
    const sorted = [...elements].sort((a, b) => {
      if (Math.abs(a.y - b.y) < 5) return a.x - b.x;
      return a.y - b.y;
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
    console.log('Layer 2: Starting regex parse on text');

    // Parse serving size if not found
    if (!result.servingQuantity || !result.servingMeasure) {
      const servingInfo = this.parseServingSize(text);

      if (servingInfo) {
        if (!result.servingQuantity) {
          result.servingQuantity = servingInfo.quantity;
          console.log('Layer 2: Found serving quantity:', servingInfo.quantity);
        }
        if (!result.servingMeasure) {
          result.servingMeasure = servingInfo.measure;
          console.log('Layer 2: Found serving measure:', servingInfo.measure);
        }
        if (!result.standardMeasureValue && servingInfo.standardValue) {
          result.standardMeasureValue = servingInfo.standardValue;
          result.standardMeasureUnit = servingInfo.standardUnit;
          console.log('Layer 2: Found standard measure:', servingInfo.standardValue + servingInfo.standardUnit);
        }
      }
    }

    // Parse calcium if not found
    if (!result.calcium) {
      const calciumValue = this.parseCalcium(text);

      if (calciumValue !== null) {
        result.calcium = calciumValue;
        console.log('Layer 2: Found calcium:', calciumValue);
      }
    }

    console.log('Layer 2: Regex parse complete');
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
    console.log('Layer 3: Starting fuzzy recovery');

    // OCR error corrections for common misreads
    const correctedText = this.applyOCRCorrections(text);

    // Try parsing again with corrected text
    if (!result.servingQuantity || !result.servingMeasure) {
      const servingInfo = this.parseServingSize(correctedText);

      if (servingInfo) {
        if (!result.servingQuantity) {
          result.servingQuantity = servingInfo.quantity;
          console.log('Layer 3: Found serving quantity via OCR correction:', servingInfo.quantity);
        }
        if (!result.servingMeasure) {
          result.servingMeasure = servingInfo.measure;
          console.log('Layer 3: Found serving measure via OCR correction:', servingInfo.measure);
        }
      }
    }

    if (!result.calcium) {
      const calciumValue = this.parseCalcium(correctedText);

      if (calciumValue !== null) {
        result.calcium = calciumValue;
        console.log('Layer 3: Found calcium via OCR correction:', calciumValue);
      }
    }

    // Fuzzy keyword matching (if elements available)
    if (elements && elements.length > 0) {
      if (!result.calcium) {
        const fuzzyCalcium = this.fuzzyMatchCalcium(elements, correctedText);
        if (fuzzyCalcium !== null) {
          result.calcium = fuzzyCalcium;
          console.log('Layer 3: Found calcium via fuzzy matching:', fuzzyCalcium);
        }
      }

      if (!result.servingQuantity || !result.servingMeasure) {
        const fuzzyServing = this.fuzzyMatchServing(elements);
        if (fuzzyServing) {
          if (!result.servingQuantity) {
            result.servingQuantity = fuzzyServing.quantity;
          }
          if (!result.servingMeasure) {
            result.servingMeasure = fuzzyServing.measure;
          }
          console.log('Layer 3: Found serving via fuzzy matching:', fuzzyServing);
        }
      }
    }

    console.log('Layer 3: Fuzzy recovery complete');
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
      console.log('OCR: Potential large misread detected:', rawText, '=', quantity);
      return false;
    }
    
    // Normal range validation
    if (quantity > 0 && quantity <= 10) {
      return true;
    }
    
    console.log('OCR: Serving quantity outside valid range:', quantity);
    return false;
  }

  private parseNutritionDataFallback(text: string, apiResponse: OCRResponse): NutritionParseResult {
    console.log('OCR: Using fallback parsing without spatial data');
    
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
    this.parseWithEnhancedRegex(preprocessedText, result);
    
    result.confidence = this.calculateConfidence(result);
    result.servingSize = this.buildLegacyServingSize(result);
    result.calciumValue = result.calcium;
    
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
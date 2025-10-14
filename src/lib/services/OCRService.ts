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

  private parseWithMultipleStrategies(rawText: string, lines: any[], apiResponse: OCRResponse): NutritionParseResult {
    const textElements: TextElement[] = this.extractTextElements(lines);
    
    // Enhanced debug logging for API structure
    console.log('OCR: Raw text preview:', rawText.substring(0, 200) + '...');
    console.log('OCR: API Response structure:', {
      totalLines: lines.length,
      sampleLines: lines.slice(0, 5).map(line => ({
        text: line.LineText,
        wordCount: line.Words?.length || 0,
        sampleWords: line.Words?.slice(0, 3).map(w => w.WordText) || []
      }))
    });
    
    // Log serving size related elements
    const servingElements = textElements.filter(el => 
      /serving|size|cup|tbsp|tsp|ml|mL|\d+|\(/.test(el.text)
    );
    console.log('OCR: Serving-related elements:', 
      servingElements.map(e => `"${e.text}"@(${e.x},${e.y})`));
    
    // Log calcium related elements  
    const calciumElements = textElements.filter(el =>
      /calcium|mg|\d+/i.test(el.text)
    );
    console.log('OCR: Calcium-related elements:', 
      calciumElements.slice(0, 10).map(e => `"${e.text}"@(${e.x},${e.y})`));
    
    const result: NutritionParseResult = {
      rawText: rawText,
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null,
      confidence: 'low'
    };
    
    // Apply preprocessing to all elements
    textElements.forEach(el => {
      el.text = this.preprocessSpatialText(el);
    });
    
    const preprocessedText = this.preprocessText(rawText);
    console.log('OCR: Preprocessed', textElements.length, 'spatial elements');
    
    // Define parsing strategies in order of preference
    const strategies: ParseStrategy[] = [
      {
        name: 'table_structure',
        priority: 1,
        parser: (elements, text, res) => this.parseWithTableStructure(elements, res)
      },
      {
        name: 'line_based_spatial',  // NEW: Line-based parsing
        priority: 2,
        parser: (elements, text, res) => this.parseWithLineBasedSpatial(elements, res)
      },
      {
        name: 'spatial_alignment',
        priority: 3,
        parser: (elements, text, res) => this.parseWithSpatialAlignment(elements, res)
      },
      {
        name: 'regex_enhanced',
        priority: 4,
        parser: (elements, text, res) => this.parseWithEnhancedRegex(text, res)
      },
      {
        name: 'fuzzy_matching',
        priority: 5,
        parser: (elements, text, res) => this.parseWithFuzzyMatching(elements, text, res)
      }
    ];
    
    // Try each strategy until we get good results
    for (const strategy of strategies) {
      console.log(`OCR: Trying ${strategy.name} strategy...`);
      
      const beforeState = { ...result };
      const success = strategy.parser(textElements, preprocessedText, result);
      
      if (this.isResultComplete(result)) {
        console.log(`OCR: ${strategy.name} strategy succeeded with complete results`);
        break;
      } else if (success && this.isResultBetter(result, beforeState)) {
        console.log(`OCR: ${strategy.name} strategy provided partial improvement`);
        // Keep improvements and try next strategy
      } else {
        console.log(`OCR: ${strategy.name} strategy failed, reverting changes`);
        Object.assign(result, beforeState);
      }
    }
    
    // Finalize result
    result.confidence = this.calculateConfidence(result);
    result.servingSize = this.buildLegacyServingSize(result);
    result.calciumValue = result.calcium;
    result.spatialResults = textElements;
    result.fullApiResponse = apiResponse;

    console.log('OCR: Final result:', {
      servingQuantity: result.servingQuantity,
      servingMeasure: result.servingMeasure,
      standardMeasure: (result.standardMeasureValue || '') + (result.standardMeasureUnit || ''),
      calcium: result.calcium,
      confidence: result.confidence
    });

    return result;
  }

  // === NEW: Line-based sequential parsing (handles reversed order) ===
  private getLineElements(textElements: TextElement[]): TextLine[] {
    if (!textElements || textElements.length === 0) return [];

    // Sort elements by Y then X to process them in reading order
    const sortedElements = [...textElements].sort((a, b) => {
      if (a.y < b.y) return -1;
      if (a.y > b.y) return 1;
      return a.x - b.x;
    });

    const lines: TextLine[] = [];
    let currentLine: TextLine = { text: '', elements: [], y: -1, height: -1 };
    const yTolerance = 15; // Vertical tolerance to group words into the same line

    for (const el of sortedElements) {
      if (currentLine.elements.length === 0) {
        // Start a new line
        currentLine = { text: el.text, elements: [el], y: el.y, height: el.height };
      } else {
        const lineCenterY = currentLine.y + currentLine.height / 2;
        const elCenterY = el.y + el.height / 2;

        // Check if the element is vertically aligned with the current line
        if (Math.abs(elCenterY - lineCenterY) < yTolerance) {
          currentLine.elements.push(el);
          currentLine.text += ' ' + el.text;
          // Update line's average Y and max height
          currentLine.y = (currentLine.y * (currentLine.elements.length - 1) + el.y) / currentLine.elements.length;
          currentLine.height = Math.max(currentLine.height, el.height);
        } else {
          // Finish the current line and start a new one
          lines.push(currentLine);
          currentLine = { text: el.text, elements: [el], y: el.y, height: el.height };
        }
      }
    }
    // Add the last line
    if (currentLine.elements.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  private parseWithLineBasedSpatial(textElements: TextElement[], result: NutritionParseResult): boolean {
    console.log('OCR: Using line-based spatial alignment strategy');
    const lines = this.getLineElements(textElements);

    let servingParsed = false;
    let calciumParsed = false;

    for (const line of lines) {
      const lineText = line.text.toLowerCase();
      const lineElements = line.elements;

      // --- PARSE SERVING SIZE (IMPROVED SEQUENTIAL LOGIC) ---
      if (!servingParsed && (lineText.includes('serving') || lineText.includes('size'))) {
        let startIndex = lineElements.findIndex(el => /size/i.test(el.text));
        if (startIndex === -1) {
          startIndex = lineElements.findIndex(el => /serving/i.test(el.text));
        }
        
        if (startIndex !== -1) {
          // Sequentially find quantity, then measure, then standard measure from the keyword's position
          let quantityIndex = -1;
          let measureIndex = -1;

          // 1. Find the first valid quantity immediately after the keyword
          for (let i = startIndex + 1; i < lineElements.length; i++) {
            const elText = lineElements[i].text.trim();
            const quantity = this.parseFraction(elText);
            if (quantity !== null && this.validateServingQuantity(quantity, elText)) {
              result.servingQuantity = quantity;
              quantityIndex = i;
              console.log('OCR: Found aligned serving quantity:', quantity);
              break; 
            }
          }

          // 2. If quantity is found, find the first valid measure immediately after it
          if (quantityIndex !== -1) {
            for (let i = quantityIndex + 1; i < lineElements.length; i++) {
              const elText = lineElements[i].text.trim().toLowerCase().replace(/s$/, '');
              if (/^(cup|tbsp|tsp|bottle|slice|oz|fl|g|ml|mL|container)$/i.test(elText)) {
                result.servingMeasure = elText;
                measureIndex = i;
                console.log('OCR: Found aligned serving measure:', elText);
                break;
              }
            }
          }
          
          // 3. Find the first parenthetical standard measure after the keyword
          const searchElementsForStandard = lineElements.slice(startIndex + 1);
          for (const element of searchElementsForStandard) {
            const standardMatch = element.text.match(/\(?(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)?/);
            if (standardMatch && /^(g|ml|mL|oz)$/i.test(standardMatch[2])) {
              result.standardMeasureValue = parseFloat(standardMatch[1]);
              result.standardMeasureUnit = standardMatch[2].toLowerCase();
              console.log('OCR: Found aligned standard measure:', result.standardMeasureValue + result.standardMeasureUnit);
              break; 
            }
          }
          
          if (result.servingQuantity && result.servingMeasure) {
            servingParsed = true;
          }
        }
      }

      // --- PARSE CALCIUM (ENHANCED WITH COMPACT PATTERNS) ---
      if (!calciumParsed && lineText.includes('calcium')) {
        const calciumIndex = lineElements.findIndex(el => /calcium/i.test(el.text));
        if (calciumIndex !== -1) {
          // Look for the first valid value immediately following "Calcium" on the same line
          for (let i = calciumIndex + 1; i < lineElements.length; i++) {
            const elementText = lineElements[i].text.trim();
            
            // Pattern: "380mg" or "190mg"
            const mgMatch = elementText.match(/^(\d+)mg$/i);
            if (mgMatch && parseInt(mgMatch[1]) <= 2000) {
              result.calcium = parseInt(mgMatch[1]);
              calciumParsed = true;
              console.log('OCR: Found calcium via line-based mg:', result.calcium);
              break;
            }
            
            // Pattern: "2%" (compact format)
            const percentMatch = elementText.match(/^(\d+)%$/);
            if (percentMatch && parseInt(percentMatch[1]) <= 100) {
              result.calcium = Math.round((parseInt(percentMatch[1]) / 100) * this.CALCIUM_DV_MG);
              calciumParsed = true;
              console.log('OCR: Found calcium via line-based %:', result.calcium);
              break;
            }
          }
        }
      }

      if (servingParsed && calciumParsed) break;
    }
    
    return servingParsed || calciumParsed;
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

  private parseWithTableStructure(textElements: TextElement[], result: NutritionParseResult): boolean {
    const { columns, rows } = this.detectTableStructure(textElements);
    
    if (columns.length < 2 || rows.length < 3) {
      console.log('OCR: Insufficient table structure detected');
      return false;
    }
    
    let servingParsed = false;
    let calciumParsed = false;
    
    // Find serving size row
    const servingRow = rows.find(row => 
      row.elements.some(el => /serving\s*size/i.test(el.text))
    );
    
    if (servingRow) {
      this.parseServingFromTableRow(servingRow, columns, result);
      servingParsed = result.servingQuantity !== null && result.servingMeasure !== null;
      console.log('OCR: Table serving parsed:', servingParsed);
    }
    
    // Find calcium row
    const calciumRow = rows.find(row => 
      row.elements.some(el => /^calcium$/i.test(el.text.trim()))
    );
    
    if (calciumRow) {
      this.parseCalciumFromTableRow(calciumRow, columns, result);
      calciumParsed = result.calcium !== null;
      console.log('OCR: Table calcium parsed:', calciumParsed);
    }
    
    return servingParsed && calciumParsed;
  }

  private parseServingFromTableRow(row: NutrientRow, columns: TableColumn[], result: NutritionParseResult): void {
    const valueElements = row.elements.filter(el => 
      columns.some(col => col.type !== 'label' && 
        Math.abs(el.x - col.x) <= col.width / 2)
    ).sort((a, b) => a.x - b.x);
    
    console.log('OCR: Serving row value elements:', valueElements.map(e => e.text));
    
    for (const element of valueElements) {
      const text = element.text.trim();
      
      if (!result.servingQuantity && /^[\d\.\/]+$/.test(text)) {
        result.servingQuantity = this.parseFraction(text);
        console.log('OCR: Found table serving quantity:', result.servingQuantity);
        continue;
      }
      
      if (!result.servingMeasure && /^(cup|tbsp|tsp|bottle|slice|oz|fl|g|ml|mL)s?$/i.test(text)) {
        result.servingMeasure = text.toLowerCase().replace(/s$/, '');
        console.log('OCR: Found table serving measure:', result.servingMeasure);
        continue;
      }
      
      // Look for parenthetical standard measure
      const parentheticalMatch = text.match(/^\(?(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)?$/);
      if (parentheticalMatch && !result.standardMeasureValue) {
        result.standardMeasureValue = parseFloat(parentheticalMatch[1]);
        result.standardMeasureUnit = parentheticalMatch[2].toLowerCase();
        console.log('OCR: Found table standard measure:', 
          result.standardMeasureValue, result.standardMeasureUnit);
      }
    }
  }

  private parseCalciumFromTableRow(row: NutrientRow, columns: TableColumn[], result: NutritionParseResult): void {
    const valueElements = row.elements.filter(el => 
      columns.some(col => col.type === 'value' && 
        Math.abs(el.x - col.x) <= col.width / 2)
    );
    
    const percentElements = row.elements.filter(el => 
      columns.some(col => col.type === 'percent' && 
        Math.abs(el.x - col.x) <= col.width / 2)
    );
    
    console.log('OCR: Calcium value elements:', valueElements.map(e => e.text));
    console.log('OCR: Calcium percent elements:', percentElements.map(e => e.text));
    
    // First priority: direct mg values
    for (const element of valueElements) {
      const text = element.text.trim();
      const mgMatch = text.match(/^(\d+(?:\.\d+)?)mg$/i);
      if (mgMatch) {
        result.calcium = Math.round(parseFloat(mgMatch[1]));
        console.log('OCR: Found table calcium mg:', result.calcium);
        return;
      }
      
      const numberMatch = text.match(/^(\d+(?:\.\d+)?)$/);
      if (numberMatch) {
        const value = parseFloat(numberMatch[1]);
        if (value >= 1 && value <= 2000) {
          result.calcium = Math.round(value);
          console.log('OCR: Found table calcium number (assuming mg):', result.calcium);
          return;
        }
      }
    }
    
    // Second priority: percentage conversion
    for (const element of percentElements) {
      const text = element.text.trim();
      const percentMatch = text.match(/^(\d+(?:\.\d+)?)%$/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        result.calcium = Math.round((percent / 100) * this.CALCIUM_DV_MG);
        console.log('OCR: Converted calcium percentage to mg:', percent + '%', '→', result.calcium + 'mg');
        return;
      }
    }
  }

  private groupByAlignment(textElements: TextElement[]): TextElement[][] {
    const groups: TextElement[][] = [];
    const yTolerance = 8;
    
    for (const element of textElements) {
      let foundGroup = false;
      for (const group of groups) {
        if (group.some(el => Math.abs(el.y - element.y) <= yTolerance)) {
          group.push(element);
          foundGroup = true;
          break;
        }
      }
      if (!foundGroup) {
        groups.push([element]);
      }
    }
    
    // Sort elements within each group by X coordinate
    groups.forEach(group => group.sort((a, b) => a.x - b.x));
    
    return groups;
  }

  private parseWithSpatialAlignment(textElements: TextElement[], result: NutritionParseResult): boolean {
    const alignmentGroups = this.groupByAlignment(textElements);
    
    let servingParsed = false;
    let calciumParsed = false;
    
    for (const group of alignmentGroups) {
      const groupText = group.map(el => el.text).join(' ');
      
      if (/serving\s*size/i.test(groupText)) {
        this.parseServingFromAlignedElements(group, result);
        servingParsed = result.servingQuantity !== null && result.servingMeasure !== null;
      }
      
      if (/calcium/i.test(groupText)) {
        this.parseCalciumFromAlignedElements(group, result);
        calciumParsed = result.calcium !== null;
      }
    }
    
    return servingParsed && calciumParsed;
  }

  private parseServingFromAlignedElements(elements: TextElement[], result: NutritionParseResult): void {
    const sortedElements = elements.sort((a, b) => a.x - b.x);
    
    for (let i = 0; i < sortedElements.length; i++) {
      const element = sortedElements[i];
      const text = element.text.trim();
      
      if (!result.servingQuantity) {
        const quantity = this.parseFraction(text);
        if (quantity !== null && this.validateServingQuantity(quantity, text)) {
          result.servingQuantity = quantity;
          console.log('OCR: Found aligned serving quantity:', quantity);
          continue;
        }
      }
      
      if (!result.servingMeasure && /^(cup|tbsp|tsp|bottle|slice|oz|fl|g|ml|mL)s?$/i.test(text)) {
        result.servingMeasure = text.toLowerCase().replace(/s$/, '');
        console.log('OCR: Found aligned serving measure:', result.servingMeasure);
        continue;
      }
      
      // Look for parenthetical standard measure
      if (!result.standardMeasureValue) {
        const parenMatch = text.match(/^\(?(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)?$/);
        if (parenMatch && /^(g|ml|mL|oz)$/i.test(parenMatch[2])) {
          const value = parseFloat(parenMatch[1]);
          if (value >= 10 && value <= 2000) {
            result.standardMeasureValue = value;
            result.standardMeasureUnit = parenMatch[2].toLowerCase();
            console.log('OCR: Found aligned standard measure:', 
              result.standardMeasureValue + result.standardMeasureUnit);
          }
        }
      }
    }
  }

  private parseCalciumFromAlignedElements(elements: TextElement[], result: NutritionParseResult): void {
    for (const element of elements) {
      const text = element.text.trim();
      
      const mgMatch = text.match(/^(\d+(?:\.\d+)?)mg$/i);
      if (mgMatch) {
        result.calcium = Math.round(parseFloat(mgMatch[1]));
        console.log('OCR: Found aligned calcium mg:', result.calcium);
        return;
      }
      
      const percentMatch = text.match(/^(\d+(?:\.\d+)?)%$/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        result.calcium = Math.round((percent / 100) * this.CALCIUM_DV_MG);
        console.log('OCR: Found aligned calcium %:', percent + '% =', result.calcium + 'mg');
        return;
      }
      
      const numberMatch = text.match(/^(\d+(?:\.\d+)?)$/);
      if (numberMatch && element.x > 200) {
        const value = parseFloat(numberMatch[1]);
        if (value >= 1 && value <= 2000) {
          result.calcium = Math.round(value);
          console.log('OCR: Found aligned calcium number:', result.calcium);
          return;
        }
      }
    }
  }

  private parseWithEnhancedRegex(text: string, result: NutritionParseResult): boolean {
    let servingParsed = false;
    let calciumParsed = false;
    
    // Enhanced serving size patterns
    const servingPatterns = [
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+|1\/2|1\/3|1\/4|2\/3|3\/4)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl\s*oz|g|ml|mL)(?:\s*\(([0-9\.]+)\s*([a-zA-Z]+)\))?/i,
      /Serving\s*size\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl\s*oz|g|ml|mL)\s*\(([0-9\.]+)\s*([a-zA-Z]+)\)/i,
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl|g|ml|mL)/i,
    ];
    
    for (const pattern of servingPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[1]) {
          const quantity = this.parseFraction(match[1].trim());
          if (quantity !== null && this.validateServingQuantity(quantity, match[1])) {
            result.servingQuantity = quantity;
          }
        }
        if (match[2]) result.servingMeasure = match[2].trim().toLowerCase().replace(/s$/, '');
        if (match[3]) result.standardMeasureValue = parseFloat(match[3]);
        if (match[4]) result.standardMeasureUnit = match[4].trim().toLowerCase();
        servingParsed = result.servingQuantity !== null && result.servingMeasure !== null;
        console.log('OCR: Enhanced regex found serving:', match[0]);
        break;
      }
    }
    
    // Enhanced calcium patterns (NEW: compact bullet format)
    const calciumPatterns = [
      { type: 'mg', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)mg/i },
      { type: 'mg', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg/i },
      { type: 'percent', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)%/i },
      { type: 'mg', pattern: /Calcium\s+(\d+(?:\.\d+)?)mg/i },
      { type: 'mg', pattern: /Calcium[^\d]*(\d+(?:\.\d+)?)mg/i },
      { type: 'percent', pattern: /Calcium[^\d]*(\d+(?:\.\d+)?)%/i },
      
      // NEW: Compact bullet format patterns
      { type: 'mg', pattern: /•\s*Calcium\s+(\d+)mg/i },
      { type: 'percent', pattern: /•\s*Calcium.*?(\d+)%/i },
      { type: 'percent', pattern: /Calcium\s+(\d+)%/i }, // Without bullet
    ];
    
    for (const { type, pattern } of calciumPatterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        if (type === 'mg' && value > 0 && value <= 2000) {
          result.calcium = Math.round(value);
        } else if (type === 'percent' && value > 0 && value <= 100) {
          result.calcium = Math.round((value / 100) * this.CALCIUM_DV_MG);
        }
        calciumParsed = result.calcium !== null;
        console.log('OCR: Enhanced regex found calcium:', match[0]);
        break;
      }
    }
    
    return servingParsed && calciumParsed;
  }

  private parseWithFuzzyMatching(textElements: TextElement[], text: string, result: NutritionParseResult): boolean {
    console.log('OCR: Using fuzzy matching as last resort');
    
    const servingElements = textElements.filter(el => 
      this.fuzzyMatch(el.text.toLowerCase(), 'serving') ||
      this.fuzzyMatch(el.text.toLowerCase(), 'size')
    );
    
    const calciumElements = textElements.filter(el => 
      this.fuzzyMatch(el.text.toLowerCase(), 'calcium') ||
      el.text.toLowerCase().includes('calc')
    );
    
    let hasResults = false;
    
    if (servingElements.length > 0) {
      const proximityThreshold = 100;
      for (const keyElement of servingElements) {
        const nearby = textElements.filter(el => {
          const distance = Math.sqrt(
            Math.pow(el.x - keyElement.x, 2) + Math.pow(el.y - keyElement.y, 2)
          );
          return distance <= proximityThreshold && el !== keyElement;
        }).sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.x - keyElement.x, 2) + Math.pow(a.y - keyElement.y, 2));
          const distB = Math.sqrt(Math.pow(b.x - keyElement.x, 2) + Math.pow(b.y - keyElement.y, 2));
          return distA - distB;
        });
        
        this.parseServingFromAlignedElements(nearby, result);
        if (result.servingQuantity && result.servingMeasure) {
          hasResults = true;
          break;
        }
      }
    }
    
    if (calciumElements.length > 0) {
      const proximityThreshold = 100;
      for (const keyElement of calciumElements) {
        const nearby = textElements.filter(el => {
          const distance = Math.sqrt(
            Math.pow(el.x - keyElement.x, 2) + Math.pow(el.y - keyElement.y, 2)
          );
          return distance <= proximityThreshold && el !== keyElement;
        });
        
        this.parseCalciumFromAlignedElements(nearby, result);
        if (result.calcium) {
          hasResults = true;
          break;
        }
      }
    }
    
    return hasResults;
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

  private isResultComplete(result: NutritionParseResult): boolean {
    return result.servingQuantity !== null && 
           result.servingMeasure !== null && 
           result.calcium !== null;
  }

  private isResultBetter(current: NutritionParseResult, previous: NutritionParseResult): boolean {
    const currentScore = this.scoreResult(current);
    const previousScore = this.scoreResult(previous);
    return currentScore > previousScore;
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

  private buildLegacyServingSize(result: NutritionParseResult): string | undefined {
    if (!result.servingQuantity || !result.servingMeasure) {
      return undefined;
    }
    
    let servingSize = `${result.servingQuantity} ${result.servingMeasure}`;
    
    if (result.standardMeasureValue && result.standardMeasureUnit) {
      servingSize += ` (${result.standardMeasureValue}${result.standardMeasureUnit})`;
    }
    
    return servingSize;
  }
}
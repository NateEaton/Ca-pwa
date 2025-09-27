// Enhanced OCRService.ts with improved parsing strategies

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
}

export class OCRService {
  private apiKey: string;
  private apiEndpoint: string;
  private readonly CALCIUM_DV_MG = 1300;
  private allTextElements: TextElement[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = 'https://api.ocr.space/parse/image';
  }

  async processImage(file: File): Promise<NutritionParseResult> {
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
        return this.parseWithMultipleStrategies(rawText, overlay.Lines, result);
      } else {
        console.log('OCR: No overlay data, using fallback parsing');
        return this.parseNutritionDataFallback(rawText, result);
      }

    } catch (error) {
      console.error('OCR processing failed:', error);
      throw error;
    }
  }

  private parseWithMultipleStrategies(rawText: string, lines: any[], apiResponse: OCRResponse): NutritionParseResult {
    const textElements: TextElement[] = this.extractTextElements(lines);
    
    // Store for use in helper methods
    this.allTextElements = textElements;    

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
      /serving|size|cup|tbsp|tsp|ml|mL|bottle|slice|container|\d+|\(/.test(el.text)
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
    
    // Apply enhanced preprocessing to all elements
    textElements.forEach(el => {
      el.text = this.preprocessSpatialText(el);
    });
    
    const preprocessedText = this.preprocessText(rawText);
    console.log('OCR: Preprocessed', textElements.length, 'spatial elements');
    
    // Define enhanced parsing strategies in order of preference
    const strategies: ParseStrategy[] = [
      {
        name: 'enhanced_table_structure',
        priority: 1,
        parser: (elements, text, res) => this.parseWithEnhancedTableStructure(elements, res)
      },
      {
        name: 'format_specific',
        priority: 2,
        parser: (elements, text, res) => this.parseWithFormatSpecific(elements, text, res)
      },
      {
        name: 'enhanced_spatial_alignment',
        priority: 3,
        parser: (elements, text, res) => this.parseWithEnhancedSpatialAlignment(elements, res)
      },
      {
        name: 'enhanced_regex',
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
    
    // Enhanced OCR character substitutions
    const charMappings: [RegExp, string][] = [
      // Common serving size fixes
      [/Sewing/gi, 'Serving'],
      [/Seruing/gi, 'Serving'],
      [/Serving\s*slze/gi, 'Serving size'],
      [/Serving\s*size/gi, 'Serving size'],
      
      // Unit corrections
      [/\brnL\b/gi, 'mL'],
      [/\bfog\b/gi, 'mg'],
      [/\blg\b/gi, 'g'],
      [/\bOg\b/gi, '0g'],
      [/\bOmg\b/gi, '0mg'],
      [/\b0mg\b/gi, '0mg'],
      [/\bDmg\b/gi, '0mg'],
      
      // Nutrient name fixes
      [/\bCholest[^\s]*\b/gi, 'Cholesterol'],
      [/\bVitamin\s*D/gi, 'Vitamin D'],
      [/\bCalclum/gi, 'Calcium'],
      [/\bCalcium/gi, 'Calcium'],
      
      // Fraction corrections for serving sizes
      [/\b1\s*I\s*2\b/gi, '1/2'],
      [/\b1I2\b/gi, '1/2'],
      [/\b112\b/gi, '1/2'],
      [/\bl\s*\/\s*2\b/gi, '1/2'],
      [/\bI\s*\/\s*2\b/gi, '1/2'],
      [/\b1\s*l\s*2\b/gi, '1/2'],
      [/\b2\s*I\s*3\b/gi, '2/3'],
      [/\b213\b/gi, '2/3'],
      [/\b1\s*I\s*3\b/gi, '1/3'],
      [/\b113\b/gi, '1/3'],
      [/\b1\s*I\s*4\b/gi, '1/4'],
      [/\b114\b/gi, '1/4'],
      [/\b3\s*I\s*4\b/gi, '3/4'],
      [/\b314\b/gi, '3/4'],
    ];
    
    for (const [pattern, replacement] of charMappings) {
      cleaned = cleaned.replace(pattern, replacement);
    }
    
    return cleaned;
  }

  private preprocessSpatialText(element: TextElement): string {
    let text = element.text;
    
    // Enhanced spatial-specific OCR corrections
    const spatialMappings: [RegExp, string][] = [
      // Fraction patterns (common in serving sizes)
      [/^1I2$/i, '1/2'],
      [/^112$/i, '1/2'],
      [/^l\/2$/i, '1/2'],
      [/^I\/2$/i, '1/2'],
      [/^2I3$/i, '2/3'],
      [/^213$/i, '2/3'],
      [/^1I3$/i, '1/3'],
      [/^113$/i, '1/3'],
      [/^1I4$/i, '1/4'],
      [/^114$/i, '1/4'],
      [/^3I4$/i, '3/4'],
      [/^314$/i, '3/4'],
      
      // Unit corrections
      [/^(\d+(?:\.\d+)?)rng$/i, '$1mg'],
      [/^(\d+(?:\.\d+)?)fog$/i, '$1mg'],
      [/^(\d+(?:\.\d+)?)rag$/i, '$1mg'],
      [/^(\d+(?:\.\d+)?)rnL$/i, '$1mL'],
      [/^(\d+(?:\.\d+)?)mL$/i, '$1mL'],
      [/^(\d+(?:\.\d+)?)ml$/i, '$1mL'],
      
      // Common OCR character fixes
      [/^O([a-zA-Z])$/i, '0$1'],
      [/^(\d+)O([a-zA-Z])$/i, '$10$2'],
      [/^l([a-zA-Z])$/i, '1$1'],
    ];
    
    for (const [pattern, replacement] of spatialMappings) {
      text = text.replace(pattern, replacement);
    }
    
    return text;
  }

  private parseWithEnhancedTableStructure(textElements: TextElement[], result: NutritionParseResult): boolean {
    const { columns, rows } = this.detectEnhancedTableStructure(textElements);
    
    if (columns.length < 2 || rows.length < 3) {
      console.log('OCR: Insufficient table structure detected');
      return false;
    }
    
    let servingParsed = false;
    let calciumParsed = false;
    
    // Find serving size row with enhanced matching
    const servingRow = rows.find(row => 
      row.elements.some(el => 
        /serving\s*size/i.test(el.text) || 
        /size/i.test(el.text) && row.elements.some(e => /serving/i.test(e.text))
      )
    );
    
    if (servingRow) {
      this.parseServingFromEnhancedTableRow(servingRow, columns, result);
      servingParsed = result.servingQuantity !== null && result.servingMeasure !== null;
      console.log('OCR: Enhanced table serving parsed:', servingParsed);
    }
    
    // Find calcium row with multiple strategies
    const calciumRow = this.findCalciumRow(rows);
    
    if (calciumRow) {
      this.parseCalciumFromEnhancedTableRow(calciumRow, columns, result);
      calciumParsed = result.calcium !== null;
      console.log('OCR: Enhanced table calcium parsed:', calciumParsed);
    }
    
    return servingParsed && calciumParsed;
  }

  private detectEnhancedTableStructure(textElements: TextElement[]): { columns: TableColumn[]; rows: NutrientRow[] } {
    // Group elements by Y coordinate (rows) with flexible tolerance
    const rowGroups = new Map<number, TextElement[]>();
    const yTolerance = 15; // Increased tolerance
    
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
    
    // Enhanced column identification with multiple thresholds
    const xPositions = textElements.map(e => e.x).sort((a, b) => a - b);
    let columns = this.identifyColumnsWithThreshold(xPositions, 40); // Try tight threshold first
    
    if (columns.length < 2) {
      columns = this.identifyColumnsWithThreshold(xPositions, 60); // Medium threshold
    }
    
    if (columns.length < 2) {
      columns = this.identifyColumnsWithThreshold(xPositions, 80); // Loose threshold
    }
    
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
    
    console.log(`OCR: Enhanced table detection - ${columns.length} columns and ${rows.length} rows`);
    return { columns, rows };
  }

  private identifyColumnsWithThreshold(xPositions: number[], clusterTolerance: number): TableColumn[] {
    // Cluster X positions to identify column boundaries
    const clusters: number[][] = [];
    
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
        width: Math.max(...cluster) - Math.min(...cluster) + clusterTolerance,
        type: index === 0 ? 'label' : 
              index === 1 ? 'value' : 
              index === 2 ? 'unit' : 'percent'
      };
    }).sort((a, b) => a.x - b.x);
    
    return columns;
  }

  private findCalciumRow(rows: NutrientRow[]): NutrientRow | undefined {
    // Try multiple calcium identification strategies
    
    // Strategy 1: Exact match
    let calciumRow = rows.find(row => 
      row.elements.some(el => /^calcium$/i.test(el.text.trim()))
    );
    
    if (calciumRow) return calciumRow;
    
    // Strategy 2: Contains calcium with mg value nearby
    calciumRow = rows.find(row => 
      row.elements.some(el => /calcium/i.test(el.text)) &&
      row.elements.some(el => /\d+mg/i.test(el.text))
    );
    
    if (calciumRow) return calciumRow;
    
    // Strategy 3: Row with mg value and "calcium" text anywhere in vicinity
    calciumRow = rows.find(row => {
      const hasCalciumText = row.elements.some(el => /calcium/i.test(el.text));
      const hasMgValue = row.elements.some(el => /\d+mg/i.test(el.text));
      return hasCalciumText || hasMgValue;
    });
    
    return calciumRow;
  }

  private parseServingFromEnhancedTableRow(row: NutrientRow, columns: TableColumn[], result: NutritionParseResult): void {
    // Get all value elements in the row, sorted by x position
    const valueElements = row.elements.filter(el => 
      !(/serving|size|nutrition|facts/i.test(el.text))
    ).sort((a, b) => a.x - b.x);
    
    console.log('OCR: Enhanced serving row elements:', valueElements.map(e => `"${e.text}"@(${e.x})`));
    
    // Try to find nearby elements that might be part of split parenthetical
    const nearbyElements = this.getAllNearbyElements(row, this.allTextElements, 20);
    const combinedElements = [...valueElements, ...nearbyElements].sort((a, b) => a.x - b.x);
    
    // Try to reconstruct split parenthetical expressions from nearby elements
    const combinedText = combinedElements.map(e => e.text).join(' ');
    const parentheticalMatch = combinedText.match(/\(\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s*\)/i);
    if (parentheticalMatch && !result.standardMeasureValue) {
      result.standardMeasureValue = parseFloat(parentheticalMatch[1]);
      result.standardMeasureUnit = parentheticalMatch[2].toLowerCase();
      console.log('OCR: Found combined standard measure:', result.standardMeasureValue + result.standardMeasureUnit);
    }
    
    for (let i = 0; i < valueElements.length; i++) {
      const element = valueElements[i];
      const text = element.text.trim();
      
      // Enhanced fraction parsing for serving quantity
      if (!result.servingQuantity) {
        const quantity = this.parseEnhancedFraction(text);
        if (quantity !== null && this.validateEnhancedServingQuantity(quantity, text)) {
          result.servingQuantity = quantity;
          console.log('OCR: Found enhanced table serving quantity:', result.servingQuantity);
          continue;
        }
      }
      
      // Enhanced serving measure detection
      if (!result.servingMeasure && /^(cup|tbsp|tsp|bottle|slice|oz|fl|g|ml|mL|container)s?$/i.test(text)) {
        result.servingMeasure = text.toLowerCase().replace(/s$/, '');
        console.log('OCR: Found enhanced table serving measure:', result.servingMeasure);
        continue;
      }
      
      // Look for split parenthetical - check if this element starts with (number
      if (!result.standardMeasureValue && /^\((\d+)/.test(text)) {
        const numberMatch = text.match(/^\((\d+(?:\.\d+)?)/);
        if (numberMatch) {
          // Look for unit in nearby elements (not just next element)
          for (const nearbyEl of nearbyElements) {
            const unitMatch = nearbyEl.text.match(/([a-zA-Z]+)\)?/);
            if (unitMatch) {
              result.standardMeasureValue = parseFloat(numberMatch[1]);
              result.standardMeasureUnit = unitMatch[1].toLowerCase();
              console.log('OCR: Found split standard measure from nearby:', result.standardMeasureValue + result.standardMeasureUnit);
              break;
            }
          }
        }
      }
      
      // Check next element for measure if current is quantity
      if (result.servingQuantity && !result.servingMeasure && i + 1 < valueElements.length) {
        const nextText = valueElements[i + 1].text.trim();
        if (/^(cup|tbsp|tsp|bottle|slice|oz|fl|g|ml|mL|container)/i.test(nextText)) {
          result.servingMeasure = nextText.toLowerCase().replace(/s$/, '');
          console.log('OCR: Found adjacent serving measure:', result.servingMeasure);
        }
      }
    }
  }

  private getAllNearbyElements(centerRow: NutrientRow, allElements: TextElement[], yTolerance: number): TextElement[] {
    return allElements.filter(el => {
      // Don't include elements already in the center row
      if (centerRow.elements.some(rowEl => rowEl.x === el.x && rowEl.y === el.y)) {
        return false;
      }
      // Include elements within Y tolerance of the center row
      return Math.abs(el.y - centerRow.y) <= yTolerance;
    });
  }

  private parseCalciumFromEnhancedTableRow(row: NutrientRow, columns: TableColumn[], result: NutritionParseResult): void {
    console.log('OCR: Enhanced calcium row elements:', row.elements.map(e => `"${e.text}"@(${e.x})`));
    
    // Look for direct mg values
    const mgElements = row.elements.filter(el => /^\d+mg$/i.test(el.text.trim()));
    console.log('OCR: Calcium mg elements:', mgElements.map(e => e.text));
    
    if (mgElements.length > 0) {
      const mgValue = parseInt(mgElements[0].text.replace(/[^\d]/g, ''));
      if (mgValue > 0 && mgValue <= 2000) { // Reasonable range for calcium
        result.calcium = mgValue;
        console.log('OCR: Found direct calcium mg value:', result.calcium);
        return;
      }
    }
    
    // Look for percentage values and convert
    const percentElements = row.elements.filter(el => /^\d+%$/i.test(el.text.trim()));
    console.log('OCR: Calcium percent elements:', percentElements.map(e => e.text));
    
    if (percentElements.length > 0) {
      const percentValue = parseInt(percentElements[0].text.replace(/[^\d]/g, ''));
      if (percentValue > 0 && percentValue <= 100) {
        result.calcium = Math.round((percentValue / 100) * this.CALCIUM_DV_MG);
        console.log('OCR: Found calcium from percentage:', percentValue + '% =', result.calcium + 'mg');
        return;
      }
    }
    
    // Enhanced pattern matching for combined values
    for (const element of row.elements) {
      const text = element.text;
      
      // Pattern: "380mg" or similar
      const mgMatch = text.match(/(\d+)mg/i);
      if (mgMatch) {
        const mgValue = parseInt(mgMatch[1]);
        if (mgValue > 0 && mgValue <= 2000) {
          result.calcium = mgValue;
          console.log('OCR: Found calcium from pattern match:', result.calcium);
          return;
        }
      }
      
      // Pattern: "30%" or similar  
      const percentMatch = text.match(/(\d+)%/);
      if (percentMatch) {
        const percentValue = parseInt(percentMatch[1]);
        if (percentValue > 0 && percentValue <= 100) {
          result.calcium = Math.round((percentValue / 100) * this.CALCIUM_DV_MG);
          console.log('OCR: Found calcium from percent pattern:', percentValue + '% =', result.calcium + 'mg');
          return;
        }
      }
    }
  }

  private parseWithFormatSpecific(textElements: TextElement[], rawText: string, result: NutritionParseResult): boolean {
    // Detect specific nutrition label formats and apply specialized parsing
    
    // Format 1: Compact single-column layout (like yogurt containers)
    if (this.isCompactSingleColumnFormat(textElements, rawText)) {
      console.log('OCR: Detected compact single-column format');
      return this.parseCompactSingleColumn(textElements, rawText, result);
    }
    
    // Format 2: Wide multi-column layout (like milk jugs)
    if (this.isWideMultiColumnFormat(textElements, rawText)) {
      console.log('OCR: Detected wide multi-column format');
      return this.parseWideMultiColumn(textElements, rawText, result);
    }
    
    // Format 3: Bottle/can format (like drinks)
    if (this.isBottleCanFormat(textElements, rawText)) {
      console.log('OCR: Detected bottle/can format');
      return this.parseBottleCanFormat(textElements, rawText, result);
    }
    
    return false;
  }

  private isCompactSingleColumnFormat(textElements: TextElement[], rawText: string): boolean {
    // Characteristics: narrow width, vitamins listed horizontally at bottom
    const xPositions = textElements.map(e => e.x);
    const width = Math.max(...xPositions) - Math.min(...xPositions);
    const hasHorizontalVitamins = /Vitamin D.*Calcium.*Iron.*Potassium/i.test(rawText);
    return width < 300 && hasHorizontalVitamins;
  }

  private isWideMultiColumnFormat(textElements: TextElement[], rawText: string): boolean {
    // Characteristics: wide layout, clear column separation
    const xPositions = textElements.map(e => e.x);
    const width = Math.max(...xPositions) - Math.min(...xPositions);
    return width > 500 && /Amount\/serving.*%\s*DV.*Amount\/serving.*%\s*DV/i.test(rawText);
  }

  private isBottleCanFormat(textElements: TextElement[], rawText: string): boolean {
    // Characteristics: bottle serving size, vertical layout
    return /bottle|serving\s*size.*bottle/i.test(rawText) || /207\s*ml|240\s*ml/i.test(rawText);
  }

  private parseCompactSingleColumn(textElements: TextElement[], rawText: string, result: NutritionParseResult): boolean {
    // For compact formats, calcium is often in the horizontal vitamin list
    const calciumMatch = rawText.match(/Calcium\s*(\d+)mg/i);
    if (calciumMatch) {
      result.calcium = parseInt(calciumMatch[1]);
      console.log('OCR: Found compact format calcium:', result.calcium);
    }
    
    // Serving size parsing for compact format
    return this.parseServingFromText(rawText, result) && result.calcium !== null;
  }

  private parseWideMultiColumn(textElements: TextElement[], rawText: string, result: NutritionParseResult): boolean {
    // Wide format usually has clear table structure
    return this.parseWithEnhancedTableStructure(textElements, result);
  }

  private parseBottleCanFormat(textElements: TextElement[], rawText: string, result: NutritionParseResult): boolean {
    // Bottle format has specific serving size patterns
    const bottleServingMatch = rawText.match(/Serving\s*size\s*1\s*bottle\s*\((\d+)\s*(ml|mL)\)/i);
    if (bottleServingMatch) {
      result.servingQuantity = 1;
      result.servingMeasure = 'bottle';
      result.standardMeasureValue = parseInt(bottleServingMatch[1]);
      result.standardMeasureUnit = 'ml';
      console.log('OCR: Found bottle serving format');
    }
    
    // Look for calcium in standard table format
    const calciumMatch = rawText.match(/Calcium\s*(\d+)mg/i);
    if (calciumMatch) {
      result.calcium = parseInt(calciumMatch[1]);
      console.log('OCR: Found bottle format calcium:', result.calcium);
    }
    
    return result.servingQuantity !== null && result.calcium !== null;
  }

  private parseWithEnhancedSpatialAlignment(textElements: TextElement[], result: NutritionParseResult): boolean {
    // Enhanced spatial alignment with better proximity matching
    console.log('OCR: Using enhanced spatial alignment strategy');
    
    let servingParsed = false;
    let calciumParsed = false;
    
    // Find serving-related keywords
    const servingKeywords = textElements.filter(el => 
      /serving|size/i.test(el.text) && !/nutrition|facts/i.test(el.text)
    );
    
    for (const keyword of servingKeywords) {
      const proximityElements = this.getProximityElements(keyword, textElements, 150);
      
      // Enhanced serving parsing from nearby elements
      for (const el of proximityElements) {
        const text = el.text.trim();
        
        // Try to parse as fraction/quantity
        if (!result.servingQuantity) {
          const quantity = this.parseEnhancedFraction(text);
          if (quantity !== null && this.validateEnhancedServingQuantity(quantity, text)) {
            result.servingQuantity = quantity;
            console.log('OCR: Found serving quantity via spatial alignment:', quantity);
          }
        }
        
        // Try to parse as measure
        if (!result.servingMeasure && /^(cup|tbsp|tsp|bottle|slice|oz|fl|g|ml|mL|container)s?$/i.test(text)) {
          result.servingMeasure = text.toLowerCase().replace(/s$/, '');
          console.log('OCR: Found serving measure via spatial alignment:', result.servingMeasure);
        }
        
        // Try to parse standard measure from parenthetical
        if (!result.standardMeasureValue) {
          const standardMatch = text.match(/\(?(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)?/);
          if (standardMatch && /^(g|ml|mL|oz)$/i.test(standardMatch[2])) {
            result.standardMeasureValue = parseFloat(standardMatch[1]);
            result.standardMeasureUnit = standardMatch[2].toLowerCase();
            console.log('OCR: Found standard measure via spatial alignment:', 
              result.standardMeasureValue + result.standardMeasureUnit);
          }
        }
      }
      
      if (result.servingQuantity && result.servingMeasure) {
        servingParsed = true;
        break;
      }
    }
    
    // Find calcium-related keywords
    const calciumKeywords = textElements.filter(el => /calcium/i.test(el.text));
    
    for (const keyword of calciumKeywords) {
      const proximityElements = this.getProximityElements(keyword, textElements, 100);
      
      // Enhanced calcium parsing from nearby elements
      for (const el of proximityElements) {
        const text = el.text.trim();
        
        // Direct mg value
        const mgMatch = text.match(/^(\d+)mg$/i);
        if (mgMatch) {
          const mgValue = parseInt(mgMatch[1]);
          if (mgValue > 0 && mgValue <= 2000) {
            result.calcium = mgValue;
            console.log('OCR: Found calcium mg via spatial alignment:', result.calcium);
            calciumParsed = true;
            break;
          }
        }
        
        // Percentage value
        const percentMatch = text.match(/^(\d+)%$/i);
        if (percentMatch) {
          const percentValue = parseInt(percentMatch[1]);
          if (percentValue > 0 && percentValue <= 100) {
            result.calcium = Math.round((percentValue / 100) * this.CALCIUM_DV_MG);
            console.log('OCR: Found calcium % via spatial alignment:', percentValue + '% =', result.calcium + 'mg');
            calciumParsed = true;
            break;
          }
        }
      }
      
      if (calciumParsed) break;
    }
    
    return servingParsed || calciumParsed;
  }

  private parseWithEnhancedRegex(text: string, result: NutritionParseResult): boolean {
    let servingParsed = false;
    let calciumParsed = false;
    
    // Enhanced serving size patterns
    const servingPatterns = [
      // Standard patterns with enhanced fraction support
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+|1\/2|1\/3|1\/4|2\/3|3\/4)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl\s*oz|g|ml|mL)(?:\s*\(([0-9\.]+)\s*([a-zA-Z]+)\))?/i,
      /Serving\s*size\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl\s*oz|g|ml|mL)\s*\(([0-9\.]+)\s*([a-zA-Z]+)\)/i,
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl|g|ml|mL)/i,
      
      // Compact format patterns
      /(\d+(?:\.\d+)?)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl|g|ml|mL)\s*\(([0-9\.]+)\s*([a-zA-Z]+)\)/i,
      /([\d\.\/]+|1\/2|1\/3|1\/4|2\/3|3\/4)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl|g|ml|mL)/i,
    ];
    
    for (const pattern of servingPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[1]) {
          const quantity = this.parseEnhancedFraction(match[1].trim());
          if (quantity !== null && this.validateEnhancedServingQuantity(quantity, match[1])) {
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
    
    // Enhanced calcium patterns
    const calciumPatterns = [
      { type: 'mg', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)mg/i },
      { type: 'mg', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg/i },
      { type: 'percent', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)%/i },
      { type: 'mg', pattern: /Calcium\s+(\d+(?:\.\d+)?)mg/i },
      { type: 'mg', pattern: /Calcium[^\d]*(\d+(?:\.\d+)?)mg/i },
      { type: 'percent', pattern: /Calcium[^\d]*(\d+(?:\.\d+)?)%/i },
      
      // Compact format patterns
      { type: 'mg', pattern: /•\s*Calcium\s+(\d+)mg/i },
      { type: 'percent', pattern: /•\s*Calcium.*?(\d+)%/i },
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
    // Enhanced fuzzy matching as last resort
    console.log('OCR: Using enhanced fuzzy matching strategy');
    
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
      hasResults = this.parseWithEnhancedProximity(servingElements, textElements, result, 'serving') || hasResults;
    }
    
    if (calciumElements.length > 0) {
      hasResults = this.parseWithEnhancedProximity(calciumElements, textElements, result, 'calcium') || hasResults;
    }
    
    return hasResults;
  }

  private parseEnhancedFraction(text: string): number | null {
    if (!text) return null;
    
    // Handle common fraction formats
    const fractionPatterns = [
      // Standard fractions
      { pattern: /^(\d+)\/(\d+)$/, handler: (m: RegExpMatchArray) => parseFloat(m[1]) / parseFloat(m[2]) },
      { pattern: /^(\d+)\s+(\d+)\/(\d+)$/, handler: (m: RegExpMatchArray) => parseFloat(m[1]) + (parseFloat(m[2]) / parseFloat(m[3])) },
      
      // Decimal numbers
      { pattern: /^(\d+\.?\d*)$/, handler: (m: RegExpMatchArray) => parseFloat(m[1]) },
      
      // Common OCR misreads corrected
      { pattern: /^1I2$|^112$|^l\/2$|^I\/2$/i, handler: () => 0.5 },
      { pattern: /^2I3$|^213$/i, handler: () => 2/3 },
      { pattern: /^1I3$|^113$/i, handler: () => 1/3 },
      { pattern: /^1I4$|^114$/i, handler: () => 0.25 },
      { pattern: /^3I4$|^314$/i, handler: () => 0.75 },
    ];
    
    for (const { pattern, handler } of fractionPatterns) {
      const match = text.match(pattern);
      if (match) {
        const result = handler(match);
        if (result > 0 && result <= 20) { // Reasonable serving size range
          return result;
        }
      }
    }
    
    return null;
  }

  private validateEnhancedServingQuantity(quantity: number, rawText: string): boolean {
    // Enhanced validation that's less restrictive but still sensible
    
    // Handle very large misreads (like "112" for "1/2")
    if (quantity > 50 && /^\d{2,3}$/.test(rawText)) {
      console.log('OCR: Potential large misread detected:', rawText, '=', quantity);
      return false;
    }
    
    // Normal range validation - more permissive than before
    if (quantity > 0 && quantity <= 20) {
      return true;
    }
    
    // Special case: allow some larger values for containers/bottles
    if (quantity > 20 && quantity <= 100 && /container|bottle/i.test(rawText)) {
      return true;
    }
    
    console.log('OCR: Serving quantity outside valid range:', quantity);
    return false;
  }

  private getProximityElements(centerElement: TextElement, allElements: TextElement[], threshold: number): TextElement[] {
    return allElements.filter(el => {
      if (el === centerElement) return false;
      const distance = Math.sqrt(
        Math.pow(el.x - centerElement.x, 2) + Math.pow(el.y - centerElement.y, 2)
      );
      return distance <= threshold;
    }).sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.x - centerElement.x, 2) + Math.pow(a.y - centerElement.y, 2));
      const distB = Math.sqrt(Math.pow(b.x - centerElement.x, 2) + Math.pow(b.y - centerElement.y, 2));
      return distA - distB;
    });
  }

  private parseWithEnhancedProximity(keyElements: TextElement[], allElements: TextElement[], result: NutritionParseResult, type: 'serving' | 'calcium'): boolean {
    const proximityThreshold = 120; // Increased threshold
    let hasResults = false;
    
    for (const keyElement of keyElements) {
      const nearbyElements = this.getProximityElements(keyElement, allElements, proximityThreshold);
      
      if (type === 'serving') {
        const beforeResults = { servingQuantity: result.servingQuantity, servingMeasure: result.servingMeasure };
        this.parseServingFromAlignedElements(nearbyElements, result);
        if (result.servingQuantity !== beforeResults.servingQuantity || 
            result.servingMeasure !== beforeResults.servingMeasure) {
          hasResults = true;
        }
      } else if (type === 'calcium') {
        const beforeCalcium = result.calcium;
        this.parseCalciumFromAlignedElements(nearbyElements, result);
        if (result.calcium !== beforeCalcium) {
          hasResults = true;
        }
      }
      
      // If we found what we need, stop looking
      if ((type === 'serving' && result.servingQuantity && result.servingMeasure) ||
          (type === 'calcium' && result.calcium)) {
        break;
      }
    }
    
    return hasResults;
  }

  private parseServingFromAlignedElements(elements: TextElement[], result: NutritionParseResult): void {
    for (const element of elements) {
      const text = element.text.trim();
      
      // Try quantity parsing
      if (!result.servingQuantity) {
        const quantity = this.parseEnhancedFraction(text);
        if (quantity !== null && this.validateEnhancedServingQuantity(quantity, text)) {
          result.servingQuantity = quantity;
          console.log('OCR: Found aligned serving quantity:', quantity);
          continue;
        }
      }
      
      // Try measure parsing
      if (!result.servingMeasure && /^(cup|tbsp|tsp|bottle|slice|container|oz|fl|g|ml|mL)s?$/i.test(text)) {
        result.servingMeasure = text.toLowerCase().replace(/s$/, '');
        console.log('OCR: Found aligned serving measure:', result.servingMeasure);
        continue;
      }
      
      // Try standard measure parsing
      if (!result.standardMeasureValue) {
        const standardMatch = text.match(/^\(?(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\)?$/);
        if (standardMatch && /^(g|ml|mL|oz)$/i.test(standardMatch[2])) {
          result.standardMeasureValue = parseFloat(standardMatch[1]);
          result.standardMeasureUnit = standardMatch[2].toLowerCase();
          console.log('OCR: Found aligned standard measure:', 
            result.standardMeasureValue + result.standardMeasureUnit);
        }
      }
    }
  }

  private parseCalciumFromAlignedElements(elements: TextElement[], result: NutritionParseResult): void {
    for (const element of elements) {
      const text = element.text.trim();
      
      // Direct mg value
      const mgMatch = text.match(/^(\d+)mg$/i);
      if (mgMatch) {
        const mgValue = parseInt(mgMatch[1]);
        if (mgValue > 0 && mgValue <= 2000) {
          result.calcium = mgValue;
          console.log('OCR: Found aligned calcium mg:', result.calcium);
          return;
        }
      }
      
      // Percentage value
      const percentMatch = text.match(/^(\d+)%$/i);
      if (percentMatch) {
        const percentValue = parseInt(percentMatch[1]);
        if (percentValue > 0 && percentValue <= 100) {
          result.calcium = Math.round((percentValue / 100) * this.CALCIUM_DV_MG);
          console.log('OCR: Found aligned calcium %:', percentValue + '% =', result.calcium + 'mg');
          return;
        }
      }
      
      // Combined pattern
      const combinedMatch = text.match(/(\d+)(mg|%)/i);
      if (combinedMatch) {
        const value = parseInt(combinedMatch[1]);
        const unit = combinedMatch[2].toLowerCase();
        
        if (unit === 'mg' && value > 0 && value <= 2000) {
          result.calcium = value;
          console.log('OCR: Found aligned calcium combined mg:', result.calcium);
          return;
        } else if (unit === '%' && value > 0 && value <= 100) {
          result.calcium = Math.round((value / 100) * this.CALCIUM_DV_MG);
          console.log('OCR: Found aligned calcium combined %:', value + '% =', result.calcium + 'mg');
          return;
        }
      }
    }
  }

  private parseServingFromText(text: string, result: NutritionParseResult): boolean {
    // Fallback serving parsing from raw text
    const servingMatch = text.match(/Serving\s*size\s*[:\-]?\s*([\d\.\/]+|1\/2|1\/3|1\/4|2\/3|3\/4)\s*(cup|tbsp|tsp|bottle|slice|container|oz|fl|g|ml|mL)/i);
    if (servingMatch) {
      const quantity = this.parseEnhancedFraction(servingMatch[1]);
      if (quantity !== null && this.validateEnhancedServingQuantity(quantity, servingMatch[1])) {
        result.servingQuantity = quantity;
        result.servingMeasure = servingMatch[2].toLowerCase();
        return true;
      }
    }
    return false;
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

  private parseNutritionDataFallback(rawText: string, apiResponse: OCRResponse): NutritionParseResult {
    console.log('OCR: Using fallback parsing without spatial data');
    
    const result: NutritionParseResult = {
      rawText,
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null,
      confidence: 'low',
      spatialResults: [],
      fullApiResponse: apiResponse
    };
    
    const preprocessedText = this.preprocessText(rawText);
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
    if (result.servingQuantity !== null) score += 3;
    if (result.servingMeasure !== null) score += 3;
    if (result.standardMeasureValue !== null) score += 2;
    if (result.standardMeasureUnit !== null) score += 1;
    if (result.calcium !== null) score += 4;
    return score;
  }

  private calculateConfidence(result: NutritionParseResult): 'low' | 'medium' | 'high' {
    const score = this.scoreResult(result);
    const maxScore = 13; // Updated max score
    
    const percentage = score / maxScore;
    
    if (percentage >= 0.85) return 'high';
    if (percentage >= 0.6) return 'medium';
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
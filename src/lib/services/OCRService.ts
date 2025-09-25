// Complete enhanced OCRService.ts with all improvements

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
        name: 'spatial_alignment',
        priority: 2,
        parser: (elements, text, res) => this.parseWithSpatialAlignment(elements, res)
      },
      {
        name: 'regex_enhanced',
        priority: 3,
        parser: (elements, text, res) => this.parseWithEnhancedRegex(text, res)
      },
      {
        name: 'fuzzy_matching',
        priority: 4,
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
      standardMeasure: result.standardMeasureValue + result.standardMeasureUnit,
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
      
      // Unicode artifacts from OCR (fixed character ranges)
      [/[À-ÿ]/g, ''], // Remove extended Latin characters
      [/[€£¥]/g, ''], // Currency symbol artifacts  
      [/Ã…/g, 'A'], // A with ring
      [/Ã˜/g, 'O'], // O with stroke
      [/ÃŸ/g, 'ss'], // German eszett
      [/â‚¬/g, ''], // Euro symbol artifacts
      [/Ã/g, ''], // Common OCR artifact prefix
      
      // Percentage formatting fixes
      [/(\d+)\/0/g, '$1%'],
      [/(\d+)\\0/g, '$1%'],
      [/(\d+)0\/0/g, '$1%'],
      [/(\d+)\/o/gi, '$1%'],
      [/(\d+)\s*0\/0/g, '$1%'],
      
      // Unit fixes
      [/\bmcg\b/gi, 'mcg'],
      [/\bIU\b/gi, 'IU'],
      [/\bfl\s*oz\b/gi, 'fl oz'],
    ];
    
    for (const [pattern, replacement] of charMappings) {
      cleaned = cleaned.replace(pattern, replacement);
    }
    
    // Normalize whitespace but preserve line structure
    cleaned = cleaned
      .replace(/\t+/g, ' ')
      .replace(/ +/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
    
    return cleaned;
  }

  private preprocessSpatialText(element: TextElement): string {
    let text = element.text.trim();
    
    // Common single-word OCR errors
    const wordMappings: [RegExp, string][] = [
      [/^0g$/i, '0g'],
      [/^Og$/i, '0g'], 
      [/^0mg$/i, '0mg'],
      [/^Omg$/i, '0mg'],
      [/^tbsp$/i, 'tbsp'],
      [/^tsp$/i, 'tsp'],
      [/^cup$/i, 'cup'],
      [/^cups$/i, 'cup'],
      [/^serving$/i, 'serving'],
      [/^size$/i, 'size'],
      [/^calcium$/i, 'Calcium'],
      [/^potassium$/i, 'Potassium'],
      [/^sodium$/i, 'Sodium'],
      [/^cholesterol$/i, 'Cholesterol'],
      
      // Handle measurements with OCR errors
      [/^(\d+(?:\.\d+)?)rng$/i, '$1mg'],
      [/^(\d+(?:\.\d+)?)fog$/i, '$1mg'],
      [/^(\d+(?:\.\d+)?)rag$/i, '$1mg'],
      [/^(\d+(?:\.\d+)?)rnL$/i, '$1mL'],
      [/^(\d+(?:\.\d+)?)mL$/i, '$1mL'],
      [/^(\d+(?:\.\d+)?)ml$/i, '$1mL'],
    ];
    
    for (const [pattern, replacement] of wordMappings) {
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

  private parseServingFromAlignedElements(elements: TextElement[], result: NutritionParseResult): void {
    // Sort elements by X position for left-to-right processing
    const sortedElements = elements.sort((a, b) => a.x - b.x);
    
    for (let i = 0; i < sortedElements.length; i++) {
      const element = sortedElements[i];
      let text = element.text.trim();
      
      // Apply OCR corrections before parsing
      text = this.correctCommonOCRErrors(text);
      
      if (!result.servingQuantity && /^[\d\.\/]+$/.test(text)) {
        const quantity = this.parseFraction(text);
        if (this.validateServingQuantity(quantity, element.text)) {
          result.servingQuantity = quantity;
          console.log('OCR: Found serving quantity:', result.servingQuantity);
        }
        continue;
      }
      
      if (!result.servingMeasure && /^(cup|tbsp|tsp|bottle|slice|oz|fl|g|ml|mL)s?$/i.test(text)) {
        result.servingMeasure = text.toLowerCase().replace(/s$/, '');
        console.log('OCR: Found serving measure:', result.servingMeasure);
        continue;
      }
      
      // Look for parenthetical standard measure - handle split elements
      if (!result.standardMeasureValue) {
        // Check for "(240" format
        const parenMatch = text.match(/^\(?(\d+(?:\.\d+)?)/);
        if (parenMatch) {
          const value = parseFloat(parenMatch[1]);
          if (value >= 10 && value <= 2000) { // Reasonable standard measure range
            result.standardMeasureValue = value;
            console.log('OCR: Found standard measure value:', value);
            
            // Look ahead for the unit in next elements
            for (let j = i + 1; j < Math.min(i + 3, sortedElements.length); j++) {
              const nextText = sortedElements[j].text.trim();
              const unitMatch = nextText.match(/^([a-zA-Z]+)\)?$/);
              if (unitMatch && /^(g|mg|ml|mL|oz|fl)$/i.test(unitMatch[1])) {
                result.standardMeasureUnit = unitMatch[1].toLowerCase();
                console.log('OCR: Found standard measure unit:', result.standardMeasureUnit);
                break;
              }
            }
          }
        }
        
        // Look for combined format like "240mL" or complete "(240mL)"
        const combinedMatch = text.match(/^[\(\[]?(\d+(?:\.\d+)?)\s*([a-zA-Z]+)[\)\]]?$/);
        if (combinedMatch) {
          const value = parseFloat(combinedMatch[1]);
          if (value >= 10 && value <= 2000) {
            result.standardMeasureValue = value;
            result.standardMeasureUnit = combinedMatch[2].toLowerCase();
            console.log('OCR: Found combined standard measure:', result.standardMeasureValue, result.standardMeasureUnit);
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
        return;
      }
      
      const percentMatch = text.match(/^(\d+(?:\.\d+)?)%$/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        result.calcium = Math.round((percent / 100) * this.CALCIUM_DV_MG);
        return;
      }
      
      const numberMatch = text.match(/^(\d+(?:\.\d+)?)$/);
      if (numberMatch && element.x > 200) { // Likely in value column
        const value = parseFloat(numberMatch[1]);
        if (value >= 1 && value <= 2000) {
          result.calcium = Math.round(value);
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
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s*\(\s*([\d\.]+)\s*([a-zA-Z]+)\s*\)/i,
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*([a-zA-Z]+)\s*\(\s*([\d\.]+)\s*([a-zA-Z]+)\s*\)/i,
      /Serving\s*size\s+[:\-]?\s*([\d\.\/]+)\s+([a-zA-Z]+)(?:\s+\(([0-9\.]+)\s*([a-zA-Z]+)\))?/i,
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*([a-zA-Z]+)/i,
    ];
    
    for (const pattern of servingPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[1]) result.servingQuantity = this.parseFraction(match[1].trim());
        if (match[2]) result.servingMeasure = match[2].trim().toLowerCase();
        if (match[3]) result.standardMeasureValue = parseFloat(match[3]);
        if (match[4]) result.standardMeasureUnit = match[4].trim().toLowerCase();
        servingParsed = true;
        console.log('OCR: Regex found serving:', match[0]);
        break;
      }
    }
    
    // Enhanced calcium patterns
    const calciumPatterns = [
      { type: 'mg', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)mg/i },
      { type: 'percent', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)%/i },
      { type: 'mg', pattern: /Calcium\s+(\d+(?:\.\d+)?)mg/i },
      { type: 'mg', pattern: /Calcium\s*[:\-]\s*(\d+(?:\.\d+)?)mg/i },
      { type: 'mg', pattern: /Calcium[^\d]*(\d+(?:\.\d+)?)mg/i },
    ];
    
    for (const { type, pattern } of calciumPatterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        if (type === 'mg') {
          result.calcium = Math.round(value);
        } else if (type === 'percent') {
          result.calcium = Math.round((value / 100) * this.CALCIUM_DV_MG);
        }
        calciumParsed = true;
        console.log('OCR: Regex found calcium:', match[0]);
        break;
      }
    }
    
    return servingParsed && calciumParsed;
  }

  private parseWithFuzzyMatching(textElements: TextElement[], text: string, result: NutritionParseResult): boolean {
    // Implementation of fuzzy matching as last resort
    console.log('OCR: Using fuzzy matching as last resort');
    
    const servingElements = textElements.filter(el => 
      this.fuzzyMatch(el.text.toLowerCase(), 'serving') ||
      this.fuzzyMatch(el.text.toLowerCase(), 'size')
    );
    
    const calciumElements = textElements.filter(el => 
      this.fuzzyMatch(el.text.toLowerCase(), 'calcium')
    );
    
    if (servingElements.length > 0) {
      this.parseWithProximity(servingElements, textElements, result, 'serving');
    }
    
    if (calciumElements.length > 0) {
      this.parseWithProximity(calciumElements, textElements, result, 'calcium');
    }
    
    return result.servingQuantity !== null && result.calcium !== null;
  }

  private fuzzyMatch(text: string, target: string, threshold: number = 0.7): boolean {
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

  private parseWithProximity(keyElements: TextElement[], allElements: TextElement[], result: NutritionParseResult, type: 'serving' | 'calcium'): void {
    const proximityThreshold = 100; // pixels
    
    for (const keyElement of keyElements) {
      const nearbyElements = allElements.filter(el => {
        const distance = Math.sqrt(
          Math.pow(el.x - keyElement.x, 2) + Math.pow(el.y - keyElement.y, 2)
        );
        return distance <= proximityThreshold && el !== keyElement;
      }).sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.x - keyElement.x, 2) + Math.pow(a.y - keyElement.y, 2));
        const distB = Math.sqrt(Math.pow(b.x - keyElement.x, 2) + Math.pow(b.y - keyElement.y, 2));
        return distA - distB;
      });
      
      if (type === 'serving') {
        this.parseServingFromAlignedElements(nearbyElements, result);
      } else if (type === 'calcium') {
        this.parseCalciumFromAlignedElements(nearbyElements, result);
      }
      
      // If we found what we need, stop looking
      if ((type === 'serving' && result.servingQuantity && result.servingMeasure) ||
          (type === 'calcium' && result.calcium)) {
        break;
      }
    }
  }

  private parseFraction(text: string): number {
    const fractionPatterns = [
      /^(\d+)\/(\d+)$/,
      /^(\d+)\s*\/\s*(\d+)$/,
      /^(\d+)\.(\d+)$/,
      /^(\d+)$/,
    ];
    
    for (const pattern of fractionPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (pattern.source.includes('/')) {
          const numerator = parseFloat(match[1]);
          const denominator = parseFloat(match[2]);
          if (denominator !== 0) {
            return numerator / denominator;
          }
        } else {
          return parseFloat(match[0]);
        }
      }
    }
    
    const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      return parseFloat(numberMatch[1]);
    }
    
    return 0;
  }

  private parseNutritionDataFallback(text: string, apiResponse: OCRResponse): NutritionParseResult {
    console.log('OCR: Using enhanced fallback regex parsing');
    
    const cleanedText = this.preprocessText(text);
    const result: NutritionParseResult = {
      rawText: text,
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null,
      confidence: 'low'
    };

    this.parseWithEnhancedRegex(cleanedText, result);
    
    result.confidence = this.calculateConfidence(result);
    result.servingSize = this.buildLegacyServingSize(result);
    result.calciumValue = result.calcium;
    result.spatialResults = [];
    result.fullApiResponse = apiResponse;

    return result;
  }

  private correctCommonOCRErrors(text: string): string {
    const ocrCorrections: [RegExp, string][] = [
      // Common fraction misreads
      [/^112\s*cup$/i, '1/2 cup'],
      [/^114\s*cup$/i, '1/4 cup'],  
      [/^134\s*cup$/i, '3/4 cup'],
      [/^113\s*cup$/i, '1/3 cup'],
      [/^112\s*tbsp$/i, '1/2 tbsp'],
      [/^114\s*tbsp$/i, '1/4 tbsp'],
      
      // Common character substitutions in quantities
      [/^(\d+)l(\d+)/, '$1/$2'], // "1l2" → "1/2"  
      [/^(\d+)I(\d+)/, '$1/$2'], // "1I2" → "1/2" (capital i)
      [/^l(\d+)/, '1/$1'], // "l2" → "1/2"
      [/^I(\d+)/, '1/$1'], // "I2" → "1/2"
    ];

    let corrected = text;
    for (const [pattern, replacement] of ocrCorrections) {
      corrected = corrected.replace(pattern, replacement);
    }
    return corrected;
  }  

  private validateServingQuantity(quantity: number, rawText: string): boolean {
    // If it looks like a misread fraction (e.g., 112), likely invalid
    if (quantity > 10 && /^\d{3}$/.test(rawText)) {
      console.log('OCR: Potential misread fraction detected:', rawText);
      return false;
    }
    
    // Normal range check
    return quantity > 0 && quantity <= 10;
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
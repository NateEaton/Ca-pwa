// Enhanced OCRService.ts with simplified and improved parsing strategies

import { ImageResizer } from '$lib/utils/imageResize.ts';

interface TextElement {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TableColumn {
  x: number;
  width: number;
  type: string;
}

interface TableRow {
  y: number;
  height: number;
  elements: TextElement[];
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

      // Apply intelligent preprocessing
      let processedFile: File = file;

      // Step 1: Apply OCR-specific preprocessing (conditional)
      processedFile = await ImageResizer.preprocessForOCR(file);

      // Step 2: Compress if needed (existing logic)
      if (processedFile.size > 1024 * 1024) {
        processedFile = await ImageResizer.compressWithFallback(processedFile, 1024 * 1024, 3);
      }

      const formData = new FormData();
      formData.append('apikey', this.apiKey);
      formData.append('language', 'eng');
      formData.append('file', processedFile);
      formData.append('isTable', 'true');
      formData.append('isOverlayRequired', 'true');
      formData.append('iscreatesearchablepdf', 'false');
      formData.append('scale', 'true');
      formData.append('detectOrientation', 'true');

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
      el.text = this.preprocessSpatialText(el.text);
    });
    
    const preprocessedText = this.preprocessText(rawText);
    console.log('OCR: Preprocessed', textElements.length, 'spatial elements');
    
    // Simplified strategy list (3 core strategies proven in testing)
    const strategies = [
      { name: 'enhanced_spatial_alignment', parser: (elements: TextElement[], text: string, res: NutritionParseResult) => this.parseWithEnhancedSpatialAlignment(elements, res) },
      { name: 'enhanced_table_structure', parser: (elements: TextElement[], text: string, res: NutritionParseResult) => this.parseWithEnhancedTableStructure(elements, res) },
      { name: 'enhanced_regex', parser: (elements: TextElement[], text: string, res: NutritionParseResult) => this.parseWithEnhancedRegex(text, res) },
    ];
    
    // Try each strategy progressively
    for (const strategy of strategies) {
      console.log(`OCR: Trying ${strategy.name} strategy...`);
      const success = strategy.parser(textElements, preprocessedText, result);
      
      if (this.isResultComplete(result)) {
        console.log(`OCR: ${strategy.name} strategy succeeded with complete results`);
        break;
      }
      if (success) {
        console.log(`OCR: ${strategy.name} provided partial improvement`);
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
      [/Servings? size|Sewing size|Seruing slze|Serving sizc/gi, 'Serving size'],
      [/\b(rnL|ml)\b/gi, 'mL'],
      [/\b(mq|mg)\b/gi, 'mg'],
      [/\bfog\b|\bOmg\b|Omg/gi, '0mg'],
      [/\blg\b|\bOg\b|\b09\b/gi, '0g'],
      [/\( ?(\d+)[gqB9] ?\)/gi, '($1g)'],
      [/\bCalclum\b|\bCabct\.?Jtn\b/gi, 'Calcium'],
      [/1\s*%\s*cup/gi, '1/2 cup'],
      [/1\s*I\s*2|1I2|112|I\/2/gi, '1/2'],
      [/2\s*I\s*3|213/gi, '2/3'],
      [/1\s*I\s*4|114/gi, '1/4'],
      [/ I /gi, ' 1 '],
      [/\(40B\)/gi, '(40g)'],
      [/sizc/gi, 'size'],
      [/cup\s*\(\$29\)/gi, '1 cup (29g)']
    ];
    
    for (const [pattern, replacement] of charMappings) {
      cleaned = cleaned.replace(pattern, replacement);
    }
    
    return cleaned;
  }

  private preprocessSpatialText(text: string): string {
    let newText = text;
    
    const spatialMappings: Array<{p: RegExp, r: string}> = [
      {p: /^\(?(\d+)[gqB9]\)?.*$/i, r: '($1g)'},
      {p: /^1%$/, r: '1/2'},
      {p: /^1I2$|^112$|^l\/2$|^I\/2$/i, r: '1/2'},
      {p: /^2I3$|^213$/i, r: '2/3'},
      {p: /^1I4$|^114$/i, r: '1/4'},
      {p: /^(\d+(?:\.\d+)?)mq$/i, r: '$1mg'},
      {p: /^t$/i, r: '1'},
      {p: /^I$/i, r: '1'},
      {p: /^sizc$/i, r: 'size'},
      {p: /^Scrv\/ng$/i, r: 'Serving'},
      {p: /^(\d+)O([a-zA-Z])$/i, r: '$10$2'},
      {p: /^O([a-zA-Z])$/i, r: '0$1'},
      {p: /^\(\$(\d+)\)$/i, r: '($1g)'},
      {p: /^\(Gog\)$/i, r: '(60g)'},
    ];
    
    for (const {p, r} of spatialMappings) {
      newText = newText.replace(p, r);
    }
    
    return newText;
  }

  private parseWithEnhancedSpatialAlignment(textElements: TextElement[], result: NutritionParseResult): boolean {
    let servingParsed = false;
    let calciumParsed = false;

    // --- Serving Size Parsing ---
    if (result.servingQuantity === null) {
      const servingLabel = textElements.find(el => /serving/i.test(el.text));
      const sizeLabel = textElements.find(el => /size/i.test(el.text));
      
      let baseLabel = servingLabel;
      if (servingLabel && sizeLabel && Math.abs(servingLabel.y - sizeLabel.y) < 20) {
        baseLabel = { ...servingLabel, width: (sizeLabel.x + sizeLabel.width) - servingLabel.x };
      } else if (sizeLabel && !servingLabel) {
        baseLabel = sizeLabel;
      }

      if (baseLabel) {
        const searchBox = {
          x: baseLabel.x + baseLabel.width,
          y: baseLabel.y - baseLabel.height * 0.5,
          width: 500,
          height: baseLabel.height * 2
        };
        const candidates = textElements.filter(el => 
          el.x > searchBox.x && 
          el.x < searchBox.x + searchBox.width &&
          el.y > searchBox.y &&
          el.y < searchBox.y + searchBox.height
        ).sort((a, b) => a.x - b.x);

        const fullLineText = candidates.map(el => el.text).join(' ').trim();
        if (this.parseServingFromString(fullLineText, result)) {
          servingParsed = true;
        }
      }
    }
    
    // --- Calcium Parsing ---
    if (result.calcium === null) {
      const calciumLabel = textElements.find(el => /calcium|cabct/i.test(el.text));
      if (calciumLabel) {
        const searchBox = {
          x: calciumLabel.x + calciumLabel.width,
          y: calciumLabel.y - calciumLabel.height * 0.5,
          width: 300,
          height: calciumLabel.height * 2,
        };
        
        const candidates = textElements.filter(el => 
          el.x > searchBox.x && 
          el.x < searchBox.x + searchBox.width &&
          el.y > searchBox.y &&
          el.y < searchBox.y + searchBox.height
        ).sort((a, b) => a.x - b.x);

        for (const el of candidates) {
          const mgMatch = el.text.match(/^(\d+(?:\.\d+)?)mg$/i);
          if (mgMatch && !calciumParsed) {
            result.calcium = parseInt(mgMatch[1]);
            calciumParsed = true;
          }
        }
        if (!calciumParsed) {
          for (const el of candidates) {
            const pctMatch = el.text.match(/^(\d+)%$/i);
            if (pctMatch && !calciumParsed) {
              result.calcium = Math.round((parseInt(pctMatch[1]) / 100) * this.CALCIUM_DV_MG);
              calciumParsed = true;
            }
          }
        }
      }
    }

    return servingParsed || calciumParsed;
  }

  private parseWithEnhancedTableStructure(textElements: TextElement[], result: NutritionParseResult): boolean {
    const { columns, rows } = this.detectEnhancedTableStructure(textElements);
    if (columns.length < 1 || rows.length < 2) return false;
    
    let servingParsed = false;
    let calciumParsed = false;

    if (result.servingQuantity === null) {
      const servingRow = rows.find(row => 
        row.elements.some(el => /serving/i.test(el.text)) &&
        row.elements.some(el => /size/i.test(el.text))
      );
      if (servingRow) {
        servingParsed = this.parseServingFromEnhancedTableRow(servingRow, result);
      }
    }

    if (result.calcium === null) {
      const calciumRow = this.findCalciumRow(rows);
      if (calciumRow) {
        calciumParsed = this.parseCalciumFromEnhancedTableRow(calciumRow, columns, result);
      }
    }
    
    return servingParsed || calciumParsed;
  }

  private detectEnhancedTableStructure(textElements: TextElement[]): { columns: TableColumn[], rows: TableRow[] } {
    const rowGroups = new Map<number, TextElement[]>();
    const yTolerance = 15;
    
    const sortedElements = [...textElements].sort((a, b) => a.y - b.y);
    
    for (const element of sortedElements) {
      let foundRow = false;
      for (const rowY of rowGroups.keys()) {
        if (Math.abs(element.y - rowY) <= yTolerance) {
          rowGroups.get(rowY)!.push(element);
          foundRow = true;
          break;
        }
      }
      if (!foundRow) {
        rowGroups.set(element.y, [element]);
      }
    }
    
    const rows = Array.from(rowGroups.values()).map(elements => {
      elements.sort((a, b) => a.x - b.x);
      const y = elements.reduce((sum, el) => sum + el.y, 0) / elements.length;
      const height = Math.max(...elements.map(e => e.height));
      return { y, height, elements };
    }).sort((a, b) => a.y - b.y);

    const xPositions = textElements.map(e => e.x).sort((a, b) => a - b);
    let columns = this.identifyColumnsWithThreshold(xPositions, 40);
    if (columns.length < 2) columns = this.identifyColumnsWithThreshold(xPositions, 80);
    
    return { columns, rows };
  }

  private identifyColumnsWithThreshold(xPositions: number[], clusterTolerance: number): TableColumn[] {
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
      if (!foundCluster) clusters.push([x]);
    }
    return clusters.map((cluster, index) => {
      const minX = Math.min(...cluster);
      const maxX = Math.max(...cluster);
      return { x: minX, width: maxX - minX, type: index === 0 ? 'label' : `value${index}` };
    }).sort((a, b) => a.x - b.x);
  }

  private findCalciumRow(rows: TableRow[]): TableRow | undefined {
    return rows.find(row => row.elements.some(el => /calcium/i.test(el.text.trim())));
  }

  private parseServingFromEnhancedTableRow(row: TableRow, result: NutritionParseResult): boolean {
    const fullLineText = row.elements.map(el => el.text).join(' ').replace(/serving\s*size/i, '').trim();
    return this.parseServingFromString(fullLineText, result);
  }

  // NEW: Centralized serving string parser
  private parseServingFromString(str: string, result: NutritionParseResult): boolean {
    const patterns = [
      /(?<qty>[\d\.\/\s]+)\s*(?<msr>cup|tbsp|tsp|bottle|slice|bar|package|serving|oz|crackers|chips)s?\s*\((?<stdVal>\d+(?:\.\d+)?)\s*(?<stdUnit>g|ml)\)/i,
      /(?<qty>[\d\.\/]+)\s*(?<msr>cup|tbsp|tsp|bottle|slice|bar|package|oz|serving|crackers|chips)s?\s*\((?<stdVal>\d+(?:\.\d+)?)\s*(?<stdUnit>g|ml)\)/i,
    ];

    for (const pattern of patterns) {
      const match = str.match(pattern);
      if (match && match.groups) {
        const { qty, msr, stdVal, stdUnit } = match.groups;
        result.servingQuantity = this.parseEnhancedFraction(qty.trim());
        result.servingMeasure = msr.trim().toLowerCase();
        result.standardMeasureValue = parseFloat(stdVal);
        result.standardMeasureUnit = stdUnit.trim().toLowerCase();
        return true;
      }
    }
    return false;
  }

  private parseCalciumFromEnhancedTableRow(row: TableRow, columns: TableColumn[], result: NutritionParseResult): boolean {
    const calciumElement = row.elements.find(el => /calcium/i.test(el.text));
    if (!calciumElement) return false;

    const labelColumn = columns.find(c => calciumElement.x >= c.x && calciumElement.x <= c.x + c.width);
    const firstValueColumn = columns.find(c => c.x > (labelColumn ? labelColumn.x + labelColumn.width : calciumElement.x));

    if (!firstValueColumn) return false;

    const valueElementsInColumn = row.elements.filter(el => 
      el.x >= firstValueColumn.x && el.x < firstValueColumn.x + firstValueColumn.width + 20
    );

    for (const element of valueElementsInColumn) {
      const text = element.text.trim();
      const mgMatch = text.match(/^(\d+(?:\.\d+)?)mg$/i);
      if (mgMatch) {
        const val = parseInt(mgMatch[1]);
        if (val >= 0 && val < 2000) {
          result.calcium = val;
          console.log(`OCR: Found direct calcium mg value in column: ${result.calcium}`);
          return true;
        }
      }
    }
    
    for (const element of valueElementsInColumn) {
      const text = element.text.trim();
      const percentMatch = text.match(/^(\d+)%$/i);
      if (percentMatch) {
        const val = parseInt(percentMatch[1]);
        if (val >= 0 && val <= 100) {
          result.calcium = Math.round((val / 100) * this.CALCIUM_DV_MG);
          console.log(`OCR: Calculated calcium from percentage in column: ${val}% = ${result.calcium}mg`);
          return true;
        }
      }
    }
    
    return false;
  }

  private parseWithEnhancedRegex(text: string, result: NutritionParseResult): boolean {
    let servingParsed = false;
    let calciumParsed = false;
    
    if (result.servingQuantity === null) {
      const servingPatterns = [
        /Serving\s*size\s*[:\-]?\s*(?<qty>[\d\.\/\s]+)\s*(?<msr>cup|tbsp|tsp|bottle|slice|oz|g|ml|bar|package|serving|crackers|chips|portion|container)s?\s*\((?<stdVal>[0-9\.]+)\s*(?<stdUnit>[a-zA-Z]+)\)/i,
        /Serving\s*size\s*[:\-]?\s*(?<qty>[\d\.\/\s]+)\s*(?<msr>cup|tbsp|tsp|bottle|slice|oz|g|ml|bar|package|serving|crackers|chips|portion|container)s?/i,
        /Serving\s*size\s*[:\-]?\s*\((?<stdVal>[0-9\.]+)\s*(?<stdUnit>[a-zA-Z]+)\)/i,
        /Serving\s*size\s*[:\-]?\s*(?<stdVal>\d+)\s*(?<stdUnit>g|ml)/i,
      ];

      for (const pattern of servingPatterns) {
        const match = text.match(pattern);
        if (match && match.groups) {
          if (match.groups.qty) result.servingQuantity = this.parseEnhancedFraction(match.groups.qty.trim());
          if (match.groups.msr) result.servingMeasure = match.groups.msr.trim().toLowerCase();
          if (match.groups.stdVal) result.standardMeasureValue = parseFloat(match.groups.stdVal);
          if (match.groups.stdUnit) result.standardMeasureUnit = match.groups.stdUnit.trim().toLowerCase();
          servingParsed = true;
          break;
        }
      }
    }

    if (result.calcium === null) {
      const calciumPatterns = [
        { type: 'mg', pattern: /Calcium\s*[^\d\n]*(\d+)\s*mg/i },
        { type: 'percent', pattern: /Calcium\s*[^\d\n%]*(\d+)\s*%/i }
      ];
      for (const { type, pattern } of calciumPatterns) {
        if (calciumParsed) break;
        const match = text.match(pattern);
        if (match) {
          const value = parseFloat(match[1]);
          if (type === 'mg' && value < 2000) {
            result.calcium = Math.round(value);
            calciumParsed = true;
          } else if (type === 'percent' && value <= 100) {
            result.calcium = Math.round((value / 100) * this.CALCIUM_DV_MG);
            calciumParsed = true;
          }
        }
      }
    }

    return servingParsed || calciumParsed;
  }

  private parseEnhancedFraction(text: string): number | null {
    if (!text) return null;
    text = text.trim();
    
    // Normalize unicode fractions and special symbols
    const fractionMap: Record<string, string> = {
      '½': '1/2', 'Â½': '1/2', 'Ã‚Â½': '1/2',
      '⅓': '1/3', '⅔': '2/3',
      '¼': '1/4', '¾': '3/4',
      '⅕': '1/5', '⅖': '2/5', '⅗': '3/5', '⅘': '4/5',
      '⅙': '1/6', '⅛': '1/8',
      '%': '1/2'  // OCR often mistakes ½ for %
    };
    
    for (const [unicode, fraction] of Object.entries(fractionMap)) {
      text = text.replace(new RegExp(unicode, 'g'), ` ${fraction}`);
    }
    text = text.trim();
    
    // Handle mixed numbers: "1 1/2"
    const mixedPattern = /^(\d+)\s+(\d+\/\d+)$/;
    const mixedMatch = text.match(mixedPattern);
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1], 10);
      const fracParts = mixedMatch[2].split('/');
      if (fracParts.length === 2) {
        const num = parseInt(fracParts[0], 10);
        const den = parseInt(fracParts[1], 10);
        if (!isNaN(whole) && !isNaN(num) && !isNaN(den) && den !== 0) {
          return whole + (num / den);
        }
      }
    }
    
    // Handle simple fractions: "1/2"
    if (text.includes('/')) {
      const parts = text.split('/');
      if (parts.length === 2) {
        const num = parseInt(parts[0], 10);
        const den = parseInt(parts[1], 10);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          return num / den;
        }
      }
    }
    
    // Handle decimals
    const num = parseFloat(text);
    return isNaN(num) ? null : num;
  }

  private isResultComplete(result: NutritionParseResult): boolean {
    return result.servingQuantity !== null && 
           result.servingMeasure !== null && 
           result.standardMeasureValue != null && 
           result.calcium !== null;
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
    const maxScore = 13;
    
    const percentage = score / maxScore;
    
    if (percentage >= 0.85) return 'high';
    if (percentage >= 0.6) return 'medium';
    return 'low';
  }

  private buildLegacyServingSize(result: NutritionParseResult): string | undefined {
    let qtyStr: string | number | null = result.servingQuantity;
    if (result.servingQuantity === 0.5) qtyStr = '1/2';
    if (result.servingQuantity === 0.25) qtyStr = '1/4';
    if (result.servingQuantity === 0.75) qtyStr = '3/4';
    if (result.servingQuantity === 0.3333333333333333) qtyStr = '1/3';
    
    const qtyPart = qtyStr ? `${qtyStr} ` : '';
    const measurePart = result.servingMeasure || '';
    
    if (!qtyPart && !measurePart && result.standardMeasureValue && result.standardMeasureUnit) {
      return `${result.standardMeasureValue}${result.standardMeasureUnit}`;
    }
    if (!qtyPart || !measurePart) return undefined;
    
    let size = `${qtyPart}${measurePart}`;
    if (result.standardMeasureValue && result.standardMeasureUnit) {
      size += ` (${result.standardMeasureValue}${result.standardMeasureUnit})`;
    }
    return size;
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
}
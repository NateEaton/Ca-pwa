/*
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

import { ImageResizer } from '$lib/utils/imageResize.ts';

interface OCRResponse {
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
  ParsedResults?: Array<{
    ParsedText: string;
  }>;
}

export interface NutritionParseResult {
  rawText: string;
  servingQuantity: number | null;
  servingMeasure: string | null;
  standardMeasureValue: number | null;
  standardMeasureUnit: string | null;
  calcium: number | null; // Always in mg
  confidence: 'high' | 'medium' | 'low';
  
  // Legacy properties for backward compatibility
  servingSize?: string;
  calciumValue?: number;
}

export class OCRService {
  private apiKey: string;
  private apiEndpoint: string;
  private readonly CALCIUM_DV_MG = 1300; // FDA Daily Value for calcium

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = 'https://api.ocr.space/parse/image';
  }

  async processImage(file: File): Promise<NutritionParseResult> {
    console.log('OCR: Starting image processing...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    try {
      // Validate file
      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      // Validate API key
      if (!this.apiKey || this.apiKey === 'YOUR_OCR_SPACE_KEY') {
        throw new Error('OCR API key not configured. Please check your environment settings.');
      }

      // Compress image if needed (OCR.space has 1MB limit)
      let processedFile: File = file;
      if (file.size > 1024 * 1024) { // 1MB limit
        console.log('OCR: Compressing large image from', file.size, 'bytes');
        try {
          processedFile = await ImageResizer.compressWithFallback(file, 1024 * 1024, 3);
          console.log('OCR: Compressed to', processedFile.size, 'bytes');
        } catch (compressionError) {
          console.error('OCR: Image compression failed:', compressionError);
          throw new Error('Image is too large and could not be compressed. Please try a smaller image.');
        }
      } else {
        console.log('OCR: Image size OK:', file.size, 'bytes');
      }

      const formData = new FormData();
      formData.append('apikey', this.apiKey);
      formData.append('language', 'eng');
      formData.append('file', processedFile);
      formData.append('isOverlayRequired', 'false');
      formData.append('iscreatesearchablepdf', 'false');
      formData.append('issearchablepdfhidetextlayer', 'false');
      
      // **NEW**: Enable table recognition for nutrition labels
      formData.append('isTable', 'true');

      console.log('OCR: Making API request to', this.apiEndpoint, '(table mode enabled)');

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      console.log('OCR: API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OCR: API error response:', errorText);
        throw new Error(`OCR API error: ${response.status} - ${response.statusText}`);
      }

      const result: OCRResponse = await response.json();
      console.log('OCR: API response data:', result);

      if (!result || result.IsErroredOnProcessing) {
        const errorMsg = result?.ErrorMessage || 'Unknown OCR processing error';
        console.error('OCR: Processing error:', errorMsg);
        throw new Error(`OCR processing failed: ${errorMsg}`);
      }

      if (!result.ParsedResults || result.ParsedResults.length === 0) {
        throw new Error('No text detected in image. Please try a clearer photo of the nutrition label.');
      }

      const rawText = result.ParsedResults[0].ParsedText;
      console.log('OCR: Extracted text (table mode):', rawText);

      if (!rawText || rawText.trim().length === 0) {
        throw new Error('No readable text found. Please ensure the nutrition label is clearly visible.');
      }

      return this.parseNutritionData(rawText);

    } catch (error) {
      console.error('OCR processing failed:', error);

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error: Unable to connect to OCR service. Please check your internet connection.');
        }
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error('Network error: Please check your internet connection and try again.');
        }
      }

      throw error;
    }
  }

  private parseNutritionData(text: string): NutritionParseResult {
    console.log('OCR: Parsing nutrition data from table-structured text...');
    
    // Preprocess text to clean OCR artifacts
    const cleanedText = this.preprocessText(text);
    console.log('OCR: Cleaned text:', cleanedText);
    
    const result: NutritionParseResult = {
      rawText: text,
      servingQuantity: null,
      servingMeasure: null,
      standardMeasureValue: null,
      standardMeasureUnit: null,
      calcium: null,
      confidence: 'low'
    };

    // Parse serving size
    this.parseServingSize(cleanedText, result);
    
    // Parse calcium with enhanced table-aware patterns
    this.parseCalciumFromTable(cleanedText, result);
    
    // Calculate confidence
    result.confidence = this.calculateConfidence(result);
    
    // Add legacy properties for backward compatibility
    result.servingSize = this.buildLegacyServingSize(result);
    result.calciumValue = result.calcium;

    console.log('OCR: Final parse result:', result);
    return result;
  }

  private preprocessText(text: string): string {
    return text
      // Fix common OCR substitutions
      .replace(/Sewing/gi, 'Serving')
      .replace(/\brnL\b/gi, 'mL')
      .replace(/\bmcg\b/gi, 'mcg')
      .replace(/\bfog\b/gi, 'mg')
      .replace(/\blg\b/gi, 'g')
      .replace(/\bOg\b/gi, '0g')
      .replace(/\bOmg\b/gi, '0mg')
      // Fix percentage symbols that get misread
      .replace(/00\/0/g, '0%')
      .replace(/80\/0/g, '8%')
      .replace(/300\/0/g, '30%')
      .replace(/(\d+)\/0/g, '$1%')
      // Fix fractions
      .replace(/(\d+)\s*I\s*(\d+)/g, '$1/$2')
      .replace(/(\d+)\s*\/\s*(\d+)/g, '$1/$2')
      // Fix tabular OCR spacing issues
      .replace(/(\d+)\s+(\d+)mg/g, '$1mg $2mg') // Split combined values
      // Normalize whitespace
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private parseServingSize(text: string, result: NutritionParseResult): void {
    // Enhanced patterns for table-structured serving sizes
    const servingPatterns = [
      // Standard format: "Serving size 2Tbsp(11g)"
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s*\(\s*([\d\.]+)\s*([a-zA-Z]+)\s*\)/i,
      // Multi-line format: "Serving size" on one line, details on next
      /Serving\s*size\s*[:\-]?\s*\n?\s*([\d\.\/]+)\s*([a-zA-Z]+)\s*\(\s*([\d\.]+)\s*([a-zA-Z]+)\s*\)/i,
      // Table format: values might be separated by spaces or tabs
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*(Tbsp|tbsp|cup|cups|slice|slices|bottle|bottles|can|cans|serving|servings)\s*\(\s*([\d\.]+)\s*([a-zA-Z]+)\s*\)/i,
      // Handle cases where parenthetical info is on different line
      /Serving\s*size\s*[:\-]?\s*([\d\.\/]+)\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i,
      // Very loose pattern for difficult OCR
      /Serving.*?(\d+\.?\d*)\s*([a-zA-Z]+)/i
    ];

    for (const pattern of servingPatterns) {
      const match = text.match(pattern);
      if (match) {
        console.log('OCR: Found serving size match:', match[0]);
        
        // Group 1: Quantity
        if (match[1]) {
          result.servingQuantity = this.parseFraction(match[1].trim());
        }
        
        // Group 2: Measure (cup, bottle, slice, etc.)
        if (match[2]) {
          result.servingMeasure = match[2].trim().toLowerCase();
        }
        
        // Group 3: Standard Value (if present)
        if (match[3]) {
          result.standardMeasureValue = parseFloat(match[3]);
        }
        
        // Group 4: Standard Unit (if present)
        if (match[4]) {
          result.standardMeasureUnit = match[4].trim().toLowerCase();
        }
        
        console.log('OCR: Parsed serving -', {
          quantity: result.servingQuantity,
          measure: result.servingMeasure,
          standardValue: result.standardMeasureValue,
          standardUnit: result.standardMeasureUnit
        });
        break;
      }
    }
  }

  private parseCalciumFromTable(text: string, result: NutritionParseResult): void {
    // Enhanced patterns for table-structured calcium data
    // The key insight: in table mode, calcium values might be in format like:
    // "Calcium 110mg 80/0 410mg 300/0" (per serving | %DV | prepared | %DV)
    
    const calciumPatterns = [
      // Table format: "Calcium 110mg 8% 410mg 30%" - take first value
      { type: 'table_mg_first', pattern: /Calcium\s+(\d+(?:\.\d+)?)mg\s+\d+%?\s+\d+mg/i },
      // Table format: "Calcium 110mg 80/0 410mg 300/0" - take first value  
      { type: 'table_mg_percentage', pattern: /Calcium\s+(\d+(?:\.\d+)?)mg\s+\d+\/0\s+\d+mg/i },
      // Standard single column: "Calcium 450mg"
      { type: 'mg', pattern: /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg/i },
      // With bullet: "• Calcium 190mg"
      { type: 'mg', pattern: /[•·]\s*Calcium\s*(\d+(?:\.\d+)?)\s*mg/i },
      // Percentage only: "Calcium 30%" - convert from %DV
      { type: 'percent', pattern: /Calcium\s*(\d+(?:\.\d+)?)\s*%/i },
      // Table row format: look for calcium in structured table rows
      { type: 'table_row', pattern: /Calcium[^\d]*(\d+(?:\.\d+)?)mg/i },
      // Fallback: just number after Calcium
      { type: 'unlabeled', pattern: /Calcium\s+(\d+(?:\.\d+)?)/i },
      // Additional patterns
      { type: 'percent_spaced', pattern: /Calcium\s+(\d+(?:\.\d+)?)\s*%/i },
      { type: 'percent_bullet', pattern: /[•·]\s*Calcium\s+(\d+(?:\.\d+)?)\s*%/i },
      { type: 'percent_vitamin_section', pattern: /Vitamin\s+D[^•]*•\s*Calcium\s+(\d+(?:\.\d+)?)\s*%/i }
    ];
    
    for (const { type, pattern } of calciumPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (!isNaN(value) && value > 0) {
          if (type === 'mg' || type === 'unlabeled' || type.startsWith('table_mg')) {
            result.calcium = Math.round(value);
          } else if (type === 'g') {
            result.calcium = Math.round(value * 1000); // Convert grams to mg
          } else if (type === 'percent') {
            result.calcium = Math.round((value / 100) * this.CALCIUM_DV_MG);
          }
          
          console.log(`OCR: Found calcium (${type}):`, match[0], '->', result.calcium, 'mg');
          break;
        }
      }
    }
  }

  private parseFraction(quantityStr: string): number | null {
    if (!quantityStr) return null;
    
    if (quantityStr.includes('/')) {
      const parts = quantityStr.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          return num / den;
        }
      }
    }
    
    const num = parseFloat(quantityStr);
    return isNaN(num) ? null : num;
  }

  private buildLegacyServingSize(result: NutritionParseResult): string {
    if (!result.servingQuantity || !result.servingMeasure) {
      return '';
    }
    
    let servingSize = `${result.servingQuantity} ${result.servingMeasure}`;
    
    if (result.standardMeasureValue && result.standardMeasureUnit) {
      servingSize += ` (${result.standardMeasureValue}${result.standardMeasureUnit})`;
    }
    
    return servingSize;
  }

  private calculateConfidence(result: NutritionParseResult): 'high' | 'medium' | 'low' {
    let score = 0;
    
    // Serving size components
    if (result.servingQuantity !== null) score += 25;
    if (result.servingMeasure) score += 25;
    
    // Calcium value
    if (result.calcium !== null && result.calcium > 0) score += 50;
    
    // Bonus for standard measure
    if (result.standardMeasureValue && result.standardMeasureUnit) score += 10;

    if (score >= 85) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }
}
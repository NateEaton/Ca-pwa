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

// OCRService.ts with TypeScript type safety
import { ImageResizer } from '$lib/utils/imageResize.ts';

interface OCRResponse {
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
  ParsedResults?: Array<{
    ParsedText: string;
  }>;
}

interface NutritionParseResult {
  rawText: string;
  servingSize: string;
  calcium: string;
  confidence: 'high' | 'medium' | 'low';
}

export class OCRService {
  private apiKey: string;
  private apiEndpoint: string;

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
      formData.append('isOverlayRequired', 'false'); // Faster processing
      formData.append('iscreatesearchablepdf', 'false'); // Not needed
      formData.append('issearchablepdfhidetextlayer', 'false'); // Not needed

      console.log('OCR: Making API request to', this.apiEndpoint);

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      console.log('OCR: API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OCR: API error response:', errorText);
        throw new Error(`OCR API error: ${response.status} - ${response.statusText}`);
      }

      const result: OCRResponse = await response.json();
      console.log('OCR: API response data:', result);

      // Check for API-level errors
      if (!result || result.IsErroredOnProcessing) {
        const errorMsg = result?.ErrorMessage || 'Unknown OCR processing error';
        console.error('OCR: Processing error:', errorMsg);
        throw new Error(`OCR processing failed: ${errorMsg}`);
      }

      if (!result.ParsedResults || result.ParsedResults.length === 0) {
        throw new Error('No text detected in image. Please try a clearer photo of the nutrition label.');
      }

      const rawText = result.ParsedResults[0].ParsedText;
      console.log('OCR: Extracted text:', rawText);

      if (!rawText || rawText.trim().length === 0) {
        throw new Error('No readable text found. Please ensure the nutrition label is clearly visible.');
      }

      return this.parseNutritionData(rawText);

    } catch (error) {
      console.error('OCR processing failed:', error);

      // Provide more helpful error messages
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
    console.log('OCR: Parsing nutrition data from text...');

    // Improved regex patterns to handle more formats
    const servingPatterns = [
      /Serving\s*size\s*[:\-]?\s*(.+?)(?:\n|\r\n|$)/i,
      /Serving\s*Size\s*[:\-]?\s*(.+?)(?:\n|\r\n|$)/i,
      /Per\s*Serving\s*[:\-]?\s*(.+?)(?:\n|\r\n|$)/i,
      /Serving\s*[:\-]?\s*(.+?)(?:\n|\r\n|$)/i,
      // Handle cases where serving size is on multiple lines
      /Serving\s*size\s*[:\-]?\s*(\d+\s*\w+(?:\s*\([^)]+\))?)/i
    ];

    const calciumPatterns = [
      /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(mg|%|%\s*DV)/i,
      /Calcium\s*[:\-]?\s*(\d+(?:\.\d+)?)/i,
      /Ca\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(mg|%)/i,
      // Handle OCR errors like "450mg" without space
      /Calcium\s*(\d+)mg/i
    ];

    let servingSize = '';
    let calcium = '';

    // Try to find serving size
    for (const pattern of servingPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        servingSize = match[1].trim();
        // Clean up common OCR artifacts
        servingSize = servingSize.replace(/[^\w\s\(\)\.]/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('OCR: Found serving size:', servingSize);
        break;
      }
    }

    // Try to find calcium
    for (const pattern of calciumPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const unit = match[2] ? match[2].replace(/\s+/g, '') : 'mg';
        calcium = `${match[1]} ${unit}`.trim();
        console.log('OCR: Found calcium:', calcium);
        break;
      }
    }

    const result: NutritionParseResult = {
      rawText: text,
      servingSize,
      calcium,
      confidence: this.calculateConfidence(servingSize, calcium)
    };

    console.log('OCR: Parse result:', result);
    return result;
  }

  private calculateConfidence(servingSize: string, calcium: string): 'high' | 'medium' | 'low' {
    let score = 0;
    if (servingSize && servingSize.length > 2) score += 50;
    if (calcium && (calcium.includes('mg') || calcium.includes('%'))) score += 50;

    if (score >= 80) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}
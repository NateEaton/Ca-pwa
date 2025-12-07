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

// ImageResizer utility with TypeScript type safety

import { logger } from '$lib/utils/logger';

interface ResizeCalculation {
  width: number;
  height: number;
  quality: number;
}

interface ImageAnalysis {
  needsPreprocessing: boolean;
  estimatedDPI: number;
  hasLowContrast: boolean;
  isNoisy: boolean;
  isSkewed: boolean;
  reasons: string[];
}

export class ImageResizer {
  static async resizeForOCR(file: File, maxSizeBytes: number = 1024 * 1024): Promise<File> {
    // If file is already under limit, return as-is
    if (file.size <= maxSizeBytes) {
      logger.debug('IMAGE', `Image already under size limit: ${file.size} bytes`);
      return file;
    }

    logger.debug('IMAGE', `Resizing image from ${file.size} bytes to target ${maxSizeBytes} bytes`);


    return new Promise<File>((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas 2D context'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const { width, height, quality } = this.calculateOptimalSize(
          img.width,
          img.height,
          file.size,
          maxSizeBytes
        );

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              logger.debug('IMAGE', `Resized to ${width}x${height} at quality ${quality}, new size: ${blob.size} bytes`);

              // Create new File object with same name and type
              const resizedFile = new File(
                [blob],
                file.name,
                {
                  type: file.type || 'image/jpeg',
                  lastModified: Date.now()
                }
              );
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type || 'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for resizing'));
      };

      // Load the image
      img.src = URL.createObjectURL(file);
    });
  }

  static calculateOptimalSize(
    originalWidth: number,
    originalHeight: number,
    originalSize: number,
    targetSize: number
  ): ResizeCalculation {
    // Calculate size reduction factor needed
    const sizeRatio = Math.sqrt(targetSize / originalSize * 0.8); // 80% of target for safety margin

    // Apply size reduction while maintaining aspect ratio
    let width = Math.floor(originalWidth * sizeRatio);
    let height = Math.floor(originalHeight * sizeRatio);

    // Ensure minimum readable dimensions for OCR
    const minDimension = 400;
    if (width < minDimension || height < minDimension) {
      const scale = minDimension / Math.min(width, height);
      width = Math.floor(width * scale);
      height = Math.floor(height * scale);
    }

    // Calculate quality based on how much we need to compress
    const compressionNeeded = originalSize / targetSize;
    let quality: number;

    if (compressionNeeded < 2) {
      quality = 0.9; // Light compression
      logger.debug('IMAGE', `Using light compression (${quality}) - ratio: ${compressionNeeded.toFixed(2)}`);
    } else if (compressionNeeded < 5) {
      quality = 0.8; // Medium compression
      logger.debug('IMAGE', `Using medium compression (${quality}) - ratio: ${compressionNeeded.toFixed(2)}`);
    } else {
      quality = 0.7; // Heavy compression
      logger.debug('IMAGE', `Using heavy compression (${quality}) - ratio: ${compressionNeeded.toFixed(2)}`);
    }

    return { width, height, quality };
  }

  static async compressWithFallback(
    file: File,
    maxSizeBytes: number = 1024 * 1024,
    maxAttempts: number = 3
  ): Promise<File> {
    let currentFile = file;
    let attempt = 0;

    while (currentFile.size > maxSizeBytes && attempt < maxAttempts) {
      attempt++;
      logger.debug('IMAGE', `Compression attempt ${attempt}/${maxAttempts}`);

      // Reduce target size for each attempt
      const targetSize = maxSizeBytes * (0.8 ** attempt);
      currentFile = await this.resizeForOCR(currentFile, targetSize);
    }

    if (currentFile.size > maxSizeBytes) {
      logger.warn('Could not compress image below size limit after', maxAttempts, 'attempts');
      // Return the most compressed version we achieved
    }

    return currentFile;
  }

  static async analyzeImageQuality(file: File): Promise<ImageAnalysis> {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = Math.min(img.width, 400);  // Sample at reasonable size
        canvas.height = Math.min(img.height, 400);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const analysis = this.performQuickAnalysis(imageData, img.width, img.height, file.size);
        resolve(analysis);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  private static performQuickAnalysis(imageData: ImageData, originalWidth: number, originalHeight: number, fileSize: number): ImageAnalysis {
    const pixels = imageData.data;
    const analysis: ImageAnalysis = {
      needsPreprocessing: false,
      estimatedDPI: this.estimateDPI(originalWidth, originalHeight, fileSize),
      hasLowContrast: false,
      isNoisy: false,
      isSkewed: false,
      reasons: []
    };

    // Quick contrast check (sample every 10th pixel)
    let contrastSum = 0;
    let samples = 0;
    for (let i = 0; i < pixels.length; i += 40) { // Every 10th pixel, 4 bytes per pixel
      const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      contrastSum += gray;
      samples++;
    }

    const avgBrightness = contrastSum / samples;
    analysis.hasLowContrast = avgBrightness < 50 || avgBrightness > 200;

    if (analysis.hasLowContrast) {
      analysis.reasons.push('Low contrast detected');
      analysis.needsPreprocessing = true;
      logger.debug('IMAGE', `Low contrast detected (brightness: ${avgBrightness.toFixed(1)})`);
    }

    if (analysis.estimatedDPI < 150) {
      analysis.reasons.push('Low resolution detected');
      analysis.needsPreprocessing = true;
      logger.debug('IMAGE', `Low resolution detected (estimated DPI: ${analysis.estimatedDPI})`);
    }

    logger.debug('IMAGE', `Image analysis complete - DPI: ${analysis.estimatedDPI}, preprocessing needed: ${analysis.needsPreprocessing}`);

    return analysis;
  }

  private static estimateDPI(width: number, height: number, fileSize: number): number {
    // Rough DPI estimation based on dimensions and file size
    const megapixels = (width * height) / 1000000;
    const bytesPerPixel = fileSize / (width * height);

    // Typical DPI ranges based on image characteristics
    if (megapixels < 1 && bytesPerPixel < 1) return 96;   // Screenshot-like
    if (megapixels < 2 && bytesPerPixel < 2) return 150;  // Phone camera, compressed
    if (megapixels > 3 && bytesPerPixel > 2) return 300;  // High quality scan/photo

    return 200; // Default estimate
  }

  static async enhanceContrastIfNeeded(file: File, analysis: ImageAnalysis): Promise<File> {
    if (!analysis.hasLowContrast) {
      return file;
    }

    logger.debug('IMAGE', 'Enhancing image contrast');


    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Simple contrast enhancement using canvas filters
        ctx.filter = 'contrast(150%) brightness(110%)';
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(canvas, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const enhancedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(enhancedFile);
          } else {
            reject(new Error('Failed to enhance contrast'));
          }
        }, file.type, 0.9);
      };

      img.onerror = () => reject(new Error('Failed to load image for enhancement'));
      img.src = URL.createObjectURL(file);
    });
  }

  static async binarizeIfNeeded(file: File, analysis: ImageAnalysis): Promise<File> {
    // Only binarize if image is very unclear or noisy
    if (!analysis.hasLowContrast && !analysis.isNoisy) {
      return file;
    }

    logger.debug('IMAGE', 'Binarizing image for better OCR');


    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Simple Otsu-like thresholding
        let threshold = this.calculateOtsuThreshold(pixels);

        for (let i = 0; i < pixels.length; i += 4) {
          const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          const binary = gray > threshold ? 255 : 0;
          pixels[i] = pixels[i + 1] = pixels[i + 2] = binary;
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const binarizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(binarizedFile);
          } else {
            reject(new Error('Failed to binarize image'));
          }
        }, file.type, 0.9);
      };

      img.onerror = () => reject(new Error('Failed to load image for binarization'));
      img.src = URL.createObjectURL(file);
    });
  }

  private static calculateOtsuThreshold(pixels: Uint8ClampedArray): number {
    // Simplified Otsu thresholding - compute histogram and find optimal threshold
    const histogram = new Array(256).fill(0);
    const total = pixels.length / 4;

    // Build histogram
    for (let i = 0; i < pixels.length; i += 4) {
      const gray = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
      histogram[gray]++;
    }

    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i];
    }

    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let maxVariance = 0;
    let threshold = 0;

    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;

      wF = total - wB;
      if (wF === 0) break;

      sumB += t * histogram[t];

      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;

      const variance = wB * wF * (mB - mF) * (mB - mF);

      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = t;
      }
    }

    return threshold;
  }

  static async deskewIfNeeded(file: File, analysis: ImageAnalysis): Promise<File> {
    if (!analysis.isSkewed) {
      return file;
    }

    logger.debug('IMAGE', 'Deskewing image');


    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // For now, implement a simple rotation detection
        // In production, this would use line detection algorithms
        canvas.width = img.width;
        canvas.height = img.height;

        // Placeholder: slight rotation correction
        // Real implementation would detect text line angles
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(0.02); // Small correction, ~1 degree
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const deskewedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(deskewedFile);
          } else {
            reject(new Error('Failed to deskew image'));
          }
        }, file.type, 0.9);
      };

      img.onerror = () => reject(new Error('Failed to load image for deskewing'));
      img.src = URL.createObjectURL(file);
    });
  }

  static async reduceNoiseIfNeeded(file: File, analysis: ImageAnalysis): Promise<File> {
    if (!analysis.isNoisy) {
      return file;
    }

    logger.debug('IMAGE', 'Reducing image noise');


    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Simple noise reduction using canvas filter
        ctx.filter = 'blur(0.5px)';
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(canvas, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const cleanFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(cleanFile);
          } else {
            reject(new Error('Failed to reduce noise'));
          }
        }, file.type, 0.9);
      };

      img.onerror = () => reject(new Error('Failed to load image for noise reduction'));
      img.src = URL.createObjectURL(file);
    });
  }

  static async preprocessForOCR(file: File): Promise<File> {
    logger.debug('IMAGE', `Starting OCR preprocessing for ${file.name}`);

    // Step 1: Analyze image quality (fast)
    const analysis = await this.analyzeImageQuality(file);

    // Early bailout for high-quality images
    if (!analysis.needsPreprocessing) {
      logger.debug('IMAGE', 'Image quality sufficient, no preprocessing needed');
      return file;
    }

    // Step 2: Apply optimizations conditionally
    let processedFile = file;

    try {
      // Enhance contrast if needed (fast)
      processedFile = await this.enhanceContrastIfNeeded(processedFile, analysis);

      // Reduce noise if needed (medium speed)
      processedFile = await this.reduceNoiseIfNeeded(processedFile, analysis);

      // Binarize for very unclear images (medium speed)
      processedFile = await this.binarizeIfNeeded(processedFile, analysis);

      // Deskew if needed (slower, only for clearly skewed images)
      processedFile = await this.deskewIfNeeded(processedFile, analysis);

      return processedFile;

    } catch (error) {
      logger.warn('Preprocessing failed, using original image:', error);
      return file; // Fallback to original
    }
  }
}
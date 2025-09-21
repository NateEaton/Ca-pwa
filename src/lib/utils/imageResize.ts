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

interface ResizeCalculation {
  width: number;
  height: number;
  quality: number;
}

export class ImageResizer {
  static async resizeForOCR(file: File, maxSizeBytes: number = 1024 * 1024): Promise<File> {
    // If file is already under limit, return as-is
    if (file.size <= maxSizeBytes) {
      console.log('Image already under size limit:', file.size, 'bytes');
      return file;
    }

    console.log('Resizing image from', file.size, 'bytes to under', maxSizeBytes, 'bytes');

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
              console.log('Resized image to', blob.size, 'bytes');

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
    } else if (compressionNeeded < 5) {
      quality = 0.8; // Medium compression
    } else {
      quality = 0.7; // Heavy compression
    }

    console.log('Resize calculation:', {
      original: { width: originalWidth, height: originalHeight, size: originalSize },
      target: { width, height, quality, targetSize }
    });

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
      console.log(`Compression attempt ${attempt}/${maxAttempts}`);

      // Reduce target size for each attempt
      const targetSize = maxSizeBytes * (0.8 ** attempt);
      currentFile = await this.resizeForOCR(currentFile, targetSize);
    }

    if (currentFile.size > maxSizeBytes) {
      console.warn('Could not compress image below size limit after', maxAttempts, 'attempts');
      // Return the most compressed version we achieved
    }

    return currentFile;
  }
}
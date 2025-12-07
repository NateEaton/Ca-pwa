/**
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

/**
 * Development-only logging utility
 *
 * Provides conditional logging based on build mode. Debug logs are included in
 * development mode builds and excluded from production builds.
 *
 * Usage:
 *   import { logger } from '$lib/utils/logger';
 *
 *   logger.debug('OCR', 'Processing image...', { width, height });
 *   logger.log('User action:', data);
 *   logger.warn('Deprecation warning');
 *   logger.error('Critical error', error); // Always logs, even in production
 *
 * Build behavior:
 *   - Development mode (npm run dev, npm run build:dev): All logs visible
 *   - Production mode (npm run build): Debug/log/warn excluded, only errors remain
 *
 * The logger checks import.meta.env.MODE to determine the environment:
 *   - MODE === 'development' → logs enabled
 *   - MODE === 'production' → logs disabled (except errors)
 */

const isDev = import.meta.env.MODE === 'development';

export const logger = {
  /**
   * Debug logging with tagged categories
   * Useful for grouping related logs (e.g., [SYNC], [OCR], [API])
   * Automatically removed in production builds
   */
  debug: (tag: string, ...args: any[]) => {
    if (isDev) {
      console.log(`[${tag}]`, ...args);
    }
  },

  /**
   * General logging
   * Automatically removed in production builds
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Warning messages
   * Automatically removed in production builds
   */
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Error logging
   * ALWAYS logs, even in production builds
   * Use for critical errors that need to be tracked
   */
  error: (...args: any[]) => {
    console.error(...args);
  }
};

// Convenience exports for cleaner imports
export const { log, warn, error, debug } = logger;

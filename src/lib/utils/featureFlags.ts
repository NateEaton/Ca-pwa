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

/**
 * Application feature flags based on environment configuration
 */
export const FEATURES = {
  /**
   * Sync functionality enabled when Cloudflare Worker URL is configured
   * Determines whether sync UI elements and functionality are available
   */
  SYNC_ENABLED: Boolean(import.meta.env.VITE_WORKER_URL?.trim()),

  /**
   * OCR functionality enabled when OCR.space API key is configured
   * Determines whether OCR tab is available in Smart Scan modal
   */
  OCR_ENABLED: Boolean(import.meta.env.VITE_OCR_API_KEY?.trim())
} as const;

export type FeatureFlags = typeof FEATURES;
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

import { logger } from '$lib/utils/logger';

/**
 * Build information interface for type safety
 */
export interface BuildInfo {
  buildId: string;
  buildTime: string;
  gitBranch: string | null;
  appVersion: string;
  nodeVersion: string;
  buildPlatform: string;
  buildAge: number; // Minutes since build
  environment: string;
}

/**
 * Gets formatted build information from Vite-injected constants
 * @returns {BuildInfo} Complete build information object
 */
export function getBuildInfo(): BuildInfo {
  const buildTime = new Date(__BUILD_TIME__);
  const buildAge = Math.floor((Date.now() - buildTime.getTime()) / (1000 * 60));

  return {
    buildId: __BUILD_ID__,
    buildTime: __BUILD_TIME__,
    gitBranch: __GIT_BRANCH__,
    appVersion: __APP_VERSION__,
    nodeVersion: __NODE_VERSION__,
    buildPlatform: __BUILD_PLATFORM__,
    buildAge,
    environment: __APP_ENV__
  };
}

/**
 * Gets a short display version of the build ID for compact UI display
 * @returns {string} Shortened build ID (last 8 characters)
 */
export function getShortBuildId(): string {
  return __BUILD_ID__.slice(-8);
}

/**
 * Formats build time for human-readable display
 * @returns {string} Formatted build time string
 */
export function getFormattedBuildTime(): string {
  return new Date(__BUILD_TIME__).toLocaleString();
}

/**
 * Logs build information to console (development builds and test mode)
 */
export function logBuildInfo(): void {
  // Show console logs for development builds or when running in dev server/preview
  if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
    const info = getBuildInfo();
    console.group('🔨 Build Information');
    logger.debug('BUILD INFO', `Build ID: ${info.buildId}`);
    logger.debug('BUILD INFO', `Build Time: ${info.buildTime}`);
    logger.debug('BUILD INFO', `Build Age: ${info.buildAge} minutes`);
    logger.debug('BUILD INFO', `Git Branch: ${info.gitBranch || 'unknown'}`);
    logger.debug('BUILD INFO', `App Version: ${info.appVersion}`);
    logger.debug('BUILD INFO', `Environment: ${info.environment}`);
    logger.debug('BUILD INFO', `Platform: ${info.buildPlatform}`);
    console.groupEnd();
  }
}
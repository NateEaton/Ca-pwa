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

import { setNetworkStatus } from '$lib/stores/networkStatus';

/**
 * Centralized network status management service
 * Provides reactive network state for UI components
 */
export class NetworkStatusService {
  private static instance: NetworkStatusService | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): NetworkStatusService {
    if (!NetworkStatusService.instance) {
      NetworkStatusService.instance = new NetworkStatusService();
    }
    return NetworkStatusService.instance;
  }

  initialize(): void {
    if (this.initialized) return;

    // Set initial state
    setNetworkStatus(navigator.onLine);

    // Listen for network changes
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    this.initialized = true;
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  private handleOnline(): void {
    setNetworkStatus(true);
  }

  private handleOffline(): void {
    setNetworkStatus(false);
  }
}
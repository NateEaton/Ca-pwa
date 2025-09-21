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

import { writable, derived } from 'svelte/store';

// Main network status store
export const isOnline = writable<boolean>(true);

// Helper function for service to update store
export function setNetworkStatus(online: boolean): void {
  isOnline.set(online);
}

// Derived store for UI components
export const networkIcon = derived(isOnline, ($isOnline) => ({
  connected: $isOnline,
  className: $isOnline ? 'online' : 'offline',
  title: $isOnline ? 'Connected' : 'Offline'
}));
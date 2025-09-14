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
 * Date utility functions for handling date operations in the local timezone.
 * All functions work with YYYY-MM-DD date strings and ensure consistent
 * local timezone handling to avoid timezone conversion issues.
 */

/**
 * Get today's date in YYYY-MM-DD format using local timezone.
 *
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format a date string for display with localized formatting.
 * Shows weekday, month, and day. Year is only shown if different from current year.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Mon, Jan 15" or "Mon, Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return getTodayString();

  const date = new Date(dateString + "T00:00:00"); // Force local timezone interpretation

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Add a specified number of days to a date string, keeping it in local timezone.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @param days - Number of days to add (can be negative to subtract)
 * @returns New date string in YYYY-MM-DD format
 */
export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString + "T00:00:00"); // Force local timezone
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date string represents today's date.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns True if the date string represents today, false otherwise
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}
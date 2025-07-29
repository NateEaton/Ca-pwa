// src/lib/utils/dateUtils.js

// Get today's date in YYYY-MM-DD format using local timezone
export function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Format date for display - just show the actual date
export function formatDate(dateString) {
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

// Add days to a date string, keeping it in local timezone
export function addDays(dateString, days) {
  const date = new Date(dateString + "T00:00:00"); // Force local timezone
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Check if a date string represents today
export function isToday(dateString) {
  return dateString === getTodayString();
}

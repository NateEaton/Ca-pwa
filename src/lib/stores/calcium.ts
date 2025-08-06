import { writable, derived, get } from 'svelte/store';
import type { CalciumState, FoodEntry, CustomFood, CalciumSettings, UserServingPreference } from '$lib/types/calcium';
import { CalciumService } from '$lib/services/CalciumService';

// Toast store for notifications
export const toastStore = writable<{ message: string; type: 'info' | 'success' | 'error' | 'warning' }>({
  message: '',
  type: 'info'
});

// Helper function to show toast
export function showToast(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  toastStore.set({ message, type });
}

// Get today's date string (fixed for timezone)
function getTodayString(): string {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split('T')[0];
}

// Main application state
export const calciumState = writable<CalciumState>({
  currentDate: getTodayString(),
  foods: [], // This array will be sorted in-place by CalciumService
  customFoods: [],
  favorites: new Set<number>(),
  servingPreferences: new Map<number, UserServingPreference>(),
  settings: {
    dailyGoal: 1000,
    sortBy: 'time',
    sortOrder: 'desc',
    theme: 'auto'
  },
  isLoading: true
});

// Derived stores for computed values
export const dailyTotal = derived(
  calciumState,
  ($state) => $state.foods.reduce((sum, food) => sum + food.calcium, 0)
);

export const goalProgress = derived(
  [dailyTotal, calciumState],
  ([$total, $state]) => Math.min(Math.round(($total / $state.settings.dailyGoal) * 100), 100)
);

// REMOVED: sortedFoods derived store - foods array is now sorted in-place
// The foods array in calciumState is maintained in sorted order by CalciumService

// Shared CalciumService instance 
export const calciumService = new CalciumService();

// Current daily goal (derived for easy access)
export const dailyGoal = derived(
  calciumState,
  ($state) => $state.settings.dailyGoal
);

// Helper stores for UI state
export const isToday = derived(
  calciumState,
  ($state) => $state.currentDate === getTodayString()
);

// Access to the main foods array (which is kept sorted)
export const foods = derived(
  calciumState,
  ($state) => $state.foods
);

// Current sort settings for UI display
export const sortSettings = derived(
  calciumState,
  ($state) => ({
    sortBy: $state.settings.sortBy,
    sortOrder: $state.settings.sortOrder
  })
);
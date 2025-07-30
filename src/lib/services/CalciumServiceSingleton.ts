import { CalciumService } from './CalciumService';

// Singleton instance
let calciumServiceInstance: CalciumService | null = null;

/**
 * Get the singleton CalciumService instance
 * Creates and initializes if it doesn't exist
 */
export async function getCalciumService(): Promise<CalciumService> {
  if (!calciumServiceInstance) {
    calciumServiceInstance = new CalciumService();
    await calciumServiceInstance.initialize();
  }
  return calciumServiceInstance;
}

/**
 * Get the singleton instance if it exists (synchronous)
 * Returns null if not initialized yet
 */
export function getCalciumServiceSync(): CalciumService | null {
  return calciumServiceInstance;
}
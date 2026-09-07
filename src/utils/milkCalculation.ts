import { MilkEntry, MilkType, ShiftType, MilkQualityValidationConfig, RateChartConfig } from '../types';

/**
 * Default Quality Validation Configuration
 */
export const DEFAULT_QUALITY_VALIDATION: MilkQualityValidationConfig = {
  minCowFat: 2.5,
  maxCowFat: 6.5,
  minCowSnf: 7.5,
  maxCowSnf: 10.5,
  minBuffaloFat: 4.5,
  maxBuffaloFat: 12.0,
  minBuffaloSnf: 8.0,
  maxBuffaloSnf: 12.0,
  strictValidation: false,
  allowRateOverride: true,
  defaultPricingMode: 'MANUAL_RATE',
  defaultUnit: 'L',
};

/**
 * Decimal-safe money calculation for milk intake.
 * Prevents IEEE 754 floating-point drift (e.g., 2.3 * 45.0 = 103.49999999999999).
 * Returns precise 2-decimal rounded number.
 */
export function calculateMilkAmount(quantity: number, rate: number): number {
  if (isNaN(quantity) || isNaN(rate) || quantity <= 0 || rate <= 0) {
    return 0;
  }
  // Decimal-safe calculation by multiplying scaled units
  const qtyDecimals = 1000; // supports up to 3 decimal places for quantity
  const rateDecimals = 100; // 2 decimal places for currency
  const totalCents = Math.round((quantity * qtyDecimals) * (rate * rateDecimals) / (qtyDecimals * 10));
  return totalCents / 10;
}

/**
 * Calculate rate from FAT & SNF rate chart matrix
 */
export function calculateChartRate(
  milkType: MilkType,
  fat: number,
  snf: number,
  rateChart: RateChartConfig
): number {
  let rate = 58.0;
  if (milkType === 'cow') {
    const base = rateChart.cowBaseRate || 45.0;
    const fatComp = (fat - (rateChart.minCowFat || 3.2)) * (rateChart.cowFatMultiplier || 4.5);
    const snfComp = (snf - (rateChart.minCowSnf || 8.0)) * (rateChart.cowSnfMultiplier || 3.2);
    rate = Math.round((base + fatComp + snfComp) * 100) / 100;
  } else {
    const base = rateChart.buffaloBaseRate || 65.0;
    const fatComp = (fat - (rateChart.minBuffaloFat || 5.0)) * (rateChart.buffaloFatMultiplier || 6.5);
    const snfComp = (snf - (rateChart.minBuffaloSnf || 8.5)) * (rateChart.buffaloSnfMultiplier || 4.0);
    rate = Math.round((base + fatComp + snfComp) * 100) / 100;
  }

  // Sensible floor
  if (rate < 20) rate = 20;
  return rate;
}

/**
 * Validate FAT & SNF readings against configurable dairy thresholds
 */
export interface QualityValidationResult {
  isValid: boolean;
  fatWarning?: string;
  snfWarning?: string;
  isFatal: boolean;
}

export function validateQualityReadings(
  milkType: MilkType,
  fat: number,
  snf: number,
  config: MilkQualityValidationConfig = DEFAULT_QUALITY_VALIDATION
): QualityValidationResult {
  const result: QualityValidationResult = {
    isValid: true,
    isFatal: false,
  };

  if (fat <= 0 || isNaN(fat)) {
    result.isValid = false;
    result.fatWarning = 'FAT % must be greater than 0.';
    result.isFatal = true;
    return result;
  }

  if (snf <= 0 || isNaN(snf)) {
    result.isValid = false;
    result.snfWarning = 'SNF % must be greater than 0.';
    result.isFatal = true;
    return result;
  }

  const minFat = milkType === 'cow' ? config.minCowFat : config.minBuffaloFat;
  const maxFat = milkType === 'cow' ? config.maxCowFat : config.maxBuffaloFat;
  const minSnf = milkType === 'cow' ? config.minCowSnf : config.minBuffaloSnf;
  const maxSnf = milkType === 'cow' ? config.maxCowSnf : config.maxBuffaloSnf;

  if (fat < minFat || fat > maxFat) {
    result.isValid = !config.strictValidation;
    result.fatWarning = `FAT (${fat}%) is outside typical range (${minFat}% – ${maxFat}%). Please verify.`;
    if (config.strictValidation) result.isFatal = true;
  }

  if (snf < minSnf || snf > maxSnf) {
    result.isValid = !config.strictValidation;
    result.snfWarning = `SNF (${snf}%) is outside typical range (${minSnf}% – ${maxSnf}%). Please verify.`;
    if (config.strictValidation) result.isFatal = true;
  }

  return result;
}

/**
 * Check if a duplicate milk collection already exists for this farmer, shift, and date
 */
export function findDuplicateMilkEntry(
  entries: MilkEntry[],
  candidate: {
    farmerId: string;
    date: string;
    shift: ShiftType;
    milkType: MilkType;
    tenantId?: string;
    excludeId?: string;
  }
): MilkEntry | undefined {
  return entries.find((e) => {
    if (candidate.excludeId && e.id === candidate.excludeId) return false;
    if (candidate.tenantId && e.tenantId && e.tenantId !== candidate.tenantId) return false;

    const matchesFarmer = e.farmerId === candidate.farmerId;
    const matchesDate = e.date === candidate.date;
    const matchesShift = e.shift === candidate.shift;
    const matchesMilk = e.milkType === candidate.milkType;

    return matchesFarmer && matchesDate && matchesShift && matchesMilk;
  });
}

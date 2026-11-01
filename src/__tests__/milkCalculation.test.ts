import { describe, it, expect } from 'vitest';
import {
  calculateMilkAmount,
  calculateMilkAmountInPaise,
  calculateChartRate,
  validateQualityReadings,
  findDuplicateMilkEntry,
} from '../utils/milkCalculation';
import { MilkEntry, RateChartConfig } from '../types';

describe('Milk Calculation & Financial Precision Engine', () => {
  const testRateChart: RateChartConfig = {
    cowBaseRate: 45.0,
    cowFatMultiplier: 4.5,
    cowSnfMultiplier: 3.2,
    minCowFat: 3.2,
    minCowSnf: 8.0,

    buffaloBaseRate: 65.0,
    buffaloFatMultiplier: 6.5,
    buffaloSnfMultiplier: 4.0,
    minBuffaloFat: 5.0,
    minBuffaloSnf: 8.5,

    lastUpdated: new Date().toISOString(),
  };

  it('calculates milk amount with exact 2-decimal paise precision (no float drift)', () => {
    // 10.55 Liters @ ₹45.25/L = 477.3875 -> ₹477.39
    const amount = calculateMilkAmount(10.55, 45.25);
    expect(amount).toBe(477.39);

    const paise = calculateMilkAmountInPaise(10.55, 45.25);
    expect(paise).toBe(47739);
  });

  it('handles small quantity and fractional paise cleanly', () => {
    // 0.75 Liters @ ₹42.50/L = 31.875 -> ₹31.88
    const amount = calculateMilkAmount(0.75, 42.5);
    expect(amount).toBe(31.88);
  });

  it('safely handles zero and invalid inputs', () => {
    expect(calculateMilkAmount(0, 50)).toBe(0);
    expect(calculateMilkAmount(10, 0)).toBe(0);
    expect(calculateMilkAmount(-5, 50)).toBe(0);
    expect(calculateMilkAmount(NaN, 50)).toBe(0);
  });

  it('calculates Cow milk rate based on FAT & SNF formula correctly', () => {
    // Base: 45.0, Fat: 4.2 (min 3.2 -> diff 1.0 * 4.5 = +4.5), SNF: 8.5 (min 8.0 -> diff 0.5 * 3.2 = +1.6)
    // Total = 45.0 + 4.5 + 1.6 = 51.10
    const rate = calculateChartRate('cow', 4.2, 8.5, testRateChart);
    expect(rate).toBe(51.1);
  });

  it('calculates Buffalo milk rate correctly with higher base and multipliers', () => {
    // Base: 65.0, Fat: 6.5 (min 5.0 -> diff 1.5 * 6.5 = +9.75), SNF: 9.0 (min 8.5 -> diff 0.5 * 4.0 = +2.0)
    // Total = 65.0 + 9.75 + 2.0 = 76.75
    const rate = calculateChartRate('buffalo', 6.5, 9.0, testRateChart);
    expect(rate).toBe(76.75);
  });

  it('enforces a minimum safety rate floor', () => {
    // Extremely low fat & SNF should not produce negative or below-floor rates
    const rate = calculateChartRate('cow', 1.0, 5.0, testRateChart);
    expect(rate).toBeGreaterThanOrEqual(20.0);
  });

  it('validates FAT and SNF ranges and catches out-of-bound readings', () => {
    const normalCow = validateQualityReadings('cow', 4.0, 8.5);
    expect(normalCow.isValid).toBe(true);
    expect(normalCow.isFatal).toBe(false);

    // Fat too high for standard cow milk
    const anomalousCow = validateQualityReadings('cow', 9.5, 8.5);
    expect(anomalousCow.fatWarning).toBeDefined();

    // Zero or negative readings are fatal errors
    const fatalZero = validateQualityReadings('cow', 0, 8.5);
    expect(fatalZero.isFatal).toBe(true);
  });

  it('detects duplicate collection entries for same farmer on same shift and date', () => {
    const existingEntries: MilkEntry[] = [
      {
        id: 'ME-001',
        receiptId: 'RCP-001',
        tenantId: 'rudu-tenant-main',
        farmerId: 'FARMER-101',
        farmerName: 'Ramesh Singh',
        farmerCode: 'RF101',
        village: 'Sikhreda',
        date: '27 Oct 2026',
        time: '07:30 AM',
        shift: 'morning',
        milkType: 'cow',
        quantityLiters: 12.5,
        fatPercentage: 4.2,
        snfPercentage: 8.5,
        ratePerLiter: 51.1,
        totalAmount: 638.75,
        status: 'Completed',
        clrReading: 28,
        collectedBy: 'Operator Ramesh',
        rateSource: 'manual',
      },
    ];

    // Same farmer, same date, same shift, same milk type -> Duplicate
    const dup = findDuplicateMilkEntry(existingEntries, {
      farmerId: 'FARMER-101',
      date: '27 Oct 2026',
      shift: 'morning',
      milkType: 'cow',
    });
    expect(dup).toBeDefined();
    expect(dup?.id).toBe('ME-001');

    // Evening shift is NOT a duplicate
    const nonDup = findDuplicateMilkEntry(existingEntries, {
      farmerId: 'FARMER-101',
      date: '27 Oct 2026',
      shift: 'evening',
      milkType: 'cow',
    });
    expect(nonDup).toBeUndefined();
  });
});

import { describe, it, expect } from 'vitest';

interface RawMilkInventory {
  openingStockLiters: number;
  collectionsInLiters: number;
  dispatchesOutLiters: number;
  processingConsumptionLiters: number;
  recordedWastageLiters: number;
}

function calculateClosingStock(inv: RawMilkInventory): {
  closingStockLiters: number;
  varianceLiters: number;
  isNegative: boolean;
} {
  const calculated =
    inv.openingStockLiters +
    inv.collectionsInLiters -
    inv.dispatchesOutLiters -
    inv.processingConsumptionLiters -
    inv.recordedWastageLiters;

  const rounded = Math.round(calculated * 100) / 100;
  return {
    closingStockLiters: rounded,
    varianceLiters: 0,
    isNegative: rounded < 0,
  };
}

describe('Raw Milk Inventory & Tanker Reconciliation', () => {
  it('reconciles intake, dispatches, and processing stock', () => {
    const dailyBook: RawMilkInventory = {
      openingStockLiters: 150.0,
      collectionsInLiters: 850.5,
      dispatchesOutLiters: 600.0,
      processingConsumptionLiters: 350.0,
      recordedWastageLiters: 2.5,
    };

    // 150 + 850.5 - 600 - 350 - 2.5 = 48.0 L
    const result = calculateClosingStock(dailyBook);
    expect(result.closingStockLiters).toBe(48.0);
    expect(result.isNegative).toBe(false);
  });

  it('detects negative stock conditions when dispatches exceed available raw milk', () => {
    const invalidBook: RawMilkInventory = {
      openingStockLiters: 50.0,
      collectionsInLiters: 100.0,
      dispatchesOutLiters: 200.0,
      processingConsumptionLiters: 0,
      recordedWastageLiters: 0,
    };

    const result = calculateClosingStock(invalidBook);
    expect(result.closingStockLiters).toBe(-50.0);
    expect(result.isNegative).toBe(true);
  });
});

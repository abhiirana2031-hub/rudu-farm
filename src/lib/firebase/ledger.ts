/**
 * Authoritative Rate Calculation, Atomic Ledger & Financial Operations
 */

import {
  runTransaction,
  doc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './client';
import { DEFAULT_TENANT_ID, TENANT_COLLECTIONS } from './firestore';
import { logAuditEvent } from './audit';
import { MilkType, RateChartConfig } from '../../types';

export interface CalculatedRateResult {
  ratePerLiter: number;
  totalAmountPaise: number;
  totalAmountRupees: number;
}

/**
 * Format Unique Receipt Number: RF-YYYYMMDD-XXXXXX
 */
export const generateReceiptNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = String(Math.floor(100000 + Math.random() * 900000));
  return `RF-${year}${month}${day}-${randomSuffix}`;
};

/**
 * Authoritative Rate Calculation
 */
export const calculateAuthoritativeRate = (
  milkType: MilkType,
  liters: number,
  fat: number,
  snf: number,
  rateChart: RateChartConfig
): CalculatedRateResult => {
  const safeLiters = Math.max(0, Number(liters) || 0);
  const safeFat = Math.max(0, Number(fat) || 0);
  const safeSnf = Math.max(0, Number(snf) || 0);

  let rate = 0;
  if (milkType === 'cow') {
    const base = rateChart.cowBaseRate || 42.0;
    const fatBonus = Math.max(0, safeFat - (rateChart.minCowFat || 3.5)) * (rateChart.cowFatMultiplier || 6.5);
    const snfBonus = Math.max(0, safeSnf - (rateChart.minCowSnf || 8.5)) * (rateChart.cowSnfMultiplier || 4.2);
    rate = Math.round((base + fatBonus + snfBonus) * 100) / 100;
  } else {
    const base = rateChart.buffaloBaseRate || 68.0;
    const fatBonus = Math.max(0, safeFat - (rateChart.minBuffaloFat || 6.0)) * (rateChart.buffaloFatMultiplier || 8.0);
    const snfBonus = Math.max(0, safeSnf - (rateChart.minBuffaloSnf || 9.0)) * (rateChart.buffaloSnfMultiplier || 5.0);
    rate = Math.round((base + fatBonus + snfBonus) * 100) / 100;
  }

  // Exact paise computation to avoid floating point money errors
  const rateInPaise = Math.round(rate * 100);
  const totalAmountPaise = Math.round(safeLiters * rateInPaise);
  const totalAmountRupees = totalAmountPaise / 100;

  return {
    ratePerLiter: rate,
    totalAmountPaise,
    totalAmountRupees,
  };
};

export interface RecordMilkCollectionPayload {
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  operatorId: string;
  operatorSessionId: string;
  collectionCenterId: string;
  shift: 'morning' | 'evening';
  milkType: MilkType;
  quantityLiters: number;
  fatPercentage: number;
  snfPercentage: number;
  clrReading?: number;
  rateChart: RateChartConfig;
  village?: string;
  tenantId?: string;
}

/**
 * Atomic Milk Collection & Ledger Transaction
 */
export const recordAtomicMilkCollection = async (
  payload: RecordMilkCollectionPayload
): Promise<{ success: boolean; collectionId?: string; receiptId?: string; error?: string }> => {
  if (!db) return { success: false, error: 'Database uninitialized' };

  const tenantId = payload.tenantId || DEFAULT_TENANT_ID;
  const receiptNumber = generateReceiptNumber();
  const collectionId = `MC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const ledgerId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const calc = calculateAuthoritativeRate(
    payload.milkType,
    payload.quantityLiters,
    payload.fatPercentage,
    payload.snfPercentage,
    payload.rateChart
  );

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Fetch Farmer document to update balance
      const farmerRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.FARMERS, payload.farmerId);
      const farmerSnap = await transaction.get(farmerRef);

      const currentBalance = farmerSnap.exists() ? (farmerSnap.data().pendingBalance || 0) : 0;
      const newBalance = Math.round((currentBalance + calc.totalAmountRupees) * 100) / 100;

      // 2. Milk Collection Record
      const collectionRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.MILK_COLLECTIONS, collectionId);
      transaction.set(collectionRef, {
        id: collectionId,
        receiptId: receiptNumber,
        tenantId,
        farmerId: payload.farmerId,
        farmerName: payload.farmerName,
        farmerCode: payload.farmerCode,
        village: payload.village || '',
        operatorId: payload.operatorId,
        operatorSessionId: payload.operatorSessionId,
        collectionCenterId: payload.collectionCenterId,
        shift: payload.shift,
        milkType: payload.milkType,
        quantityLiters: payload.quantityLiters,
        fatPercentage: payload.fatPercentage,
        snfPercentage: payload.snfPercentage,
        clrReading: payload.clrReading || 28,
        ratePerLiter: calc.ratePerLiter,
        amountPaise: calc.totalAmountPaise,
        totalAmount: calc.totalAmountRupees,
        status: 'Completed',
        collectedBy: payload.operatorId,
        createdAt: new Date().toISOString(),
      });

      // 3. Ledger Transaction (CREDIT to farmer)
      const ledgerRef = doc(db, 'tenants', tenantId, TENANT_COLLECTIONS.LEDGER_TRANSACTIONS, ledgerId);
      transaction.set(ledgerRef, {
        id: ledgerId,
        tenantId,
        farmerId: payload.farmerId,
        type: 'CREDIT',
        source: 'MILK_COLLECTION',
        referenceId: collectionId,
        receiptNumber,
        amountPaise: calc.totalAmountPaise,
        amountRupees: calc.totalAmountRupees,
        runningBalance: newBalance,
        description: `Milk Intake ${payload.quantityLiters}L @ ₹${calc.ratePerLiter}/L`,
        timestamp: new Date().toISOString(),
      });

      // 4. Update Farmer Pending Balance
      if (farmerSnap.exists()) {
        transaction.update(farmerRef, {
          pendingBalance: newBalance,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    await logAuditEvent({
      tenantId,
      actorId: payload.operatorId,
      actorRole: 'OPERATOR',
      action: 'MILK_COLLECTION_RECORDED',
      entityType: 'MILK_COLLECTION',
      entityId: collectionId,
      metadata: {
        receiptNumber,
        farmerId: payload.farmerId,
        quantity: payload.quantityLiters,
        amount: calc.totalAmountRupees,
      },
    });

    return {
      success: true,
      collectionId,
      receiptId: receiptNumber,
    };
  } catch (err: any) {
    console.error('[Ledger] Atomic collection failed:', err);
    return { success: false, error: err.message || 'Transaction failed' };
  }
};

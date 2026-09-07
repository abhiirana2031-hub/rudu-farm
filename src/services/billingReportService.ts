import { Farmer, MilkEntry } from '../types';
import {
  BillingAdjustment,
  BillingPeriodInfo,
  FarmerBillingReport,
  MilkTypeSummary,
} from '../types/billing';
import { isEntryInBillingPeriod } from '../utils/billingPeriods';
import { BUSINESS } from '../config/business';

/**
 * Format currency with 2 decimal precision
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a complete 10-Day Farmer Billing Report
 */
export function generateFarmer10DayReport(
  farmer: Farmer,
  allEntries: MilkEntry[],
  period: BillingPeriodInfo,
  adjustments: BillingAdjustment[] = [],
  previousBalance: number = 0,
  advanceAmount: number = 0,
  deductionAmount: number = 0,
  paymentsMade: number = 0,
  operatorName?: string,
  centerName?: string
): FarmerBillingReport {
  // 1. Filter entries for this farmer that fall strictly within this 10-day period
  const farmerEntries = allEntries.filter((entry) => {
    const matchesFarmer =
      entry.farmerId === farmer.id ||
      entry.farmerCode === farmer.farmerCode ||
      entry.farmerName.toLowerCase() === farmer.name.toLowerCase();
    if (!matchesFarmer) return false;

    // Check if within period dates
    return isEntryInBillingPeriod(entry.date, period);
  });

  // Sort daily entries chronologically
  farmerEntries.sort((a, b) => {
    const timeA = new Date(`${a.date} ${a.time || '06:00 AM'}`).getTime();
    const timeB = new Date(`${b.date} ${b.time || '06:00 AM'}`).getTime();
    return timeA - timeB;
  });

  // 2. Separate Cow & Buffalo collections
  const cowEntries = farmerEntries.filter((e) => e.milkType === 'cow');
  const buffaloEntries = farmerEntries.filter((e) => e.milkType === 'buffalo');

  // Helpers to read properties robustly
  const getEntryQty = (e: MilkEntry) => typeof e.quantity === 'number' ? e.quantity : (typeof e.quantityLiters === 'number' ? e.quantityLiters : 0);
  const getEntryAmt = (e: MilkEntry) => typeof e.amount === 'number' ? e.amount : (typeof e.totalAmount === 'number' ? e.totalAmount : 0);
  const getEntryFat = (e: MilkEntry) => typeof e.fat === 'number' ? e.fat : (typeof e.fatPercentage === 'number' ? e.fatPercentage : 0);
  const getEntrySnf = (e: MilkEntry) => typeof e.snf === 'number' ? e.snf : (typeof e.snfPercentage === 'number' ? e.snfPercentage : 0);

  // Cow aggregates
  const cowTotalQty = cowEntries.reduce((sum, e) => sum + getEntryQty(e), 0);
  const cowTotalAmount = cowEntries.reduce((sum, e) => sum + getEntryAmt(e), 0);
  const cowFatWeighted = cowTotalQty > 0
    ? cowEntries.reduce((sum, e) => sum + getEntryFat(e) * getEntryQty(e), 0) / cowTotalQty
    : 0;
  const cowSnfWeighted = cowTotalQty > 0
    ? cowEntries.reduce((sum, e) => sum + getEntrySnf(e) * getEntryQty(e), 0) / cowTotalQty
    : 0;
  const cowAvgRate = cowTotalQty > 0 ? cowTotalAmount / cowTotalQty : 0;

  const cowSummary: MilkTypeSummary = {
    milkType: 'cow',
    totalQuantity: Number(cowTotalQty.toFixed(2)),
    avgFat: Number(cowFatWeighted.toFixed(2)),
    avgSnf: Number(cowSnfWeighted.toFixed(2)),
    avgRate: Number(cowAvgRate.toFixed(2)),
    totalAmount: Number(cowTotalAmount.toFixed(2)),
    entryCount: cowEntries.length,
  };

  // Buffalo aggregates
  const buffaloTotalQty = buffaloEntries.reduce((sum, e) => sum + getEntryQty(e), 0);
  const buffaloTotalAmount = buffaloEntries.reduce((sum, e) => sum + getEntryAmt(e), 0);
  const buffaloFatWeighted = buffaloTotalQty > 0
    ? buffaloEntries.reduce((sum, e) => sum + getEntryFat(e) * getEntryQty(e), 0) / buffaloTotalQty
    : 0;
  const buffaloSnfWeighted = buffaloTotalQty > 0
    ? buffaloEntries.reduce((sum, e) => sum + getEntrySnf(e) * getEntryQty(e), 0) / buffaloTotalQty
    : 0;
  const buffaloAvgRate = buffaloTotalQty > 0 ? buffaloTotalAmount / buffaloTotalQty : 0;

  const buffaloSummary: MilkTypeSummary = {
    milkType: 'buffalo',
    totalQuantity: Number(buffaloTotalQty.toFixed(2)),
    avgFat: Number(buffaloFatWeighted.toFixed(2)),
    avgSnf: Number(buffaloSnfWeighted.toFixed(2)),
    avgRate: Number(buffaloAvgRate.toFixed(2)),
    totalAmount: Number(buffaloTotalAmount.toFixed(2)),
    entryCount: buffaloEntries.length,
  };

  // Grand totals
  const totalMilk = Number((cowTotalQty + buffaloTotalQty).toFixed(2));
  const grossMilkAmount = Number((cowTotalAmount + buffaloTotalAmount).toFixed(2));
  const overallFat = totalMilk > 0
    ? ((cowFatWeighted * cowTotalQty) + (buffaloFatWeighted * buffaloTotalQty)) / totalMilk
    : 0;
  const overallSnf = totalMilk > 0
    ? ((cowSnfWeighted * cowTotalQty) + (buffaloSnfWeighted * buffaloTotalQty)) / totalMilk
    : 0;
  const overallRate = totalMilk > 0 ? grossMilkAmount / totalMilk : 0;

  // 3. Adjustments & Financial calculations
  const totalAdjustments = adjustments.reduce((sum, adj) => sum + Number(adj.amount || 0), 0);

  // Net Payable = Gross Milk + Previous Balance - Advance - Other Deductions + Admin Adjustments
  const netPayable = Number((grossMilkAmount + previousBalance - advanceAmount - deductionAmount + totalAdjustments).toFixed(2));

  // Closing Balance = Net Payable - Payments Made
  const closingBalance = Number((netPayable - paymentsMade).toFixed(2));

  const reportId = `RPT-${period.id}-${farmer.farmerCode || farmer.id}`;

  return {
    id: reportId,
    billingPeriodId: period.id,
    billingPeriod: period,
    farmerId: farmer.id,
    farmerName: farmer.name,
    farmerCode: farmer.farmerCode,
    farmerMobile: farmer.phone,
    village: farmer.village,
    collectionCenterName: centerName || 'Main Sikhreda BMC Hub',
    operatorName: operatorName || 'Center Operator',
    status: period.status === 'LOCKED' ? 'LOCKED' : period.status === 'FINALIZED' ? 'FINALIZED' : 'DRAFT',
    totalEntries: farmerEntries.length,
    totalMilk,
    cowMilk: Number(cowTotalQty.toFixed(2)),
    buffaloMilk: Number(buffaloTotalQty.toFixed(2)),
    avgFat: Number(overallFat.toFixed(2)),
    avgSnf: Number(overallSnf.toFixed(2)),
    avgRate: Number(overallRate.toFixed(2)),
    grossMilkAmount,
    cowSummary: cowEntries.length > 0 ? cowSummary : undefined,
    buffaloSummary: buffaloEntries.length > 0 ? buffaloSummary : undefined,
    dailyEntries: farmerEntries,
    previousBalance,
    advanceAmount,
    deductionAmount,
    adjustmentAmount: totalAdjustments,
    adjustments,
    paymentsMade,
    netPayable,
    closingBalance,
    version: 1,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Format WhatsApp 10-Day Report Message
 */
export function formatWhatsAppBillingMessage(report: FarmerBillingReport): string {
  return `🥛 *${BUSINESS.name.toUpperCase()} — 10-DAY MILK BILLING REPORT*
📍 *Location:* ${BUSINESS.address.formattedAddress}

👤 *Farmer:* ${report.farmerName} (${report.farmerCode})
📅 *Period:* ${report.billingPeriod.label}
🏢 *Center:* ${report.collectionCenterName || 'BMC Collection Hub'}

📊 *MILK COLLECTION SUMMARY:*
• Total Milk Supplied: *${report.totalMilk} Liters* (${report.totalEntries} collections)
${report.cowMilk > 0 ? `• Cow Milk: ${report.cowMilk} L (Avg FAT: ${report.cowSummary?.avgFat}% | Avg Rate: ₹${report.cowSummary?.avgRate}/L)\n` : ''}${report.buffaloMilk > 0 ? `• Buffalo Milk: ${report.buffaloMilk} L (Avg FAT: ${report.buffaloSummary?.avgFat}% | Avg Rate: ₹${report.buffaloSummary?.avgRate}/L)\n` : ''}• Average Rate: *₹${report.avgRate} / Liter*
• Gross Milk Value: *₹${report.grossMilkAmount.toLocaleString('en-IN')}*

💰 *FINANCIAL STATEMENT:*
• Previous Balance: ₹${report.previousBalance.toLocaleString('en-IN')}
${report.advanceAmount > 0 ? `• Advance Recovery: -₹${report.advanceAmount.toLocaleString('en-IN')}\n` : ''}${report.deductionAmount > 0 ? `• Deductions: -₹${report.deductionAmount.toLocaleString('en-IN')}\n` : ''}${report.adjustmentAmount !== 0 ? `• Adjustments: ${report.adjustmentAmount > 0 ? '+' : ''}₹${report.adjustmentAmount.toLocaleString('en-IN')}\n` : ''}━━━━━━━━━━━━━━━━━━━
💵 *NET PAYABLE: ₹${report.netPayable.toLocaleString('en-IN')}*
${report.paymentsMade > 0 ? `• Payments Disbursed: ₹${report.paymentsMade.toLocaleString('en-IN')}\n• Closing Balance: *₹${report.closingBalance.toLocaleString('en-IN')}*\n` : ''}━━━━━━━━━━━━━━━━━━━

📞 *Helpline / Inquiry:* ${BUSINESS.phoneDisplay}
🌐 *Portal:* ${BUSINESS.siteUrl}
_Generated automatically by Rudu Dairy Smart ERP._`;
}

/**
 * Format SMS 10-Day Report Message (Admin Only)
 */
export function formatSmsBillingMessage(report: FarmerBillingReport): string {
  return `RUDU DAIRY: 10-Day Milk Report (${report.billingPeriod.shortLabel}) for ${report.farmerName}: Total Milk: ${report.totalMilk}L, Avg Rate: Rs.${report.avgRate}, Net Payable: Rs.${report.netPayable}. Helpline: ${BUSINESS.phoneDisplay}`;
}

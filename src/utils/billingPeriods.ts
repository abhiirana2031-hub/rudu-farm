import { BillingPeriodInfo, BillingPeriodStatus } from '../types/billing';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Accurately calculate the total days in a month handling leap years dynamically
 * @param year e.g. 2026
 * @param month 1-12 (1 = Jan, 2 = Feb, etc.)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Format standard padded two-digit string (e.g. 8 -> "08")
 */
function pad2(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Generate standard Billing Period ID: e.g. "2026-08-P1"
 */
export function formatBillingPeriodId(year: number, month: number, periodNum: 1 | 2 | 3): string {
  return `${year}-${pad2(month)}-P${periodNum}`;
}

/**
 * Generate Billing Periods for a specific month and year
 * Period 1: 01 - 10
 * Period 2: 11 - 20
 * Period 3: 21 - Last day of Month (28/29/30/31)
 */
export function getBillingPeriodsForMonth(year: number, month: number): BillingPeriodInfo[] {
  const lastDay = getDaysInMonth(year, month);
  const monthName = MONTH_SHORT[month - 1];

  const p1: BillingPeriodInfo = {
    id: formatBillingPeriodId(year, month, 1),
    periodNumber: 1,
    startDate: `${year}-${pad2(month)}-01`,
    endDate: `${year}-${pad2(month)}-10`,
    month,
    year,
    label: `01 ${monthName} – 10 ${monthName} ${year}`,
    shortLabel: `Period 1 (1–10 ${monthName})`,
    status: 'FINALIZED',
  };

  const p2: BillingPeriodInfo = {
    id: formatBillingPeriodId(year, month, 2),
    periodNumber: 2,
    startDate: `${year}-${pad2(month)}-11`,
    endDate: `${year}-${pad2(month)}-20`,
    month,
    year,
    label: `11 ${monthName} – 20 ${monthName} ${year}`,
    shortLabel: `Period 2 (11–20 ${monthName})`,
    status: 'FINALIZED',
  };

  const p3: BillingPeriodInfo = {
    id: formatBillingPeriodId(year, month, 3),
    periodNumber: 3,
    startDate: `${year}-${pad2(month)}-21`,
    endDate: `${year}-${pad2(month)}-${pad2(lastDay)}`,
    month,
    year,
    label: `21 ${monthName} – ${lastDay} ${monthName} ${year}`,
    shortLabel: `Period 3 (21–${lastDay} ${monthName})`,
    status: 'COLLECTION_ACTIVE',
  };

  return [p1, p2, p3];
}

/**
 * Determine Billing Period for any given date
 */
export function getBillingPeriodForDate(dateInput: Date | string): BillingPeriodInfo {
  let date: Date;

  if (typeof dateInput === 'string') {
    // Check if format is "DD MMM YYYY" or ISO
    const parsed = Date.parse(dateInput);
    if (!isNaN(parsed)) {
      date = new Date(parsed);
    } else {
      date = new Date();
    }
  } else {
    date = dateInput;
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate(); // 1-31

  let periodNum: 1 | 2 | 3 = 1;
  if (day >= 1 && day <= 10) {
    periodNum = 1;
  } else if (day >= 11 && day <= 20) {
    periodNum = 2;
  } else {
    periodNum = 3;
  }

  const periods = getBillingPeriodsForMonth(year, month);
  return periods[periodNum - 1];
}

/**
 * Get the current active billing period
 */
export function getCurrentBillingPeriod(): BillingPeriodInfo {
  return getBillingPeriodForDate(new Date());
}

/**
 * Get the previous 10-day billing period
 */
export function getPreviousBillingPeriod(current: BillingPeriodInfo): BillingPeriodInfo {
  if (current.periodNumber === 3) {
    return getBillingPeriodsForMonth(current.year, current.month)[1]; // Period 2
  }
  if (current.periodNumber === 2) {
    return getBillingPeriodsForMonth(current.year, current.month)[0]; // Period 1
  }
  // If period 1, go to previous month's period 3
  let prevMonth = current.month - 1;
  let prevYear = current.year;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear -= 1;
  }
  return getBillingPeriodsForMonth(prevYear, prevMonth)[2]; // Period 3 of prev month
}

/**
 * Get the next 10-day billing period
 */
export function getNextBillingPeriod(current: BillingPeriodInfo): BillingPeriodInfo {
  if (current.periodNumber === 1) {
    return getBillingPeriodsForMonth(current.year, current.month)[1]; // Period 2
  }
  if (current.periodNumber === 2) {
    return getBillingPeriodsForMonth(current.year, current.month)[2]; // Period 3
  }
  // If period 3, go to next month's period 1
  let nextMonth = current.month + 1;
  let nextYear = current.year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  return getBillingPeriodsForMonth(nextYear, nextMonth)[0]; // Period 1 of next month
}

/**
 * Parse date string from standard entries (e.g. "16 May 2025", "16 Aug 2026", "2026-08-16")
 */
export function parseEntryDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }
  return null;
}

/**
 * Check if a date string falls inside the given billing period
 */
export function isEntryInBillingPeriod(entryDateStr: string, period: BillingPeriodInfo): boolean {
  const d = parseEntryDate(entryDateStr);
  if (!d) return false;

  const entryTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const [sy, sm, sd] = period.startDate.split('-').map(Number);
  const [ey, em, ed] = period.endDate.split('-').map(Number);

  const startTime = new Date(sy, sm - 1, sd).getTime();
  const endTime = new Date(ey, em - 1, ed, 23, 59, 59, 999).getTime();

  return entryTime >= startTime && entryTime <= endTime;
}

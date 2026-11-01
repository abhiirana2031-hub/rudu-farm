/**
 * Rudu Farm Enterprise Identifier & Timestamp Generator
 * Provides collision-free, sortable IDs for transactions, dispatches, and batches.
 */

let counter = 0;

/**
 * Returns a sortable date string in YYYYMMDD format
 */
export function getCompactDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/**
 * Generates an entropy suffix using timestamp, sequence counter, and random hex
 */
function getEntropy(len: number = 4): string {
  counter = (counter + 1) % 10000;
  const seq = String(counter).padStart(4, '0');
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return (seq + rand).slice(0, len);
}

/**
 * Unique Milk Collection Entry ID: RF-MC-YYYYMMDD-HHMMSS-XXXX
 * Example: RF-MC-20261027-145500-1042
 */
export function generateMilkEntryId(date: Date = new Date()): string {
  const dateStr = getCompactDateStr(date);
  const timeStr = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
  return `RF-MC-${dateStr}-${timeStr}-${getEntropy(4)}`;
}

/**
 * Printable Receipt Number for Farmer Milk Slips: RCP-YYYYMMDD-XXXX
 */
export function generateReceiptNumber(date: Date = new Date()): string {
  const dateStr = getCompactDateStr(date);
  return `RCP-${dateStr}-${getEntropy(5)}`;
}

/**
 * Unique Payout Settlement Record ID: RF-PAY-YYYYMMDD-XXXXXX
 */
export function generatePayoutId(date: Date = new Date()): string {
  const dateStr = getCompactDateStr(date);
  const timeStr = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
  return `RF-PAY-${dateStr}-${timeStr}-${getEntropy(4)}`;
}

/**
 * Tanker Milk Dispatch ID: RF-DSP-YYYYMMDD-XXXX
 */
export function generateDispatchId(date: Date = new Date()): string {
  return `RF-DSP-${getCompactDateStr(date)}-${getEntropy(4)}`;
}

/**
 * Consumer Order ID: RF-ORD-YYYYMMDD-XXXX
 * Example: RF-ORD-20261027-1042
 */
export function generateOrderId(date: Date = new Date()): string {
  return `RF-ORD-${getCompactDateStr(date)}-${getEntropy(4)}`;
}

/**
 * Quality Lab Test Record ID: RF-QC-YYYYMMDD-XXXX
 */
export function generateQualityTestId(date: Date = new Date()): string {
  return `RF-QC-${getCompactDateStr(date)}-${getEntropy(4)}`;
}

/**
 * Traceable Product Batch ID: BATCH-[SKU]-YYYYMMDD-XX
 * Example: BATCH-GHEE-20261027-01
 */
export function generateProductBatchId(sku: string, date: Date = new Date()): string {
  const cleanSku = (sku || 'PROD').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  return `BATCH-${cleanSku}-${getCompactDateStr(date)}-${getEntropy(2)}`;
}

/**
 * Standard formatted date (e.g., '27 Oct 2026')
 */
export function formatDateDisplay(date: Date = new Date()): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Standard formatted time (e.g., '02:45 PM')
 */
export function formatTimeDisplay(date: Date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Canonical ISO-8601 date string (e.g., '2026-10-27')
 */
export function formatDateISO(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

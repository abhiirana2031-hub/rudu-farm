import { describe, it, expect } from 'vitest';
import {
  generateMilkEntryId,
  generateReceiptNumber,
  generatePayoutId,
  generateDispatchId,
  generateProductBatchId,
  generateOrderId,
  formatDateISO,
} from '../utils/identifiers';

describe('Enterprise Identifiers & Collision Resistance', () => {
  it('generates properly prefixed and formatted milk entry IDs', () => {
    const id = generateMilkEntryId();
    expect(id).toMatch(/^RF-MC-\d{8}-\d{6}-\d{4}$/);
  });

  it('generates printable receipt numbers with date encoding', () => {
    const rcp = generateReceiptNumber();
    expect(rcp).toMatch(/^RCP-\d{8}-\d{5}$/);
  });

  it('generates unique payout IDs', () => {
    const payId = generatePayoutId();
    expect(payId).toMatch(/^RF-PAY-\d{8}-\d{4}-\d{4}$/);
  });

  it('generates batch IDs with SKU tag', () => {
    const batchGhee = generateProductBatchId('GHEE');
    expect(batchGhee).toMatch(/^BATCH-GHEE-\d{8}-\d{2}$/);
  });

  it('produces 1,000 distinct IDs without collision in rapid succession', () => {
    const set = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const id = generateMilkEntryId();
      expect(set.has(id)).toBe(false);
      set.add(id);
    }
    expect(set.size).toBe(1000);
  });

  it('generates properly formatted consumer order IDs with high entropy', () => {
    const id = generateOrderId();
    expect(id).toMatch(/^RF-ORD-\d{8}-\d{4}$/);

    const set = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const orderId = generateOrderId();
      expect(set.has(orderId)).toBe(false);
      set.add(orderId);
    }
    expect(set.size).toBe(500);
  });
});

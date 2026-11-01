import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateAuthoritativePricing,
  createServerOrder,
  recordManualPayment,
  confirmManualPayment,
  reverseManualPayment,
  clearServerOrderStore,
  StaffActor,
} from '../server/orderPaymentService';

describe('Authoritative Order Pricing & Secure Manual Payment Workflow', () => {
  const operatorActor: StaffActor = {
    staffId: 'staff-op-01',
    staffName: 'Ramesh Singh',
    role: 'OPERATOR',
  };

  const accountantActor: StaffActor = {
    staffId: 'staff-acc-01',
    staffName: 'Suresh Gupta',
    role: 'ACCOUNTANT',
  };

  const managerActor: StaffActor = {
    staffId: 'staff-mgr-01',
    staffName: 'Devendra Yadav',
    role: 'MANAGER',
  };

  beforeEach(() => {
    clearServerOrderStore();
  });

  // ── Pricing Invariants ────────────────────────────────────────────────────
  it('calculates prices authoritatively from canonical catalog, completely ignoring client prices', () => {
    // Malicious client claims A2 Bilona Ghee is ₹1.00 instead of canonical ₹1250.00
    const tamperedCart = [
      {
        productId: 'ghee-a2-bilona',
        packLabel: '1 L',
        quantity: 2,
        clientPrice: 1.0, // Tamper attempt
      },
      {
        productId: 'curd-thick-creamy',
        packLabel: '1 kg',
        quantity: 1,
        clientPrice: 5.0, // Tamper attempt
      },
    ];

    const quote = calculateAuthoritativePricing(tamperedCart, 'onetime', 0);

    // Ghee 1L canonical: ₹1250 * 2 = ₹2500 (250000 paise)
    // Curd 1kg canonical: ₹70 * 1 = ₹70 (7000 paise)
    // Subtotal = ₹2570 (257000 paise)
    expect(quote.subtotalRupees).toBe(2570);
    expect(quote.subtotalPaise).toBe(257000);
    expect(quote.totalRupees).toBe(2570);
    expect(quote.totalPaise).toBe(257000);
    expect(quote.discountRupees).toBe(0);

    // Client's fake prices (₹1 and ₹5 = ₹7 total) were completely ignored
    expect(quote.totalRupees).not.toBe(7);
  });

  it('authoritatively applies 10% discount ONLY for subscription orders', () => {
    const cart = [
      {
        productId: 'milk-full-cream',
        packLabel: '1 L', // ₹66 canonical
        quantity: 10, // 10 x ₹66 = ₹660 (66000 paise)
      },
    ];

    // One-time order: 0% discount
    const onetimeQuote = calculateAuthoritativePricing(cart, 'onetime', 0);
    expect(onetimeQuote.discountRupees).toBe(0);
    expect(onetimeQuote.totalRupees).toBe(660);

    // Subscription order: 10% discount = ₹66
    const subQuote = calculateAuthoritativePricing(cart, 'subscription', 0);
    expect(subQuote.discountRupees).toBe(66);
    expect(subQuote.totalRupees).toBe(594); // 660 - 66 = 594
  });

  it('rejects order pricing calculation with negative, zero, or non-integer quantities', () => {
    expect(() =>
      calculateAuthoritativePricing([{ productId: 'milk-full-cream', packLabel: '1 L', quantity: 0 }])
    ).toThrow('Invalid item quantity');

    expect(() =>
      calculateAuthoritativePricing([{ productId: 'milk-full-cream', packLabel: '1 L', quantity: -3 }])
    ).toThrow('Invalid item quantity');

    expect(() =>
      calculateAuthoritativePricing([{ productId: 'milk-full-cream', packLabel: '1 L', quantity: 2.5 }])
    ).toThrow('Invalid item quantity');
  });

  it('rejects unknown product SKUs or nonexistent pack sizes', () => {
    expect(() =>
      calculateAuthoritativePricing([{ productId: 'non-existent-sku', packLabel: '1 L', quantity: 1 }])
    ).toThrow('Product not found in canonical catalog');

    expect(() =>
      calculateAuthoritativePricing([{ productId: 'milk-full-cream', packLabel: '50 L Drum', quantity: 1 }])
    ).toThrow('Pack size "50 L Drum" is not available');
  });

  // ── Order Creation Invariants ─────────────────────────────────────────────
  it('strictly enforces UNPAID payment status on order creation, ignoring client claims of PAID', () => {
    const maliciousOrderPayload = {
      items: [{ productId: 'ghee-a2-bilona', packLabel: '1 L', quantity: 1 }],
      customerName: 'Aarav Sharma',
      customerPhone: '9876543210',
      customerAddress: 'Khasra 277, Sikhreda',
      customerPincode: '281401',
      paymentStatus: 'PAID', // Malicious client claims already paid
      paymentMethod: 'cash',
    };

    const order = createServerOrder(maliciousOrderPayload);

    // Invariant: paymentStatus must strictly be UNPAID
    expect(order.paymentStatus).toBe('UNPAID');
    expect(order.paymentStatus).not.toBe('PAID');
    expect(order.totalAmount).toBe(1250);
    expect(order.totalPaise).toBe(125000);
    expect(order.totalConfirmedPaidPaise).toBe(0);
    expect(order.outstandingBalanceRupees).toBe(1250);
    expect(order.payments).toHaveLength(0);
    expect(order.orderId.startsWith('RF-ORD-')).toBe(true);
  });

  // ── Manual Payment Recording (Stage 1) ────────────────────────────────────
  it('allows authorized operator to record manual payment receipt in PENDING_CONFIRMATION status', () => {
    const order = createServerOrder({
      items: [{ productId: 'milk-a2-cow', packLabel: '1 L', quantity: 2 }], // 2 x ₹78 = ₹156
      customerName: 'Pooja Verma',
      customerPhone: '9876512345',
      customerAddress: 'Mathura Road, Sikhreda',
    });

    const result = recordManualPayment({
      orderId: order.orderId,
      amountRupees: 156,
      paymentMethod: 'cash',
      instrumentReference: 'VOUCHER-001',
      notes: 'Cash received at farm gate collection counter',
      recordedBy: operatorActor,
    });

    expect(result.success).toBe(true);
    expect(result.payment.status).toBe('PENDING_CONFIRMATION');
    expect(result.payment.amountRupees).toBe(156);
    expect(result.payment.recordedBy.staffId).toBe('staff-op-01');
    expect(result.payment.recordedBy.role).toBe('OPERATOR');
    expect(result.payment.paperVoucherSigned).toBe(false);

    // Order status remains UNPAID until an accountant/manager confirms physical settlement
    expect(result.order.paymentStatus).toBe('UNPAID');
    expect(result.order.outstandingBalanceRupees).toBe(156);
  });

  it('rejects manual payment recording from unauthorized actors (e.g., customer or unknown role)', () => {
    const order = createServerOrder({
      items: [{ productId: 'curd-thick-creamy', packLabel: '400 g', quantity: 2 }], // 2 x ₹30 = ₹60
      customerName: 'Kishan Kumar',
      customerPhone: '9411985444',
      customerAddress: 'Village Chhata',
    });

    expect(() =>
      recordManualPayment({
        orderId: order.orderId,
        amountRupees: 60,
        paymentMethod: 'cash',
        recordedBy: { staffId: 'cust-123', staffName: 'Kishan Kumar', role: 'CUSTOMER' as any },
      })
    ).toThrow(/Unauthorized: Role "CUSTOMER"/);
  });

  it('strictly rejects overpayment beyond order total amount', () => {
    const order = createServerOrder({
      items: [{ productId: 'curd-thick-creamy', packLabel: '1 kg', quantity: 1 }], // ₹70
      customerName: 'Mohan Lal',
      customerPhone: '9876598765',
      customerAddress: 'Vrindavan Marg',
    });

    expect(() =>
      recordManualPayment({
        orderId: order.orderId,
        amountRupees: 150, // ₹150 for a ₹70 order
        paymentMethod: 'cash',
        recordedBy: operatorActor,
      })
    ).toThrow(/Overpayment rejected/);
  });

  it('strictly rejects non-positive payment amounts', () => {
    const order = createServerOrder({
      items: [{ productId: 'curd-thick-creamy', packLabel: '1 kg', quantity: 1 }],
      customerName: 'Mohan Lal',
      customerPhone: '9876598765',
      customerAddress: 'Vrindavan Marg',
    });

    expect(() =>
      recordManualPayment({
        orderId: order.orderId,
        amountRupees: 0,
        paymentMethod: 'cash',
        recordedBy: operatorActor,
      })
    ).toThrow('Invalid payment amount');

    expect(() =>
      recordManualPayment({
        orderId: order.orderId,
        amountRupees: -50,
        paymentMethod: 'cash',
        recordedBy: operatorActor,
      })
    ).toThrow('Invalid payment amount');
  });

  // ── Manual Payment Confirmation (Stage 2) ─────────────────────────────────
  it('rejects confirmation by an OPERATOR (requires ACCOUNTANT, MANAGER, or SUPER_ADMIN)', () => {
    const order = createServerOrder({
      items: [{ productId: 'milk-standardized', packLabel: '1 L', quantity: 1 }], // ₹60
      customerName: 'Radha Rani',
      customerPhone: '9411000000',
      customerAddress: 'Barsana Road',
    });

    const record = recordManualPayment({
      orderId: order.orderId,
      amountRupees: 60,
      paymentMethod: 'cash',
      recordedBy: operatorActor,
    });

    // Operator cannot confirm payments
    expect(() =>
      confirmManualPayment({
        orderId: order.orderId,
        receiptNumber: record.payment.receiptNumber,
        confirmedBy: operatorActor,
      })
    ).toThrow(/Unauthorized: Role "OPERATOR" is not authorized to confirm manual payments/);
  });

  it('allows ACCOUNTANT or MANAGER to confirm payment, updating order to PAID and marking paper voucher signed', () => {
    const order = createServerOrder({
      items: [{ productId: 'ghee-danedar-cow', packLabel: '1 L', quantity: 1 }], // ₹680
      customerName: 'Dinesh Chandra',
      customerPhone: '9876541230',
      customerAddress: 'Goverdhan',
    });

    const record = recordManualPayment({
      orderId: order.orderId,
      amountRupees: 680,
      paymentMethod: 'bank_transfer',
      instrumentReference: 'NEFT-SBI-987654321',
      recordedBy: operatorActor,
    });

    expect(order.paymentStatus).toBe('UNPAID');

    const confirmed = confirmManualPayment({
      orderId: order.orderId,
      receiptNumber: record.payment.receiptNumber,
      confirmedBy: accountantActor,
      confirmationNotes: 'Bank statement verified. Physical voucher stamped and filed in ledger.',
      paperVoucherSigned: true,
    });

    expect(confirmed.success).toBe(true);
    expect(confirmed.payment.status).toBe('CONFIRMED');
    expect(confirmed.payment.confirmedBy?.staffName).toBe('Suresh Gupta');
    expect(confirmed.payment.paperVoucherSigned).toBe(true);
    expect(confirmed.order.paymentStatus).toBe('PAID');
    expect(confirmed.order.totalConfirmedPaidPaise).toBe(68000);
    expect(confirmed.order.outstandingBalanceRupees).toBe(0);
  });

  it('supports split/partial manual payments and transitions status to PARTIALLY_PAID until settled', () => {
    const order = createServerOrder({
      items: [{ productId: 'ghee-premium-desi', packLabel: '1 L', quantity: 2 }], // 2 x ₹740 = ₹1480
      customerName: 'Vikas Sharma',
      customerPhone: '9876588888',
      customerAddress: 'Mathura City',
    });

    expect(order.totalAmount).toBe(1480);

    // Installment 1: ₹500 advance recorded and confirmed
    const p1 = recordManualPayment({
      orderId: order.orderId,
      amountRupees: 500,
      paymentMethod: 'cash',
      recordedBy: operatorActor,
    });

    confirmManualPayment({
      orderId: order.orderId,
      receiptNumber: p1.payment.receiptNumber,
      confirmedBy: managerActor,
    });

    expect(order.paymentStatus).toBe('PARTIALLY_PAID');
    expect(order.totalConfirmedPaidPaise).toBe(50000);
    expect(order.outstandingBalanceRupees).toBe(980);

    // Installment 2: Remaining ₹980 recorded and confirmed
    const p2 = recordManualPayment({
      orderId: order.orderId,
      amountRupees: 980,
      paymentMethod: 'upi_transfer',
      instrumentReference: 'UPI-REF-8877665544',
      recordedBy: operatorActor,
    });

    confirmManualPayment({
      orderId: order.orderId,
      receiptNumber: p2.payment.receiptNumber,
      confirmedBy: managerActor,
    });

    expect(order.paymentStatus).toBe('PAID');
    expect(order.totalConfirmedPaidPaise).toBe(148000);
    expect(order.outstandingBalanceRupees).toBe(0);
    expect(order.payments).toHaveLength(2);
  });

  // ── Payment Reversal & Immutable Audit Trail ──────────────────────────────
  it('allows authorized MANAGER to reverse a payment with mandatory audit reason, updating balance without record deletion', () => {
    const order = createServerOrder({
      items: [{ productId: 'curd-masala-chaach', packLabel: '1 L', quantity: 2 }], // 2 x ₹50 = ₹100
      customerName: 'Anil Yadav',
      customerPhone: '9876543219',
      customerAddress: 'Sikhreda Dairy Gate',
    });

    const record = recordManualPayment({
      orderId: order.orderId,
      amountRupees: 100,
      paymentMethod: 'cash',
      recordedBy: operatorActor,
    });

    confirmManualPayment({
      orderId: order.orderId,
      receiptNumber: record.payment.receiptNumber,
      confirmedBy: managerActor,
    });

    expect(order.paymentStatus).toBe('PAID');

    // Operator attempts reversal - rejected
    expect(() =>
      reverseManualPayment({
        orderId: order.orderId,
        receiptNumber: record.payment.receiptNumber,
        reversedBy: operatorActor,
        reversalReason: 'Wrong receipt issued',
      })
    ).toThrow(/Unauthorized: Role "OPERATOR" is not authorized to reverse payments/);

    // Reversal without reason - rejected
    expect(() =>
      reverseManualPayment({
        orderId: order.orderId,
        receiptNumber: record.payment.receiptNumber,
        reversedBy: managerActor,
        reversalReason: '   ',
      })
    ).toThrow('Reversal reason is mandatory for financial audit compliance.');

    // Manager executes compliant reversal
    const reversed = reverseManualPayment({
      orderId: order.orderId,
      receiptNumber: record.payment.receiptNumber,
      reversedBy: managerActor,
      reversalReason: 'Duplicate entry detected; physical cash returned to customer per voucher #V-901.',
    });

    expect(reversed.success).toBe(true);
    expect(reversed.payment.status).toBe('REVERSED');
    expect(reversed.payment.reversedBy?.staffName).toBe('Devendra Yadav');
    expect(reversed.payment.reversalReason).toContain('Duplicate entry detected');

    // Immutability: Payment entry is NOT deleted from order history
    expect(reversed.order.payments).toHaveLength(1);
    expect(reversed.order.payments[0].receiptNumber).toBe(record.payment.receiptNumber);

    // Order status is restored to UNPAID and outstanding balance restored
    expect(reversed.order.paymentStatus).toBe('UNPAID');
    expect(reversed.order.outstandingBalanceRupees).toBe(100);
  });
});

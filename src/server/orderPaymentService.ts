/**
 * Authoritative Server-Side Order Pricing & Manual Payment Audit Service
 * Rudu Dairy / Rudu Farm
 *
 * Implements the authentic Rudu Dairy business workflow:
 * 1. Offline manual payments (Cash, Manual Bank Transfer, UPI Direct Transfer, Cheque)
 * 2. Orders initialized strictly in UNPAID status
 * 3. Two-stage manual payment recording & verification:
 *    - Stage 1: Authorized staff records payment receipt (PENDING_CONFIRMATION)
 *    - Stage 2: Authorized manager/accountant confirms physical/bank settlement & signs off (CONFIRMED)
 * 4. Protection against overpayment, duplicate receipt numbers, and unauthorized changes
 * 5. Immutable audit trails with full actor logging and reversal preservation
 * 6. Zero dependencies on external online payment gateways
 */

// Canonical Authoritative Catalog (Prices in Rupees & Paise)
export interface CanonicalProductPack {
  label: string;
  priceRupees: number;
  pricePaise: number;
}

export interface CanonicalProduct {
  id: string;
  name: string;
  category: string;
  packs: Record<string, CanonicalProductPack>;
}

export const CANONICAL_PRODUCT_CATALOG: Record<string, CanonicalProduct> = {
  'milk-full-cream': {
    id: 'milk-full-cream',
    name: 'Premium Full Cream Milk',
    category: 'milk',
    packs: {
      '500 ml': { label: '500 ml', priceRupees: 35, pricePaise: 3500 },
      '1 L': { label: '1 L', priceRupees: 66, pricePaise: 6600 },
      '2 L': { label: '2 L', priceRupees: 130, pricePaise: 13000 },
    },
  },
  'milk-a2-cow': {
    id: 'milk-a2-cow',
    name: 'A2 Vedic Desi Cow Milk',
    category: 'milk',
    packs: {
      '500 ml': { label: '500 ml', priceRupees: 42, pricePaise: 4200 },
      '1 L': { label: '1 L', priceRupees: 78, pricePaise: 7800 },
      '2 L': { label: '2 L', priceRupees: 152, pricePaise: 15200 },
    },
  },
  'milk-standardized': {
    id: 'milk-standardized',
    name: 'Standardized Fresh Milk',
    category: 'milk',
    packs: {
      '500 ml': { label: '500 ml', priceRupees: 32, pricePaise: 3200 },
      '1 L': { label: '1 L', priceRupees: 60, pricePaise: 6000 },
      '2 L': { label: '2 L', priceRupees: 118, pricePaise: 11800 },
    },
  },
  'milk-toned-slim': {
    id: 'milk-toned-slim',
    name: 'Toned Slim Low-Fat Milk',
    category: 'milk',
    packs: {
      '500 ml': { label: '500 ml', priceRupees: 28, pricePaise: 2800 },
      '1 L': { label: '1 L', priceRupees: 52, pricePaise: 5200 },
      '2 L': { label: '2 L', priceRupees: 100, pricePaise: 10000 },
    },
  },
  'ghee-a2-bilona': {
    id: 'ghee-a2-bilona',
    name: 'A2 Vedic Bilona Cow Ghee',
    category: 'ghee',
    packs: {
      '250 ml': { label: '250 ml', priceRupees: 350, pricePaise: 35000 },
      '500 ml': { label: '500 ml', priceRupees: 650, pricePaise: 65000 },
      '1 L': { label: '1 L', priceRupees: 1250, pricePaise: 125000 },
    },
  },
  'ghee-danedar-cow': {
    id: 'ghee-danedar-cow',
    name: 'Danedar Pure Cow Ghee',
    category: 'ghee',
    packs: {
      '500 ml': { label: '500 ml', priceRupees: 350, pricePaise: 35000 },
      '1 L': { label: '1 L', priceRupees: 680, pricePaise: 68000 },
      '2 L': { label: '2 L', priceRupees: 1320, pricePaise: 132000 },
    },
  },
  'ghee-premium-desi': {
    id: 'ghee-premium-desi',
    name: 'Premium Desi Buffalo Ghee',
    category: 'ghee',
    packs: {
      '500 ml': { label: '500 ml', priceRupees: 380, pricePaise: 38000 },
      '1 L': { label: '1 L', priceRupees: 740, pricePaise: 74000 },
    },
  },
  'curd-thick-creamy': {
    id: 'curd-thick-creamy',
    name: 'Natural Thick Creamy Dahi',
    category: 'curd',
    packs: {
      '200 g': { label: '200 g', priceRupees: 18, pricePaise: 1800 },
      '400 g': { label: '400 g', priceRupees: 30, pricePaise: 3000 },
      '1 kg': { label: '1 kg', priceRupees: 70, pricePaise: 7000 },
    },
  },
  'curd-masala-chaach': {
    id: 'curd-masala-chaach',
    name: 'Masala Spiced Buttermilk (Chaach)',
    category: 'curd',
    packs: {
      '250 ml': { label: '250 ml', priceRupees: 15, pricePaise: 1500 },
      '500 ml': { label: '500 ml', priceRupees: 28, pricePaise: 2800 },
      '1 L': { label: '1 L', priceRupees: 50, pricePaise: 5000 },
    },
  },
};

export type ManualPaymentMethod = 'cash' | 'upi_transfer' | 'bank_transfer' | 'cheque';
export type StaffRole = 'SUPER_ADMIN' | 'ACCOUNTANT' | 'MANAGER' | 'OPERATOR';

export interface StaffActor {
  staffId: string;
  staffName: string;
  role: StaffRole;
}

export interface ManualPaymentEntry {
  receiptNumber: string;
  orderId: string;
  amountRupees: number;
  amountPaise: number;
  paymentMethod: ManualPaymentMethod;
  instrumentReference?: string; // Cheque No, Bank UTR, or UPI ref
  recordedBy: StaffActor;
  recordedAt: string;
  notes?: string;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'REVERSED';
  confirmedBy?: StaffActor;
  confirmedAt?: string;
  confirmationNotes?: string;
  paperVoucherSigned: boolean;
  reversalReason?: string;
  reversedBy?: StaffActor;
  reversedAt?: string;
}

export interface OrderItemInput {
  productId: string;
  packLabel: string;
  quantity: number;
  clientPrice?: number; // Ignored / rejected
}

export interface ValidatedOrderItem {
  productId: string;
  productName: string;
  packLabel: string;
  quantity: number;
  unitPriceRupees: number;
  unitPricePaise: number;
  lineSubtotalRupees: number;
  lineSubtotalPaise: number;
}

export interface AuthoritativePriceQuote {
  subtotalRupees: number;
  subtotalPaise: number;
  discountRupees: number;
  discountPaise: number;
  deliveryFeeRupees: number;
  deliveryFeePaise: number;
  totalRupees: number;
  totalPaise: number;
  orderMode: 'subscription' | 'onetime';
  items: ValidatedOrderItem[];
}

export interface ServerOrderRecord {
  orderId: string;
  userId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerPincode: string;
  deliverySlot: 'morning' | 'evening';
  deliveryNotes?: string;
  pricing: AuthoritativePriceQuote;
  totalAmount: number; // in Rupees
  totalPaise: number; // in Paise
  totalConfirmedPaidPaise: number; // Sum of confirmed payments
  outstandingBalanceRupees: number; // totalAmount - (totalConfirmedPaidPaise / 100)
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';
  preferredPaymentMethod: ManualPaymentMethod | 'cod' | 'whatsapp';
  createdAt: string;
  payments: ManualPaymentEntry[];
}

// In-memory server order store for orders processed through the backend API
const serverOrdersStore = new Map<string, ServerOrderRecord>();

// Ledger of all receipt numbers to prevent duplicate entry
const registeredReceiptNumbers = new Set<string>();

/**
 * Authoritatively calculates prices from the canonical catalog.
 */
export function calculateAuthoritativePricing(
  items: OrderItemInput[],
  orderMode: 'subscription' | 'onetime' = 'onetime',
  deliveryFeeRupees: number = 0
): AuthoritativePriceQuote {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  const validatedItems: ValidatedOrderItem[] = [];
  let subtotalPaise = 0;

  for (const item of items) {
    if (!item.productId || typeof item.productId !== 'string') {
      throw new Error('Invalid product identifier.');
    }

    const product = CANONICAL_PRODUCT_CATALOG[item.productId];
    if (!product) {
      throw new Error(`Product not found in canonical catalog: ${item.productId}`);
    }

    if (!item.packLabel || typeof item.packLabel !== 'string') {
      throw new Error(`Invalid pack label for product ${item.productId}`);
    }

    const pack = product.packs[item.packLabel];
    if (!pack) {
      throw new Error(`Pack size "${item.packLabel}" is not available for product ${item.productId}`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`Invalid item quantity for ${item.productId}: must be a positive integer.`);
    }

    if (item.quantity > 100) {
      throw new Error(`Quantity exceeds maximum purchase limit (100) for ${item.productId}.`);
    }

    const lineSubtotalPaise = pack.pricePaise * item.quantity;
    subtotalPaise += lineSubtotalPaise;

    validatedItems.push({
      productId: product.id,
      productName: product.name,
      packLabel: pack.label,
      quantity: item.quantity,
      unitPriceRupees: pack.priceRupees,
      unitPricePaise: pack.pricePaise,
      lineSubtotalRupees: lineSubtotalPaise / 100,
      lineSubtotalPaise,
    });
  }

  // Authoritative discount rule: exactly 10% on subscription mode, 0% on one-time
  const discountPaise = orderMode === 'subscription' ? Math.round(subtotalPaise * 0.1) : 0;
  const deliveryFeePaise = Math.max(0, Math.round(deliveryFeeRupees * 100));
  const totalPaise = Math.max(0, subtotalPaise - discountPaise + deliveryFeePaise);

  return {
    subtotalRupees: subtotalPaise / 100,
    subtotalPaise,
    discountRupees: discountPaise / 100,
    discountPaise,
    deliveryFeeRupees: deliveryFeePaise / 100,
    deliveryFeePaise,
    totalRupees: totalPaise / 100,
    totalPaise,
    orderMode,
    items: validatedItems,
  };
}

/**
 * Creates an authoritative order record in a trusted server environment.
 * Sets paymentStatus strictly to 'UNPAID'.
 */
export function createServerOrder(body: any, _clientIp: string = '127.0.0.1'): ServerOrderRecord {
  const {
    items,
    orderMode = 'onetime',
    customerName,
    customerPhone,
    customerAddress,
    customerPincode = '281401',
    deliverySlot = 'morning',
    deliveryNotes,
    paymentMethod = 'cash',
    userId,
  } = body || {};

  if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
    throw new Error('Customer name is required.');
  }

  const cleanPhone = (customerPhone || '').replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    throw new Error('Valid 10-digit customer mobile number is required.');
  }

  if (!customerAddress || typeof customerAddress !== 'string' || !customerAddress.trim()) {
    throw new Error('Customer delivery address is required.');
  }

  const pricing = calculateAuthoritativePricing(items, orderMode, 0);

  // Generate authoritative ID
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `RF-ORD-${dateStr}-${randSuffix}`;

  const orderRecord: ServerOrderRecord = {
    orderId,
    userId: userId || undefined,
    customerId: userId || `CUST-${cleanPhone}`,
    customerName: customerName.trim(),
    customerPhone: cleanPhone,
    customerAddress: customerAddress.trim(),
    customerPincode: (customerPincode || '281401').trim(),
    deliverySlot: deliverySlot === 'evening' ? 'evening' : 'morning',
    deliveryNotes: deliveryNotes ? String(deliveryNotes).trim() : undefined,
    pricing,
    totalAmount: pricing.totalRupees,
    totalPaise: pricing.totalPaise,
    totalConfirmedPaidPaise: 0,
    outstandingBalanceRupees: pricing.totalRupees,
    paymentStatus: 'UNPAID', // Invariant: all new orders are UNPAID
    preferredPaymentMethod: paymentMethod,
    createdAt: new Date().toISOString(),
    payments: [],
  };

  serverOrdersStore.set(orderId, orderRecord);
  return orderRecord;
}

/**
 * Stage 1: Authorized staff records a physical manual payment receipt.
 * Status becomes PENDING_CONFIRMATION until an authorized manager/accountant confirms.
 */
export function recordManualPayment(params: {
  orderId: string;
  amountRupees: number;
  paymentMethod: ManualPaymentMethod;
  instrumentReference?: string;
  notes?: string;
  recordedBy: StaffActor;
}): { success: boolean; payment: ManualPaymentEntry; order: ServerOrderRecord } {
  const { orderId, amountRupees, paymentMethod, instrumentReference, notes, recordedBy } = params;

  // Authorization check
  const authorizedRoles: StaffRole[] = ['SUPER_ADMIN', 'ACCOUNTANT', 'MANAGER', 'OPERATOR'];
  if (!recordedBy || !authorizedRoles.includes(recordedBy.role)) {
    throw new Error(`Unauthorized: Role "${recordedBy?.role}" cannot record manual payments.`);
  }

  if (typeof amountRupees !== 'number' || amountRupees <= 0) {
    throw new Error('Invalid payment amount: must be greater than zero.');
  }

  const amountPaise = Math.round(amountRupees * 100);

  const order = serverOrdersStore.get(orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (order.paymentStatus === 'CANCELLED') {
    throw new Error(`Cannot accept payment for cancelled order: ${orderId}`);
  }

  // Calculate current active payments
  const existingActivePaise = order.payments
    .filter((p) => p.status === 'CONFIRMED' || p.status === 'PENDING_CONFIRMATION')
    .reduce((sum, p) => sum + p.amountPaise, 0);

  // Prevent overpayment
  if (existingActivePaise + amountPaise > order.totalPaise) {
    const maxAllowedRupees = (order.totalPaise - existingActivePaise) / 100;
    throw new Error(
      `Overpayment rejected: Total order amount is ₹${order.totalAmount}. Maximum payable amount remaining is ₹${maxAllowedRupees}.`
    );
  }

  // Generate unique receipt number
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const receiptNumber = `RF-REC-${dateStr}-${randNum}`;

  if (registeredReceiptNumbers.has(receiptNumber)) {
    throw new Error(`Duplicate receipt number generated: ${receiptNumber}`);
  }

  const paymentEntry: ManualPaymentEntry = {
    receiptNumber,
    orderId,
    amountRupees,
    amountPaise,
    paymentMethod,
    instrumentReference: instrumentReference?.trim() || undefined,
    recordedBy: {
      staffId: recordedBy.staffId,
      staffName: recordedBy.staffName,
      role: recordedBy.role,
    },
    recordedAt: new Date().toISOString(),
    notes: notes?.trim(),
    status: 'PENDING_CONFIRMATION', // Needs physical/sign-off confirmation
    paperVoucherSigned: false,
  };

  registeredReceiptNumbers.add(receiptNumber);
  order.payments.push(paymentEntry);
  serverOrdersStore.set(orderId, order);

  return { success: true, payment: paymentEntry, order };
}

/**
 * Stage 2: Authorized Manager/Accountant confirms that payment was physically received,
 * verified against bank/cash register, and printed voucher is signed.
 */
export function confirmManualPayment(params: {
  orderId: string;
  receiptNumber: string;
  confirmedBy: StaffActor;
  confirmationNotes?: string;
  paperVoucherSigned?: boolean;
}): { success: boolean; payment: ManualPaymentEntry; order: ServerOrderRecord } {
  const { orderId, receiptNumber, confirmedBy, confirmationNotes, paperVoucherSigned = true } = params;

  // Confirmation is restricted to Manager, Accountant, or SuperAdmin
  const confirmingRoles: StaffRole[] = ['SUPER_ADMIN', 'ACCOUNTANT', 'MANAGER'];
  if (!confirmedBy || !confirmingRoles.includes(confirmedBy.role)) {
    throw new Error(
      `Unauthorized: Role "${confirmedBy?.role}" is not authorized to confirm manual payments.`
    );
  }

  const order = serverOrdersStore.get(orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const payment = order.payments.find((p) => p.receiptNumber === receiptNumber);
  if (!payment) {
    throw new Error(`Payment receipt "${receiptNumber}" not found on order ${orderId}`);
  }

  if (payment.status === 'CONFIRMED') {
    return { success: true, payment, order };
  }

  if (payment.status === 'REVERSED') {
    throw new Error(`Cannot confirm reversed payment receipt: ${receiptNumber}`);
  }

  // Update payment entry
  payment.status = 'CONFIRMED';
  payment.confirmedBy = {
    staffId: confirmedBy.staffId,
    staffName: confirmedBy.staffName,
    role: confirmedBy.role,
  };
  payment.confirmedAt = new Date().toISOString();
  payment.confirmationNotes = confirmationNotes?.trim() || undefined;
  payment.paperVoucherSigned = Boolean(paperVoucherSigned);

  // Recalculate order status
  const totalConfirmedPaise = order.payments
    .filter((p) => p.status === 'CONFIRMED')
    .reduce((sum, p) => sum + p.amountPaise, 0);

  order.totalConfirmedPaidPaise = totalConfirmedPaise;
  order.outstandingBalanceRupees = Math.max(0, (order.totalPaise - totalConfirmedPaise) / 100);

  if (totalConfirmedPaise >= order.totalPaise) {
    order.paymentStatus = 'PAID';
  } else if (totalConfirmedPaise > 0) {
    order.paymentStatus = 'PARTIALLY_PAID';
  } else {
    order.paymentStatus = 'UNPAID';
  }

  serverOrdersStore.set(orderId, order);
  return { success: true, payment, order };
}

/**
 * Reverses or corrects a payment with an immutable audit entry.
 * Records are NEVER deleted.
 */
export function reverseManualPayment(params: {
  orderId: string;
  receiptNumber: string;
  reversedBy: StaffActor;
  reversalReason: string;
}): { success: boolean; payment: ManualPaymentEntry; order: ServerOrderRecord } {
  const { orderId, receiptNumber, reversedBy, reversalReason } = params;

  // Reversals restricted to Manager or SuperAdmin
  const reversalRoles: StaffRole[] = ['SUPER_ADMIN', 'MANAGER'];
  if (!reversedBy || !reversalRoles.includes(reversedBy.role)) {
    throw new Error(`Unauthorized: Role "${reversedBy?.role}" is not authorized to reverse payments.`);
  }

  if (!reversalReason || !reversalReason.trim()) {
    throw new Error('Reversal reason is mandatory for financial audit compliance.');
  }

  const order = serverOrdersStore.get(orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const payment = order.payments.find((p) => p.receiptNumber === receiptNumber);
  if (!payment) {
    throw new Error(`Payment receipt "${receiptNumber}" not found on order ${orderId}`);
  }

  if (payment.status === 'REVERSED') {
    throw new Error(`Payment ${receiptNumber} has already been reversed.`);
  }

  // Mark reversed (never delete)
  payment.status = 'REVERSED';
  payment.reversedBy = {
    staffId: reversedBy.staffId,
    staffName: reversedBy.staffName,
    role: reversedBy.role,
  };
  payment.reversedAt = new Date().toISOString();
  payment.reversalReason = reversalReason.trim();

  // Recalculate confirmed totals
  const totalConfirmedPaise = order.payments
    .filter((p) => p.status === 'CONFIRMED')
    .reduce((sum, p) => sum + p.amountPaise, 0);

  order.totalConfirmedPaidPaise = totalConfirmedPaise;
  order.outstandingBalanceRupees = Math.max(0, (order.totalPaise - totalConfirmedPaise) / 100);

  if (totalConfirmedPaise >= order.totalPaise) {
    order.paymentStatus = 'PAID';
  } else if (totalConfirmedPaise > 0) {
    order.paymentStatus = 'PARTIALLY_PAID';
  } else {
    order.paymentStatus = 'UNPAID';
  }

  serverOrdersStore.set(orderId, order);
  return { success: true, payment, order };
}

/**
 * Helper for testing/dev: retrieves stored order
 */
export function getServerOrder(orderId: string): ServerOrderRecord | undefined {
  return serverOrdersStore.get(orderId);
}

/**
 * Clears order store and receipt ledger (useful in test suites)
 */
export function clearServerOrderStore(): void {
  serverOrdersStore.clear();
  registeredReceiptNumbers.clear();
}

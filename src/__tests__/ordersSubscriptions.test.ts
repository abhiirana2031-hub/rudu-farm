import { describe, it, expect } from 'vitest';

interface CartItem {
  productId: string;
  pricePerUnit: number; // in Rupees
  quantity: number;
}

function calculateOrderTotal(
  items: CartItem[],
  discountRupees: number = 0,
  deliveryFeeRupees: number = 0
): { subtotal: number; discount: number; delivery: number; total: number } {
  const subtotalPaise = items.reduce(
    (sum, item) => sum + Math.round(item.pricePerUnit * 100) * item.quantity,
    0
  );
  const discountPaise = Math.round(discountRupees * 100);
  const deliveryPaise = Math.round(deliveryFeeRupees * 100);
  const totalPaise = Math.max(0, subtotalPaise - discountPaise + deliveryPaise);

  return {
    subtotal: subtotalPaise / 100,
    discount: discountPaise / 100,
    delivery: deliveryPaise / 100,
    total: totalPaise / 100,
  };
}

function generateDeliverySchedule(
  startDateStr: string,
  daysCount: number,
  frequency: 'daily' | 'alternate',
  isPaused: boolean = false
): string[] {
  if (isPaused) return [];
  const schedule: string[] = [];
  const start = new Date(startDateStr);

  const step = frequency === 'daily' ? 1 : 2;
  for (let i = 0; i < daysCount; i += step) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    schedule.push(cur.toISOString().split('T')[0]);
  }
  return schedule;
}

describe('Consumer Orders & Subscriptions Engine', () => {
  it('accurately computes cart subtotal, discount, and final order total', () => {
    const items: CartItem[] = [
      { productId: 'GHEE-1L', pricePerUnit: 1850.0, quantity: 2 }, // 3700.00
      { productId: 'PANEER-500G', pricePerUnit: 240.5, quantity: 3 }, // 721.50
    ];

    const result = calculateOrderTotal(items, 150.0, 50.0);
    expect(result.subtotal).toBe(4421.5);
    expect(result.discount).toBe(150.0);
    expect(result.delivery).toBe(50.0);
    expect(result.total).toBe(4321.5); // 4421.50 - 150.00 + 50.00
  });

  it('generates correct daily delivery schedules', () => {
    const schedule = generateDeliverySchedule('2026-11-01', 5, 'daily');
    expect(schedule).toEqual([
      '2026-11-01',
      '2026-11-02',
      '2026-11-03',
      '2026-11-04',
      '2026-11-05',
    ]);
  });

  it('generates correct alternate-day delivery schedules', () => {
    const schedule = generateDeliverySchedule('2026-11-01', 5, 'alternate');
    expect(schedule).toEqual(['2026-11-01', '2026-11-03', '2026-11-05']);
  });

  it('yields 0 scheduled deliveries when subscription is paused', () => {
    const schedule = generateDeliverySchedule('2026-11-01', 30, 'daily', true);
    expect(schedule).toHaveLength(0);
  });

  it('rejects client-side price tampering by resolving against canonical catalog', () => {
    const CANONICAL_CATALOG: Record<string, number> = {
      'GHEE-1L': 1850.0,
      'PANEER-500G': 240.5,
    };

    function validateAndPriceOrder(
      items: Array<{ productId: string; clientPrice?: number; quantity: number }>
    ) {
      let subtotalPaise = 0;
      for (const item of items) {
        if (item.quantity <= 0) throw new Error('Quantity must be greater than zero');
        const authoritativePrice = CANONICAL_CATALOG[item.productId];
        if (!authoritativePrice) throw new Error(`Unknown product SKU: ${item.productId}`);
        subtotalPaise += Math.round(authoritativePrice * 100) * item.quantity;
      }
      return subtotalPaise / 100;
    }

    // Client tampered with price (claiming ₹1.00 for ₹1850 Ghee)
    const tamperedCart = [
      { productId: 'GHEE-1L', clientPrice: 1.0, quantity: 2 },
    ];

    const authoritativeTotal = validateAndPriceOrder(tamperedCart);
    // Price must be calculated using canonical catalog (₹3700.00), NOT client value (₹2.00)
    expect(authoritativeTotal).toBe(3700.0);
    expect(authoritativeTotal).not.toBe(2.0);
  });

  it('enforces that initial order paymentStatus must be PENDING, ignoring client claims of PAID', () => {
    interface OrderRequest {
      customerId: string;
      claimedPaymentStatus?: string;
      items: Array<{ productId: string; quantity: number }>;
    }

    function createAuthoritativeOrder(req: OrderRequest) {
      if (!req.items.length) throw new Error('Empty order');
      return {
        customerId: req.customerId,
        // Invariant: payment status defaults to PENDING regardless of what client sends
        paymentStatus: 'PENDING' as const,
        verifiedAt: new Date().toISOString(),
      };
    }

    const maliciousClientOrder: OrderRequest = {
      customerId: 'untrusted-customer-123',
      claimedPaymentStatus: 'PAID', // Client tries to spoof successful payment
      items: [{ productId: 'GHEE-1L', quantity: 1 }],
    };

    const serverOrder = createAuthoritativeOrder(maliciousClientOrder);
    expect(serverOrder.paymentStatus).toBe('PENDING');
    expect(serverOrder.paymentStatus).not.toBe('PAID');
  });

  it('rejects order with non-positive quantities', () => {
    const CANONICAL_CATALOG: Record<string, number> = { 'GHEE-1L': 1850.0 };
    function validateQuantities(items: Array<{ productId: string; quantity: number }>) {
      for (const item of items) {
        if (item.quantity <= 0) throw new Error(`Invalid item quantity: ${item.quantity}`);
      }
      return true;
    }

    expect(() => validateQuantities([{ productId: 'GHEE-1L', quantity: 0 }])).toThrow('Invalid item quantity');
    expect(() => validateQuantities([{ productId: 'GHEE-1L', quantity: -3 }])).toThrow('Invalid item quantity');
  });
});

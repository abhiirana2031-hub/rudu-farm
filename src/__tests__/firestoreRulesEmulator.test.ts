import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const PROJECT_ID = 'rudu-dairy-rules-live';
let testEnv: RulesTestEnvironment | null = null;

describe('Live Firestore Security Rules Execution (Firebase Emulator)', () => {
  beforeAll(async () => {
    const rulesPath = path.resolve(__dirname, '../../firestore.rules');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');

    // Configure testing environment pointing to local live Firestore emulator (port 8080)
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        host: '127.0.0.1',
        port: 8080,
        rules: rulesContent,
      },
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  it('DENIES unauthenticated access to user profiles and payouts', async () => {
    const unauthDb = testEnv!.unauthenticatedContext().firestore();

    // Unauthenticated read of user profile denied
    await assertFails(getDoc(doc(unauthDb, 'users', 'user-alice')));

    // Unauthenticated creation of payout denied
    await assertFails(
      setDoc(doc(unauthDb, 'payouts', 'pay-unauth'), {
        amount: 5000,
        farmerId: 'farmer-1',
      })
    );

    // Unauthenticated read of audit logs denied
    await assertFails(getDoc(doc(unauthDb, 'audit_logs', 'log-1')));
  });

  it('DENIES a farmer from reading another farmer private profile', async () => {
    // Setup farmer Alice profile with admin context
    await testEnv!.withSecurityRulesDisabled(async (adminContext) => {
      const adminDb = adminContext.firestore();
      await setDoc(doc(adminDb, 'users', 'farmer-alice'), {
        uid: 'farmer-alice',
        name: 'Alice Farmer',
        role: 'FARMER',
      });
    });

    const bobContext = testEnv!.authenticatedContext('farmer-bob');
    const bobDb = bobContext.firestore();

    // Bob cannot read Alice's profile
    await assertFails(getDoc(doc(bobDb, 'users', 'farmer-alice')));

    // Alice can read her own profile
    const aliceContext = testEnv!.authenticatedContext('farmer-alice');
    const aliceDb = aliceContext.firestore();
    await assertSucceeds(getDoc(doc(aliceDb, 'users', 'farmer-alice')));
  });

  it('DENIES a regular user from self-escalating role to SUPER_ADMIN', async () => {
    const charlieContext = testEnv!.authenticatedContext('user-charlie');
    const charlieDb = charlieContext.firestore();

    // Charlie tries to create/update their profile with role: SUPER_ADMIN
    await assertFails(
      setDoc(doc(charlieDb, 'users', 'user-charlie'), {
        uid: 'user-charlie',
        role: 'SUPER_ADMIN',
        name: 'Malicious Charlie',
      })
    );

    // Charlie creating normal user profile succeeds
    await assertSucceeds(
      setDoc(doc(charlieDb, 'users', 'user-charlie'), {
        uid: 'user-charlie',
        role: 'FARMER',
        name: 'Legitimate Charlie',
      })
    );

    // Charlie trying to upgrade existing role to SUPER_ADMIN fails
    await assertFails(
      updateDoc(doc(charlieDb, 'users', 'user-charlie'), {
        role: 'SUPER_ADMIN',
      })
    );
  });

  it('DENIES operators from updating settings or creating payouts', async () => {
    const opContext = testEnv!.authenticatedContext('operator-op1');
    const opDb = opContext.firestore();

    // Operator cannot modify system rate chart settings
    await assertFails(
      setDoc(doc(opDb, 'settings', 'rate_chart'), {
        baseRate: 99.0,
      })
    );

    // Operator cannot create finalized payouts (SuperAdmin only)
    await assertFails(
      setDoc(doc(opDb, 'payouts', 'pay-op-001'), {
        amount: 15000,
        farmerId: 'farmer-1',
      })
    );

    // Operator cannot delete a farmer record
    await assertFails(deleteDoc(doc(opDb, 'farmers', 'farmer-1')));
  });

  it('ENFORCES strict immutability on finalized payouts: update and delete DENIED', async () => {
    // Seed existing payout with SuperAdmin
    await testEnv!.withSecurityRulesDisabled(async (adminContext) => {
      const adminDb = adminContext.firestore();
      await setDoc(doc(adminDb, 'users', 'super-admin-uid'), {
        uid: 'super-admin-uid',
        role: 'SUPER_ADMIN',
      });
      await setDoc(doc(adminDb, 'payouts', 'pay-cleared-001'), {
        payoutId: 'RF-PAY-20261027-001',
        amount: 4500,
        status: 'Cleared',
      });
    });

    const adminContext = testEnv!.authenticatedContext('super-admin-uid');
    const adminDb = adminContext.firestore();

    // Even SuperAdmin CANNOT mutate or delete an existing payout
    await assertFails(
      updateDoc(doc(adminDb, 'payouts', 'pay-cleared-001'), {
        amount: 99999, // Attempted financial tampering
      })
    );

    await assertFails(deleteDoc(doc(adminDb, 'payouts', 'pay-cleared-001')));
  });

  it('ENFORCES strict immutability on audit logs: append-only, update/delete DENIED', async () => {
    const aliceContext = testEnv!.authenticatedContext('farmer-alice');
    const aliceDb = aliceContext.firestore();

    // Authenticated user can append audit log
    await assertSucceeds(
      setDoc(doc(aliceDb, 'audit_logs', 'audit-001'), {
        action: 'MILK_COLLECTION_CREATED',
        timestamp: new Date().toISOString(),
      })
    );

    // Modification or deletion of audit logs is forbidden
    await assertFails(
      updateDoc(doc(aliceDb, 'audit_logs', 'audit-001'), {
        action: 'ALTERED_RECORD',
      })
    );

    await assertFails(deleteDoc(doc(aliceDb, 'audit_logs', 'audit-001')));
  });

  it('DENIES direct client order creation and tampering across all client bypass attempts', async () => {
    const unauthDb = testEnv!.unauthenticatedContext().firestore();
    const custContext = testEnv!.authenticatedContext('cust-123');
    const custDb = custContext.firestore();

    // 1. Direct creation by unauthenticated client is DENIED
    await assertFails(
      setDoc(doc(unauthDb, 'orders', 'ord-unauth-attempt'), {
        customerId: 'cust-123',
        totalAmount: 1850,
        paymentStatus: 'PENDING',
      })
    );

    // 2. Direct creation by authenticated customer is DENIED (must use backend API)
    await assertFails(
      setDoc(doc(custDb, 'orders', 'ord-cust-attempt'), {
        userId: 'cust-123',
        customerId: 'cust-123',
        totalAmount: 1850,
        paymentStatus: 'PENDING',
      })
    );

    // 3. Forged PAID status directly submitted by client is DENIED
    await assertFails(
      setDoc(doc(unauthDb, 'orders', 'ord-spoofed-paid'), {
        customerId: 'cust-123',
        totalAmount: 1850,
        paymentStatus: 'PAID',
      })
    );

    // 4. Missing totalAmount directly submitted by client is DENIED
    await assertFails(
      setDoc(doc(custDb, 'orders', 'ord-missing-total'), {
        customerId: 'cust-123',
        items: [{ productId: 'ghee-1l', quantity: 1 }],
      })
    );

    // 5. Forged product prices (₹1) directly submitted by client is DENIED
    await assertFails(
      setDoc(doc(custDb, 'orders', 'ord-forged-price'), {
        customerId: 'cust-123',
        totalAmount: 1.0,
        items: [{ productId: 'ghee-a2-bilona', price: 1.0, quantity: 1 }],
      })
    );

    // 6. Negative quantities directly submitted by client is DENIED
    await assertFails(
      setDoc(doc(custDb, 'orders', 'ord-negative-qty'), {
        customerId: 'cust-123',
        totalAmount: 100,
        items: [{ productId: 'milk-1l', quantity: -5 }],
      })
    );

    // 7. Client cannot update any existing order
    await assertFails(
      updateDoc(doc(custDb, 'orders', 'ord-existing'), {
        paymentStatus: 'PAID',
      })
    );

    // 8. SuperAdmin / trusted backend CAN create and update orders
    await testEnv!.withSecurityRulesDisabled(async (adminContext) => {
      const adminDb = adminContext.firestore();
      await setDoc(doc(adminDb, 'orders', 'ord-server-001'), {
        userId: 'cust-123',
        customerId: 'cust-123',
        totalAmount: 1850,
        paymentStatus: 'PENDING',
      });
    });

    // Customer CAN read their own order created by the server
    await assertSucceeds(getDoc(doc(custDb, 'orders', 'ord-server-001')));

    // Another customer CANNOT read this customer's order
    const otherCustContext = testEnv!.authenticatedContext('other-user-999');
    const otherCustDb = otherCustContext.firestore();
    await assertFails(getDoc(doc(otherCustDb, 'orders', 'ord-server-001')));
  });

  it('ALLOWS legitimate business operations: public product viewing and milk entry logging', async () => {
    // Seed product catalog
    await testEnv!.withSecurityRulesDisabled(async (adminContext) => {
      const adminDb = adminContext.firestore();
      await setDoc(doc(adminDb, 'products', 'ghee-1l'), {
        name: 'Pure Desi Bilona Ghee',
        price: 1850,
      });
    });

    const unauthDb = testEnv!.unauthenticatedContext().firestore();
    // Public can read product catalog
    await assertSucceeds(getDoc(doc(unauthDb, 'products', 'ghee-1l')));

    // Authenticated operator can create daily milk entry
    const opContext = testEnv!.authenticatedContext('operator-op1');
    const opDb = opContext.firestore();
    await assertSucceeds(
      setDoc(doc(opDb, 'entries', 'entry-today-001'), {
        farmerId: 'farmer-alice',
        quantity: 12.5,
        fat: 6.5,
        snf: 9.0,
      })
    );
  });
});

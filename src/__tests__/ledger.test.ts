import { describe, it, expect } from 'vitest';

interface LedgerAccount {
  farmerId: string;
  totalEarningsPaise: number;
  totalPayoutsPaise: number;
  payableBalancePaise: number;
}

function processCreditEntry(account: LedgerAccount, amountPaise: number): LedgerAccount {
  const newEarnings = account.totalEarningsPaise + amountPaise;
  return {
    ...account,
    totalEarningsPaise: newEarnings,
    payableBalancePaise: newEarnings - account.totalPayoutsPaise,
  };
}

function processPayoutDebit(account: LedgerAccount, payoutPaise: number): LedgerAccount {
  if (payoutPaise <= 0) throw new Error('Payout amount must be positive');
  if (payoutPaise > account.payableBalancePaise) {
    throw new Error('Payout exceeds payable balance');
  }
  const newPayouts = account.totalPayoutsPaise + payoutPaise;
  return {
    ...account,
    totalPayoutsPaise: newPayouts,
    payableBalancePaise: account.totalEarningsPaise - newPayouts,
  };
}

describe('Double-Entry Subledger & Farmer Settlement', () => {
  it('accurately credits milk collection earnings to farmer balance', () => {
    let account: LedgerAccount = {
      farmerId: 'FARM-001',
      totalEarningsPaise: 0,
      totalPayoutsPaise: 0,
      payableBalancePaise: 0,
    };

    // Deposit 1: ₹500.25 (50025 paise)
    account = processCreditEntry(account, 50025);
    expect(account.payableBalancePaise).toBe(50025);
    expect(account.totalEarningsPaise).toBe(50025);

    // Deposit 2: ₹350.50 (35050 paise)
    account = processCreditEntry(account, 35050);
    expect(account.payableBalancePaise).toBe(85075);
  });

  it('accurately debits approved payouts and maintains correct remaining balance', () => {
    let account: LedgerAccount = {
      farmerId: 'FARM-001',
      totalEarningsPaise: 100000, // ₹1,000.00
      totalPayoutsPaise: 0,
      payableBalancePaise: 100000,
    };

    // Payout ₹600.00 (60000 paise)
    account = processPayoutDebit(account, 60000);
    expect(account.totalPayoutsPaise).toBe(60000);
    expect(account.payableBalancePaise).toBe(40000); // ₹400.00 remaining
  });

  it('rejects payouts exceeding the payable balance', () => {
    const account: LedgerAccount = {
      farmerId: 'FARM-001',
      totalEarningsPaise: 50000, // ₹500.00
      totalPayoutsPaise: 0,
      payableBalancePaise: 50000,
    };

    expect(() => processPayoutDebit(account, 60000)).toThrow('Payout exceeds payable balance');
  });

  it('rejects zero or negative payout amounts', () => {
    const account: LedgerAccount = {
      farmerId: 'FARM-001',
      totalEarningsPaise: 50000,
      totalPayoutsPaise: 0,
      payableBalancePaise: 50000,
    };

    expect(() => processPayoutDebit(account, 0)).toThrow('Payout amount must be positive');
    expect(() => processPayoutDebit(account, -100)).toThrow('Payout amount must be positive');
  });

  it('detects and blocks duplicate settlements for the same billing cycle', () => {
    interface SettlementRecord {
      payoutId: string;
      farmerId: string;
      periodStart: string;
      periodEnd: string;
      status: string;
    }

    const recordedSettlements: SettlementRecord[] = [
      {
        payoutId: 'PAY-20261027-001',
        farmerId: 'FARM-001',
        periodStart: '2026-10-01',
        periodEnd: '2026-10-10',
        status: 'Cleared',
      },
    ];

    function validateNewSettlement(candidate: SettlementRecord): boolean {
      const isDuplicate = recordedSettlements.some(
        (s) =>
          s.farmerId === candidate.farmerId &&
          s.periodStart === candidate.periodStart &&
          s.periodEnd === candidate.periodEnd &&
          s.status !== 'Failed'
      );
      if (isDuplicate) {
        throw new Error(`Duplicate settlement blocked for period ${candidate.periodStart} to ${candidate.periodEnd}`);
      }
      return true;
    }

    // Attempting same period should throw
    expect(() =>
      validateNewSettlement({
        payoutId: 'PAY-20261027-002',
        farmerId: 'FARM-001',
        periodStart: '2026-10-01',
        periodEnd: '2026-10-10',
        status: 'Pending',
      })
    ).toThrow('Duplicate settlement blocked');

    // Different period should succeed
    expect(
      validateNewSettlement({
        payoutId: 'PAY-20261027-003',
        farmerId: 'FARM-001',
        periodStart: '2026-10-11',
        periodEnd: '2026-10-20',
        status: 'Pending',
      })
    ).toBe(true);
  });
});

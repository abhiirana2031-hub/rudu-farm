import {
  Farmer,
  MilkEntry,
  PayoutRecord,
  FarmNotification,
  RateChartConfig,
  TankerDispatch,
  QualityTestRecord,
  OperatorUser,
  CollectionCenter,
} from '../types';

export const EMPTY_FARMER: Farmer = {
  id: '',
  name: '',
  farmerCode: '',
  phone: '',
  village: '',
  district: '',
  cattleCount: 0,
  cowCount: 0,
  buffaloCount: 0,
  memberSince: new Date().getFullYear().toString(),
  bankDetails: {
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    kycStatus: 'Pending',
  },
};

export const DEFAULT_RATE_CHART: RateChartConfig = {
  cowBaseRate: 45.0,
  cowFatMultiplier: 4.5,
  cowSnfMultiplier: 3.2,
  minCowFat: 3.2,
  minCowSnf: 8.0,

  buffaloBaseRate: 65.0,
  buffaloFatMultiplier: 6.5,
  buffaloSnfMultiplier: 4.0,
  minBuffaloFat: 5.0,
  minBuffaloSnf: 8.5,

  lastUpdated: new Date().toISOString(),
};

// Production-ready clean arrays (no hardcoded demo data)
export const SEED_FARMERS: Farmer[] = [];
export const SEED_MILK_ENTRIES: MilkEntry[] = [];
export const SEED_PAYOUTS: PayoutRecord[] = [];
export const SEED_NOTIFICATIONS: FarmNotification[] = [];
export const SEED_RATE_CHART: RateChartConfig = DEFAULT_RATE_CHART;
export const SEED_TANKER_DISPATCHES: TankerDispatch[] = [];
export const SEED_QUALITY_TESTS: QualityTestRecord[] = [];
export const SEED_OPERATORS: OperatorUser[] = [];
export const SEED_CENTERS: CollectionCenter[] = [];

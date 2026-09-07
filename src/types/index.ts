export type UserRole = 'farmer' | 'employee' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'gu' | 'pa' | 'mr';

export type ShiftType = 'morning' | 'evening';

export type MilkType = 'cow' | 'buffalo';

export type EntryStatus = 'Completed' | 'Pending' | 'In Progress';

export type PayoutStatus = 'Cleared' | 'Pending' | 'Upcoming';

export type PaymentMethod = 'UPI' | 'Bank Transfer' | 'Cash Settlement';

export interface Farmer {
  id: string;
  name: string;
  farmerCode: string; // e.g. "RF7237"
  phone: string;
  village: string;
  district: string;
  cattleCount: number;
  cowCount: number;
  buffaloCount: number;
  memberSince: string;
  status?: 'Active' | 'Inactive';
  avatarUrl?: string;
  pendingBalance?: number;
  pin?: string;
  password?: string;
  bankDetails: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    kycStatus: 'Verified' | 'Pending';
  };
}

export interface TankerDispatch {
  id: string;
  dispatchId: string; // e.g. "DISP-892"
  tankerNumber: string; // e.g. "GJ-07-TK-4921"
  driverName: string;
  driverPhone: string;
  destination: string; // e.g. "Amul Dairy Chilling Plant, Anand"
  dispatchTime: string;
  quantityLiters: number;
  temperatureCelsius: number; // e.g. 3.8
  sealNumber: string;
  testedFat: number;
  testedSnf: number;
  adulterationStatus: 'Pass' | 'Fail';
  status: 'In Transit' | 'Delivered' | 'Scheduled';
  notes?: string;
}

export interface QualityTestRecord {
  id: string;
  testId: string;
  timestamp: string;
  sampleSource: string; // e.g. "Morning Bulk Batch #102"
  mbrtMinutes: number; // e.g. 240
  alcoholTest: 'Negative (Passed)' | 'Positive (Curdled)';
  cobTest: 'Passed' | 'Failed'; // Clot on Boiling
  adulterationResult: 'Pure / Clean' | 'Suspect';
  testedBy: string;
  status: 'Approved' | 'Rejected';
}

export interface RateChartConfig {
  cowBaseRate: number; // base ₹ / liter
  cowFatMultiplier: number;
  cowSnfMultiplier: number;
  minCowFat: number;
  minCowSnf: number;
  buffaloBaseRate: number;
  buffaloFatMultiplier: number;
  buffaloSnfMultiplier: number;
  minBuffaloFat: number;
  minBuffaloSnf: number;
  lastUpdated: string;
}

export type PricingMode = 'MANUAL_RATE' | 'RATE_CHART' | 'ADMIN_DEFINED';

export type RateSource = 'manual' | 'chart' | 'admin';

export type QuantityUnit = 'L' | 'Kg';

export type RateUnit = 'L' | 'Kg';

export interface MilkQualityValidationConfig {
  minCowFat: number;
  maxCowFat: number;
  minCowSnf: number;
  maxCowSnf: number;
  minBuffaloFat: number;
  maxBuffaloFat: number;
  minBuffaloSnf: number;
  maxBuffaloSnf: number;
  strictValidation: boolean;
  allowRateOverride: boolean;
  defaultPricingMode: PricingMode;
  defaultUnit: QuantityUnit;
}

export interface CollectionAuditEntry {
  id: string;
  tenantId?: string;
  collectionId: string;
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  operatorId?: string;
  operatorName?: string;
  action:
    | 'MILK_COLLECTION_CREATED'
    | 'FAT_ENTERED'
    | 'SNF_ENTERED'
    | 'RATE_ENTERED'
    | 'RATE_AUTO_CALCULATED'
    | 'RATE_OVERRIDDEN'
    | 'MILK_COLLECTION_UPDATED'
    | 'MILK_COLLECTION_DELETED'
    | 'DUPLICATE_OVERRIDDEN';
  actorRole: 'admin' | 'employee' | 'farmer';
  timestamp: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  reason?: string;
  details?: string;
}

export interface MilkEntry {
  id: string;
  receiptId: string; // e.g. "ENTRY-1484"
  tenantId?: string;
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  village: string;
  date: string; // "16 May 2025" or "16 Aug 2025"
  time: string; // "06:35 AM"
  shift: ShiftType;
  milkType: MilkType;
  quantityLiters: number;
  quantity?: number;
  quantityUnit?: QuantityUnit;
  fatPercentage: number;
  fat?: number;
  snfPercentage: number;
  snf?: number;
  clrReading: number;
  pricingMode?: PricingMode;
  ratePerLiter: number;
  rate?: number;
  rateUnit?: RateUnit;
  totalAmount: number;
  amount?: number;
  rateSource?: RateSource;
  rateOverridden?: boolean;
  originalRate?: number;
  overrideReason?: string;
  status: EntryStatus;
  collectedBy: string;
  operatorId?: string;
  collectionCenterId?: string;
  centerName?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PayoutRecord {
  id: string;
  payoutId: string; // e.g. "PAY-281"
  date: string; // "16 May 2025"
  time: string; // "10:36 AM"
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  village: string;
  paymentMethod: PaymentMethod;
  paymentReference: string; // "UPI/98007373"
  amount: number;
  status: PayoutStatus;
  periodStart: string; // "01 May 2025"
  periodEnd: string; // "15 May 2025"
  totalMilkSupplied: number; // 121
  avgRate: number; // 58.00
  paidOn: string;
  receivedBy: string;
  notes?: string;
}

export interface OperatorUser {
  id: string;
  name: string;
  employeeCode: string; // e.g. "OP-101"
  phone: string;
  centerId: string;
  centerName: string; // e.g. "Kheda Hub #01"
  status: 'Active' | 'Inactive';
  shiftAssigned: 'Morning' | 'Evening' | 'Both';
  joinDate: string;
  pin?: string;
  password?: string;
}

export interface CollectionCenter {
  id: string;
  name: string;
  code: string;
  village: string;
  district: string;
  assignedOperator: string;
  activeFarmers: number;
  dailyIntakeAvg: number;
}

export interface FarmNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'rate' | 'payout' | 'collection' | 'announcement';
}

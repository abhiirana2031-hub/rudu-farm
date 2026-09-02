import { MilkEntry, MilkType } from './index';

export type BillingPeriodStatus =
  | 'OPEN'
  | 'COLLECTION_ACTIVE'
  | 'PENDING_REVIEW'
  | 'FINALIZED'
  | 'LOCKED'
  | 'ARCHIVED';

export interface BillingPeriodInfo {
  id: string; // e.g. "2026-08-P1"
  periodNumber: 1 | 2 | 3;
  startDate: string; // "YYYY-MM-DD" e.g. "2026-08-01"
  endDate: string; // "YYYY-MM-DD" e.g. "2026-08-10"
  month: number; // 1 - 12
  year: number; // e.g. 2026
  label: string; // "01 Aug – 10 Aug 2026"
  shortLabel: string; // "Period 1 (1–10)"
  status: BillingPeriodStatus;
  finalizedAt?: string;
  finalizedBy?: string;
  lockedAt?: string;
  lockedBy?: string;
}

export type AdjustmentType =
  | 'MANUAL_CORRECTION'
  | 'INCENTIVE_BONUS'
  | 'QUALITY_ADJUSTMENT'
  | 'FEED_MEDICINE_DEDUCTION'
  | 'ADVANCE_RECOVERY'
  | 'OTHER_DEDUCTION';

export interface BillingAdjustment {
  id: string;
  tenantId?: string;
  farmerId: string;
  billingPeriodId: string;
  type: AdjustmentType;
  label: string;
  reason: string;
  amount: number; // Positive (bonus/addition) or Negative (deduction)
  adjustedBy: string;
  createdAt: string;
}

export interface MilkTypeSummary {
  milkType: MilkType;
  totalQuantity: number;
  avgFat: number;
  avgSnf: number;
  avgRate: number;
  totalAmount: number;
  entryCount: number;
}

export interface FarmerBillingReport {
  id: string; // e.g. "RPT-2026-08-P1-RF7237"
  tenantId?: string;
  billingPeriodId: string;
  billingPeriod: BillingPeriodInfo;
  farmerId: string;
  farmerName: string;
  farmerCode: string;
  farmerMobile: string;
  village: string;
  collectionCenterId?: string;
  collectionCenterName?: string;
  operatorId?: string;
  operatorName?: string;
  status: 'DRAFT' | 'FINALIZED' | 'LOCKED';
  
  // Milk Metrics
  totalEntries: number;
  totalMilk: number;
  cowMilk: number;
  buffaloMilk: number;
  avgFat: number;
  avgSnf: number;
  avgRate: number;
  grossMilkAmount: number;
  cowSummary?: MilkTypeSummary;
  buffaloSummary?: MilkTypeSummary;

  // Daily entries snapshot
  dailyEntries: MilkEntry[];

  // Financial Breakdown
  previousBalance: number;
  advanceAmount: number;
  deductionAmount: number;
  adjustmentAmount: number;
  adjustments: BillingAdjustment[];
  paymentsMade: number;
  netPayable: number;
  closingBalance: number;

  // Versioning & Audit
  version: number;
  generatedAt: string;
  finalizedAt?: string;
  finalizedBy?: string;
  lockedAt?: string;
  lockedBy?: string;
}

export type ReportAuditAction =
  | 'REPORT_CREATED'
  | 'REPORT_RECALCULATED'
  | 'REPORT_ADJUSTED'
  | 'REPORT_FINALIZED'
  | 'REPORT_REOPENED'
  | 'REPORT_LOCKED'
  | 'REPORT_DOWNLOADED'
  | 'REPORT_PRINTED'
  | 'REPORT_WHATSAPP_SENT'
  | 'REPORT_SMS_SENT';

export interface ReportAuditLog {
  id: string;
  reportId: string;
  farmerId: string;
  billingPeriodId: string;
  action: ReportAuditAction;
  actorId: string;
  actorName: string;
  actorRole: 'admin' | 'employee' | 'farmer';
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface ReportNotificationLog {
  id: string;
  reportId: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  channel: 'SMS' | 'WHATSAPP';
  senderRole: 'admin' | 'employee' | 'farmer';
  senderName: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt: string;
  errorReason?: string;
}

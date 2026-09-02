/**
 * Types for Centralized Print & Document Template System
 */

export type DocumentTemplateKey =
  | 'GENERAL_RECEIPT'
  | 'BILL_PRINT'
  | 'SALARY_SLIP'
  | 'PURCHASE_BILL'
  | 'SALE_BILL'
  | 'SALE_MILK_RECEIPT'
  | 'EXPENSE_BILL'
  | 'MISCELLANEOUS_BILL'
  | 'FARMER_10DAY_SUMMARY'
  | 'FARMER_PAYOUT_RECEIPT'
  | 'FARMER_LEDGER_STATEMENT'
  | 'CENTER_DAILY_SUMMARY'
  | 'OPERATOR_DAILY_SUMMARY'
  | 'MONTHLY_COLLECTION_REPORT';

export type PaperFormat = 'A4' | 'A5' | 'THERMAL_80MM' | 'THERMAL_58MM';

export interface BusinessProfile {
  name: string;
  tagline?: string;
  address: string;
  phone: string;
  email: string;
  gstin?: string;
  fssaiNumber?: string;
  website?: string;
  logoUrl?: string;
}

export interface DocumentLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount?: number;
  taxPercent?: number;
  amount: number;
}

export interface GeneratedDocumentRecord {
  id: string;
  documentNumber: string;
  documentType: DocumentTemplateKey;
  documentTitle: string;
  referenceId?: string;
  recipientName: string;
  amount: number;
  paperFormat: PaperFormat;
  createdAt: string;
  createdBy: string;
}

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Rudu Smart Farm & Dairy Management',
  tagline: 'Fresh • Traceable • Cooperative Dairy Network',
  address: 'Plot 42, Anand-Kheda Dairy Expressway, Gujarat - 388001',
  phone: '+91 98765 43210 / +91 (2692) 245890',
  email: 'accounts@rudufarm.com / support@rudufarm.com',
  gstin: '24AAACR1234F1Z5',
  fssaiNumber: '10022021000452',
  website: 'www.rudufarm.com',
};

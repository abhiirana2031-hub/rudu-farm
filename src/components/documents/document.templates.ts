/**
 * Centralized Document Template Registry
 * Defines metadata, allowed formats, and default configuration for 14 ERP document types.
 */

import { DocumentTemplateKey, PaperFormat } from './document.types';

export interface DocumentDefinition {
  key: DocumentTemplateKey;
  name: string;
  category: 'receipts' | 'billing' | 'payroll' | 'farmer' | 'operations';
  description: string;
  supportedFormats: PaperFormat[];
  defaultFormat: PaperFormat;
  documentPrefix: string;
}

export const DOCUMENT_REGISTRY: Record<DocumentTemplateKey, DocumentDefinition> = {
  GENERAL_RECEIPT: {
    key: 'GENERAL_RECEIPT',
    name: 'General Receipt',
    category: 'receipts',
    description: 'Generic money receipt with payment mode, reference ID, and authorized stamp.',
    supportedFormats: ['A4', 'A5', 'THERMAL_80MM'],
    defaultFormat: 'A4',
    documentPrefix: 'REC',
  },

  BILL_PRINT: {
    key: 'BILL_PRINT',
    name: 'Tax Invoice / Bill',
    category: 'billing',
    description: 'Itemized commercial tax invoice with GST breakdown, customer details, and payment terms.',
    supportedFormats: ['A4', 'A5'],
    defaultFormat: 'A4',
    documentPrefix: 'INV',
  },

  SALARY_SLIP: {
    key: 'SALARY_SLIP',
    name: 'Employee Salary Slip',
    category: 'payroll',
    description: 'Monthly pay slip with earnings, allowances, overtime, deductions, and net payable.',
    supportedFormats: ['A4'],
    defaultFormat: 'A4',
    documentPrefix: 'SAL',
  },

  PURCHASE_BILL: {
    key: 'PURCHASE_BILL',
    name: 'Purchase Bill / Inward',
    category: 'billing',
    description: 'Inward purchase voucher for cattle feed, equipment, medicine, or dairy consumables.',
    supportedFormats: ['A4', 'A5'],
    defaultFormat: 'A4',
    documentPrefix: 'PUR',
  },

  SALE_BILL: {
    key: 'SALE_BILL',
    name: 'Commercial Sale Bill',
    category: 'billing',
    description: 'Wholesale & retail milk/dairy product distribution invoice with balance tracking.',
    supportedFormats: ['A4', 'A5', 'THERMAL_80MM'],
    defaultFormat: 'A4',
    documentPrefix: 'SLB',
  },

  SALE_MILK_RECEIPT: {
    key: 'SALE_MILK_RECEIPT',
    name: 'Milk Collection Intake Slip',
    category: 'farmer',
    description: 'Farmer milk intake receipt with Fat%, SNF%, CLR, rate calculation, and thermal/A4 formats.',
    supportedFormats: ['A4', 'THERMAL_80MM', 'THERMAL_58MM'],
    defaultFormat: 'THERMAL_80MM',
    documentPrefix: 'MLK',
  },

  EXPENSE_BILL: {
    key: 'EXPENSE_BILL',
    name: 'Expense Voucher',
    category: 'receipts',
    description: 'Operational & center maintenance expense voucher with approval authorization.',
    supportedFormats: ['A4', 'A5'],
    defaultFormat: 'A5',
    documentPrefix: 'EXP',
  },

  MISCELLANEOUS_BILL: {
    key: 'MISCELLANEOUS_BILL',
    name: 'Miscellaneous Bill',
    category: 'billing',
    description: 'Flexible multi-line item invoice with customizable add/remove item rows.',
    supportedFormats: ['A4', 'A5'],
    defaultFormat: 'A4',
    documentPrefix: 'MISC',
  },

  FARMER_10DAY_SUMMARY: {
    key: 'FARMER_10DAY_SUMMARY',
    name: '10-Day Farmer Milk Summary',
    category: 'farmer',
    description: '10-day cycle statement with daily shift intake, avg Fat/SNF, earnings, deductions, & net payable.',
    supportedFormats: ['A4'],
    defaultFormat: 'A4',
    documentPrefix: 'CYC',
  },

  FARMER_PAYOUT_RECEIPT: {
    key: 'FARMER_PAYOUT_RECEIPT',
    name: 'Farmer Payment / Payout Slip',
    category: 'farmer',
    description: 'Disbursement payment voucher with bank reference, period dates, and farmer sign.',
    supportedFormats: ['A4', 'A5', 'THERMAL_80MM'],
    defaultFormat: 'A5',
    documentPrefix: 'PAY',
  },

  FARMER_LEDGER_STATEMENT: {
    key: 'FARMER_LEDGER_STATEMENT',
    name: 'Farmer Ledger Statement',
    category: 'farmer',
    description: 'Complete passbook ledger showing date-wise debits, credits, and running balance.',
    supportedFormats: ['A4'],
    defaultFormat: 'A4',
    documentPrefix: 'LDG',
  },

  CENTER_DAILY_SUMMARY: {
    key: 'CENTER_DAILY_SUMMARY',
    name: 'Collection Center Daily Summary',
    category: 'operations',
    description: 'Shift-wise summary of AMCU/BMC hub intake volume, milk types, and revenue.',
    supportedFormats: ['A4'],
    defaultFormat: 'A4',
    documentPrefix: 'CDS',
  },

  OPERATOR_DAILY_SUMMARY: {
    key: 'OPERATOR_DAILY_SUMMARY',
    name: 'Operator Shift Daily Summary',
    category: 'operations',
    description: 'Operator shift activity report with farmers served, volume collected, and session times.',
    supportedFormats: ['A4'],
    defaultFormat: 'A4',
    documentPrefix: 'ODS',
  },

  MONTHLY_COLLECTION_REPORT: {
    key: 'MONTHLY_COLLECTION_REPORT',
    name: 'Monthly Dairy Collection Report',
    category: 'operations',
    description: 'Comprehensive month-wise dairy intake, cow vs buffalo breakdown, and overall financials.',
    supportedFormats: ['A4'],
    defaultFormat: 'A4',
    documentPrefix: 'MCR',
  },
};

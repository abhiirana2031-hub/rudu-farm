export type PaperFormat = 'A4' | 'A5' | 'THERMAL_80MM' | 'THERMAL_58MM';

export type TemplateCategory = 'receipts' | 'invoices' | 'statements' | 'reports';

export interface DocumentTemplateMeta {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  iconName: string;
  defaultFormat: PaperFormat;
  supportedFormats: PaperFormat[];
  prefix: string;
}

export const DOCUMENT_TEMPLATES: Record<string, DocumentTemplateMeta> = {
  GENERAL_RECEIPT: {
    id: 'GENERAL_RECEIPT',
    name: 'General Receipt',
    category: 'receipts',
    description: 'Generic payment acknowledgment receipt with reference ID, mode & signatures.',
    iconName: 'Receipt',
    defaultFormat: 'A4',
    supportedFormats: ['A4', 'A5', 'THERMAL_80MM'],
    prefix: 'REC'
  },
  BILL_PRINT: {
    id: 'BILL_PRINT',
    name: 'Bill Print / Tax Invoice',
    category: 'invoices',
    description: 'Standard commercial invoice with multi-line items, tax, discount & subtotal math.',
    iconName: 'FileText',
    defaultFormat: 'A4',
    supportedFormats: ['A4', 'A5'],
    prefix: 'INV'
  },
  SALARY_SLIP: {
    id: 'SALARY_SLIP',
    name: 'Salary Slip',
    category: 'invoices',
    description: 'Employee monthly payslip displaying basic salary, allowances, deductions & net payable.',
    iconName: 'CreditCard',
    defaultFormat: 'A4',
    supportedFormats: ['A4'],
    prefix: 'SLIP'
  },
  PURCHASE_BILL: {
    id: 'PURCHASE_BILL',
    name: 'Purchase Bill',
    category: 'invoices',
    description: 'Supplier purchase invoice with itemized inventory, rate, tax & outstanding balance.',
    iconName: 'ShoppingBag',
    defaultFormat: 'A4',
    supportedFormats: ['A4', 'A5'],
    prefix: 'PUR'
  },
  SALE_BILL: {
    id: 'SALE_BILL',
    name: 'Sale Bill',
    category: 'invoices',
    description: 'Customer sales invoice with terms, itemization, payment mode & balance due.',
    iconName: 'ShoppingBag',
    defaultFormat: 'A4',
    supportedFormats: ['A4', 'A5'],
    prefix: 'SALE'
  },
  SALE_MILK_RECEIPT: {
    id: 'SALE_MILK_RECEIPT',
    name: 'Sale Milk Receipt',
    category: 'receipts',
    description: 'Primary milk collection receipt with FAT, SNF, Rate/L & total amount. Supports Thermal Printers.',
    iconName: 'Droplets',
    defaultFormat: 'THERMAL_80MM',
    supportedFormats: ['THERMAL_80MM', 'THERMAL_58MM', 'A4'],
    prefix: 'MILK'
  },
  EXPENSE_BILL: {
    id: 'EXPENSE_BILL',
    name: 'Expense Bill / Voucher',
    category: 'invoices',
    description: 'Internal expense voucher with category, payee, authorization signature & notes.',
    iconName: 'DollarSign',
    defaultFormat: 'A4',
    supportedFormats: ['A4', 'A5'],
    prefix: 'EXP'
  },
  MISC_BILL: {
    id: 'MISC_BILL',
    name: 'Miscellaneous Bill',
    category: 'invoices',
    description: 'Flexible ad-hoc bill allowing custom line items, tax, discount & totals.',
    iconName: 'FileSpreadsheet',
    defaultFormat: 'A4',
    supportedFormats: ['A4', 'A5'],
    prefix: 'MISC'
  },
  FARMER_10DAY_SUMMARY: {
    id: 'FARMER_10DAY_SUMMARY',
    name: '10-Day Farmer Milk Summary',
    category: 'statements',
    description: '10-day period milk collection statement for farmer payout calculation & WhatsApp sharing.',
    iconName: 'Calendar',
    defaultFormat: 'A4',
    supportedFormats: ['A4'],
    prefix: 'SUM10'
  },
  FARMER_PAYOUT_RECEIPT: {
    id: 'FARMER_PAYOUT_RECEIPT',
    name: 'Farmer Payout Receipt',
    category: 'receipts',
    description: 'Official settlement receipt for farmer milk payouts showing previous balance & amount paid.',
    iconName: 'CheckCircle2',
    defaultFormat: 'A4',
    supportedFormats: ['A4', 'A5', 'THERMAL_80MM'],
    prefix: 'PAY'
  },
  FARMER_LEDGER: {
    id: 'FARMER_LEDGER',
    name: 'Farmer Ledger Statement',
    category: 'statements',
    description: 'Full accounting ledger for a farmer with Debit, Credit & Running Balance breakdown.',
    iconName: 'BookOpen',
    defaultFormat: 'A4',
    supportedFormats: ['A4'],
    prefix: 'LEDGER'
  },
  CENTER_DAILY_SUMMARY: {
    id: 'CENTER_DAILY_SUMMARY',
    name: 'Collection Center Daily Summary',
    category: 'reports',
    description: 'Daily collection center audit report showing total liters, FAT, SNF & farmer count.',
    iconName: 'Building2',
    defaultFormat: 'A4',
    supportedFormats: ['A4'],
    prefix: 'CCREP'
  },
  OPERATOR_DAILY_SUMMARY: {
    id: 'OPERATOR_DAILY_SUMMARY',
    name: 'Operator Daily Summary',
    category: 'reports',
    description: 'Shift summary report showing operator session details, entries logged & total volume.',
    iconName: 'UserCheck',
    defaultFormat: 'A4',
    supportedFormats: ['A4'],
    prefix: 'OPREP'
  },
  MONTHLY_MILK_REPORT: {
    id: 'MONTHLY_MILK_REPORT',
    name: 'Monthly Milk Collection Report',
    category: 'reports',
    description: 'Comprehensive monthly audit showing daily breakdown, cow vs buffalo milk & total payouts.',
    iconName: 'PieChart',
    defaultFormat: 'A4',
    supportedFormats: ['A4'],
    prefix: 'MREP'
  }
};

export function generateDocumentNumber(prefix: string): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${dateStr}-${randNum}`;
}

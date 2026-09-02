/**
 * Strict 3-Role Role-Based Access Control (RBAC) System
 * Roles:
 *   - 👑 Admin (Full system control)
 *   - 🧑🌾 Operator (Operational milk collection & intake)
 *   - 🌾 Farmer (Personal portal & own records only)
 */

import { UserRole } from '../../types';

export type StandardRole = 'ADMIN' | 'OPERATOR' | 'FARMER';

export type Permission =
  // Dashboard
  | 'DASHBOARD_FULL_VIEW'
  | 'DASHBOARD_OPERATIONAL_VIEW'
  | 'DASHBOARD_PERSONAL_VIEW'
  // Farmer Management
  | 'FARMERS_VIEW_ALL'
  | 'FARMERS_REGISTER'
  | 'FARMERS_EDIT_FULL'
  | 'FARMERS_EDIT_OWN'
  // Milk Collection
  | 'COLLECTION_CREATE'
  | 'COLLECTION_EDIT_RECENT'
  | 'COLLECTION_EDIT_ANY'
  | 'COLLECTION_DELETE_AUDITED'
  | 'COLLECTION_VIEW_ALL'
  | 'COLLECTION_VIEW_OWN'
  // Milk Rates
  | 'RATE_CHART_MANAGE'
  | 'RATE_CHART_VIEW'
  // Payouts & Settlements
  | 'PAYOUT_CALCULATE'
  | 'PAYOUT_DISBURSE'
  | 'PAYOUT_APPROVE'
  | 'PAYOUT_VIEW_ALL'
  | 'PAYOUT_VIEW_OWN'
  // Bank & Profile
  | 'BANK_DETAILS_MANAGE_ALL'
  | 'BANK_DETAILS_MANAGE_OWN'
  // Operator Management
  | 'OPERATORS_MANAGE'
  // Reports & Documents
  | 'REPORTS_FULL'
  | 'REPORTS_DAILY_SHIFT'
  | 'EXPORT_DATA_FULL'
  | 'EXPORT_DATA_OWN'
  // System & Audit
  | 'SYSTEM_SETTINGS_MANAGE'
  | 'AUDIT_LOGS_VIEW';

/**
 * Map legacy role strings ('admin', 'employee', 'farmer') to StandardRole
 */
export const normalizeRole = (role?: string | UserRole): StandardRole => {
  if (!role) return 'FARMER';
  const upper = role.toUpperCase();
  if (upper === 'ADMIN' || upper === 'TENANT_ADMIN' || upper === 'SUPER_ADMIN') return 'ADMIN';
  if (upper === 'OPERATOR' || upper === 'EMPLOYEE') return 'OPERATOR';
  return 'FARMER';
};

/**
 * Granular Permissions Configuration for 3 Roles
 */
export const ROLE_PERMISSIONS: Record<StandardRole, Set<Permission>> = {
  ADMIN: new Set<Permission>([
    'DASHBOARD_FULL_VIEW',
    'DASHBOARD_OPERATIONAL_VIEW',
    'DASHBOARD_PERSONAL_VIEW',
    'FARMERS_VIEW_ALL',
    'FARMERS_REGISTER',
    'FARMERS_EDIT_FULL',
    'FARMERS_EDIT_OWN',
    'COLLECTION_CREATE',
    'COLLECTION_EDIT_RECENT',
    'COLLECTION_EDIT_ANY',
    'COLLECTION_DELETE_AUDITED',
    'COLLECTION_VIEW_ALL',
    'COLLECTION_VIEW_OWN',
    'RATE_CHART_MANAGE',
    'RATE_CHART_VIEW',
    'PAYOUT_CALCULATE',
    'PAYOUT_DISBURSE',
    'PAYOUT_APPROVE',
    'PAYOUT_VIEW_ALL',
    'PAYOUT_VIEW_OWN',
    'BANK_DETAILS_MANAGE_ALL',
    'BANK_DETAILS_MANAGE_OWN',
    'OPERATORS_MANAGE',
    'REPORTS_FULL',
    'REPORTS_DAILY_SHIFT',
    'EXPORT_DATA_FULL',
    'EXPORT_DATA_OWN',
    'SYSTEM_SETTINGS_MANAGE',
    'AUDIT_LOGS_VIEW',
  ]),

  OPERATOR: new Set<Permission>([
    'DASHBOARD_OPERATIONAL_VIEW',
    'FARMERS_VIEW_ALL',
    'FARMERS_REGISTER',
    'COLLECTION_CREATE',
    'COLLECTION_EDIT_RECENT',
    'COLLECTION_VIEW_ALL',
    'RATE_CHART_VIEW',
    'REPORTS_DAILY_SHIFT',
    'EXPORT_DATA_OWN',
  ]),

  FARMER: new Set<Permission>([
    'DASHBOARD_PERSONAL_VIEW',
    'FARMERS_EDIT_OWN',
    'COLLECTION_VIEW_OWN',
    'RATE_CHART_VIEW',
    'PAYOUT_VIEW_OWN',
    'BANK_DETAILS_MANAGE_OWN',
    'EXPORT_DATA_OWN',
  ]),
};

/**
 * Check if a role possesses a specific permission
 */
export const hasPermission = (role: UserRole | string | undefined, permission: Permission): boolean => {
  const stdRole = normalizeRole(role);
  return ROLE_PERMISSIONS[stdRole]?.has(permission) ?? false;
};

/**
 * Security Rule: Enforce farmer data isolation
 * Farmer can strictly only access their own farmerId
 */
export const canAccessFarmerData = (
  role: UserRole | string | undefined,
  authenticatedFarmerId?: string,
  targetFarmerId?: string
): boolean => {
  const stdRole = normalizeRole(role);
  if (stdRole === 'ADMIN' || stdRole === 'OPERATOR') return true;
  if (!authenticatedFarmerId || !targetFarmerId) return false;
  return authenticatedFarmerId === targetFarmerId;
};

/**
 * Security Rule: Enforce collection editing rules
 * - Admin: can edit any entry
 * - Operator: can only edit today's entries or entries within their shift session
 * - Farmer: read only (must request correction)
 */
export const canModifyCollection = (
  role: UserRole | string | undefined,
  entryCreatedAt?: string
): boolean => {
  const stdRole = normalizeRole(role);
  if (stdRole === 'ADMIN') return true;
  if (stdRole === 'OPERATOR') {
    if (!entryCreatedAt) return true;
    const entryDate = new Date(entryCreatedAt).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  }
  return false;
};

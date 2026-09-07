import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  smartDairy: string;
  tagline: string;
  goodMorning: string;
  goodNoon: string;
  goodAfternoon: string;
  goodEvening: string;
  goodNight: string;
  farmStatus: string;
  totalMilkSupplied: string;
  memberSince: string;
  proudMember: string;
  thankYou: string;
  totalPayouts: string;
  pendingBalance: string;
  totalCleared: string;
  settledTransactions: string;
  noPendingAmount: string;
  allClear: string;
  todaysCollection: string;
  entriesLogged: string;
  lastUpdated: string;
  viewDetails: string;
  milkCollectionLog: string;
  milkCollectionDesc: string;
  payoutsSettlement: string;
  payoutsSettlementDesc: string;
  milkSupplyLedger: string;
  milkSupplyLedgerDesc: string;
  bankProfileDetails: string;
  bankProfileDesc: string;
  whoWeAre: string;
  whoWeAreHeading: string;
  whoWeAreDesc: string;
  recentMilkCollection: string;
  viewAll: string;
  viewLogs: string;
  viewPayouts: string;
  viewLedger: string;
  manageProfile: string;
  login: string;
  welcomeBack: string;
  loginPrompt: string;
  mobileNumber: string;
  password: string;
  forgotPassword: string;
  continueWithGoogle: string;
  loginWithOtp: string;
  dataSafe: string;
  loginAs: string;
  choosePortal: string;
  farmerPortal: string;
  farmerPortalDesc: string;
  employeePortal: string;
  employeePortalDesc: string;
  adminPortal: string;
  adminPortalDesc: string;
  newToRudu: string;
  contactAdmin: string;
  dashboard: string;
  collection: string;
  payouts: string;
  profile: string;
  ledger: string;
  newEntry: string;
  export: string;
  filter: string;
  searchPlaceholder: string;
  morningShift: string;
  eveningShift: string;
  allEntries: string;
  allShifts: string;
  allStatus: string;
  completed: string;
  pending: string;
  inProgress: string;
  cleared: string;
  upcoming: string;
  activeFarmers: string;
  avgRate: string;
  thisMonth: string;
  totalPaid: string;
  pendingAmount: string;
  payoutNotice: string;
  payoutSummary: string;
  nextPayoutDate: string;
  contactSupport: string;
  needHelp: string;
  viewReport: string;
  viewSummary: string;
  totalCollection: string;
  totalAmount: string;
  payoutDetails: string;
  collectionPeriod: string;
  paidOn: string;
  receivedBy: string;
  settlementMethod: string;
  version: string;
  assistYou: string;
  fromYesterday: string;
  totalCollected: string;
  perLiter: string;
  onePayment: string;
  thisMonthPaid: string;
  avgPayout: string;
  bankDetails: string;
  cattleDetails: string;
  language: string;
  dailySummary: string;
  cowMilk: string;
  buffaloMilk: string;
  operatorDashboard: string;
  adminDashboard: string;
  rapidIntakeTerminal: string;
  tankerDispatch: string;
  farmerDirectory: string;
  rateChartConfig: string;
  bulkDisbursement: string;
  qualityLab: string;
  addFarmer: string;
  broadcastAlert: string;
  shiftClosing: string;
}

const baseEn: Translations = {
  appName: 'RUDU FARM',
  smartDairy: 'Smart Dairy Management',
  tagline: 'Empowering Farmers. Enriching Futures.',
  goodMorning: 'Good Morning',
  goodNoon: 'Good Noon',
  goodAfternoon: 'Good Afternoon',
  goodEvening: 'Good Evening',
  goodNight: 'Good Night',
  farmStatus: 'Here is what is happening on your farm today.',
  totalMilkSupplied: 'Total Milk Supplied',
  memberSince: 'Member Since',
  proudMember: 'Proud member',
  thankYou: 'Thank you!',
  totalPayouts: 'Total Payouts',
  pendingBalance: 'Pending Balance',
  totalCleared: 'Total Cleared',
  settledTransactions: '1 Settled Transaction',
  noPendingAmount: 'No pending amount',
  allClear: 'All clear!',
  todaysCollection: 'TODAYS COLLECTION',
  entriesLogged: '5 total entries logged',
  lastUpdated: 'Last updated 10:45 AM',
  viewDetails: 'View Details',
  milkCollectionLog: 'Milk Collection Log',
  milkCollectionDesc: 'View your daily milk collection entries',
  payoutsSettlement: 'Payouts and Settlements',
  payoutsSettlementDesc: 'Track your payments and settlements',
  milkSupplyLedger: 'Milk Supply Ledger',
  milkSupplyLedgerDesc: 'See your complete supply history',
  bankProfileDetails: 'Bank and Profile Details',
  bankProfileDesc: 'Manage your bank and profile info',
  whoWeAre: 'Who We Are',
  whoWeAreHeading: 'Empowering Farmers, Enriching Futures',
  whoWeAreDesc: 'We are your partners in growth. Simplifying dairy management with transparency, technology and trust.',
  recentMilkCollection: 'Recent Milk Collection',
  viewAll: 'View All',
  viewLogs: 'View Logs',
  viewPayouts: 'View Payouts',
  viewLedger: 'View Ledger',
  manageProfile: 'Manage Profile',
  login: 'Login',
  welcomeBack: 'Welcome Back!',
  loginPrompt: 'Login to access your farm dashboard',
  mobileNumber: 'Mobile Number',
  password: 'Password',
  forgotPassword: 'Forgot Password?',
  continueWithGoogle: 'Continue with Google',
  loginWithOtp: 'Login with OTP',
  dataSafe: 'Your data is safe and secure with us',
  loginAs: 'Login as',
  choosePortal: 'Choose your portal to continue',
  farmerPortal: 'Farmer Portal',
  farmerPortalDesc: 'Manage your farm and earnings',
  employeePortal: 'Operator Portal',
  employeePortalDesc: 'Manage collections and operations',
  adminPortal: 'Admin Portal',
  adminPortalDesc: 'Manage farm, users and reports',
  newToRudu: 'New to Rudu Farm?',
  contactAdmin: 'Contact your admin to get started.',
  dashboard: 'Dashboard',
  collection: 'Collection',
  payouts: 'Payouts',
  profile: 'Profile',
  ledger: 'Passbook',
  newEntry: 'New Milk Entry',
  export: 'Export',
  filter: 'Filter',
  searchPlaceholder: 'Search by farmer, receipt ID...',
  morningShift: 'Morning',
  eveningShift: 'Evening',
  allEntries: 'All Entries',
  allShifts: 'All Shifts',
  allStatus: 'All Status',
  completed: 'Completed',
  pending: 'Pending',
  inProgress: 'In Progress',
  cleared: 'Cleared',
  upcoming: 'Upcoming',
  activeFarmers: 'Active Farmers',
  avgRate: 'Avg. Rate',
  thisMonth: 'This Month',
  totalPaid: 'Total Paid',
  pendingAmount: 'Pending Amount',
  payoutNotice: 'Payouts are processed every week.',
  payoutSummary: 'Payout Summary',
  nextPayoutDate: 'Next Payout Date',
  contactSupport: 'Contact Support',
  needHelp: 'Need help with your payout?',
  viewReport: 'View Report',
  viewSummary: 'View Summary',
  totalCollection: 'Total Collection',
  totalAmount: 'Total Amount',
  payoutDetails: 'Payout Details',
  collectionPeriod: 'Milk Collection Period',
  paidOn: 'Paid On',
  receivedBy: 'Received By',
  settlementMethod: 'Cash Settlement',
  version: 'Version 1.0.0',
  assistYou: 'We are here to assist you.',
  fromYesterday: 'from yesterday',
  totalCollected: 'Total collected',
  perLiter: 'Per Liter',
  onePayment: '1 Payment',
  thisMonthPaid: 'This Month Paid',
  avgPayout: 'Avg. Payout',
  bankDetails: 'Bank Account Details',
  cattleDetails: 'Cattle Herd Details',
  language: 'Language / भाषा',
  dailySummary: 'Daily Summary',
  cowMilk: 'Cow Milk',
  buffaloMilk: 'Buffalo Milk',
  operatorDashboard: 'Operator Intake Terminal',
  adminDashboard: 'Admin Control Center',
  rapidIntakeTerminal: 'Rapid Milk Intake Terminal',
  tankerDispatch: 'Tanker Dispatch and Logistics',
  farmerDirectory: 'Farmer Directory and KYC',
  rateChartConfig: 'Rate Chart and Matrix',
  bulkDisbursement: 'Bulk Payout Disbursement',
  qualityLab: 'Milk Quality Testing Lab',
  addFarmer: 'Add New Farmer',
  broadcastAlert: 'Broadcast Announcement',
  shiftClosing: 'Shift Closing and Reconciliation',
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: baseEn,
  hi: {
    ...baseEn,
    goodMorning: 'सुप्रभात',
    goodNoon: 'शुभ दोपहर',
    goodAfternoon: 'शुभ अपराह्न',
    goodEvening: 'शुभ संध्या',
    goodNight: 'शुभ रात्रि',
  },
  gu: {
    ...baseEn,
    goodMorning: 'શુભ સવાર',
    goodNoon: 'શુભ બપોર',
    goodAfternoon: 'શુભ અપરાહ્ન',
    goodEvening: 'શુભ સાંજ',
    goodNight: 'શુભ રાત્રિ',
  },
  pa: {
    ...baseEn,
    goodMorning: 'ਸ਼ੁਭ ਸਵੇਰ',
    goodNoon: 'ਸ਼ੁਭ ਦੁਪਹਿਰ',
    goodAfternoon: 'ਸ਼ੁਭ ਦੁਪਹਿਰ ਬਾਅਦ',
    goodEvening: 'ਸ਼ੁਭ ਸ਼ਾਮ',
    goodNight: 'ਸ਼ੁਭ ਰਾਤ',
  },
  mr: {
    ...baseEn,
    goodMorning: 'शुभ सकाळ',
    goodNoon: 'शुभ दुपार',
    goodAfternoon: 'शुभ अपराह्न',
    goodEvening: 'शुभ संध्याकाळ',
    goodNight: 'शुभ रात्री',
  },
};

/**
 * Centralized Single Source of Truth for Rudu Dairy Business Information
 * Strictly verified data - never fabricate information.
 */

export const BUSINESS = {
  name: 'Rudu Dairy',
  legalName: 'Rudu Dairy',
  brandName: 'Rudu Farm',
  siteUrl: 'https://rududairy.com',
  canonicalUrl: 'https://rududairy.com',
  phone: '+918006270064',
  phoneDisplay: '+91 8006270064',
  email: 'Rududairy@gmail.com',
  address: {
    streetAddress: 'Khasra No-277',
    addressLocality: 'Sikhreda',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
    countryName: 'India',
    formattedAddress: 'Khasra No-277, Sikhreda, India',
  },
  geo: {
    region: 'IN-UP',
    placename: 'Sikhreda',
  },
  description:
    'Rudu Dairy is a smart dairy and milk collection management system based in Sikhreda, India. It provides transparent milk intake testing (FAT/SNF calculation), automated digital receipts, farmer passbooks, collection hub logistics, and direct weekly payouts.',
  services: [
    {
      name: 'Milk Collection & Intake Management',
      description: 'Rapid intake terminal logging milk quantity, FAT percentage, SNF reading, and CLR with automated digital receipt generation.',
    },
    {
      name: 'Dynamic FAT & SNF Rate Matrix',
      description: 'Transparent automated rate calculation based on real-time fat and solid-not-fat quality metrics for cow and buffalo milk.',
    },
    {
      name: 'Farmer Directory & Digital Passbook',
      description: 'Complete digital ledger and KYC tracking for dairy farmers to monitor daily milk supply and historical earnings.',
    },
    {
      name: 'Direct Weekly Payouts & Settlement',
      description: 'Automated weekly payment disbursement tracking directly to farmer bank accounts and UPI IDs with zero hidden fees.',
    },
    {
      name: 'Collection Center (BMC Hub) Logistics',
      description: 'Centralized dairy management for milk chilling centers, tanker dispatches, quality lab approvals, and shift reconciliations.',
    },
  ],
  faqs: [
    {
      question: 'What is Rudu Dairy?',
      answer: 'Rudu Dairy is a smart dairy management platform and milk collection enterprise that empowers dairy farmers and milk collection centers with real-time milk intake logging, FAT/SNF quality testing, instant slip receipts, and automated payment settlements.',
    },
    {
      question: 'Where is Rudu Dairy located?',
      answer: 'Rudu Dairy is located at Khasra No-277, Sikhreda, India.',
    },
    {
      question: 'How can I contact Rudu Dairy?',
      answer: 'You can contact Rudu Dairy by phone at +91 8006270064 or by email at Rududairy@gmail.com.',
    },
    {
      question: 'What services does Rudu Dairy provide?',
      answer: 'Rudu Dairy provides daily milk collection logging, FAT/SNF automated rate calculations, farmer digital passbooks, collection center management, tanker dispatch tracking, milk quality testing, and weekly payout disbursements.',
    },
    {
      question: 'How does Rudu Dairy calculate milk rates?',
      answer: 'Milk rates are calculated automatically through a transparent rate matrix based on exact milk type (Cow or Buffalo), FAT percentage, and SNF (Solids-Not-Fat) readings.',
    },
    {
      question: 'How do farmers receive milk payment settlements?',
      answer: 'Farmers receive weekly payment disbursements directly into their registered bank accounts or UPI IDs with complete ledger transaction records.',
    },
  ],
} as const;

import { BUSINESS } from './business';

/**
 * Reusable Centralized SEO & GEO Configuration
 */
export const SEO_CONFIG = {
  siteName: BUSINESS.name,
  siteUrl: BUSINESS.siteUrl,
  canonicalDomain: BUSINESS.canonicalUrl,
  defaultTitle: `${BUSINESS.name} | Smart Dairy & Milk Management System`,
  titleTemplate: `%s | ${BUSINESS.name}`,
  defaultDescription: `${BUSINESS.name} at ${BUSINESS.address.formattedAddress}. Transparent milk collection, FAT/SNF automated rate matrix, farmer passbook ledger, and weekly bank settlements.`,
  defaultOpenGraphImage: `${BUSINESS.siteUrl}/images/rudu_logo.png`,
  locale: 'en_IN',
  language: 'en-IN',
  themeColor: '#047857',
  social: {
    twitterHandle: '@RuduDairy',
  },
  robots: {
    indexable: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    private: 'noindex, nofollow, noarchive',
  },
} as const;

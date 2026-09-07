import { BUSINESS } from '../config/business';
import { getCanonicalUrl } from './url';

/**
 * Organization Schema
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BUSINESS.canonicalUrl}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.canonicalUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${BUSINESS.canonicalUrl}/images/rudu_logo.png`,
      caption: 'Rudu Dairy Logo',
    },
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressCountry: BUSINESS.address.addressCountry,
    },
    description: BUSINESS.description,
  };
}

/**
 * LocalBusiness / Dairy Farm Schema
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS.canonicalUrl}/#localbusiness`,
    name: BUSINESS.name,
    image: `${BUSINESS.canonicalUrl}/images/rudu_logo.png`,
    url: BUSINESS.canonicalUrl,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressCountry: BUSINESS.address.addressCountry,
    },
    description: BUSINESS.description,
  };
}

/**
 * WebSite Schema
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS.canonicalUrl}/#website`,
    url: BUSINESS.canonicalUrl,
    name: BUSINESS.name,
    inLanguage: 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.name,
      url: BUSINESS.canonicalUrl,
    },
  };
}

/**
 * WebPage Schema
 */
export function getWebPageSchema(title: string, description: string, path: string = '') {
  const pageUrl = getCanonicalUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description: description,
    isPartOf: {
      '@id': `${BUSINESS.canonicalUrl}/#website`,
    },
    inLanguage: 'en-IN',
    breadcrumb: {
      '@id': `${pageUrl}#breadcrumb`,
    },
  };
}

/**
 * SoftwareApplication Schema (Dairy Management Platform)
 */
export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${BUSINESS.name} ERP & Milk Collection Platform`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All (Web, Mobile, Tablet)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: 'Cloud dairy ERP and milk collection terminal for rapid intake, FAT/SNF automated testing, digital receipts, and farmer passbooks.',
  };
}

/**
 * FAQPage Schema
 */
export function getFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BUSINESS.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

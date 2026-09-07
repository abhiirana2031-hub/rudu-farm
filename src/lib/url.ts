import { BUSINESS } from '../config/business';

/**
 * URL helper to guarantee consistent canonical absolute URLs
 * Never leaks localhost, staging, or preview domains into production SEO metadata
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
      return window.location.origin;
    }
  }
  return BUSINESS.siteUrl;
}

export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') {
    return BUSINESS.canonicalUrl;
  }
  return `${BUSINESS.canonicalUrl}${cleanPath}`;
}

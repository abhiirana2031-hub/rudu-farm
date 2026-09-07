import React, { useEffect } from 'react';
import { SEO_CONFIG } from '../../config/seo';
import { getCanonicalUrl } from '../../lib/url';

interface MetaTagsProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  isPrivate?: boolean;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = SEO_CONFIG.defaultTitle,
  description = SEO_CONFIG.defaultDescription,
  path = '/',
  image = SEO_CONFIG.defaultOpenGraphImage,
  isPrivate = false,
}) => {
  const canonicalUrl = getCanonicalUrl(path);

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to update or create meta tags
    const setMeta = (name: string, content: string, isProperty: boolean = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Metadata
    setMeta('description', description);
    setMeta('robots', isPrivate ? SEO_CONFIG.robots.private : SEO_CONFIG.robots.indexable);
    setMeta('theme-color', SEO_CONFIG.themeColor);

    // 3. Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', image, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', SEO_CONFIG.siteName, true);
    setMeta('og:locale', SEO_CONFIG.locale, true);

    // 4. Twitter Cards
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
  }, [title, description, canonicalUrl, image, isPrivate]);

  return null;
};

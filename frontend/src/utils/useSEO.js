import { useEffect } from 'react';

const DEFAULT_IMAGE = 'https://www.kalkulatortik.com/og.png';
const DOMAIN = 'www.kalkulatortik.com';
const BASE_URL = 'https://www.kalkulatortik.com';

const setMetaTag = (attr, key, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const setCanonical = (url) => {
  if (!url) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

/**
 * Custom hook to update document title, canonical link, Open Graph and Twitter meta tags.
 * Ensures all canonical URLs and social tags use https://www.kalkulatortik.com.
 */
export const useSEO = ({
  title,
  description,
  canonicalPath = '',
  image = DEFAULT_IMAGE,
  type = 'website',
}) => {
  useEffect(() => {
    // Format full canonical URL ensuring www.kalkulatortik.com
    const cleanPath = canonicalPath ? (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`) : '';
    const fullUrl = cleanPath === '' || cleanPath === '/' ? `${BASE_URL}/` : `${BASE_URL}${cleanPath}`;

    if (title) {
      document.title = title;
    }

    if (description) {
      setMetaTag('name', 'description', description);
    }

    setCanonical(fullUrl);

    // Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:type', type);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:domain', DOMAIN);
    setMetaTag('name', 'twitter:url', fullUrl);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
  }, [title, description, canonicalPath, image, type]);
};

export default useSEO;


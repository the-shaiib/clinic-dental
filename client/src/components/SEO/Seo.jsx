import { clinicInfo } from '../../config/clinicInfo';
import { useEffect } from 'react';

const getSiteUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return import.meta.env.VITE_SITE_URL || '';
};

const ensureMeta = (name, content, isProperty = false) => {
  if (typeof document === 'undefined') return;
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    if (isProperty) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const ensureLink = (rel, href) => {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const ensureJsonLd = (data) => {
  if (typeof document === 'undefined') return;
  const id = 'clinic-jsonld';
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

function Seo() {
  const siteUrl = getSiteUrl();
  const title = `${clinicInfo.doctorName} | Dentiste Marrakech`;
  const description =
    "Cabinet dentaire a Marrakech. Rendez-vous rapides, soins modernes, et suivi rassurant pour un sourire sain.";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: clinicInfo.doctorName,
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinicInfo.address,
      addressLocality: 'Marrakech',
      addressRegion: 'Marrakesh-Safi',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.6295,
      longitude: -7.9811,
    },
    openingHours: clinicInfo.hours,
    telephone: [clinicInfo.phonePrimary, clinicInfo.phoneSecondary].filter(Boolean),
    url: siteUrl || undefined,
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title;
    ensureMeta('description', description);
    ensureMeta('robots', 'index, follow');
    ensureMeta('og:title', title, true);
    ensureMeta('og:description', description, true);
    ensureMeta('og:type', 'website', true);
    if (siteUrl) {
      ensureMeta('og:url', siteUrl, true);
      ensureLink('canonical', siteUrl);
    }
    ensureJsonLd(jsonLd);
  }, [title, description, siteUrl]);

  return null;
}

export default Seo;

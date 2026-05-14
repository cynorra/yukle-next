'use client';

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  jsonLd?: object;
  isExactTitle?: boolean;
}

/**
 * NOT: Next.js App Router'da SEO için `generateMetadata` veya statik `metadata`
 * export kullanılır (sayfa dosyasında). Bu hook geriye dönük uyumluluk için
 * client-side fallback olarak duruyor — server-rendered metadata her zaman
 * önceliklidir ve gerçek SEO değeri odur.
 *
 * Mevcut çağrılar bozulmasın diye işlevsel tutulmuş ama yeni kodda
 * sayfanın `page.tsx` veya `layout.tsx`'inde `export const metadata` ya da
 * `generateMetadata` kullanmayı tercih edin.
 */
export function useSEO(props: SEOProps = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const BASE_TITLE = 'YükLe';
    const DEFAULT_DESC = 'Türkiye\'nin nakliye ilan platformu. Yükünüzü taşıtın, yük bulun.';

    let fullTitle = props.title;
    if (props.title && !props.isExactTitle) fullTitle = `${props.title} | ${BASE_TITLE}`;
    else if (!props.title) fullTitle = BASE_TITLE;
    document.title = fullTitle || BASE_TITLE;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', props.description || DEFAULT_DESC);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    const canonicalHref =
      props.canonical ||
      (props.canonicalPath ? `https://loadlyapp.com${props.canonicalPath}` : window.location.href);
    linkCanonical.setAttribute('href', canonicalHref);
  }, [props.title, props.description, props.keywords, props.canonical, props.canonicalPath, props.ogImage, props.ogType, props.jsonLd, props.isExactTitle]);
}

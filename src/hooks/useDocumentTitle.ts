'use client';

import { useEffect } from 'react';

const BASE_TITLE = 'YükLe';

/**
 * Next.js'te metadata `generateMetadata` ile server tarafında üretilir.
 * Bu hook geriye dönük uyumluluk için tutuluyor; sadece client-side
 * title güncellemesi yapar. SEO için bu yeterli değil.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
}

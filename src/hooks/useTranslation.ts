'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { TRANSLATIONS, RTL_LOCALES } from '@/utils/translations';
import type { Locale, TranslationDict } from '@/utils/translations';

export function useTranslation() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read locale from URL parameters
  const rawLocale = params?.locale as string;
  
  // Validate and resolve locale
  const locale: Locale = (rawLocale && rawLocale in TRANSLATIONS)
    ? (rawLocale as Locale)
    : 'en';

  const t: TranslationDict = TRANSLATIONS[locale];
  const isRtl = RTL_LOCALES.includes(locale);

  // Helper to switch language in route
  const changeLocale = (newLocale: Locale) => {
    if (!pathname) return;
    
    // Split paths: e.g. "/tr/marketplace" -> ["", "tr", "marketplace"]
    const pathSegments = pathname.split('/');
    
    if (pathSegments.length > 1 && pathSegments[1] in TRANSLATIONS) {
      // Replace existing locale segment
      pathSegments[1] = newLocale;
    } else {
      // Prepend locale segment
      pathSegments.splice(1, 0, newLocale);
    }
    
    const newPath = pathSegments.join('/') || '/';
    router.push(newPath);
  };

  return {
    t,
    locale,
    isRtl,
    changeLocale,
  };
}

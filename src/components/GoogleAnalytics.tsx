'use client';

import { Suspense, useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.('event', 'page_view', {
      page_path: searchParams.size ? `${pathname}?${searchParams}` : pathname,
    });
  }, [pathname, searchParams]);

  return null;
}

// Loads GA4 on top of the Consent Mode v2 signals already set up in the root
// layout's inline script — analytics_storage starts denied until the cookie
// banner is accepted, same as the AdSense ad-storage signals.
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.gtag && window.gtag('js', new Date());
          window.gtag && window.gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  );
}

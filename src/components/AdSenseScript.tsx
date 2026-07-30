'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { COOKIE_CONSENT_EVENT, getStoredCookieConsent } from './CookieConsent';

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';

export default function AdSenseScript() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(getStoredCookieConsent() === 'accepted');

    function onConsent(e: Event) {
      const accepted = (e as CustomEvent<{ accepted: boolean }>).detail?.accepted;
      setAllowed(!!accepted);
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  if (!ADSENSE_CLIENT || !allowed) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

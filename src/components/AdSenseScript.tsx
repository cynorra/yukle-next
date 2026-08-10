'use client';

import Script from 'next/script';

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4674211063760769';

export default function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

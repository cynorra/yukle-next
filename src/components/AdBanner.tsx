'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

// AdSense client ID - .env'den al (Next.js)
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';

export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    // AdSense henüz aktif değilse placeholder göster
    if (!ADSENSE_CLIENT || !slot) return;
    if (loaded.current) return;
    loaded.current = true;
    try {
      // @ts-expect-error - adsbygoogle is added by AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense push error:', err);
    }
  }, [slot]);

  // AdSense aktif değilken placeholder
  if (!ADSENSE_CLIENT || !slot) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-xs text-gray-600 ${className}`}
        style={{ minHeight: format === 'rectangle' ? 250 : 90 }}
      >
        {/* Reklam alanı — AdSense onayı bekleniyor */}
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

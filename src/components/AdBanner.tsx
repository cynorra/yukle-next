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

  // Slot henüz yapılandırılmamışsa boşluk/çerçeve gösterme (AdSense onayı için temiz görünüm)
  if (!ADSENSE_CLIENT || !slot) {
    return null;
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

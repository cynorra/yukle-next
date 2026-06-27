'use client';

import { useT } from '@/hooks/useT';
import { Info, Truck, Shield, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Locale } from '@/utils/translations';

export function AboutPageClient() {
  const t = useT();
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    import(`@/utils/legal-translations/${locale}.json`)
      .then(mod => setData(mod.default || mod))
      .catch(() => import('@/utils/legal-translations/en.json').then(mod => setData(mod.default || mod)));
  }, [locale]);

  if (!data) return <div className={t.pageFull}><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5A623]"></div></div></div>;
  
  const content = data.about;

  return (
    <div className={t.pageFull}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold ${t.heading} flex items-center justify-center gap-4 mb-4`}>
            <Info size={40} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            {content.description}
          </p>
        </div>

        {/* Content Blocks */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Truck size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{content.fastEasyTitle}</h3>
            <p className={`text-sm ${t.muted}`}>
              {content.fastEasyDesc}
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Shield size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{content.reliableTitle}</h3>
            <p className={`text-sm ${t.muted}`}>
              {content.reliableDesc}
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Globe size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{content.wideTitle}</h3>
            <p className={`text-sm ${t.muted}`}>
              {content.wideDesc}
            </p>
          </div>
        </div>
        
        {/* Story */}
        <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark backdrop-blur-xl mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>{content.visionTitle}</h2>
          <div className="space-y-4">
            <p className={`text-base ${t.muted} leading-relaxed`}>
              {content.visionP1}
            </p>
            <p className={`text-base ${t.muted} leading-relaxed`}>
              {content.visionP2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useT } from '@/hooks/useT';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Locale } from '@/utils/translations';

export function ContactPageClient() {
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
  
  const content = data.contact;

  return (
    <div className={t.pageFull}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold ${t.heading} flex items-center justify-center gap-4 mb-4`}>
            <MessageSquare size={40} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>{content.getInTouch}</h2>
            
            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Mail size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>{content.emailTitle}</h3>
                <p className={`text-sm ${t.muted} mb-2`}>{content.emailDesc}</p>
                <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline font-medium">info@loadlyapp.com</a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Phone size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>{content.phoneTitle}</h3>
                <p className={`text-sm ${t.muted} mb-2`}>{content.phoneDesc}</p>
                <span className="text-muted font-medium">{content.phoneNotAvailable}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <MapPin size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>{content.addressTitle}</h3>
                <p className={`text-sm ${t.muted}`}>
                  {content.addressDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Form placeholder or general info */}
          <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col justify-center">
            <h2 className={`text-2xl font-bold ${t.heading} mb-4`}>{content.quickSupport}</h2>
            <p className={`text-base ${t.muted} leading-relaxed mb-6`}>
              {content.quickSupportDesc}
            </p>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-sm text-orange-400 font-medium">
                {content.advCollab} <br className="md:hidden" />
                <a href="mailto:reklam@loadlyapp.com" className="hover:underline ml-1 text-[#F5A623]">reklam@loadlyapp.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

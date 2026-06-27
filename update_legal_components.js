const fs = require('fs');

const aboutContent = `'use client';

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
    import(\`@/utils/legal-translations/\${locale}.json\`)
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
          <h1 className={\`text-4xl font-bold \${t.heading} flex items-center justify-center gap-4 mb-4\`}>
            <Info size={40} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={\`text-lg \${t.muted} max-w-2xl mx-auto leading-relaxed\`}>
            {content.description}
          </p>
        </div>

        {/* Content Blocks */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Truck size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={\`text-xl font-bold \${t.heading} mb-2\`}>{content.fastEasyTitle}</h3>
            <p className={\`text-sm \${t.muted}\`}>
              {content.fastEasyDesc}
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Shield size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={\`text-xl font-bold \${t.heading} mb-2\`}>{content.reliableTitle}</h3>
            <p className={\`text-sm \${t.muted}\`}>
              {content.reliableDesc}
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Globe size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={\`text-xl font-bold \${t.heading} mb-2\`}>{content.wideTitle}</h3>
            <p className={\`text-sm \${t.muted}\`}>
              {content.wideDesc}
            </p>
          </div>
        </div>
        
        {/* Story */}
        <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark backdrop-blur-xl mb-12">
          <h2 className={\`text-2xl font-bold \${t.heading} mb-6\`}>{content.visionTitle}</h2>
          <div className="space-y-4">
            <p className={\`text-base \${t.muted} leading-relaxed\`}>
              {content.visionP1}
            </p>
            <p className={\`text-base \${t.muted} leading-relaxed\`}>
              {content.visionP2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

const contactContent = `'use client';

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
    import(\`@/utils/legal-translations/\${locale}.json\`)
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
          <h1 className={\`text-4xl font-bold \${t.heading} flex items-center justify-center gap-4 mb-4\`}>
            <MessageSquare size={40} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={\`text-lg \${t.muted} max-w-2xl mx-auto leading-relaxed\`}>
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className={\`text-2xl font-bold \${t.heading} mb-6\`}>{content.getInTouch}</h2>
            
            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Mail size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={\`text-lg font-bold \${t.heading} mb-1\`}>{content.emailTitle}</h3>
                <p className={\`text-sm \${t.muted} mb-2\`}>{content.emailDesc}</p>
                <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline font-medium">info@loadlyapp.com</a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Phone size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={\`text-lg font-bold \${t.heading} mb-1\`}>{content.phoneTitle}</h3>
                <p className={\`text-sm \${t.muted} mb-2\`}>{content.phoneDesc}</p>
                <span className="text-muted font-medium">{content.phoneNotAvailable}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <MapPin size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={\`text-lg font-bold \${t.heading} mb-1\`}>{content.addressTitle}</h3>
                <p className={\`text-sm \${t.muted}\`}>
                  {content.addressDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Form placeholder or general info */}
          <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col justify-center">
            <h2 className={\`text-2xl font-bold \${t.heading} mb-4\`}>{content.quickSupport}</h2>
            <p className={\`text-base \${t.muted} leading-relaxed mb-6\`}>
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
`;

const privacyContent = `'use client';

import { useT } from '@/hooks/useT';
import { Lock, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Locale } from '@/utils/translations';

export function PrivacyPageClient() {
  const t = useT();
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    import(\`@/utils/legal-translations/\${locale}.json\`)
      .then(mod => setData(mod.default || mod))
      .catch(() => import('@/utils/legal-translations/en.json').then(mod => setData(mod.default || mod)));
  }, [locale]);

  if (!data) return <div className={t.pageFull}><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5A623]"></div></div></div>;

  const content = data.privacy;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={\`text-2xl font-bold \${t.heading} flex items-center gap-3\`}>
            <Lock size={28} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={\`text-sm \${t.muted} mt-1\`}>
            {content.description}
          </p>
        </div>

        {/* Red disclaimer box */}
        <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-relaxed">
              {content.disclaimer}
            </p>
          </div>
        </div>

        {/* Section 1: Genel Bakış */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.overviewTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.overviewDesc}
          </p>
        </div>

        {/* Section 2: Toplanan Veriler */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.dataTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.dataDesc}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{content.dataL1}</li>
            <li>{content.dataL2}</li>
            <li>{content.dataL3}</li>
            <li>{content.dataL4}</li>
            <li>{content.dataL5}</li>
          </ul>
          <p className={\`text-sm \${t.muted} mt-3 italic\`}>
            {content.dataNote}
          </p>
        </div>

        {/* Section 3: Verilerin Kullanımı */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.useTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.useDesc}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{content.useL1}</li>
            <li>{content.useL2}</li>
            <li>{content.useL3}</li>
            <li>{content.useL4}</li>
            <li>{content.useL5}</li>
            <li>{content.useL6}</li>
            <li>{content.useL7}</li>
          </ul>
          <p className={\`text-sm \${t.muted} mt-3 italic\`}>
            {content.useNote}
          </p>
        </div>

        {/* Section 4: Çerezler */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.cookiesTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.cookiesDesc}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{content.cookiesL1}</li>
            <li>{content.cookiesL2}</li>
            <li>{content.cookiesL3}</li>
          </ul>
          <p className={\`text-sm \${t.sub} leading-relaxed mt-3\`}>
            {content.cookiesNote}
          </p>
        </div>

        {/* Section 5: Üçüncü Taraflar */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.thirdPartiesTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.thirdPartiesDesc}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{content.thirdPartiesL1}</li>
            <li>{content.thirdPartiesL2}</li>
            <li>{content.thirdPartiesL3}</li>
          </ul>
          <p className={\`text-sm \${t.muted} mt-3 italic\`}>
            {content.thirdPartiesNote}
          </p>
        </div>

        {/* Section 6: Veri Güvenliği */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.securityTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.securityDesc}
          </p>
        </div>

        {/* Section 7: Kullanıcı Hakları */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.rightsTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.rightsDesc}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{content.rightsL1}</li>
            <li>{content.rightsL2}</li>
            <li>{content.rightsL3}</li>
            <li>{content.rightsL4}</li>
            <li>{content.rightsL5}</li>
            <li>{content.rightsL6}</li>
          </ul>
          <p className={\`text-sm \${t.sub} leading-relaxed mt-3\`}>
            {content.rightsNote}
          </p>
        </div>

        {/* Section 8: Politika Değişiklikleri */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.changesTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.changesDesc}
          </p>
        </div>

        {/* Section 9: İletişim */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.contactTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.contactDesc}
          </p>
          <ul className={\`list-none space-y-2 text-sm \${t.sub} mt-3\`}>
            <li>Email: <a href="mailto:kvkk@loadlyapp.com" className="text-[#F5A623] hover:underline">kvkk@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
`;

const termsContent = `'use client';

import { useT } from '@/hooks/useT';
import { FileText, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Locale } from '@/utils/translations';

export function TermsPageClient() {
  const t = useT();
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    import(\`@/utils/legal-translations/\${locale}.json\`)
      .then(mod => setData(mod.default || mod))
      .catch(() => import('@/utils/legal-translations/en.json').then(mod => setData(mod.default || mod)));
  }, [locale]);

  if (!data) return <div className={t.pageFull}><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5A623]"></div></div></div>;

  const content = data.terms;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={\`text-2xl font-bold \${t.heading} flex items-center gap-3\`}>
            <FileText size={28} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={\`text-sm \${t.muted} mt-1\`}>
            {content.description}
          </p>
        </div>

        {/* Red disclaimer box */}
        <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-relaxed">
              {content.disclaimer}
            </p>
          </div>
        </div>

        {/* Section 1: Kabul Şartları */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.acceptTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.acceptDesc}
          </p>
        </div>

        {/* Section 2: Hizmet Tanımı */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.serviceTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.serviceDesc}
          </p>
        </div>

        {/* Section 3: Kullanıcı Hesabı */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.accountTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.accountDesc}
          </p>
        </div>

        {/* Section 4: Kullanım Kuralları */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.rulesTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.rulesDesc}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{content.rulesL1}</li>
            <li>{content.rulesL2}</li>
            <li>{content.rulesL3}</li>
            <li>{content.rulesL4}</li>
            <li>{content.rulesL5}</li>
            <li>{content.rulesL6}</li>
            <li>{content.rulesL7}</li>
          </ul>
        </div>

        {/* Section 5: Sorumluluk Reddi */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.liabilityTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.liabilityDesc}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{content.liabilityL1}</li>
            <li>{content.liabilityL2}</li>
            <li>{content.liabilityL3}</li>
            <li>{content.liabilityL4}</li>
            <li>{content.liabilityL5}</li>
            <li>{content.liabilityL6}</li>
            <li>{content.liabilityL7}</li>
            <li>{content.liabilityL8}</li>
            <li>{content.liabilityL9}</li>
          </ul>
        </div>

        {/* Section 6: İlan ve Mesajlaşma */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.adsTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed mb-3\`}>
            {content.adsDesc}
          </p>
          <ul className={\`list-disc list-inside space-y-2 text-sm \${t.sub}\`}>
            <li>{content.adsL1}</li>
            <li>{content.adsL2}</li>
            <li>{content.adsL3}</li>
            <li>{content.adsL4}</li>
            <li>{content.adsL5}</li>
            <li>{content.adsL6}</li>
          </ul>
        </div>

        {/* Section 7: Fikri Mülkiyet */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.ipTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.ipDesc}
          </p>
        </div>

        {/* Section 8: Hesap Feshi */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.terminationTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.terminationDesc}
          </p>
        </div>

        {/* Section 9: Uyuşmazlık Çözümü */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.disputeTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.disputeDesc}
          </p>
        </div>

        {/* Section 10: İletişim */}
        <div className={\`p-6 rounded-2xl \${t.card} mb-4\`}>
          <h2 className={\`text-lg font-bold \${t.heading} mb-3\`}>{content.contactTitle}</h2>
          <p className={\`text-sm \${t.sub} leading-relaxed\`}>
            {content.contactDesc}
          </p>
          <ul className={\`list-none space-y-2 text-sm \${t.sub} mt-3\`}>
            <li>Email: <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline">info@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('d:/android-projeler/yukle-next/src/app/[locale]/about/AboutPageClient.tsx', aboutContent);
fs.writeFileSync('d:/android-projeler/yukle-next/src/app/[locale]/contact/ContactPageClient.tsx', contactContent);
fs.writeFileSync('d:/android-projeler/yukle-next/src/app/[locale]/privacy/PrivacyPageClient.tsx', privacyContent);
fs.writeFileSync('d:/android-projeler/yukle-next/src/app/[locale]/terms/TermsPageClient.tsx', termsContent);
console.log('Successfully updated component files to use dynamically imported translation data.');

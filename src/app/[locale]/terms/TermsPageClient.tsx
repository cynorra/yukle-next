'use client';

import { useT } from '@/hooks/useT';
import { FileText, AlertTriangle } from 'lucide-react';

interface TermsData {
  terms: Record<string, string>;
}

interface Props {
  data: TermsData;
}

export function TermsPageClient({ data }: Props) {
  const t = useT();
  const content = data.terms;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <FileText size={28} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>
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
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.acceptTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.acceptDesc}
          </p>
        </div>

        {/* Section 2: Hizmet Tanımı */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.serviceTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.serviceDesc}
          </p>
        </div>

        {/* Section 3: Kullanıcı Hesabı */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.accountTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.accountDesc}
          </p>
        </div>

        {/* Section 4: Kullanım Kuralları */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.rulesTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.rulesDesc}
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
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
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.liabilityTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.liabilityDesc}
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
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
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.adsTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.adsDesc}
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{content.adsL1}</li>
            <li>{content.adsL2}</li>
            <li>{content.adsL3}</li>
            <li>{content.adsL4}</li>
            <li>{content.adsL5}</li>
            <li>{content.adsL6}</li>
          </ul>
        </div>

        {/* Section 7: Fikri Mülkiyet */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.ipTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.ipDesc}
          </p>
        </div>

        {/* Section 8: Hesap Feshi */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.terminationTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.terminationDesc}
          </p>
        </div>

        {/* Section 9: Uyuşmazlık Çözümü */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.disputeTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.disputeDesc}
          </p>
        </div>

        {/* Section 10: İletişim */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.contactTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.contactDesc}
          </p>
          <ul className={`list-none space-y-2 text-sm ${t.sub} mt-3`}>
            <li>Email: <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline">info@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

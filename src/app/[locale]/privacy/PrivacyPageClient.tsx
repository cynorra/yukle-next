'use client';

import { useT } from '@/hooks/useT';
import { Lock, AlertTriangle } from 'lucide-react';

interface PrivacyData {
  privacy: Record<string, string>;
}

interface Props {
  data: PrivacyData;
}

export function PrivacyPageClient({ data }: Props) {
  const t = useT();
  const content = data.privacy;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Lock size={28} className="text-[#F5A623]" />
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

        {/* Section 1: Genel Bakış */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.overviewTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.overviewDesc}
          </p>
        </div>

        {/* Section 2: Toplanan Veriler */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.dataTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.dataDesc}
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{content.dataL1}</li>
            <li>{content.dataL2}</li>
            <li>{content.dataL3}</li>
            <li>{content.dataL4}</li>
            <li>{content.dataL5}</li>
          </ul>
          <p className={`text-sm ${t.muted} mt-3 italic`}>
            {content.dataNote}
          </p>
        </div>

        {/* Section 3: Verilerin Kullanımı */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.useTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.useDesc}
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{content.useL1}</li>
            <li>{content.useL2}</li>
            <li>{content.useL3}</li>
            <li>{content.useL4}</li>
            <li>{content.useL5}</li>
            <li>{content.useL6}</li>
            <li>{content.useL7}</li>
          </ul>
          <p className={`text-sm ${t.muted} mt-3 italic`}>
            {content.useNote}
          </p>
        </div>

        {/* Section 4: Çerezler */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.cookiesTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.cookiesDesc}
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{content.cookiesL1}</li>
            <li>{content.cookiesL2}</li>
            <li>{content.cookiesL3}</li>
          </ul>
          <p className={`text-sm ${t.sub} leading-relaxed mt-3`}>
            {content.cookiesNote}
          </p>
        </div>

        {/* Section 5: Üçüncü Taraflar */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.thirdPartiesTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.thirdPartiesDesc}
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{content.thirdPartiesL1}</li>
            <li>{content.thirdPartiesL2}</li>
            <li>{content.thirdPartiesL3}</li>
          </ul>
          <p className={`text-sm ${t.muted} mt-3 italic`}>
            {content.thirdPartiesNote}
          </p>
        </div>

        {/* Section 6: Veri Güvenliği */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.securityTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.securityDesc}
          </p>
        </div>

        {/* Section 7: Kullanıcı Hakları */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.rightsTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.rightsDesc}
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{content.rightsL1}</li>
            <li>{content.rightsL2}</li>
            <li>{content.rightsL3}</li>
            <li>{content.rightsL4}</li>
            <li>{content.rightsL5}</li>
            <li>{content.rightsL6}</li>
          </ul>
          <p className={`text-sm ${t.sub} leading-relaxed mt-3`}>
            {content.rightsNote}
          </p>
        </div>

        {/* Section 8: Politika Değişiklikleri */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.changesTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.changesDesc}
          </p>
        </div>

        {/* Section 9: İletişim */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.contactTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.contactDesc}
          </p>
          <ul className={`list-none space-y-2 text-sm ${t.sub} mt-3`}>
            <li>Email: <a href="mailto:kvkk@loadlyapp.com" className="text-[#F5A623] hover:underline">kvkk@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

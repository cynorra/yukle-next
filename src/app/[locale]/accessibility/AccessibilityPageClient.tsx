'use client';

import { useT } from '@/hooks/useT';
import { useParams } from 'next/navigation';
import { Accessibility } from 'lucide-react';

interface Copy {
  title: string;
  description: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Body: string; s2L1: string; s2L2: string; s2L3: string; s2L4: string;
  s3Title: string; s3Body: string;
  contactTitle: string; contactBody: string;
}

const COPY: Record<string, Copy> = {
  en: {
    title: 'Accessibility Statement',
    description: 'Our approach to making Loadly usable for everyone.',
    s1Title: 'Our target',
    s1Body: 'Loadly aims to meet WCAG 2.1 Level AA wherever practical. This is a statement of intent and ongoing effort, not a claim of full, certified compliance — we have not commissioned a formal third-party accessibility audit.',
    s2Title: 'What we have done',
    s2Body: "Concrete accessibility work completed on the site so far:",
    s2L1: 'Fixed missing accessible names on interactive elements and duplicate H1 headings on public pages.',
    s2L2: "Adjusted the site's brand accent color to meet the 4.5:1 text-contrast ratio required by WCAG AA.",
    s2L3: 'Every page declares its language via <html lang>, and core navigation is reachable by keyboard.',
    s2L4: 'Meaningful images carry alt text; purely decorative images are marked so screen readers skip them.',
    s3Title: 'Known limitations',
    s3Body: "Blog content is AI-translated into 50+ languages and has not had a per-language accessibility review. Some interactive marketplace components have not been individually audited for keyboard/screen-reader edge cases. We have not deployed an automated \"accessibility overlay\" widget — these are known to be unreliable, so gaps are fixed in code instead.",
    contactTitle: 'Reporting an issue',
    contactBody: 'If you run into an accessibility barrier anywhere on Loadly, please tell us what page and what happened — we will fix it:',
  },
  tr: {
    title: 'Erişilebilirlik Beyanı',
    description: "Loadly'yi herkes için kullanılabilir kılma yaklaşımımız.",
    s1Title: 'Hedefimiz',
    s1Body: "Loadly, mümkün olan her yerde WCAG 2.1 Seviye AA standardını karşılamayı hedefler. Bu, tam ve sertifikalı bir uyum iddiası değil, bir niyet ve süregelen çaba beyanıdır — resmi bir üçüncü taraf erişilebilirlik denetimi yaptırmadık.",
    s2Title: 'Şimdiye kadar yaptıklarımız',
    s2Body: "Sitede tamamlanan somut erişilebilirlik çalışmaları:",
    s2L1: 'Etkileşimli öğelerdeki eksik erişilebilir isimler ve genel sayfalardaki tekrarlanan H1 başlıkları düzeltildi.',
    s2L2: "Sitenin marka vurgu rengi, WCAG AA'nın gerektirdiği 4.5:1 metin-kontrast oranını karşılayacak şekilde ayarlandı.",
    s2L3: 'Her sayfa dilini <html lang> ile bildirir ve temel navigasyona klavye ile ulaşılabilir.',
    s2L4: 'Anlamlı görseller alt metin taşır; tamamen dekoratif görseller, ekran okuyucuların atlaması için işaretlenmiştir.',
    s3Title: 'Bilinen kısıtlamalar',
    s3Body: "Blog içeriği 50'den fazla dile yapay zeka ile çevrilmektedir ve dil bazında bir erişilebilirlik incelemesinden geçmemiştir. Bazı etkileşimli pazar yeri bileşenleri klavye/ekran okuyucu uç durumları için ayrı ayrı denetlenmemiştir. Otomatik bir \"erişilebilirlik overlay\" widget'ı kullanmıyoruz — bunların güvenilmez olduğu biliniyor, bu yüzden eksiklikler doğrudan kod seviyesinde düzeltiliyor.",
    contactTitle: 'Sorun bildirme',
    contactBody: "Loadly'de herhangi bir yerde bir erişilebilirlik engeliyle karşılaşırsanız, lütfen hangi sayfada ne olduğunu bize bildirin — düzeltelim:",
  },
};

export function AccessibilityPageClient({ locale }: { locale: string }) {
  const t = useT();
  const params = useParams();
  const activeLocale = (typeof params?.locale === 'string' ? params.locale : locale) || 'en';
  const c = COPY[activeLocale] || COPY.en;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Accessibility size={28} className="text-[#A66700]" />
            {c.title}
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>{c.description}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s1Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>{c.s1Body}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s2Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>{c.s2Body}</p>
          <ul className={`list-disc list-inside space-y-2 text-sm ${t.sub}`}>
            <li>{c.s2L1}</li>
            <li>{c.s2L2}</li>
            <li>{c.s2L3}</li>
            <li>{c.s2L4}</li>
          </ul>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s3Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>{c.s3Body}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.contactTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {c.contactBody}{' '}
            <a href="mailto:info@loadlyapp.com" className="text-[#A66700] hover:underline">info@loadlyapp.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

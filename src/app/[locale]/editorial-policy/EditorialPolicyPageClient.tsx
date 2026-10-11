'use client';

import { useT } from '@/hooks/useT';
import { useParams } from 'next/navigation';
import { FileText } from 'lucide-react';

interface Copy {
  title: string;
  description: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Body: string; s2L1: string; s2L2: string; s2L3: string; s2L4: string;
  s3Title: string; s3Body: string;
  s4Title: string; s4Body: string;
  s5Title: string; s5Body: string;
  contactTitle: string; contactBody: string;
}

const COPY: Record<string, Copy> = {
  en: {
    title: 'Editorial Policy',
    description: "How Loadly chooses sources, states what an article covers, and handles corrections.",
    s1Title: "Who edits Loadly",
    s1Body: "Loadly is edited and published by one person, Eren Şimşir, who is also the site's founder, a software developer with a computer and industrial engineering background and a PhD candidate in computer science. Articles are published under a named editor, not an anonymous \"content team.\" Loadly is an independent publication: it does not do hands-on product testing and does not claim first-hand industry experience in its articles.",
    s2Title: "How articles are sourced",
    s2Body: "Each article follows these rules:",
    s2L1: "Regulatory statements are taken from the primary source, such as the text of the regulation or the issuing agency's own guidance, and the article lists those sources at the end.",
    s2L2: "A figure is stated only if a source gives it. Where no source does, the article says so or gives no figure, instead of inventing a precise number.",
    s2L3: "Worked examples are labelled as hypothetical, and any calculation can be reproduced from the formula or rule shown.",
    s2L4: "Articles say what they do not cover and, for regulatory topics, the date the regulation text was checked.",
    s3Title: 'What we do not do',
    s3Body: "We do not present general industry context as original research, claim hands-on testing that never happened, publish fake testimonials, or give legal, tax or compliance advice. Regulations change, so readers should confirm the current text before acting.",
    s4Title: 'Corrections',
    s4Body: "If you spot a factual error, an outdated figure, or a broken source reference in any article, we want to know and will correct it.",
    s5Title: "Publishing",
    s5Body: "Articles are published when they have been researched against their sources, not on a fixed schedule, and may be revised when a regulation changes.",
    contactTitle: 'Contact',
    contactBody: 'For corrections, questions, or feedback about any article:',
  },
  tr: {
    title: 'Editoryal Politika',
    description: "Loadly kaynakları nasıl seçer, bir makalenin kapsamını nasıl belirtir ve düzeltmeleri nasıl ele alır.",
    s1Title: "Loadly'yi kim yönetiyor",
    s1Body: "Loadly, aynı zamanda sitenin kurucusu olan ve bilgisayar ve endüstri mühendisliği geçmişine sahip, yazılımcı ve bilgisayar bilimi doktora adayı Eren Şimşir tarafından yönetilir ve yayınlanır. Makaleler anonim bir \"içerik ekibi\" değil, isimli bir editör adına yayınlanır. Loadly bağımsız bir yayındır: ürünleri elle test etmez ve makalelerinde sektörde birinci elden deneyim iddiasında bulunmaz.",
    s2Title: "Makaleler nasıl kaynaklanır",
    s2Body: "Her makale şu kurallara uyar:",
    s2L1: "Düzenleme ifadeleri birincil kaynaktan, yani düzenlemenin metninden ya da yayımlayan kurumun kendi rehberinden alınır ve makale bu kaynakları sonunda listeler.",
    s2L2: "Bir rakam yalnızca bir kaynak veriyorsa yazılır. Kaynak yoksa makale bunu belirtir ya da kesin bir rakam uydurmak yerine rakam vermez.",
    s2L3: "Çözümlü örnekler varsayımsal olarak etiketlenir ve her hesap gösterilen formül ya da kuraldan yeniden üretilebilir.",
    s2L4: "Makaleler neyi kapsamadıklarını ve düzenleme konularında düzenleme metninin hangi tarihte kontrol edildiğini belirtir.",
    s3Title: 'Yapmadıklarımız',
    s3Body: "Genel sektör bilgisini özgün araştırma gibi sunmayız, hiç yapılmamış elle test iddiasında bulunmayız, sahte referans yayınlamayız ve hukuki, vergisel ya da uyum tavsiyesi vermeyiz. Düzenlemeler değiştiği için okurlar harekete geçmeden önce güncel metni doğrulamalıdır.",
    s4Title: 'Düzeltmeler',
    s4Body: "Herhangi bir makalede gerçek dışı bir bilgi, güncelliğini yitirmiş bir rakam veya bozuk bir kaynak referansı görürseniz, bunu bilmek ve düzeltmek isteriz.",
    s5Title: "Yayın",
    s5Body: "Makaleler sabit bir takvimde değil, kaynaklarına karşı araştırıldıklarında yayınlanır ve bir düzenleme değiştiğinde güncellenebilir.",
    contactTitle: 'İletişim',
    contactBody: 'Herhangi bir makaleyle ilgili düzeltme, soru veya geri bildirim için:',
  },
};

export function EditorialPolicyPageClient({ locale }: { locale: string }) {
  const t = useT();
  const params = useParams();
  const activeLocale = (typeof params?.locale === 'string' ? params.locale : locale) || 'en';
  const c = COPY[activeLocale] || COPY.en;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <FileText size={28} className="text-[#A66700]" />
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
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s5Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>{c.s5Body}</p>
        </div>

        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{c.s4Title}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>{c.s4Body}</p>
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

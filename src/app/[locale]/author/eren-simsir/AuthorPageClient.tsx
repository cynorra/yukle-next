'use client';

import { useT } from '@/hooks/useT';
import { Linkedin, Mail } from 'lucide-react';

interface Copy {
  role: string;
  bioP1: string;
  bioP2: string;
  linkedin: string;
  contact: string;
}

const COPY: Record<string, Copy> = {
  en: {
    role: "Founder & Editor, Loadly",
    bioP1: "Eren Şimşir founded and edits Loadly, an independent publication of freight and logistics guides. He is a software developer with a computer engineering and industrial engineering background, and a PhD candidate in computer science. Loadly articles are based on primary sources such as regulation text and agency guidance, and each one lists its sources. He does not claim first-hand freight industry experience; the Editorial Policy explains how articles are sourced and corrected.",
    bioP2: "He also builds and maintains the site itself.",
    linkedin: 'LinkedIn',
    contact: 'Contact',
  },
  tr: {
    role: "Kurucu & Editör, Loadly",
    bioP1: "Eren Şimşir, bağımsız bir nakliye ve lojistik rehberi yayını olan Loadly'yi kurdu ve yönetiyor. Bilgisayar ve endüstri mühendisliği geçmişine sahip bir yazılımcı ve bilgisayar bilimi doktora adayıdır. Loadly makaleleri düzenleme metni ve kurum rehberleri gibi birincil kaynaklara dayanır ve her biri kaynaklarını listeler. Nakliye sektöründe birinci elden deneyim iddiasında bulunmaz; makalelerin nasıl kaynaklandığı ve düzeltildiği Editoryal Politika sayfasında açıklanır.",
    bioP2: "Siteyi de kendisi geliştirir ve sürdürür.",
    linkedin: 'LinkedIn',
    contact: 'İletişim',
  },
};

export function AuthorPageClient({ locale }: { locale: string }) {
  const t = useT();
  const c = COPY[locale] || COPY.en;

  return (
    <div className={t.pageFull}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={`p-8 rounded-2xl ${t.card}`}>
          <h1 className={`text-2xl font-bold ${t.heading}`}>Eren Şimşir</h1>
          <p className="text-sm text-[#A66700] font-bold mt-1 mb-6">{c.role}</p>

          <p className={`text-sm ${t.sub} leading-relaxed mb-4`}>{c.bioP1}</p>
          <p className={`text-sm ${t.sub} leading-relaxed mb-6`}>{c.bioP2}</p>

          <div className="flex gap-4 pt-4 border-t border-border-light dark:border-border-dark">
            <a
              href="https://www.linkedin.com/in/ernsmsr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#A66700] hover:underline"
            >
              <Linkedin size={16} /> {c.linkedin}
            </a>
            <a
              href="mailto:info@loadlyapp.com"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#A66700] hover:underline"
            >
              <Mail size={16} /> {c.contact}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

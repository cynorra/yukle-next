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
    role: 'Founder & Chief Technical Editor, Loadly',
    bioP1: "Eren Şimşir founded and runs Loadly, a logistics and freight content platform publishing practical guides for shippers, carriers, and logistics professionals in 54 languages. Loadly's editorial process is described in detail on the Editorial Policy page — articles are AI-assisted under a set of written editorial rules and automated quality checks, reviewed and maintained by Eren as a single-person operation.",
    bioP2: "Eren also builds and maintains Loadly's technical infrastructure end to end — the marketplace platform, the multilingual content pipeline, and the site's SEO/accessibility work.",
    linkedin: 'LinkedIn',
    contact: 'Contact',
  },
  tr: {
    role: "Kurucu & Baş Teknik Editör, Loadly",
    bioP1: "Eren Şimşir, gönderenler, taşıyıcılar ve lojistik profesyonelleri için 54 dilde pratik rehberler yayınlayan bir lojistik ve nakliye içerik platformu olan Loadly'yi kurdu ve yönetiyor. Loadly'nin editoryal süreci Editoryal Politika sayfasında detaylı anlatılıyor — makaleler yazılı editoryal kurallar ve otomatik kalite kontrolleri altında yapay zeka desteğiyle hazırlanıyor, tek kişilik bir operasyon olarak Eren tarafından gözden geçiriliyor ve sürdürülüyor.",
    bioP2: "Eren ayrıca Loadly'nin teknik altyapısını da uçtan uca kuruyor ve sürdürüyor — pazar yeri platformu, çok dilli içerik hattı ve sitenin SEO/erişilebilirlik çalışmaları.",
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

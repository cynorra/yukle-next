'use client';

import { useT } from '@/hooks/useT';
import { Linkedin, Mail } from 'lucide-react';

interface Copy {
  role: string;
  bioP1: string;
  bioP2: string;
  linkedin: string;
  contact: string;
  sections?: { title: string; body: string }[];
  readTitle?: string;
  links?: { label: string; href: string }[];
}

const COPY: Record<string, Copy> = {
  en: {
    role: "Founder & Editor, Loadly",
    bioP1: "Eren Şimşir founded and edits Loadly, an independent publication of freight and logistics guides. He is a software developer with a computer engineering and industrial engineering background, and a PhD candidate in computer science. Loadly articles are based on primary sources such as regulation text and agency guidance, and each one lists its sources. He does not claim first-hand freight industry experience; the Editorial Policy explains how articles are sourced and corrected.",
    bioP2: "He also builds and maintains the site itself.",
    sections: [
      {
        title: 'Background',
        body: "Eren's training is in software and engineering: a double major in computer engineering and industrial engineering, and now a PhD in computer science in progress. The engineering background is where the arithmetic in the guides comes from, such as density, cost per mile and weight limits, and the software background is how the calculators and this site are built. He has no first-hand freight industry experience and does not write as if he did.",
      },
      {
        title: 'How the guides are written',
        body: 'Each guide starts from a primary source: a section of the Code of Federal Regulations, a statute, or a published industry standard. The text is read directly and compared with what the guide says, calculations are worked through and checked against the figures the source publishes, and the sources are listed at the end of the guide. A point that could not be checked against a source is not stated as fact.',
      },
      {
        title: 'What Loadly covers',
        body: 'The guides focus on the rules that shape trucking and freight in the United States: who may broker or dispatch loads, how hours of service and electronic logging work, what insurance and bonds the regulations require, how cargo, axle weight and hazardous materials are handled, and how LTL freight classes and density are calculated. Each topic is written for a reader who has to make a decision, such as a new owner-operator, a small shipper or a dispatcher checking a requirement, and points to the regulation text so the reader can confirm it.',
      },
      {
        title: 'What a guide does and does not claim',
        body: 'A guide explains what a rule says and where it comes from. It is not legal, tax or insurance advice, and it does not predict rates or earnings. Where a rule has exceptions, or where practice differs from the text, the guide says so. The regulations change, so each guide lists its sources and, for regulatory topics, the date the regulation text was checked, and readers should confirm the current text with the issuing agency.',
      },
      {
        title: 'Corrections and independence',
        body: 'If a guide is wrong or out of date, write to info@loadlyapp.com with the guide and the passage in question. Confirmed errors are corrected in the article. Advertising, where it appears, is labelled as advertising and is kept apart from the guides. The Editorial Policy explains how sources are chosen and how corrections are handled.',
      },
    ],
    readTitle: 'Where to start',
    links: [
      { label: 'What Is a Freight Broker? The Legal Definition and Requirements', href: '/en/blog/what-is-a-freight-broker-legal-definition-requirements-en' },
      { label: 'Hours of Service for Truck Drivers: The Limits and Their Exceptions', href: '/en/blog/hours-of-service-limits-property-carrying-drivers-en' },
      { label: 'LTL Shipping Explained: How It Differs From Parcel and Full Truckload', href: '/en/blog/ltl-shipping-explained-vs-parcel-and-full-truckload-en' },
      { label: 'Free freight calculators', href: '/en/tools' },
    ],
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

          {c.sections?.map((s) => (
            <div key={s.title} className="mb-6">
              <h2 className={`text-lg font-bold ${t.heading} mb-2`}>{s.title}</h2>
              <p className={`text-sm ${t.sub} leading-relaxed`}>{s.body}</p>
            </div>
          ))}

          {c.links && (
            <div className="mb-6">
              <h2 className={`text-lg font-bold ${t.heading} mb-2`}>{c.readTitle}</h2>
              <ul className={`list-disc pl-5 space-y-1 text-sm ${t.sub}`}>
                {c.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-[#A66700] hover:underline">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

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

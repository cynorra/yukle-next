'use client';

import { useT } from '@/hooks/useT';
import { Cookie, ExternalLink } from 'lucide-react';

interface CookieRow {
  name: string;
  purpose: string;
  duration: string;
  provider: string;
}

interface CookiePolicyContent {
  title: string;
  description: string;
  introTitle: string;
  introDesc: string;
  tableTitle: string;
  colName: string;
  colPurpose: string;
  colDuration: string;
  colProvider: string;
  rows: CookieRow[];
  rowsNote: string;
  manageTitle: string;
  manageDesc: string;
  browserTitle: string;
  browserDesc: string;
  contactTitle: string;
  contactDesc: string;
}

interface Props {
  data: { cookiePolicy: CookiePolicyContent };
}

export function CookiePolicyPageClient({ data }: Props) {
  const t = useT();
  const content = data.cookiePolicy;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Cookie size={28} className="text-[#A66700]" />
            {content.title}
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>
            {content.description}
          </p>
        </div>

        {/* Intro */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.introTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.introDesc}
          </p>
        </div>

        {/* Cookie table */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.tableTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark">
                  <th className={`text-left py-2 pr-4 font-semibold ${t.heading}`}>{content.colName}</th>
                  <th className={`text-left py-2 pr-4 font-semibold ${t.heading}`}>{content.colPurpose}</th>
                  <th className={`text-left py-2 pr-4 font-semibold ${t.heading}`}>{content.colDuration}</th>
                  <th className={`text-left py-2 font-semibold ${t.heading}`}>{content.colProvider}</th>
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row) => (
                  <tr key={row.name} className="border-b border-border-light dark:border-border-dark align-top">
                    <td className={`py-3 pr-4 font-mono text-xs ${t.heading} whitespace-nowrap`}>{row.name}</td>
                    <td className={`py-3 pr-4 ${t.sub} leading-relaxed`}>{row.purpose}</td>
                    <td className={`py-3 pr-4 ${t.sub} whitespace-nowrap`}>{row.duration}</td>
                    <td className={`py-3 ${t.sub}`}>{row.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`text-sm ${t.muted} mt-4 italic`}>
            {content.rowsNote}
          </p>
        </div>

        {/* Manage preferences */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.manageTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed mb-3`}>
            {content.manageDesc}
          </p>
          <ul className={`list-none space-y-2 text-sm ${t.sub}`}>
            <li>
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A66700] hover:underline inline-flex items-center gap-1"
              >
                Google Ads Settings <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A66700] hover:underline inline-flex items-center gap-1"
              >
                Digital Advertising Alliance (aboutads.info) <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>

        {/* Browser blocking */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.browserTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.browserDesc}
          </p>
        </div>

        {/* Contact */}
        <div className={`p-6 rounded-2xl ${t.card} mb-4`}>
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{content.contactTitle}</h2>
          <p className={`text-sm ${t.sub} leading-relaxed`}>
            {content.contactDesc}
          </p>
          <ul className={`list-none space-y-2 text-sm ${t.sub} mt-3`}>
            <li>Email: <a href="mailto:kvkk@loadlyapp.com" className="text-[#A66700] hover:underline">kvkk@loadlyapp.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

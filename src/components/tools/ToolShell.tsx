'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Calculator } from 'lucide-react';
import { useT } from '@/hooks/useT';

export interface ToolSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolLink {
  label: string;
  href: string;
  description?: string;
}

interface ToolShellProps {
  title: string;
  intro: string;
  children: ReactNode; // the calculator
  sections: ToolSection[];
  faq: ToolFaq[];
  sources: ToolLink[];
  related: ToolLink[];
}

/** Shared page frame for every calculator: calculator first, then the explanation. */
export function ToolShell({ title, intro, children, sections, faq, sources, related }: ToolShellProps) {
  const t = useT();

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" className={`text-xs ${t.muted} mb-4`}>
          <Link href="/en" className="hover:underline">Home</Link>
          {' / '}
          <Link href="/en/tools" className="hover:underline">Tools</Link>
          {' / '}
          <span aria-current="page">{title}</span>
        </nav>

        <header className="mb-6">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Calculator size={28} className="text-[#A66700] shrink-0" aria-hidden="true" />
            {title}
          </h1>
          <p className={`text-sm ${t.sub} mt-2 leading-relaxed`}>{intro}</p>
        </header>

        <div className={`p-5 sm:p-6 rounded-2xl ${t.card} mb-8`}>{children}</div>

        {sections.map((s) => (
          <section key={s.title} className="mb-8">
            <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{s.title}</h2>
            {s.paragraphs?.map((p, idx) => (
              <p key={idx} className={`text-sm ${t.sub} leading-relaxed mb-3`}>{p}</p>
            ))}
            {s.bullets && (
              <ul className={`list-disc pl-5 space-y-2 text-sm ${t.sub}`}>
                {s.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </section>
        ))}

        <section className="mb-8">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>Frequently asked questions</h2>
          <div className="space-y-4">
            {faq.map((f) => (
              <div key={f.q} className={`p-4 rounded-xl ${t.card}`}>
                <h3 className={`text-sm font-bold ${t.heading} mb-1`}>{f.q}</h3>
                <p className={`text-sm ${t.sub} leading-relaxed`}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>Sources and further reading</h2>
          <ul className={`list-disc pl-5 space-y-1.5 text-sm ${t.sub}`}>
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[#A66700] hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className={`text-lg font-bold ${t.heading} mb-3`}>More free tools</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={`block p-4 rounded-xl ${t.card} ${t.cardHover}`}>
                  <span className={`text-sm font-bold ${t.heading}`}>{r.label}</span>
                  {r.description && <span className={`block text-xs ${t.sub} mt-1`}>{r.description}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className={`text-xs ${t.muted} leading-relaxed`}>
          These calculators run in your browser and do not send or store what you enter. Results are estimates for
          planning only; your carrier, broker or contract decides the final charge. Loadly is not a carrier or broker
          and this is not professional advice.
        </p>
      </div>
    </div>
  );
}

// ---- small form primitives shared by the calculators ----------------------

export function Field({ id, label, children, hint }: { id: string; label: string; children: ReactNode; hint?: string }) {
  const t = useT();
  return (
    <div>
      <label htmlFor={id} className={`block text-xs font-bold ${t.heading} mb-1.5`}>{label}</label>
      {children}
      {hint && <p className={`text-[11px] ${t.muted} mt-1`}>{hint}</p>}
    </div>
  );
}

export function useInputClass() {
  const t = useT();
  return `w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none ${t.input}`;
}

export function ResultBox({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-5 p-4 rounded-xl border ${t.accentBorder} ${t.accentBg}`}
    >
      {children}
    </div>
  );
}

export function ResultRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  const t = useT();
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span className={`text-sm ${t.sub}`}>{label}</span>
      <span className={`${strong ? 'text-lg font-bold' : 'text-sm font-semibold'} ${t.heading} text-right`}>{value}</span>
    </div>
  );
}

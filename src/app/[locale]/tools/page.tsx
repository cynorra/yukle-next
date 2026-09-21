import type { Metadata } from 'next';
import Link from 'next/link';
import { toolUrl } from '@/lib/tools/seo';

const DESCRIPTION =
  'Free freight and logistics calculators: dimensional weight, fuel cost and detention fees. No sign-up, and nothing you enter leaves your browser.';

export const metadata: Metadata = {
  title: 'Free Freight and Logistics Calculators',
  description: DESCRIPTION,
  alternates: { canonical: toolUrl() },
  openGraph: { title: 'Free Freight and Logistics Calculators | Loadly', description: DESCRIPTION, url: toolUrl() },
};

const TOOLS = [
  {
    href: '/en/tools/dimensional-weight-calculator',
    name: 'Dimensional Weight Calculator',
    text: 'See whether a parcel, air or sea shipment is billed on its size or its weight, and find its chargeable weight.',
  },
  {
    href: '/en/tools/fuel-cost-calculator',
    name: 'Fuel Cost Calculator',
    text: 'Estimate the fuel needed and the cost of a trip in miles and gallons or kilometres and litres.',
  },
  {
    href: '/en/tools/detention-fee-calculator',
    name: 'Detention Fee Calculator',
    text: 'Turn time on site, free time and an hourly rate into a billable time and a detention charge.',
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold font-display text-fg tracking-tight">Free freight and logistics calculators</h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Small tools for the sums that come up in shipping. Each one has a short guide underneath explaining the
          formula, a worked example and the details that are easy to get wrong. They run in your browser and do not
          send or store what you enter.
        </p>

        <ul className="grid sm:grid-cols-2 gap-4 mt-6">
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="block h-full p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm hover:border-accent/30 hover:shadow-md transition-all"
              >
                <h2 className="text-base font-bold font-display text-fg">{tool.name}</h2>
                <p className="text-sm text-muted mt-2 leading-relaxed">{tool.text}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted/60 mt-8 leading-relaxed">
          Results are estimates for planning. Your carrier, broker or contract decides the final charge.
        </p>
      </div>
    </div>
  );
}

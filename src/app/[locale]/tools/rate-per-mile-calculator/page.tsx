import type { Metadata } from 'next';
import { ToolShell, type ToolFaq, type ToolLink, type ToolSection } from '@/components/tools/ToolShell';
import { LoadRateCalculator } from '@/components/tools/LoadRateCalculator';
import { fmt, loadRate } from '@/lib/tools/calculations';
import { toolJsonLd, toolUrl } from '@/lib/tools/seo';

const SLUG = 'rate-per-mile-calculator';
const NAME = 'Rate Per Mile Calculator';
const DESCRIPTION =
  'Free rate per mile calculator for truckers. Enter the pay, the loaded miles and the empty miles to see the rate per loaded mile and per total mile, and what is left after your running costs.';

export const metadata: Metadata = {
  title: 'Rate Per Mile Calculator: Loaded Miles vs Total Miles',
  description: DESCRIPTION,
  alternates: { canonical: toolUrl(SLUG) },
  openGraph: { title: `${NAME} | Loadly`, description: DESCRIPTION, url: toolUrl(SLUG) },
};

// Same function as the calculator. All numbers here are invented for the arithmetic.
const a = loadRate({ rate: 1800, loadedMiles: 600, emptyMiles: 120, costPerMile: null })!;
const b = loadRate({ rate: 1800, loadedMiles: 600, emptyMiles: 120, costPerMile: 1.7 })!;
const c = loadRate({ rate: 1500, loadedMiles: 500, emptyMiles: 0, costPerMile: 1.7 })!;

const sections: ToolSection[] = [
  {
    title: 'Loaded miles and total miles',
    paragraphs: [
      'Load listings usually quote the rate against the miles with freight on the truck. But the truck also has to get to the pickup, and any empty miles driven to reach it earn nothing. The rate per total mile divides the pay by every mile driven, loaded or empty, and it is the number that tells you what each mile of the trip actually paid.',
      `A made-up example: a load pays $1,800 for ${fmt(a.totalMiles - 120, 0)} loaded miles, and the truck is 120 miles from the pickup. Per loaded mile that is $${fmt(a.perLoadedMile)}. Per total mile (${fmt(a.totalMiles, 0)} miles) it is $${fmt(a.perTotalMile)}.`,
    ],
  },
  {
    title: 'Adding your running cost',
    paragraphs: [
      `If you enter a running cost per mile, the calculator multiplies it by the total miles and subtracts it from the pay. With an invented cost of $1.70 per mile, the example above costs about $${fmt(b.costTotal ?? 0)} to run, which leaves $${fmt(b.margin ?? 0)} ($${fmt(b.marginPerTotalMile ?? 0)} per total mile).`,
      `Compare a different load: $1,500 for 500 loaded miles with no empty miles pays only $${fmt(c.perLoadedMile)} per loaded mile, less than the first load, but the same cost per mile leaves $${fmt(c.margin ?? 0)} ($${fmt(c.marginPerTotalMile ?? 0)} per total mile). The load with the lower headline rate earns more per mile driven, because it needs no empty move.`,
    ],
  },
  {
    title: 'What the number leaves out',
    bullets: [
      'Time. Two loads with the same rate per mile can take very different amounts of time once waiting at the dock, hours-of-service limits and traffic are counted.',
      'Your real cost per mile. It varies with fuel, maintenance, tires, insurance, equipment payments and how many miles you run in a year. Use your own figure, not a rule of thumb.',
      'Fees and payment terms such as quick-pay charges, factoring or tolls, which come out of the pay in different ways.',
      'Whether you can legally run the load. Hours of service, weight and securement still apply.',
    ],
  },
];

const faq: ToolFaq[] = [
  {
    q: 'What is the difference between rate per loaded mile and rate per total mile?',
    a: 'Per loaded mile divides the pay by the miles with freight on the truck. Per total mile divides it by every mile driven, including the empty miles to the pickup, so it shows what each mile of the trip actually earned.',
  },
  {
    q: 'What counts as empty miles?',
    a: 'Miles driven without freight to reach the pickup. Some people also count empty miles driven after the delivery to reach the next load; this calculator covers one trip at a time, so add them yourself if you want them included.',
  },
  {
    q: 'What running cost per mile should I enter?',
    a: 'Your own figure: your actual operating costs divided by the miles you drive over the same period. The pre-filled example numbers mean nothing for your truck.',
  },
  {
    q: 'Does this account for the load board fee or quick pay?',
    a: 'No. Treat any fee that comes out of the pay as part of your running cost, or subtract it from the total pay before you enter it.',
  },
];

const sources: ToolLink[] = [
  { label: '49 CFR § 395.3 — Maximum driving time for property-carrying vehicles (eCFR)', href: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-395/section-395.3' },
];

const related: ToolLink[] = [
  { label: 'Load Boards: How to Vet a Load Before You Book It', href: '/en/blog/load-boards-how-to-vet-a-load-before-booking-en', description: 'The guide this calculator belongs to.' },
  { label: 'Truck Driver Pay: What the Federal Data Shows and How Drivers Are Paid', href: '/en/blog/truck-driver-pay-bls-data-pay-methods-en', description: 'Pay methods and the owner-operator lease rules.' },
  { label: 'Fuel Cost Calculator', href: '/en/tools/fuel-cost-calculator', description: 'Estimate the fuel cost of a trip.' },
  { label: 'Detention Fee Calculator', href: '/en/tools/detention-fee-calculator', description: 'Work out a waiting-time charge.' },
];

export default function Page() {
  const jsonLd = toolJsonLd({ slug: SLUG, name: NAME, description: DESCRIPTION, faq });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell
        title={NAME}
        intro="See what a load really pays per mile. Enter the total pay, the loaded miles and the empty miles to the pickup, and compare the rate per loaded mile with the rate per total mile."
        sections={sections}
        faq={faq}
        sources={sources}
        related={related}
      >
        <LoadRateCalculator />
      </ToolShell>
    </>
  );
}

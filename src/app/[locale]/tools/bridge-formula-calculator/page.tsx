import type { Metadata } from 'next';
import { ToolShell, type ToolFaq, type ToolLink, type ToolSection } from '@/components/tools/ToolShell';
import { BridgeFormulaCalculator } from '@/components/tools/BridgeFormulaCalculator';
import { bridgeFormula, fmt } from '@/lib/tools/calculations';
import { toolJsonLd, toolUrl } from '@/lib/tools/seo';

const SLUG = 'bridge-formula-calculator';
const NAME = 'Federal Bridge Formula Calculator';
const DESCRIPTION =
  'Free Federal Bridge Formula calculator. Enter the number of axles and the distance between the outer axles to see the maximum legal weight for that group, rounded as FHWA describes.';

export const metadata: Metadata = {
  title: 'Federal Bridge Formula Calculator: Maximum Weight for an Axle Group',
  description: DESCRIPTION,
  alternates: { canonical: toolUrl(SLUG) },
  openGraph: { title: `${NAME} | Loadly`, description: DESCRIPTION, url: toolUrl(SLUG) },
};

// Every number in the examples below is computed with the same function the calculator uses.
const examples = [36, 40, 44, 48, 51].map((l) => ({ l, r: bridgeFormula(5, l)! }));
const tandem = bridgeFormula(2, 4)!;

const sections: ToolSection[] = [
  {
    title: 'What the formula does',
    paragraphs: [
      'The Federal Bridge Formula limits the total weight on any group of two or more consecutive axles, based on how many axles are in the group and how far apart the outer ones are. Spreading the same load over a longer distance puts less stress on a bridge, so a longer group is allowed more weight.',
      'FHWA gives it as W = 500 × [ (L × N ÷ (N − 1)) + 12N + 36 ], where W is the maximum weight in pounds on the group, rounded to the nearest 500 pounds, L is the distance in feet between the outer axles of the group, and N is the number of axles in the group. The calculator applies exactly that, and then applies the overall gross limit of 80,000 pounds from 23 CFR 658.17.',
    ],
  },
  {
    title: 'Worked check: a five-axle combination',
    paragraphs: [
      `For N = 5 the only variable left is the distance L from the first axle to the last. The results below come from the same function as the calculator: ${examples
        .map((e) => `${e.l} ft gives ${fmt(e.r.limit, 0)} lb`)
        .join(', ')}.`,
      `As a check on the formula, two axles spaced 4 feet apart (N = 2, L = 4) give ${fmt(tandem.limit, 0)} lb, which matches the 34,000 lb tandem limit in 23 CFR 658.17(d). FHWA's own example of a five-axle vehicle with 51 feet between the outer axles is 80,000 lb.`,
    ],
  },
  {
    title: 'What the calculator does not check',
    bullets: [
      'It checks one group at a time. The formula has to be satisfied for every group of consecutive axles on the vehicle, including short groups at the front and rear.',
      'The single-axle limit (20,000 lb) and the tandem limit (34,000 lb, for axles spaced more than 40 inches and not more than 96 inches apart) apply separately.',
      'The federal limits apply on the Interstate System and reasonable access to it. Other roads, permits for nondivisible loads, grandfathered State limits and fine amounts are decided State by State.',
      'It is a planning aid, not a determination that a load is legal. Weigh the vehicle and check the rules where you will drive.',
    ],
  },
];

const faq: ToolFaq[] = [
  {
    q: 'What does N mean in the Bridge Formula?',
    a: 'N is the number of axles in the group being considered. A group is two or more consecutive axles, so N is at least 2.',
  },
  {
    q: 'How is L measured?',
    a: 'L is the distance in feet between the outer axles of the group: from the center of the first axle in the group to the center of the last.',
  },
  {
    q: 'Why is the result rounded to 500 pounds?',
    a: 'FHWA defines W as the overall gross weight on the group "to the nearest 500 pounds", so the calculator rounds the same way and shows the unrounded figure as well.',
  },
  {
    q: 'Does the formula replace the 80,000-pound limit?',
    a: 'No. In no case may the total gross weight of a vehicle exceed 80,000 pounds, even where the formula would allow more for a long axle group.',
  },
];

const sources: ToolLink[] = [
  { label: '23 CFR § 658.17 — Weight (eCFR)', href: 'https://www.ecfr.gov/current/title-23/chapter-I/subchapter-G/part-658/subpart-B/section-658.17' },
  { label: 'FHWA — Bridge Formula Weights', href: 'https://ops.fhwa.dot.gov/freight/publications/brdg_frm_wghts/' },
];

const related: ToolLink[] = [
  { label: 'Federal Truck Weight Limits: Axle Limits and the Bridge Formula', href: '/en/blog/federal-axle-weight-limits-bridge-formula-en', description: 'The guide this calculator belongs to, with the exceptions in the rule.' },
  { label: 'Cargo Securement: How Many Tiedowns and How Strong', href: '/en/blog/cargo-securement-tiedowns-working-load-limit-en', description: 'The securement side of a heavy load.' },
  { label: 'LTL Density Calculator', href: '/en/tools/ltl-density-calculator', description: 'Pounds per cubic foot for a pallet.' },
  { label: 'Fuel Cost Calculator', href: '/en/tools/fuel-cost-calculator', description: 'Estimate the fuel cost of a trip.' },
];

export default function Page() {
  const jsonLd = toolJsonLd({ slug: SLUG, name: NAME, description: DESCRIPTION, faq });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell
        title={NAME}
        intro="Find the maximum legal weight for a group of axles under the Federal Bridge Formula. Enter the number of axles and the distance between the outer axles, and compare it with the weight on the group."
        sections={sections}
        faq={faq}
        sources={sources}
        related={related}
      >
        <BridgeFormulaCalculator />
      </ToolShell>
    </>
  );
}

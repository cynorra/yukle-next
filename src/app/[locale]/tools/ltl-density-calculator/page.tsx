import type { Metadata } from 'next';
import { ToolShell, type ToolFaq, type ToolLink, type ToolSection } from '@/components/tools/ToolShell';
import { LtlDensityCalculator } from '@/components/tools/LtlDensityCalculator';
import { fmt, ltlDensity } from '@/lib/tools/calculations';
import { toolJsonLd, toolUrl } from '@/lib/tools/seo';

const SLUG = 'ltl-density-calculator';
const NAME = 'LTL Density Calculator';
const DESCRIPTION =
  'Free LTL density calculator. Enter the length, width, height and weight of a pallet to get cubic feet and pounds per cubic foot, using the method NMFTA publishes.';

export const metadata: Metadata = {
  title: 'LTL Density Calculator: Pounds per Cubic Foot for a Pallet',
  description: DESCRIPTION,
  alternates: { canonical: toolUrl(SLUG) },
  openGraph: { title: `${NAME} | Loadly`, description: DESCRIPTION, url: toolUrl(SLUG) },
};

// Both examples are computed with the same function the calculator uses.
const nmfta = ltlDensity({ length: 48, width: 40, height: 45, weight: 450, units: 1 })!;
const withPallet = ltlDensity({ length: 52, width: 44, height: 60, weight: 600, units: 1 })!;
const withoutPallet = ltlDensity({ length: 52, width: 44, height: 54, weight: 600, units: 1 })!;

const sections: ToolSection[] = [
  {
    title: 'How density is calculated',
    paragraphs: [
      'NMFTA, which publishes the freight classification system LTL pricing relies on, describes the method for one handling unit: multiply the greatest straight-line length, width and height in inches, including any projections and as the unit is tendered to the carrier, and divide by 1,728 cubic inches (one cubic foot). Then divide the weight of the handling unit as tendered by those cubic feet. The answer is the density in pounds per cubic foot.',
      `NMFTA's own example is a pallet of boxes measuring 48 × 40 × 45 inches and weighing 450 pounds: ${fmt(nmfta.cubicInches, 0)} cubic inches, ${fmt(nmfta.cubicFeet, 0)} cubic feet, and ${fmt(nmfta.densityPcf)} pounds per cubic foot. The calculator reproduces it.`,
    ],
  },
  {
    title: 'Why measuring the pallet matters',
    paragraphs: [
      `Leaving out the pallet understates the cube and overstates the density. In a made-up example, a pallet that is 52 × 44 inches and 60 inches high including the pallet weighs 600 pounds: ${fmt(withPallet.cubicFeet)} cubic feet and ${fmt(withPallet.densityPcf)} pounds per cubic foot. Measured at 54 inches, as if the 6-inch pallet were left out, the same load looks like ${fmt(withoutPallet.cubicFeet)} cubic feet and ${fmt(withoutPallet.densityPcf)} pounds per cubic foot. That difference is the kind that can lead a carrier to reclassify a shipment after it measures it.`,
    ],
  },
  {
    title: 'What this tool does not tell you',
    bullets: [
      'The freight class. Density is one of four characteristics (with handling, stowability and liability) that set a class from 50 to 500, and the class for your commodity depends on its NMFC item number and the current NMFTA tables. NMFTA says its ClassIT+ is the official source for item changes, density scales and rule updates.',
      'Your rate. Carriers add their own tariffs, discounts, minimum charges and accessorial fees on top of the class.',
      'Multiple handling units on one bill of lading. NMFTA cites the rule that density is calculated on each handling unit unless the shipping papers show only a total weight for all units.',
    ],
  },
];

const faq: ToolFaq[] = [
  {
    q: 'What is density in LTL shipping?',
    a: 'Density is how heavy the freight is relative to the space it takes up, measured in pounds per cubic foot. It is one of the four characteristics NMFTA uses to assign a freight class.',
  },
  {
    q: 'Do I include the pallet in the measurements?',
    a: 'Yes. NMFTA advises to include pallets or packaging, and the method uses the greatest dimensions of the handling unit as tendered to the carrier, including any projections.',
  },
  {
    q: 'Does this tell me my freight class?',
    a: 'No. The class depends on the commodity and its NMFC item number as well as density. Look up the current class and density rules in NMFTA’s ClassIT+.',
  },
  {
    q: 'Why does a taller pallet have a lower density?',
    a: 'Because the same weight is spread over more cubic feet. Adding height raises the cube without adding weight, so pounds per cubic foot falls.',
  },
];

const sources: ToolLink[] = [
  { label: 'NMFTA — National Motor Freight Classification', href: 'https://nmfta.org/nmfc/' },
  { label: 'NMFTA — Decoding Density: The Freight Factor You Can’t Afford to Overlook', href: 'https://nmfta.org/news/decoding-density-the-freight-factor-you-cant-afford-to-overlook/' },
  { label: 'NMFTA — 2025 NMFC Changes FAQ (PDF)', href: 'https://nmfta.org/wp-content/media/2024/11/1106-FAQ_Doc-3.pdf' },
];

const related: ToolLink[] = [
  { label: 'LTL Shipping: How Freight Class and Density Are Calculated', href: '/en/blog/ltl-freight-class-density-calculation-en', description: 'The guide this calculator belongs to.' },
  { label: 'LTL Shipping Explained: How It Differs From Parcel and Full Truckload', href: '/en/blog/ltl-shipping-explained-vs-parcel-and-full-truckload-en', description: 'Where LTL fits and how it is priced.' },
  { label: 'Dimensional Weight Calculator', href: '/en/tools/dimensional-weight-calculator', description: 'The parcel pricing system, which is different.' },
  { label: 'Detention Fee Calculator', href: '/en/tools/detention-fee-calculator', description: 'Work out a waiting-time charge.' },
];

export default function Page() {
  const jsonLd = toolJsonLd({ slug: SLUG, name: NAME, description: DESCRIPTION, faq });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell
        title={NAME}
        intro="Work out the density of an LTL pallet in pounds per cubic foot. Enter the length, width and height in inches and the weight in pounds, and see the cubic feet and density."
        sections={sections}
        faq={faq}
        sources={sources}
        related={related}
      >
        <LtlDensityCalculator />
      </ToolShell>
    </>
  );
}

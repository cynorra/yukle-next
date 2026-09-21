import type { Metadata } from 'next';
import { ToolShell, type ToolFaq, type ToolLink, type ToolSection } from '@/components/tools/ToolShell';
import { DimensionalWeightCalculator } from '@/components/tools/DimensionalWeightCalculator';
import { dimensionalWeight, fmt } from '@/lib/tools/calculations';
import { toolJsonLd, toolUrl } from '@/lib/tools/seo';

const SLUG = 'dimensional-weight-calculator';
const NAME = 'Dimensional Weight Calculator';
const DESCRIPTION =
  'Free dimensional (volumetric) weight calculator for parcel, air and sea freight. Enter the box size and weight, choose a divisor and see the chargeable weight.';

export const metadata: Metadata = {
  title: 'Dimensional Weight Calculator: Find Your Chargeable Weight',
  description: DESCRIPTION,
  alternates: { canonical: toolUrl(SLUG) },
  openGraph: { title: `${NAME} | Loadly`, description: DESCRIPTION, url: toolUrl(SLUG) },
};

// The worked example below is computed with the same function the calculator uses.
const example = dimensionalWeight({
  length: 24, width: 18, height: 12, divisor: 139, quantity: 1, actualWeightPerPiece: 10, roundUp: true,
})!;

const sections: ToolSection[] = [
  {
    title: 'What dimensional weight is',
    paragraphs: [
      'Carriers sell space as well as weight. A large, light box, such as a pillow or a lampshade, can fill as much of a van or an aircraft hold as a much heavier one. To price that space fairly, many carriers compare two numbers: the shipment’s actual weight and its dimensional (or volumetric) weight, which converts the box’s size into a weight equivalent.',
      'The higher of the two is the chargeable weight, and it is the weight your rate is applied to. If your package is bulky but light, dimensional weight is what you pay for.',
    ],
  },
  {
    title: 'The formula',
    paragraphs: [
      'Dimensional weight = (length × width × height) ÷ divisor. Use the same unit for all three dimensions, and use the divisor that matches your units: cubic inches per pound, or cubic centimetres per kilogram.',
      `Worked example: a box that measures 24 × 18 × 12 in has a volume of ${fmt(example.volumePerPiece, 0)} in³. Divided by 139, its dimensional weight is ${fmt(example.dimWeightPerPiece)} lb. If the packed box weighs 10 lb, the chargeable weight is ${fmt(example.chargeableWeight)} lb, because that is the higher number.`,
    ],
  },
  {
    title: 'Common divisors',
    paragraphs: ['These are widely used, but carriers publish and change their own, so always confirm yours before you quote a price.'],
    bullets: [
      '139 in³ per lb, and older or retail-rate versions such as 166 in³ per lb, appear in US parcel pricing.',
      '5,000 cm³ per kg is common for express and courier air services.',
      '6,000 cm³ per kg (167 kg per m³) is the standard used for general air cargo under IATA conventions.',
      'Sea freight LCL (less than container load) is usually charged on weight or measurement, whichever is greater, with 1 m³ treated as 1,000 kg.',
    ],
  },
  {
    title: 'Where it does not apply',
    paragraphs: [
      'Full truckload shipments are normally priced per truck or per mile, not by dimensional weight. Less-than-truckload (LTL) freight is priced with freight classes that take density (pounds per cubic foot) into account, which is a related idea but a different system. If you ship pallets by LTL, ask your carrier which method it uses.',
    ],
  },
  {
    title: 'How to reduce dimensional weight',
    bullets: [
      'Use the smallest box that protects the goods; every extra inch on each side raises the volume quickly.',
      'Cut excess void fill and choose flexible mailers for soft goods that do not need a rigid box.',
      'Measure the packed box, including any bulges, handles or protruding parts, because carriers measure the outermost points.',
      'Compare carriers’ divisors; the same box can carry different chargeable weights with different carriers and services.',
      'Consolidate several small items into one properly sized box when that lowers the combined volume.',
    ],
  },
];

const faq: ToolFaq[] = [
  {
    q: 'What is chargeable weight?',
    a: 'Chargeable weight is the weight a carrier uses to calculate your charge. It is the greater of the shipment’s actual weight and its dimensional weight.',
  },
  {
    q: 'Which divisor should I use, 139 or 166?',
    a: 'It depends on your carrier, service level and any negotiated agreement. Look in the carrier’s current rate guide or your contract, or ask your account representative. The calculator lets you pick a common divisor or type in your own.',
  },
  {
    q: 'Why does the calculator round each dimension up?',
    a: 'Some carriers round each measured dimension up to the next whole unit before calculating, which can raise the result. You can switch this off if your carrier measures to a fraction.',
  },
  {
    q: 'How do I calculate several different boxes?',
    a: 'Run the calculator once for each size and add the chargeable weights together. The quantity field is for identical pieces only.',
  },
  {
    q: 'Do the pre-filled numbers mean anything?',
    a: 'No. They are only an example so you can see how the result is laid out. Replace them with your own measurements.',
  },
];

const sources: ToolLink[] = [
  { label: 'UPS — Dimensional weight (carrier’s own explanation)', href: 'https://www.ups.com/us/en/support/shipping-support/shipping-special-care-regulated-items/dimensional-weight' },
  { label: 'IATA — Cargo', href: 'https://www.iata.org/en/programs/cargo/' },
];

const related: ToolLink[] = [
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
        intro="Find out whether a shipment will be billed on its size or its weight. Enter the packed dimensions and weight, choose the divisor your carrier uses, and see the chargeable weight."
        sections={sections}
        faq={faq}
        sources={sources}
        related={related}
      >
        <DimensionalWeightCalculator />
      </ToolShell>
    </>
  );
}

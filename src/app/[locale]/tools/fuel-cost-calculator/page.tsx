import type { Metadata } from 'next';
import { ToolShell, type ToolFaq, type ToolLink, type ToolSection } from '@/components/tools/ToolShell';
import { FuelCostCalculator } from '@/components/tools/FuelCostCalculator';
import { fmt, fuelCost, L100_PER_MPG } from '@/lib/tools/calculations';
import { toolJsonLd, toolUrl } from '@/lib/tools/seo';

const SLUG = 'fuel-cost-calculator';
const NAME = 'Fuel Cost Calculator';
const DESCRIPTION =
  'Free trip fuel cost calculator for trucks and vehicles. Enter distance, fuel economy in mpg or L/100 km and the fuel price to see fuel needed, total cost and cost per mile or km.';

export const metadata: Metadata = {
  title: 'Fuel Cost Calculator for Trucks and Trips (mpg or L/100 km)',
  description: DESCRIPTION,
  alternates: { canonical: toolUrl(SLUG) },
  openGraph: { title: `${NAME} | Loadly`, description: DESCRIPTION, url: toolUrl(SLUG) },
};

// The worked example below is computed with the same function the calculator uses.
const example = fuelCost({
  distance: 500, distanceUnit: 'mi', economy: 6.5, economyUnit: 'mpg', price: 4, priceUnit: 'gal', roundTrip: false,
})!;

const sections: ToolSection[] = [
  {
    title: 'How the calculation works',
    paragraphs: [
      'Fuel needed = distance ÷ fuel economy. Estimated fuel cost = fuel needed × fuel price. Dividing the cost by the distance gives the fuel cost per mile or per kilometre, which is the number most carriers compare against their rate per mile.',
      `Worked example: a 500-mile trip at 6.5 mpg needs ${fmt(example.gallons)} US gallons. At $4.00 per gallon that is about $${fmt(example.totalCost)}, or $${fmt(example.costPerDistanceUnit)} per mile.`,
      `If your fuel economy is in litres per 100 km, the calculator converts automatically. The relationship is L/100 km = ${L100_PER_MPG.toFixed(2)} ÷ mpg (US gallons), and one US gallon is 3.785 litres.`,
    ],
  },
  {
    title: 'What this number leaves out',
    paragraphs: ['Fuel is only one line of a trip’s cost. For a complete cost per mile, add:'],
    bullets: [
      'Driver pay or your own time',
      'Tolls and permits',
      'Maintenance, tires and depreciation or lease payments',
      'Insurance and fuel taxes where they apply',
      'Empty (deadhead) miles to the pickup and back from the delivery; use the round-trip option to include a return leg',
    ],
  },
  {
    title: 'Why real fuel economy varies',
    paragraphs: ['A single mpg figure is an average. The number you actually get changes with:'],
    bullets: [
      'Load weight and trailer type',
      'Speed: fuel use rises as speed rises',
      'Terrain, weather and wind',
      'Idling time and stop-and-go traffic',
      'Tire pressure and general maintenance',
    ],
  },
  {
    title: 'Ways to lower fuel cost per mile',
    bullets: [
      'Plan routes and backhauls to cut empty miles.',
      'Reduce idling and keep speeds steady.',
      'Keep tires properly inflated and the truck well maintained.',
      'Compare fuel prices along your route, and check whether a fuel card or network gives you a discount.',
      'Track your own fuel economy trip by trip so your estimates use real data.',
    ],
  },
];

const faq: ToolFaq[] = [
  {
    q: 'What fuel economy should I enter?',
    a: 'Use your own recent average for the same vehicle and a similar load, from fuel receipts, an ELD or telematics. Averages differ widely between vehicles and conditions, so we do not suggest a single figure.',
  },
  {
    q: 'Can I use kilometres and litres?',
    a: 'Yes. Choose km as the distance unit, L/100 km as the fuel economy unit and price per litre. The calculator converts everything internally and reports results in the units you chose.',
  },
  {
    q: 'Does the result include tolls, driver pay or maintenance?',
    a: 'No. It covers fuel only. See the list above for other costs to add when you work out a full cost per mile.',
  },
  {
    q: 'Where can I find current fuel prices?',
    a: 'In the US, the Energy Information Administration publishes regularly updated national and regional diesel and gasoline prices. Your fuel card or pump receipts show what you actually pay.',
  },
  {
    q: 'Do the pre-filled numbers mean anything?',
    a: 'No. They are only an example so you can see how the result is laid out. Replace them with your own distance, fuel economy and price.',
  },
];

const sources: ToolLink[] = [
  { label: 'U.S. Energy Information Administration — Gasoline and diesel fuel update', href: 'https://www.eia.gov/petroleum/gasdiesel/' },
  { label: 'EPA — SmartWay Transport Partnership (freight fuel efficiency)', href: 'https://www.epa.gov/smartway' },
  { label: 'IFTA — International Fuel Tax Agreement', href: 'https://www.iftach.org/' },
];

const related: ToolLink[] = [
  { label: 'Dimensional Weight Calculator', href: '/en/tools/dimensional-weight-calculator', description: 'Find the chargeable weight of a shipment.' },
  { label: 'Detention Fee Calculator', href: '/en/tools/detention-fee-calculator', description: 'Work out a waiting-time charge.' },
];

export default function Page() {
  const jsonLd = toolJsonLd({ slug: SLUG, name: NAME, description: DESCRIPTION, faq });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell
        title={NAME}
        intro="Estimate what a trip will cost in fuel. Enter the distance, your fuel economy and the fuel price, in miles and gallons or in kilometres and litres."
        sections={sections}
        faq={faq}
        sources={sources}
        related={related}
      >
        <FuelCostCalculator />
      </ToolShell>
    </>
  );
}

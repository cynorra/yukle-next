import type { Metadata } from 'next';
import { ToolShell, type ToolFaq, type ToolLink, type ToolSection } from '@/components/tools/ToolShell';
import { DetentionFeeCalculator } from '@/components/tools/DetentionFeeCalculator';
import { detentionFee, fmt } from '@/lib/tools/calculations';
import { toolJsonLd, toolUrl } from '@/lib/tools/seo';

const SLUG = 'detention-fee-calculator';
const NAME = 'Detention Fee Calculator';
const DESCRIPTION =
  'Free detention fee calculator for truckers, brokers and shippers. Enter time on site, free time, hourly rate and billing increment to see the billable time and the detention charge.';

export const metadata: Metadata = {
  title: 'Detention Fee Calculator for Truck Drivers and Carriers',
  description: DESCRIPTION,
  alternates: { canonical: toolUrl(SLUG) },
  openGraph: { title: `${NAME} | Loadly`, description: DESCRIPTION, url: toolUrl(SLUG) },
};

// The worked example below is computed with the same function the calculator uses.
const example = detentionFee({
  hoursOnSite: 4, minutesOnSite: 20, freeHours: 2, ratePerHour: 50, incrementMinutes: 15, cap: NaN,
})!;

const sections: ToolSection[] = [
  {
    title: 'What detention is',
    paragraphs: [
      'Detention is an extra charge that applies when a truck is kept waiting at a pickup or delivery beyond an agreed free period. It pays for the driver’s and the truck’s time, which would otherwise be earning money on another load.',
      'There is no universal rate or free time. They are set in your rate confirmation, contract or the shipper’s and receiver’s terms, so the numbers you enter here should come from those documents.',
    ],
  },
  {
    title: 'How the charge is worked out',
    paragraphs: [
      'Billable time = time on site − free time, rounded up to the billing increment. Detention charge = billable hours × hourly rate, limited to a maximum if your terms set one.',
      `Worked example: a driver spends 4 hours 20 minutes on site. The free time is 2 hours, so ${example.minutesOverFree} minutes are beyond it. With 15-minute billing increments that rounds up to ${example.billableMinutes} minutes (2.5 hours). At $50 per hour the charge is $${fmt(example.fee)}.`,
    ],
  },
  {
    title: 'Getting detention paid',
    bullets: [
      'Read the free time and the rate before you accept the load, and ask for them in writing if they are missing.',
      'Record arrival and departure times: gate or check-in logs, an ELD record, receiver signatures and timestamped messages all help.',
      'Tell the broker or shipper as soon as you are being held. Many agreements require notice while you wait or within a set window.',
      'Send the invoice with the proof attached, and follow the payment deadline in your contract.',
      'Check when the clock starts. Many agreements count from the appointment time or the actual arrival, whichever is later, but yours may differ.',
    ],
  },
  {
    title: 'Detention, layover and other waiting charges',
    paragraphs: [
      'These terms are related but not the same. Detention is waiting during the working day at a stop. Layover normally means waiting overnight or for a day because the load is not ready. A truck ordered not used (TONU) fee is paid when a booked truck is cancelled. Each has its own terms, so check how your contract defines them.',
      'In container shipping, detention and demurrage refer to charges for keeping a container or equipment beyond free days. That is a different system, and this calculator is meant for hourly truck waiting time.',
    ],
  },
  {
    title: 'Waiting time and hours of service',
    paragraphs: [
      'Time spent waiting at a facility can affect a driver’s hours-of-service clock. The FMCSA rules explain how on-duty and off-duty time are counted, and they are worth checking before you plan the rest of a driver’s day.',
    ],
  },
];

const faq: ToolFaq[] = [
  {
    q: 'How much is a typical detention rate?',
    a: 'It varies by contract, lane, equipment and customer, so we do not give a typical figure. Use the rate written in your rate confirmation or agreement.',
  },
  {
    q: 'What is a billing increment?',
    a: 'It is the block of time the charge is counted in. With a 15-minute increment, 1 minute over is billed as 15 minutes. With a 1-hour increment, 1 minute over is billed as a full hour.',
  },
  {
    q: 'What is free time?',
    a: 'Free time is the period the shipper or receiver may keep the truck without paying detention. It is set in the agreement, and detention starts only after it has passed.',
  },
  {
    q: 'What if my contract has a maximum detention charge?',
    a: 'Enter it in the optional maximum charge field. If the calculated amount is higher, the calculator shows the maximum instead.',
  },
  {
    q: 'Do the pre-filled numbers mean anything?',
    a: 'No. They are only an example so you can see how the result is laid out. Replace them with the terms in your own agreement.',
  },
];

const sources: ToolLink[] = [
  { label: 'FMCSA — Hours of Service rules', href: 'https://www.fmcsa.dot.gov/regulations/hours-of-service' },
  { label: 'FMCSA — Regulations and guidance', href: 'https://www.fmcsa.dot.gov/regulations' },
];

const related: ToolLink[] = [
  { label: 'Fuel Cost Calculator', href: '/en/tools/fuel-cost-calculator', description: 'Estimate the fuel cost of a trip.' },
  { label: 'Dimensional Weight Calculator', href: '/en/tools/dimensional-weight-calculator', description: 'Find the chargeable weight of a shipment.' },
];

export default function Page() {
  const jsonLd = toolJsonLd({ slug: SLUG, name: NAME, description: DESCRIPTION, faq });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolShell
        title={NAME}
        intro="Work out what a delay at a pickup or delivery should cost. Enter the time on site, the free time and the rate from your agreement, and see the billable time and the detention charge."
        sections={sections}
        faq={faq}
        sources={sources}
        related={related}
      >
        <DetentionFeeCalculator />
      </ToolShell>
    </>
  );
}

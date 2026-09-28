'use client';

import { useT } from '@/hooks/useT';
import { Megaphone, Mail, CheckCircle, Target, TrendingUp } from 'lucide-react';

const CONTACT_EMAIL = 'info@loadlyapp.com';

export function AdPageClient() {
  const t = useT();

  const options = [
    {
      icon: Target,
      title: 'Display Advertising',
      desc: 'Ad placements alongside our freight and logistics guides, shown to readers who are researching the industry.',
    },
    {
      icon: TrendingUp,
      title: 'Sponsored Content',
      desc: 'A clearly labelled sponsored article or brand mention. Sponsored content is always marked as such and goes through the same editorial review as our other articles.',
    },
  ];

  const audiences = [
    { title: 'Freight and Logistics Companies', desc: 'Put your services in front of readers researching shipping costs, routes and regulations.' },
    { title: 'Vehicle and Equipment Suppliers', desc: 'Reach readers interested in trucking and logistics equipment.' },
    { title: 'Insurance and Finance Providers', desc: 'Present cargo insurance and trade-finance products to industry readers.' },
    { title: 'Software and Technology Companies', desc: 'Introduce logistics software and technology to the people who use it.' },
  ];

  return (
    <div className={t.pageFull}>
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold ${t.heading} flex items-center justify-center gap-4 mb-4`}>
            <Megaphone size={40} className="text-[#A66700]" />
            Advertise on Loadly
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            Loadly publishes practical guides on freight costs, routes and regulations for shippers, carriers and
            logistics professionals. If your business serves that audience, we would be glad to hear from you.
          </p>
        </div>

        {/* Options */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-8`}>Advertising Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {options.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className={`p-6 rounded-2xl ${t.card} flex flex-col`}>
                <div className="w-12 h-12 rounded-xl bg-[#A66700]/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-[#A66700]" />
                </div>
                <h3 className={`text-lg font-bold ${t.heading} mb-2`}>{title}</h3>
                <p className={`text-sm ${t.muted} leading-relaxed`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Standards */}
        <div className={`p-8 rounded-3xl ${t.card} mb-12`}>
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>Our Advertising Standards</h2>
          <div className="space-y-3">
            {[
              'Advertising is kept separate from editorial content and clearly identifiable as advertising.',
              'Advertisers cannot influence, pay for or edit our articles.',
              'We only accept advertising relevant to logistics, freight and related services.',
              'We reserve the right to decline any advertiser or creative.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span className={`text-sm ${t.muted}`}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who Should Advertise */}
        <div className={`p-8 rounded-3xl ${t.card} mb-12`}>
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>Who Can Advertise?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {audiences.map(({ title, desc }, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark">
                <h3 className={`text-sm font-bold ${t.heading} mb-1`}>{title}</h3>
                <p className={`text-xs ${t.muted}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-[#A66700]/10 border border-[#A66700]/20 text-center">
          <h2 className={`text-2xl font-bold ${t.heading} mb-3`}>Get in Touch</h2>
          <p className={`text-sm ${t.muted} mb-6 max-w-lg mx-auto leading-relaxed`}>
            Email us with a short description of your business and what you would like to promote,
            and we will get back to you.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Loadly advertising enquiry`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#A66700] text-white font-bold rounded-2xl hover:bg-orange-500 transition-colors shadow-lg shadow-[#A66700]/20"
          >
            <Mail size={20} />
            {CONTACT_EMAIL}
          </a>
        </div>

      </div>
    </div>
  );
}

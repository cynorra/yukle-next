'use client';

import { useT } from '@/hooks/useT';
import { Mail, MapPin, Phone, MessageSquare, Clock, HelpCircle } from 'lucide-react';

interface ContactData {
  contact: {
    title: string;
    description: string;
    getInTouch: string;
    emailTitle: string;
    emailDesc: string;
    phoneTitle: string;
    phoneDesc: string;
    phoneNotAvailable: string;
    addressTitle: string;
    addressDesc: string;
    quickSupport: string;
    quickSupportDesc: string;
    advCollab: string;
  };
}

interface Props {
  data: ContactData;
  locale: string;
}

const FAQ_LABELS: Record<string, { faqTitle: string; items: { q: string; a: string }[] }> = {
  tr: {
    faqTitle: 'Sıkça Sorulan Sorular',
    items: [
      { q: 'Loadly ücretsiz mi?', a: 'Evet! Yük ilanı oluşturmak ve platforma kayıt olmak tamamen ücretsizdir.' },
      { q: 'Destek süreniz ne kadar?', a: 'E-posta taleplerinize en geç 24 saat içinde yanıt veriyoruz.' },
      { q: 'Hangi ülkelerde hizmet veriyorsunuz?', a: '50\'den fazla ülkede aktif kullanıcılarımız bulunmakta olup küresel erişimimizi sürekli genişletiyoruz.' },
    ],
  },
  en: {
    faqTitle: 'Frequently Asked Questions',
    items: [
      { q: 'Is Loadly free to use?', a: 'Yes! Creating load listings and registering on the platform is completely free.' },
      { q: 'How fast do you respond to support requests?', a: 'We respond to email inquiries within 24 hours at the latest.' },
      { q: 'Which countries do you serve?', a: 'We have active users in over 50 countries and are continuously expanding our global reach.' },
    ],
  },
};

export function ContactPageClient({ data, locale }: Props) {
  const t = useT();
  const content = data.contact;
  const faq = FAQ_LABELS[locale] ?? FAQ_LABELS.en;

  return (
    <div className={t.pageFull}>
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold ${t.heading} flex items-center justify-center gap-4 mb-4`}>
            <MessageSquare size={40} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>{content.getInTouch}</h2>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Mail size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>{content.emailTitle}</h3>
                <p className={`text-sm ${t.muted} mb-2`}>{content.emailDesc}</p>
                <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline font-medium">
                  info@loadlyapp.com
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Clock size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>{content.phoneTitle}</h3>
                <p className={`text-sm ${t.muted} mb-1`}>{content.phoneDesc}</p>
                <span className="text-muted font-medium text-sm">{content.phoneNotAvailable}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <MapPin size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>{content.addressTitle}</h3>
                <p className={`text-sm ${t.muted}`}>{content.addressDesc}</p>
              </div>
            </div>
          </div>

          {/* Quick Support + Advertising */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark flex flex-col justify-center">
              <h2 className={`text-2xl font-bold ${t.heading} mb-4`}>{content.quickSupport}</h2>
              <p className={`text-base ${t.muted} leading-relaxed mb-6`}>
                {content.quickSupportDesc}
              </p>
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-sm text-orange-400 font-medium">
                  {content.advCollab}{' '}
                  <a href="mailto:reklam@loadlyapp.com" className="hover:underline ml-1 text-[#F5A623]">
                    reklam@loadlyapp.com
                  </a>
                </p>
              </div>
            </div>

            {/* Contact Form (mailto) */}
            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <h3 className={`text-lg font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                <Phone size={20} className="text-[#F5A623]" />
                {content.emailTitle}
              </h3>
              <a
                href="mailto:info@loadlyapp.com?subject=Loadly Support Request"
                className="block w-full text-center py-3 px-6 bg-[#F5A623] text-white font-bold rounded-xl hover:bg-orange-500 transition-colors"
              >
                info@loadlyapp.com
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${t.heading} mb-6 flex items-center gap-3`}>
            <HelpCircle size={28} className="text-[#F5A623]" />
            {faq.faqTitle}
          </h2>
          <div className="space-y-4">
            {faq.items.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <h3 className={`text-base font-bold ${t.heading} mb-2`}>{item.q}</h3>
                <p className={`text-sm ${t.muted} leading-relaxed`}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

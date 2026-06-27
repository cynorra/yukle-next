'use client';

import { useT } from '@/hooks/useT';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/utils/translations';

export function ContactPageClient() {
  const t = useT();
  const params = useParams();
  const locale = (params.locale as Locale) || 'tr';
  const isTr = locale === 'tr';

  return (
    <div className={t.pageFull}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold ${t.heading} flex items-center justify-center gap-4 mb-4`}>
            <MessageSquare size={40} className="text-[#F5A623]" />
            {isTr ? 'İletişim' : 'Contact Us'}
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            {isTr 
              ? 'Soru, görüş veya önerileriniz için bizimle her zaman iletişime geçebilirsiniz. Ekibimiz size en kısa sürede dönüş yapacaktır.' 
              : 'You can always contact us for your questions, comments, or suggestions. Our team will get back to you as soon as possible.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>{isTr ? 'Bize Ulaşın' : 'Get in Touch'}</h2>
            
            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Mail size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>E-posta</h3>
                <p className={`text-sm ${t.muted} mb-2`}>{isTr ? 'Genel sorularınız ve destek için.' : 'For general inquiries and support.'}</p>
                <a href="mailto:info@loadlyapp.com" className="text-[#F5A623] hover:underline font-medium">info@loadlyapp.com</a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <Phone size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>{isTr ? 'Telefon' : 'Phone'}</h3>
                <p className={`text-sm ${t.muted} mb-2`}>{isTr ? 'Sadece iş saatleri içerisinde (Pzt-Cuma, 09:00 - 18:00).' : 'Business hours only (Mon-Fri, 09:00 - 18:00).'}</p>
                <span className="text-muted font-medium">Müsait değil / Not available yet</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0">
                <MapPin size={24} className="text-[#F5A623]" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${t.heading} mb-1`}>{isTr ? 'Adres' : 'Address'}</h3>
                <p className={`text-sm ${t.muted}`}>
                  Türkiye / Turkey
                </p>
              </div>
            </div>
          </div>

          {/* Form placeholder or general info */}
          <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col justify-center">
            <h2 className={`text-2xl font-bold ${t.heading} mb-4`}>{isTr ? 'Hızlı Destek' : 'Quick Support'}</h2>
            <p className={`text-base ${t.muted} leading-relaxed mb-6`}>
              {isTr 
                ? 'Reklam fırsatları, işbirlikleri veya hesap yönetimi ile ilgili acil destek ihtiyaçlarınız için e-posta kanalımızı kullanmanızı öneririz. En geç 24 saat içinde dönüş sağlanmaktadır.' 
                : 'We recommend using our email channel for your urgent support needs regarding advertising opportunities, collaborations, or account management. We return within 24 hours at the latest.'}
            </p>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-sm text-orange-400 font-medium">
                {isTr ? 'Reklam & İşbirliği:' : 'Advertising & Collaboration:'} <br className="md:hidden" />
                <a href="mailto:reklam@loadlyapp.com" className="hover:underline ml-1 text-[#F5A623]">reklam@loadlyapp.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

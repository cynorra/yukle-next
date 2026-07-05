'use client';

import { useT } from '@/hooks/useT';
import {
  Info, Truck, Shield, Globe, CheckCircle,
  Users, Package, Star, Leaf,
} from 'lucide-react';

interface AboutData {
  about: {
    title: string;
    description: string;
    fastEasyTitle: string;
    fastEasyDesc: string;
    reliableTitle: string;
    reliableDesc: string;
    wideTitle: string;
    wideDesc: string;
    visionTitle: string;
    visionP1: string;
    visionP2: string;
  };
}

interface Props {
  data: AboutData;
  locale: string;
}

const EXTRA: Record<string, {
  statsTitle: string;
  stats: { value: string; label: string }[];
  missionTitle: string;
  missionText: string;
  whyTitle: string;
  whyItems: string[];
  commitTitle: string;
  commitText: string;
  howTitle: string;
  howSteps: { title: string; desc: string }[];
}> = {
  tr: {
    statsTitle: 'Loadly İstatistikleri',
    stats: [
      { value: '5.000+', label: 'Kayıtlı Kullanıcı' },
      { value: '50+', label: 'Ülke' },
      { value: '10.000+', label: 'Yayınlanan İlan' },
      { value: '4.8/5', label: 'Kullanıcı Puanı' },
    ],
    missionTitle: 'Misyonumuz',
    missionText:
      'Lojistik sektörünü dijital dönüşümle kolaylaştırmak ve nakliyecilerle yük sahiplerini en etkin şekilde buluşturmaktır. Platformumuz, geleneksel nakliye brokerlığının getirdiği yüksek komisyon ve zaman kaybını ortadan kaldırmayı hedeflemektedir. Teknoloji ve verinin gücünü kullanarak her yük, en uygun taşıyıcıyla hızla eşleştirilmektedir. Küçük işletmelerden büyük şirketlere kadar her ölçekteki nakliye ihtiyacını karşılamak için 7/24 aktif olan dijital bir pazar yeri sunuyoruz.',
    whyTitle: "Neden Loadly'yi Seçmelisiniz?",
    whyItems: [
      'Ücretsiz ilan yayınlama – ekstra maliyet yok',
      'Doğrulanmış nakliye firmaları ile çalışma güvencesi',
      'Gerçek zamanlı teklif alma ve mesajlaşma sistemi',
      'Parsiyel (LTL) ve komple (FTL) taşıma seçenekleri',
      'Şehiriçi, şehirlerarası ve uluslararası nakliye ilanları',
      'GDPR/KVKK uyumlu veri güvenliği ve şifreleme',
      'Mobil uyumlu arayüz, her cihazdan erişim',
    ],
    commitTitle: 'Sürdürülebilirlik Taahhüdümüz',
    commitText:
      'Boş araç seferlerini azaltarak her taşımada karbon ayak izini minimize etmeyi hedefliyoruz. Akıllı eşleştirme algoritmalarımız, hem nakliyecilere maliyet tasarrufu hem de çevreye katkı sağlar. Loadly, lojistik sektöründe yeşil ve verimli bir geleceğe inanmaktadır. Her başarılı eşleştirme, hem tasarruf hem de daha temiz bir gezegen anlamına gelir.',
    howTitle: 'Nasıl Çalışır?',
    howSteps: [
      { title: 'İlan Oluşturun', desc: 'Yük bilgilerinizi, alış ve teslim noktalarını girin. Birkaç dakikada ilan aktif olur.' },
      { title: 'Teklifleri Karşılaştırın', desc: 'Onaylı nakliyecilerden gelen teklifleri gerçek zamanlı alın, mesajlaşın ve en uygununu seçin.' },
      { title: 'Güvenle Taşıyın', desc: 'Anlaşmayı onaylayın, takip edin ve yükünüz güvenle teslim edilsin.' },
    ],
  },
  en: {
    statsTitle: 'Loadly by the Numbers',
    stats: [
      { value: '5,000+', label: 'Registered Users' },
      { value: '50+', label: 'Countries Covered' },
      { value: '10,000+', label: 'Loads Posted' },
      { value: '4.8/5', label: 'User Rating' },
    ],
    missionTitle: 'Our Mission',
    missionText:
      'To simplify the logistics industry through digital transformation and connect carriers and shippers in the most efficient way possible. Our platform aims to eliminate the high commissions and time delays that come with traditional freight brokerage. By harnessing the power of technology and data, every load is rapidly matched with the most suitable carrier. We provide a digital marketplace that operates 24/7 to meet the shipping needs of businesses of all sizes — from small enterprises to large corporations.',
    whyTitle: 'Why Choose Loadly?',
    whyItems: [
      'Free load posting — no extra costs or hidden fees',
      'Work with verified and rated shipping companies',
      'Real-time bidding and in-platform messaging',
      'Less Than Truckload (LTL) and Full Truckload (FTL) options',
      'Local, interstate and international freight listings',
      'GDPR/KVKK compliant data security and encryption',
      'Mobile-friendly interface, access from any device',
    ],
    commitTitle: 'Our Sustainability Commitment',
    commitText:
      'We aim to minimize the carbon footprint of each shipment by reducing empty truck runs. Our smart matching algorithms provide cost savings for shippers while benefiting the environment. Loadly believes in a green and efficient future for the logistics industry. Every successful match means both savings for businesses and a cleaner planet for everyone.',
    howTitle: 'How It Works',
    howSteps: [
      { title: 'Post Your Load', desc: 'Enter your cargo details, pickup and delivery locations. Your listing goes live within minutes.' },
      { title: 'Compare Offers', desc: 'Receive real-time quotes from verified carriers, message them directly, and choose the best fit.' },
      { title: 'Ship Safely', desc: 'Confirm your agreement, track progress, and your cargo is delivered safely to its destination.' },
    ],
  },
};

export function AboutPageClient({ data, locale }: Props) {
  const t = useT();
  const content = data.about;
  const extra = EXTRA[locale] ?? EXTRA.en;

  return (
    <div className={t.pageFull}>
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold ${t.heading} flex items-center justify-center gap-4 mb-4`}>
            <Info size={40} className="text-[#F5A623]" />
            {content.title}
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            {content.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { ...extra.stats[0], Icon: Users },
            { ...extra.stats[1], Icon: Globe },
            { ...extra.stats[2], Icon: Package },
            { ...extra.stats[3], Icon: Star },
          ].map(({ value, label, Icon }, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-center">
              <Icon size={24} className="text-[#F5A623] mx-auto mb-2" />
              <div className="text-2xl font-black text-fg">{value}</div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { Icon: Truck, title: content.fastEasyTitle, desc: content.fastEasyDesc },
            { Icon: Shield, title: content.reliableTitle, desc: content.reliableDesc },
            { Icon: Globe, title: content.wideTitle, desc: content.wideDesc },
          ].map(({ Icon, title, desc }, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
                <Icon size={32} className="text-[#F5A623]" />
              </div>
              <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{title}</h3>
              <p className={`text-sm ${t.muted}`}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-4`}>{extra.missionTitle}</h2>
          <p className={`text-base ${t.muted} leading-relaxed`}>{extra.missionText}</p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-8`}>{extra.howTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {extra.howSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 flex items-center justify-center mb-4 text-[#F5A623] font-black text-lg">
                  {idx + 1}
                </div>
                <h3 className={`text-lg font-bold ${t.heading} mb-2`}>{step.title}</h3>
                <p className={`text-sm ${t.muted} leading-relaxed`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>{content.visionTitle}</h2>
          <div className="space-y-4">
            <p className={`text-base ${t.muted} leading-relaxed`}>{content.visionP1}</p>
            <p className={`text-base ${t.muted} leading-relaxed`}>{content.visionP2}</p>
          </div>
        </div>

        {/* Why Choose */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>{extra.whyTitle}</h2>
          <ul className="space-y-3">
            {extra.whyItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
                <span className={`${t.muted} text-base`}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sustainability */}
        <div className="p-8 rounded-3xl bg-green-500/5 border border-green-500/20">
          <h2 className={`text-2xl font-bold ${t.heading} mb-4 flex items-center gap-3`}>
            <Leaf size={28} className="text-green-500" />
            {extra.commitTitle}
          </h2>
          <p className={`text-base ${t.muted} leading-relaxed`}>{extra.commitText}</p>
        </div>

      </div>
    </div>
  );
}

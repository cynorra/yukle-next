'use client';

import { useT } from '@/hooks/useT';
import { Info, Users, Leaf } from 'lucide-react';

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
  teamTitle: string;
  teamName: string;
  teamRole: string;
  teamBio: string;
  teamLinkedInLabel: string;
  whyTitle: string;
  whyItems: string[];
  commitTitle: string;
  commitText: string;
  howTitle: string;
  howSteps: { title: string; desc: string }[];
}> = {
  tr: {
    statsTitle: 'Loadly Neler Sunuyor',
    stats: [
      { value: '54', label: 'Desteklenen Dil' },
      { value: 'Günlük', label: 'Güncel İçerik' },
      { value: 'Ücretsiz', label: 'Sınırsız Okuma' },
      { value: 'Kurucu Liderliğinde', label: 'Şeffaf Ekip' },
    ],
    missionTitle: 'Misyonumuz',
    missionText:
      'Lojistik sektörüne dair güvenilir, güncel ve pratik bilgiyi 54 dilde herkese ulaştırmaktır. Nakliye maliyetleri, güzergah rehberleri ve mevzuat değişiklikleri üzerine düzenli yayınladığımız içeriklerle sektör profesyonellerine ve işletmelere karar alma süreçlerinde yardımcı oluyoruz.',
    teamTitle: 'Kimler Yapıyor',
    teamName: 'Eren Şimşir',
    teamRole: 'Baş Teknik Editör',
    teamBio: 'Bilgisayar Mühendisliği ve Endüstri Mühendisliği (Çift Anadal) mezunu, Yapay Zeka alanında doktora adayı. Loadly\'nin teknik geliştirmesinden ve içerik kalitesinden sorumlu.',
    teamLinkedInLabel: "LinkedIn'de görüntüle",
    whyTitle: "Neden Loadly'yi Takip Etmelisiniz?",
    whyItems: [
      '54 dilde, düzenli yayınlanan uzman içerikler',
      'Araştırılmış, doğruluğu kontrol edilmiş makaleler',
      'Nakliye maliyetleri, güzergah ve mevzuat rehberleri',
      'Güncel sektör trendleri ve analizleri',
      'Tamamen ücretsiz, kayıt gerektirmeyen erişim',
      'Mobil uyumlu arayüz, her cihazdan kolay okuma',
      'Düzenli güncellenen, güvenilir bilgi kaynağı',
    ],
    commitTitle: 'Editoryal Kalite Taahhüdümüz',
    commitText:
      'Her makalenin doğru, güncel ve pratik olmasını sağlamak için titizlikle çalışıyoruz. İçeriklerimiz yayınlanmadan önce araştırılır ve gözden geçirilir. Loadly, lojistik sektöründe güvenilir bir bilgi kaynağı olmaya inanıyor — okuyucularımızın doğru bilgiyle daha iyi kararlar almasına yardımcı oluyoruz.',
    howTitle: 'Nasıl Kullanılır?',
    howSteps: [
      { title: 'Bir Konu Arayın', desc: 'İşinizle ilgili nakliye maliyetleri, güzergahlar veya mevzuat konularını arayın.' },
      { title: 'Rehberi Okuyun', desc: 'Araştırılmış, editörden geçmiş makaleyi kendi dilinizde okuyun.' },
      { title: 'Bilinçli Kararlar Alın', desc: 'Öğrendiklerinizi işinizde daha iyi kararlar almak için kullanın.' },
    ],
  },
  en: {
    statsTitle: 'What Loadly Offers',
    stats: [
      { value: 'English', label: 'Publication Language' },
      { value: 'Daily', label: 'Fresh Content' },
      { value: 'Free', label: 'Unlimited Reading' },
      { value: 'Founder-Led', label: 'Transparent Team' },
    ],
    missionTitle: 'Our Mission',
    missionText:
      'To make reliable, up-to-date, and practical logistics knowledge available to everyone. Through regularly published content on freight costs, route guides, and regulatory changes, we help industry professionals and businesses make better decisions.',
    teamTitle: 'Who Builds Loadly',
    teamName: 'Eren Şimşir',
    teamRole: 'Chief Technical Editor',
    teamBio: 'Computer Engineer & Industrial Engineer (Double Major), PhD Candidate in AI. Responsible for Loadly\'s technical development and content quality.',
    teamLinkedInLabel: 'View on LinkedIn',
    whyTitle: 'Why Follow Loadly?',
    whyItems: [
      'New guides published regularly',
      'Articles held to written editorial rules and automated quality checks',
      'Freight cost, route, and regulation guides',
      'Up-to-date industry trends and analysis',
      'Completely free, no registration required',
      'Mobile-friendly interface, read on any device',
      'Regularly updated, trustworthy source of information',
    ],
    commitTitle: 'Our Editorial Commitment',
    commitText:
      'We aim for every article to be accurate, current, and practical, and every article is published under written editorial rules and automated quality checks (see our Editorial Policy). Loadly believes in being a trustworthy source of information for the logistics industry — helping our readers make better decisions with the right information.',
    howTitle: 'How to Use Loadly',
    howSteps: [
      { title: 'Search a Topic', desc: 'Look up freight costs, routes, or regulations relevant to your business.' },
      { title: 'Read the Guide', desc: 'Read the full article. It is free and needs no registration.' },
      { title: 'Make Informed Decisions', desc: 'Use what you learn to make better decisions in your business.' },
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
            <Info size={40} className="text-[#A66700]" />
            {content.title}
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            {content.description}
          </p>
        </div>

        {/* Mission */}
        <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-4`}>{extra.missionTitle}</h2>
          <p className={`text-base ${t.muted} leading-relaxed`}>{extra.missionText}</p>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>{extra.teamTitle}</h2>
          <a
            href="https://www.linkedin.com/in/ernsmsr/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/40 transition-colors group"
          >
            <div className="w-16 h-16 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
              <Users size={28} />
            </div>
            <div>
              <div className={`text-lg font-bold ${t.heading} group-hover:text-accent transition-colors`}>{extra.teamName}</div>
              <div className="text-sm text-accent font-semibold mb-2">{extra.teamRole}</div>
              <p className={`text-sm ${t.muted} leading-relaxed`}>{extra.teamBio}</p>
              <span className="inline-block mt-2 text-xs font-bold text-accent">{extra.teamLinkedInLabel} →</span>
            </div>
          </a>
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

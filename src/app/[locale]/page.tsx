import Link from 'next/link';
import { SeoContent } from '@/components/SeoContent';
import Logo from '@/components/Logo';
import {
  ArrowRight,
  Truck,
  Package,
  Shield,
  MapPin,
  Star,
  Zap,
  TrendingUp,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { HomeAnimations } from './_home/HomeAnimations';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';
import { TextGif } from '@/components/ui/text-gif';
import { TextureCard } from '@/components/ui/texture-card';
import { TextureButton } from '@/components/ui/texture-button';
import { Link000 } from '@/components/ui/skiper-ui/skiper40';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const HOME_FAQS: Record<string, { title: string; items: { q: string; a: string }[] }> = {
  tr: {
    title: 'Sıkça Sorulan Sorular',
    items: [
      { q: 'Loadly nedir?', a: 'Loadly, nakliyeciler ve yük sahiplerini dijital ortamda buluşturan küresel bir lojistik pazar yeridir. Yük sahipleri ilan oluşturur, nakliyeciler teklif verir ve taşıma süreci platform üzerinden yönetilir.' },
      { q: 'Loadly ücretsiz mi?', a: 'Evet, platforma kayıt olmak ve yük ilanı oluşturmak tamamen ücretsizdir. Herhangi bir komisyon veya üyelik ücreti alınmamaktadır.' },
      { q: 'Nasıl yük ilanı oluştururum?', a: 'Üye olun, yük bilgilerinizi (ağırlık, boyut, alış/teslim noktası, tarih) girin ve ilanınız saniyeler içinde nakliyecilere görünür hale gelir.' },
      { q: 'Nakliyeci olarak nasıl yük bulurum?', a: 'Pazaryerini günlük güncel ilanlar için takip edin. Güzergah, araç türü ve tonaj filtrelerini kullanarak size uygun yükleri kolayca bulun ve yük sahipleriyle mesajlaşın.' },
      { q: 'Hangi yük türlerini taşıyabilirim?', a: 'Platform; parsiyel taşıma (LTL), komple tır yükü (FTL), acil / ekspres nakliye, soğuk zincir (frigo), açık kasa ve özel yük ilanlarını destekler.' },
      { q: 'Nakliyeciler nasıl doğrulanır?', a: 'Nakliyeciler profil tamamlama, kimlik doğrulaması ve kullanıcı derecelendirme sistemiyle değerlendirilir. Yüksek puanlı nakliyeciler öne çıkar.' },
      { q: 'Yüklerim güvende mi?', a: 'Loadly bir ilan ve eşleştirme platformudur. Sigorta ve sözleşme detayları doğrudan nakliyeci ile yük sahibi arasında belirlenir. Platform, güvenilir nakliyecilerle çalışmanızı kolaylaştırmak için derecelendirme sistemi sunar.' },
      { q: 'Hangi ülkelerde hizmet veriyorsunuz?', a: '50\'den fazla ülkede aktif kullanıcıya sahibiz. Türkiye başta olmak üzere Avrupa, Orta Doğu ve Asya\'daki lojistik hareketleri için ilanlar yayınlanmaktadır.' },
      { q: 'Destek için nasıl iletişime geçebilirim?', a: 'info@loadlyapp.com adresine e-posta göndererek bizimle iletişime geçebilirsiniz. En geç 24 saat içinde size geri dönüş yapıyoruz.' },
      { q: 'Mobil cihazdan kullanabilir miyim?', a: 'Evet! Loadly tamamen mobil uyumlu bir web uygulamasıdır. Telefon, tablet veya bilgisayarınızdan kolaylıkla kullanabilirsiniz.' },
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'What is Loadly?', a: 'Loadly is a global logistics marketplace that digitally connects shippers and freight owners. Shippers post loads, carriers submit offers, and the entire shipping process is managed through the platform.' },
      { q: 'Is Loadly free to use?', a: 'Yes, registering on the platform and posting loads is completely free. There are no commissions or membership fees charged.' },
      { q: 'How do I post a load?', a: 'Register, enter your cargo details (weight, dimensions, pickup/delivery location, date) and your listing becomes visible to carriers within seconds.' },
      { q: 'How do I find loads as a carrier?', a: 'Browse the marketplace for daily updated listings. Use route, vehicle type, and tonnage filters to easily find loads that suit you and message shippers directly.' },
      { q: 'What types of freight can I post?', a: 'The platform supports Less Than Truckload (LTL), Full Truckload (FTL), urgent/express freight, refrigerated (reefer), flatbed, and special cargo listings.' },
      { q: 'How are carriers verified?', a: 'Carriers are evaluated through profile completion, identity verification, and a user rating system. Higher-rated carriers are featured more prominently.' },
      { q: 'Is my cargo safe?', a: 'Loadly is a listing and matching platform. Insurance and contract details are arranged directly between the carrier and shipper. The platform offers a rating system to help you work with trusted carriers.' },
      { q: 'Which countries do you serve?', a: 'We have active users in over 50 countries. Listings are published for logistics movements primarily in Turkey, Europe, the Middle East, and Asia.' },
      { q: 'How do I contact support?', a: 'You can reach us by sending an email to info@loadlyapp.com. We respond within 24 hours at the latest.' },
      { q: 'Can I use it on mobile?', a: 'Yes! Loadly is a fully mobile-responsive web application. You can easily use it on your phone, tablet, or computer.' },
    ],
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = TRANSLATIONS[locale];

  const steps = [
    {
      icon: Package,
      title: t.home.step1Title,
      desc: t.home.step1Desc,
      step: '01',
    },
    {
      icon: TrendingUp,
      title: t.home.step2Title,
      desc: t.home.step2Desc,
      step: '02',
    },
    {
      icon: Shield,
      title: t.home.step3Title,
      desc: t.home.step3Desc,
      step: '03',
    },
  ];

  const faqData = HOME_FAQS[locale] ?? HOME_FAQS.en;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
    <div className="min-h-screen bg-background-light dark:bg-background-dark selection:bg-accent/30">
      {/* Hero */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20 dark:opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent mix-blend-multiply blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-500 mix-blend-multiply blur-[120px] opacity-30" />
        </div>

        <ScrollReveal>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-10">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                  <Zap size={14} /> {t.home.tagline}
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight text-fg">
                {t.home.heroTitle1}<br />
                <TextGif
                  text={t.home.heroTitle2}
                  gifUrl="https://media.giphy.com/media/3zvbrvbRe7wxBofOBI/giphy.gif"
                  size="xxl"
                  className="mt-2 block dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                />
              </h1>

              <p className="max-w-2xl text-lg sm:text-xl text-muted leading-relaxed font-medium">
                {t.home.heroDesc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <TextureButton asChild variant="accent" className="w-full sm:w-auto !rounded-2xl px-10 py-5 text-lg">
                  <Link href={`/${locale}/marketplace`}>
                    {t.home.exploreBtn}
                    <ArrowRight size={20} className="ml-2 inline-block transition-transform group-hover:translate-x-1" />
                  </Link>
                </TextureButton>
                <TextureButton asChild variant="secondary" className="w-full sm:w-auto !rounded-2xl px-10 py-5 text-lg">
                  <Link href={`/${locale}/register`}>
                    {t.home.registerBtn}
                  </Link>
                </TextureButton>
              </div>

              <div className="pt-12">
                <div className="flex items-center gap-4 text-sm font-medium text-muted/60">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-background-light dark:border-background-dark bg-surface-light dark:bg-surface-dark overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span>{t.home.activeUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 border-y border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-dark/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6">
            {[
              { value: t.home.stat1Val, label: t.home.stat1Label, icon: MapPin, color: 'text-blue-500' },
              { value: t.home.stat2Val, label: t.home.stat2Label, icon: Truck, color: 'text-green-500' },
              { value: t.home.stat3Val, label: t.home.stat3Label, icon: Star, color: 'text-yellow-500' },
            ].map((stat, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="flex flex-col items-center text-center group p-8 rounded-[2rem] bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black shadow-inner flex items-center justify-center mb-6 border border-border-light dark:border-border-dark group-hover:scale-110 transition-transform">
                    <stat.icon size={32} className={stat.color} />
                  </div>
                  <div className="text-4xl font-black text-fg mb-3">{stat.value}</div>
                  <div className="text-sm font-bold text-muted uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section className="py-32 px-4 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-fg tracking-tight">
              {t.home.howTitle}
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              {t.home.howSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-border-light dark:via-border-dark to-transparent" />

            {steps.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <div className="relative group h-full">
                  <div className="absolute -top-10 -left-4 text-8xl font-black text-fg opacity-[0.03] group-hover:opacity-[0.07] transition-opacity select-none z-0">
                    {item.step}
                  </div>
                  <div className="relative z-10 p-8 h-full rounded-[2rem] bg-surface-light/50 dark:bg-surface-dark/50 group-hover:bg-surface-light/90 dark:group-hover:bg-surface-dark/90 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-3 transition-all duration-300 border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-8 shadow-inner border border-accent/10 shrink-0">
                      <item.icon size={32} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-fg mb-4">{item.title}</h3>
                    <p className="text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto relative group">
            <div className="absolute inset-0 bg-accent rounded-[3rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative p-12 sm:p-20 rounded-[3rem] text-center space-y-8 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark shadow-2xl">
              <h2 className="text-3xl sm:text-5xl font-black text-fg leading-tight max-w-2xl mx-auto">
                {t.home.ctaTitle}
              </h2>
              <p className="text-muted text-lg max-w-xl mx-auto">
                {t.home.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href={`/${locale}/register`} className="w-full sm:w-auto">
                  <TextureButton variant="accent" className="w-full !rounded-2xl transition-transform hover:scale-105 active:scale-95 px-10 py-5 text-base sm:text-lg font-bold tracking-wide">
                    {t.home.ctaJoin}
                  </TextureButton>
                </Link>
                <Link href={`/${locale}/marketplace`} className="w-full sm:w-auto">
                  <TextureButton variant="secondary" className="w-full !rounded-2xl transition-transform hover:scale-105 active:scale-95 px-10 py-5 text-base sm:text-lg font-bold tracking-wide">
                    {t.home.ctaReview}
                  </TextureButton>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="py-20 px-4 border-t border-border-light dark:border-border-dark bg-surface-light/30 dark:bg-surface-dark/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo size="small" />
            <p className="text-sm text-muted font-medium">
              {t.home.footerCopyright}
            </p>
            <p className="text-xs text-muted/50 font-medium tracking-wider">loadlyapp.com</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-muted uppercase tracking-widest">
            <Link000 href={`/${locale}/about`} className="hover:text-accent transition-colors">
              {t.nav.about}
            </Link000>
            <Link000 href={`/${locale}/contact`} className="hover:text-accent transition-colors">
              {t.nav.contact}
            </Link000>
            <Link000 href={`/${locale}/privacy-policy`} className="hover:text-accent transition-colors">
              {t.nav.kvkk}
            </Link000>
            <Link000 href={`/${locale}/privacy`} className="hover:text-accent transition-colors">
              {t.nav.privacy}
            </Link000>
            <Link000 href={`/${locale}/terms`} className="hover:text-accent transition-colors">
              {t.nav.terms}
            </Link000>
            <Link000 href={`/${locale}/advertise`} className="hover:text-accent transition-colors">
              {t.nav.reklam}
            </Link000>
          </div>
        </div>
      </footer>

      {/* FAQ */}
      <section className="py-24 px-4 bg-surface-light/50 dark:bg-surface-dark/50 border-t border-border-light dark:border-border-dark">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
              <HelpCircle size={14} /> FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-fg tracking-tight">
              {faqData.title}
            </h2>
          </div>
          <div className="space-y-4">
            {faqData.items.map((item, idx) => (
              <div key={idx} className="p-6 rounded-[1.5rem] bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-fg mb-2">{item.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SeoContent page="home" locale={locale} />
      <HomeAnimations />
    </div>
    </>
  );
}

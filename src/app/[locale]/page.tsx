import Link from 'next/link';
import { SeoContent } from '@/components/SeoContent';
import Logo from '@/components/Logo';
import {
  Truck,
  Package,
  Shield,
  MapPin,
  Star,
  Zap,
  TrendingUp,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { HomeAnimations } from './_home/HomeAnimations';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';
import { TextureButton } from '@/components/ui/texture-button';
import { Link000 } from '@/components/ui/skiper-ui/skiper40';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import BlogCard from '@/components/blog/BlogCard';
import { createPublicClient } from '@/lib/supabase/public';
import type { BlogPost } from '@/types/database';

export const revalidate = 300;

const HOME_FAQS: Record<string, { title: string; items: { q: string; a: string }[] }> = {
  tr: {
    title: 'Sıkça Sorulan Sorular',
    items: [
      { q: 'Loadly nedir?', a: 'Loadly, lojistik ve nakliye sektörü için pratik rehberler, sektör analizleri ve haberler yayınlayan, 55 dilde erişilebilen bir içerik platformudur.' },
      { q: 'Loadly ücretsiz mi?', a: "Evet. Loadly'deki tüm makaleler ve rehberler tamamen ücretsizdir, kayıt veya abonelik gerektirmez." },
      { q: 'Loadly hangi konuları kapsıyor?', a: 'Nakliye maliyetleri, sevkiyat güzergahları, sektör mevzuatı, parsiyel (LTL) ve komple (FTL) lojistik ile daha geniş tedarik zinciri trendlerini kapsıyoruz.' },
      { q: 'Ne sıklıkla yeni içerik yayınlanıyor?', a: 'Yeni makaleler düzenli olarak yayınlanır ve nakliye ile lojistik sektöründeki en güncel gelişmeleri kapsar.' },
      { q: 'İçerikleri kim yazıyor?', a: 'Makaleler, yayınlanmadan önce araştırılır ve doğruluk için editörden geçirilir, güvenilir sektör kaynaklarına ve verilere dayanır.' },
      { q: 'Loadly hangi dillerde mevcut?', a: 'Loadly, 55 dilde içerik yayınlar; böylece rehberleri ve sektör haberlerini kendi dilinizde okuyabilirsiniz.' },
      { q: 'Hangi bölgeleri kapsıyorsunuz?', a: 'İçeriklerimiz başta Türkiye olmak üzere Avrupa, Orta Doğu ve dünya genelindeki lojistik trendlerini kapsar.' },
      { q: 'Bir konu önerebilir miyim?', a: 'Evet! Konu önerileriniz veya sorularınız için info@loadlyapp.com adresine e-posta gönderebilirsiniz — her mesajı okuyoruz.' },
      { q: 'Destek için nasıl iletişime geçebilirim?', a: 'info@loadlyapp.com adresine e-posta göndererek bizimle iletişime geçebilirsiniz. En geç 24 saat içinde size geri dönüş yapıyoruz.' },
      { q: "Loadly'yi mobil cihazdan kullanabilir miyim?", a: 'Evet! Loadly tamamen mobil uyumlu bir web sitesidir. Makaleleri telefon, tablet veya bilgisayarınızdan kolayca okuyabilirsiniz.' },
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'What is Loadly?', a: 'Loadly is a content platform publishing practical guides, industry analysis, and news for the logistics and freight sector, available in 55 languages.' },
      { q: 'Is Loadly free to use?', a: 'Yes. All articles and guides on Loadly are completely free to read, with no registration or subscription required.' },
      { q: 'What topics does Loadly cover?', a: 'We cover freight costs, shipping routes, industry regulations, LTL and FTL logistics, and broader supply chain trends.' },
      { q: 'How often is new content published?', a: 'New articles are published regularly, covering the latest developments across the freight and logistics industry.' },
      { q: 'Who writes the content?', a: 'Articles are researched and edited for accuracy before publishing, drawing on established industry sources and data.' },
      { q: 'Which languages is Loadly available in?', a: 'Loadly publishes content in 55 languages, so you can read guides and industry news in your own language.' },
      { q: 'Which regions do you cover?', a: 'Our content covers logistics and freight trends primarily in Turkey, Europe, the Middle East, and worldwide.' },
      { q: 'Can I suggest a topic?', a: 'Yes! Email us at info@loadlyapp.com with topic suggestions or questions — we read every message.' },
      { q: 'How do I contact support?', a: 'You can reach us by sending an email to info@loadlyapp.com. We respond within 24 hours at the latest.' },
      { q: 'Can I use Loadly on mobile?', a: 'Yes! Loadly is a fully mobile-responsive website. You can read articles easily on your phone, tablet, or computer.' },
    ],
  },
};

const LATEST_POSTS_COPY: Record<string, { title: string; subtitle: string; viewAll: string }> = {
  tr: {
    title: 'Son Yazılar',
    subtitle: 'Nakliye maliyetleri, güzergahlar ve sektör mevzuatı üzerine en güncel rehberlerimiz.',
    viewAll: 'Tüm Yazıları Gör',
  },
  en: {
    title: 'Latest Articles',
    subtitle: 'Our newest guides on freight costs, shipping routes, and industry regulations.',
    viewAll: 'View All Articles',
  },
};

const LATEST_POSTS_COLUMNS = 'id, title, slug, excerpt, cover_image, author_id, published, language, created_at, updated_at, author:profiles(full_name)';

// Homepage doubles as the site's editorial front page, so it needs real
// article previews, not just marketing copy — pulls the same columns as
// the /blog listing. Falls back to English when a locale's translation
// queue hasn't caught up yet, so the section is never empty.
async function fetchLatestPosts(locale: string): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('blog_posts')
    .select(LATEST_POSTS_COLUMNS)
    .eq('published', true)
    .eq('language', locale)
    .order('created_at', { ascending: false })
    .limit(6);

  if (data && data.length > 0) return data as unknown as BlogPost[];
  if (locale === 'en') return [];

  const { data: fallback } = await supabase
    .from('blog_posts')
    .select(LATEST_POSTS_COLUMNS)
    .eq('published', true)
    .eq('language', 'en')
    .order('created_at', { ascending: false })
    .limit(6);

  return (fallback as unknown as BlogPost[]) || [];
}

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
  const latestCopy = LATEST_POSTS_COPY[locale] ?? LATEST_POSTS_COPY.en;
  const latestPosts = await fetchLatestPosts(locale);

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
      <section className="relative pt-24 pb-16 px-4">
        <ScrollReveal>
          <div className="relative max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                <Zap size={14} /> {t.home.tagline}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.15] tracking-tight text-fg max-w-3xl">
                {t.home.heroTitle1} <span className="text-accent">{t.home.heroTitle2}</span>
              </h1>

              <p className="max-w-2xl text-lg sm:text-xl text-muted leading-relaxed">
                {t.home.heroDesc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
                <TextureButton asChild variant="accent" className="w-full sm:w-auto !rounded-2xl px-10 py-5 text-lg">
                  <Link href={`/${locale}/blog`}>
                    {t.home.registerBtn}
                  </Link>
                </TextureButton>
                <TextureButton asChild variant="secondary" className="w-full sm:w-auto !rounded-2xl px-10 py-5 text-lg">
                  <Link href={`/${locale}/about`}>
                    {t.nav.about}
                  </Link>
                </TextureButton>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Latest Articles — the site's actual content, front and center */}
      {latestPosts.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-6 border-b border-border-light dark:border-border-dark">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-fg tracking-tight mb-2">
                  {latestCopy.title}
                </h2>
                <p className="text-muted max-w-xl">{latestCopy.subtitle}</p>
              </div>
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-accent font-bold text-sm shrink-0 hover:gap-3 transition-all"
              >
                {latestCopy.viewAll} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.slice(0, 6).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats — a slim editorial byline row, not a marketing card grid */}
      <section className="py-10 border-y border-border-light dark:border-border-dark bg-surface-light/40 dark:bg-surface-dark/40">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {[
            { value: t.home.stat1Val, label: t.home.stat1Label, icon: MapPin, color: 'text-blue-500' },
            { value: t.home.stat2Val, label: t.home.stat2Label, icon: Truck, color: 'text-green-500' },
            { value: t.home.stat3Val, label: t.home.stat3Label, icon: Star, color: 'text-yellow-500' },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <stat.icon size={18} className={stat.color} />
              <span className="text-sm font-bold text-fg">{stat.value}</span>
              <span className="text-sm text-muted">{stat.label}</span>
            </div>
          ))}
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
                <Link href={`/${locale}/blog`} className="w-full sm:w-auto">
                  <TextureButton variant="accent" className="w-full !rounded-2xl transition-transform hover:scale-105 active:scale-95 px-10 py-5 text-base sm:text-lg font-bold tracking-wide">
                    {t.home.ctaJoin}
                  </TextureButton>
                </Link>
                <Link href={`/${locale}/contact`} className="w-full sm:w-auto">
                  <TextureButton variant="secondary" className="w-full !rounded-2xl transition-transform hover:scale-105 active:scale-95 px-10 py-5 text-base sm:text-lg font-bold tracking-wide">
                    {t.nav.contact}
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

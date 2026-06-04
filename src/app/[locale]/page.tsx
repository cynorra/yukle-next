import Link from 'next/link';
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
} from 'lucide-react';
import { HomeAnimations } from './_home/HomeAnimations';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';

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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark selection:bg-accent/30">
      {/* Hero */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20 dark:opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent mix-blend-multiply blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-500 mix-blend-multiply blur-[120px] opacity-30" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-10">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                <Zap size={14} /> {t.home.tagline}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight text-fg">
              {t.home.heroTitle1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-600 dark:to-orange-400">
                {t.home.heroTitle2}
              </span>
            </h1>

            <p className="max-w-2xl text-lg sm:text-xl text-muted leading-relaxed font-medium">
              {t.home.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href={`/${locale}/marketplace`}
                className="group w-full sm:w-auto px-10 py-5 bg-accent text-white font-bold text-lg rounded-2xl shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                {t.home.exploreBtn}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/register`}
                className="w-full sm:w-auto px-10 py-5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg font-bold text-lg rounded-2xl hover:bg-background-light dark:hover:bg-background-dark transition-all"
              >
                {t.home.registerBtn}
              </Link>
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
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-sm flex items-center justify-center mb-6 border border-border-light dark:border-border-dark group-hover:scale-110 transition-transform">
                  <stat.icon size={28} className={stat.color} />
                </div>
                <div className="text-4xl font-black text-fg mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-muted uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
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
              <div key={idx} className="relative group">
                <div className="absolute -top-10 -left-4 text-8xl font-black text-fg opacity-[0.03] group-hover:opacity-[0.07] transition-opacity select-none">
                  {item.step}
                </div>
                <div className="relative z-10 bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] border border-border-light dark:border-border-dark shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8">
                    <item.icon size={32} className="text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-fg mb-4">{item.title}</h3>
                  <p className="text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-accent rounded-[3rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-12 sm:p-20 rounded-[3rem] text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black text-fg leading-tight max-w-2xl mx-auto">
              {t.home.ctaTitle}
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              {t.home.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/${locale}/register`}
                className="w-full sm:w-auto px-12 py-5 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/20 transition-transform hover:scale-105 active:scale-95"
              >
                {t.home.ctaJoin}
              </Link>
              <Link
                href={`/${locale}/marketplace`}
                className="w-full sm:w-auto px-12 py-5 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-fg font-bold rounded-2xl hover:bg-surface-light dark:hover:bg-surface-dark transition-all"
              >
                {t.home.ctaReview}
              </Link>
            </div>
          </div>
        </div>
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
            <Link href={`/${locale}/privacy-policy`} className="hover:text-accent transition-colors">
              {t.nav.kvkk}
            </Link>
            <Link href={`/${locale}/privacy`} className="hover:text-accent transition-colors">
              {t.nav.privacy}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-accent transition-colors">
              {t.nav.terms}
            </Link>
            <Link href={`/${locale}/advertise`} className="hover:text-accent transition-colors">
              {t.nav.reklam}
            </Link>
          </div>
        </div>
      </footer>

      <HomeAnimations />
    </div>
  );
}

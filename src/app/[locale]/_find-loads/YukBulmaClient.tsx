'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useT } from '@/hooks/useT';
import { getFindLoadsTranslation } from '@/utils/getFindLoadsTranslation';
import {
  Search,
  ShieldCheck,
  Route,
  Zap,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const STEP_ICONS = [Search, MessageCircle, Zap];
const FEATURE_ICONS = [ShieldCheck, Star, Route];

export function YukBulmaClient() {
  const t = useT();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const c = getFindLoadsTranslation(locale);

  const steps = c.steps.map((s, idx) => ({ ...s, icon: STEP_ICONS[idx] }));
  const features = c.features.map((f, idx) => ({ ...f, icon: FEATURE_ICONS[idx] }));

  return (
    <div className={t.pageFull}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-accent/[0.02] -z-10" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-8"
          >
            <Zap size={18} />
            {c.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-7xl font-black ${t.heading} mb-8 leading-[1.1] tracking-tight`}
          >
            {c.heroTitleLine1} <br />
            <span className="text-accent">{c.heroTitleAccent}</span> {c.heroTitleLine2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl ${t.sub} max-w-3xl mx-auto mb-12`}
          >
            {c.heroSub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-accent text-white font-black text-lg shadow-xl shadow-accent/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
              {c.ctaViewListings} <ArrowRight size={20} />
            </Link>
            <Link href="/register" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white dark:bg-surface-dark border-2 border-accent/20 text-accent font-black text-lg hover:bg-accent/5 transition-all">
              {c.ctaRegister}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-surface-light dark:bg-surface-dark border-y border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className={`text-4xl font-black ${t.heading} mb-4`}>{c.howItWorksTitle}</h2>
            <p className={t.sub}>{c.howItWorksSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <step.icon size={32} />
                </div>
                <h3 className={`text-2xl font-bold ${t.heading} mb-4`}>{step.title}</h3>
                <p className={t.sub}>{step.desc}</p>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-8 -right-6 text-accent/20">
                    <ArrowRight size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className={`text-4xl md:text-5xl font-black ${t.heading} mb-8 leading-tight`}>
                {c.trustTitleLine1} <br />
                <span className="text-accent">{c.trustTitleAccent}</span>
              </h2>
              <div className="space-y-8">
                {features.map((f, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                      <f.icon size={24} />
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold ${t.heading} mb-2`}>{f.title}</h4>
                      <p className={t.sub}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/20 rounded-[40px] blur-3xl opacity-30" />
              <div className={`relative p-10 rounded-[32px] ${t.card} border-accent/20 shadow-2xl`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <div className={`text-lg font-black ${t.heading}`}>{c.trustCardTitle}</div>
                    <div className="text-xs font-bold text-green-500">{c.trustCardBadge}</div>
                  </div>
                </div>
                <ul className="space-y-4">
                  {c.trustCardList.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-accent" />
                      <span className={`font-bold ${t.sub}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Route Based Discovery */}
      <section className="py-24 bg-accent text-white rounded-[3rem] mx-4 mb-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              {c.routeSectionTitleLine1} <br />
              {c.routeSectionTitleLine2}
            </h2>
            <p className="text-white/80 text-lg mb-12">
              {c.routeSectionDesc}
            </p>
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <div className="text-4xl font-black mb-2">{c.stat1Value}</div>
                <div className="text-white/60 text-sm font-bold uppercase tracking-widest">{c.stat1Label}</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">{c.stat2Value}</div>
                <div className="text-white/60 text-sm font-bold uppercase tracking-widest">{c.stat2Label}</div>
              </div>
            </div>
            <Link href="/register" className="inline-flex px-8 py-4 bg-white text-accent rounded-xl font-black hover:bg-white/90 transition-all">
              {c.routeCta}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className={`text-4xl font-black ${t.heading} mb-8`}>
            {c.finalTitleLine1} <br />
            {c.finalTitleLine2}
          </h2>
          <p className={`${t.sub} text-lg mb-12`}>
            {c.finalSub}
          </p>
          <Link href="/register" className="inline-flex px-12 py-5 bg-accent text-white rounded-2xl font-black text-xl shadow-2xl shadow-accent/20 hover:scale-105 transition-all">
            {c.finalCta}
          </Link>
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useT } from '@/hooks/useT';
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

export function YukBulmaClient() {
  const t = useT();
  

  const steps = [
    {
      icon: Search,
      title: 'İlanları İnceleyin',
      desc: 'Güzergahınıza, araç tipinize ve takviminize en uygun yük ilanlarını filtreleyin.'
    },
    {
      icon: MessageCircle,
      title: 'Hızlıca İletişime Geçin',
      desc: 'İlan sahibiyle doğrudan mesajlaşın, detayları netleştirin ve teklifinizi sunun.'
    },
    {
      icon: Zap,
      title: 'Anında Eşleşin',
      desc: 'Anlaşma sağlandığında yükünüzü güvenle taşıyın ve ödemenizi alın.'
    }
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Doğrulanmış Profil',
      desc: 'Tüm kullanıcılar kimlik ve belge doğrulamasından geçer, güvenli ticaret sağlanır.'
    },
    {
      icon: Star,
      title: 'Puanlama Sistemi',
      desc: 'Nakliyeci ve yük sahiplerinin geçmiş performanslarını görün, en iyilerle çalışın.'
    },
    {
      icon: Route,
      title: 'Güzergah Eşleşmesi',
      desc: 'Dönüş yükü ve parça yük fırsatlarını kaçırmayın, boş kilometreleri kazanca dönüştürün.'
    }
  ];

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
            Türkiye'nin En Dinamik Yük Pazaryeri
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-7xl font-black ${t.heading} mb-8 leading-[1.1] tracking-tight`}
          >
            Hızlı, Güvenli ve Akıllı <br />
            <span className="text-accent">Yük Bulma</span> Deneyimi
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl ${t.sub} max-w-3xl mx-auto mb-12`}
          >
            Loadly ile boş araçlarınıza en uygun yükü saniyeler içinde bulun. 
            Rota bazlı filtreleme ve doğrulanmış kullanıcı ağı ile nakliye süreçlerinizi dijitalleştirin.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/pazar" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-accent text-white font-black text-lg shadow-xl shadow-accent/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
              İlanları Gör <ArrowRight size={20} />
            </Link>
            <Link href="/kayit" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white dark:bg-surface-dark border-2 border-accent/20 text-accent font-black text-lg hover:bg-accent/5 transition-all">
              Hemen Kayıt Ol
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-surface-light dark:bg-surface-dark border-y border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className={`text-4xl font-black ${t.heading} mb-4`}>Nasıl Çalışır?</h2>
            <p className={t.sub}>3 basit adımda yükünüzü bulun ve yola çıkın.</p>
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
                Güvenliğiniz <br />
                <span className="text-accent">Önceliğimizdir</span>
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
                    <div className={`text-lg font-black ${t.heading}`}>Doğrulanmış Platform</div>
                    <div className="text-xs font-bold text-green-500">GÜVENLİ TAŞIMACILIK</div>
                  </div>
                </div>
                <ul className="space-y-4">
                  {[
                    'K Yetki Belgesi Kontrolü',
                    'Firma/Şahıs Doğrulaması',
                    '7/24 Destek Hattı',
                    'Sigortalı Taşımacılık Desteği'
                  ].map((item, i) => (
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
              Rota Bazlı Akıllı <br />
              Eşleştirme Teknolojisi
            </h2>
            <p className="text-white/80 text-lg mb-12">
              Sadece mevcut konumunuzda değil, gideceğiniz rota üzerindeki tüm fırsatları görün. 
              Dönüş yükü (backhaul) algoritması ile aracınızın boş dönmesini engelleyin, karlılığınızı artırın.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <div className="text-4xl font-black mb-2">%40</div>
                <div className="text-white/60 text-sm font-bold uppercase tracking-widest">Daha Fazla Kazanç</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">0 KM</div>
                <div className="text-white/60 text-sm font-bold uppercase tracking-widest">Boş Dönüş Riski</div>
              </div>
            </div>
            <Link href="/pazar" className="inline-flex px-8 py-4 bg-white text-accent rounded-xl font-black hover:bg-white/90 transition-all">
              Hemen Dene
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className={`text-4xl font-black ${t.heading} mb-8`}>
            Lojistik Dünyasına <br />
            Dijital Bir Adım Atın
          </h2>
          <p className={`${t.sub} text-lg mb-12`}>
            Binlerce nakliyeci ve yük sahibi Loadly ile her gün daha verimli çalışıyor. 
            Siz de topluluğumuza katılın, işinizi büyütün.
          </p>
          <Link href="/kayit" className="inline-flex px-12 py-5 bg-accent text-white rounded-2xl font-black text-xl shadow-2xl shadow-accent/20 hover:scale-105 transition-all">
            Ücretsiz Başla
          </Link>
        </div>
      </section>
    </div>
  );
}

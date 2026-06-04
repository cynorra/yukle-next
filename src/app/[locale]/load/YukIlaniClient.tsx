'use client';

import Link from 'next/link';
import { useT } from '@/hooks/useT';
import { 
  FilePlus, 
  Users, 
  Zap, 
  ArrowRight,
  Truck,
  Package,
  CheckCircle2,
  BadgeDollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export function YukIlaniClient() {
  const t = useT();
  

  const benefits = [
    {
      icon: BadgeDollarSign,
      title: 'Ücretsiz İlan Verme',
      desc: 'İlanınızı hiçbir ücret ödemeden yayınlayın, bütçenizi nakliye operasyonlarınıza ayırın.'
    },
    {
      icon: Users,
      title: 'Geniş Taşıyıcı Ağı',
      desc: 'Türkiye\'nin her köşesinden binlerce doğrulanmış nakliyeciye anında ulaşın.'
    },
    {
      icon: Zap,
      title: 'Hızlı Teklif Toplama',
      desc: 'İlanınız yayınlandığı an uygun nakliyecilere bildirim gider, dakikalar içinde teklifler gelmeye başlar.'
    }
  ];

  return (
    <div className={t.pageFull}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-accent/[0.03] -z-10" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-8">
                <FilePlus size={18} />
                En Hızlı İlan Yayınlama Sistemi
              </div>
              <h1 className={`text-5xl md:text-7xl font-black ${t.heading} mb-8 leading-[1.1] tracking-tight`}>
                Saniyeler İçinde <br />
                <span className="text-accent">Yük İlanı</span> Verin
              </h1>
              <p className={`text-xl ${t.sub} mb-12 max-w-xl`}>
                İster tek bir koli, ister koca bir fabrika dolusu yük olsun. 
                İlanınızı ücretsiz verin, en uygun nakliyeciyi zahmetsizce bulun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/yuk-olustur" className="px-10 py-5 rounded-2xl bg-accent text-white font-black text-lg shadow-xl shadow-accent/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                  İlan Ver <ArrowRight size={20} />
                </Link>
                <Link href="/kayit" className="px-10 py-5 rounded-2xl bg-white dark:bg-surface-dark border-2 border-accent/20 text-accent font-black text-lg hover:bg-accent/5 transition-all flex items-center justify-center">
                  Hemen Kayıt Ol
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-10 bg-accent/20 rounded-full blur-[100px] opacity-20 animate-pulse" />
              <div className={`relative p-10 rounded-[40px] ${t.card} border-accent/20 shadow-2xl`}>
                <div className="space-y-6">
                  {[
                    { label: 'İlan Oluşturma', time: '45 sn' },
                    { label: 'İlk Teklif Süresi', time: '12 dk' },
                    { label: 'Aktif Nakliyeci', time: '15,000+' }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-accent/5">
                      <span className={`font-bold ${t.sub}`}>{stat.label}</span>
                      <span className="font-black text-accent">{stat.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-surface-light dark:bg-surface-dark border-y border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className={`text-4xl font-black ${t.heading} mb-4`}>Neden Loadly?</h2>
            <p className={t.sub}>Geleneksel yöntemleri bırakın, dijital nakliye ile tanışın.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-accent/40 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                  <benefit.icon size={28} />
                </div>
                <h3 className={`text-2xl font-bold ${t.heading} mb-4`}>{benefit.title}</h3>
                <p className={t.sub}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                 <div className="grid grid-cols-2 gap-4">
                    <div className={`p-6 rounded-3xl ${t.card} border-accent/20 aspect-square flex flex-col justify-end`}>
                      <Truck className="text-accent mb-4" size={32} />
                      <div className="font-black text-2xl">TIR & Kamyon</div>
                      <div className="text-xs font-bold text-muted uppercase">Komple Yük</div>
                    </div>
                    <div className={`p-6 rounded-3xl ${t.card} border-accent/20 aspect-square flex flex-col justify-end mt-8`}>
                      <Package className="text-accent mb-4" size={32} />
                      <div className="font-black text-2xl">Parsiyel</div>
                      <div className="text-xs font-bold text-muted uppercase">Küçük Yük</div>
                    </div>
                 </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className={`text-4xl md:text-5xl font-black ${t.heading} mb-8`}>
                Her Türlü Araca <br />
                <span className="text-accent">Uygun İlanlar</span>
              </h2>
              <p className={`text-lg ${t.sub} mb-8`}>
                Loadly platformunda yükünüzün boyutu ne olursa olsun uygun bir araç mutlaka vardır. 
                TIR, kamyon, kamyonet veya minivan; sistemimiz yükünüze en uygun araç tipini otomatik olarak eşleştirir.
              </p>
              <ul className="space-y-4">
                {[
                  'Hassas ve kırılgan yükler',
                  'Soğuk zincir taşımacılığı',
                  'Ağır sanayi yükleri',
                  'Evden eve nakliyat (Eşya)'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-accent" />
                    <span className={`font-bold ${t.heading}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="py-32 bg-fg text-white rounded-[3rem] mx-4 mb-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Adım Adım İlan Süreci</h2>
            <p className="text-white/60">Yükünüzü yola çıkarmak hiç bu kadar kolay olmamıştı.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Detayları Gir', desc: 'Nereden, nereye, ne zaman?' },
              { num: '02', title: 'Fiyatı Belirle', desc: 'Bütçenizi veya "Teklif Al"ı seçin.' },
              { num: '03', title: 'Teklifleri Gör', desc: 'Puan ve fiyata göre karşılaştır.' },
              { num: '04', title: 'Taşıyıcını Seç', desc: 'Anlaş ve güvenle taşıt.' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-black text-white/10 mb-4">{step.num}</div>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-white/60 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className={`text-4xl font-black ${t.heading} mb-8`}>
            İlanınızı Verin, <br />
            Teklifleri Toplamaya Başlayın
          </h2>
          <p className={`${t.sub} text-lg mb-12`}>
            Karmaşık telefon trafiğinden kurtulun. Tek bir ilanla yüzlerce nakliyeciye ulaşın.
          </p>
          <Link href="/yuk-olustur" className="inline-flex px-12 py-5 bg-accent text-white rounded-2xl font-black text-xl shadow-2xl shadow-accent/20 hover:scale-105 transition-all">
            Hemen Ücretsiz İlan Ver
          </Link>
        </div>
      </section>
    </div>
  );
}

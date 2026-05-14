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

// Bu sayfa statik (içerikte interaktif state yok).
// Animasyonlar HomeAnimations adlı client component'te.
// Bu yapı sayesinde SEO bot'ları tam HTML'i görür.

export const metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
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
                <Zap size={14} /> Yeni Nesil Lojistik
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight text-fg">
              Yük Bul, Teklif Al,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-600 dark:to-orange-400">
                Taşımaya Başla
              </span>
            </h1>

            <p className="max-w-2xl text-lg sm:text-xl text-muted leading-relaxed font-medium">
              Türkiye&apos;nin 81 ilinde nakliye ilanları. Nakliyeciler ve yük sahipleri için
              tasarlanmış en hızlı lojistik eşleştirme platformu.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/pazar"
                className="group w-full sm:w-auto px-10 py-5 bg-accent text-white font-bold text-lg rounded-2xl shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                Pazarı Keşfet
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/kayit"
                className="w-full sm:w-auto px-10 py-5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg font-bold text-lg rounded-2xl hover:bg-background-light dark:hover:bg-background-dark transition-all"
              >
                Ücretsiz Kayıt Ol
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
                <span>+10,000 aktif kullanıcı her gün burada</span>
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
              { value: '81', label: 'İl Kapsamı', icon: MapPin, color: 'text-blue-500' },
              { value: '7/24', label: 'Kesintisiz Erişim', icon: Truck, color: 'text-green-500' },
              { value: 'Ücretsiz', label: 'İlan Verme', icon: Star, color: 'text-yellow-500' },
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
              Nasıl Çalışır?
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Sadece üç adımda yükünüzü taşıyın veya yeni işler bulun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-border-light dark:via-border-dark to-transparent" />

            {[
              {
                icon: Package,
                title: 'İlan Oluştur',
                desc: 'Yük bilgilerinizi girin, kalkış ve varış noktalarını belirleyin.',
                step: '01',
              },
              {
                icon: TrendingUp,
                title: 'Teklif Al',
                desc: 'Nakliyecilerden gelen en uygun teklifleri değerlendirin.',
                step: '02',
              },
              {
                icon: Shield,
                title: 'Güvenle Taşı',
                desc: 'Anlaşmanızı yapın ve yükünüzü güvenle ulaştırın.',
                step: '03',
              },
            ].map((item, idx) => (
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
              Lojistikte Yeni Bir Döneme Hazır mısınız?
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Binlerce profesyonel nakliyeci ve yük sahibi her gün bu platformda buluşuyor.
              Hemen ücretsiz katılın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/kayit"
                className="w-full sm:w-auto px-12 py-5 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/20 transition-transform hover:scale-105 active:scale-95"
              >
                Hemen Katıl
              </Link>
              <Link
                href="/pazar"
                className="w-full sm:w-auto px-12 py-5 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-fg font-bold rounded-2xl hover:bg-surface-light dark:hover:bg-surface-dark transition-all"
              >
                İlanları İncele
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
              © 2025 YükLe · Türkiye&apos;nin Lojistik Platformu
            </p>
            <p className="text-xs text-muted/50 font-medium tracking-wider">loadlyapp.com</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-muted uppercase tracking-widest">
            <Link href="/kvkk" className="hover:text-accent transition-colors">
              KVKK
            </Link>
            <Link href="/gizlilik" className="hover:text-accent transition-colors">
              Gizlilik
            </Link>
            <Link href="/kullanim-sartlari" className="hover:text-accent transition-colors">
              Şartlar
            </Link>
            <Link href="/reklam" className="hover:text-accent transition-colors">
              Reklam
            </Link>
          </div>
        </div>
      </footer>

      {/* Animasyonlar opsiyonel, framer-motion'lı client wrapper.
          SEO için animasyon GEREKMİYOR, içerik zaten yukarıda statik render edildi. */}
      <HomeAnimations />
    </div>
  );
}

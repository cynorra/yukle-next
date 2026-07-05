'use client';

import { useT } from '@/hooks/useT';
import { Megaphone, Mail, Users, TrendingUp, Globe, CheckCircle, BarChart3, Target } from 'lucide-react';

export function AdPageClient() {
  const t = useT();

  const packages = [
    {
      icon: Target,
      title: 'Banner Reklamı',
      desc: 'Ana sayfa ve pazaryeri sayfalarında görünür banner alanları. Lojistik sektörüne özel hedef kitleye doğrudan ulaşın.',
      features: ['Masaüstü ve mobil uyumlu', 'Yüksek trafikli sayfalarda', 'Haftalık rapor'],
    },
    {
      icon: TrendingUp,
      title: 'Sponsorlu İlan',
      desc: 'Yük ilanlarınızın veya firma profilinizin listelerde öne çıkması. Daha fazla görünürlük, daha fazla teklif.',
      features: ['Öne çıkan ilan etiketi', 'Arama sonuçlarında öncelik', 'Performans takibi'],
    },
    {
      icon: Globe,
      title: 'Marka Ortaklığı',
      desc: 'Blog, sosyal medya ve e-posta bülteni üzerinden geniş çaplı marka görünürlüğü kampanyaları.',
      features: ['Blog yazısı & sosyal paylaşım', 'E-posta bülteni', 'Özel içerik üretimi'],
    },
  ];

  const stats = [
    { value: '50+', label: 'Ülke', icon: Globe },
    { value: '5.000+', label: 'Aktif Kullanıcı', icon: Users },
    { value: '%78', label: 'Mobil Trafik', icon: BarChart3 },
  ];

  return (
    <div className={t.pageFull}>
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold ${t.heading} flex items-center justify-center gap-4 mb-4`}>
            <Megaphone size={40} className="text-[#F5A623]" />
            Loadly&apos;de Reklam Verin
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            Türkiye ve dünya genelinde lojistik ve nakliye sektörü profesyonellerine ulaşmanın en etkili yolu.
            Platforma kayıtlı binlerce nakliyeci, yük sahibi ve lojistik firmasına markanızı tanıtın.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <div key={i} className={`p-5 rounded-2xl ${t.card} text-center`}>
              <Icon size={24} className="text-[#F5A623] mx-auto mb-2" />
              <div className="text-2xl font-black text-fg">{value}</div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Why Advertise */}
        <div className={`p-8 rounded-3xl ${t.card} mb-12`}>
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>Neden Loadly&apos;de Reklam Vermelisiniz?</h2>
          <div className="space-y-3">
            {[
              'Lojistik ve nakliye sektörüne özgü, yüksek kaliteli hedef kitle',
              'Türkiye başta olmak üzere 50+ ülkede aktif kullanıcı tabanı',
              'Günlük binlerce aktif oturum ve yük işlemi',
              'Mobil öncelikli platform — kullanıcıların %78\'i mobil cihazdan erişiyor',
              'Şehiriçi, şehirlerarası ve uluslararası nakliye segmentlerine ulaşım',
              'Uygun fiyatlı ve ölçülebilir reklam paketleri',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span className={`text-sm ${t.muted}`}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-8`}>Reklam Paketleri</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map(({ icon: Icon, title, desc, features }, i) => (
              <div key={i} className={`p-6 rounded-2xl ${t.card} flex flex-col`}>
                <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-[#F5A623]" />
                </div>
                <h3 className={`text-lg font-bold ${t.heading} mb-2`}>{title}</h3>
                <p className={`text-sm ${t.muted} leading-relaxed mb-4 flex-1`}>{desc}</p>
                <ul className="space-y-2">
                  {features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-muted">
                      <CheckCircle size={14} className="text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Who Should Advertise */}
        <div className={`p-8 rounded-3xl ${t.card} mb-12`}>
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>Kimler Reklam Verebilir?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Nakliye ve Lojistik Firmalar', desc: 'Şirket profilinizi öne çıkarın, daha fazla yük teklifi alın.' },
              { title: 'Araç ve Ekipman Satıcıları', desc: 'Tır, kamyon ve lojistik ekipman markaları için hedefli erişim.' },
              { title: 'Sigorta ve Finans Şirketleri', desc: 'Nakliyecilere ve yük sahiplerine hizmetlerinizi tanıtın.' },
              { title: 'Yazılım ve Teknoloji Şirketleri', desc: 'Lojistik sektörüne yönelik SaaS ve teknoloji çözümlerini duyurun.' },
            ].map(({ title, desc }, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark">
                <h3 className={`text-sm font-bold ${t.heading} mb-1`}>{title}</h3>
                <p className={`text-xs ${t.muted}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-[#F5A623]/10 border border-[#F5A623]/20 text-center">
          <h2 className={`text-2xl font-bold ${t.heading} mb-3`}>İletişime Geçin</h2>
          <p className={`text-sm ${t.muted} mb-6 max-w-lg mx-auto leading-relaxed`}>
            Reklam paketleri, fiyatlandırma ve özel kampanya teklifleri için aşağıdaki e-posta adresine yazın.
            Ekibimiz en kısa sürede size özel bir teklif hazırlayacaktır.
          </p>
          <a
            href="mailto:reklam@loadlyapp.com?subject=Loadly Reklam Talebi"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#F5A623] text-white font-bold rounded-2xl hover:bg-orange-500 transition-colors shadow-lg shadow-[#F5A623]/20"
          >
            <Mail size={20} />
            reklam@loadlyapp.com
          </a>
        </div>

      </div>
    </div>
  );
}

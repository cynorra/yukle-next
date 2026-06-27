'use client';

import { useT } from '@/hooks/useT';
import { Info, Truck, Shield, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/utils/translations';

export function AboutPageClient() {
  const t = useT();
  const params = useParams();
  const locale = (params.locale as Locale) || 'tr';
  const isTr = locale === 'tr';

  return (
    <div className={t.pageFull}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-bold ${t.heading} flex items-center justify-center gap-4 mb-4`}>
            <Info size={40} className="text-[#F5A623]" />
            {isTr ? 'Hakkımızda' : 'About Us'}
          </h1>
          <p className={`text-lg ${t.muted} max-w-2xl mx-auto leading-relaxed`}>
            {isTr 
              ? 'YükLe, dijital dünyanın nakliye pazaryeridir. Türkiye ve dünya genelinde yük arayanlar ile araç sahiplerini güvenli ve hızlı bir şekilde buluşturur.' 
              : 'Loadly is the digital freight marketplace. We connect shippers and carriers safely and quickly across the globe.'}
          </p>
        </div>

        {/* Content Blocks */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Truck size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{isTr ? 'Hızlı ve Kolay' : 'Fast and Easy'}</h3>
            <p className={`text-sm ${t.muted}`}>
              {isTr ? 'Zaman kaybetmeden en uygun aracı veya yükü dakikalar içerisinde bulun.' : 'Find the most suitable vehicle or load in minutes without wasting time.'}
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Shield size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{isTr ? 'Güvenilir Ağ' : 'Reliable Network'}</h3>
            <p className={`text-sm ${t.muted}`}>
              {isTr ? 'Puanlama sistemi ve doğrulama süreçleriyle güvenilir nakliye deneyimi.' : 'A reliable shipping experience with our rating system and verification processes.'}
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark backdrop-blur-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/20 flex items-center justify-center mb-4">
              <Globe size={32} className="text-[#F5A623]" />
            </div>
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{isTr ? 'Geniş Kapsam' : 'Wide Coverage'}</h3>
            <p className={`text-sm ${t.muted}`}>
              {isTr ? 'Yerel ve uluslararası binlerce aktif kullanıcı ile geniş taşıma ağı.' : 'A wide transportation network with thousands of active local and international users.'}
            </p>
          </div>
        </div>
        
        {/* Story */}
        <div className="p-8 rounded-3xl bg-surface-light/50 dark:bg-surface-dark/50 border border-border-light dark:border-border-dark backdrop-blur-xl mb-12">
          <h2 className={`text-2xl font-bold ${t.heading} mb-6`}>{isTr ? 'Vizyonumuz' : 'Our Vision'}</h2>
          <div className="space-y-4">
            <p className={`text-base ${t.muted} leading-relaxed`}>
              {isTr 
                ? 'Geleneksel lojistik süreçlerini modern teknolojilerle dijitalleştirerek, herkes için erişilebilir, şeffaf ve güvenilir bir nakliye ekosistemi yaratmayı hedefliyoruz. İster küçük bir eşya, ister büyük bir ticari sevkiyat olsun, doğru aracın doğru yükle en verimli şekilde eşleşmesi gerektiğine inanıyoruz.' 
                : 'By digitizing traditional logistics processes with modern technologies, we aim to create an accessible, transparent, and reliable transportation ecosystem for everyone. Whether it is a small item or a large commercial shipment, we believe that the right vehicle should be matched with the right load in the most efficient way.'}
            </p>
            <p className={`text-base ${t.muted} leading-relaxed`}>
              {isTr 
                ? 'YükLe, boş dönen araçların kapasitelerini değerlendirerek çevresel karbon ayak izini azaltmaya katkıda bulunurken, yük sahiplerinin de maliyetlerini optimize etmesini sağlar. Gelişen algoritmalarımız sayesinde, her geçen gün daha akıllı ve daha hızlı eşleşmeler sunuyoruz.' 
                : 'Loadly contributes to reducing the environmental carbon footprint by utilizing the capacities of empty returning vehicles, while allowing shippers to optimize their costs. Thanks to our evolving algorithms, we offer smarter and faster matches every day.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

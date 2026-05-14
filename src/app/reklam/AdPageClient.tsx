'use client';

import { useT } from '@/hooks/useT';
import { Megaphone, Mail } from 'lucide-react';

export function AdPageClient() {
  const t = useT();

  return (
    <div className={t.pageFull}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Megaphone size={28} className="text-[#F5A623]" />
            Reklam
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>YükLe platformunda reklam verin, hedef kitlenize ulaşın.</p>
        </div>

        {/* Content */}
        <div className="p-6 rounded-2xl ${t.card}">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/10 flex items-center justify-center mx-auto mb-6">
              <Megaphone size={32} className="text-[#F5A623]" />
            </div>
            <h2 className={`text-xl font-bold ${t.heading} mb-3`}>YükLe'de Reklam Verin</h2>
            <p className={`text-sm ${t.sub} leading-relaxed mb-6 max-w-md mx-auto`}>
              Türkiye'nin nakliye sektörüne özel ilan platformu YükLe'de markanızı ön plana çıkarın. Nakliye ve lojistik sektörünün profesyonellerine ulaşın.
            </p>

            <div className="p-4 rounded-xl ${t.card} mb-6">
              <div className="flex items-center justify-center gap-3">
                <Mail size={20} className="text-[#F5A623]" />
                <div className="text-left">
                  <div className={`text-xs ${t.muted}`}>Reklam İletişim</div>
                  <a
                    href="mailto:reklam@loadlyapp.com"
                    className="text-[#F5A623] font-medium hover:underline"
                  >
                    reklam@loadlyapp.com
                  </a>
                </div>
              </div>
            </div>

            <p className={`text-xs ${t.muted}`}>
              Reklam fırsatları ve fiyatlandırma hakkında bilgi almak için yukarıdaki e-posta adresi ile iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

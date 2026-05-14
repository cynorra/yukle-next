'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { useT } from '@/hooks/useT';

export default function CookieConsent() {
  const t = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent');
    if (!accepted) setTimeout(() => setShow(true), 1500);
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50">
      <div className={`p-4 rounded-2xl shadow-2xl ${t.card}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Cookie size={18} className={t.accent} />
            <span className={`text-sm font-bold ${t.heading}`}>Çerezler</span>
          </div>
          <button onClick={() => setShow(false)} className={`p-1 rounded-lg transition-colors ${t.muted} hover:${t.heading}`}>
            <X size={16} />
          </button>
        </div>
        <p className={`text-xs ${t.sub} mb-4 leading-relaxed`}>
          Daha iyi bir deneyim için çerezler kullanıyoruz. Devam ederek kabul etmiş sayılırsınız.
        </p>
        <div className="flex gap-2">
          <button onClick={accept}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${t.btnPrimary}`}>
            <Check size={14} />Kabul Et
          </button>
          <button onClick={() => setShow(false)}
            className={`px-3 py-2 rounded-xl text-xs transition-all ${t.btnSecondary}`}>
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}

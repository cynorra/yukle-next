'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { useT } from '@/hooks/useT';
import { useTranslation } from '@/hooks/useTranslation';

export const COOKIE_CONSENT_EVENT = 'loadly-cookie-consent';
const STORAGE_KEY = 'cookie-consent';

export function getStoredCookieConsent(): 'accepted' | 'rejected' | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

function setStoredCookieConsent(value: 'accepted' | 'rejected') {
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { accepted: value === 'accepted' } }));
}

const TEXT: Record<string, { label: string; desc: string; accept: string; reject: string }> = {
  tr: { label: 'Çerezler', desc: 'Deneyiminizi iyileştirmek ve reklamları kişiselleştirmek için çerezler kullanıyoruz. "Kabul Et" seçeneği reklam çerezlerine de izin verir.', accept: 'Kabul Et', reject: 'Reddet' },
  en: { label: 'Cookies', desc: 'We use cookies to improve your experience and personalize ads. Accepting also allows advertising cookies.', accept: 'Accept', reject: 'Reject' },
  es: { label: 'Cookies', desc: 'Utilizamos cookies para mejorar su experiencia y personalizar los anuncios. Aceptar también permite cookies publicitarias.', accept: 'Aceptar', reject: 'Rechazar' },
  pt: { label: 'Cookies', desc: 'Usamos cookies para melhorar sua experiência e personalizar anúncios. Aceitar também permite cookies publicitários.', accept: 'Aceitar', reject: 'Rejeitar' },
  fr: { label: 'Cookies', desc: 'Nous utilisons des cookies pour améliorer votre expérience et personnaliser les publicités. Accepter autorise aussi les cookies publicitaires.', accept: 'Accepter', reject: 'Refuser' },
  de: { label: 'Cookies', desc: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und Werbung zu personalisieren. Akzeptieren erlaubt auch Werbe-Cookies.', accept: 'Akzeptieren', reject: 'Ablehnen' },
  it: { label: 'Cookie', desc: 'Utilizziamo i cookie per migliorare la tua esperienza e personalizzare gli annunci. Accettare consente anche i cookie pubblicitari.', accept: 'Accetta', reject: 'Rifiuta' },
  nl: { label: 'Cookies', desc: 'We gebruiken cookies om uw ervaring te verbeteren en advertenties te personaliseren. Accepteren staat ook advertentiecookies toe.', accept: 'Accepteren', reject: 'Weigeren' },
  ru: { label: 'Файлы cookie', desc: 'Мы используем файлы cookie для улучшения работы сайта и персонализации рекламы. Принятие также разрешает рекламные файлы cookie.', accept: 'Принять', reject: 'Отклонить' },
  ja: { label: 'クッキー', desc: 'ユーザー体験の向上と広告のパーソナライズのためにクッキーを使用しています。「同意する」を選択すると広告クッキーも許可されます。', accept: '同意する', reject: '拒否する' },
  zh: { label: 'Cookie', desc: '我们使用 Cookie 来改善您的体验并个性化广告。接受即表示同意使用广告 Cookie。', accept: '接受', reject: '拒绝' },
  ar: { label: 'ملفات تعريف الارتباط', desc: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتخصيص الإعلانات. يسمح القبول أيضًا بملفات تعريف ارتباط الإعلانات.', accept: 'قبول', reject: 'رفض' },
  ko: { label: '쿠키', desc: '경험을 개선하고 광고를 맞춤화하기 위해 쿠키를 사용합니다. 수락하면 광고 쿠키도 허용됩니다.', accept: '수락', reject: '거부' },
};

export default function CookieConsent() {
  const t = useT();
  const { locale } = useTranslation();
  const copy = TEXT[locale] ?? TEXT.en;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!getStoredCookieConsent()) setTimeout(() => setShow(true), 1500);
  }, []);

  function accept() {
    setStoredCookieConsent('accepted');
    setShow(false);
  }

  function reject() {
    setStoredCookieConsent('rejected');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50">
      <div className={`p-4 rounded-2xl shadow-2xl ${t.card}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Cookie size={18} className={t.accent} />
            <span className={`text-sm font-bold ${t.heading}`}>{copy.label}</span>
          </div>
          <button onClick={reject} aria-label={copy.reject} className={`p-1 rounded-lg transition-colors ${t.muted} hover:${t.heading}`}>
            <X size={16} />
          </button>
        </div>
        <p className={`text-xs ${t.sub} mb-4 leading-relaxed`}>
          {copy.desc}
        </p>
        <div className="flex gap-2">
          <button onClick={accept}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${t.btnPrimary}`}>
            <Check size={14} />{copy.accept}
          </button>
          <button onClick={reject}
            className={`px-3 py-2 rounded-xl text-xs transition-all ${t.btnSecondary}`}>
            {copy.reject}
          </button>
        </div>
      </div>
    </div>
  );
}

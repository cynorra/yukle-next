'use client';

import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useT } from '@/hooks/useT';

export function ResetPasswordPageClient() {
  const t = useT();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase hash fragment'ten session alır
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Kullanıcı bu sayfada, form göster
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Şifreler eşleşmiyor.'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalıdır.'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }
    setDone(true);
    setTimeout(() => router.push('/giris'), 3000);
  }

  return (
    <div className={`min-h-screen ${t.page} flex items-center justify-center px-4`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="medium" />
          <p className={`${t.sub} mt-3`}>Yeni şifrenizi belirleyin</p>
        </div>
        <div className={`p-8 rounded-2xl ${t.card}`}>
          {done ? (
            <div className="text-center">
              <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className={`font-bold text-lg ${t.heading} mb-2`}>Şifreniz güncellendi!</h3>
              <p className={`text-sm ${t.sub}`}>Giriş sayfasına yönlendiriliyorsunuz...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              <div>
                <label className={`block text-sm ${t.sub} mb-1.5`}>Yeni Şifre</label>
                <div className="relative">
                  <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none ${t.input}`}
                    placeholder="En az 6 karakter" />
                </div>
              </div>
              <div>
                <label className={`block text-sm ${t.sub} mb-1.5`}>Şifre Tekrar</label>
                <div className="relative">
                  <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                    className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none ${t.input}`}
                    placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${t.btnPrimary}`}>
                {loading ? <><Loader2 size={16} className="animate-spin" />Güncelleniyor...</> : 'Şifreyi Güncelle'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

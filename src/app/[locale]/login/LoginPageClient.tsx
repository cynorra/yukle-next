'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import { Mail, Lock, ArrowRight, Loader2, Truck, Package, Shield, MapPin } from 'lucide-react';
import { useT } from '@/hooks/useT';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { TextureCard } from '@/components/ui/texture-card';
import { TextureButton } from '@/components/ui/texture-button';

const benefits = [
  { icon: MapPin, text: "Türkiye'nin 81 ilinde aktif ilanlar" },
  { icon: Package, text: 'Anında teklif al, güvenle taşı' },
  { icon: Shield, text: 'Onaylı nakliyeci ve yük sahibi ağı' },
  { icon: Truck, text: '7/24 kesintisiz erişim, ücretsiz kayıt' },
];

export function LoginPageClient() {
  const t = useT();
  const { user, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Zaten giriş yapmış kullanıcıyı anasayfaya gönder
  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);
  if (user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'E-posta veya şifre hatalı.' : err.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google girişi başarısız oldu.');
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/sifre-sifirla`,
    });
    if (!err) setResetSent(true);
    setResetLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Sol panel — sadece desktop */}
      <div className="hidden lg:flex flex-col justify-between p-14 bg-[#0f0f0f] relative overflow-hidden">
        {/* Arka plan deseni */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        {/* Accent glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center">
              <Truck size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">YükLe</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-5">
            Türkiye'nin<br />
            <span className="text-accent">Lojistik Pazarı</span>
          </h2>
          <p className="text-white/50 text-lg font-medium mb-14 leading-relaxed">
            Nakliyeciler ve yük sahipleri için tasarlanmış en hızlı eşleştirme platformu.
          </p>

          <div className="space-y-5">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <b.icon size={16} className="text-accent" />
                </div>
                <span className="text-white/70 text-sm font-medium">{b.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/10">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
            © 2026 YükLe Lojistik Platformu
          </p>
        </div>
      </div>

      {/* Sağ panel — form */}
      <div className={`flex items-center justify-center p-8 ${t.page}`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Logo size="large" />
          </div>

          {showReset ? (
            <>
              <div className="mb-8">
                <h1 className={`text-2xl font-black ${t.heading} mb-2`}>Şifreni Sıfırla</h1>
                <p className={`text-sm ${t.sub}`}>E-posta adresine bağlantı göndereceğiz.</p>
              </div>

              <TextureCard className="p-6">
                {resetSent ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Mail size={28} className="text-green-400" />
                    </div>
                    <h3 className={`font-bold text-lg ${t.heading} mb-2`}>Gönderildi!</h3>
                    <p className={`text-sm ${t.sub} mb-6`}>{resetEmail} adresini kontrol edin.</p>
                    <TextureButton
                      onClick={() => { setShowReset(false); setResetSent(false); }}
                      variant="primary"
                      className="w-full !rounded-xl"
                    >
                      Giriş Sayfasına Dön
                    </TextureButton>
                  </div>
                ) : (
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${t.sub} mb-2`}>E-posta</label>
                      <div className="relative">
                        <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                        <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                          placeholder="ornek@email.com" />
                      </div>
                    </div>
                    <TextureButton type="submit" variant="primary" disabled={resetLoading}
                      className="w-full !rounded-xl">
                      {resetLoading ? <><Loader2 size={16} className="animate-spin mr-2 inline" />Gönderiliyor...</> : 'Bağlantı Gönder'}
                    </TextureButton>
                    <TextureButton type="button" variant="secondary" onClick={() => setShowReset(false)}
                      className="w-full !rounded-xl">
                      ← Geri Dön
                    </TextureButton>
                  </form>
                )}
              </TextureCard>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className={`text-2xl font-black ${t.heading} mb-2`}>Hoş Geldiniz</h1>
                <p className={`text-sm ${t.sub}`}>Hesabınıza giriş yapın.</p>
              </div>

              <TextureCard className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium ${t.sub} mb-2`}>E-posta</label>
                  <div className="relative">
                    <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                      placeholder="ornek@email.com" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-medium ${t.sub}`}>Şifre</label>
                    <button type="button" onClick={() => { setResetEmail(email); setShowReset(true); }}
                      className={`text-xs font-semibold ${t.accent} hover:underline`}>
                      Şifremi Unuttum
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                      placeholder="••••••••" />
                  </div>
                </div>

                <TextureButton type="submit" variant="primary" disabled={loading}
                  className="w-full !rounded-xl mt-2">
                  {loading
                    ? <><Loader2 size={16} className="animate-spin mr-2 inline" />Giriş yapılıyor...</>
                    : <><ArrowRight size={16} className="mr-2 inline" />Giriş Yap</>
                  }
                </TextureButton>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${t.divider}`}></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className={`${t.page} px-2 ${t.muted}`}>VEYA</span>
                  </div>
                </div>

                <TextureButton
                  type="button"
                  variant="secondary"
                  onClick={handleGoogleLogin}
                  className="w-full !rounded-xl"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google ile Giriş Yap
                </TextureButton>
              </form>

              <p className={`text-center text-sm ${t.muted} mt-6`}>
                Hesabınız yok mu?{' '}
                <Link href="/kayit" className={`${t.accent} font-semibold hover:underline`}>Ücretsiz Kayıt Ol</Link>
              </p>
              </TextureCard>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

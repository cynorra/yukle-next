'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Truck, Package, CheckCircle2, Loader2, Star } from 'lucide-react';
import { useT } from '@/hooks/useT';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', label: 'Hesap türü seçin' },
  { num: '02', label: 'Bilgilerinizi girin' },
  { num: '03', label: 'Platformu keşfedin' },
];

export function RegisterPageClient() {
  const t = useT();
  const { user, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'shipper' | 'driver' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);
  if (user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) { setError('Lütfen hesap türünüzü seçin.'); return; }
    if (!fullName.trim()) { setError('Ad soyad zorunludur.'); return; }
    if (!phone.trim()) { setError('Telefon numarası zorunludur.'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalıdır.'); return; }
    const nameParts = fullName.trim().split(' ').filter(p => p.length > 0);
    if (nameParts.length < 2) { setError('Lütfen ad ve soyadınızı girin.'); return; }
    if (nameParts.some(p => p.length < 2)) { setError('Ad ve soyad en az 2 karakter olmalıdır.'); return; }
    const phoneDigits = phone.trim().replace(/[\s-()]/g, '');
    if (!/^0[0-9]{10}$/.test(phoneDigits)) {
      setError('Telefon numarası 0 ile başlamalı ve 11 rakam olmalıdır. Örnek: 05XX XXX XX XX');
      return;
    }
    if (!/^05/.test(phoneDigits)) { setError('Geçerli bir cep telefonu numarası girin. (05XX ile başlamalı)'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Geçerli bir e-posta adresi girin.'); return; }
    setError('');
    setLoading(true);
    const { data: phoneCheck } = await supabase.from('profiles').select('id').eq('phone', phoneDigits).maybeSingle();
    if (phoneCheck) { setError('Bu telefon numarası zaten kayıtlı.'); setLoading(false); return; }
    const { data, error: err } = await signUp(email, password, { full_name: fullName.trim(), phone: phoneDigits, role });
    if (err) {
      if (err.message === 'User already registered' || err.message?.includes('already registered')) setError('Bu e-posta adresi zaten kayıtlı.');
      else if (err.message?.includes('email')) setError('Geçersiz e-posta adresi.');
      else if (err.message?.includes('password')) setError('Şifre çok zayıf. En az 6 karakter kullanın.');
      else setError(err.message);
    } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
      // Supabase mevcut kullanıcı için hata değil boş identities döndürür
      setError('Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.');
    } else {
      router.push('/');
    }
    setLoading(false);
  }

  async function handleGoogleSignup() {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google kaydı başarısız oldu.');
    }
  }

  const roles = [
    {
      id: 'shipper' as const,
      icon: Package,
      title: 'Yük Sahibi',
      subtitle: 'İlan aç, teklif al',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
    },
    {
      id: 'driver' as const,
      icon: Truck,
      title: 'Nakliyeci',
      subtitle: 'İlan bul, teklif ver',
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/30',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Sol panel */}
      <div className="hidden lg:flex flex-col justify-between p-14 bg-[#0f0f0f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center">
              <Truck size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">YükLe</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-5">
            3 Adımda<br />
            <span className="text-accent">Platforma Katıl</span>
          </h2>
          <p className="text-white/50 text-lg font-medium mb-14 leading-relaxed">
            Ücretsiz hesap oluştur ve hemen aktif ilanları görmeye başla.
          </p>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-5"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-accent">{s.num}</span>
                </div>
                <span className="text-white/70 text-sm font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-accent fill-accent" />)}
            </div>
            <p className="text-white/70 text-sm leading-relaxed italic">
              "YükLe sayesinde boş dönüş sefarlerimde yük bulabiliyorum. Harika bir platform."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center">
                <Truck size={13} className="text-accent" />
              </div>
              <span className="text-white/40 text-xs font-medium">Aktif Nakliyeci Kullanıcısı</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/10">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
            © 2026 YükLe Lojistik Platformu
          </p>
        </div>
      </div>

      {/* Sağ panel — form */}
      <div className={`flex items-center justify-center p-8 ${t.page} overflow-y-auto`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm py-6"
        >
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                <Truck size={18} className="text-white" />
              </div>
              <span className="text-xl font-black text-fg">YükLe</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className={`text-2xl font-black ${t.heading} mb-2`}>Hesap Oluştur</h1>
            <p className={`text-sm ${t.sub}`}>Tamamen ücretsiz, hemen başlayın.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Rol seçimi */}
            <div>
              <p className={`text-sm font-semibold ${t.sub} mb-3`}>
                Hesap Türü <span className="text-red-400">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                      role === r.id
                        ? `${r.bg} ${r.border}`
                        : `${t.card} hover:border-border-light/50`
                    }`}
                  >
                    {role === r.id && (
                      <CheckCircle2 size={15} className={`absolute top-3 right-3 ${r.color}`} />
                    )}
                    <div className={`w-9 h-9 rounded-xl ${r.bg} flex items-center justify-center mb-3`}>
                      <r.icon size={18} className={r.color} />
                    </div>
                    <p className={`text-sm font-bold ${role === r.id ? r.color : t.heading}`}>{r.title}</p>
                    <p className={`text-xs mt-0.5 ${t.muted}`}>{r.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${t.sub} mb-2`}>
                Ad Soyad <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                  placeholder="Adınız Soyadınız" />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${t.sub} mb-2`}>
                Telefon <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                  placeholder="05XX XXX XX XX" />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${t.sub} mb-2`}>
                E-posta <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                  placeholder="ornek@email.com" />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${t.sub} mb-2`}>
                Şifre <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                  placeholder="En az 6 karakter" />
              </div>
            </div>

            <button type="submit" disabled={loading || !role}
              className={`w-full py-3.5 font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 ${t.btnPrimary}`}>
                {loading
                  ? <><Loader2 size={16} className="animate-spin" />Kayıt yapılıyor...</>
                  : <><ArrowRight size={16} />Ücretsiz Kayıt Ol</>
                }
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${t.divider}`}></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`${t.page} px-2 ${t.muted}`}>VEYA</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className={`w-full py-3.5 rounded-xl font-bold text-sm border ${t.btnSecondary} flex items-center justify-center gap-3 transition-all hover:bg-white/5`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google ile Giriş Yap
              </button>

            <p className={`text-xs ${t.muted} text-center`}>
              Kayıt olarak{' '}
              <Link href="/kullanim-sartlari" className={`${t.accent} hover:underline`}>Kullanım Şartları</Link>'nı ve{' '}
              <Link href="/kvkk" className={`${t.accent} hover:underline`}>KVKK</Link>'yı kabul etmiş olursunuz.
            </p>
          </form>

          <p className={`text-center text-sm ${t.muted} mt-6`}>
            Hesabınız var mı?{' '}
            <Link href="/giris" className={`${t.accent} font-semibold hover:underline`}>Giriş Yapın</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

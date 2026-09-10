'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Truck, Package, CheckCircle2, Loader2, Star } from 'lucide-react';
import { useT } from '@/hooks/useT';
import { motion } from 'framer-motion';
import { getAppTranslation } from '@/utils/getAppTranslation';

export function RegisterPageClient() {
  const t = useT();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const c = getAppTranslation(locale);
  const { user, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'shipper' | 'driver' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = [
    { num: '01', label: c.auth.step1 },
    { num: '02', label: c.auth.step2 },
    { num: '03', label: c.auth.step3 },
  ];

  const roles = [
    {
      id: 'shipper' as const,
      icon: Package,
      title: c.auth.roleShipperTitle,
      subtitle: c.auth.roleShipperSubtitle,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
    },
    {
      id: 'driver' as const,
      icon: Truck,
      title: c.auth.roleDriverTitle,
      subtitle: c.auth.roleDriverSubtitle,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/30',
    },
  ];

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);
  if (user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) { setError(c.auth.selectRoleError); return; }
    if (!fullName.trim()) { setError(c.auth.fullNameRequired); return; }
    if (!phone.trim()) { setError(c.auth.phoneRequired); return; }
    if (password.length < 6) { setError(c.auth.passwordTooShortError); return; }
    const nameParts = fullName.trim().split(' ').filter(p => p.length > 0);
    if (nameParts.length < 2) { setError(c.auth.enterFullName); return; }
    if (nameParts.some(p => p.length < 2)) { setError(c.auth.nameMinLength); return; }
    // International phone: keep digits and a leading +, require 7-15 digits (E.164 range)
    // rather than the Turkey-only "05XX..." format this used to enforce.
    const phoneDigits = phone.trim().replace(/[\s\-()]/g, '');
    if (!/^\+?[0-9]{7,15}$/.test(phoneDigits)) {
      setError(c.auth.invalidPhone);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError(c.auth.invalidEmail); return; }
    setError('');
    setLoading(true);
    const { data: phoneCheck } = await supabase.from('profiles').select('id').eq('phone', phoneDigits).maybeSingle();
    if (phoneCheck) { setError(c.auth.phoneAlreadyRegistered); setLoading(false); return; }
    const { data, error: err } = await signUp(email, password, { full_name: fullName.trim(), phone: phoneDigits, role });
    if (err) {
      if (err.message === 'User already registered' || err.message?.includes('already registered')) setError(c.auth.emailAlreadyRegisteredErr);
      else if (err.message?.includes('email')) setError(c.auth.invalidEmailErr);
      else if (err.message?.includes('password')) setError(c.auth.weakPasswordErr);
      else setError(err.message);
    } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
      // Supabase mevcut kullanıcı için hata değil boş identities döndürür
      setError(c.auth.emailRegisteredPleaseLogin);
    } else {
      router.push('/');
    }
    setLoading(false);
  }

  async function handleGoogleSignup() {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : c.auth.googleSignupFailed);
    }
  }

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
            <span className="text-2xl font-black text-white tracking-tight">Loadly</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-5">
            {c.auth.registerTaglineLine1}<br />
            <span className="text-accent">{c.auth.registerTaglineLine2}</span>
          </h2>
          <p className="text-white/50 text-lg font-medium mb-14 leading-relaxed">
            {c.auth.registerTaglineDesc}
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
              {c.auth.testimonial}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center">
                <Truck size={13} className="text-accent" />
              </div>
              <span className="text-white/40 text-xs font-medium">{c.auth.activeCarrierUser}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/10">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
            {c.auth.footerCopyright}
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
              <span className="text-xl font-black text-fg">Loadly</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className={`text-2xl font-black ${t.heading} mb-2`}>{c.auth.createAccount}</h1>
            <p className={`text-sm ${t.sub}`}>{c.auth.createAccountSubtitle}</p>
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
                {c.auth.accountType} <span className="text-red-400">*</span>
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
              <label htmlFor="register-fullname" className={`block text-sm font-medium ${t.sub} mb-2`}>
                {c.profile.fullName} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                <input id="register-fullname" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                  placeholder={c.auth.fullNamePlaceholder} />
              </div>
            </div>

            <div>
              <label htmlFor="register-phone" className={`block text-sm font-medium ${t.sub} mb-2`}>
                {c.auth.phoneNumber} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                <input id="register-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                  placeholder={c.auth.phonePlaceholderIntl} />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className={`block text-sm font-medium ${t.sub} mb-2`}>
                {c.auth.emailLabel} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                  placeholder={c.auth.emailPlaceholder} />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className={`block text-sm font-medium ${t.sub} mb-2`}>
                {c.auth.passwordLabel} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.muted}`} />
                <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none ${t.input}`}
                  placeholder={c.auth.newPasswordPlaceholder} />
              </div>
            </div>

            <button type="submit" disabled={loading || !role}
              className={`w-full py-3.5 font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 ${t.btnPrimary}`}>
                {loading
                  ? <><Loader2 size={16} className="animate-spin" />{c.auth.registering}</>
                  : <><ArrowRight size={16} />{c.auth.registerBtn}</>
                }
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${t.divider}`}></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`${t.page} px-2 ${t.muted}`}>{c.auth.or}</span>
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
                {c.auth.googleSignup}
              </button>

            <p className={`text-xs ${t.muted} text-center`}>
              {c.auth.agreementPrefix}{' '}
              <Link href="/terms" className={`${t.accent} hover:underline`}>{c.auth.termsLink}</Link>{' '}{c.auth.agreementAnd}{' '}
              <Link href="/privacy-policy" className={`${t.accent} hover:underline`}>{c.auth.privacyLink}</Link>{c.auth.agreementSuffix}
            </p>
          </form>

          <p className={`text-center text-sm ${t.muted} mt-6`}>
            {c.auth.alreadyHaveAccount}{' '}
            <Link href="/login" className={`${t.accent} font-semibold hover:underline`}>{c.auth.loginLink}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

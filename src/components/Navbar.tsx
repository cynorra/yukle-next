'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Logo from '@/components/Logo';
import PointsBadge from '@/components/PointsBadge';
import NotificationBell from '@/components/NotificationBell';
import { useTranslation } from '@/hooks/useTranslation';
import type { Locale } from '@/utils/translations';
import { Menu, X, Package, Truck, User, LogOut, MessageSquare, Sun, Moon, BookOpen, Globe, ChevronDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
] as const;

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t, locale, changeLocale } = useTranslation();

  const isActive = (path: string) => pathname === path;

  // Close language dropdown on click outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const navLinks = user ? [
    { to: `/${locale}/marketplace`, label: t.nav.marketplace, icon: Package },
    ...(profile?.role === 'shipper' ? [{ to: `/${locale}/create-load`, label: t.marketplace.postLoadBtn, icon: Package }] : []),
    ...(profile?.role === 'driver' ? [{ to: `/${locale}/routes`, label: t.nav.routes, icon: Truck }] : []),
    { to: `/${locale}/messages`, label: t.nav.messages, icon: MessageSquare },
    { to: `/${locale}/blog`, label: t.nav.blog, icon: BookOpen },
    { to: `/${locale}/dashboard`, label: t.nav.dashboard, icon: User },
  ] : [
    { to: `/${locale}/marketplace`, label: t.nav.marketplace, icon: Package },
    { to: `/${locale}/blog`, label: t.nav.blog, icon: BookOpen }
  ];

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <Logo size="small" />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-base font-bold transition-all duration-200",
                    isActive(link.to)
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:text-fg hover:bg-surface-light dark:hover:bg-surface-dark"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-dark/50 hover:bg-surface-light dark:hover:bg-surface-dark text-muted hover:text-fg transition-all text-sm font-bold"
              >
                <Globe size={16} />
                <span>{currentLang.flag}</span>
                <ChevronDown size={14} className={cn("transition-transform duration-200", langOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 max-h-80 overflow-y-auto bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl z-50 py-1.5 scrollbar-thin"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLocale(lang.code as Locale);
                          setLangOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm font-semibold flex items-center gap-2 hover:bg-background-light dark:hover:bg-background-dark transition-colors",
                          locale === lang.code ? "text-accent bg-accent/5" : "text-fg/80"
                        )}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <>
                {profile && (
                  <Link href={`/${locale}/profile`}>
                    <PointsBadge points={profile.points ?? 0} size="sm" />
                  </Link>
                )}
                <NotificationBell />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-muted hover:text-fg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                
                <div className="h-4 w-[1px] bg-border-light dark:bg-border-dark mx-1" />
                
                <Link
                  href={`/${locale}/user/${user.id}`}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/30 transition-all group"
                >
                  <User size={16} className="text-muted group-hover:text-accent" />
                  <span className="text-sm font-bold max-w-[150px] truncate">{profile?.full_name}</span>
                </Link>

                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-full text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-muted hover:text-fg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <Link href={`/${locale}/login`} className="text-base font-bold text-muted hover:text-fg transition-colors px-3">
                  {t.nav.login}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="px-6 py-2.5 rounded-full text-base font-black bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Lang Button */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 p-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-dark/50 text-muted"
              >
                <Globe size={18} />
                <span>{currentLang.flag}</span>
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 max-h-60 overflow-y-auto bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl z-50 py-1"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLocale(lang.code as Locale);
                          setLangOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-background-light dark:hover:bg-background-dark",
                          locale === lang.code ? "text-accent bg-accent/5" : "text-fg/80"
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user && <NotificationBell />}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-muted hover:text-fg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    isActive(link.to)
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:text-fg hover:bg-surface-light dark:hover:bg-surface-dark"
                  )}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 pb-2 border-t border-border-light dark:border-border-dark mt-4">
                {user ? (
                  <div className="space-y-1">
                    <div className="px-4 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted">
                      {t.nav.profile}
                    </div>
                    <Link
                      href={`/${locale}/profile`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-fg"
                    >
                      <Zap size={20} className="text-accent" />
                      {profile?.points ?? 0} {t.dashboard.points}
                    </Link>
                    <button
                      onClick={() => { signOut(); setOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={20} />
                      {t.nav.logout}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 p-2">
                    <Link
                      href={`/${locale}/login`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl border border-border-light dark:border-border-dark text-fg font-medium"
                    >
                      {t.nav.login}
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-accent text-white font-bold"
                    >
                      {t.nav.register}
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-surface-light dark:bg-surface-dark rounded-xl mt-4">
                <span className="text-sm font-medium text-muted">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-background-light dark:bg-background-dark text-fg border border-border-light dark:border-border-dark"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

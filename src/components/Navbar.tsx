'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Logo from '@/components/Logo';
import PointsBadge from '@/components/PointsBadge';
import NotificationBell from '@/components/NotificationBell';
import { Menu, X, Package, Truck, User, LogOut, MessageSquare, Zap, Sun, Moon, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const navLinks = user ? [
    { to: '/pazar', label: 'Pazar', icon: Package },
    ...(profile?.role === 'shipper' ? [{ to: '/yuk-olustur', label: 'İlan Ver', icon: Package }] : []),
    ...(profile?.role === 'driver' ? [{ to: '/guzergahlarim', label: 'Güzergah', icon: Truck }] : []),
    { to: '/mesajlar', label: 'Mesajlar', icon: MessageSquare },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    { to: '/panel', label: 'Panel', icon: User },
  ] : [
    { to: '/pazar', label: 'Pazar', icon: Package },
    { to: '/blog', label: 'Blog', icon: BookOpen }
  ];

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
            {user ? (
              <>
                {profile && <Link href="/profil"><PointsBadge points={profile.points ?? 0} size="sm" /></Link>}
                <NotificationBell />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-muted hover:text-fg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                
                <div className="h-4 w-[1px] bg-border-light dark:bg-border-dark mx-1" />
                
                <Link
                  href={`/kullanici/${user.id}`}
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
                <Link href="/giris" className="text-base font-bold text-muted hover:text-fg transition-colors px-3">
                  Giriş
                </Link>
                <Link
                  href="/kayit"
                  className="px-6 py-2.5 rounded-full text-base font-black bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
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
                      Profil
                    </div>
                    <Link
                      href="/profil"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-fg"
                    >
                      <Zap size={20} className="text-accent" />
                      {profile?.points ?? 0} Puan
                    </Link>
                    <button
                      onClick={() => { signOut(); setOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={20} />
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 p-2">
                    <Link
                      href="/giris"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl border border-border-light dark:border-border-dark text-fg font-medium"
                    >
                      Giriş
                    </Link>
                    <Link
                      href="/kayit"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-accent text-white font-bold"
                    >
                      Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-surface-light dark:bg-surface-dark rounded-xl mt-4">
                <span className="text-sm font-medium text-muted">Görünüm</span>
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

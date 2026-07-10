'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/hooks/useT';
import { Bell, MessageCircle, TrendingUp, CheckCircle2, X, Clock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextureCard, TextureCardHeader, TextureCardTitle, TextureCardContent, TextureSeparator } from '@/components/ui/texture-card';
import { TextureButton } from '@/components/ui/texture-button';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  load_id: string | null;
  read: boolean;
  created_at: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  offer: <TrendingUp size={16} className="text-[#F5A623]" />,
  offer_accepted: <CheckCircle2 size={16} className="text-green-400" />,
  offer_rejected: <X size={16} className="text-red-400" />,
  message: <MessageCircle size={16} className="text-blue-400" />,
  load_completed: <CheckCircle2 size={16} className="text-green-400" />,
  info: <Bell size={16} className="text-gray-400" />,
};

export default function NotificationBell() {
  const t = useT();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const channel = supabase.channel(`notifications:${user.id}:${Math.random()}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (p) => {
        setNotifications((prev) => [p.new as Notification, ...prev].slice(0, 30));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function fetchNotifications() {
    if (!user) return;
    const { data } = await supabase.from('notifications')
      .select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(30);
    setNotifications((data as Notification[]) || []);
  }

  async function markAllRead() {
    if (!user) return;
    await supabase.from('notifications').update({ read: true })
      .eq('user_id', user.id).eq('read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        setSwRegistration(reg);
        reg.pushManager.getSubscription().then(sub => {
          setIsSubscribed(!!sub);
        });
      }).catch(err => console.error('SW Error:', err));
    }
  }, []);

  async function subscribeToPush() {
    if (!swRegistration || !user) return;
    try {
      const sub = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BIhhzgiPFdz97HTtlKaz8XbSWsofsvPRZ6UJdN6fXlansjKf1ztvA9beQwsLoExJ8uX6m0uKdzgLo_uE3DgleOE'
      });
      await supabase.from('push_subscriptions').insert({
        user_id: user.id,
        subscription: JSON.parse(JSON.stringify(sub))
      });
      setIsSubscribed(true);
    } catch (e) {
      console.error('Push Subscription failed:', e);
    }
  }

  async function markRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <TextureButton 
        variant="icon"
        onClick={() => setOpen(!open)}
        className={cn("relative p-2", open && "bg-accent/10 text-accent")}
      >
        <Bell size={22} className={cn("transition-transform duration-300", open && "scale-110")} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background-light dark:border-background-dark shadow-lg shadow-accent/20">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </TextureButton>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-85 sm:w-96 z-50 shadow-2xl"
          >
            <TextureCard className={cn("w-full overflow-hidden backdrop-blur-2xl", t.isDark ? "bg-background-dark/80" : "bg-white/80")}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <TextureCardTitle className={cn("text-base font-black tracking-tight", t.heading)}>Bildirimler</TextureCardTitle>
                <p className={cn("text-[10px] font-bold uppercase tracking-wider pl-2", t.muted)}>
                  {unreadCount > 0 ? `${unreadCount} YENİ BİLDİRİM` : "TÜMÜ OKUNDU"}
                </p>
              </div>
              {unreadCount > 0 && (
                <TextureButton 
                  variant="minimal"
                  size="sm"
                  onClick={markAllRead} 
                  className="!px-3 !py-1.5 !text-xs font-bold"
                >
                  <Check size={14} className="mr-1 inline-block" />
                  Hepsini Oku
                </TextureButton>
              )}
            </div>
            
            <TextureSeparator />

            <div className="max-h-[420px] overflow-y-auto scrollbar-none pb-2">
              {notifications.length === 0 ? (
                <div className={cn("py-16 text-center", t.muted)}>
                  <div className="w-16 h-16 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Bell size={28} className="opacity-20" />
                  </div>
                  <p className="text-sm font-medium">Henüz bildiriminiz yok</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 p-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => { markRead(n.id); setOpen(false); }}
                      className={cn(
                        "group flex items-start gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer relative",
                        !n.read 
                          ? (t.isDark ? "bg-accent/10" : "bg-accent/5") 
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      {!n.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                      
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                        t.isDark ? "bg-white/10" : "bg-black/5"
                      )}>
                        {TYPE_ICONS[n.type] || TYPE_ICONS.info}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm font-bold leading-tight",
                            n.read ? t.sub : t.heading
                          )}>
                            {n.title}
                          </p>
                          <span className={cn("text-[10px] font-medium whitespace-nowrap pt-0.5", t.muted)}>
                            {new Date(n.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className={cn("text-xs leading-relaxed mt-1 line-clamp-2", t.muted)}>
                          {n.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className={cn("flex items-center gap-1.5 text-[10px] font-bold", t.mutedDark)}>
                            <Clock size={10} />
                            {new Date(n.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                          </div>
                          
                          {n.load_id && (
                            <Link 
                              href={`/pazar/${n.load_id}`} 
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] font-black text-accent uppercase tracking-wider hover:underline"
                            >
                              Detayı Gör
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <TextureSeparator />
            <div className={cn("px-4 py-3 text-center flex flex-col gap-2")}>
              {!isSubscribed && typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'denied' && (
                <TextureButton onClick={subscribeToPush} variant="accent" className="w-full !rounded-xl">
                  Bildirimleri Aç
                </TextureButton>
              )}
              {notifications.length > 0 && (
                <TextureButton variant="minimal" onClick={() => setOpen(false)} className="w-full !rounded-xl text-xs">
                  Kapat
                </TextureButton>
              )}
            </div>
            </TextureCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
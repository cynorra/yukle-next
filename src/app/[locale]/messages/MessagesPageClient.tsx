'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Conversation, Message } from '@/types/database';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/Toast';
import { POINT_REWARDS } from '@/types/database';
import { MessageCircle, Phone, Clock, ChevronRight, Send, ArrowLeft, Package, Loader2, PhoneCall, User, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '@/components/EmptyState';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConversationWithDetails extends Conversation {
  load?: { id: string; title: string; title_translations?: Record<string, string> | null; };
  other_user?: { id: string; full_name: string; company_name: string | null; };
}

export function MessagesPageClient() {
  const t = useT();
  const { user } = useAuth();
  const { locale } = useTranslation();
  const toast = useToast();
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();

  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConv, setActiveConv] = useState<ConversationWithDetails | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sharingPhone, setSharingPhone] = useState(false);
  const [otherPhone, setOtherPhone] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstMessageSent = useRef(false);

  useEffect(() => { if (!user) return; fetchConversations(); }, [user]);

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        setActiveConv(conv);
        fetchMessages(conv.id);
        subscribeMessages(conv.id);
        if (conv.phone_shared_by) fetchOtherPhone(conv);
      }
    }
  }, [conversationId, conversations]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function fetchConversations() {
    if (!user) return;
    const { data } = await supabase.from('conversations')
      .select('*')
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (!data) { setLoading(false); return; }

    // Her conversation için yük adı ve karşı taraf bilgisi enrichment:
    const enriched = await Promise.all((data as Conversation[]).map(async (conv) => {
      const otherId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
      const [loadRes, userRes] = await Promise.all([
        supabase.from('loads').select('id, title, title_translations').eq('id', conv.load_id).single(),
        supabase.from('public_profiles').select('id, full_name, company_name').eq('id', otherId).single(),
      ]);
      return { ...conv, load: loadRes.data || undefined, other_user: userRes.data || undefined };
    }));

    setConversations(enriched as ConversationWithDetails[]);
    setLoading(false);
  }

  async function fetchMessages(convId: string) {
    const { data } = await supabase.from('messages').select('*')
      .eq('conversation_id', convId).order('created_at', { ascending: true });
    setMessages((data as Message[]) || []);
    if (user) {
      await supabase.from('messages').update({ read: true })
        .eq('conversation_id', convId).eq('receiver_id', user.id).eq('read', false);
    }
  }

  function subscribeMessages(convId: string) {
    const channel = supabase.channel(`messages:${convId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` },
        (p) => setMessages((prev) => [...prev, p.new as Message]))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }

  async function fetchOtherPhone(conv: ConversationWithDetails) {
    if (!user) return;
    const { data } = await supabase.rpc('get_shared_phone', {
      p_conversation_id: conv.id, p_requester_id: user.id,
    });
    if (data) setOtherPhone(data);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeConv || !newMessage.trim()) return;
    setSending(true);
    const receiverId = activeConv.participant_1 === user.id ? activeConv.participant_2 : activeConv.participant_1;
    const { error } = await supabase.from('messages').insert({
      conversation_id: activeConv.id, load_id: activeConv.load_id,
      sender_id: user.id, receiver_id: receiverId,
      content: newMessage.trim(), read: false,
    });
    if (error) {
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      setSending(false);
      return;
    }
    {
      await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', activeConv.id);
      if (!firstMessageSent.current && messages.length === 0) {
        firstMessageSent.current = true;
        await supabase.rpc('add_points', { p_user_id: user.id, p_points: POINT_REWARDS.first_message, p_reason: 'first_message', p_description: 'İlk mesaj bonusu', p_load_id: activeConv.load_id });
      }
      setNewMessage('');
    }
    setSending(false);
  }

  async function sharePhone() {
    if (!user || !activeConv) return;
    setSharingPhone(true);
    const { error: shareErr } = await supabase.from('conversations').update({ phone_shared_by: user.id, phone_shared_at: new Date().toISOString() }).eq('id', activeConv.id);
    if (shareErr) { toast.error('Telefon paylaşılamadı.'); setSharingPhone(false); return; }
    setActiveConv((prev) => prev ? { ...prev, phone_shared_by: user.id } : prev);
    setSharingPhone(false);
    await fetchOtherPhone(activeConv);
  }

  // Conversation list
  if (!conversationId) {
    return (
      <div className={t.pageFull}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
              <MessageCircle size={28} className="text-[#F5A623]" />Mesajlar
            </h1>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className={`w-8 h-8 border-2 ${t.spinner} rounded-full animate-spin`} />
            </div>
          ) : conversations.length === 0 ? (
            <EmptyState 
              icon={MessageCircle}
              title="Henüz mesaj yok"
              description="Teklifler kabul edildikten sonra burada mesajlaşma listesi görünür."
              action={{
                label: 'İlanlarıma Git',
                onClick: () => router.push('/panel'),
                icon: Package
              }}
            />
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => (
                <button key={conv.id} onClick={() => router.push(`/mesajlar/${conv.id}`)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl ${t.card} ${t.cardHover} transition-all group text-left`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center shrink-0 text-[#F5A623] font-bold">
                      {conv.other_user?.full_name?.[0]?.toUpperCase() ?? <User size={18} />}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm ${t.heading} font-medium truncate`}>
                        {conv.other_user?.full_name ?? 'Kullanıcı'}
                        {conv.other_user?.company_name && <span className={`${t.muted} font-normal ml-1`}>· {conv.other_user.company_name}</span>}
                      </div>
                      <div className={`text-xs ${t.muted} flex items-center gap-1 mt-0.5 truncate`}>
                        <Package size={11} />{conv.load?.title_translations?.[locale] || conv.load?.title || `Yük #${conv.load_id.slice(0, 8)}`}
                      </div>
                      <div className={`text-xs ${t.mutedDark} flex items-center gap-1 mt-0.5`}>
                        <Clock size={11} />
                        {new Date(conv.last_message_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {conv.phone_shared_by && (
                      <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
                        <Phone size={11} />Telefon
                      </span>
                    )}
                    <ChevronRight size={16} className={`${t.mutedDark} group-hover:text-[#F5A623] transition-colors`} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat view
  const otherId = activeConv ? (activeConv.participant_1 === user?.id ? activeConv.participant_2 : activeConv.participant_1) : null;

  return (
    <div className={`${t.pageFull} flex flex-col`}>
      {/* Chat header */}
      <div className={cn(
        "sticky top-16 z-20 px-4 py-4 border-b transition-all duration-300",
        t.divider,
        t.isDark ? "bg-background-dark/80 backdrop-blur-md" : "bg-white/80 backdrop-blur-md"
      )}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => router.push('/mesajlar')} 
              className={cn(
                "p-2 rounded-xl transition-all hover:bg-surface-light dark:hover:bg-surface-dark group",
                t.sub
              )}
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="min-w-0">
              <div className={cn("text-lg font-black tracking-tight flex items-center gap-2", t.heading)}>
                {activeConv?.other_user?.full_name ?? 'Kullanıcı'}
                {otherId && (
                  <Link href={`/kullanici/${otherId}`} className="shrink-0 p-1 hover:bg-accent/10 rounded-lg transition-colors">
                    <ExternalLink size={14} className={cn("text-muted/60 hover:text-accent transition-colors")} />
                  </Link>
                )}
              </div>
              <div className={cn("text-xs font-bold flex items-center gap-1.5", t.muted)}>
                <Package size={12} className="text-accent shrink-0" />
                {activeConv?.load_id ? (
                  <Link href={`/pazar/${activeConv.load_id}`} className="hover:text-accent transition-colors truncate">
                    {activeConv?.load?.title_translations?.[locale] || activeConv?.load?.title || `Yük #${activeConv?.load_id?.slice(0, 8)}`}
                  </Link>
                ) : (activeConv?.load?.title_translations?.[locale] || activeConv?.load?.title || 'İlan')}
              </div>
            </div>
          </div>

          {/* Telefon paylaş */}
          {activeConv && !activeConv.phone_shared_by ? (
            <button onClick={sharePhone} disabled={sharingPhone}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-green-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0">
              {sharingPhone ? <Loader2 size={14} className="animate-spin" /> : <PhoneCall size={14} />}
              <span className="hidden sm:inline">Telefon Paylaş</span>
            </button>
          ) : activeConv?.phone_shared_by ? (
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 border border-green-500/20">
                <Phone size={12} />Paylaşıldı
              </span>
              {otherPhone && activeConv.phone_shared_by !== user?.id && (
                <a href={`tel:${otherPhone}`} className="text-sm text-accent font-black hover:underline tracking-tight">{otherPhone}</a>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-4">
        {messages.length === 0 && (
          <div className={cn("text-center py-20 font-medium", t.muted)}>
            <div className="w-16 h-16 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-accent/30" />
            </div>
            Henüz mesaj yok. İlk mesajı gönderin ve <br />
            <span className="text-accent font-black">+{POINT_REWARDS.first_message} puan</span> kazanın!
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMine = msg.sender_id === user?.id;
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn("flex", isMine ? 'justify-end' : 'justify-start')}
              >
                <div className={cn(
                  "max-w-[85%] sm:max-w-[70%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm relative group",
                  isMine 
                    ? "bg-accent text-white rounded-br-sm shadow-accent/10" 
                    : cn(t.card, "rounded-bl-sm")
                )}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className={cn(
                    "text-[10px] mt-1.5 font-bold flex items-center gap-1 opacity-60",
                    isMine ? "text-white/80" : t.muted
                  )}>
                    <Clock size={10} />
                    {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={cn(
        "sticky bottom-0 border-t px-4 py-6 transition-all duration-300",
        t.divider,
        t.isDark ? "bg-background-dark/80 backdrop-blur-md" : "bg-white/80 backdrop-blur-md"
      )}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={sendMessage} className="flex gap-3 items-center">
            <div className="flex-1 relative group">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className={cn(
                  "w-full pl-5 pr-5 py-4 rounded-2xl outline-none transition-all font-medium text-sm",
                  t.input
                )} 
              />
            </div>
            <button 
              type="submit" 
              disabled={sending || !newMessage.trim()}
              className="h-12 w-12 sm:w-auto sm:px-8 rounded-2xl bg-accent text-white font-bold disabled:opacity-30 shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              <span className="hidden sm:inline">Gönder</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
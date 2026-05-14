'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  Weight, Package, Clock, User, Star, Truck, Send,
  MessageSquare, Shield, ArrowLeft, Phone, CheckCircle2, CircleDot,
  Loader2, TrendingUp, X, Check, Zap, Heart, ExternalLink, Share2, PenLine,
} from 'lucide-react';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/Toast';
import ReviewModal from '@/components/ReviewModal';
import LoadTagBadge from '@/components/LoadTagBadge';
import DeliveryDaysBadge from '@/components/DeliveryDaysBadge';

interface LoadWithRelations {
  id: string;
  title: string;
  shipper_id: string;
  origin_city_id: number;
  origin_district_id: number | null;
  destination_city_id: number;
  destination_district_id: number | null;
  price: number | null;
  load_type: string;
  required_truck_type: string | null;
  weight_ton: number;
  description: string | null;
  pickup_date: string | null;
  delivery_date: string | null;
  tags: string[];
  status: 'active' | 'in_transit' | 'completed' | 'cancelled';
  assigned_driver_id: string | null;
  shipper_confirmed: boolean;
  driver_confirmed: boolean;
  shipper_confirmed_at: string | null;
  driver_confirmed_at: string | null;
  created_at: string;
  origin_city: { id: number; name: string };
  destination_city: { id: number; name: string };
  origin_district: { id: number; name: string } | null;
  destination_district: { id: number; name: string } | null;
  shipper: { id: string; full_name: string; rating: number; is_verified: boolean; company_name: string | null; avatar_url: string | null; };
}

interface Offer {
  id: string;
  load_id: string;
  driver_id: string;
  price: number | null;
  note: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  driver?: { id: string; full_name: string; company_name: string | null; rating: number; is_verified: boolean; points: number; };
}

interface ConversationData {
  id: string;
  load_id: string;
  participant_1: string;
  participant_2: string;
  phone_shared_by: string | null;
  phone_shared_at: string | null;
}

interface MessageData {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Aktif', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  in_transit: { label: 'Taşınıyor', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  completed: { label: 'Tamamlandı', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  cancelled: { label: 'İptal', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

const LOAD_TYPES: Record<string, string> = { general: 'Genel Kargo', hazardous: 'Tehlikeli Madde', perishable: 'Bozulabilir', oversized: 'Aşırı Büyük', fragile: 'Kırılgan' };
const TRUCK_TYPES: Record<string, string> = { tir: 'TIR', kamyon: 'Kamyon', kamyonet: 'Kamyonet', dorser: 'Dorser', tanker: 'Tanker', frigorifik: 'Frigorifik' };

function formatPrice(price: number | null) {
  if (price === null) return 'Belirtilmedi';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}
function formatDate(d: string | null) {
  if (!d) return 'Belirtilmedi';
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatTime(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

interface LoadDetailClientProps {
  load: LoadWithRelations;
}

export function LoadDetailClient({ load: initialLoad }: LoadDetailClientProps) {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? initialLoad.id;
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const toast = useToast();

  // İlk render server'dan gelen veri; sonra client realtime ile güncellenebilir
  const [load, setLoad] = useState<LoadWithRelations | null>(initialLoad);
  const t = useT();
  // SEO meta server'da generateMetadata ile üretiliyor; burada hook çağrısına gerek yok.
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [myOffer, setMyOffer] = useState<Offer | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [acceptingOffer, setAcceptingOffer] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [otherPhone, setOtherPhone] = useState<string | null>(null);
  const [sharingPhone, setSharingPhone] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ id: string; name: string } | null>(null);

  const isOwner = user?.id === load?.shipper_id;
  const isAssignedDriver = user?.id === load?.assigned_driver_id;
  const isDriver = !isOwner && user !== null && profile?.role === 'driver';
  const canConfirm = (isOwner || isAssignedDriver) && load?.status === 'in_transit';
  const bothConfirmed = load?.shipper_confirmed && load?.driver_confirmed;

  useEffect(() => { if (id) fetchLoad(); }, [id]);
  useEffect(() => {
    if (user && load) {
      if (isOwner && load.status === 'active') fetchOffers();
      if (!isOwner && load.status === 'active') fetchMyOffer();
      if (!isOwner || load.status !== 'active') fetchOrCreateConversation();
      if (isOwner && load.status !== 'active') fetchOwnerConversation();
    }
  }, [user, load?.id, load?.status]);

  useEffect(() => {
    if (!conversation) return;
    fetchMessages(conversation.id);
    const channel = supabase.channel(`conv-${conversation.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.id}` },
        (p) => setMessages((prev) => prev.some((m) => m.id === p.new.id) ? prev : [...prev, p.new as MessageData]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations', filter: `id=eq.${conversation.id}` },
        (p) => setConversation(p.new as ConversationData))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversation?.id]);

  useEffect(() => {
    if (conversation?.phone_shared_by && user) fetchOtherPhone();
  }, [conversation?.phone_shared_by]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => { if (user && load) checkFavorite(); }, [user, load?.id]);

  async function checkFavorite() {
    if (!user || !load) return;
    const { data } = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('load_id', load.id).maybeSingle();
    setIsFavorite(!!data);
  }

  async function toggleFavorite() {
    if (!user || !load) return;
    setTogglingFav(true);
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('load_id', load.id);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, load_id: load.id });
      setIsFavorite(true);
    }
    setTogglingFav(false);
  }

  async function fetchLoad() {
    setLoading(true);
    const { data } = await supabase.from('loads').select(`*,
      origin_city:cities!loads_origin_city_id_fkey(id, name),
      destination_city:cities!loads_destination_city_id_fkey(id, name),
      origin_district:districts!loads_origin_district_id_fkey(id, name),
      destination_district:districts!loads_destination_district_id_fkey(id, name),
      shipper:public_profiles!loads_shipper_id_fkey(id, full_name, rating, is_verified, company_name, avatar_url)`)
      .eq('id', id!).single();
    if (data) setLoad(data as unknown as LoadWithRelations);
    setLoading(false);
  }

  async function fetchOffers() {
    const { data } = await supabase.from('offers')
      .select('*, driver:public_profiles!offers_driver_id_fkey(id, full_name, company_name, rating, is_verified, points)')
      .eq('load_id', id!)
      .order('created_at', { ascending: false });
    setOffers((data as unknown as Offer[]) || []);
  }

  async function fetchMyOffer() {
    if (!user) return;
    const { data } = await supabase.from('offers')
      .select('*').eq('load_id', id!).eq('driver_id', user.id).maybeSingle();
    setMyOffer(data as Offer | null);
    if (data) { setOfferPrice(data.price?.toString() || ''); setOfferNote(data.note || ''); }
  }

  async function fetchOrCreateConversation() {
    if (!user || !load) return;
    const { data: existing } = await supabase.from('conversations')
      .select('*').eq('load_id', load.id)
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`).maybeSingle();
    if (existing) { setConversation(existing); return; }
    const { data: created } = await supabase.from('conversations').insert({
      load_id: load.id, participant_1: load.shipper_id, participant_2: user.id,
      last_message_at: new Date().toISOString(),
    }).select('*').single();
    if (created) setConversation(created);
  }

  async function fetchOwnerConversation() {
    if (!user || !load || !load.assigned_driver_id) return;
    const { data } = await supabase.from('conversations').select('*')
      .eq('load_id', load.id)
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`).maybeSingle();
    if (data) setConversation(data);
  }

  async function fetchMessages(convId: string) {
    const { data } = await supabase.from('messages').select('id, sender_id, content, created_at')
      .eq('conversation_id', convId).order('created_at', { ascending: true });
    if (data) setMessages(data);
    // Okunmamışları okundu yap
    if (user) {
      await supabase.from('messages').update({ read: true })
        .eq('conversation_id', convId).eq('receiver_id', user.id).eq('read', false);
    }
  }

  async function fetchOtherPhone() {
    if (!user || !conversation) return;
    const { data } = await supabase.rpc('get_shared_phone', {
      p_conversation_id: conversation.id, p_requester_id: user.id,
    });
    if (data) setOtherPhone(data);
  }

  async function handleSubmitOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !load) return;
    setOfferError(null);
    if (!offerNote.trim() && !offerPrice) {
      setOfferError('Fiyat veya not girmelisiniz.');
      return;
    }
    if (!myOffer && (profile?.points ?? 0) < 10) {
      setOfferError('Yetersiz puan! Teklif vermek için 10 puana ihtiyacınız var.');
      return;
    }

    setSubmittingOffer(true);
    if (myOffer) {
      // Güncelle
      const { error } = await supabase.from('offers').update({
        price: offerPrice ? Number(offerPrice) : null,
        note: offerNote.trim() || null,
      }).eq('id', myOffer.id);
      if (!error) { 
        await fetchMyOffer(); 
        await refreshProfile?.();
      }
    } else {
      // Yeni teklif
      const { data, error } = await supabase.from('offers').insert({
        load_id: load.id, driver_id: user.id,
        price: offerPrice ? Number(offerPrice) : null,
        note: offerNote.trim() || null,
        status: 'pending',
      }).select('*').single();
      if (!error && data) {
        setMyOffer(data as Offer);
        await refreshProfile?.();
        // Conversation başlat
        await fetchOrCreateConversation();
      } else if (error) {
        setOfferError(error.code === '23505' ? 'Bu ilana zaten teklif verdiniz.' : error.message);
      }
    }
    setSubmittingOffer(false);
  }

  async function handleAcceptOffer(offerId: string) {
    if (!user) return;
    setAcceptingOffer(offerId);
    const { error } = await supabase.rpc('accept_offer', {
      p_offer_id: offerId, p_requester_id: user.id,
    });
    if (error) {
      toast.error(error.message || 'Teklif kabul edilemedi.');
    } else {
      await fetchLoad();
      await fetchOffers();
      await fetchOwnerConversation();
    }
    setAcceptingOffer(null);
  }

  async function handleRejectOffer(offerId: string) {
    const { error } = await supabase.from('offers').update({ status: 'rejected' }).eq('id', offerId);
    if (error) toast.error('İşlem sırasında hata oluştu.');
    await fetchOffers();
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !user || !load) return;
    setSendingMessage(true);
    const otherParticipantId = conversation.participant_1 === user.id ? conversation.participant_2 : conversation.participant_1;
    await supabase.from('messages').insert({
      conversation_id: conversation.id, load_id: load.id,
      sender_id: user.id, receiver_id: otherParticipantId,
      content: newMessage.trim(), read: false,
    });
    await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversation.id);
    setNewMessage('');
    setSendingMessage(false);
  }

  async function handleSharePhone() {
    if (!conversation || !user || sharingPhone) return;
    setSharingPhone(true);
    await supabase.from('conversations').update({
      phone_shared_by: user.id, phone_shared_at: new Date().toISOString(),
    }).eq('id', conversation.id);
    setSharingPhone(false);
  }

  async function handleConfirmDelivery() {
    if (!load || !user || confirming) return;
    setConfirming(true);
    const updates: Partial<LoadWithRelations> = {};
    if (isOwner) { updates.shipper_confirmed = true; updates.shipper_confirmed_at = new Date().toISOString(); }
    else if (isAssignedDriver) { updates.driver_confirmed = true; updates.driver_confirmed_at = new Date().toISOString(); }
    const willComplete = (isOwner && load.driver_confirmed) || (isAssignedDriver && load.shipper_confirmed);
    if (willComplete) updates.status = 'completed';
    const { error } = await supabase.from('loads').update(updates).eq('id', load.id);
    if (error) {
      toast.error('Onay kaydedilemedi. Lütfen tekrar deneyin.');
    } else {
      setLoad((prev) => prev ? { ...prev, ...updates } as LoadWithRelations : prev);
      toast.success('Teslimat onaylandı!');
    }
    setConfirming(false);
  }

  if (loading) return (
    <div className={`${t.pageFull} flex items-center justify-center`}>
      <div className={`w-8 h-8 border-2 ${t.spinner} rounded-full animate-spin`} />
    </div>
  );

  if (!load) return (
    <div className={`${t.pageFull} flex items-center justify-center`}>
      <div className="text-center">
        <Package size={48} className={`${t.mutedDark} mx-auto mb-4`} />
        <h3 className={`text-xl font-bold ${t.heading} mb-2`}>Yük bulunamadı</h3>
        <Link href="/pazar" className="inline-flex items-center gap-2 text-[#F5A623] hover:underline text-sm"><ArrowLeft size={16} />Pazara Dön</Link>
      </div>
    </div>
  );

  const status = statusConfig[load.status] || statusConfig.active;
  const pendingOffers = offers.filter((o) => o.status === 'pending');
  const acceptedOffer = offers.find((o) => o.status === 'accepted');

  return (
    <div className={t.pageFull}>
      {/* Disclaimer */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-4 py-2.5">
        <p className={`text-xs ${t.muted} text-center max-w-7xl mx-auto`}>
          YükLe yalnızca bir ilan platformudur. Taşıma, ödeme ve hasar yükümlülükleri doğrudan ilan sahibi ve nakliyeci arasındadır.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/pazar" className={`inline-flex items-center gap-2 ${t.sub} hover:text-accent text-sm mb-6 transition-colors font-medium`}>
          <ArrowLeft size={16} />Pazara Dön
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sol kolon */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Premium */}
            <div className={`rounded-2xl ${t.card} overflow-hidden`}>
              {/* Rota banner */}
              <div className="px-6 py-5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <div className="w-px h-8 bg-gradient-to-b from-accent/50 to-green-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted/60 mb-0.5">Kalkış</p>
                      <p className={`text-base font-black ${t.heading}`}>
                        {load.origin_city?.name}{load.origin_district ? `, ${load.origin_district.name}` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted/60 mb-0.5">Varış</p>
                      <p className={`text-base font-black ${t.heading}`}>
                        {load.destination_city?.name}{load.destination_district ? `, ${load.destination_district.name}` : ''}
                      </p>
                    </div>
                  </div>
                  {/* Fiyat + aksiyonlar */}
                  <div className="flex flex-col items-end gap-2 ml-auto shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted/60 mb-1">Fiyat</p>
                      <span className="text-2xl font-black text-accent">{formatPrice(load.price)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={async () => {
                        const url = window.location.href;
                        if (navigator.share) { await navigator.share({ title: load.title, url }); }
                        else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
                      }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${t.btnSecondary}`}>
                        <Share2 size={13} />
                        {copied ? 'Kopyalandı!' : 'Paylaş'}
                      </button>
                      {user && !isOwner && (
                        <button onClick={toggleFavorite} disabled={togglingFav}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${isFavorite
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                            : `${t.btnSecondary} hover:text-red-400 hover:border-red-400/20`}`}>
                          <Heart size={13} className={isFavorite ? 'fill-red-400' : ''} />
                          {isFavorite ? 'Favoride' : 'Favori'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Başlık + meta */}
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                  <span className={`text-xs ${t.muted}`}>
                    <Clock size={12} className="inline mr-1" />
                    {new Date(load.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <h1 className={`text-xl font-black ${t.heading} mb-4 leading-snug`}>{load.title}</h1>

                {/* Tags */}
                {((load.tags && load.tags.length > 0) || load.pickup_date || load.delivery_date) && (
                  <div className="flex items-center gap-2 flex-wrap mb-5">
                    <DeliveryDaysBadge pickupDate={load.pickup_date} deliveryDate={load.delivery_date} showPickupCountdown />
                    {load.tags?.map((tag) => <LoadTagBadge key={tag} tag={tag} size="md" />)}
                  </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Weight, label: 'Ağırlık', value: `${load.weight_ton} Ton` },
                    { icon: Package, label: 'Yük Tipi', value: LOAD_TYPES[load.load_type] || load.load_type },
                    { icon: Truck, label: 'Araç Tipi', value: load.required_truck_type ? TRUCK_TYPES[load.required_truck_type] || load.required_truck_type : 'Belirtilmedi' },
                    { icon: Clock, label: 'Teslimat', value: formatDate(load.delivery_date) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className={`p-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon size={13} className="text-accent" />
                        <p className={`text-[10px] font-black uppercase tracking-wider ${t.muted}`}>{label}</p>
                      </div>
                      <p className={`text-sm font-bold ${t.heading}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Açıklama */}
            {load.description && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-3`}>Açıklama</h2>
                <p className={`${t.sub} text-sm leading-relaxed whitespace-pre-wrap`}>{load.description}</p>
              </div>
            )}

            {/* OWNER — İlan Düzenle */}
            {user && isOwner && load.status === 'active' && (
              <div className={`p-4 rounded-2xl ${t.card} flex items-center justify-between`}>
                <div>
                  <p className={`text-sm font-medium ${t.heading}`}>İlan Yönetimi</p>
                  <p className={`text-xs ${t.muted}`}>İlanı düzenleyebilir veya iptal edebilirsiniz.</p>
                </div>
                <Link href={`/ilan-duzenle/${load.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${t.btnSecondary}`}>
                  <PenLine size={16} />Düzenle
                </Link>
              </div>
            )}

            {/* SÜRÜCÜ — Teklif Ver */}
            {user && isDriver && load.status === 'active' && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                  <TrendingUp size={20} className="text-[#F5A623]" />
                  {myOffer ? 'Teklifiniz' : 'Teklif Ver'}
                </h2>

                {myOffer && myOffer.status === 'accepted' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
                    <CheckCircle2 size={16} />Teklifiniz kabul edildi! Yük size atandı.
                  </div>
                )}
                {myOffer && myOffer.status === 'rejected' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                    <X size={16} />Teklifiniz reddedildi.
                  </div>
                )}

                {(!myOffer || myOffer.status === 'pending') && (
                  <form onSubmit={handleSubmitOffer} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs ${t.muted} mb-1.5`}>Teklif Fiyatı (TL)</label>
                        <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)}
                          placeholder="Opsiyonel" min="0"
                          className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none ${t.input}`} />
                      </div>
                      <div>
                        <label className={`block text-xs ${t.muted} mb-1.5`}>Not</label>
                        <input type="text" value={offerNote} onChange={(e) => setOfferNote(e.target.value)}
                          placeholder="Araç bilgisi, müsaitlik vs."
                          className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none ${t.input}`} />
                      </div>
                    </div>
                    {offerError && <p className="text-red-400 text-xs">{offerError}</p>}
                    <button type="submit" disabled={submittingOffer}
                      className="w-full py-3 rounded-xl bg-[#F5A623] text-black font-bold text-sm hover:bg-[#F5A623]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {submittingOffer ? <><Loader2 size={16} className="animate-spin" />Gönderiliyor...</> : myOffer ? 'Teklifi Güncelle' : 'Teklif Gönder'}
                    </button>
                    {!myOffer && (
                      <p className="text-[11px] text-accent/80 text-center flex items-center justify-center gap-1.5 font-medium px-4 py-2 rounded-lg bg-accent/5 border border-accent/10">
                        <Zap size={13} className="fill-accent/20" />
                        Teklif gönderimi 10 Puan maliyetindedir (Limit: 10/gün)
                      </p>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* YÜK SAHİBİ — Teklifleri Gör */}
            {user && isOwner && load.status === 'active' && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                  <TrendingUp size={20} className="text-[#F5A623]" />
                  Teklifler
                  {pendingOffers.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#F5A623] text-black font-bold">{pendingOffers.length}</span>
                  )}
                </h2>

                {offers.length === 0 ? (
                  <p className={`text-sm ${t.muted} text-center py-6`}>Henüz teklif gelmedi.</p>
                ) : (
                  <div className="space-y-3">
                    {offers.map((offer) => (
                      <div key={offer.id} className={`p-4 rounded-xl border transition-all ${offer.status === 'accepted' ? 'bg-green-500/5 border-green-500/30' :
                          offer.status === 'rejected' ? `${t.isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'} border ${t.divider} opacity-50` :
                            `${t.isDark ? 'bg-white/[0.03]' : 'bg-white'} border ${t.divider}`
                        }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`${t.heading} font-medium text-sm`}>{offer.driver?.full_name}</span>
                              {offer.driver?.is_verified && <Shield size={12} className="text-blue-400" />}
                              {offer.driver?.points != null && (
                                <span className="flex items-center gap-0.5 text-xs text-[#F5A623]"><Zap size={10} />{offer.driver.points}</span>
                              )}
                            </div>
                            {offer.driver?.company_name && <p className={`text-xs ${t.muted} mb-1`}>{offer.driver.company_name}</p>}
                            {offer.price && <p className="text-[#F5A623] font-bold text-sm">{formatPrice(offer.price)}</p>}
                            {offer.note && <p className={`text-xs ${t.sub} mt-1`}>{offer.note}</p>}
                            <p className={`text-xs ${t.mutedDark} mt-1`}>{new Date(offer.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="shrink-0">
                            {offer.status === 'pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleAcceptOffer(offer.id)} disabled={!!acceptingOffer}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50">
                                  {acceptingOffer === offer.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}Kabul
                                </button>
                                <button onClick={() => handleRejectOffer(offer.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 transition-colors">
                                  <X size={12} />Red
                                </button>
                              </div>
                            )}
                            {offer.status === 'accepted' && <span className="text-xs text-green-400 font-medium flex items-center gap-1"><CheckCircle2 size={14} />Kabul Edildi</span>}
                            {offer.status === 'rejected' && <span className={`text-xs ${t.muted}`}>Reddedildi</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Kabul edilmiş teklif bilgisi — owner */}
            {isOwner && acceptedOffer && load.status !== 'active' && (
              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-sm">
                <p className="text-green-400 font-medium flex items-center gap-2"><CheckCircle2 size={16} />Sürücü: {acceptedOffer.driver?.full_name}</p>
                {acceptedOffer.price && <p className={`${t.sub} mt-1`}>Teklif Fiyatı: {formatPrice(acceptedOffer.price)}</p>}
              </div>
            )}

            {/* Teslimat Onayı */}
            {user && canConfirm && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-4`}>Teslimat Onayı</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: 'İlan Sahibi', confirmed: load.shipper_confirmed, at: load.shipper_confirmed_at },
                    { label: 'Sürücü', confirmed: load.driver_confirmed, at: load.driver_confirmed_at },
                  ].map(({ label, confirmed, at }) => (
                    <div key={label} className={`p-4 rounded-xl border ${confirmed ? 'bg-green-500/5 border-green-500/20' : `${t.isDark ? 'bg-white/[0.02]' : 'bg-slate-50'} border ${t.divider}`}`}>
                      <div className="flex items-center gap-3">
                        {confirmed ? <CheckCircle2 size={24} className="text-green-400 shrink-0" /> : <CircleDot size={24} className={`${t.muted} shrink-0`} />}
                        <div>
                          <p className={`text-sm font-medium ${t.heading}`}>{label}</p>
                          <p className={`text-xs ${t.muted}`}>{confirmed ? `Onaylandı${at ? ` - ${formatDate(at)} ${formatTime(at)}` : ''}` : 'Onay Bekleniyor'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {bothConfirmed ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium"><CheckCircle2 size={18} />Teslimat tamamlandı!</div>
                ) : ((isOwner && !load.shipper_confirmed) || (isAssignedDriver && !load.driver_confirmed)) ? (
                  <button onClick={handleConfirmDelivery} disabled={confirming}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 ${t.heading} font-medium text-sm hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50`}>
                    {confirming ? 'Onaylanıyor...' : 'Teslimatı Onayla'}
                  </button>
                ) : <p className={`text-sm ${t.sub}`}>Onayınız kaydedildi. Karşı tarafın onayı bekleniyor.</p>}
              </div>
            )}

            {/* Tamamlandı banner */}
            {load.status === 'completed' && (
              <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 size={32} className="text-green-400" />
                  <div>
                    <h2 className="text-lg font-bold text-green-400">Teslimat Tamamlandı</h2>
                    <p className={`text-sm ${t.sub}`}>Bu yük başarıyla teslim edildi.</p>
                  </div>
                </div>
                {/* Değerlendirme butonları */}
                {user && (isOwner || isAssignedDriver) && (
                  <div className="flex gap-3 flex-wrap">
                    {isOwner && load.assigned_driver_id && (
                      <button onClick={() => { setReviewTarget({ id: load.assigned_driver_id!, name: 'Sürücüyü değerlendir' }); setShowReview(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 text-sm font-medium hover:bg-[#F5A623]/20 transition-colors">
                        <Star size={15} />Sürücüyü Değerlendir
                      </button>
                    )}
                    {isAssignedDriver && (
                      <button onClick={() => { setReviewTarget({ id: load.shipper_id, name: 'Yük sahibini değerlendir' }); setShowReview(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 text-sm font-medium hover:bg-[#F5A623]/20 transition-colors">
                        <Star size={15} />Yük Sahibini Değerlendir
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CHAT — Sürücü veya atanmış sürücü + owner (in_transit sonrası) */}
            {user && conversation && (load.status !== 'active' || !isOwner) && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                  <MessageSquare size={20} className="text-[#F5A623]" />
                  Mesajlar — {load.title}
                </h2>

                {/* Telefon paylaşma */}
                <div className={`mb-4 p-4 rounded-xl ${t.card}`}>
                  {!conversation.phone_shared_by ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-sm ${t.sub} flex items-center gap-2`}><Phone size={16} />Telefon paylaşarak hızlı iletişim kurun</span>
                      <button onClick={handleSharePhone} disabled={sharingPhone}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5A623]/10 text-[#F5A623] text-xs font-medium border border-[#F5A623]/20 hover:bg-[#F5A623]/20 transition-colors disabled:opacity-50">
                        <Phone size={12} />{sharingPhone ? 'Paylaşılıyor...' : 'Telefonu Paylaş'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-green-400 flex items-center gap-2 mb-1">
                        <CheckCircle2 size={14} />
                        {conversation.phone_shared_by === user.id ? 'Telefonunuz paylaşıldı' : 'Karşı taraf telefonunu paylaştı'}
                      </p>
                      {otherPhone && conversation.phone_shared_by !== user.id && (
                        <div className={`flex items-center gap-2 mt-2 p-2 rounded-lg ${t.isDark ? "bg-white/[0.03]" : "bg-black/[0.04]"}`}>
                          <Phone size={14} className="text-[#F5A623]" />
                          <span className={`${t.heading} font-medium text-sm`}>{otherPhone}</span>
                        </div>
                      )}
                      {conversation.phone_shared_by === user.id && !otherPhone && (
                        <p className={`text-xs ${t.muted}`}>Karşı taraf da paylaşınca numarasını göreceksin.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Mesajlar */}
                <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className={`text-center ${t.muted} text-sm py-8`}>Henüz mesaj yok. İlk mesajı gönderin!</p>
                  ) : messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${msg.sender_id === user.id ? 'bg-[#F5A623]/20 rounded-br-md ${t.heading}' : `${t.isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]'} ${t.body} rounded-bl-md`}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender_id === user.id ? 'text-[#F5A623]/60' : 'text-gray-500'}`}>{formatTime(msg.created_at)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className={`flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#F5A623]/40 ${t.input}`} />
                  <button type="submit" disabled={!newMessage.trim() || sendingMessage}
                    className="p-3 rounded-xl bg-[#F5A623] text-black hover:bg-[#F5A623]/90 transition-all disabled:opacity-30">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* Owner — aktif yük, teklif bekleniyor */}
            {isOwner && load.status === 'active' && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-2 flex items-center gap-2`}>
                  <MessageSquare size={20} className="text-[#F5A623]" />
                  Mesajlar
                </h2>
                <p className={`text-sm ${t.sub}`}>Bir sürücünün teklifini kabul edince mesajlaşma başlar.</p>
              </div>
            )}

            {/* Giriş yapmamış */}
            {!user && !authLoading && (
              <div className="p-6 rounded-2xl ${t.card} text-center">
                <MessageSquare size={32} className="text-[#F5A623] mx-auto mb-3" />
                <h3 className={`text-lg font-bold ${t.heading} mb-2`}>Teklif Vermek İçin Giriş Yapın</h3>
                <p className={`text-sm ${t.sub} mb-4`}>İlan sahibi ile iletişime geçmek için giriş yapmanız gerekiyor.</p>
                <Link href="/giris" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5A623] text-black font-medium text-sm hover:bg-[#F5A623]/90 transition-all">Giriş Yap</Link>
              </div>
            )}
          </div>

          {/* Sağ sidebar */}
          <div className="space-y-6">
            {/* İlan Sahibi */}
            <div className={`p-6 rounded-2xl ${t.card}`}>
              <h3 className={`text-sm font-medium ${t.muted} mb-4`}>İlan Sahibi</h3>
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/kullanici/${load.shipper?.id}`} className={`w-12 h-12 rounded-full flex items-center justify-center hover:ring-2 hover:ring-[#F5A623]/40 transition-all ${t.isDark ? "bg-white/[0.06]" : "bg-black/[0.06]"}`}>
                  {load.shipper?.avatar_url ? <img src={load.shipper.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" /> : <User size={20} className={t.muted} />}
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/kullanici/${load.shipper?.id}`} className={`${t.heading} font-medium text-sm hover:text-[#F5A623] transition-colors flex items-center gap-1`}>
                      {load.shipper?.full_name}
                      <ExternalLink size={12} className={t.muted} />
                    </Link>
                    {load.shipper?.is_verified && <Shield size={14} className="text-blue-400" />}
                  </div>
                  {load.shipper?.company_name && <p className={`text-xs ${t.muted}`}>{load.shipper.company_name}</p>}
                </div>
              </div>
              {load.shipper?.rating != null && (
                <div className="flex items-center gap-1 mb-3">
                  <Star size={14} className="text-[#F5A623] fill-[#F5A623]" />
                  <span className={`text-sm ${t.heading} font-medium`}>{load.shipper.rating.toFixed(1)}</span>
                  <span className={`text-xs ${t.muted}`}>değerlendirme</span>
                </div>
              )}
              {/* Telefon sadece conversation + paylaşım varsa */}
              {isOwner && conversation?.phone_shared_by && conversation.phone_shared_by !== user?.id && otherPhone && (
                <div className={`flex items-center gap-2 p-3 rounded-xl ${t.card}`}>
                  <Phone size={16} className="text-[#F5A623]" />
                  <span className={`text-sm ${t.heading}`}>{otherPhone}</span>
                </div>
              )}
              {isOwner && !conversation?.phone_shared_by && load.status !== 'active' && (
                <p className={`text-xs ${t.muted}`}>Sürücü telefonunu paylaştığında burada görünür.</p>
              )}
            </div>

            {/* Hızlı Bilgi */}
            <div className={`p-6 rounded-2xl ${t.card}`}>
              <h3 className={`text-sm font-medium ${t.muted} mb-4`}>Hızlı Bilgi</h3>
              <div className="space-y-3">
                {[
                  { label: 'Yükleme', value: formatDate(load.pickup_date) },
                  { label: 'Teslimat', value: formatDate(load.delivery_date) },
                  { label: 'Ağırlık', value: `${load.weight_ton} Ton` },
                  { label: 'Yük Tipi', value: LOAD_TYPES[load.load_type] || load.load_type },
                  ...(load.required_truck_type ? [{ label: 'Araç Tipi', value: TRUCK_TYPES[load.required_truck_type] || load.required_truck_type }] : []),
                  { label: 'Fiyat', value: formatPrice(load.price), highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${t.sub}`}>{label}</span>
                      <span className={`text-sm font-medium ${highlight ? 'text-[#F5A623]' : 'text-white'}`}>{value}</span>
                    </div>
                    <div className={`w-full h-px mt-3 ${t.isDark ? "bg-white/[0.06]" : "bg-black/[0.06]"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showReview && reviewTarget && (
        <ReviewModal
          loadId={load.id}
          reviewedId={reviewTarget.id}
          reviewedName={reviewTarget.name}
          onClose={() => setShowReview(false)}
          onSubmitted={() => { setShowReview(false); }}
        />
      )}
    </div>
  );
}
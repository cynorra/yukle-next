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
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/Toast';
import ReviewModal from '@/components/ReviewModal';
import LoadTagBadge from '@/components/LoadTagBadge';
import DeliveryDaysBadge from '@/components/DeliveryDaysBadge';
import {
  LOAD_DETAIL_TRANSLATIONS,
  LOAD_TYPES_LOCALIZED,
  TRUCK_TYPES_LOCALIZED,
  EXTERNAL_LOAD_TRANSLATIONS,
} from '@/utils/loadDetailTranslations';

interface LoadWithRelations {
  id: string;
  title: string;
  shipper_id: string;
  origin_city: string;
  origin_state: string | null;
  origin_country: string;
  destination_city: string;
  destination_state: string | null;
  destination_country: string;
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
  title_translations?: Record<string, string> | null;
  description_translations?: Record<string, string> | null;
  created_at: string;
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

function formatPrice(price: number | null, locale: string) {
  if (price === null) return locale === 'tr' ? 'Belirtilmedi' : 'Not Specified';
  const currency = locale === 'tr' ? 'TRY' : 'USD';
  const formatLocale = locale === 'tr' ? 'tr-TR' : (locale === 'en' ? 'en-US' : locale);
  try {
    return new Intl.NumberFormat(formatLocale, { style: 'currency', currency }).format(price);
  } catch (e) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }
}

function formatDate(d: string | null, locale: string) {
  if (!d) return locale === 'tr' ? 'Belirtilmedi' : 'Not Specified';
  const formatLocale = locale === 'tr' ? 'tr-TR' : (locale === 'en' ? 'en-US' : locale);
  try {
    return new Date(d).toLocaleDateString(formatLocale, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

function formatTime(d: string | null, locale: string) {
  if (!d) return '';
  const formatLocale = locale === 'tr' ? 'tr-TR' : (locale === 'en' ? 'en-US' : locale);
  try {
    return new Date(d).toLocaleTimeString(formatLocale, { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}

interface LoadDetailClientProps {
  load: LoadWithRelations;
}

export function LoadDetailClient({ load: initialLoad }: LoadDetailClientProps) {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? initialLoad.id;
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const toast = useToast();

  const { t: globalT, locale, isRtl } = useTranslation();
  const t = useT();

  const td = LOAD_DETAIL_TRANSLATIONS[locale] || LOAD_DETAIL_TRANSLATIONS.en;
  const LOAD_TYPES = LOAD_TYPES_LOCALIZED[locale] || LOAD_TYPES_LOCALIZED.en;
  const TRUCK_TYPES = TRUCK_TYPES_LOCALIZED[locale] || TRUCK_TYPES_LOCALIZED.en;

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: globalT.marketplace?.active || 'Active', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    in_transit: { label: globalT.marketplace?.inTransit || 'In Transit', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    completed: { label: globalT.marketplace?.completed || 'Completed', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
    cancelled: { label: globalT.marketplace?.cancelled || 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  };

  // İlk render server'dan gelen veri; sonra client realtime ile güncellenebilir
  const [load, setLoad] = useState<LoadWithRelations | null>(initialLoad);
  const extT = EXTERNAL_LOAD_TRANSLATIONS[locale] || EXTERNAL_LOAD_TRANSLATIONS.en;
  const localizedTitle = load?.title_translations?.[locale] || load?.title || '';
  const localizedDescription = load?.description_translations?.[locale] || load?.description || '';
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
      setOfferError(td.priceOrNoteRequired);
      return;
    }
    if (!myOffer && (profile?.points ?? 0) < 10) {
      setOfferError(td.insufficientPoints);
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
        setOfferError(error.code === '23505' ? (locale === 'tr' ? 'Bu ilana zaten teklif verdiniz.' : 'You have already offered for this load.') : error.message);
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
      toast.error(error.message || (locale === 'tr' ? 'Teklif kabul edilemedi.' : 'Could not accept offer.'));
    } else {
      await fetchLoad();
      await fetchOffers();
      await fetchOwnerConversation();
    }
    setAcceptingOffer(null);
  }

  async function handleRejectOffer(offerId: string) {
    const { error } = await supabase.from('offers').update({ status: 'rejected' }).eq('id', offerId);
    if (error) toast.error(locale === 'tr' ? 'İşlem sırasında hata oluştu.' : 'An error occurred.');
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
      toast.error(locale === 'tr' ? 'Onay kaydedilemedi. Lütfen tekrar deneyin.' : 'Could not save confirmation. Please try again.');
    } else {
      setLoad((prev) => prev ? { ...prev, ...updates } as LoadWithRelations : prev);
      toast.success(locale === 'tr' ? 'Teslimat onaylandı!' : 'Delivery confirmed!');
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
        <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{td.loadNotFound}</h3>
        <Link href={`/${locale}/marketplace`} className="inline-flex items-center gap-2 text-[#F5A623] hover:underline text-sm"><ArrowLeft size={16} />{td.backToMarket}</Link>
      </div>
    </div>
  );

  const status = statusConfig[load.status] || statusConfig.active;
  const pendingOffers = offers.filter((o) => o.status === 'pending');
  const acceptedOffer = offers.find((o) => o.status === 'accepted');

  return (
    <div className={t.pageFull} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Disclaimer */}
      <div className="bg-[#0a0a0a] border-b border-white/5 px-4 py-2.5">
        <p className={`text-xs ${t.muted} text-center max-w-7xl mx-auto`}>
          {td.disclaimer}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href={`/${locale}/marketplace`} className={`inline-flex items-center gap-2 ${t.sub} hover:text-accent text-sm mb-6 transition-colors font-medium`}>
          <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} />{td.backToMarket}
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
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted/60 mb-0.5">{td.origin}</p>
                      <p className={`text-base font-black ${t.heading}`}>
                        {load.origin_city}{load.origin_state ? `, ${load.origin_state}` : ''}, {load.origin_country}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted/60 mb-0.5">{td.destination}</p>
                      <p className={`text-base font-black ${t.heading}`}>
                        {load.destination_city}{load.destination_state ? `, ${load.destination_state}` : ''}, {load.destination_country}
                      </p>
                    </div>
                  </div>
                  {/* Fiyat + aksiyonlar */}
                  <div className={`flex flex-col items-end gap-2 shrink-0 ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
                    <div className={isRtl ? 'text-left' : 'text-right'}>
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted/60 mb-1">{td.priceLabel}</p>
                      <span className="text-2xl font-black text-accent">{formatPrice(load.price, locale)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={async () => {
                        const url = window.location.href;
                        if (navigator.share) { await navigator.share({ title: localizedTitle, url }); }
                        else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
                      }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${t.btnSecondary}`}>
                        <Share2 size={13} />
                        {copied ? td.copied : td.share}
                      </button>
                      {user && !isOwner && (
                        <button onClick={toggleFavorite} disabled={togglingFav}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${isFavorite
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                            : `${t.btnSecondary} hover:text-red-400 hover:border-red-400/20`}`}>
                          <Heart size={13} className={isFavorite ? 'fill-red-400' : ''} />
                          {isFavorite ? td.inFavorites : td.favorite}
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
                    <Clock size={12} className={`inline ${isRtl ? 'ml-1' : 'mr-1'}`} />
                    {formatDate(load.created_at, locale)}
                  </span>
                </div>
                <h1 className={`text-xl font-black ${t.heading} mb-4 leading-snug`}>{localizedTitle}</h1>

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
                    { icon: Weight, label: locale === 'tr' ? 'Ağırlık' : 'Weight', value: `${load.weight_ton} ${td.tons}` },
                    { icon: Package, label: locale === 'tr' ? 'Yük Tipi' : 'Load Type', value: LOAD_TYPES[load.load_type] || load.load_type },
                    { icon: Truck, label: locale === 'tr' ? 'Araç Tipi' : 'Truck Type', value: load.required_truck_type ? TRUCK_TYPES[load.required_truck_type] || load.required_truck_type : td.notSpecified },
                    { icon: Clock, label: locale === 'tr' ? 'Teslimat' : 'Delivery', value: formatDate(load.delivery_date, locale) },
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
            {localizedDescription && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-3`}>{td.description}</h2>
                <p className={`${t.sub} text-sm leading-relaxed whitespace-pre-wrap`}>{localizedDescription}</p>
              </div>
            )}

            {/* HARİCİ İLAN UYARISI */}
            {load.tags?.includes('external') && (
              <div className={`p-6 rounded-2xl ${t.card} border-l-4 border-amber-500 bg-amber-500/5 space-y-3`}>
                <div className="flex items-center gap-3">
                  <Shield className="text-amber-500 w-6 h-6 shrink-0" />
                  <h3 className={`text-lg font-black text-amber-500`}>
                    {extT.externalWarningTitle}
                  </h3>
                </div>
                <p className={`text-sm ${t.sub} leading-relaxed`}>
                  {extT.externalWarningDesc}
                </p>
              </div>
            )}

            {/* OWNER — İlan Düzenle */}
            {user && isOwner && load.status === 'active' && !load.tags?.includes('external') && (
              <div className={`p-4 rounded-2xl ${t.card} flex items-center justify-between`}>
                <div>
                  <p className={`text-sm font-medium ${t.heading}`}>{td.manageLoad}</p>
                  <p className={`text-xs ${t.muted}`}>{td.manageLoadDesc}</p>
                </div>
                <Link href={`/${locale}/edit-load/${load.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${t.btnSecondary}`}>
                  <PenLine size={16} />{td.editBtn}
                </Link>
              </div>
            )}

            {/* SÜRÜCÜ — Teklif Ver */}
            {user && isDriver && load.status === 'active' && !load.tags?.includes('external') && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                  <TrendingUp size={20} className="text-[#F5A623]" />
                  {myOffer ? td.yourOffer : td.makeOffer}
                </h2>

                {myOffer && myOffer.status === 'accepted' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
                    <CheckCircle2 size={16} />{td.offerAccepted}
                  </div>
                )}
                {myOffer && myOffer.status === 'rejected' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                    <X size={16} />{td.offerRejected}
                  </div>
                )}

                {(!myOffer || myOffer.status === 'pending') && (
                  <form onSubmit={handleSubmitOffer} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs ${t.muted} mb-1.5`}>{td.offerPrice} ({locale === 'tr' ? 'TL' : 'USD'})</label>
                        <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)}
                          placeholder={td.optional} min="0"
                          className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none ${t.input}`} />
                      </div>
                      <div>
                        <label className={`block text-xs ${t.muted} mb-1.5`}>{td.note}</label>
                        <input type="text" value={offerNote} onChange={(e) => setOfferNote(e.target.value)}
                          placeholder={td.notePlaceholder}
                          className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none ${t.input}`} />
                      </div>
                    </div>
                    {offerError && <p className="text-red-400 text-xs">{offerError}</p>}
                    <button type="submit" disabled={submittingOffer}
                      className="w-full py-3 rounded-xl bg-[#F5A623] text-black font-bold text-sm hover:bg-[#F5A623]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {submittingOffer ? <><Loader2 size={16} className="animate-spin" />{td.sending}</> : myOffer ? td.updateOffer : td.sendOffer}
                    </button>
                    {!myOffer && (
                      <p className="text-[11px] text-accent/80 text-center flex items-center justify-center gap-1.5 font-medium px-4 py-2 rounded-lg bg-accent/5 border border-accent/10">
                        <Zap size={13} className="fill-accent/20" />
                        {td.offerLimitWarning}
                      </p>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* YÜK SAHİBİ — Teklifleri Gör */}
            {user && isOwner && load.status === 'active' && !load.tags?.includes('external') && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                  <TrendingUp size={20} className="text-[#F5A623]" />
                  {td.offersTitle}
                  {pendingOffers.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#F5A623] text-black font-bold">{pendingOffers.length}</span>
                  )}
                </h2>

                {offers.length === 0 ? (
                  <p className={`text-sm ${t.muted} text-center py-6`}>{td.noOffersYet}</p>
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
                            {offer.price && <p className="text-[#F5A623] font-bold text-sm">{formatPrice(offer.price, locale)}</p>}
                            {offer.note && <p className={`text-xs ${t.sub} mt-1`}>{offer.note}</p>}
                            <p className={`text-xs ${t.mutedDark} mt-1`}>
                              {formatDate(offer.created_at, locale)} {formatTime(offer.created_at, locale)}
                            </p>
                          </div>
                          <div className="shrink-0">
                            {offer.status === 'pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleAcceptOffer(offer.id)} disabled={!!acceptingOffer}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50">
                                  {acceptingOffer === offer.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}{td.accept}
                                </button>
                                <button onClick={() => handleRejectOffer(offer.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 transition-colors">
                                  <X size={12} />{td.reject}
                                </button>
                              </div>
                            )}
                            {offer.status === 'accepted' && <span className="text-xs text-green-400 font-medium flex items-center gap-1"><CheckCircle2 size={14} />{td.accepted}</span>}
                            {offer.status === 'rejected' && <span className={`text-xs ${t.muted}`}>{td.rejected}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Kabul edilmiş teklif bilgisi — owner */}
            {isOwner && acceptedOffer && load.status !== 'active' && !load.tags?.includes('external') && (
              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-sm">
                <p className="text-green-400 font-medium flex items-center gap-2"><CheckCircle2 size={16} />{td.driver}: {acceptedOffer.driver?.full_name}</p>
                {acceptedOffer.price && <p className={`${t.sub} mt-1`}>{td.offerPrice}: {formatPrice(acceptedOffer.price, locale)}</p>}
              </div>
            )}

            {/* Teslimat Onayı */}
            {user && canConfirm && !load.tags?.includes('external') && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-4`}>{td.deliveryConfirmation}</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: td.shipper, confirmed: load.shipper_confirmed, at: load.shipper_confirmed_at },
                    { label: td.driver, confirmed: load.driver_confirmed, at: load.driver_confirmed_at },
                  ].map(({ label, confirmed, at }) => (
                    <div key={label} className={`p-4 rounded-xl border ${confirmed ? 'bg-green-500/5 border-green-500/20' : `${t.isDark ? 'bg-white/[0.02]' : 'bg-slate-50'} border ${t.divider}`}`}>
                      <div className="flex items-center gap-3">
                        {confirmed ? <CheckCircle2 size={24} className="text-green-400 shrink-0" /> : <CircleDot size={24} className={`${t.muted} shrink-0`} />}
                        <div>
                          <p className={`text-sm font-medium ${t.heading}`}>{label}</p>
                          <p className={`text-xs ${t.muted}`}>
                            {confirmed ? `${td.confirmed}${at ? ` - ${formatDate(at, locale)} ${formatTime(at, locale)}` : ''}` : td.pending}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {bothConfirmed ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium"><CheckCircle2 size={18} />{td.deliveryCompleted}</div>
                ) : ((isOwner && !load.shipper_confirmed) || (isAssignedDriver && !load.driver_confirmed)) ? (
                  <button onClick={handleConfirmDelivery} disabled={confirming}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 ${t.heading} font-medium text-sm hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50`}>
                    {confirming ? td.confirming : td.confirmDelivery}
                  </button>
                ) : <p className={`text-sm ${t.sub}`}>{td.waitingOtherConfirmation}</p>}
              </div>
            )}

            {/* Tamamlandı banner */}
            {load.status === 'completed' && !load.tags?.includes('external') && (
              <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 size={32} className="text-green-400" />
                  <div>
                    <h2 className="text-lg font-bold text-green-400">{td.deliveryCompleted}</h2>
                    <p className={`text-sm ${t.sub}`}>{locale === 'tr' ? 'Bu yük başarıyla teslim edildi.' : 'This load was successfully delivered.'}</p>
                  </div>
                </div>
                {/* Değerlendirme butonları */}
                {user && (isOwner || isAssignedDriver) && (
                  <div className="flex gap-3 flex-wrap">
                    {isOwner && load.assigned_driver_id && (
                      <button onClick={() => { setReviewTarget({ id: load.assigned_driver_id!, name: td.rateDriver }); setShowReview(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 text-sm font-medium hover:bg-[#F5A623]/20 transition-colors">
                        <Star size={15} />{td.rateDriver}
                      </button>
                    )}
                    {isAssignedDriver && (
                      <button onClick={() => { setReviewTarget({ id: load.shipper_id, name: td.rateShipper }); setShowReview(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 text-sm font-medium hover:bg-[#F5A623]/20 transition-colors">
                        <Star size={15} />{td.rateShipper}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CHAT — Sürücü veya atanmış sürücü + owner (in_transit sonrası) */}
            {user && conversation && (load.status !== 'active' || !isOwner) && !load.tags?.includes('external') && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                  <MessageSquare size={20} className="text-[#F5A623]" />
                  {globalT.nav.messages} — {localizedTitle}
                </h2>

                {/* Telefon paylaşma */}
                <div className={`mb-4 p-4 rounded-xl ${t.card}`}>
                  {!conversation.phone_shared_by ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-sm ${t.sub} flex items-center gap-2`}><Phone size={16} />{td.sharePhoneDesc}</span>
                      <button onClick={handleSharePhone} disabled={sharingPhone}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5A623]/10 text-[#F5A623] text-xs font-medium border border-[#F5A623]/20 hover:bg-[#F5A623]/20 transition-colors disabled:opacity-50">
                        <Phone size={12} />{sharingPhone ? td.sharing : td.sharePhone}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-green-400 flex items-center gap-2 mb-1">
                        <CheckCircle2 size={14} />
                        {conversation.phone_shared_by === user.id ? td.phoneShared : td.otherPhoneShared}
                      </p>
                      {otherPhone && conversation.phone_shared_by !== user.id && (
                        <div className={`flex items-center gap-2 mt-2 p-2 rounded-lg ${t.isDark ? "bg-white/[0.03]" : "bg-black/[0.04]"}`}>
                          <Phone size={14} className="text-[#F5A623]" />
                          <span className={`${t.heading} font-medium text-sm`}>{otherPhone}</span>
                        </div>
                      )}
                      {conversation.phone_shared_by === user.id && !otherPhone && (
                        <p className={`text-xs ${t.muted}`}>{td.phoneVisibleWait}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Mesajlar */}
                <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className={`text-center ${t.muted} text-sm py-8`}>{td.noMessagesYet}</p>
                  ) : messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${msg.sender_id === user.id ? `bg-[#F5A623]/20 rounded-br-md ${t.heading}` : `${t.isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]'} ${t.body} rounded-bl-md`}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender_id === user.id ? 'text-[#F5A623]/60' : 'text-gray-500'}`}>{formatTime(msg.created_at, locale)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={td.typeMessage}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#F5A623]/40 ${t.input}`} />
                  <button type="submit" disabled={!newMessage.trim() || sendingMessage}
                    className="p-3 rounded-xl bg-[#F5A623] text-black hover:bg-[#F5A623]/90 transition-all disabled:opacity-30">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* Owner — aktif yük, teklif bekleniyor */}
            {isOwner && load.status === 'active' && !load.tags?.includes('external') && (
              <div className={`p-6 rounded-2xl ${t.card}`}>
                <h2 className={`text-lg font-bold ${t.heading} mb-2 flex items-center gap-2`}>
                  <MessageSquare size={20} className="text-[#F5A623]" />
                  {globalT.nav.messages}
                </h2>
                <p className={`text-sm ${t.sub}`}>{td.chatStartOfferAccepted}</p>
              </div>
            )}

            {/* Giriş yapmamış */}
            {!user && !authLoading && !load.tags?.includes('external') && (
              <div className={`p-6 rounded-2xl ${t.card} text-center`}>
                <MessageSquare size={32} className="text-[#F5A623] mx-auto mb-3" />
                <h3 className={`text-lg font-bold ${t.heading} mb-2`}>{td.loginToOfferTitle}</h3>
                <p className={`text-sm ${t.sub} mb-4`}>{td.loginToOfferDesc}</p>
                <Link href={`/${locale}/login`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5A623] text-black font-medium text-sm hover:bg-[#F5A623]/90 transition-all">{td.login}</Link>
              </div>
            )}
          </div>

          {/* Sağ sidebar */}
          <div className="space-y-6">
            {/* İlan Sahibi */}
            <div className={`p-6 rounded-2xl ${t.card}`}>
              <h3 className={`text-sm font-medium ${t.muted} mb-4`}>{td.shipper}</h3>
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/${locale}/user/${load.shipper?.id}`} className={`w-12 h-12 rounded-full flex items-center justify-center hover:ring-2 hover:ring-[#F5A623]/40 transition-all ${t.isDark ? "bg-white/[0.06]" : "bg-black/[0.06]"}`}>
                  {load.shipper?.avatar_url ? <img src={load.shipper.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" /> : <User size={20} className={t.muted} />}
                </Link>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/${locale}/user/${load.shipper?.id}`} className={`${t.heading} font-medium text-sm hover:text-[#F5A623] transition-colors flex items-center gap-1`}>
                      {load.shipper?.full_name}
                      <ExternalLink size={12} className={t.muted} />
                    </Link>
                    {load.shipper?.is_verified && <Shield size={14} className="text-blue-400" />}
                    {load.tags?.includes('external') && (
                      <span className="px-2 py-0.5 text-[10px] font-black rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {extT.externalBadge}
                      </span>
                    )}
                  </div>
                  {load.shipper?.company_name && <p className={`text-xs ${t.muted}`}>{load.shipper.company_name}</p>}
                </div>
              </div>
              {load.shipper?.rating != null && (
                <div className="flex items-center gap-1 mb-3">
                  <Star size={14} className="text-[#F5A623] fill-[#F5A623]" />
                  <span className={`text-sm ${t.heading} font-medium`}>{load.shipper.rating.toFixed(1)}</span>
                  <span className={`text-xs ${t.muted}`}> {td.reviews}</span>
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
                <p className={`text-xs ${t.muted}`}>{td.driverPhoneVisible}</p>
              )}
            </div>

            {/* Hızlı Bilgi */}
            <div className={`p-6 rounded-2xl ${t.card}`}>
              <h3 className={`text-sm font-medium ${t.muted} mb-4`}>{td.quickInfo}</h3>
              <div className="space-y-3">
                {[
                  { label: td.pickup, value: formatDate(load.pickup_date, locale) },
                  { label: locale === 'tr' ? 'Teslimat' : 'Delivery', value: formatDate(load.delivery_date, locale) },
                  { label: locale === 'tr' ? 'Ağırlık' : 'Weight', value: `${load.weight_ton} ${td.tons}` },
                  { label: locale === 'tr' ? 'Yük Tipi' : 'Load Type', value: LOAD_TYPES[load.load_type] || load.load_type },
                  ...(load.required_truck_type ? [{ label: locale === 'tr' ? 'Araç Tipi' : 'Truck Type', value: TRUCK_TYPES[load.required_truck_type] || load.required_truck_type }] : []),
                  { label: td.priceLabel, value: formatPrice(load.price, locale), highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${t.sub}`}>{label}</span>
                      <span className={`text-sm font-medium ${highlight ? 'text-[#F5A623]' : 'text-fg'}`}>{value}</span>
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
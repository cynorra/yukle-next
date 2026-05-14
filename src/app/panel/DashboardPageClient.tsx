'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Load, Conversation } from '@/types/database';
import { useT } from '@/hooks/useT';
import { useToast } from '@/components/Toast';
import LoadTagBadge from '@/components/LoadTagBadge';
import DeliveryDaysBadge from '@/components/DeliveryDaysBadge';
import {
  MapPin, ArrowRight, Package, MessageCircle, CheckCircle, CircleDot,
  Clock, Route, ChevronRight, TrendingUp, Check, X, Loader2, Shield, Zap,
  PenLine, Copy, Truck, User, Star, LayoutDashboard, History
} from 'lucide-react';
import { motion } from 'framer-motion';
import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';

type Tab = 'loads' | 'offers' | 'my_offers' | 'conversations';

interface Offer {
  id: string;
  load_id: string;
  driver_id: string;
  price: number | null;
  note: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  driver?: { id: string; full_name: string; company_name: string | null; rating: number; is_verified: boolean; points: number; };
  load?: { id: string; title: string; };
}

interface DriverOffer {
  id: string;
  load_id: string;
  price: number | null;
  note: string | null;
  status: string;
  created_at: string;
  load_title: string;
  load_status: string;
  origin_city_name: string;
  dest_city_name: string;
  load_price: number | null;
}

function formatPrice(price: number | null) {
  if (!price) return null;
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}

export function DashboardPageClient() {
  const t = useT();
  const { user, profile } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('loads');
  const [loads, setLoads] = useState<Load[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [driverOffers, setDriverOffers] = useState<DriverOffer[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingOffer, setAcceptingOffer] = useState<string | null>(null);

  const fetchLoads = useCallback(async () => {
    if (!user) return;
    const query = profile?.role === 'driver'
      ? supabase.from('loads').select('*, origin_city:cities!loads_origin_city_id_fkey(*), destination_city:cities!loads_destination_city_id_fkey(*)').eq('assigned_driver_id', user.id).order('created_at', { ascending: false })
      : supabase.from('loads').select('*, origin_city:cities!loads_origin_city_id_fkey(*), destination_city:cities!loads_destination_city_id_fkey(*)').eq('shipper_id', user.id).order('created_at', { ascending: false });
    const { data } = await query;
    setLoads((data as unknown as Load[]) || []);
    setLoading(false);
  }, [user, profile?.role]);

  const fetchAllOffers = useCallback(async () => {
    if (!user) return;
    const { data: userLoads } = await supabase.from('loads').select('id').eq('shipper_id', user.id).eq('status', 'active');
    if (!userLoads || userLoads.length === 0) { setLoading(false); return; }
    const { data } = await supabase.from('offers')
      .select('*, driver:public_profiles!offers_driver_id_fkey(id, full_name, company_name, rating, is_verified, points), load:loads!offers_load_id_fkey(id, title)')
      .in('load_id', userLoads.map((l) => l.id))
      .order('created_at', { ascending: false });
    setOffers((data as unknown as Offer[]) || []);
    setLoading(false);
  }, [user]);

  const fetchDriverOffers = useCallback(async () => {
    if (!user) return;
    interface DriverOfferResponse {
      id: string;
      price: number | null;
      note: string | null;
      status: string;
      created_at: string;
      load: {
        id: string;
        title: string;
        status: string;
        price: number | null;
        origin_city: { name: string };
        destination_city: { name: string };
      } | null;
    }
    const { data } = await supabase.from('offers')
      .select('*, load:loads!offers_load_id_fkey(id, title, status, price, origin_city:cities!loads_origin_city_id_fkey(name), destination_city:cities!loads_destination_city_id_fkey(name))')
      .eq('driver_id', user.id)
      .order('created_at', { ascending: false });
    const mapped = ((data as unknown as DriverOfferResponse[]) || [])
      .map((o) => ({
        id: o.id, 
        load_id: o.load?.id || '', 
        price: o.price, 
        note: o.note, 
        status: o.status,
        created_at: o.created_at, 
        load_title: o.load?.title || '',
        load_status: o.load?.status || '', 
        origin_city_name: o.load?.origin_city?.name || '',
        dest_city_name: o.load?.destination_city?.name || '', 
        load_price: o.load?.price || null,
      }))
      .filter(o => o.load_id !== '');
    setDriverOffers(mapped);
    setLoading(false);
  }, [user]);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('conversations').select('*')
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order('last_message_at', { ascending: false });
    setConversations((data as Conversation[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchLoads();
    fetchConversations();
    if (profile?.role === 'shipper') fetchAllOffers();
    if (profile?.role === 'driver') fetchDriverOffers();
  }, [user, profile, fetchLoads, fetchConversations, fetchAllOffers, fetchDriverOffers]);

  async function handleAcceptOffer(offerId: string) {
    if (!user) return;
    setAcceptingOffer(offerId);
    await supabase.rpc('accept_offer', { p_offer_id: offerId, p_requester_id: user.id });
    await fetchAllOffers();
    await fetchLoads();
    setAcceptingOffer(null);
  }

  async function handleRejectOffer(offerId: string) {
    const { error } = await supabase.from('offers').update({ status: 'rejected' }).eq('id', offerId);
    if (error) toast.error('İşlem sırasında hata oluştu.');
    await fetchAllOffers();
  }

  async function duplicateLoad(load: Load) {
    const { data } = await supabase.from('loads').insert({
      title: `${load.title} (Kopya)`, shipper_id: user!.id,
      origin_city_id: load.origin_city_id, destination_city_id: load.destination_city_id,
      origin_district_id: load.origin_district_id, destination_district_id: load.destination_district_id,
      price: load.price, weight_ton: load.weight_ton, load_type: load.load_type,
      required_truck_type: load.required_truck_type, description: load.description,
      status: 'active',
    }).select('id').single();
    if (data) router.push(`/ilan-duzenle/${data.id}`);
  }

  const activeCount = loads.filter((l) => l.status === 'active').length;
  const inTransitCount = loads.filter((l) => l.status === 'in_transit').length;
  const completedCount = loads.filter((l) => l.status === 'completed').length;
  const pendingOffers = offers.filter((o) => o.status === 'pending');

  const tabs = [
    { id: 'loads' as Tab, label: profile?.role === 'driver' ? 'Taşımalarım' : 'Yüklerim', icon: Package },
    ...(profile?.role === 'shipper' ? [{ id: 'offers' as Tab, label: 'Teklifler', icon: TrendingUp, badge: pendingOffers.length }] : []),
    ...(profile?.role === 'driver' ? [{ id: 'my_offers' as Tab, label: 'Tekliflerim', icon: TrendingUp, badge: driverOffers.filter(o => o.status === 'pending').length }] : []),
    { id: 'conversations' as Tab, label: 'Mesajlar', icon: MessageCircle },
  ];

  return (
    <div className={t.pageFull}>
      {/* Profil başlığı */}
      <div className={cn("border-b transition-all duration-500", t.divider, t.isDark ? "bg-background-dark" : "bg-white")}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-20 h-20 rounded-3xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    : <User size={32} className="text-accent" />
                  }
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className={cn("text-2xl font-black tracking-tight", t.heading)}>{profile?.full_name || 'Kullanıcı'}</h1>
                  {profile?.is_verified && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-wider shadow-sm">
                      <Shield size={12} fill="currentColor" fillOpacity={0.2} /> Onaylı
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full bg-accent animate-pulse")} />
                    <span className={cn("text-sm font-bold uppercase tracking-wider", t.sub)}>
                      {profile?.role === 'shipper' ? 'Yük Sahibi' : 'Nakliyeci'}
                    </span>
                  </div>
                  {profile?.company_name && (
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-lg bg-surface-light dark:bg-surface-dark border", t.divider, t.muted)}>
                      {profile.company_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent text-white shadow-xl shadow-accent/20 transition-transform hover:-translate-y-1">
                  <Zap size={20} fill="currentColor" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Bakiyeniz</span>
                    <span className="text-lg font-black">{profile?.points ?? 0} <span className="text-xs">PUAN</span></span>
                  </div>
                </div>
              </div>
              <Link href="/profil"
                className={cn("p-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md", t.btnSecondary)}>
                <PenLine size={20} />
              </Link>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { value: activeCount, label: 'Aktif İlan', color: 'text-accent', icon: Package, desc: 'Yayında olan' },
              { value: inTransitCount, label: 'Yolda', color: 'text-blue-500', icon: Truck, desc: 'Taşıma aşamasında' },
              { value: completedCount, label: 'Başarılı', color: 'text-green-500', icon: CheckCircle, desc: 'Tamamlanan işler' },
              { value: profile?.rating?.toFixed(1) || '0.0', label: 'Puanlama', color: 'text-yellow-500', icon: Star, desc: 'Kullanıcı yorumu' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn("p-5 rounded-3xl border shadow-sm group hover:shadow-md transition-all", t.card)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("p-2 rounded-xl bg-surface-light dark:bg-background-dark border group-hover:scale-110 transition-transform", t.divider)}>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <span className={cn("text-2xl font-black tracking-tighter", t.heading)}>{stat.value}</span>
                </div>
                <div>
                  <p className={cn("text-xs font-black uppercase tracking-widest mb-0.5", t.heading)}>{stat.label}</p>
                  <p className={cn("text-[10px] font-medium", t.muted)}>{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Sürücü güzergah CTA */}
        {profile?.role === 'driver' && (
          <Link href="/guzergahlarim"
            className={`flex items-center justify-between p-5 rounded-2xl mb-6 border ${t.divider} bg-surface-light dark:bg-surface-dark hover:border-accent/30 hover:shadow-md transition-all group`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Route size={18} className="text-accent" />
              </div>
              <div>
                <div className={`text-sm font-bold ${t.heading}`}>Güzergahlarını Ayarla</div>
                <div className={`text-xs ${t.muted} mt-0.5`}>Güzergahınıza uygun yükleri eşleştirin</div>
              </div>
            </div>
            <ChevronRight size={18} className={`${t.muted} group-hover:text-accent transition-colors`} />
          </Link>
        )}

        {/* Tabs */}
        <div className={cn("flex gap-2 p-1.5 rounded-[22px] mb-8 shadow-inner overflow-x-auto scrollbar-none", t.tabContainer)}>
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button 
              key={id} 
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex-1 min-w-[120px] flex items-center justify-center gap-2.5 py-3 rounded-[18px] text-sm font-black transition-all duration-300 whitespace-nowrap relative overflow-hidden group",
                activeTab === id ? t.tabActive : cn(t.tabInactive, "hover:bg-accent/5")
              )}
            >
              <Icon size={18} className={cn("transition-transform group-hover:scale-110", activeTab === id ? "text-white" : "text-accent")} />
              <span>{label}</span>
              {badge != null && badge > 0 && (
                <span className={cn(
                  "px-2 py-0.5 text-[10px] rounded-full font-black shadow-sm",
                  activeTab === id ? "bg-white/20 text-white" : "bg-accent text-white"
                )}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className={`w-10 h-10 border-2 ${t.spinner} rounded-full animate-spin`} />
              <p className={`text-sm ${t.muted} font-medium animate-pulse`}>Yükleniyor...</p>
            </div>
          </div>

        ) : activeTab === 'loads' ? (
          <div className="space-y-3">
            {profile?.role === 'shipper' && (
              <Link href="/yuk-olustur"
                className={`flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-accent/30 text-accent hover:bg-accent/5 transition-all group mb-2`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package size={16} className="text-accent" />
                  </div>
                  <span className="text-sm font-bold">Yeni İlan Oluştur</span>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {loads.length === 0 ? (
              <EmptyState 
                icon={Package}
                title={profile?.role === 'driver' ? 'Henüz taşıma yok' : 'Henüz yük ilanınız yok'}
                description={profile?.role === 'driver' ? 'Pazara giderek size uygun ilanlara teklif verin ve kazanmaya başlayın.' : 'İlk ilanınızı oluşturarak binlerce nakliyeciye anında ulaşın.'}
                action={profile?.role === 'shipper' ? {
                  label: 'İlan Oluştur',
                  onClick: () => router.push('/yuk-olustur'),
                  icon: Package
                } : {
                  label: 'Pazara Git',
                  onClick: () => router.push('/pazar'),
                  icon: LayoutDashboard
                }}
              />
            ) : loads.map((load, i) => (
              <motion.div
                key={load.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className={`p-5 rounded-2xl border ${t.divider} bg-surface-light dark:bg-surface-dark hover:border-accent/30 hover:shadow-md transition-all`}>
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/pazar/${load.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-full border ${
                          load.status === 'active' ? t.badgeActive
                          : load.status === 'in_transit' ? t.badgeInTransit
                          : load.status === 'completed' ? t.badgeCompleted
                          : t.badgeCancelled
                        }`}>
                          {load.status === 'active' ? 'Aktif'
                           : load.status === 'in_transit' ? 'Taşınıyor'
                           : load.status === 'completed' ? 'Tamamlandı'
                           : 'İptal'}
                        </span>
                        <span className={`text-xs ${t.muted} flex items-center gap-1`}>
                          <Clock size={11} />{new Date(load.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <h3 className={`font-black mb-2.5 truncate ${t.heading} hover:text-accent transition-colors`}>
                        {load.title}
                      </h3>
                      <div className={`flex items-center gap-3 text-sm ${t.sub}`}>
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin size={13} className="text-accent" />{load.origin_city?.name}
                        </span>
                        <ArrowRight size={13} className={t.muted} />
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin size={13} className="text-green-500" />{load.destination_city?.name}
                        </span>
                        <span className={`${t.muted} text-xs`}>{load.weight_ton}T</span>
                      </div>
                      {((load.tags && load.tags.length > 0) || load.pickup_date || load.delivery_date) && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                          <DeliveryDaysBadge pickupDate={load.pickup_date} deliveryDate={load.delivery_date} showPickupCountdown />
                          {load.tags?.map((tag: string) => <LoadTagBadge key={tag} tag={tag} />)}
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {load.price && (
                        <span className={`font-black text-base ${t.accent}`}>
                          {load.price.toLocaleString('tr-TR')} ₺
                        </span>
                      )}
                      {profile?.role === 'shipper' && load.status === 'active' && (
                        <div className="flex gap-1.5">
                          <Link href={`/ilan-duzenle/${load.id}`}
                            className={`p-2 rounded-lg text-xs transition-all ${t.btnSecondary}`} title="Düzenle">
                            <PenLine size={14} />
                          </Link>
                          <button onClick={() => duplicateLoad(load)}
                            className={`p-2 rounded-lg text-xs transition-all ${t.btnSecondary}`} title="Kopyala">
                            <Copy size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {load.status === 'in_transit' && (
                    <div className={`mt-3.5 pt-3.5 border-t ${t.divider} flex items-center gap-5`}>
                      <div className="flex items-center gap-1.5 text-xs">
                        {load.shipper_confirmed
                          ? <CheckCircle size={14} className="text-green-500" />
                          : <CircleDot size={14} className={t.muted} />}
                        <span className={load.shipper_confirmed ? 'text-green-500 font-medium' : t.muted}>Yük Sahibi</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        {load.driver_confirmed
                          ? <CheckCircle size={14} className="text-green-500" />
                          : <CircleDot size={14} className={t.muted} />}
                        <span className={load.driver_confirmed ? 'text-green-500 font-medium' : t.muted}>Sürücü</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        ) : activeTab === 'offers' ? (
          <div className="space-y-4">
            {offers.length === 0 ? (
              <EmptyState 
                icon={TrendingUp}
                title="Henüz teklif yok"
                description="İlanlarınıza sürücüler teklif verdiğinde burada listelenecek."
                action={{
                  label: 'İlanlarımı Gör',
                  onClick: () => setActiveTab('loads'),
                  icon: Package
                }}
              />
            ) : (
              <>
                {pendingOffers.length > 0 && (
                  <div className={`p-4 rounded-2xl text-sm flex items-center gap-3 bg-accent/10 text-accent border border-accent/20 font-bold`}>
                    <TrendingUp size={16} />
                    {pendingOffers.length} bekleyen teklif var — hemen inceleyin!
                  </div>
                )}
                {offers.map((offer, i) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`p-5 rounded-2xl border transition-all ${
                      offer.status === 'accepted'
                        ? 'bg-green-500/5 border-green-500/30'
                        : offer.status === 'rejected'
                        ? `bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark opacity-50`
                        : `bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark`
                    }`}>
                    <Link href={`/pazar/${offer.load_id}`}
                      className={`text-xs ${t.accent} font-bold hover:underline mb-3 flex items-center gap-1.5`}>
                      <Package size={12} />
                      {offer.load?.title || `Yük #${offer.load_id?.slice(0, 8)}`}
                      <ArrowRight size={11} />
                    </Link>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/kullanici/${offer.driver?.id}`}
                            className={`font-bold hover:text-accent transition-colors ${t.heading}`}>
                            {offer.driver?.full_name}
                          </Link>
                          {offer.driver?.is_verified && <Shield size={13} className="text-blue-400" />}
                          {offer.driver?.points != null && (
                            <span className={`flex items-center gap-0.5 text-xs ${t.accent} font-bold`}>
                              <Zap size={10} />{offer.driver.points}
                            </span>
                          )}
                        </div>
                        {offer.driver?.company_name && (
                          <p className={`text-xs ${t.muted} mb-1`}>{offer.driver.company_name}</p>
                        )}
                        {offer.price && (
                          <p className={`font-black text-sm ${t.accent}`}>{formatPrice(offer.price)}</p>
                        )}
                        {offer.note && <p className={`text-sm ${t.sub} mt-1`}>{offer.note}</p>}
                        <p className={`text-xs ${t.muted} mt-2`}>
                          {new Date(offer.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        {offer.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleAcceptOffer(offer.id)} disabled={!!acceptingOffer}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${t.btnSuccess}`}>
                              {acceptingOffer === offer.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                              Kabul
                            </button>
                            <button onClick={() => handleRejectOffer(offer.id)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${t.btnDanger}`}>
                              <X size={12} />Red
                            </button>
                          </div>
                        )}
                        {offer.status === 'accepted' && (
                          <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                            <CheckCircle size={14} />Kabul Edildi
                          </span>
                        )}
                        {offer.status === 'rejected' && (
                          <span className={`text-xs ${t.muted}`}>Reddedildi</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>

        ) : activeTab === 'my_offers' ? (
          <div className="space-y-3">
            {driverOffers.length === 0 ? (
              <EmptyState 
                icon={TrendingUp}
                title="Henüz teklif vermemişsiniz"
                description="Pazardaki yüzlerce aktif ilanı inceleyin ve size en uygun olanlara hemen teklif verin."
                action={{
                  label: 'Pazara Git',
                  onClick: () => router.push('/pazar'),
                  icon: LayoutDashboard
                }}
              />
            ) : driverOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/pazar/${offer.load_id}`}
                  className={`block p-5 rounded-2xl border transition-all bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark hover:border-accent/30 hover:shadow-md`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                          offer.status === 'accepted' ? t.badgeCompleted
                          : offer.status === 'rejected' ? t.badgeCancelled
                          : t.badgeActive
                        }`}>
                          {offer.status === 'accepted' ? '✅ Kabul Edildi'
                           : offer.status === 'rejected' ? '❌ Reddedildi'
                           : '⏳ Bekliyor'}
                        </span>
                        <span className={`text-xs ${t.muted}`}>
                          {new Date(offer.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <h3 className={`font-black mb-2 truncate ${t.heading}`}>{offer.load_title}</h3>
                      <div className={`flex items-center gap-3 text-sm ${t.sub}`}>
                        <span className="flex items-center gap-1.5"><MapPin size={13} className="text-accent" />{offer.origin_city_name}</span>
                        <ArrowRight size={13} className={t.muted} />
                        <span className="flex items-center gap-1.5"><MapPin size={13} className="text-green-500" />{offer.dest_city_name}</span>
                      </div>
                      {offer.note && <p className={`text-xs ${t.sub} mt-2`}>{offer.note}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      {offer.price && <div className={`font-black text-sm ${t.accent}`}>{formatPrice(offer.price)}</div>}
                      {offer.load_price && (
                        <div className={`text-xs ${t.muted} mt-0.5`}>İlan: {formatPrice(offer.load_price)}</div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        ) : (
          <div className="space-y-3">
            {conversations.length === 0 ? (
              <EmptyState 
                icon={MessageCircle}
                title="Henüz mesaj yok"
                description="Teklifler kabul edildikten sonra yük sahibi veya sürücü ile mesajlaşmaya başlayabilirsiniz."
                action={{
                  label: 'Aktif İşler',
                  onClick: () => setActiveTab('loads'),
                  icon: History
                }}
              />
            ) : conversations.map((conv, i) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/mesajlar/${conv.id}`}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark hover:border-accent/30 hover:shadow-md group`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <MessageCircle size={18} className="text-accent" />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${t.heading}`}>Yük #{conv.load_id.slice(0, 8)}</div>
                      <div className={`text-xs ${t.muted} mt-0.5`}>
                        {new Date(conv.last_message_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`${t.muted} group-hover:text-accent transition-colors`} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

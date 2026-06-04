'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LocationSearch from '@/components/LocationSearch';
import { useT } from '@/hooks/useT';
import { useTranslation } from '@/hooks/useTranslation';
import { LOAD_TAGS } from '@/utils/loadTags';
import { Package, MapPin, ArrowRight, Calendar, DollarSign, FileText, Loader2, Save, ArrowLeft, Trash2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const LOAD_TYPES: Record<string, string> = { general: 'General Cargo', hazardous: 'Hazardous Material', perishable: 'Perishable', oversized: 'Oversized', fragile: 'Fragile' };
const TRUCK_TYPES: Record<string, string> = { tir: 'TIR', kamyon: 'Truck', kamyonet: 'Van', dorser: 'Trailer', tanker: 'Tanker', frigorifik: 'Reefer' };

export function EditLoadPageClient() {
  const tStyle = useT();
  const { t, locale } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [originState, setOriginState] = useState<string | null>(null);
  const [originCountry, setOriginCountry] = useState('');
  
  const [destCity, setDestCity] = useState('');
  const [destState, setDestState] = useState<string | null>(null);
  const [destCountry, setDestCountry] = useState('');

  const [price, setPrice] = useState('');
  const [weightTon, setWeightTon] = useState('');
  const [loadType, setLoadType] = useState('general');
  const [requiredTruckType, setRequiredTruckType] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (id) fetchLoad();
  }, [id]);

  async function fetchLoad() {
    const { data } = await supabase.from('loads').select('*').eq('id', id!).single();
    if (!data || data.shipper_id !== user?.id) { router.push(`/${locale}/dashboard`); return; }
    if (data.status !== 'active') { router.push(`/${locale}/marketplace/${id}`); return; }
    setTitle(data.title);
    setOriginCity(data.origin_city || '');
    setOriginState(data.origin_state || null);
    setOriginCountry(data.origin_country || '');
    setDestCity(data.destination_city || '');
    setDestState(data.destination_state || null);
    setDestCountry(data.destination_country || '');
    setPrice(data.price?.toString() || '');
    setWeightTon(data.weight_ton?.toString() || '');
    setLoadType(data.load_type);
    setRequiredTruckType(data.required_truck_type || '');
    setPickupDate(data.pickup_date || '');
    setDeliveryDate(data.delivery_date || '');
    setDescription(data.description || '');
    setTags(data.tags || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!originCity || !destCity) { setError('Origin and Destination locations are required.'); return; }
    if (originCity === destCity && originCountry === destCountry) { setError('Origin and Destination cannot be the same.'); return; }
    if (!weightTon || Number(weightTon) <= 0) { setError('Valid weight is required.'); return; }
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from('loads').update({
      title: title.trim(), 
      origin_city: originCity, 
      origin_state: originState,
      origin_country: originCountry,
      destination_city: destCity, 
      destination_state: destState,
      destination_country: destCountry,
      price: price ? Number(price) : null, 
      weight_ton: Number(weightTon),
      load_type: loadType, 
      required_truck_type: requiredTruckType || null,
      pickup_date: pickupDate || null, 
      delivery_date: deliveryDate || null,
      description: description.trim() || null,
      tags,
    }).eq('id', id!).eq('shipper_id', user!.id);
    if (err) { setError(err.message); setSubmitting(false); return; }
    router.push(`/${locale}/marketplace/${id}`);
  }

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this load?')) return;
    setCancelling(true);
    await supabase.from('loads').update({ status: 'cancelled' }).eq('id', id!).eq('shipper_id', user!.id);
    router.push(`/${locale}/dashboard`);
  }

  if (loading) return (
    <div className={`${tStyle.pageFull} flex items-center justify-center`}>
      <div className={`w-8 h-8 border-2 ${tStyle.spinner} rounded-full animate-spin`} />
    </div>
  );

  return (
    <div className={tStyle.pageFull}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <Link href={`/${locale}/marketplace/${id}`} className={`flex items-center gap-2 ${tStyle.muted} hover:text-accent text-xs font-bold uppercase tracking-wider mb-3 transition-colors`}>
              <ArrowLeft size={14} />Back to Load
            </Link>
            <h1 className={`text-3xl font-black tracking-tight ${tStyle.heading} flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Package size={28} className="text-accent" />
              </div>
              Edit Load
            </h1>
          </div>
          <button onClick={handleCancel} disabled={cancelling}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${tStyle.btnDanger} disabled:opacity-50`}>
            {cancelling ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Cancel Load Ad
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <label className={`block text-sm font-bold ${tStyle.body} mb-3`}><FileText size={16} className={`inline mr-2 text-accent`} />Load Title <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Load title" required
              className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.input}`} />
          </div>

          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}><MapPin size={16} className="text-accent" />Route Details</h3>
            <div className="grid sm:grid-cols-[1fr,auto,1fr] items-center gap-4">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>Origin <span className="text-red-500">*</span></label>
                <LocationSearch 
                  initialValue={`${originCity}${originCountry ? ', ' + originCountry : ''}`}
                  onSelect={(loc) => { 
                    setOriginCity(loc.city); 
                    setOriginState(loc.state); 
                    setOriginCountry(loc.country); 
                  }} 
                  placeholder="Origin city/country" 
                />
              </div>
              <div className="flex items-center justify-center p-2">
                <ArrowRight size={20} className={`${tStyle.mutedDark} rotate-90 sm:rotate-0`} />
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>Destination <span className="text-red-500">*</span></label>
                <LocationSearch 
                  initialValue={`${destCity}${destCountry ? ', ' + destCountry : ''}`}
                  onSelect={(loc) => { 
                    setDestCity(loc.city); 
                    setDestState(loc.state); 
                    setDestCountry(loc.country); 
                  }} 
                  placeholder="Destination city/country" 
                />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}><DollarSign size={16} className="text-accent" />Price & Weight</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>{t.marketplace.price}</label>
                <div className="relative">
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Optional" min="0"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.input}`} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/40">CURR</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>{t.marketplace.weight} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="number" value={weightTon} onChange={(e) => setWeightTon(e.target.value)} placeholder="e.g. 15" required min="0.1" step="0.1"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.input}`} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/40">TON</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}><Package size={16} className="text-accent" />{t.marketplace.loadType} & {t.marketplace.truckType}</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>{t.marketplace.loadType}</label>
                <select value={loadType} onChange={(e) => setLoadType(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.select}`}>
                  {Object.entries(LOAD_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>{t.marketplace.truckType}</label>
                <select value={requiredTruckType} onChange={(e) => setRequiredTruckType(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.select}`}>
                  <option value="">Any Truck</option>
                  {Object.entries(TRUCK_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}><Calendar size={16} className="text-accent" />Dates</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>Pickup Date</label>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] ${tStyle.input}`} />
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>Delivery Date</label>
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] ${tStyle.input}`} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}>
              <Tag size={16} className="text-accent" />Tags
              <span className={`text-xs ${tStyle.muted} font-normal`}>(optional)</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {LOAD_TAGS.map((tag) => {
                const Icon = tag.icon;
                const selected = tags.includes(tag.id);
                return (
                  <button key={tag.id} type="button"
                    onClick={() => setTags(prev => selected ? prev.filter(t => t !== tag.id) : [...prev, tag.id])}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                      selected
                        ? `${tStyle.isDark ? tag.darkColor : tag.color} ${tStyle.isDark ? tag.darkBg : tag.bg} ${tStyle.isDark ? tag.darkBorder : tag.border} border-2 shadow-lg shadow-black/5`
                        : `${tStyle.btnSecondary} opacity-60 hover:opacity-100`
                    }`}>
                    <Icon size={14} />{t.loadTags[tag.id as keyof typeof t.loadTags] || tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <label className={`block text-sm font-bold ${tStyle.body} mb-3`}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional cargo details..." rows={4}
              className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all resize-none ${tStyle.input}`} />
          </div>

          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={submitting}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-accent/10 hover:shadow-accent/40 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3 ${tStyle.btnPrimary}`}>
            {submitting ? <><Loader2 size={20} className="animate-spin" />Saving...</> : <><Save size={20} />Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}

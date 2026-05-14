'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import CitySelect from '@/components/CitySelect';
import { useT } from '@/hooks/useT';
import { LOAD_TAGS } from '@/utils/loadTags';
import { Package, MapPin, ArrowRight, Calendar, DollarSign, FileText, Loader2, Save, ArrowLeft, Trash2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const LOAD_TYPES: Record<string, string> = { general: 'Genel Kargo', hazardous: 'Tehlikeli Madde', perishable: 'Bozulabilir', oversized: 'Aşırı Büyük', fragile: 'Kırılgan' };
const TRUCK_TYPES: Record<string, string> = { tir: 'TIR', kamyon: 'Kamyon', kamyonet: 'Kamyonet', dorser: 'Dorser', tanker: 'Tanker', frigorifik: 'Frigorifik' };

export function EditLoadPageClient() {
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [originCityId, setOriginCityId] = useState<number | null>(null);
  const [originDistrictId, setOriginDistrictId] = useState<number | null>(null);
  const [destCityId, setDestCityId] = useState<number | null>(null);
  const [destDistrictId, setDestDistrictId] = useState<number | null>(null);
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
    if (!data || data.shipper_id !== user?.id) { router.push('/panel'); return; }
    if (data.status !== 'active') { router.push(`/pazar/${id}`); return; }
    setTitle(data.title);
    setOriginCityId(data.origin_city_id);
    setOriginDistrictId(data.origin_district_id);
    setDestCityId(data.destination_city_id);
    setDestDistrictId(data.destination_district_id);
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
    if (!title.trim()) { setError('Başlık zorunludur.'); return; }
    if (!originCityId || !destCityId) { setError('Kalkış ve varış şehirleri zorunludur.'); return; }
    if (originCityId === destCityId) { setError('Kalkış ve varış şehirleri aynı olamaz.'); return; }
    if (!weightTon || Number(weightTon) <= 0) { setError('Geçerli bir ağırlık giriniz.'); return; }
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from('loads').update({
      title: title.trim(), origin_city_id: originCityId, origin_district_id: originDistrictId,
      destination_city_id: destCityId, destination_district_id: destDistrictId,
      price: price ? Number(price) : null, weight_ton: Number(weightTon),
      load_type: loadType, required_truck_type: requiredTruckType || null,
      pickup_date: pickupDate || null, delivery_date: deliveryDate || null,
      description: description.trim() || null,
      tags,
    }).eq('id', id!).eq('shipper_id', user!.id);
    if (err) { setError(err.message); setSubmitting(false); return; }
    router.push(`/pazar/${id}`);
  }

  async function handleCancel() {
    if (!confirm('İlanı iptal etmek istediğinize emin misiniz?')) return;
    setCancelling(true);
    await supabase.from('loads').update({ status: 'cancelled' }).eq('id', id!).eq('shipper_id', user!.id);
    router.push('/panel');
  }

  if (loading) return (
    <div className={`${t.pageFull} flex items-center justify-center`}>
      <div className={`w-8 h-8 border-2 ${t.spinner} rounded-full animate-spin`} />
    </div>
  );

  return (
    <div className={t.pageFull}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <Link href={`/pazar/${id}`} className={`flex items-center gap-2 ${t.muted} hover:text-accent text-xs font-bold uppercase tracking-wider mb-3 transition-colors`}>
              <ArrowLeft size={14} />İlana Dön
            </Link>
            <h1 className={`text-3xl font-black tracking-tight ${t.heading} flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Package size={28} className="text-accent" />
              </div>
              İlan Düzenle
            </h1>
          </div>
          <button onClick={handleCancel} disabled={cancelling}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${t.btnDanger} disabled:opacity-50`}>
            {cancelling ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            İlanı İptal Et
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`p-6 rounded-2xl ${t.card}`}>
            <label className={`block text-sm font-bold ${t.body} mb-3`}><FileText size={16} className={`inline mr-2 text-accent`} />İlan Başlığı <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="İlan başlığı" required
              className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.input}`} />
          </div>

          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}><MapPin size={16} className="text-accent" />Güzergah</h3>
            <div className="grid sm:grid-cols-[1fr,auto,1fr] items-center gap-4">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Kalkış <span className="text-red-500">*</span></label>
                <CitySelect value={originCityId} onChange={(c, d) => { setOriginCityId(c); setOriginDistrictId(d); }} placeholder="Şehir seçin" districtValue={originDistrictId} />
              </div>
              <div className="flex items-center justify-center p-2">
                <ArrowRight size={20} className={`${t.mutedDark} rotate-90 sm:rotate-0`} />
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Varış <span className="text-red-500">*</span></label>
                <CitySelect value={destCityId} onChange={(c, d) => { setDestCityId(c); setDestDistrictId(d); }} placeholder="Şehir seçin" districtValue={destDistrictId} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}><DollarSign size={16} className="text-accent" />Fiyat & Ağırlık</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Fiyat (₺)</label>
                <div className="relative">
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Opsiyonel" min="0"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.input}`} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/40">TL</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Ağırlık (Ton) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="number" value={weightTon} onChange={(e) => setWeightTon(e.target.value)} placeholder="Örn: 15" required min="0.1" step="0.1"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.input}`} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/40">TON</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}><Package size={16} className="text-accent" />Yük & Araç Tipi</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Yük Tipi</label>
                <select value={loadType} onChange={(e) => setLoadType(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.select}`}>
                  {Object.entries(LOAD_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Araç Tipi</label>
                <select value={requiredTruckType} onChange={(e) => setRequiredTruckType(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.select}`}>
                  <option value="">Farketmez</option>
                  {Object.entries(TRUCK_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}><Calendar size={16} className="text-accent" />Tarihler</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Yükleme Tarihi</label>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] ${t.input}`} />
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Teslim Tarihi</label>
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] ${t.input}`} />
              </div>
            </div>
          </div>


          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}>
              <Tag size={16} className="text-accent" />Etiketler
              <span className={`text-xs ${t.muted} font-normal`}>(isteğe bağlı)</span>
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
                        ? `${t.isDark ? tag.darkColor : tag.color} ${t.isDark ? tag.darkBg : tag.bg} ${t.isDark ? tag.darkBorder : tag.border} border-2 shadow-lg shadow-black/5`
                        : `${t.btnSecondary} opacity-60 hover:opacity-100`
                    }`}>
                    <Icon size={14} />{tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${t.card}`}>
            <label className={`block text-sm font-bold ${t.body} mb-3`}>Açıklama</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Yük hakkında ek bilgiler..." rows={4}
              className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all resize-none ${t.input}`} />
          </div>

          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={submitting}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-accent/10 hover:shadow-accent/40 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3 ${t.btnPrimary}`}>
            {submitting ? <><Loader2 size={20} className="animate-spin" />Güncelleniyor...</> : <><Save size={20} />Değişiklikleri Kaydet</>}
          </button>
        </form>
      </div>
    </div>
  );
}

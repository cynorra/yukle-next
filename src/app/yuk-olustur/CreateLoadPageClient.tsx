'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import CitySelect from '@/components/CitySelect';
import { useT } from '@/hooks/useT';
import { Package, MapPin, ArrowRight, Calendar, DollarSign, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LOAD_TYPES: Record<string, string> = {
  general: 'Genel Kargo',
  hazardous: 'Tehlikeli Madde',
  perishable: 'Bozulabilir',
  oversized: 'Aşırı Büyük',
  fragile: 'Kırılgan',
};

const TRUCK_TYPES: Record<string, string> = {
  tir: 'TIR',
  kamyon: 'Kamyon',
  kamyonet: 'Kamyonet',
  dorser: 'Dorser',
  tanker: 'Tanker',
  frigorifik: 'Frigorifik',
};

export function CreateLoadPageClient() {
  const t = useT();
  const { user } = useAuth();
  const router = useRouter();

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!title.trim()) {
      setError('İlan başlığı zorunludur.');
      return;
    }
    if (title.trim().length < 5) {
      setError('İlan başlığı en az 5 karakter olmalıdır.');
      return;
    }
    if (!originCityId) {
      setError('Kalkış şehri seçilmesi zorunludur.');
      return;
    }
    if (!destCityId) {
      setError('Varış şehri seçilmesi zorunludur.');
      return;
    }
    if (originCityId === destCityId) {
      setError('Kalkış ve varış şehirleri aynı olamaz.');
      return;
    }
    if (!weightTon || Number(weightTon) <= 0) {
      setError('Geçerli bir ağırlık girilmesi zorunludur.');
      return;
    }
    if (Number(weightTon) > 100) {
      setError('Ağırlık 100 tondan fazla olamaz.');
      return;
    }
    if (price && Number(price) < 0) {
      setError('Fiyat negatif olamaz.');
      return;
    }
    if (pickupDate && deliveryDate && deliveryDate < pickupDate) {
      setError('Teslim tarihi, yükleme tarihinden önce olamaz.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('loads').insert({
      title: title.trim(),
      shipper_id: user.id,
      origin_city_id: originCityId,
      origin_district_id: originDistrictId,
      destination_city_id: destCityId,
      destination_district_id: destDistrictId,
      price: price ? Number(price) : null,
      weight_ton: Number(weightTon),
      load_type: loadType,
      required_truck_type: requiredTruckType || null,
      pickup_date: pickupDate || null,
      delivery_date: deliveryDate || null,
      description: description.trim() || null,
      status: 'active',
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push('/panel');
  }

  return (
    <div className={t.pageFull}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className={`text-3xl font-black tracking-tight ${t.heading} flex items-center gap-4`}>
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Package size={28} className="text-accent" />
            </div>
            Yük Oluştur
          </h1>
          <p className={`text-sm ${t.muted} mt-3 font-medium`}>Yük ilanınızı oluşturun ve binlerce nakliyeciye anında ulaşın.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className={`p-6 rounded-2xl ${t.card}`}>
            <label className={`block text-sm font-bold ${t.body} mb-3`}>
              <FileText size={16} className="inline mr-2 text-accent" />
              İlan Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: İstanbul'dan Ankara'ya tekstil yükü"
              required
              className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.input}`}
            />
          </div>

          {/* Route */}
          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}>
              <MapPin size={16} className="text-accent" />
              Güzergah
            </h3>
            <div className="grid sm:grid-cols-[1fr,auto,1fr] items-center gap-4">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Kalkış Şehri <span className="text-red-500">*</span></label>
                <CitySelect
                  value={originCityId}
                  onChange={(c, d) => { setOriginCityId(c); setOriginDistrictId(d); }}
                  placeholder="Şehir seçin"
                  districtValue={originDistrictId}
                />
              </div>
              <div className="flex items-center justify-center p-2">
                <ArrowRight size={20} className={`${t.mutedDark} rotate-90 sm:rotate-0`} />
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Varış Şehri <span className="text-red-500">*</span></label>
                <CitySelect
                  value={destCityId}
                  onChange={(c, d) => { setDestCityId(c); setDestDistrictId(d); }}
                  placeholder="Şehir seçin"
                  districtValue={destDistrictId}
                />
              </div>
            </div>
          </div>

          {/* Price & Weight */}
          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}>
              <DollarSign size={16} className="text-accent" />
              Fiyat & Ağırlık
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Fiyat (₺)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Teklif usulü için boş bırakın"
                    min="0"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.input}`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/40">TL</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Ağırlık (Ton) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    value={weightTon}
                    onChange={(e) => setWeightTon(e.target.value)}
                    placeholder="Örn: 15"
                    required
                    min="0.1"
                    step="0.1"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.input}`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/40">TON</div>
                </div>
              </div>
            </div>
          </div>

          {/* Load Type & Truck Type */}
          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}>
              <Package size={16} className="text-accent" />
              Yük & Araç Tipi
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Yük Tipi</label>
                <select
                  value={loadType}
                  onChange={(e) => setLoadType(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.select}`}
                >
                  {Object.entries(LOAD_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Gerekli Araç Tipi</label>
                <select
                  value={requiredTruckType}
                  onChange={(e) => setRequiredTruckType(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${t.select}`}
                >
                  <option value="">Farketmez</option>
                  {Object.entries(TRUCK_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className={`p-6 rounded-2xl ${t.card}`}>
            <h3 className={`text-sm font-bold ${t.body} mb-5 flex items-center gap-2`}>
              <Calendar size={16} className="text-accent" />
              Tarihler
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Yükleme Tarihi</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] ${t.input}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${t.mutedDark}`}>Teslim Tarihi</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] ${t.input}`}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={`p-6 rounded-2xl ${t.card}`}>
            <label className={`block text-sm font-bold ${t.body} mb-3`}>
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Yük hakkında ek bilgiler, paketleme detayları vb..."
              rows={4}
              className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all resize-none ${t.input}`}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${t.btnPrimary}`}
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                İlan Oluşturuluyor...
              </>
            ) : (
              <>
                <Package size={20} />
                İlanı Yayınla
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

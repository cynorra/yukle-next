'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LocationSearch from '@/components/LocationSearch';
import { useT } from '@/hooks/useT';
import { useTranslation } from '@/hooks/useTranslation';
import { Package, MapPin, ArrowRight, Calendar, DollarSign, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LOAD_TYPES: Record<string, string> = {
  general: 'General Cargo',
  hazardous: 'Hazardous Material',
  perishable: 'Perishable',
  oversized: 'Oversized',
  fragile: 'Fragile',
};

const TRUCK_TYPES: Record<string, string> = {
  tir: 'TIR',
  kamyon: 'Truck',
  kamyonet: 'Van',
  dorser: 'Trailer',
  tanker: 'Tanker',
  frigorifik: 'Reefer',
};

export function CreateLoadPageClient() {
  const tStyle = useT();
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }
    if (!originCity) {
      setError('Origin location is required.');
      return;
    }
    if (!destCity) {
      setError('Destination location is required.');
      return;
    }
    if (originCity === destCity && originCountry === destCountry) {
      setError('Origin and Destination cannot be the same.');
      return;
    }
    if (!weightTon || Number(weightTon) <= 0) {
      setError('Valid weight is required.');
      return;
    }
    if (Number(weightTon) > 100) {
      setError('Weight cannot exceed 100 tons.');
      return;
    }
    if (price && Number(price) < 0) {
      setError('Price cannot be negative.');
      return;
    }
    if (pickupDate && deliveryDate && deliveryDate < pickupDate) {
      setError('Delivery date cannot be before pickup date.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('loads').insert({
      title: title.trim(),
      shipper_id: user.id,
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
      status: 'active',
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push(`/${locale}/dashboard`);
  }

  return (
    <div className={tStyle.pageFull}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className={`text-3xl font-black tracking-tight ${tStyle.heading} flex items-center gap-4`}>
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Package size={28} className="text-accent" />
            </div>
            {t.marketplace.postLoadBtn}
          </h1>
          <p className={`text-sm ${tStyle.muted} mt-3 font-medium`}>Create a shipping ad and reach thousands of carriers worldwide instantly.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <label className={`block text-sm font-bold ${tStyle.body} mb-3`}>
              <FileText size={16} className="inline mr-2 text-accent" />
              Load Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Textiles from Hamburg to Munich"
              required
              className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.input}`}
            />
          </div>

          {/* Route */}
          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}>
              <MapPin size={16} className="text-accent" />
              Route Details
            </h3>
            <div className="grid sm:grid-cols-[1fr,auto,1fr] items-center gap-4">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>Origin <span className="text-red-500">*</span></label>
                <LocationSearch
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

          {/* Price & Weight */}
          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}>
              <DollarSign size={16} className="text-accent" />
              Price & Weight
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>{t.marketplace.price}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Leave empty for negotiation"
                    min="0"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.input}`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/40">CURR</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>{t.marketplace.weight} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    value={weightTon}
                    onChange={(e) => setWeightTon(e.target.value)}
                    placeholder="e.g. 15"
                    required
                    min="0.1"
                    step="0.1"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.input}`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted/40">TON</div>
                </div>
              </div>
            </div>
          </div>

          {/* Load Type & Truck Type */}
          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}>
              <Package size={16} className="text-accent" />
              {t.marketplace.loadType} & {t.marketplace.truckType}
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>{t.marketplace.loadType}</label>
                <select
                  value={loadType}
                  onChange={(e) => setLoadType(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.select}`}
                >
                  {Object.entries(LOAD_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>{t.marketplace.truckType}</label>
                <select
                  value={requiredTruckType}
                  onChange={(e) => setRequiredTruckType(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all ${tStyle.select}`}
                >
                  <option value="">Any Truck</option>
                  {Object.entries(TRUCK_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <h3 className={`text-sm font-bold ${tStyle.body} mb-5 flex items-center gap-2`}>
              <Calendar size={16} className="text-accent" />
              Dates
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] ${tStyle.input}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`block text-[11px] font-black uppercase tracking-wider ${tStyle.mutedDark}`}>Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className={`w-full px-4 py-3.5 rounded-xl outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] ${tStyle.input}`}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={`p-6 rounded-2xl ${tStyle.card}`}>
            <label className={`block text-sm font-bold ${tStyle.body} mb-3`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional cargo information, packaging requirements, etc."
              rows={4}
              className={`w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all resize-none ${tStyle.input}`}
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
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${tStyle.btnPrimary}`}
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Publishing Load...
              </>
            ) : (
              <>
                <Package size={20} />
                Publish Load Ad
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

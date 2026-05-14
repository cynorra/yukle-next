'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Load, City, DriverRoute } from '@/types/database';
import CitySelect from '@/components/CitySelect';
import {
  Package,
  Clock,
  SlidersHorizontal,
  X,
  Route,
  Search,
  ChevronRight,
  Weight,
  Truck,
  Zap,
  LayoutDashboard,
} from 'lucide-react';
import { useT } from '@/hooks/useT';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';

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

const QUICK_CITY_IDS = [34, 6, 35, 7, 16, 27, 38, 42, 21, 55];
const PAGE_SIZE = 50;

interface MarketClientProps {
  initialLoads: Load[];
  initialTotal: number;
  cities: City[];
}

export function MarketClient({ initialLoads, initialTotal, cities }: MarketClientProps) {
  const { profile } = useAuth();
  const t = useT();

  const [originCityId, setOriginCityId] = useState<number | null>(null);
  const [originDistrictId, setOriginDistrictId] = useState<number | null>(null);
  const [destCityId, setDestCityId] = useState<number | null>(null);
  const [destDistrictId, setDestDistrictId] = useState<number | null>(null);
  const [loadType, setLoadType] = useState<string>('');
  const [truckType, setTruckType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const [loads, setLoads] = useState<Load[]>(initialLoads);
  const [driverRoutes, setDriverRoutes] = useState<DriverRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [routeMatchMode, setRouteMatchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(initialTotal);
  // İlk render sunucudan geldi, filtreler değişene kadar tekrar fetch etme
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (profile?.role === 'driver' && profile.id) {
      supabase
        .from('driver_routes')
        .select(
          '*, origin_city:cities!driver_routes_origin_city_id_fkey(*), destination_city:cities!driver_routes_destination_city_id_fkey(*)'
        )
        .eq('driver_id', profile.id)
        .eq('is_active', true)
        .then(({ data, error }) => {
          if (error) {
            console.error('Driver routes fetch error:', error);
            return;
          }
          if (data) setDriverRoutes(data as unknown as DriverRoute[]);
        });
    }
  }, [profile]);

  const fetchLoads = useCallback(async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('loads')
        .select(
          '*, origin_city:cities!loads_origin_city_id_fkey(*), destination_city:cities!loads_destination_city_id_fkey(*), shipper:public_profiles!loads_shipper_id_fkey(id, full_name, company_name, is_verified, rating)',
          { count: 'exact' }
        )
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (routeMatchMode && driverRoutes.length > 0) {
        const originIds = driverRoutes.map((r) => r.origin_city_id);
        const destIds = driverRoutes.map((r) => r.destination_city_id);
        query = query.in('origin_city_id', originIds).in('destination_city_id', destIds);
      } else {
        if (originCityId) query = query.eq('origin_city_id', originCityId);
        if (originDistrictId) query = query.eq('origin_district_id', originDistrictId);
        if (destCityId) query = query.eq('destination_city_id', destCityId);
        if (destDistrictId) query = query.eq('destination_district_id', destDistrictId);
      }

      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim().toLowerCase();
        const words = searchTerm.split(/\s+/).filter((w) => w.length > 1);

        const foundCityIds = new Set<number>();
        words.forEach((word) => {
          cities
            .filter((c) => c.name.toLowerCase().includes(word))
            .forEach((c) => foundCityIds.add(c.id));
        });

        const cityIds = Array.from(foundCityIds);

        if (cityIds.length > 0) {
          const orConditions = [`title.ilike.%${searchTerm}%`];

          if (cityIds.length === 2) {
            const [id1, id2] = cityIds;
            orConditions.push(`and(origin_city_id.eq.${id1},destination_city_id.eq.${id2})`);
            orConditions.push(`and(origin_city_id.eq.${id2},destination_city_id.eq.${id1})`);
          } else {
            cityIds.forEach((id) => {
              orConditions.push(`origin_city_id.eq.${id}`);
              orConditions.push(`destination_city_id.eq.${id}`);
            });
          }

          query = query.or(orConditions.join(','));
        } else {
          query = query.ilike('title', `%${searchTerm}%`);
        }
      }

      if (loadType) query = query.eq('load_type', loadType);
      if (truckType) query = query.eq('required_truck_type', truckType);

      const { data, count, error } = await query;

      if (error) throw error;

      setLoads((data as unknown as Load[]) || []);
      setTotal(count || 0);
    } catch (error) {
      console.error('Loads fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [
    originCityId,
    originDistrictId,
    destCityId,
    destDistrictId,
    loadType,
    truckType,
    page,
    routeMatchMode,
    searchQuery,
    driverRoutes,
    cities,
  ]);

  useEffect(() => {
    // İlk mount'ta server'dan gelen initialLoads kullan, fetch atma
    if (!hydrated) {
      setHydrated(true);
      return;
    }
    fetchLoads();
  }, [fetchLoads, hydrated]);

  function handleQuickCity(cityId: number, isOrigin: boolean) {
    if (isOrigin) {
      setOriginCityId(originCityId === cityId ? null : cityId);
      setOriginDistrictId(null);
    } else {
      setDestCityId(destCityId === cityId ? null : cityId);
      setDestDistrictId(null);
    }
    setPage(0);
  }

  function clearFilters() {
    setOriginCityId(null);
    setOriginDistrictId(null);
    setDestCityId(null);
    setDestDistrictId(null);
    setLoadType('');
    setTruckType('');
    setRouteMatchMode(false);
    setSearchQuery('');
    setPage(0);
  }

  const hasActiveFilters =
    originCityId || destCityId || loadType || truckType || routeMatchMode || searchQuery;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const quickCities = cities
    .filter((c) => QUICK_CITY_IDS.includes(c.id))
    .sort((a, b) => QUICK_CITY_IDS.indexOf(a.id) - QUICK_CITY_IDS.indexOf(b.id));

  return (
    <div className={t.pageFull}>
      {/* Header / Search bar */}
      <div
        className={`sticky top-16 z-30 backdrop-blur-md border-b ${t.divider} bg-background-light/80 dark:bg-background-dark/80`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-muted">{total} aktif yük ilanı</p>
            </div>

            <div className="flex items-center gap-3">
              {profile?.role === 'driver' && driverRoutes.length > 0 && (
                <button
                  onClick={() => {
                    setRouteMatchMode(!routeMatchMode);
                    if (!routeMatchMode) {
                      setOriginCityId(null);
                      setDestCityId(null);
                    }
                    setPage(0);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                    routeMatchMode
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
                  )}
                >
                  <Route size={18} />
                  Güzergahıma Uyanlar
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border',
                  showFilters
                    ? 'bg-fg text-background-light border-fg'
                    : 'bg-surface-light dark:bg-surface-dark text-fg border-border-light dark:border-border-dark hover:border-accent/40'
                )}
              >
                <SlidersHorizontal size={18} />
                Filtrele
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Yük başlığı veya şehir ara (Örn: Sakarya Adana)..."
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark focus:border-accent/40 focus:ring-4 focus:ring-accent/5 outline-none transition-all font-medium text-fg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted shrink-0">
              Popüler:
            </span>
            {quickCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleQuickCity(city.id, true)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border',
                  originCityId === city.id
                    ? 'bg-accent border-accent text-white shadow-md shadow-accent/10'
                    : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-muted hover:border-accent/30 hover:text-fg'
                )}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                    Kalkış
                  </label>
                  <CitySelect
                    value={originCityId}
                    onChange={(c, d) => {
                      setOriginCityId(c);
                      setOriginDistrictId(d);
                      setPage(0);
                    }}
                    placeholder="Şehir seçin"
                    districtValue={originDistrictId}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                    Varış
                  </label>
                  <CitySelect
                    value={destCityId}
                    onChange={(c, d) => {
                      setDestCityId(c);
                      setDestDistrictId(d);
                      setPage(0);
                    }}
                    placeholder="Şehir seçin"
                    districtValue={destDistrictId}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                    Yük Tipi
                  </label>
                  <select
                    value={loadType}
                    onChange={(e) => {
                      setLoadType(e.target.value);
                      setPage(0);
                    }}
                    className={t.select}
                  >
                    <option value="">Tümü</option>
                    {Object.entries(LOAD_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted">
                    Araç Tipi
                  </label>
                  <select
                    value={truckType}
                    onChange={(e) => {
                      setTruckType(e.target.value);
                      setPage(0);
                    }}
                    className={t.select}
                  >
                    <option value="">Tümü</option>
                    {Object.entries(TRUCK_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm font-bold text-accent hover:underline"
                  >
                    <X size={16} /> Filtreleri Temizle
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-sm font-bold text-muted animate-pulse">İlanlar yükleniyor...</p>
          </div>
        ) : loads.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Yük Bulunamadı"
            description="Aradığınız kriterlere uygun aktif ilan bulunmuyor. Filtreleri temizleyerek tekrar deneyebilirsiniz."
            action={{
              label: 'Tüm İlanları Göster',
              onClick: clearFilters,
              icon: LayoutDashboard,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {loads.map((load, idx) => (
              <motion.div
                key={load.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link
                  href={`/pazar/${load.id}`}
                  className="group block bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-[1.5rem] hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        <span className="text-sm font-black text-fg truncate">
                          {load.origin_city?.name}
                        </span>
                      </div>
                      <div className="flex-1 flex items-center gap-1 min-w-0">
                        <div className="h-px flex-1 bg-border-light dark:bg-border-dark" />
                        <Truck size={14} className="text-muted shrink-0" />
                        <div className="h-px flex-1 bg-border-light dark:bg-border-dark" />
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <span className="text-sm font-black text-fg truncate">
                          {load.destination_city?.name}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      {load.price ? (
                        <span className="text-lg font-black text-accent">
                          {load.price.toLocaleString('tr-TR')} ₺
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm font-black text-accent">
                          <Zap size={14} />
                          Teklif Al
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-black text-fg group-hover:text-accent transition-colors truncate mb-3">
                          {load.title}
                        </h3>
                        <div className="flex items-center flex-wrap gap-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-muted">
                            <Weight size={13} />
                            {load.weight_ton} Ton
                          </span>
                          {load.required_truck_type && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-muted">
                              <Truck size={13} />
                              {TRUCK_TYPES[load.required_truck_type] || load.required_truck_type}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-xs text-muted/60">
                            <Clock size={12} />
                            {new Date(load.created_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all shrink-0">
                        <ChevronRight
                          size={16}
                          className="text-accent group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform rounded-r-full" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-border-light dark:border-border-dark">
            <button
              onClick={() => {
                setPage(Math.max(0, page - 1));
                window.scrollTo(0, 0);
              }}
              disabled={page === 0}
              className="px-6 py-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-bold disabled:opacity-30 hover:bg-background-light dark:hover:bg-background-dark transition-all"
            >
              Önceki
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-fg">{page + 1}</span>
              <span className="text-sm font-bold text-muted">/</span>
              <span className="text-sm font-bold text-muted">{totalPages}</span>
            </div>
            <button
              onClick={() => {
                setPage(Math.min(totalPages - 1, page + 1));
                window.scrollTo(0, 0);
              }}
              disabled={page >= totalPages - 1}
              className="px-6 py-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-bold disabled:opacity-30 hover:bg-background-light dark:hover:bg-background-dark transition-all"
            >
              Sonraki
            </button>
          </div>
        )}
      </main>

      <footer className="mt-20 px-4 py-12 border-t border-border-light dark:border-border-dark bg-surface-light/30 dark:bg-surface-dark/30">
        <p className="text-[10px] font-bold text-muted text-center leading-relaxed max-w-2xl mx-auto uppercase tracking-widest">
          YükLe Lojistik Portalı · Bu sayfa {total} aktif ilan içeriyor · Güvenli taşımacılık için
          kurumsal üyeliği tercih edin
        </p>
      </footer>
    </div>
  );
}

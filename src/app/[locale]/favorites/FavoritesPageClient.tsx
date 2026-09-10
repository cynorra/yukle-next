'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { useT } from '@/hooks/useT';
import { formatLocaleDate, formatLocaleCurrency } from '@/utils/intlFormat';
import { getAppTranslation } from '@/utils/getAppTranslation';
import { Heart, MapPin, ArrowRight, Clock, Package, Trash2 } from 'lucide-react';

interface FavoriteLoad {
  favorite_id: string;
  load_id: string;
  title: string;
  price: number | null;
  weight_ton: number;
  status: string;
  origin_city_name: string;
  dest_city_name: string;
  favorited_at: string;
  created_at: string;
}

export function FavoritesPageClient() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useT();
  const { t: tGlobal } = useTranslation();
  const c = getAppTranslation(locale);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteLoad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchFavorites(); }, [user]);

  async function fetchFavorites() {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select(`id, created_at, load:loads!favorites_load_id_fkey(id, title, price, weight_ton, status, created_at, origin_city, destination_city)`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    interface FavResponse {
      id: string;
      created_at: string;
      load: {
        id: string;
        title: string;
        price: number | null;
        weight_ton: number;
        status: string;
        created_at: string;
        origin_city: string;
        destination_city: string;
      } | null;
    }

    const mapped = ((data as unknown as FavResponse[]) || [])
      .map((f) => ({
        favorite_id: f.id,
        load_id: f.load?.id || '',
        title: f.load?.title || '',
        price: f.load?.price ?? null,
        weight_ton: f.load?.weight_ton || 0,
        status: f.load?.status || '',
        origin_city_name: f.load?.origin_city || '',
        dest_city_name: f.load?.destination_city || '',
        favorited_at: f.created_at,
        created_at: f.load?.created_at || '',
      }))
      .filter((f) => f.load_id !== '');

    setFavorites(mapped);
    setLoading(false);
  }

  async function removeFavorite(favoriteId: string) {
    await supabase.from('favorites').delete().eq('id', favoriteId);
    setFavorites((prev) => prev.filter((f) => f.favorite_id !== favoriteId));
  }

  function statusLabel(status: string) {
    if (status === 'active') return tGlobal.marketplace.active;
    if (status === 'completed') return tGlobal.marketplace.completed;
    if (status === 'in_transit') return tGlobal.marketplace.inTransit;
    return tGlobal.marketplace.cancelled;
  }

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Heart size={28} className={t.accent} />{c.favorites.title}
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>{c.favorites.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`w-8 h-8 border-2 ${t.spinner} rounded-full animate-spin`} />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className={`${t.mutedDark} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>{c.favorites.noFavoritesTitle}</h3>
            <p className={`${t.sub} text-sm mb-6`}>{c.favorites.noFavoritesDesc}</p>
            <Link href={`/${locale}/dashboard`} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${t.btnPrimary}`}>
              <Package size={16} />{c.favorites.goToDashboard}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => (
              <div key={fav.favorite_id} className={`flex items-center justify-between p-5 rounded-2xl ${t.card} ${t.cardHover} transition-all`}>
                <Link href={`/${locale}/marketplace/${fav.load_id}`} className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                      fav.status === 'active' ? t.badgeActive : fav.status === 'completed' ? t.badgeCompleted : t.badgeCancelled
                    }`}>
                      {statusLabel(fav.status)}
                    </span>
                    <span className={`text-xs ${t.muted} flex items-center gap-1`}>
                      <Clock size={11} />{formatLocaleDate(locale, fav.created_at)}
                    </span>
                  </div>
                  <h3 className={`${t.heading} font-bold mb-1.5 truncate hover:${t.accent} transition-colors`}>{fav.title}</h3>
                  <div className={`flex items-center gap-3 text-sm ${t.sub}`}>
                    <span className="flex items-center gap-1"><MapPin size={13} className={t.accent} />{fav.origin_city_name}</span>
                    <ArrowRight size={13} className={t.mutedDark} />
                    <span className="flex items-center gap-1"><MapPin size={13} className="text-green-400" />{fav.dest_city_name}</span>
                    <span className={t.muted}>{fav.weight_ton} {c.favorites.ton}</span>
                  </div>
                </Link>
                <div className="flex items-center gap-3 shrink-0">
                  {fav.price && <span className={`font-bold text-sm ${t.accent}`}>{formatLocaleCurrency(locale, fav.price)}</span>}
                  <button onClick={() => removeFavorite(fav.favorite_id)}
                    className={`p-2 rounded-lg transition-all ${t.btnDanger}`} title={c.favorites.removeFavorite}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

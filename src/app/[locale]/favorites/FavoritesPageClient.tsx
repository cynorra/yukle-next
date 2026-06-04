'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useT } from '@/hooks/useT';
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
  const t = useT();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteLoad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchFavorites(); }, [user]);

  async function fetchFavorites() {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select(`id, created_at, load:loads!favorites_load_id_fkey(id, title, price, weight_ton, status, created_at, origin_city:cities!loads_origin_city_id_fkey(name), destination_city:cities!loads_destination_city_id_fkey(name))`)
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
        origin_city: { name: string };
        destination_city: { name: string };
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
        origin_city_name: f.load?.origin_city?.name || '',
        dest_city_name: f.load?.destination_city?.name || '',
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

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Heart size={28} className={t.accent} />Favorilerim
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>Kaydettiğiniz yük ilanları.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`w-8 h-8 border-2 ${t.spinner} rounded-full animate-spin`} />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className={`${t.mutedDark} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>Favori ilan yok</h3>
            <p className={`${t.sub} text-sm mb-6`}>İlan detay sayfasından favorilere ekleyebilirsiniz.</p>
            <Link href="/pazar" className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${t.btnPrimary}`}>
              <Package size={16} />Pazara Git
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => (
              <div key={fav.favorite_id} className={`flex items-center justify-between p-5 rounded-2xl ${t.card} ${t.cardHover} transition-all`}>
                <Link href={`/pazar/${fav.load_id}`} className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                      fav.status === 'active' ? t.badgeActive : fav.status === 'completed' ? t.badgeCompleted : t.badgeCancelled
                    }`}>
                      {fav.status === 'active' ? 'Aktif' : fav.status === 'completed' ? 'Tamamlandı' : fav.status === 'in_transit' ? 'Taşınıyor' : 'İptal'}
                    </span>
                    <span className={`text-xs ${t.muted} flex items-center gap-1`}>
                      <Clock size={11} />{new Date(fav.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <h3 className={`${t.heading} font-bold mb-1.5 truncate hover:${t.accent} transition-colors`}>{fav.title}</h3>
                  <div className={`flex items-center gap-3 text-sm ${t.sub}`}>
                    <span className="flex items-center gap-1"><MapPin size={13} className={t.accent} />{fav.origin_city_name}</span>
                    <ArrowRight size={13} className={t.mutedDark} />
                    <span className="flex items-center gap-1"><MapPin size={13} className="text-green-400" />{fav.dest_city_name}</span>
                    <span className={t.muted}>{fav.weight_ton} Ton</span>
                  </div>
                </Link>
                <div className="flex items-center gap-3 shrink-0">
                  {fav.price && <span className={`font-bold text-sm ${t.accent}`}>{fav.price.toLocaleString('tr-TR')} TL</span>}
                  <button onClick={() => removeFavorite(fav.favorite_id)}
                    className={`p-2 rounded-lg transition-all ${t.btnDanger}`} title="Favoriden Çıkar">
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

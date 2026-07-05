'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/hooks/useT';
import { useTranslation } from '@/hooks/useTranslation';
import { Star, Shield, Building2, MapPin, ArrowRight, Package, Zap, MessageCircle, Calendar } from 'lucide-react';

interface PublicProfile {
  id: string;
  full_name: string;
  company_name: string | null;
  role: 'shipper' | 'driver';
  rating: number | null;
  is_verified: boolean;
  points: number;
  avatar_url: string | null;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: { id: string; full_name: string; avatar_url: string | null; };
}

interface PublicLoad {
  id: string;
  title: string;
  status: string;
  origin_city: string;
  destination_city: string;
  title_translations?: Record<string, string> | null;
  created_at: string;
}

const STAR_COLORS = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-lime-400', 'text-green-400'];

interface PublicProfilePageClientProps {
  profile: PublicProfile;
  reviews: Review[];
  loads: PublicLoad[];
}

export function PublicProfilePageClient({ profile, reviews, loads }: PublicProfilePageClientProps) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'reviews' | 'loads'>('reviews');

  const t = useT();

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < rating ? `fill-current ${STAR_COLORS[rating]}` : 'text-gray-600'} />
    ));
  }

  const completedLoads = loads.filter((l) => l.status === 'completed').length;
  const isOwnProfile = user?.id === id;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Profil kartı */}
        <div className={`p-6 rounded-2xl ${t.card} mb-6`}>
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-[#F5A623]/10 flex items-center justify-center shrink-0 text-3xl font-bold text-[#F5A623]">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover" />
                : profile.full_name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className={`text-2xl font-bold ${t.heading}`}>{profile.full_name}</h1>
                {profile.is_verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                    <Shield size={12} />Doğrulandı
                  </span>
                )}
              </div>
              {profile.company_name && (
                <div className={`flex items-center gap-1 ${t.sub} text-sm mb-2`}>
                  <Building2 size={14} />
                  {profile.company_name}
                </div>
              )}
              <div className="flex items-center gap-1 text-sm mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${profile.role === 'driver' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20'}`}>
                  {profile.role === 'driver' ? 'Sürücü' : 'Yük Sahibi'}
                </span>
              </div>

              {/* İstatistikler */}
              <div className="flex items-center gap-4 flex-wrap">
                {profile.rating != null && (
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(profile.rating))}
                    <span className={`${t.heading} font-bold text-sm ml-1`}>{profile.rating.toFixed(1)}</span>
                    <span className={`${t.muted} text-xs`}>({reviews.length} yorum)</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-[#F5A623] text-sm font-bold">
                  <Zap size={14} className="fill-[#F5A623]" />{profile.points.toLocaleString('tr-TR')} puan
                </div>
                {completedLoads > 0 && (
                  <div className={`flex items-center gap-1 ${t.sub} text-sm`}>
                    <Package size={14} />{completedLoads} tamamlanan taşıma
                  </div>
                )}
                <div className={`flex items-center gap-1 ${t.muted} text-xs`}>
                  <Calendar size={12} />
                  {new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} üye
                </div>
              </div>
            </div>
          </div>

          {/* Aksiyon butonları */}
          {!isOwnProfile && user && (
            <div className="mt-5 pt-5 border-t border-white/[0.06] flex gap-3">
              <Link href={`/mesajlar`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 text-sm font-medium hover:bg-[#F5A623]/20 transition-colors">
                <MessageCircle size={16} />Mesaj Gönder
              </Link>
            </div>
          )}
          {isOwnProfile && (
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <Link href="/profil"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] ${t.body} border border-white/[0.08] text-sm font-medium hover:bg-white/[0.08] transition-colors w-fit`}>
                Profili Düzenle
              </Link>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-xl ${t.card} mb-6`}>
          <button onClick={() => setActiveTab('reviews')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'reviews' ? 'bg-[#F5A623] text-black' : 'text-gray-400 hover:text-white'}`}>
            <Star size={16} />Değerlendirmeler ({reviews.length})
          </button>
          <button onClick={() => setActiveTab('loads')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'loads' ? 'bg-[#F5A623] text-black' : 'text-gray-400 hover:text-white'}`}>
            <Package size={16} />İlanlar ({loads.length})
          </button>
        </div>

        {/* Değerlendirmeler */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className={`text-center py-12 ${t.muted}`}>
                <Star size={40} className="mx-auto mb-3 text-gray-700" />
                <p>Henüz değerlendirme yok.</p>
              </div>
            ) : reviews.map((review) => (
              <div key={review.id} className={`p-5 rounded-2xl ${t.card}`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F5A623]/10 flex items-center justify-center text-sm font-bold text-[#F5A623] shrink-0">
                    {review.reviewer.avatar_url
                      ? <img src={review.reviewer.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                      : review.reviewer.full_name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Link href={`/kullanici/${review.reviewer.id}`} className={`text-sm font-medium ${t.heading} hover:text-[#F5A623] transition-colors`}>
                        {review.reviewer.full_name}
                      </Link>
                      <span className={`text-xs ${t.muted}`}>{new Date(review.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">{renderStars(review.rating)}</div>
                    {review.comment && <p className={`text-sm ${t.sub}`}>{review.comment}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* İlanlar */}
        {activeTab === 'loads' && (
          <div className="space-y-3">
            {loads.length === 0 ? (
              <div className={`text-center py-12 ${t.muted}`}>
                <Package size={40} className="mx-auto mb-3 text-gray-700" />
                <p>Henüz ilan yok.</p>
              </div>
            ) : loads.map((load) => (
              <Link key={load.id} href={`/pazar/${load.id}`}
                className={`flex items-center justify-between p-4 rounded-2xl ${t.card} hover:border-[#F5A623]/20 transition-all group`}>
                <div className="flex-1 min-w-0">
                  <h3 className={`${t.heading} text-sm font-medium truncate group-hover:text-[#F5A623] transition-colors mb-1`}>
                    {load.title_translations?.[locale] || load.title}
                  </h3>
                  <div className={`flex items-center gap-2 text-xs ${t.muted}`}>
                    <MapPin size={12} className="text-[#F5A623]" />{load.origin_city}
                    <ArrowRight size={12} />
                    <MapPin size={12} className="text-green-400" />{load.destination_city}
                  </div>
                </div>
                <span className={`ml-3 px-2 py-0.5 text-xs rounded-full border shrink-0 ${
                  load.status === 'active' ? 'text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/20' :
                  load.status === 'completed' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                  'text-gray-400 bg-gray-400/10 border-gray-400/20'
                }`}>
                  {load.status === 'active' ? 'Aktif' : load.status === 'completed' ? 'Tamamlandı' : load.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

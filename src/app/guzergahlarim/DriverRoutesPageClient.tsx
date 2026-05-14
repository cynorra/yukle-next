'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import CitySelect from '@/components/CitySelect';
import type { DriverRoute } from '@/types/database';
import { useT } from '@/hooks/useT';
import { Route, MapPin, ArrowRight, Plus, Trash2, ToggleLeft, ToggleRight, Calendar, FileText, Loader2, X } from 'lucide-react';

export function DriverRoutesPageClient() {
  const t = useT();
  const { user } = useAuth();
  const [routes, setRoutes] = useState<DriverRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [originCityId, setOriginCityId] = useState<number | null>(null);
  const [originDistrictId, setOriginDistrictId] = useState<number | null>(null);
  const [destCityId, setDestCityId] = useState<number | null>(null);
  const [destDistrictId, setDestDistrictId] = useState<number | null>(null);
  const [departureDate, setDepartureDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (user) fetchRoutes(); }, [user]);

  async function fetchRoutes() {
    if (!user) return;
    const { data } = await supabase
      .from('driver_routes')
      .select('*, origin_city:cities!driver_routes_origin_city_id_fkey(*), destination_city:cities!driver_routes_destination_city_id_fkey(*)')
      .eq('driver_id', user.id)
      .order('created_at', { ascending: false });
    setRoutes((data as unknown as DriverRoute[]) || []);
    setLoading(false);
  }

  async function handleAddRoute(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !originCityId || !destCityId) { setError('Lütfen kalkış ve varış şehirlerini seçin.'); return; }
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from('driver_routes').insert({
      driver_id: user.id,
      origin_city_id: originCityId,
      destination_city_id: destCityId,
      departure_date: departureDate || null,
      notes: notes.trim() || null,
      is_active: true,
    });
    if (insertError) { setError(insertError.message); setSubmitting(false); return; }
    setOriginCityId(null); setOriginDistrictId(null); setDestCityId(null);
    setDestDistrictId(null); setDepartureDate(''); setNotes('');
    setShowForm(false); setSubmitting(false);
    await fetchRoutes();
  }

  async function toggleRoute(route: DriverRoute) {
    const { error } = await supabase.from('driver_routes').update({ is_active: !route.is_active }).eq('id', route.id);
    if (!error) setRoutes((prev) => prev.map((r) => r.id === route.id ? { ...r, is_active: !r.is_active } : r));
  }

  async function deleteRoute(routeId: string) {
    const { error } = await supabase.from('driver_routes').delete().eq('id', routeId);
    if (!error) setRoutes((prev) => prev.filter((r) => r.id !== routeId));
  }

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
              <Route size={28} className={t.accent} />Güzergahlarım
            </h1>
            <p className={`text-sm ${t.muted} mt-1`}>Güzergahlarınızı yönetin, size uygun yükleri bulun.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              showForm ? t.btnSecondary : t.btnPrimary
            }`}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'İptal' : 'Yeni Güzergah'}
          </button>
        </div>

        {/* Add route form */}
        {showForm && (
          <form onSubmit={handleAddRoute} className={`p-6 rounded-2xl ${t.card} mb-6 space-y-4`}>
            <h3 className={`text-sm font-medium ${t.body} flex items-center gap-2`}>
              <Plus size={14} className={t.accent} />Yeni Güzergah Ekle
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs ${t.muted} mb-1.5`}>Kalkış Şehri</label>
                <CitySelect value={originCityId} onChange={(c, d) => { setOriginCityId(c); setOriginDistrictId(d); }}
                  placeholder="Kalkış şehri" districtValue={originDistrictId} />
              </div>
              <div>
                <label className={`block text-xs ${t.muted} mb-1.5`}>Varış Şehri</label>
                <CitySelect value={destCityId} onChange={(c, d) => { setDestCityId(c); setDestDistrictId(d); }}
                  placeholder="Varış şehri" districtValue={destDistrictId} />
              </div>
            </div>
            <div>
              <label className={`block text-xs ${t.muted} mb-1.5`}>Kalkış Tarihi</label>
              <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${t.isDark ? '[color-scheme:dark]' : '[color-scheme:light]'} ${t.input}`} />
            </div>
            <div>
              <label className={`block text-xs ${t.muted} mb-1.5`}>Notlar</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Güzergah hakkında ek bilgiler..." rows={3}
                className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors resize-none ${t.input}`} />
            </div>
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={submitting}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${t.btnPrimary}`}>
              {submitting ? <><Loader2 size={18} className="animate-spin" />Ekleniyor...</> : <><Route size={18} />Güzergah Ekle</>}
            </button>
          </form>
        )}

        {/* Routes list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`w-8 h-8 border-2 ${t.spinner} rounded-full animate-spin`} />
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-16">
            <Route size={48} className={`${t.mutedDark} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${t.heading} mb-2`}>Henüz güzergah yok</h3>
            <p className={`${t.sub} text-sm mb-6`}>Güzergah ekleyerek size uygun yükleri otomatik eşleştirin.</p>
            <button onClick={() => setShowForm(true)}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${t.btnPrimary}`}>
              <Plus size={16} />İlk Güzergahını Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {routes.map((route) => (
              <div key={route.id} className={`p-5 rounded-2xl ${t.card}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                        route.is_active ? t.badgeCompleted : `${t.muted} bg-gray-500/10 border-gray-500/20`
                      }`}>
                        {route.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${t.body} flex-wrap`}>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className={t.accent} />{route.origin_city?.name}
                      </span>
                      <ArrowRight size={14} className={t.mutedDark} />
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-green-400" />{route.destination_city?.name}
                      </span>
                    </div>
                    {route.departure_date && (
                      <div className={`mt-2 text-xs ${t.muted} flex items-center gap-1`}>
                        <Calendar size={12} />
                        {new Date(route.departure_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    {route.notes && (
                      <div className={`mt-1 text-xs ${t.muted} flex items-center gap-1`}>
                        <FileText size={12} />{route.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleRoute(route)}
                      className={`p-2 rounded-lg transition-colors hover:bg-white/5`}
                      title={route.is_active ? 'Pasif Yap' : 'Aktif Yap'}>
                      {route.is_active
                        ? <ToggleRight size={24} className="text-green-400" />
                        : <ToggleLeft size={24} className={t.mutedDark} />}
                    </button>
                    <button onClick={() => deleteRoute(route.id)}
                      className={`p-2 rounded-lg transition-colors ${t.btnDanger}`} title="Sil">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LocationSearch from '@/components/LocationSearch';
import type { DriverRoute } from '@/types/database';
import { useT } from '@/hooks/useT';
import { useTranslation } from '@/hooks/useTranslation';
import { Route, MapPin, ArrowRight, Plus, Trash2, ToggleLeft, ToggleRight, Calendar, FileText, Loader2, X } from 'lucide-react';

export function DriverRoutesPageClient() {
  const tStyle = useT();
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [routes, setRoutes] = useState<DriverRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [originCity, setOriginCity] = useState('');
  const [originState, setOriginState] = useState<string | null>(null);
  const [originCountry, setOriginCountry] = useState('');

  const [destCity, setDestCity] = useState('');
  const [destState, setDestState] = useState<string | null>(null);
  const [destCountry, setDestCountry] = useState('');

  const [departureDate, setDepartureDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (user) fetchRoutes(); }, [user]);

  async function fetchRoutes() {
    if (!user) return;
    const { data } = await supabase
      .from('driver_routes')
      .select('*')
      .eq('driver_id', user.id)
      .order('created_at', { ascending: false });
    setRoutes((data as unknown as DriverRoute[]) || []);
    setLoading(false);
  }

  async function handleAddRoute(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !originCity || !destCity) { setError('Please select origin and destination locations.'); return; }
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from('driver_routes').insert({
      driver_id: user.id,
      origin_city: originCity,
      origin_state: originState,
      origin_country: originCountry,
      destination_city: destCity,
      destination_state: destState,
      destination_country: destCountry,
      departure_date: departureDate || null,
      notes: notes.trim() || null,
      is_active: true,
    });
    if (insertError) { setError(insertError.message); setSubmitting(false); return; }
    setOriginCity(''); setOriginState(null); setOriginCountry('');
    setDestCity(''); setDestState(null); setDestCountry('');
    setDepartureDate(''); setNotes('');
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
    <div className={tStyle.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${tStyle.heading} flex items-center gap-3`}>
              <Route size={28} className={tStyle.accent} />{t.nav.routes}
            </h1>
            <p className={`text-sm ${tStyle.muted} mt-1`}>Manage your transport routes and automatically find matching loads.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              showForm ? tStyle.btnSecondary : tStyle.btnPrimary
            }`}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Route'}
          </button>
        </div>

        {/* Add route form */}
        {showForm && (
          <form onSubmit={handleAddRoute} className={`p-6 rounded-2xl ${tStyle.card} mb-6 space-y-4`}>
            <h3 className={`text-sm font-medium ${tStyle.body} flex items-center gap-2`}>
              <Plus size={14} className={tStyle.accent} />Add New Route
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs ${tStyle.muted} mb-1.5`}>Origin Location</label>
                <LocationSearch
                  onSelect={(loc) => {
                    setOriginCity(loc.city);
                    setOriginState(loc.state);
                    setOriginCountry(loc.country);
                  }}
                  placeholder="Departure city/country"
                />
              </div>
              <div>
                <label className={`block text-xs ${tStyle.muted} mb-1.5`}>Destination Location</label>
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
            <div>
              <label className={`block text-xs ${tStyle.muted} mb-1.5`}>Departure Date</label>
              <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${tStyle.isDark ? '[color-scheme:dark]' : '[color-scheme:light]'} ${tStyle.input}`} />
            </div>
            <div>
              <label className={`block text-xs ${tStyle.muted} mb-1.5`}>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about your route..." rows={3}
                className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors resize-none ${tStyle.input}`} />
            </div>
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={submitting}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${tStyle.btnPrimary}`}>
              {submitting ? <><Loader2 size={18} className="animate-spin" />Adding...</> : <><Route size={18} />Add Route</>}
            </button>
          </form>
        )}

        {/* Routes list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`w-8 h-8 border-2 ${tStyle.spinner} rounded-full animate-spin`} />
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-16">
            <Route size={48} className={`${tStyle.mutedDark} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${tStyle.heading} mb-2`}>No routes declared yet</h3>
            <p className={`${tStyle.sub} text-sm mb-6`}>Declare your truck routes to automatically find matching cargo postings.</p>
            <button onClick={() => setShowForm(true)}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tStyle.btnPrimary}`}>
              <Plus size={16} />Declare First Route
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {routes.map((route) => (
              <div key={route.id} className={`p-5 rounded-2xl ${tStyle.card}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                        route.is_active ? tStyle.badgeCompleted : `${tStyle.muted} bg-gray-500/10 border-gray-500/20`
                      }`}>
                        {route.is_active ? t.marketplace.active : 'Inactive'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${tStyle.body} flex-wrap`}>
                      <span className="flex items-center gap-1.5 font-bold">
                        <MapPin size={14} className={tStyle.accent} />{route.origin_city}, {route.origin_country}
                      </span>
                      <ArrowRight size={14} className={tStyle.mutedDark} />
                      <span className="flex items-center gap-1.5 font-bold">
                        <MapPin size={14} className="text-green-400" />{route.destination_city}, {route.destination_country}
                      </span>
                    </div>
                    {route.departure_date && (
                      <div className={`mt-2 text-xs ${tStyle.muted} flex items-center gap-1`}>
                        <Calendar size={12} />
                        {new Date(route.departure_date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    {route.notes && (
                      <div className={`mt-1 text-xs ${tStyle.muted} flex items-center gap-1`}>
                        <FileText size={12} />{route.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleRoute(route)}
                      className={`p-2 rounded-lg transition-colors hover:bg-white/5`}
                      title={route.is_active ? 'Set Inactive' : 'Set Active'}>
                      {route.is_active
                        ? <ToggleRight size={24} className="text-green-400" />
                        : <ToggleLeft size={24} className={tStyle.mutedDark} />}
                    </button>
                    <button onClick={() => deleteRoute(route.id)}
                      className={`p-2 rounded-lg transition-colors ${tStyle.btnDanger}`} title="Delete">
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

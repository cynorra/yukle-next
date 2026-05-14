'use client';

import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useT } from '@/hooks/useT';
import type { PointTransaction } from '@/types/database';
import { POINT_REWARDS } from '@/types/database';
import PointsBadge from '@/components/PointsBadge';
import { User, Mail, Phone, Building2, Star, Shield, PenLine, X, Loader2, Save, Zap, TrendingUp, Gift, Truck, Package, RefreshCw, Camera, Trash2, AlertTriangle, Settings } from 'lucide-react';

const REASON_LABELS: Record<string, string> = {
  register: '🎉 Kayıt bonusu',
  create_load: '📦 Yük ilanı oluşturma',
  load_completed: '✅ Taşıma tamamlandı',
  profile_complete: '👤 Profil tamamlama',
  daily_login: '☀️ Günlük giriş',
  first_message: '💬 İlk mesaj bonusu',
};

export function ProfilePageClient() {
  const t = useT();
  const { user, profile, refreshProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'points' | 'settings'>('info');
  const router = useRouter();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [changingRole, setChangingRole] = useState(false);
  const [roleChangeError, setRoleChangeError] = useState<string | null>(null);
  const [roleChangeSuccess, setRoleChangeSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCompanyName(profile.company_name || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user && activeTab === 'points') fetchTransactions();
  }, [user, activeTab]);


  async function handleRoleChange(newRole: 'shipper' | 'driver') {
    if (!user || newRole === profile?.role) return;
    setChangingRole(true);
    setRoleChangeError(null);
    setRoleChangeSuccess(false);
    const { error } = await supabase.rpc('change_user_role', {
      p_user_id: user.id,
      p_new_role: newRole,
    });
    if (error) {
      setRoleChangeError(error.message);
    } else {
      await refreshProfile();
      setRoleChangeSuccess(true);
      setTimeout(() => setRoleChangeSuccess(false), 3000);
    }
    setChangingRole(false);
  }

  async function fetchTransactions() {
    if (!user) return;
    const { data } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);
    setTransactions((data as PointTransaction[]) || []);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const isProfileComplete =
      fullName.trim() && phone.trim() && companyName.trim();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
        company_name: companyName.trim() || null,
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    // Profil tamamlama puanı ver
    if (isProfileComplete) {
      await supabase.rpc('add_points', {
        p_user_id: user.id,
        p_points: POINT_REWARDS.profile_complete,
        p_reason: 'profile_complete',
        p_description: 'Profil tamamlama bonusu',
        p_load_id: null,
      });
    }

    await refreshProfile();
    setSaving(false);
    setSuccess(true);
    setEditing(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  function cancelEdit() {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCompanyName(profile.company_name || '');
    }
    setEditing(false);
    setError(null);
  }

  return (
    <div className={t.pageFull}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Premium profil başlığı */}
        <div className={`p-6 rounded-2xl mb-6 border ${t.divider} bg-surface-light dark:bg-surface-dark`}>
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl overflow-hidden bg-accent/10 border border-accent/20 flex items-center justify-center">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  : <User size={32} className="text-accent" />
                }
              </div>
              {profile?.is_verified && (
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-500 border-2 border-surface-light dark:border-surface-dark flex items-center justify-center">
                  <Shield size={11} className="text-white" />
                </div>
              )}
            </div>

            {/* Bilgiler */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className={`text-xl font-black ${t.heading} mb-1`}>
                    {profile?.full_name || 'Kullanıcı'}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${t.sub}`}>
                      {profile?.role === 'shipper' ? '📦 Yük Sahibi' : '🚛 Nakliyeci'}
                    </span>
                    {profile?.company_name && (
                      <span className={`text-xs px-2.5 py-1 rounded-full bg-surface-light dark:bg-background-dark border border-border-light dark:border-border-dark ${t.muted} font-medium`}>
                        {profile.company_name}
                      </span>
                    )}
                  </div>
                  {profile?.rating != null && profile.rating > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12} className={i <= Math.round(profile.rating) ? 'text-accent fill-accent' : t.muted} />
                      ))}
                      <span className={`text-xs font-bold ${t.heading} ml-1`}>{profile.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {!editing && activeTab === 'info' && (
                  <button
                    onClick={() => setEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${t.btnSecondary}`}
                  >
                    <PenLine size={14} />Düzenle
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Puan şeridi */}
          <div className="mt-5 pt-5 border-t border-border-light dark:border-border-dark flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Zap size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-accent/60 mb-0.5">Toplam Puan</p>
                <PointsBadge points={profile?.points ?? 0} size="lg" showLabel />
              </div>
            </div>
            <button
              onClick={() => setActiveTab('points')}
              className={`text-xs font-bold ${t.accent} hover:underline`}
            >
              Geçmişi gör →
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-xl ${t.tabContainer} mb-6`}>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'info' ? t.tabActive : t.tabInactive
              }`}
          >
            <User size={16} />
            Bilgilerim
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'points' ? t.tabActive : t.tabInactive
              }`}
          >
            <Zap size={16} />
            Puan Geçmişi
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? t.tabActive : t.tabInactive
              }`}
          >
            <Settings size={16} />
            Ayarlar
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Profil başarıyla güncellendi.
          </div>
        )}

        {/* INFO TAB */}
        {activeTab === 'info' && (
          editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className={`p-6 rounded-2xl ${t.card} space-y-4`}>
                <div>
                  <label className={`block text-xs ${t.muted} mb-1.5`}>Ad Soyad</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ad Soyad" required
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${t.input}`} />
                </div>
                <div>
                  <label className={`block text-xs ${t.muted} mb-1.5`}>Telefon</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX"
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${t.input}`} />
                </div>
                <div>
                  <label className={`block text-xs ${t.muted} mb-1.5`}>
                    Firma Adı
                    <span className="ml-1 text-[#F5A623]/70">(+30 puan)</span>
                  </label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Firma adı girerek puan kazan"
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${t.input}`} />
                </div>
              </div>
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-[#F5A623] text-black font-bold text-sm hover:bg-[#F5A623]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={18} className="animate-spin" />Kaydediliyor...</> : <><Save size={18} />Kaydet</>}
                </button>
                <button type="button" onClick={cancelEdit}
                  className={`px-6 py-3 rounded-xl bg-white/5 ${t.sub} font-medium text-sm border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2`}>
                  <X size={18} />İptal
                </button>
              </div>
            </form>
          ) : (
            <div className={`p-6 rounded-2xl ${t.card}`}>
              <div className="space-y-5">
                {[
                  { icon: User, label: 'Ad Soyad', value: profile?.full_name || '-' },
                  { icon: Mail, label: 'E-posta', value: user?.email || '-' },
                  { icon: Phone, label: 'Telefon', value: profile?.phone || '-' },
                  { icon: Shield, label: 'Rol', value: profile?.role === 'shipper' ? 'Yük Sahibi' : 'Sürücü' },
                  { icon: Building2, label: 'Firma Adı', value: profile?.company_name || '-' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#F5A623]" />
                    </div>
                    <div>
                      <div className={`text-xs ${t.muted}`}>{label}</div>
                      <div className={`${t.heading} font-medium`}>{value}</div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center shrink-0">
                    <Star size={18} className="text-[#F5A623]" />
                  </div>
                  <div>
                    <div className={`text-xs ${t.muted}`}>Değerlendirme</div>
                    <div className={`${t.heading} font-medium flex items-center gap-1`}>
                      {profile?.rating != null ? (
                        <><Star size={14} className="text-[#F5A623] fill-[#F5A623]" />{profile.rating.toFixed(1)}</>
                      ) : 'Henüz değerlendirme yok'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}


        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className={`p-6 rounded-2xl ${t.card}`}>
              <h3 className={`text-sm font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                <Camera size={16} className={t.accent} />Profil Fotoğrafı
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#F5A623]/10 flex items-center justify-center text-2xl font-bold text-[#F5A623] shrink-0 overflow-hidden">
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" className="w-16 h-16 object-cover" />
                    : profile?.full_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all ${t.btnSecondary} ${avatarUploading ? 'opacity-50' : ''}`}>
                    {avatarUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                    {avatarUploading ? 'Yükleniyor...' : 'Fotoğraf Değiştir'}
                    <input type="file" accept="image/*" className="hidden" disabled={avatarUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !user) return;
                        setAvatarUploading(true);
                        const ext = file.name.split('.').pop();
                        const path = `${user.id}/avatar.${ext}`;
                        const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
                        if (!uploadErr) {
                          const { data } = supabase.storage.from('avatars').getPublicUrl(path);
                          await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
                          await refreshProfile();
                        }
                        setAvatarUploading(false);
                      }} />
                  </label>
                  <p className={`text-xs ${t.muted} mt-1.5`}>JPG, PNG veya WebP. Maks 5MB.</p>
                </div>
              </div>
            </div>


            {/* Hesap Türü Değiştir */}
            <div className={`p-6 rounded-2xl ${t.card}`}>
              <h3 className={`text-sm font-bold ${t.heading} mb-1 flex items-center gap-2`}>
                <RefreshCw size={16} className={t.accent} />Hesap Türü
              </h3>
              <p className={`text-xs ${t.muted} mb-4`}>Mevcut hesap türünüz: <span className={`font-bold ${t.accent}`}>{profile?.role === 'driver' ? 'Nakliyeci' : 'Yük Sahibi'}</span></p>

              {roleChangeError && <p className="text-red-400 text-xs mb-3">{roleChangeError}</p>}
              {roleChangeSuccess && <p className="text-green-400 text-xs mb-3">Hesap türü başarıyla değiştirildi.</p>}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'shipper' as const, icon: Package, label: 'Yük Sahibi', sub: 'İlan aç, teklif al' },
                  { id: 'driver' as const, icon: Truck, label: 'Nakliyeci', sub: 'Teklif ver, taşı' },
                ].map((r) => (
                  <button key={r.id} onClick={() => handleRoleChange(r.id)} disabled={changingRole || r.id === profile?.role}
                    className={`p-4 rounded-xl border text-left transition-all disabled:cursor-default ${r.id === profile?.role
                        ? `${t.accentBg} ${t.accentBorder} border-2`
                        : `${t.card} ${t.cardHover} opacity-70 hover:opacity-100`
                      }`}>
                    <r.icon size={20} className={`mb-2 ${r.id === profile?.role ? t.accent : t.muted}`} />
                    <p className={`text-sm font-bold ${r.id === profile?.role ? t.accent : t.heading}`}>{r.label}</p>
                    <p className={`text-xs ${t.muted}`}>{r.sub}</p>
                    {r.id === profile?.role && <p className="text-xs text-green-400 mt-1">✓ Mevcut</p>}
                  </button>
                ))}
              </div>
              <p className={`text-xs ${t.muted} mt-3`}>Not: Aktif ilanlarınız veya kabul edilmiş taşımalarınız varken tür değiştirilemez.</p>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle size={16} />Tehlikeli Bölge
              </h3>
              <p className={`text-sm ${t.sub} mb-4`}>Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.</p>
              {!deletingAccount ? (
                <button onClick={() => setDeletingAccount(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />Hesabımı Sil
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-400 font-medium">Hesabınızı silmek istediğinizden emin misiniz?</p>
                  <div className="flex gap-3">
                    <button onClick={async () => {
                      const { error } = await supabase.rpc('delete_user_account', { p_user_id: user!.id });
                      if (!error) { router.push('/'); }
                    }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold bg-red-500 ${t.heading} hover:bg-red-600 transition-colors`}>
                      Evet, Sil
                    </button>
                    <button onClick={() => setDeletingAccount(false)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${t.btnSecondary}`}>
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* POINTS TAB */}
        {activeTab === 'points' && (
          <div className="space-y-4">
            {/* Kazanma rehberi */}
            <div className={`p-5 rounded-2xl ${t.card}`}>
              <h3 className={`text-sm font-bold ${t.heading} mb-4 flex items-center gap-2`}>
                <Gift size={16} className="text-[#F5A623]" />
                Puan Nasıl Kazanılır?
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Platforma kayıt', pts: 50 },
                  { label: 'İlk yük ilanı', pts: 100 },
                  { label: 'Yük ilanı oluşturma', pts: 20 },
                  { label: 'Taşıma tamamlama', pts: 200 },
                  { label: 'Profil tamamlama', pts: 30 },
                  { label: 'İlk mesaj gönderme', pts: 20 },
                  { label: 'Günlük giriş', pts: 10 },
                ].map(({ label, pts }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className={t.sub}>{label}</span>
                    <span className="text-[#F5A623] font-bold">+{pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Geçmiş */}
            <div>
              <h3 className={`text-sm font-bold ${t.heading} mb-3 flex items-center gap-2`}>
                <TrendingUp size={16} className="text-[#F5A623]" />
                Son İşlemler
              </h3>
              {transactions.length === 0 ? (
                <div className={`text-center py-10 ${t.muted} text-sm`}>Henüz puan işlemi yok.</div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl ${t.card}">
                      <div>
                        <div className={`text-sm ${t.heading}`}>{REASON_LABELS[tx.reason] || tx.reason}</div>
                        <div className={`text-xs ${t.muted} mt-0.5`}>
                          {new Date(tx.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${tx.points > 0 ? 'text-[#F5A623]' : 'text-red-400'}`}>
                        {tx.points > 0 ? '+' : ''}{tx.points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
# Loadly (yukle-next) — Proje Hafızası & 2027+ Ürün/Mühendislik Planı

> Son güncelleme: 2026-11-27 · Android Paket: `app.yukbul.android` (mevcut sürüm: `v1.13`, `versionCode=16`, `targetSdk=36`)

---

## 1. Mevcut Durum & Kod Tabanı Özeti
- **Web + Scraper:** Next.js + Supabase (`loads`, `moving_requests`, `public_profiles`) + GitHub Actions `Scraper Cron Job (5min)`.
- **Android Uygulaması (`android-app/`):** Native Java + Material Components + ViewBinding + Supabase PostgREST (`SupabaseClient.java`) + AdMob Adaptive Banner + UMP Consent + FCM Push + Firebase Crashlytics + Google Play In-App Review (`ReviewPromptHelper.java`).
- **Mevcut Ekranlar:** `SplashActivity`, `MarketplaceActivity` (Nearby/Global yük listesi + temel filtre), `LoadDetailActivity`, `MovingActivity`.

---

## 2. ABD Pazarında Rakiplere Göre Tespit Edilen Eksiklikler (Audit)

### A. Ürün & ABD Kamyoncu Metrikleri (Kritik Fark)
1. **Rate per Mile (`$/mi`) & Mesafe Eksik:** `Load.java` içinde mesafe (`distance_miles`), para birimi (`currency`), `rate_per_mile`, `deadhead_miles`, `pickup_date` alanları yok. ABD kamyoncusu toplam fiyata değil `$/mi` ve boş kilometreye (deadhead) göre karar verir.
2. **Birim Sistemi (Imperial vs Metric):** Ağırlık sabit `weightTon` (ton) gösteriliyor; ABD/UK kullanıcıları için otomatik **`lbs` & `miles`**, TR/EU için **`ton` & `km`** dönüşümü şart.
3. **ABD Ekipman Türleri & Niş Konumlandırma:** `TruckTypes` TR odaklı (`dorser`, `frigorifik`). ABD'nin yüksek fırsatlı nişleri (**Box Truck 26'**, **Sprinter / Cargo Van**, **Hotshot**, **Dry Van 53'**, **Reefer**, **Flatbed**, **Step Deck**) birinci sınıf filtre ve rozet olmalı.
4. **Broker Güvenilirliği (MC# / DOT#):** Double-brokering korkusu ABD'de #1 engel. İlanlarda **MC/DOT doğrulama** (FMCSA SAFER API / hızlı sorgulama) ve "Verified Shipper / Fresh < 1h" güven rozetleri eksik.
5. **Ölü İlan (Stale Load) Sorunu:** Eski/kapanmış ilanlar kullanıcıyı 30 saniyede kaybettirir. Scraper + API tarafında otomatik süre sonu (`expires_at` / 24-48 saat) ve kart üzerinde canlı tazelik rozeti (`Just now`, `12m ago`) gerekli.

### B. Retention & Sürücü Verimliliği
6. **Güzergâh Alarmı (Saved Lane Push Alerts):** Genel push yerine kullanıcının kaydettiği hatlar için anında bildirim (*"Dallas → Atlanta · Box Truck · >$2.00/mi"*).
7. **Favoriler & "Arandı" Takibi (Bookmarks + Call Log):** Sürücü beğendiği yükleri kaydedemiyor, aradığı ilanları işaretleyip gizleyemiyor.
8. **Yük Kârlılık & Yakıt Hesaplayıcı (RPM / Profit Calculator):** `LoadDetailActivity` içinde tek tıkla: `Net Kâr = Ücret - ((Mesafe + Deadhead) / MPG * Yakıt Fiyatı)` ve gerçek `$/mi` hesabı.
9. **Sıralama & Sonsuz Kaydırma (Sort + Pagination):** `SupabaseClient` sabit `PAGE_SIZE = 50` çekiyor; sayfalama (`offset`) ve sıralama (`Newest`, `Highest Pay`, `Best $/mi`, `Shortest Deadhead`) yok.
10. **Native Yük İlanı Ekleme (Post a Load):** Yük verenlerin uygulama içinden hızlıca ilan bırakabilmesi (çift taraflı pazar yeri büyümesi).

### C. 2027+ UX, Performans & Teknik Standartlar
11. **Gece Sürüş Modu (True Dark / Night Cab Mode):** Kamyoncuların büyük bölümü gece kabinde kullanır; yüksek kontrastlı gerçek Dark Theme + tek elle kullanım (bottom-sheet filtreler).
12. **Rota Önizleme & Harita Görünümü:** Detay ekranında Origin → Destination mesafe, tahmini sürüş süresi (HOS uyumlu) ve tek tıkla Google Maps / Truck Navigation açma.
13. **Offline-First Önbellek:** Otoyolda şebeke gittiğinde son yüklenen ilanları, favorileri ve hesaplayıcıyı gösterecek yerel cache (SQLite/SharedPreferences JSON cache).
14. **R8 Minification & ProGuard (`isMinifyEnabled = true`):** Release AAB boyutunu küçültüp performansı ve güvenliği artırmak.
15. **Monetizasyon Çeşitlendirmesi:** Sadece tek banner yerine: Native Inline Ads (her 8 ilanda 1, kart tasarımına uyumlu) + Opsiyonel **Loadly Pro** (reklamsız + sınırsız Güzergâh Alarmı + anlık RPM filtresi).

---

## 3. 2027+ Yol Haritası (4 Fazlı Uygulama Planı)

### Faz 1–3 Tamamlanan 2027+ Özellikler (`v2.0`, `versionCode=17` — Derlendi & Push'landı)
- [x] **Otomatik Birim Sistemi (`FreightMetrics.java`):** ABD (`US`/`UK`) kullanıcılarına `lbs` & `miles` & `$`, TR/EU kullanıcılarına `ton` & `km` & `₺/€`.
- [x] **Kartlarda `FRESH` (<90 dk) & `CALLED ✓` Rozetleri + Tek Dokunuşla Favori (`★`)** (`item_load.xml`, `LoadAdapter.java`).
- [x] **Sıralama (Sort) & Sonsuz Kaydırma (Infinite Scroll Pagination)** (`SupabaseClient.java`, `MarketplaceActivity.java`).
- [x] **Kaydedilenler Sekmesi (`★`) + Offline Cache (`LoadPreferences.java`):** Otoyolda sinyal koptuğunda yerel önbellek ve favoriler çalışmaya devam eder.
- [x] **Yük Kârlılık & Yakıt Hesaplayıcı (RPM / Profit Calculator):** `LoadDetailActivity` içinde `Pay`, `Miles/km`, `Deadhead`, `MPG`, `Fuel` ile canlı Brüt/Net `$/mi` ve Net Kâr hesabı.
- [x] **ABD Niş Ekipman Türleri (`arrays.xml`):** Dry Van 53ft, Box Truck 26ft, Sprinter / Cargo Van, Hotshot, Step Deck, Flatbed, Reefer.
- [x] **Güzergâh Alarmları (Saved Lane Alerts):** Kişiselleştirilmiş hat alarmları (Origin → Destination + min ücret) ve yeni eşleşen yük bildirimi.
- [x] **FMCSA MC/DOT Broker Doğrulama:** `LoadDetailActivity` içinde tek dokunuşla resmi FMCSA SAFER Company Snapshot sorgulama.
- [x] **Native "Post a Load" (Yük Ekle) + "Taken" (Ölü İlan Gizle) + Rota Haritası (Google Maps Directions).**
- [x] **R8 Minification & Resource Shrinking (`isMinifyEnabled = true`, `isShrinkResources = true`) + ProGuard kuralları.**

### Faz 4 — Sonraki Adımlar (`v2.1+`)
- [ ] **Liste İçi Native Ads:** Her 8 yük kartında 1 adet tasarıma tam uyumlu native reklam.
- [ ] **Sunucu Taraflı FCM Güzergâh Alarmı:** 5 dk'lık scraper'ın Supabase `lane_alerts` tablosuyla arka planda push göndermesi.
- [ ] **ABD Niş ASO:** *"Free Load Board: Box Truck, Sprinter Van & Hotshot"* odaklı Google Play mağaza girişi.

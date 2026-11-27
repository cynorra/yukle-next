package com.cynorra.loadly;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Local persistent store for Silent Vector interactive flows:
 * - Incoming carrier offers (Gelen Teklifler)
 * - Outgoing user bids & counter-offers (Verdiğim Teklifler)
 * - Completed past moves (Geçmiş Taşınmalar)
 * - Protected communication threads (Mesajlar)
 * - User profile metadata
 */
public final class LoadlyStore {

    private static final String PREF = "loadly_sv_store_v1";
    private static final String KEY_SENT_OFFERS = "sent_offers_json";
    private static final String KEY_ACCEPTED_INCOMING_ID = "accepted_incoming_id";
    private static final String KEY_MESSAGES = "messages_json";
    private static final String KEY_USER_NAME = "user_name";
    private static final String KEY_USER_EMAIL = "user_email";
    private static final String KEY_USER_PHONE = "user_phone";
    private static final String KEY_ACCOUNT_CLEARED = "account_cleared";

    public static final class IncomingOffer {
        public String id;
        public String badgeText;
        public boolean badgeHighlight; // emerald mint vs blue-tinted pill
        public String timeAgo;
        public String carrierName;
        public String carrierInitials;
        public String licenseBadge;
        public String rating;
        public int reviewCount;
        public String price;
        public String priceSub;
        public String[] features;
        public String insuranceLine;
        public boolean primaryCta;
        public String primaryCtaText;
        public String secondaryCtaText;

        public IncomingOffer(String id, String badgeText, boolean badgeHighlight, String timeAgo,
                             String carrierName, String carrierInitials, String licenseBadge,
                             String rating, int reviewCount, String price, String priceSub,
                             String[] features, String insuranceLine, boolean primaryCta,
                             String primaryCtaText, String secondaryCtaText) {
            this.id = id;
            this.badgeText = badgeText;
            this.badgeHighlight = badgeHighlight;
            this.timeAgo = timeAgo;
            this.carrierName = carrierName;
            this.carrierInitials = carrierInitials;
            this.licenseBadge = licenseBadge;
            this.rating = rating;
            this.reviewCount = reviewCount;
            this.price = price;
            this.priceSub = priceSub;
            this.features = features;
            this.insuranceLine = insuranceLine;
            this.primaryCta = primaryCta;
            this.primaryCtaText = primaryCtaText;
            this.secondaryCtaText = secondaryCtaText;
        }
    }

    public static final class SentOffer {
        public String id;
        public String status; // "counter" | "review" | "accepted"
        public String statusLabel;
        public String metaRight;
        public String route;
        public String distance;
        public String dateAndType;
        public String myPrice;
        public String counterPrice;
        public String counterQuote;
        public String detailsLine;
        public String competingNote;
        public String listingCode;

        public JSONObject toJson() {
            JSONObject o = new JSONObject();
            try {
                o.put("id", id);
                o.put("status", status);
                o.put("statusLabel", statusLabel);
                o.put("metaRight", metaRight);
                o.put("route", route);
                o.put("distance", distance);
                o.put("dateAndType", dateAndType);
                o.put("myPrice", myPrice);
                o.put("counterPrice", counterPrice);
                o.put("counterQuote", counterQuote);
                o.put("detailsLine", detailsLine);
                o.put("competingNote", competingNote);
                o.put("listingCode", listingCode);
            } catch (Exception ignored) {}
            return o;
        }

        public static SentOffer fromJson(JSONObject o) {
            SentOffer s = new SentOffer();
            s.id = o.optString("id");
            s.status = o.optString("status", "review");
            s.statusLabel = o.optString("statusLabel", "Değerlendiriliyor");
            s.metaRight = o.optString("metaRight", "Görüldü");
            s.route = o.optString("route");
            s.distance = o.optString("distance");
            s.dateAndType = o.optString("dateAndType");
            s.myPrice = o.optString("myPrice");
            s.counterPrice = o.optString("counterPrice");
            s.counterQuote = o.optString("counterQuote");
            s.detailsLine = o.optString("detailsLine");
            s.competingNote = o.optString("competingNote");
            s.listingCode = o.optString("listingCode");
            return s;
        }
    }

    public static final class PastMove {
        public String title;
        public String date;
        public String origin;
        public String destination;
        public String carrierInitials;
        public String carrierName;
        public String ratingSummary;
        public String price;
        public String paymentNote;
        public String quote;
        public String insuranceBadge;
        public String invoiceBadge;
        public String leftAction;
        public String rightAction;
        public boolean rightActionPrimary;
        public boolean isOffice;

        public PastMove(String title, String date, String origin, String destination,
                        String carrierInitials, String carrierName, String ratingSummary,
                        String price, String paymentNote, String quote,
                        String insuranceBadge, String invoiceBadge,
                        String leftAction, String rightAction, boolean rightActionPrimary, boolean isOffice) {
            this.title = title;
            this.date = date;
            this.origin = origin;
            this.destination = destination;
            this.carrierInitials = carrierInitials;
            this.carrierName = carrierName;
            this.ratingSummary = ratingSummary;
            this.price = price;
            this.paymentNote = paymentNote;
            this.quote = quote;
            this.insuranceBadge = insuranceBadge;
            this.invoiceBadge = invoiceBadge;
            this.leftAction = leftAction;
            this.rightAction = rightAction;
            this.rightActionPrimary = rightActionPrimary;
            this.isOffice = isOffice;
        }
    }

    public static final class ChatThread {
        public String id;
        public String initials;
        public String senderName;
        public boolean verified;
        public boolean isOfficial;
        public boolean unread;
        public String time;
        public String contextPill1;
        public String contextPill2;
        public boolean pill2Emerald;
        public String lastMessage;
        public String category; // "active" | "support" | "archive"

        public JSONObject toJson() {
            JSONObject o = new JSONObject();
            try {
                o.put("id", id);
                o.put("initials", initials);
                o.put("senderName", senderName);
                o.put("verified", verified);
                o.put("isOfficial", isOfficial);
                o.put("unread", unread);
                o.put("time", time);
                o.put("contextPill1", contextPill1);
                o.put("contextPill2", contextPill2);
                o.put("pill2Emerald", pill2Emerald);
                o.put("lastMessage", lastMessage);
                o.put("category", category);
            } catch (Exception ignored) {}
            return o;
        }

        public static ChatThread fromJson(JSONObject o) {
            ChatThread c = new ChatThread();
            c.id = o.optString("id");
            c.initials = o.optString("initials");
            c.senderName = o.optString("senderName");
            c.verified = o.optBoolean("verified");
            c.isOfficial = o.optBoolean("isOfficial");
            c.unread = o.optBoolean("unread");
            c.time = o.optString("time");
            c.contextPill1 = o.optString("contextPill1");
            c.contextPill2 = o.optString("contextPill2");
            c.pill2Emerald = o.optBoolean("pill2Emerald");
            c.lastMessage = o.optString("lastMessage");
            c.category = o.optString("category", "active");
            return c;
        }
    }

    private LoadlyStore() {}

    private static SharedPreferences prefs(Context ctx) {
        return ctx.getSharedPreferences(PREF, Context.MODE_PRIVATE);
    }

    public static String getUserName(Context ctx) {
        return prefs(ctx).getString(KEY_USER_NAME, "Ahmet Levent");
    }

    public static String getUserInitials(Context ctx) {
        String name = getUserName(ctx).trim();
        if (name.isEmpty()) return "AL";
        String[] parts = name.split("\\s+");
        if (parts.length >= 2) {
            return ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }

    public static String getUserContactLine(Context ctx) {
        String phone = prefs(ctx).getString(KEY_USER_PHONE, "+90 532 *** ** 12");
        String email = prefs(ctx).getString(KEY_USER_EMAIL, "ahmet@levent.com");
        return phone + " • " + email;
    }

    public static List<IncomingOffer> getIncomingOffers(Context ctx) {
        List<IncomingOffer> list = new ArrayList<>();
        list.add(new IncomingOffer(
                "inc_1",
                "En Çok Tercih Edilen",
                true,
                "25 dk önce",
                "Ege Güven Lojistik",
                "EG",
                "K1 Yetki",
                "4.9",
                184,
                "₺24.500",
                "Her Şey Dahil",
                new String[]{"3 Uzman Personel", "Kraft & Patpat Ambalaj", "Demontaj & Montaj", "Mobil Dış Asansör"},
                "₺1.200.000 Emtia Nakliyat Sigortası Dahil",
                true,
                "Kabul Et & Rezerve Et →",
                "Mesaj"
        ));
        list.add(new IncomingOffer(
                "inc_2",
                "Sabit Fiyat Garantisi",
                false,
                "1 sa önce",
                "Başkent Ekspres Nakliyat",
                "BE",
                "K2 Belgeli",
                "4.8",
                96,
                "₺26.000",
                "Net Fiyat",
                new String[]{"4 Personel (1 Marangoz + 3 Taşıyıcı)", "All-Risk Eşya Taşıma Sigortası (Axa Sigorta)"},
                null,
                false,
                "Kabul Et ✓",
                "Pazarlık / Soru Sor"
        ));
        list.add(new IncomingOffer(
                "inc_3",
                "VIP Konfor Paketi",
                false,
                "2 sa önce",
                "Anadolu VIP Taşımacılık",
                "AV",
                "K1 Yetki",
                "5.0",
                42,
                "₺28.000",
                "Premium Servis",
                new String[]{"Özel Kapalı Çelik Kasa + Havalı Süspansiyon", "Kıyafet Askı Dolapları & Beyaz Eşya Kılıfları"},
                null,
                false,
                "Teklifi İncele ›",
                "Mesaj"
        ));
        return list;
    }

    public static String getAcceptedIncomingId(Context ctx) {
        return prefs(ctx).getString(KEY_ACCEPTED_INCOMING_ID, "");
    }

    public static void setAcceptedIncomingId(Context ctx, String id) {
        prefs(ctx).edit().putString(KEY_ACCEPTED_INCOMING_ID, id).apply();
    }

    public static List<SentOffer> getSentOffers(Context ctx) {
        String raw = prefs(ctx).getString(KEY_SENT_OFFERS, null);
        List<SentOffer> list = new ArrayList<>();
        if (raw == null && !prefs(ctx).getBoolean(KEY_ACCOUNT_CLEARED, false)) {
            SentOffer s1 = new SentOffer();
            s1.id = "sent_1";
            s1.status = "counter";
            s1.statusLabel = "Karşı Teklif Geldi";
            s1.metaRight = "4 saat kaldı";
            s1.route = "Kadıköy, İST → Çankaya, ANK";
            s1.distance = "452 km";
            s1.dateAndType = "28 Ekim 2026 • 3+1 Ev Eşyası";
            s1.myPrice = "₺24.500";
            s1.counterPrice = "₺23.000";
            s1.counterQuote = "\"28 Ekim sabah 09:00 yerine 07:30 başlanırsa bu fiyata hemen onaylayabilirim.\"";
            list.add(s1);

            SentOffer s2 = new SentOffer();
            s2.id = "sent_2";
            s2.status = "review";
            s2.statusLabel = "Değerlendiriliyor";
            s2.metaRight = "Görüldü";
            s2.route = "Maslak, İST → Nilüfer, BUR";
            s2.distance = "148 km";
            s2.dateAndType = "1 Kasım 2026 • Ofis & Bilişim Donanımı";
            s2.myPrice = "₺46.000";
            s2.detailsLine = "Sigorta + 4 Personel + Dış Asansör";
            s2.competingNote = "5 diğer teklif yarışıyor";
            s2.listingCode = "İlan #LD-9021";
            list.add(s2);

            saveSentOffers(ctx, list);
            return list;
        }
        if (raw != null) {
            try {
                JSONArray arr = new JSONArray(raw);
                for (int i = 0; i < arr.length(); i++) {
                    list.add(SentOffer.fromJson(arr.getJSONObject(i)));
                }
            } catch (Exception ignored) {}
        }
        return list;
    }

    public static void saveSentOffers(Context ctx, List<SentOffer> offers) {
        JSONArray arr = new JSONArray();
        for (SentOffer o : offers) arr.put(o.toJson());
        prefs(ctx).edit().putString(KEY_SENT_OFFERS, arr.toString()).apply();
    }

    public static void addSentOffer(Context ctx, String route, String distance, String dateAndType, String price, String note) {
        List<SentOffer> offers = getSentOffers(ctx);
        SentOffer s = new SentOffer();
        s.id = "sent_" + System.currentTimeMillis();
        s.status = "review";
        s.statusLabel = "Değerlendiriliyor";
        s.metaRight = "Az önce";
        s.route = route;
        s.distance = distance;
        s.dateAndType = dateAndType;
        s.myPrice = price;
        s.detailsLine = (note == null || note.trim().isEmpty()) ? "Sigorta + Uzman Ekip Dahil" : note.trim();
        s.competingNote = "Teklifiniz ilan sahibine iletildi";
        s.listingCode = "İlan #LD-" + (1000 + (int) (System.currentTimeMillis() % 8999));
        offers.add(0, s);
        saveSentOffers(ctx, offers);
    }

    public static List<PastMove> getPastMoves() {
        List<PastMove> list = new ArrayList<>();
        list.add(new PastMove(
                "Ev Taşıma (3+1)",
                "14 Eylül 2026",
                "Fenerbahçe, Kadıköy",
                "Çayyolu, Çankaya",
                "EG",
                "Ege Güven Lojistik",
                "5.0 (142 Yorum)",
                "₺22.500",
                "Havuzdan Ödendi",
                "\"Kusursuz ambalajlama ve tam zamanında teslimat yapıldı. Eşyalar en ufak çizik dahi almadan yerleşti.\"",
                null,
                null,
                "E-İrsaliye & Fatura",
                "Tekrar Taşıt",
                true,
                false
        ));
        list.add(new PastMove(
                "Kurumsal Ofis Nakliyesi",
                "28 Temmuz 2026",
                "Levent Plaza, İstanbul",
                "Alsancak Kordon, İzmir",
                "AV",
                "Anadolu VIP Taşımacılık",
                "5.0 (310 Yorum)",
                "₺38.000",
                "Poliçe Kapandı",
                null,
                "₺500.000 Tam Kapsam Emtia Sigortası",
                "E-Arşiv Fatura",
                "Sözleşme & Rapor",
                "Fatura İndir",
                false,
                true
        ));
        return list;
    }

    public static List<ChatThread> getMessages(Context ctx) {
        String raw = prefs(ctx).getString(KEY_MESSAGES, null);
        List<ChatThread> list = new ArrayList<>();
        if (raw == null && !prefs(ctx).getBoolean(KEY_ACCOUNT_CLEARED, false)) {
            ChatThread c1 = new ChatThread();
            c1.id = "msg_1";
            c1.initials = "EG";
            c1.senderName = "Ege Güven Lojistik (Ahmet Usta)";
            c1.verified = true;
            c1.unread = true;
            c1.time = "10:42";
            c1.contextPill1 = "Kadıköy → Çankaya İlanı";
            c1.contextPill2 = "₺14.250 Teklif";
            c1.pill2Emerald = true;
            c1.lastMessage = "\"Merhabalar, 28 Ekim sabah 08:30'da kapıda olabiliriz. Asansör kurulumu fiyata dahil.\"";
            c1.category = "active";
            list.add(c1);

            ChatThread c2 = new ChatThread();
            c2.id = "msg_2";
            c2.initials = "BE";
            c2.senderName = "Başkent Ekspres Nakliyat";
            c2.verified = false;
            c2.unread = false;
            c2.time = "Dün";
            c2.contextPill1 = "Kadıköy → Çankaya İlanı";
            c2.contextPill2 = "4.8 ★ (84)";
            c2.pill2Emerald = false;
            c2.lastMessage = "Eşyaların fotoğraflarını inceledik, 3+1 için 4 kişilik ekip yönlendiriyoruz.";
            c2.category = "active";
            list.add(c2);

            ChatThread c3 = new ChatThread();
            c3.id = "msg_3";
            c3.initials = "LD";
            c3.senderName = "Loadly Taşıma Asistanı";
            c3.isOfficial = true;
            c3.unread = false;
            c3.time = "2 gün önce";
            c3.contextPill1 = "Güvenli Ödeme & Rezervasyon";
            c3.contextPill2 = "";
            c3.lastMessage = "İlanınız başarıyla onaylandı ve doğrulanmış 18 nakliyeciye iletildi.";
            c3.category = "support";
            list.add(c3);

            saveMessages(ctx, list);
            return list;
        }
        if (raw != null) {
            try {
                JSONArray arr = new JSONArray(raw);
                for (int i = 0; i < arr.length(); i++) {
                    list.add(ChatThread.fromJson(arr.getJSONObject(i)));
                }
            } catch (Exception ignored) {}
        }
        return list;
    }

    public static void saveMessages(Context ctx, List<ChatThread> threads) {
        JSONArray arr = new JSONArray();
        for (ChatThread t : threads) arr.put(t.toJson());
        prefs(ctx).edit().putString(KEY_MESSAGES, arr.toString()).apply();
    }

    public static void appendReply(Context ctx, String threadId, String replyText) {
        List<ChatThread> threads = getMessages(ctx);
        for (ChatThread t : threads) {
            if (t.id.equals(threadId)) {
                t.lastMessage = "Siz: " + replyText;
                t.time = "Şimdi";
                t.unread = false;
                break;
            }
        }
        saveMessages(ctx, threads);
    }

    public static void clearLocalData(Context ctx) {
        prefs(ctx).edit()
                .remove(KEY_SENT_OFFERS)
                .remove(KEY_ACCEPTED_INCOMING_ID)
                .remove(KEY_MESSAGES)
                .putBoolean(KEY_ACCOUNT_CLEARED, true)
                .apply();
    }
}

package com.cynorra.loadly;

import android.content.Context;
import android.location.Address;
import android.location.Geocoder;
import android.os.Handler;
import android.os.Looper;

import java.text.Normalizer;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Fast O(1) freight city coordinate lookup (250+ US, Turkey, EU, UK, Canada, Mexico, MENA hubs)
 * with an async Android Geocoder fallback + in-memory cache and Haversine road-distance math.
 */
public final class GeoCoordResolver {

    public static final class LatLng {
        public final double lat;
        public final double lng;

        public LatLng(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }

    public interface Callback {
        void onResolved(LatLng origin, LatLng dest);
    }

    private static final Map<String, LatLng> CITIES = new HashMap<>();
    private static final Map<String, LatLng> COUNTRIES = new HashMap<>();
    private static final ConcurrentHashMap<String, LatLng> RUNTIME_CACHE = new ConcurrentHashMap<>();
    private static final ExecutorService GEO_EXEC = Executors.newFixedThreadPool(2);
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    static {
        // --- United States Freight Hubs ---
        c("new york", 40.7128, -74.0060);
        c("newark", 40.7357, -74.1724);
        c("jersey city", 40.7178, -74.0431);
        c("los angeles", 34.0522, -118.2437);
        c("long beach", 33.7701, -118.1937);
        c("ontario", 34.0633, -117.6509);
        c("fontana", 34.0922, -117.4350);
        c("riverside", 33.9806, -117.3755);
        c("san diego", 32.7157, -117.1611);
        c("san francisco", 37.7749, -122.4194);
        c("oakland", 37.8044, -122.2712);
        c("san jose", 37.3382, -121.8863);
        c("sacramento", 38.5816, -121.4944);
        c("stockton", 37.9577, -121.2908);
        c("fresno", 36.7378, -119.7871);
        c("bakersfield", 35.3733, -119.0187);
        c("chicago", 41.8781, -87.6298);
        c("joliet", 41.5250, -88.0817);
        c("aurora", 41.7606, -88.3201);
        c("houston", 29.7604, -95.3698);
        c("dallas", 32.7767, -96.7970);
        c("fort worth", 32.7555, -97.3308);
        c("san antonio", 29.4241, -98.4936);
        c("austin", 30.2672, -97.7431);
        c("laredo", 27.5306, -99.4803);
        c("el paso", 31.7619, -106.4850);
        c("mcallen", 26.2034, -98.2300);
        c("brownsville", 25.9017, -97.4975);
        c("amarillo", 35.2220, -101.8313);
        c("lubbock", 33.5779, -101.8552);
        c("atlanta", 33.7490, -84.3880);
        c("savannah", 32.0809, -81.0912);
        c("macon", 32.8407, -83.6324);
        c("miami", 25.7617, -80.1918);
        c("orlando", 28.5383, -81.3792);
        c("tampa", 27.9506, -82.4572);
        c("jacksonville", 30.3322, -81.6557);
        c("fort lauderdale", 26.1224, -80.1373);
        c("charlotte", 35.2271, -80.8431);
        c("raleigh", 35.7796, -78.6382);
        c("greensboro", 36.0726, -79.7920);
        c("charleston", 32.7765, -79.9311);
        c("columbia", 34.0007, -81.0348);
        c("greenville", 34.8526, -82.3940);
        c("memphis", 35.1495, -90.0490);
        c("nashville", 36.1627, -86.7816);
        c("knoxville", 35.9606, -83.9207);
        c("chattanooga", 35.0456, -85.3097);
        c("louisville", 38.2527, -85.7585);
        c("lexington", 38.0406, -84.5037);
        c("indianapolis", 39.7684, -86.1581);
        c("fort wayne", 41.0793, -85.1394);
        c("columbus", 39.9612, -82.9988);
        c("cleveland", 41.4993, -81.6944);
        c("cincinnati", 39.1031, -84.5120);
        c("toledo", 41.6528, -83.5379);
        c("detroit", 42.3314, -83.0458);
        c("grand rapids", 42.9634, -85.6681);
        c("philadelphia", 39.9526, -75.1652);
        c("pittsburgh", 40.4406, -79.9959);
        c("allentown", 40.6084, -75.4902);
        c("harrisburg", 40.2732, -76.8867);
        c("baltimore", 39.2904, -76.6122);
        c("washington", 38.9072, -77.0369);
        c("richmond", 37.5407, -77.4360);
        c("norfolk", 36.8508, -76.2859);
        c("boston", 42.3601, -71.0589);
        c("hartford", 41.7658, -72.6734);
        c("providence", 41.8240, -71.4128);
        c("buffalo", 42.8864, -78.8784);
        c("albany", 42.6526, -73.7562);
        c("syracuse", 43.0481, -76.1474);
        c("rochester", 43.1566, -77.6088);
        c("phoenix", 33.4484, -112.0740);
        c("tucson", 32.2226, -110.9747);
        c("las vegas", 36.1699, -115.1398);
        c("reno", 39.5296, -119.8138);
        c("denver", 39.7392, -104.9903);
        c("colorado springs", 38.8339, -104.8214);
        c("salt lake city", 40.7608, -111.8910);
        c("seattle", 47.6062, -122.3321);
        c("tacoma", 47.2529, -122.4443);
        c("spokane", 47.6588, -117.4260);
        c("portland", 45.5152, -122.6784);
        c("boise", 43.6150, -116.2023);
        c("minneapolis", 44.9778, -93.2650);
        c("st paul", 44.9537, -93.0900);
        c("milwaukee", 43.0389, -87.9065);
        c("madison", 43.0731, -89.4012);
        c("kansas city", 39.0997, -94.5786);
        c("st louis", 38.6270, -90.1994);
        c("saint louis", 38.6270, -90.1994);
        c("springfield", 37.2090, -93.2923);
        c("des moines", 41.5868, -93.6250);
        c("omaha", 41.2565, -95.9345);
        c("wichita", 37.6872, -97.3301);
        c("oklahoma city", 35.4676, -97.5164);
        c("tulsa", 36.1540, -95.9928);
        c("little rock", 34.7465, -92.2896);
        c("new orleans", 29.9511, -90.0715);
        c("baton rouge", 30.4515, -91.1871);
        c("shreveport", 32.5252, -93.7502);
        c("birmingham", 33.5186, -86.8104);
        c("mobile", 30.6954, -88.0399);
        c("montgomery", 32.3792, -86.3077);
        c("jackson", 32.2988, -90.1848);
        c("albuquerque", 35.0844, -106.6504);
        c("fargo", 46.8772, -96.7898);
        c("sioux falls", 43.5446, -96.7311);
        c("billings", 45.7833, -108.5007);
        c("cheyenne", 41.1400, -104.8202);

        // --- Turkey (All major provinces & logistics hubs) ---
        c("istanbul", 41.0082, 28.9784);
        c("tuzla", 40.8162, 29.3006);
        c("hadimkoy", 41.1583, 28.6175);
        c("ankara", 39.9334, 32.8597);
        c("izmir", 38.4237, 27.1428);
        c("bursa", 40.1885, 29.0610);
        c("kocaeli", 40.8533, 29.8815);
        c("izmit", 40.7654, 29.9408);
        c("gebze", 40.8028, 29.4307);
        c("adana", 37.0000, 35.3213);
        c("mersin", 36.8121, 34.6415);
        c("gaziantep", 37.0662, 37.3833);
        c("konya", 37.8746, 32.4932);
        c("kayseri", 38.7312, 35.4787);
        c("antalya", 36.8969, 30.7133);
        c("samsun", 41.2867, 36.3300);
        c("trabzon", 41.0027, 39.7168);
        c("eskisehir", 39.7767, 30.5206);
        c("denizli", 37.7765, 29.0864);
        c("manisa", 38.6191, 27.4289);
        c("sakarya", 40.7569, 30.3781);
        c("adapazari", 40.7731, 30.3948);
        c("tekirdag", 40.9833, 27.5167);
        c("corlu", 41.1592, 27.8000);
        c("cerkezkoy", 41.2856, 28.0003);
        c("hatay", 36.4018, 36.3498);
        c("iskenderun", 36.5872, 36.1735);
        c("sanliurfa", 37.1674, 38.7955);
        c("urfa", 37.1674, 38.7955);
        c("diyarbakir", 37.9144, 40.2306);
        c("malatya", 38.3552, 38.3095);
        c("erzurum", 39.9043, 41.2679);
        c("van", 38.5012, 43.3729);
        c("balikesir", 39.6484, 27.8826);
        c("bandirma", 40.3522, 27.9767);
        c("aydin", 37.8560, 27.8416);
        c("mugla", 37.2153, 28.3636);
        c("afyon", 38.7507, 30.5567);
        c("afyonkarahisar", 38.7507, 30.5567);
        c("sivas", 39.7477, 37.0179);
        c("bolu", 40.7392, 31.6089);
        c("duzce", 40.8438, 31.1565);
        c("canakkale", 40.1553, 26.4142);
        c("edirne", 41.6818, 26.5623);
        c("yalova", 40.6500, 29.2667);
        c("kahramanmaras", 37.5858, 36.9371);
        c("maras", 37.5858, 36.9371);
        c("elazig", 38.6810, 39.2264);
        c("mardin", 37.3212, 40.7245);
        c("batman", 37.8812, 41.1351);
        c("adiyaman", 37.7648, 38.2786);
        c("osmaniye", 37.0742, 36.2478);
        c("isparta", 37.7648, 30.5566);
        c("burdur", 37.7203, 30.2908);
        c("kutahya", 39.4167, 29.9833);
        c("usak", 38.6823, 29.4082);
        c("zonguldak", 41.4564, 31.7987);
        c("kastamonu", 41.3887, 33.7827);
        c("corum", 40.5506, 34.9556);
        c("tokat", 40.3167, 36.5500);
        c("amasya", 40.6499, 35.8353);
        c("ordu", 40.9839, 37.8764);
        c("giresun", 40.9128, 38.3895);
        c("rize", 41.0201, 40.5234);
        c("kars", 40.6013, 43.0975);
        c("agri", 39.7191, 43.0503);
        c("erzincan", 39.7500, 39.5000);
        c("yozgat", 39.8181, 34.8147);
        c("aksaray", 38.3687, 34.0370);
        c("nigde", 37.9667, 34.6833);
        c("nevsehir", 38.6244, 34.7239);
        c("kirikkale", 39.8468, 33.5153);
        c("karaman", 37.1759, 33.2287);
        c("bilecik", 40.1501, 29.9830);
        c("kirklareli", 41.7333, 27.2167);
        c("sinop", 42.0231, 35.1531);

        // --- Europe, UK, Canada, Mexico & MENA ---
        c("berlin", 52.5200, 13.4050);
        c("munich", 48.1351, 11.5820);
        c("munchen", 48.1351, 11.5820);
        c("frankfurt", 50.1109, 8.6821);
        c("hamburg", 53.5511, 9.9937);
        c("cologne", 50.9375, 6.9603);
        c("koln", 50.9375, 6.9603);
        c("stuttgart", 48.7758, 9.1829);
        c("dusseldorf", 51.2277, 6.7735);
        c("dortmund", 51.5136, 7.4653);
        c("nuremberg", 49.4521, 11.0767);
        c("leipzig", 51.3397, 12.3731);
        c("rotterdam", 51.9244, 4.4777);
        c("amsterdam", 52.3676, 4.9041);
        c("antwerp", 51.2194, 4.4025);
        c("brussels", 50.8503, 4.3517);
        c("paris", 48.8566, 2.3522);
        c("lyon", 45.7640, 4.8357);
        c("marseille", 43.2965, 5.3698);
        c("lille", 50.6292, 3.0573);
        c("milan", 45.4642, 9.1900);
        c("milano", 45.4642, 9.1900);
        c("rome", 41.9028, 12.4964);
        c("bologna", 44.4949, 11.3426);
        c("turin", 45.0703, 7.6869);
        c("verona", 45.4384, 10.9916);
        c("madrid", 40.4168, -3.7038);
        c("barcelona", 41.3874, 2.1686);
        c("valencia", 39.4699, -0.3763);
        c("zaragoza", 41.6488, -0.8891);
        c("warsaw", 52.2297, 21.0122);
        c("lodz", 51.7592, 19.4560);
        c("krakow", 50.0647, 19.9450);
        c("wroclaw", 51.1079, 17.0385);
        c("poznan", 52.4064, 16.9252);
        c("prague", 50.0755, 14.4378);
        c("vienna", 48.2082, 16.3738);
        c("wien", 48.2082, 16.3738);
        c("budapest", 47.4979, 19.0402);
        c("bucharest", 44.4268, 26.1025);
        c("sofia", 42.6977, 23.3219);
        c("athens", 37.9838, 23.7275);
        c("thessaloniki", 40.6401, 22.9444);
        c("zurich", 47.3769, 8.5417);
        c("basel", 47.5596, 7.5886);
        c("london", 51.5072, -0.1276);
        c("manchester", 53.4808, -2.2426);
        c("leeds", 53.8008, -1.5491);
        c("glasgow", 55.8642, -4.2518);
        c("toronto", 43.6532, -79.3832);
        c("montreal", 45.5017, -73.5673);
        c("vancouver", 49.2827, -123.1207);
        c("calgary", 51.0447, -114.0719);
        c("edmonton", 53.5461, -113.4938);
        c("winnipeg", 49.8951, -97.1384);
        c("monterrey", 25.6866, -100.3161);
        c("mexico city", 19.4326, -99.1332);
        c("guadalajara", 20.6597, -103.3496);
        c("tijuana", 32.5149, -117.0382);
        c("dubai", 25.2048, 55.2708);
        c("riyadh", 24.7136, 46.6753);
        c("jeddah", 21.4858, 39.1925);
        c("doha", 25.2854, 51.5310);

        // --- Country fallback centroids ---
        co("united states", 39.8283, -98.5795);
        co("usa", 39.8283, -98.5795);
        co("us", 39.8283, -98.5795);
        co("turkey", 39.0000, 35.2433);
        co("turkiye", 39.0000, 35.2433);
        co("tr", 39.0000, 35.2433);
        co("germany", 51.1657, 10.4515);
        co("de", 51.1657, 10.4515);
        co("united kingdom", 54.0, -2.0);
        co("uk", 54.0, -2.0);
        co("gb", 54.0, -2.0);
        co("france", 46.2276, 2.2137);
        co("italy", 41.8719, 12.5674);
        co("spain", 40.4637, -3.7492);
        co("netherlands", 52.1326, 5.2913);
        co("belgium", 50.5039, 4.4699);
        co("poland", 51.9194, 19.1451);
        co("canada", 56.1304, -106.3468);
        co("mexico", 23.6345, -102.5528);
    }

    private GeoCoordResolver() {}

    private static void c(String key, double lat, double lng) {
        CITIES.put(key, new LatLng(lat, lng));
    }

    private static void co(String key, double lat, double lng) {
        COUNTRIES.put(key, new LatLng(lat, lng));
    }

    /** Instant synchronous lookup (never blocks UI thread). */
    public static LatLng lookupFast(String city, String country) {
        String key = normalize(city);
        if (!key.isEmpty()) {
            LatLng hit = RUNTIME_CACHE.get(key);
            if (hit != null) return hit;
            hit = CITIES.get(key);
            if (hit != null) return hit;
            // Strip state/district suffix: "Dallas, TX" or "Istanbul / Tuzla" or "Charlotte NC"
            String primary = key.split("[,/\\-(]")[0].trim();
            if (!primary.isEmpty()) {
                hit = CITIES.get(primary);
                if (hit != null) return hit;
                // Handle "Dallas TX" (2-letter state code at end)
                String[] parts = primary.split("\\s+");
                if (parts.length >= 2 && parts[parts.length - 1].length() == 2) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < parts.length - 1; i++) {
                        if (i > 0) sb.append(' ');
                        sb.append(parts[i]);
                    }
                    hit = CITIES.get(sb.toString());
                    if (hit != null) return hit;
                }
            }
        }
        String cKey = normalize(country);
        if (!cKey.isEmpty()) {
            LatLng coHit = COUNTRIES.get(cKey);
            if (coHit != null) return coHit;
        }
        return null;
    }

    /** Async resolution: returns immediately if known, else queries Android Geocoder off-thread. */
    public static void resolveAsync(Context ctx, String origCity, String origCountry,
                                    String destCity, String destCountry, Callback cb) {
        LatLng fastOrig = lookupFast(origCity, origCountry);
        LatLng fastDest = lookupFast(destCity, destCountry);
        boolean origExact = isExactCityKnown(origCity);
        boolean destExact = isExactCityKnown(destCity);

        if (origExact && destExact) {
            cb.onResolved(fastOrig, fastDest);
            return;
        }
        // Deliver immediate fast approximation first if available
        if (fastOrig != null && fastDest != null) {
            cb.onResolved(fastOrig, fastDest);
        }
        final Context appCtx = ctx.getApplicationContext();
        GEO_EXEC.execute(() -> {
            LatLng o = origExact ? fastOrig : geocodeOne(appCtx, origCity, origCountry, fastOrig);
            LatLng d = destExact ? fastDest : geocodeOne(appCtx, destCity, destCountry, fastDest);
            if (o != null && d != null) {
                MAIN.post(() -> cb.onResolved(o, d));
            }
        });
    }

    private static boolean isExactCityKnown(String city) {
        String key = normalize(city);
        if (key.isEmpty()) return false;
        if (RUNTIME_CACHE.containsKey(key) || CITIES.containsKey(key)) return true;
        String primary = key.split("[,/\\-(]")[0].trim();
        return CITIES.containsKey(primary);
    }

    @SuppressWarnings("deprecation")
    private static LatLng geocodeOne(Context ctx, String city, String country, LatLng fallback) {
        String key = normalize(city);
        if (key.isEmpty() || !Geocoder.isPresent()) return fallback;
        try {
            Geocoder g = new Geocoder(ctx, Locale.US);
            String query = (city != null ? city.trim() : "")
                    + (country != null && !country.trim().isEmpty() ? ", " + country.trim() : "");
            List<Address> list = g.getFromLocationName(query, 1);
            if (list != null && !list.isEmpty()) {
                Address a = list.get(0);
                LatLng found = new LatLng(a.getLatitude(), a.getLongitude());
                RUNTIME_CACHE.put(key, found);
                return found;
            }
        } catch (Exception ignored) {
        }
        return fallback;
    }

    /** Haversine road-adjusted distance in kilometers (1.18x highway curvature factor). */
    public static double estimateRoadKm(LatLng a, LatLng b) {
        if (a == null || b == null) return 0;
        double dLat = Math.toRadians(b.lat - a.lat);
        double dLng = Math.toRadians(b.lng - a.lng);
        double sinLat = Math.sin(dLat / 2.0);
        double sinLng = Math.sin(dLng / 2.0);
        double h = sinLat * sinLat
                + Math.cos(Math.toRadians(a.lat)) * Math.cos(Math.toRadians(b.lat)) * sinLng * sinLng;
        double straightKm = 6371.0 * 2.0 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0.0, 1.0 - h)));
        if (straightKm < 5.0) return 0;
        return straightKm * 1.18;
    }

    public static int estimateRoadDistance(LatLng a, LatLng b, boolean imperial) {
        double km = estimateRoadKm(a, b);
        if (km <= 0) return 0;
        return imperial ? (int) Math.round(km * 0.621371) : (int) Math.round(km);
    }

    public static String formatDistanceShort(LatLng a, LatLng b, boolean imperial) {
        int dist = estimateRoadDistance(a, b, imperial);
        if (dist <= 0) return "";
        return "~" + String.format(Locale.getDefault(), "%,d", dist) + (imperial ? " mi" : " km");
    }

    public static String formatDistanceAndEta(LatLng a, LatLng b, boolean imperial) {
        double km = estimateRoadKm(a, b);
        if (km <= 0) return "";
        int dist = imperial ? (int) Math.round(km * 0.621371) : (int) Math.round(km);
        int hours = Math.max(1, (int) Math.round(km / 82.0)); // Avg freight highway speed
        return "~" + String.format(Locale.getDefault(), "%,d", dist)
                + (imperial ? " mi" : " km")
                + "  •  ~" + hours + "h";
    }

    private static String normalize(String s) {
        if (s == null) return "";
        String clean = s.replace('İ', 'I').replace('ı', 'i')
                .replace('Ş', 'S').replace('ş', 's')
                .replace('Ğ', 'G').replace('ğ', 'g')
                .replace('Ü', 'U').replace('ü', 'u')
                .replace('Ö', 'O').replace('ö', 'o')
                .replace('Ç', 'C').replace('ç', 'c');
        clean = Normalizer.normalize(clean, Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return clean.toLowerCase(Locale.US).trim();
    }
}

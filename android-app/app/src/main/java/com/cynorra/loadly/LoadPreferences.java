package com.cynorra.loadly;

import android.content.Context;
import android.content.SharedPreferences;

import com.cynorra.loadly.model.Load;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Local persistence for 2027+ trucker workflow:
 * - Saved/Bookmarked loads (stored as full JSON so they work 100% offline)
 * - Called loads tracking ("CALLED ✓" badge)
 * - Taken/Dead loads filter (hides expired loads reported by user)
 * - Saved Lane Alerts (origin -> destination + optional min price)
 * - Offline feed cache (last successful marketplace fetch)
 */
public final class LoadPreferences {
    private static final String PREFS = "loadly_trucker_prefs_v2";
    private static final String KEY_BOOKMARKS = "bookmarks_json";
    private static final String KEY_CALLED_IDS = "called_ids";
    private static final String KEY_TAKEN_IDS = "taken_ids";
    private static final String KEY_LANE_ALERTS = "lane_alerts_json";
    private static final String KEY_OFFLINE_CACHE = "offline_loads_cache";
    private static final String KEY_ALERTED_IDS = "alerted_load_ids";

    private LoadPreferences() {}

    private static SharedPreferences prefs(Context ctx) {
        return ctx.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    // ---- Bookmarks ----
    public static boolean isBookmarked(Context ctx, String loadId) {
        if (loadId == null) return false;
        return getBookmarkMap(ctx).containsKey(loadId);
    }

    public static boolean toggleBookmark(Context ctx, Load load) {
        if (load == null || load.id == null) return false;
        LinkedHashMap<String, JSONObject> map = getBookmarkMap(ctx);
        boolean nowSaved;
        if (map.containsKey(load.id)) {
            map.remove(load.id);
            nowSaved = false;
        } else {
            map.put(load.id, load.toJson());
            nowSaved = true;
        }
        JSONArray arr = new JSONArray();
        for (JSONObject obj : map.values()) arr.put(obj);
        prefs(ctx).edit().putString(KEY_BOOKMARKS, arr.toString()).apply();
        return nowSaved;
    }

    public static List<Load> getBookmarkedLoads(Context ctx) {
        List<Load> out = new ArrayList<>();
        for (JSONObject obj : getBookmarkMap(ctx).values()) {
            out.add(Load.fromJson(obj));
        }
        return out;
    }

    private static LinkedHashMap<String, JSONObject> getBookmarkMap(Context ctx) {
        LinkedHashMap<String, JSONObject> map = new LinkedHashMap<>();
        String raw = prefs(ctx).getString(KEY_BOOKMARKS, "[]");
        try {
            JSONArray arr = new JSONArray(raw);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject o = arr.optJSONObject(i);
                if (o != null && o.has("id")) map.put(o.optString("id"), o);
            }
        } catch (Exception ignored) {
        }
        return map;
    }

    // ---- Called & Taken Tracking ----
    public static void markCalled(Context ctx, String loadId) {
        if (loadId == null || loadId.isEmpty()) return;
        Set<String> set = new HashSet<>(prefs(ctx).getStringSet(KEY_CALLED_IDS, new HashSet<>()));
        set.add(loadId);
        prefs(ctx).edit().putStringSet(KEY_CALLED_IDS, set).apply();
    }

    public static boolean isCalled(Context ctx, String loadId) {
        if (loadId == null) return false;
        return prefs(ctx).getStringSet(KEY_CALLED_IDS, new HashSet<>()).contains(loadId);
    }

    public static void markTaken(Context ctx, String loadId) {
        if (loadId == null || loadId.isEmpty()) return;
        Set<String> set = new HashSet<>(prefs(ctx).getStringSet(KEY_TAKEN_IDS, new HashSet<>()));
        set.add(loadId);
        prefs(ctx).edit().putStringSet(KEY_TAKEN_IDS, set).apply();
    }

    public static boolean isTaken(Context ctx, String loadId) {
        if (loadId == null) return false;
        return prefs(ctx).getStringSet(KEY_TAKEN_IDS, new HashSet<>()).contains(loadId);
    }

    // ---- Saved Lane Alerts ----
    public static final class LaneAlert {
        public final String origin;
        public final String destination;
        public final double minPrice;

        public LaneAlert(String origin, String destination, double minPrice) {
            this.origin = origin != null ? origin.trim() : "";
            this.destination = destination != null ? destination.trim() : "";
            this.minPrice = Math.max(0.0, minPrice);
        }

        public boolean matches(Load load) {
            if (load == null) return false;
            String orig = String.valueOf(load.originCity).toLowerCase(Locale.US);
            String dest = String.valueOf(load.destinationCity).toLowerCase(Locale.US);
            if (!origin.isEmpty() && !orig.contains(origin.toLowerCase(Locale.US))) return false;
            if (!destination.isEmpty() && !dest.contains(destination.toLowerCase(Locale.US))) return false;
            if (minPrice > 0 && (load.price == null || load.price < minPrice)) return false;
            return !origin.isEmpty() || !destination.isEmpty();
        }

        public String label() {
            String o = origin.isEmpty() ? "Any" : origin;
            String d = destination.isEmpty() ? "Any" : destination;
            return minPrice > 0
                    ? String.format(Locale.US, "%s → %s (≥ $%,.0f)", o, d, minPrice)
                    : o + " → " + d;
        }
    }

    public static List<LaneAlert> getLaneAlerts(Context ctx) {
        List<LaneAlert> list = new ArrayList<>();
        String raw = prefs(ctx).getString(KEY_LANE_ALERTS, "[]");
        try {
            JSONArray arr = new JSONArray(raw);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject o = arr.optJSONObject(i);
                if (o != null) {
                    list.add(new LaneAlert(o.optString("origin"), o.optString("destination"), o.optDouble("min_price", 0)));
                }
            }
        } catch (Exception ignored) {
        }
        return list;
    }

    public static void addLaneAlert(Context ctx, LaneAlert alert) {
        List<LaneAlert> list = getLaneAlerts(ctx);
        list.add(alert);
        saveLaneAlerts(ctx, list);
    }

    public static void removeLaneAlert(Context ctx, int index) {
        List<LaneAlert> list = getLaneAlerts(ctx);
        if (index >= 0 && index < list.size()) {
            list.remove(index);
            saveLaneAlerts(ctx, list);
        }
    }

    private static void saveLaneAlerts(Context ctx, List<LaneAlert> list) {
        JSONArray arr = new JSONArray();
        for (LaneAlert a : list) {
            try {
                JSONObject o = new JSONObject();
                o.put("origin", a.origin);
                o.put("destination", a.destination);
                o.put("min_price", a.minPrice);
                arr.put(o);
            } catch (Exception ignored) {
            }
        }
        prefs(ctx).edit().putString(KEY_LANE_ALERTS, arr.toString()).apply();
    }

    /** Returns newly matched loads that have not been alerted before. */
    public static List<Load> findNewAlertMatches(Context ctx, List<Load> loads) {
        List<LaneAlert> alerts = getLaneAlerts(ctx);
        List<Load> matches = new ArrayList<>();
        if (alerts.isEmpty() || loads == null) return matches;
        Set<String> alerted = new HashSet<>(prefs(ctx).getStringSet(KEY_ALERTED_IDS, new HashSet<>()));
        boolean changed = false;
        for (Load l : loads) {
            if (l.id == null || alerted.contains(l.id) || isTaken(ctx, l.id)) continue;
            for (LaneAlert a : alerts) {
                if (a.matches(l)) {
                    matches.add(l);
                    alerted.add(l.id);
                    changed = true;
                    break;
                }
            }
        }
        if (changed) {
            prefs(ctx).edit().putStringSet(KEY_ALERTED_IDS, alerted).apply();
        }
        return matches;
    }

    // ---- Offline Cache ----
    public static void cacheLoads(Context ctx, List<Load> loads) {
        if (loads == null || loads.isEmpty()) return;
        JSONArray arr = new JSONArray();
        int max = Math.min(loads.size(), 50);
        for (int i = 0; i < max; i++) {
            arr.put(loads.get(i).toJson());
        }
        prefs(ctx).edit().putString(KEY_OFFLINE_CACHE, arr.toString()).apply();
    }

    public static List<Load> getCachedLoads(Context ctx) {
        List<Load> list = new ArrayList<>();
        String raw = prefs(ctx).getString(KEY_OFFLINE_CACHE, "[]");
        try {
            JSONArray arr = new JSONArray(raw);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject o = arr.optJSONObject(i);
                if (o != null) list.add(Load.fromJson(o));
            }
        } catch (Exception ignored) {
        }
        return list;
    }
}

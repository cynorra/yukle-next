package com.cynorra.loadly;

import android.content.Context;

import com.cynorra.loadly.model.Load;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Freight domain utilities: Imperial (lbs/mi/$) vs Metric (t/km/₺),
 * freshness detection, FMCSA MC/DOT extraction, and Net Profit / RPM math.
 */
public final class FreightMetrics {

    private static final double LBS_PER_METRIC_TON = 2204.62;
    private static final long FRESH_WINDOW_MS = 90L * 60L * 1000L; // 90 minutes

    private static final Pattern MC_PATTERN = Pattern.compile("\\bMC[#\\s-]*(\\d{4,8})\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern DOT_PATTERN = Pattern.compile("\\b(?:US)?DOT[#\\s-]*(\\d{4,8})\\b", Pattern.CASE_INSENSITIVE);

    private FreightMetrics() {}

    public static boolean isImperial(String country) {
        if (country == null) return false;
        String c = country.trim().toLowerCase(Locale.US);
        return c.equals("us") || c.equals("usa") || c.contains("united states")
                || c.equals("uk") || c.equals("gb") || c.contains("united kingdom");
    }

    public static boolean isTurkey(String country) {
        if (country == null) return false;
        String c = country.trim().toLowerCase(Locale.US);
        return c.equals("tr") || c.contains("turkey") || c.contains("türkiye") || c.contains("turkiye");
    }

    public static String currencySymbol(String originCountry) {
        if (isTurkey(originCountry)) return "₺";
        if (isImperial(originCountry)) return "$";
        return "$";
    }

    public static String formatWeight(Context ctx, Load load) {
        if (load == null || load.weightTon <= 0) return "";
        if (isImperial(load.originCountry)) {
            long lbs = Math.round(load.weightTon * LBS_PER_METRIC_TON);
            return String.format(Locale.US, "%,d lbs", lbs);
        }
        String fmt = (load.weightTon == Math.floor(load.weightTon))
                ? String.format(Locale.getDefault(), "%.0f", load.weightTon)
                : String.format(Locale.getDefault(), "%.1f", load.weightTon);
        return ctx.getString(R.string.weight_value, fmt);
    }

    public static String formatPrice(Context ctx, Load load) {
        if (load == null || load.price == null || load.price <= 0) {
            return ctx.getString(R.string.ask_for_price);
        }
        String symbol = currencySymbol(load.originCountry);
        return symbol + String.format(Locale.getDefault(), "%,.0f", load.price);
    }

    public static long parseCreatedAtMs(String createdAt) {
        if (createdAt == null || createdAt.isEmpty()) return 0L;
        String[] patterns = {
                "yyyy-MM-dd'T'HH:mm:ss.SSSSSSXXX",
                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                "yyyy-MM-dd'T'HH:mm:ssXXX",
                "yyyy-MM-dd'T'HH:mm:ss'Z'"
        };
        for (String p : patterns) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat(p, Locale.US);
                sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                Date d = sdf.parse(createdAt);
                if (d != null) return d.getTime();
            } catch (ParseException ignored) {
            }
        }
        return 0L;
    }

    public static boolean isFresh(String createdAt) {
        long ms = parseCreatedAtMs(createdAt);
        if (ms <= 0L) return false;
        long age = System.currentTimeMillis() - ms;
        return age >= 0L && age <= FRESH_WINDOW_MS;
    }

    public static final class BrokerId {
        public final String type; // "MC" or "DOT"
        public final String number;
        public BrokerId(String type, String number) {
            this.type = type;
            this.number = number;
        }
    }

    public static BrokerId extractBrokerId(Load load) {
        if (load == null) return null;
        String blob = String.valueOf(load.title) + " " + load.description + " " + load.shipperName;
        Matcher mc = MC_PATTERN.matcher(blob);
        if (mc.find()) return new BrokerId("MC", mc.group(1));
        Matcher dot = DOT_PATTERN.matcher(blob);
        if (dot.find()) return new BrokerId("DOT", dot.group(1));
        return null;
    }

    public static final class ProfitResult {
        public final double totalDistance;
        public final double grossPerUnit;
        public final double fuelCost;
        public final double netProfit;
        public final double netPerUnit;

        public ProfitResult(double totalDistance, double grossPerUnit, double fuelCost, double netProfit, double netPerUnit) {
            this.totalDistance = totalDistance;
            this.grossPerUnit = grossPerUnit;
            this.fuelCost = fuelCost;
            this.netProfit = netProfit;
            this.netPerUnit = netPerUnit;
        }
    }

    /**
     * For Imperial: distance in miles, efficiency in MPG, fuelPrice in $/gallon.
     * For Metric: distance in km, efficiency in km/L (or L/100km converted), fuelPrice in currency/L.
     */
    public static ProfitResult calculateProfit(double grossPay, double loadedDist, double deadheadDist, double efficiency, double fuelPrice) {
        double total = Math.max(1.0, loadedDist + Math.max(0.0, deadheadDist));
        double safeEff = Math.max(0.5, efficiency);
        double fuelUnits = total / safeEff;
        double fuelCost = fuelUnits * Math.max(0.0, fuelPrice);
        double netProfit = grossPay - fuelCost;
        return new ProfitResult(total, grossPay / total, fuelCost, netProfit, netProfit / total);
    }
}

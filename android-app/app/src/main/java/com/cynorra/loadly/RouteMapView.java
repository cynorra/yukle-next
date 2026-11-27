package com.cynorra.loadly;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.DashPathEffect;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PathMeasure;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Shader;
import android.os.Handler;
import android.os.Looper;
import android.util.AttributeSet;
import android.util.LruCache;
import android.view.View;
import android.view.animation.DecelerateInterpolator;

import androidx.annotation.Nullable;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 2027+ Minimalist Dark Route Map Preview (zero API keys, zero WebView bloat).
 * - Compact mode (feed cards): 0ms pure-Canvas dark radar grid + true geographic bearing Bezier arc + distance badge.
 * - Detail mode (load detail): Async CartoDB Dark Matter map tiles behind an animated glowing Bezier route + city pills.
 */
public class RouteMapView extends View {

    private static final LruCache<String, Bitmap> TILE_CACHE = new LruCache<String, Bitmap>(48) {
        @Override
        protected int sizeOf(String key, Bitmap value) {
            return 1;
        }
    };
    private static final ExecutorService TILE_EXEC = Executors.newFixedThreadPool(3);
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    private boolean compactMode = false;
    private boolean imperial = false;
    private String originLabel = "";
    private String destLabel = "";
    private String tapHintLabel = "";
    private GeoCoordResolver.LatLng origin;
    private GeoCoordResolver.LatLng dest;

    private float routeProgress = 1f;
    private ValueAnimator routeAnimator;

    // Tile state for detail mode
    private int tileZoom = 4;
    private double centerMercX = 0;
    private double centerMercY = 0;
    private final Map<String, Bitmap> activeTiles = new HashMap<>();
    private String currentRouteKey = "";

    private final Paint bgPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint gridPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint tilePaint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
    private final Paint vignettePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint routeGlowPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint routeLinePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint routeDashPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint originHaloPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint originDotPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint destHaloPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint destDotPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint dotCorePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint pillBgPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint pillStrokePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint pillTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint subTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint borderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);

    private final Path fullPath = new Path();
    private final Path animatedPath = new Path();
    private final Path clipPath = new Path();
    private final RectF boundsRect = new RectF();
    private final RectF pillRect = new RectF();
    private final Rect tileDestRect = new Rect();

    public RouteMapView(Context context) {
        super(context);
        init();
    }

    public RouteMapView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public RouteMapView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        float dp = getResources().getDisplayMetrics().density;

        bgPaint.setColor(0xFF0B0F16);

        gridPaint.setColor(0x16FFFFFF);
        gridPaint.setStrokeWidth(1f * dp);
        gridPaint.setStyle(Paint.Style.STROKE);

        routeGlowPaint.setStyle(Paint.Style.STROKE);
        routeGlowPaint.setStrokeCap(Paint.Cap.ROUND);
        routeGlowPaint.setColor(0x38FB720A);

        routeLinePaint.setStyle(Paint.Style.STROKE);
        routeLinePaint.setStrokeCap(Paint.Cap.ROUND);

        routeDashPaint.setStyle(Paint.Style.STROKE);
        routeDashPaint.setStrokeCap(Paint.Cap.ROUND);
        routeDashPaint.setColor(0x55FFFFFF);
        routeDashPaint.setPathEffect(new DashPathEffect(new float[]{4f * dp, 6f * dp}, 0));

        originHaloPaint.setColor(0x3834D399);
        originDotPaint.setColor(0xFF34D399);

        destHaloPaint.setColor(0x40FB720A);
        destDotPaint.setColor(0xFFFB720A);

        dotCorePaint.setColor(0xFFFFFFFF);

        pillBgPaint.setColor(0xCC0D1117);
        pillStrokePaint.setStyle(Paint.Style.STROKE);
        pillStrokePaint.setStrokeWidth(1f * dp);
        pillStrokePaint.setColor(0x28FFFFFF);

        pillTextPaint.setColor(0xFFF3F4F6);
        pillTextPaint.setFakeBoldText(true);

        subTextPaint.setColor(0x99CBD5E1);

        borderPaint.setStyle(Paint.Style.STROKE);
        borderPaint.setStrokeWidth(1f * dp);
        borderPaint.setColor(0x22FFFFFF);
    }

    public void setCompactMode(boolean compact) {
        this.compactMode = compact;
        invalidate();
    }

    public void setTapHintLabel(String label) {
        this.tapHintLabel = label != null ? label : "";
        invalidate();
    }

    /** Bind route cities; resolves coordinates automatically and animates the arc in detail mode. */
    public void setRoute(String originCity, String originCountry,
                         String destCity, String destCountry,
                         boolean isImperial) {
        this.originLabel = shortCity(originCity);
        this.destLabel = shortCity(destCity);
        this.imperial = isImperial;

        String newKey = (originCity + "|" + destCity + "|" + compactMode);
        boolean routeChanged = !newKey.equals(currentRouteKey);
        currentRouteKey = newKey;

        GeoCoordResolver.LatLng fastO = GeoCoordResolver.lookupFast(originCity, originCountry);
        GeoCoordResolver.LatLng fastD = GeoCoordResolver.lookupFast(destCity, destCountry);
        this.origin = fastO;
        this.dest = fastD;

        if (routeChanged) {
            activeTiles.clear();
            if (!compactMode) {
                animateRouteArc();
            } else {
                routeProgress = 1f;
            }
        }

        if (!compactMode && origin != null && dest != null) {
            loadDarkMapTiles(newKey);
        }
        invalidate();

        // Async refine via Geocoder if an obscure city wasn't in our 250+ hub table
        GeoCoordResolver.resolveAsync(getContext(), originCity, originCountry, destCity, destCountry, (o, d) -> {
            if (!newKey.equals(currentRouteKey)) return;
            boolean changed = (this.origin == null || this.dest == null
                    || Math.abs(this.origin.lat - o.lat) > 0.05
                    || Math.abs(this.dest.lat - d.lat) > 0.05);
            this.origin = o;
            this.dest = d;
            if (changed) {
                if (!compactMode) loadDarkMapTiles(newKey);
                invalidate();
            }
        });
    }

    private void animateRouteArc() {
        if (routeAnimator != null) routeAnimator.cancel();
        routeProgress = 0f;
        routeAnimator = ValueAnimator.ofFloat(0f, 1f);
        routeAnimator.setDuration(680);
        routeAnimator.setInterpolator(new DecelerateInterpolator(2.0f));
        routeAnimator.addUpdateListener(anim -> {
            routeProgress = (float) anim.getAnimatedValue();
            invalidate();
        });
        routeAnimator.start();
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (!compactMode && origin != null && dest != null && w > 0 && h > 0) {
            loadDarkMapTiles(currentRouteKey);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        if (routeAnimator != null) routeAnimator.cancel();
        super.onDetachedFromWindow();
    }

    // --- Web Mercator helpers ---
    private static double lngToMercX(double lng, int zoom) {
        return ((lng + 180.0) / 360.0) * (1 << zoom);
    }

    private static double latToMercY(double lat, int zoom) {
        double clamped = Math.max(-82.0, Math.min(82.0, lat));
        double rad = Math.toRadians(clamped);
        return (1.0 - Math.log(Math.tan(rad) + 1.0 / Math.cos(rad)) / Math.PI) / 2.0 * (1 << zoom);
    }

    private void computeMapCamera(int w, int h) {
        if (origin == null || dest == null || w <= 0 || h <= 0) return;
        double padX = w * 0.56;
        double padY = h * 0.52;
        int bestZ = 2;
        for (int z = 8; z >= 2; z--) {
            double dx = Math.abs(lngToMercX(dest.lng, z) - lngToMercX(origin.lng, z)) * 256.0;
            double dy = Math.abs(latToMercY(dest.lat, z) - latToMercY(origin.lat, z)) * 256.0;
            if (dx <= padX && dy <= padY) {
                bestZ = z;
                break;
            }
        }
        tileZoom = bestZ;
        centerMercX = (lngToMercX(origin.lng, tileZoom) + lngToMercX(dest.lng, tileZoom)) * 0.5;
        centerMercY = (latToMercY(origin.lat, tileZoom) + latToMercY(dest.lat, tileZoom)) * 0.5;
    }

    private void loadDarkMapTiles(String routeKey) {
        int w = getWidth();
        int h = getHeight();
        if (w <= 0 || h <= 0 || origin == null || dest == null) return;
        computeMapCamera(w, h);

        int z = tileZoom;
        int maxTile = (1 << z) - 1;
        int minTx = (int) Math.floor(centerMercX - (w / 512.0)) - 1;
        int maxTx = (int) Math.floor(centerMercX + (w / 512.0)) + 1;
        int minTy = Math.max(0, (int) Math.floor(centerMercY - (h / 512.0)) - 1);
        int maxTy = Math.min(maxTile, (int) Math.floor(centerMercY + (h / 512.0)) + 1);

        for (int tx = minTx; tx <= maxTx; tx++) {
            int wrappedX = ((tx % (1 << z)) + (1 << z)) % (1 << z);
            for (int ty = minTy; ty <= maxTy; ty++) {
                String tileKey = z + "/" + wrappedX + "/" + ty;
                Bitmap cached = TILE_CACHE.get(tileKey);
                if (cached != null) {
                    activeTiles.put(tileKey, cached);
                    continue;
                }
                final int fz = z, fx = wrappedX, fy = ty;
                TILE_EXEC.execute(() -> {
                    Bitmap bmp = fetchTile(fz, fx, fy);
                    if (bmp != null) {
                        TILE_CACHE.put(tileKey, bmp);
                        MAIN.post(() -> {
                            if (routeKey.equals(currentRouteKey)) {
                                activeTiles.put(tileKey, bmp);
                                invalidate();
                            }
                        });
                    }
                });
            }
        }
    }

    private static Bitmap fetchTile(int z, int x, int y) {
        HttpURLConnection conn = null;
        try {
            String sub = ((x + y) % 2 == 0) ? "a" : "b";
            URL url = new URL("https://" + sub + ".basemaps.cartocdn.com/dark_all/" + z + "/" + x + "/" + y + ".png");
            conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(4500);
            conn.setReadTimeout(4500);
            conn.setRequestProperty("User-Agent", "Loadly-Android/2.3");
            if (conn.getResponseCode() == 200) {
                try (InputStream is = conn.getInputStream()) {
                    return BitmapFactory.decodeStream(is);
                }
            }
        } catch (Exception ignored) {
        } finally {
            if (conn != null) conn.disconnect();
        }
        return null;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int w = getWidth();
        int h = getHeight();
        if (w <= 0 || h <= 0) return;

        float dp = getResources().getDisplayMetrics().density;
        float radius = (compactMode ? 14f : 18f) * dp;

        boundsRect.set(0, 0, w, h);
        clipPath.reset();
        clipPath.addRoundRect(boundsRect, radius, radius, Path.Direction.CW);

        int save = canvas.save();
        canvas.clipPath(clipPath);

        // 1. Base obsidian surface
        canvas.drawRect(boundsRect, bgPaint);

        // 2. Real dark map tiles (detail mode) or sleek cartographic grid
        boolean drewTiles = false;
        if (!compactMode && origin != null && dest != null) {
            computeMapCamera(w, h);
            int z = tileZoom;
            int maxTile = (1 << z) - 1;
            int minTx = (int) Math.floor(centerMercX - (w / 512.0)) - 1;
            int maxTx = (int) Math.floor(centerMercX + (w / 512.0)) + 1;
            int minTy = Math.max(0, (int) Math.floor(centerMercY - (h / 512.0)) - 1);
            int maxTy = Math.min(maxTile, (int) Math.floor(centerMercY + (h / 512.0)) + 1);
            for (int tx = minTx; tx <= maxTx; tx++) {
                int wrappedX = ((tx % (1 << z)) + (1 << z)) % (1 << z);
                for (int ty = minTy; ty <= maxTy; ty++) {
                    Bitmap bmp = activeTiles.get(z + "/" + wrappedX + "/" + ty);
                    if (bmp != null) {
                        int left = (int) Math.round(w * 0.5 + (tx - centerMercX) * 256.0);
                        int top = (int) Math.round(h * 0.5 + (ty - centerMercY) * 256.0);
                        tileDestRect.set(left, top, left + 256, top + 256);
                        canvas.drawBitmap(bmp, null, tileDestRect, tilePaint);
                        drewTiles = true;
                    }
                }
            }
        }

        if (!drewTiles) {
            // Subtle dark cartographic gridlines (instant 0ms look, never blank)
            float step = (compactMode ? 22f : 28f) * dp;
            for (float x = step; x < w; x += step) {
                canvas.drawLine(x, 0, x, h, gridPaint);
            }
            for (float y = step; y < h; y += step) {
                canvas.drawLine(0, y, w, y, gridPaint);
            }
        } else {
            // Subtle dark vignette so the glowing route pops over bright city labels
            vignettePaint.setShader(new LinearGradient(0, 0, 0, h,
                    0x440B0F16, 0x660B0F16, Shader.TileMode.CLAMP));
            canvas.drawRect(boundsRect, vignettePaint);
        }

        // 3. Project origin & destination points onto canvas
        float ox, oy, dx, dy;
        if (!compactMode && origin != null && dest != null) {
            ox = (float) (w * 0.5 + (lngToMercX(origin.lng, tileZoom) - centerMercX) * 256.0);
            oy = (float) (h * 0.5 + (latToMercY(origin.lat, tileZoom) - centerMercY) * 256.0);
            dx = (float) (w * 0.5 + (lngToMercX(dest.lng, tileZoom) - centerMercX) * 256.0);
            dy = (float) (h * 0.5 + (latToMercY(dest.lat, tileZoom) - centerMercY) * 256.0);
            // Clamp safely inside margins
            float mX = 24f * dp;
            float mY = 26f * dp;
            ox = Math.max(mX, Math.min(w - mX, ox));
            oy = Math.max(mY, Math.min(h - mY, oy));
            dx = Math.max(mX, Math.min(w - mX, dx));
            dy = Math.max(mY, Math.min(h - mY, dy));
        } else if (origin != null && dest != null) {
            // Compact mini-map: preserve true geographic bearing inside padded box
            double dLng = dest.lng - origin.lng;
            double dLat = -(dest.lat - origin.lat); // screen Y goes down
            double len = Math.hypot(dLng, dLat);
            float padX = 18f * dp;
            float padTop = 14f * dp;
            float padBottom = 24f * dp; // space for distance pill
            float cx = w * 0.5f;
            float cy = padTop + (h - padTop - padBottom) * 0.5f;
            float rx = (w - padX * 2f) * 0.45f;
            float ry = (h - padTop - padBottom) * 0.42f;
            if (len > 0.01) {
                float ux = (float) (dLng / len);
                float uy = (float) (dLat / len);
                ox = cx - ux * rx;
                oy = cy - uy * ry;
                dx = cx + ux * rx;
                dy = cy + uy * ry;
            } else {
                ox = padX;
                oy = cy + ry * 0.4f;
                dx = w - padX;
                dy = cy - ry * 0.4f;
            }
        } else {
            // Fallback stylized diagonal corridor when coordinates unknown
            float padX = (compactMode ? 18f : 36f) * dp;
            float padY = (compactMode ? 20f : 38f) * dp;
            ox = padX;
            oy = h - padY - (compactMode ? 12f * dp : 0f);
            dx = w - padX;
            dy = padY;
        }

        // 4. Curved Bezier route arc
        float midX = (ox + dx) * 0.5f;
        float midY = (oy + dy) * 0.5f;
        float vx = dx - ox;
        float vy = dy - oy;
        float distPx = (float) Math.hypot(vx, vy);
        float curveLift = Math.min(distPx * 0.24f, (compactMode ? 16f : 34f) * dp);
        // Curve gently upward
        float ctrlX = midX - (vy / Math.max(distPx, 1f)) * (vy < 0 ? -curveLift : curveLift) * 0.35f;
        float ctrlY = midY - curveLift;

        fullPath.reset();
        fullPath.moveTo(ox, oy);
        fullPath.quadTo(ctrlX, ctrlY, dx, dy);

        Path drawPath = fullPath;
        if (routeProgress < 0.99f) {
            animatedPath.reset();
            PathMeasure pm = new PathMeasure(fullPath, false);
            pm.getSegment(0, pm.getLength() * routeProgress, animatedPath, true);
            drawPath = animatedPath;
        }

        routeGlowPaint.setStrokeWidth((compactMode ? 5.5f : 8.5f) * dp);
        canvas.drawPath(drawPath, routeGlowPaint);

        routeLinePaint.setStrokeWidth((compactMode ? 2.2f : 3.0f) * dp);
        routeLinePaint.setShader(new LinearGradient(ox, oy, dx, dy,
                0xFF34D399, 0xFFFB720A, Shader.TileMode.CLAMP));
        canvas.drawPath(drawPath, routeLinePaint);

        if (!compactMode) {
            routeDashPaint.setStrokeWidth(1.2f * dp);
            canvas.drawPath(drawPath, routeDashPaint);
        }

        // 5. Origin (Emerald) & Destination (Amber/Orange) markers
        float haloR = (compactMode ? 6.5f : 10f) * dp;
        float dotR = (compactMode ? 3.5f : 5.2f) * dp;
        float coreR = (compactMode ? 1.4f : 2.1f) * dp;

        canvas.drawCircle(ox, oy, haloR, originHaloPaint);
        canvas.drawCircle(ox, oy, dotR, originDotPaint);
        canvas.drawCircle(ox, oy, coreR, dotCorePaint);

        if (routeProgress > 0.85f) {
            canvas.drawCircle(dx, dy, haloR, destHaloPaint);
            canvas.drawCircle(dx, dy, dotR, destDotPaint);
            canvas.drawCircle(dx, dy, coreR, dotCorePaint);
        }

        // 6. Labels & Pills
        if (compactMode) {
            // Single clean distance pill at bottom center of mini-map
            String distText = GeoCoordResolver.formatDistanceShort(origin, dest, imperial);
            if (!distText.isEmpty()) {
                pillTextPaint.setTextSize(9.5f * dp);
                float tw = pillTextPaint.measureText(distText);
                float ph = 16f * dp;
                float pw = tw + 10f * dp;
                float left = (w - pw) * 0.5f;
                float top = h - ph - 5f * dp;
                pillRect.set(left, top, left + pw, top + ph);
                canvas.drawRoundRect(pillRect, 8f * dp, 8f * dp, pillBgPaint);
                canvas.drawRoundRect(pillRect, 8f * dp, 8f * dp, pillStrokePaint);
                Paint.FontMetrics fm = pillTextPaint.getFontMetrics();
                float textY = pillRect.centerY() - (fm.ascent + fm.descent) * 0.5f;
                canvas.drawText(distText, left + 5f * dp, textY, pillTextPaint);
            }
        } else {
            // Top-left floating glass distance & ETA pill
            String distEta = GeoCoordResolver.formatDistanceAndEta(origin, dest, imperial);
            if (!distEta.isEmpty()) {
                drawPill(canvas, distEta, 10f * dp, 10f * dp, 11f * dp, 0xFFF3F4F6, dp);
            }
            // Bottom-right "Open Maps ↗" subtle pill
            if (!tapHintLabel.isEmpty()) {
                pillTextPaint.setTextSize(10.5f * dp);
                float tw = pillTextPaint.measureText(tapHintLabel);
                float pw = tw + 16f * dp;
                float ph = 24f * dp;
                drawPill(canvas, tapHintLabel, w - pw - 10f * dp, h - ph - 10f * dp, 10.5f * dp, 0xFFFB720A, dp);
            }
            // Subtle OSM/CARTO attribution when real tiles are displayed
            if (drewTiles) {
                subTextPaint.setTextSize(8.5f * dp);
                canvas.drawText("© OSM · CARTO", 10f * dp, h - 8f * dp, subTextPaint);
            }
            // City micro-labels near pins (only if pins are far enough apart to avoid overlap)
            if (distPx > 65f * dp) {
                drawPinLabel(canvas, originLabel, ox, oy, w, h, 0xFF34D399, dp);
                drawPinLabel(canvas, destLabel, dx, dy, w, h, 0xFFFB720A, dp);
            }
        }

        canvas.restoreToCount(save);

        // Outer glass border
        canvas.drawRoundRect(boundsRect, radius, radius, borderPaint);
    }

    private void drawPill(Canvas canvas, String text, float left, float top, float textSizePx, int textColor, float dp) {
        pillTextPaint.setTextSize(textSizePx);
        pillTextPaint.setColor(textColor);
        float tw = pillTextPaint.measureText(text);
        float ph = 24f * dp;
        float pw = tw + 16f * dp;
        pillRect.set(left, top, left + pw, top + ph);
        canvas.drawRoundRect(pillRect, 12f * dp, 12f * dp, pillBgPaint);
        canvas.drawRoundRect(pillRect, 12f * dp, 12f * dp, pillStrokePaint);
        Paint.FontMetrics fm = pillTextPaint.getFontMetrics();
        float textY = pillRect.centerY() - (fm.ascent + fm.descent) * 0.5f;
        canvas.drawText(text, left + 8f * dp, textY, pillTextPaint);
    }

    private void drawPinLabel(Canvas canvas, String label, float px, float py, int w, int h, int accentColor, float dp) {
        if (label == null || label.isEmpty()) return;
        pillTextPaint.setTextSize(10f * dp);
        pillTextPaint.setColor(accentColor);
        float tw = pillTextPaint.measureText(label);
        float pw = tw + 10f * dp;
        float ph = 18f * dp;
        float left = Math.max(8f * dp, Math.min(w - pw - 8f * dp, px - pw * 0.5f));
        float top = (py > h * 0.55f) ? (py - ph - 10f * dp) : (py + 10f * dp);
        top = Math.max(36f * dp, Math.min(h - ph - 36f * dp, top));
        pillRect.set(left, top, left + pw, top + ph);
        canvas.drawRoundRect(pillRect, 9f * dp, 9f * dp, pillBgPaint);
        Paint.FontMetrics fm = pillTextPaint.getFontMetrics();
        float textY = pillRect.centerY() - (fm.ascent + fm.descent) * 0.5f;
        canvas.drawText(label, left + 5f * dp, textY, pillTextPaint);
    }

    private static String shortCity(String city) {
        if (city == null) return "";
        String t = city.trim();
        int idx = t.indexOf(',');
        if (idx > 0) t = t.substring(0, idx).trim();
        return t.length() > 14 ? t.substring(0, 13) + "…" : t;
    }
}

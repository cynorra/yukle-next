package com.cynorra.loadly;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessaging;

import java.util.Locale;

/**
 * Creates the notification channel here, not in MainActivity - Application.onCreate()
 * runs before any component, including FcmService when a push arrives while the app
 * has never been opened yet. Notification channels are otherwise silently dropped on
 * API 26+ if the channel doesn't exist when the notification is posted.
 *
 * Also owns "new load" push topic subscription state. Pushes are targeted per-country
 * (topic "new_loads_{ISO2}") rather than one global broadcast - MainActivity's existing
 * GPS location tracking calls updateCountryTopic() whenever the detected country changes
 * (see the website's /api/webhooks/fcm-batch route for the sender side, which groups
 * newly-scraped loads by country the same way). A user-facing toggle (MarketplaceActivity)
 * calls setPushEnabled() to opt out without needing to touch system notification settings.
 */
public class LoadlyApplication extends Application {

    private static final String TAG = "LoadlyApplication";
    public static final String NOTIFICATION_CHANNEL_ID = "loadly_notifications";

    private static final String PREFS_NAME = "loadly_prefs";
    private static final String KEY_PUSH_ENABLED = "push_enabled";
    private static final String KEY_SUBSCRIBED_COUNTRY = "subscribed_country_iso2";
    private static final String TOPIC_PREFIX = "new_loads_";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    NOTIFICATION_CHANNEL_ID,
                    getString(R.string.notification_channel_name),
                    NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription(getString(R.string.notification_channel_desc));
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    public static boolean isPushEnabled(Context context) {
        return prefs(context).getBoolean(KEY_PUSH_ENABLED, true);
    }

    /** Called by the MarketplaceActivity notification-bell toggle. */
    public static void setPushEnabled(Context context, boolean enabled) {
        prefs(context).edit().putBoolean(KEY_PUSH_ENABLED, enabled).apply();
        String country = prefs(context).getString(KEY_SUBSCRIBED_COUNTRY, null);
        if (country == null) return;
        if (enabled) {
            subscribeToTopic(context, country);
        } else {
            unsubscribeFromTopic(context, country);
        }
    }

    /**
     * Called by MainActivity whenever GPS+Geocoder detects the device is in a new
     * country. No-ops if it's the same country as last time (cheap to call on every
     * location update) or if push is currently disabled (still records the country so
     * re-enabling later resubscribes to the right one, just skips the network calls).
     */
    public static void updateCountryTopic(Context context, String iso2CountryCode) {
        if (iso2CountryCode == null || iso2CountryCode.isEmpty()) return;
        String normalized = iso2CountryCode.toUpperCase(Locale.US);
        String previous = prefs(context).getString(KEY_SUBSCRIBED_COUNTRY, null);
        if (normalized.equals(previous)) return;

        if (isPushEnabled(context)) {
            if (previous != null) unsubscribeFromTopic(context, previous);
            subscribeToTopic(context, normalized);
        }
        prefs(context).edit().putString(KEY_SUBSCRIBED_COUNTRY, normalized).apply();
    }

    /**
     * FCM topic subscriptions belong to the current registration token - they do NOT
     * carry over when the token rotates (rare, but FcmService.onNewToken calls this to
     * be safe rather than silently losing the subscription until the country changes).
     */
    public static void resubscribeCurrentTopicIfNeeded(Context context) {
        String country = prefs(context).getString(KEY_SUBSCRIBED_COUNTRY, null);
        if (country != null && isPushEnabled(context)) {
            subscribeToTopic(context, country);
        }
    }

    private static void subscribeToTopic(Context context, String iso2) {
        String topic = TOPIC_PREFIX + iso2;
        FirebaseMessaging.getInstance().subscribeToTopic(topic)
                .addOnCompleteListener(task -> Log.d(TAG,
                        task.isSuccessful() ? "Subscribed to " + topic : "Failed to subscribe to " + topic));
    }

    private static void unsubscribeFromTopic(Context context, String iso2) {
        String topic = TOPIC_PREFIX + iso2;
        FirebaseMessaging.getInstance().unsubscribeFromTopic(topic)
                .addOnCompleteListener(task -> Log.d(TAG,
                        task.isSuccessful() ? "Unsubscribed from " + topic : "Failed to unsubscribe from " + topic));
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }
}

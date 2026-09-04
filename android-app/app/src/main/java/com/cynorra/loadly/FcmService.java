package com.cynorra.loadly;

import android.Manifest;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

/**
 * Receives Firebase Cloud Messaging pushes, including while the app is fully closed
 * (the OS starts this service on its own). Nothing server-side sends these yet - that
 * needs a backend/website change to trigger a send when a new load is posted, out of
 * scope here. Wired up so pushes can be tested right now from the Firebase Console's
 * "Send test message" tool, targeted at this device's token (logged in onNewToken).
 */
public class FcmService extends FirebaseMessagingService {

    private static final String TAG = "FcmService";

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        Log.d(TAG, "FCM registration token: " + token);
        // Topic subscriptions are per-token - a rotated token starts with none of them,
        // so the previously-subscribed country topic must be re-subscribed under it.
        LoadlyApplication.resubscribeCurrentTopicIfNeeded(this);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);

        String title = null;
        String body = null;
        RemoteMessage.Notification notification = message.getNotification();
        if (notification != null) {
            title = notification.getTitle();
            body = notification.getBody();
        }
        if (title == null) title = message.getData().get("title");
        if (body == null) body = message.getData().get("body");
        if (title == null) title = getString(R.string.app_name);
        if (body == null) body = "";

        String targetUrl = message.getData().get("target_url");
        showNotification(title, body, targetUrl);
    }

    private void showNotification(String title, String body, String targetUrl) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
        }

        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        if (targetUrl != null && !targetUrl.isEmpty()) {
            intent.putExtra("target_url", targetUrl);
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, LoadlyApplication.NOTIFICATION_CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent);

        NotificationManagerCompat.from(this).notify((int) System.currentTimeMillis(), builder.build());
    }
}

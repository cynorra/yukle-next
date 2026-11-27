package com.cynorra.loadly;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.play.core.review.ReviewInfo;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;
import com.google.android.gms.tasks.Task;

import java.util.Locale;

/**
 * Play-policy-compliant smart In-App Review prompt with permanent suppression
 * once rated or dismissed ("Never ask again").
 */
public final class ReviewPromptHelper {
    private static final String PREFS = "app_review_prompt_v1";
    private static final String KEY_LAUNCHES = "launches";
    private static final String KEY_HAS_RATED = "has_rated";
    private static final String KEY_NEVER_ASK = "never_ask";
    private static final String KEY_PROMPT_COUNT = "prompt_count";
    private static final String KEY_LAST_PROMPT_AT = "last_prompt_at";

    private static final int MIN_LAUNCHES = 3;
    private static final int MAX_PROMPTS = 2;
    private static final long COOLDOWN_MS = 21L * 24L * 60L * 60L * 1000L;

    private ReviewPromptHelper() {}

    public static void maybePrompt(Activity activity) {
        if (activity == null) return;
        SharedPreferences prefs = activity.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        int launches = prefs.getInt(KEY_LAUNCHES, 0) + 1;
        prefs.edit().putInt(KEY_LAUNCHES, launches).apply();

        if (prefs.getBoolean(KEY_HAS_RATED, false) || prefs.getBoolean(KEY_NEVER_ASK, false)) {
            return;
        }
        if (launches < MIN_LAUNCHES) return;
        if (prefs.getInt(KEY_PROMPT_COUNT, 0) >= MAX_PROMPTS) return;

        long last = prefs.getLong(KEY_LAST_PROMPT_AT, 0L);
        if (last > 0L && (System.currentTimeMillis() - last) < COOLDOWN_MS) {
            return;
        }

        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (activity.isFinishing() || activity.isDestroyed()) return;
            showPromptDialog(activity, prefs);
        }, 6000L);
    }

    public static void markRated(Context context) {
        if (context == null) return;
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .edit()
                .putBoolean(KEY_HAS_RATED, true)
                .putLong(KEY_LAST_PROMPT_AT, System.currentTimeMillis())
                .apply();
    }

    private static void showPromptDialog(Activity activity, SharedPreferences prefs) {
        boolean isTr = "tr".equalsIgnoreCase(Locale.getDefault().getLanguage());
        String title = isTr ? "Uygulamamızı Beğeniyor musunuz?" : "Enjoying Loadly?";
        String message = isTr
                ? "Loadly'yi geliştirmemize destek olmak için Google Play'de değerlendirmenizi paylaşabilirsiniz."
                : "Your review on Google Play helps us improve Loadly for everyone.";
        String rateBtn = isTr ? "Değerlendir" : "Rate App";
        String laterBtn = isTr ? "Şimdi Değil" : "Not Now";
        String neverBtn = isTr ? "Bir Daha Gösterme" : "Don't Ask Again";

        new MaterialAlertDialogBuilder(activity)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton(rateBtn, (d, w) -> {
                    markRated(activity);
                    launchInAppReviewOrStore(activity);
                })
                .setNegativeButton(laterBtn, (d, w) -> {
                    int count = prefs.getInt(KEY_PROMPT_COUNT, 0) + 1;
                    prefs.edit()
                            .putInt(KEY_PROMPT_COUNT, count)
                            .putLong(KEY_LAST_PROMPT_AT, System.currentTimeMillis())
                            .apply();
                })
                .setNeutralButton(neverBtn, (d, w) -> {
                    prefs.edit()
                            .putBoolean(KEY_NEVER_ASK, true)
                            .putLong(KEY_LAST_PROMPT_AT, System.currentTimeMillis())
                            .apply();
                })
                .setCancelable(true)
                .show();
    }

    public static void launchInAppReviewOrStore(Activity activity) {
        if (activity == null || activity.isFinishing()) return;
        try {
            ReviewManager manager = ReviewManagerFactory.create(activity);
            Task<ReviewInfo> request = manager.requestReviewFlow();
            request.addOnCompleteListener(task -> {
                if (task.isSuccessful() && !activity.isFinishing() && !activity.isDestroyed()) {
                    manager.launchReviewFlow(activity, task.getResult());
                } else {
                    openPlayStore(activity);
                }
            });
        } catch (Exception e) {
            openPlayStore(activity);
        }
    }

    private static void openPlayStore(Activity activity) {
        String pkg = activity.getPackageName();
        try {
            activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + pkg)));
        } catch (Exception e) {
            try {
                activity.startActivity(new Intent(Intent.ACTION_VIEW,
                        Uri.parse("https://play.google.com/store/apps/details?id=" + pkg)));
            } catch (Exception ignored) {
            }
        }
    }
}

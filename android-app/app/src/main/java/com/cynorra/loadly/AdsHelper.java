package com.cynorra.loadly;

import android.app.Activity;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowMetrics;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdLoader;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.nativead.NativeAdOptions;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.util.concurrent.atomic.AtomicBoolean;

// Shared GDPR/UK consent gate for every AdMob banner in the app (MarketplaceActivity,
// LoadDetailActivity, MovingActivity).
// Uses Universal Anchored Adaptive Banner sizing and silent-fail UI behavior.
final class AdsHelper {

    private static final long RETRY_DELAY_MS = 25_000L;
    private static final Handler MAIN_HANDLER = new Handler(Looper.getMainLooper());
    private static volatile boolean adsInitialized = false;

    private AdsHelper() {}

    static final String NATIVE_AD_UNIT_ID = "ca-app-pub-4674211063760769/7217177166";

    interface OnAdsReady {
        void onAdsReady();
    }

    interface OnNativeAdLoaded {
        void onLoaded(NativeAd nativeAd);
    }

    static void loadNativeFeedAd(Activity activity, OnNativeAdLoaded callback) {
        if (activity == null || callback == null || activity.isFinishing() || activity.isDestroyed()) return;
        AdLoader loader = new AdLoader.Builder(activity, NATIVE_AD_UNIT_ID)
                .forNativeAd(nativeAd -> {
                    if (activity.isFinishing() || activity.isDestroyed()) {
                        nativeAd.destroy();
                        return;
                    }
                    MAIN_HANDLER.post(() -> callback.onLoaded(nativeAd));
                })
                .withAdListener(new AdListener() {
                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        // Silent fail: feed simply shows pure load cards with zero empty space
                    }
                })
                .withNativeAdOptions(new NativeAdOptions.Builder()
                        .setRequestCustomMuteThisAd(true)
                        .build())
                .build();
        loader.loadAd(new AdRequest.Builder().build());
    }

    static void requestConsentThenLoadBanner(Activity activity, AdView placeholder, OnAdsReady onAdsReady) {
        if (placeholder == null || activity == null) return;

        // Replace XML fixed BANNER with a programmatic Anchored Adaptive AdView.
        // Calling setAdSize() on an XML-inflated AdView that already has app:adSize="BANNER"
        // is ignored or throws in Google Mobile Ads SDK.
        final AdView adView = replaceWithAdaptiveAdView(activity, placeholder);

        // Keep the AdView INVISIBLE (not GONE) with 1px height until loaded so the SDK can
        // measure the view and dispatch the ad request without taking visible layout space.
        adView.setAlpha(0f);

        adView.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                super.onAdLoaded();
                adView.setAlpha(1f);
                adView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError error) {
                super.onAdFailedToLoad(error);
                adView.setAlpha(0f);
                MAIN_HANDLER.postDelayed(() -> {
                    if (!activity.isFinishing() && !activity.isDestroyed()) {
                        adView.loadAd(new AdRequest.Builder().build());
                    }
                }, RETRY_DELAY_MS);
            }
        });

        ConsentInformation consentInformation = UserMessagingPlatform.getConsentInformation(activity);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
        AtomicBoolean bannerLoaded = new AtomicBoolean(false);

        Runnable triggerLoad = () -> {
            if (activity.isFinishing() || activity.isDestroyed()) return;
            if (bannerLoaded.compareAndSet(false, true)) {
                loadBanner(activity, adView, onAdsReady);
            }
        };

        consentInformation.requestConsentInfoUpdate(activity, params, () -> {
            if (activity.isFinishing() || activity.isDestroyed()) return;
            UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity, formError -> triggerLoad.run());
        }, formError -> triggerLoad.run());

        if (consentInformation.canRequestAds()) {
            triggerLoad.run();
        } else {
            // Fallback timeout in case UMP network request hangs
            MAIN_HANDLER.postDelayed(triggerLoad, 4000L);
        }
    }

    private static AdView replaceWithAdaptiveAdView(Activity activity, AdView placeholder) {
        try {
            if (!(placeholder.getParent() instanceof ViewGroup)) {
                return placeholder;
            }
            String unitId = placeholder.getAdUnitId();
            if (unitId == null || unitId.isEmpty()) {
                return placeholder;
            }
            ViewGroup parent = (ViewGroup) placeholder.getParent();
            int index = parent.indexOfChild(placeholder);
            ViewGroup.LayoutParams params = placeholder.getLayoutParams();
            int id = placeholder.getId();

            AdView adaptive = new AdView(activity);
            adaptive.setId(id);
            adaptive.setAdUnitId(unitId);
            adaptive.setAdSize(computeAdaptiveSize(activity));

            parent.removeViewAt(index);
            placeholder.destroy();
            parent.addView(adaptive, index, params);
            return adaptive;
        } catch (Exception ignored) {
            return placeholder;
        }
    }

    private static AdSize computeAdaptiveSize(Activity activity) {
        int adWidthPixels;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowMetrics windowMetrics = activity.getWindowManager().getCurrentWindowMetrics();
            adWidthPixels = windowMetrics.getBounds().width();
        } else {
            DisplayMetrics displayMetrics = new DisplayMetrics();
            activity.getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
            adWidthPixels = displayMetrics.widthPixels;
        }

        float density = activity.getResources().getDisplayMetrics().density;
        int adWidth = (int) (adWidthPixels / density);
        if (adWidth <= 0) adWidth = 320;

        return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, adWidth);
    }

    private static void loadBanner(Activity activity, AdView adView, OnAdsReady onAdsReady) {
        if (!adsInitialized) {
            adsInitialized = true;
            MobileAds.initialize(activity.getApplicationContext(), initializationStatus -> {
                MAIN_HANDLER.post(() -> {
                    if (!activity.isFinishing() && !activity.isDestroyed() && adView != null) {
                        adView.loadAd(new AdRequest.Builder().build());
                    }
                    if (onAdsReady != null) {
                        onAdsReady.onAdsReady();
                    }
                });
            });
        } else {
            if (adView != null) {
                adView.loadAd(new AdRequest.Builder().build());
            }
            if (onAdsReady != null) {
                onAdsReady.onAdsReady();
            }
        }
    }
}

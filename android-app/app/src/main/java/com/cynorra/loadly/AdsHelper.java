package com.cynorra.loadly;

import android.app.Activity;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.WindowMetrics;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.util.concurrent.atomic.AtomicBoolean;

// Shared GDPR/UK consent gate for every AdMob banner in the app (MainActivity,
// MarketplaceActivity, LoadDetailActivity).
// Uses Universal Anchored Adaptive Banner sizing and silent-fail UI behavior (View.GONE on error).
final class AdsHelper {

    private AdsHelper() {}

    interface OnAdsReady {
        void onAdsReady();
    }

    static void requestConsentThenLoadBanner(Activity activity, AdView adView, OnAdsReady onAdsReady) {
        if (adView == null) return;

        // Start hidden until ad is confirmed loaded - prevents empty box or UI shift (Silent Fail)
        adView.setVisibility(View.GONE);

        applyAdaptiveBannerSize(activity, adView);

        adView.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                super.onAdLoaded();
                adView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError error) {
                super.onAdFailedToLoad(error);
                // Silent fail: keep View.GONE so no empty space, layout jump or broken box shows
                adView.setVisibility(View.GONE);
            }
        });

        ConsentInformation consentInformation = UserMessagingPlatform.getConsentInformation(activity);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();
        AtomicBoolean bannerLoaded = new AtomicBoolean(false);

        consentInformation.requestConsentInfoUpdate(activity, params, () ->
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity, formError -> {
                    if (consentInformation.canRequestAds() && bannerLoaded.compareAndSet(false, true)) {
                        loadBanner(activity, adView, onAdsReady);
                    }
                }), formError -> {
            if (consentInformation.canRequestAds() && bannerLoaded.compareAndSet(false, true)) {
                loadBanner(activity, adView, onAdsReady);
            }
        });

        if (consentInformation.canRequestAds() && bannerLoaded.compareAndSet(false, true)) {
            loadBanner(activity, adView, onAdsReady);
        }
    }

    private static void applyAdaptiveBannerSize(Activity activity, AdView adView) {
        try {
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

            AdSize adaptiveSize = AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, adWidth);
            adView.setAdSize(adaptiveSize);
        } catch (Exception ignored) {
            // Falls back to XML configured size if any error occurs
        }
    }

    private static boolean adsInitialized = false;

    private static void loadBanner(Activity activity, AdView adView, OnAdsReady onAdsReady) {
        if (!adsInitialized) {
            adsInitialized = true;
            MobileAds.initialize(activity, initializationStatus -> {});
        }
        if (adView != null) {
            adView.loadAd(new AdRequest.Builder().build());
        }
        if (onAdsReady != null) {
            onAdsReady.onAdsReady();
        }
    }
}

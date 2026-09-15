package com.cynorra.loadly;

import android.app.Activity;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

// Shared GDPR/UK consent gate for every AdMob banner in the app (MainActivity,
// MarketplaceActivity, LoadDetailActivity) - each screen calls its own consent
// info update rather than trusting an earlier screen already resolved it, since
// a user can reach Marketplace/LoadDetail without MainActivity's flow having
// finished (e.g. tapping the marketplace FAB the instant the app launches).
// AdMob policy requires consent be gathered before requesting ads for EEA/UK
// users - a consent message must also be configured in the AdMob console's
// Privacy & messaging section for the form to actually appear; this code is a
// no-op everywhere else (canRequestAds() is simply already true immediately).
final class AdsHelper {

    private AdsHelper() {}

    interface OnAdsReady {
        void onAdsReady();
    }

    static void requestConsentThenLoadBanner(Activity activity, AdView adView, OnAdsReady onAdsReady) {
        ConsentInformation consentInformation = UserMessagingPlatform.getConsentInformation(activity);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();

        consentInformation.requestConsentInfoUpdate(activity, params, () ->
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity, formError -> {
                    if (consentInformation.canRequestAds()) {
                        loadBanner(activity, adView, onAdsReady);
                    }
                }), formError -> {
            if (consentInformation.canRequestAds()) {
                loadBanner(activity, adView, onAdsReady);
            }
        });

        if (consentInformation.canRequestAds()) {
            loadBanner(activity, adView, onAdsReady);
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

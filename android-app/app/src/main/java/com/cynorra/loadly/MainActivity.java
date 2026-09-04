package com.cynorra.loadly;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private static final String APP_HOST = "loadlyapp.com";

    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ProgressBar progressBar;
    private LinearLayout errorLayout;
    private AdView adView;
    private ValueCallback<Uri[]> pendingFileCallback;

    private LocationManager locationManager;
    private String lastDetectedCity = "";

    private final ActivityResultLauncher<String> fileChooserLauncher =
            registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
                if (pendingFileCallback != null) {
                    pendingFileCallback.onReceiveValue(uri != null ? new Uri[]{uri} : null);
                    pendingFileCallback = null;
                }
            });

    private final ActivityResultLauncher<String[]> permissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), permissions -> {
                Boolean fineLoc = permissions.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false);
                Boolean coarseLoc = permissions.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false);
                if (Boolean.TRUE.equals(fineLoc) || Boolean.TRUE.equals(coarseLoc)) {
                    initLocationTracking();
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize Google AdMob SDK
        MobileAds.initialize(this, initializationStatus -> {});

        webView = findViewById(R.id.webView);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        progressBar = findViewById(R.id.progressBar);
        errorLayout = findViewById(R.id.errorLayout);
        adView = findViewById(R.id.adView);

        // Load AdMob Banner Ad
        AdRequest adRequest = new AdRequest.Builder().build();
        if (adView != null) {
            adView.loadAd(adRequest);
        }

        setupSwipeRefresh();
        setupWebView();
        setupBackPressed();

        findViewById(R.id.marketplaceFab).setOnClickListener(v -> {
            startActivity(new Intent(MainActivity.this, MarketplaceActivity.class));
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
        });

        // Request Location and Notification Permissions
        requestAppPermissions();

        webView.loadUrl(resolveStartUrl(getIntent()));

        findViewById(R.id.retryButton).setOnClickListener(v -> {
            errorLayout.setVisibility(View.GONE);
            webView.reload();
        });
    }

    private void requestAppPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissionLauncher.launch(new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.POST_NOTIFICATIONS
            });
        } else {
            permissionLauncher.launch(new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
            });
        }
    }

    @SuppressLint("MissingPermission")
    private void initLocationTracking() {
        try {
            locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
            if (locationManager == null) return;

            boolean isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
            boolean isNetEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

            LocationListener locationListener = new LocationListener() {
                @Override
                public void onLocationChanged(@NonNull Location location) {
                    processUserLocation(location.getLatitude(), location.getLongitude());
                }

                @Override public void onProviderEnabled(@NonNull String provider) {}
                @Override public void onProviderDisabled(@NonNull String provider) {}
            };

            if (isGpsEnabled) {
                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 300000, 1000, locationListener);
                Location lastLoc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                if (lastLoc != null) processUserLocation(lastLoc.getLatitude(), lastLoc.getLongitude());
            } else if (isNetEnabled) {
                locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 300000, 1000, locationListener);
                Location lastLoc = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                if (lastLoc != null) processUserLocation(lastLoc.getLatitude(), lastLoc.getLongitude());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void processUserLocation(double lat, double lng) {
        try {
            Geocoder geocoder = new Geocoder(this, Locale.getDefault());
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                geocoder.getFromLocation(lat, lng, 1, new Geocoder.GeocodeListener() {
                    @Override
                    public void onGeocode(@NonNull List<Address> addresses) {
                        if (!addresses.isEmpty()) {
                            String city = addresses.get(0).getAdminArea();
                            if (city == null || city.isEmpty()) city = addresses.get(0).getLocality();
                            handleCityDetected(city);
                            LoadlyApplication.updateCountryTopic(MainActivity.this, addresses.get(0).getCountryCode());
                        }
                    }
                });
            } else {
                List<Address> addresses = geocoder.getFromLocation(lat, lng, 1);
                if (addresses != null && !addresses.isEmpty()) {
                    String city = addresses.get(0).getAdminArea();
                    if (city == null || city.isEmpty()) city = addresses.get(0).getLocality();
                    handleCityDetected(city);
                    LoadlyApplication.updateCountryTopic(MainActivity.this, addresses.get(0).getCountryCode());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleCityDetected(String city) {
        if (city == null || city.isEmpty()) return;
        if (!city.equalsIgnoreCase(lastDetectedCity)) {
            lastDetectedCity = city;
            // This only confirms the device's city changed, not that any new load actually
            // exists there - the wording must not claim a fact this check hasn't verified.
            sendNativeNotification(
                    getString(R.string.location_updated_title, city),
                    getString(R.string.location_updated_body),
                    "https://loadlyapp.com/marketplace"
            );
        }
    }

    public void sendNativeNotification(String title, String message, String targetUrl) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
        }

        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        intent.putExtra("target_url", targetUrl);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, LoadlyApplication.NOTIFICATION_CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        notificationManager.notify((int) System.currentTimeMillis(), builder.build());
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setColorSchemeResources(R.color.primary_accent);
        swipeRefreshLayout.setOnRefreshListener(() -> webView.reload());

        // Prevent Pull-to-Refresh triggering while scrolling down inside the WebView
        webView.getViewTreeObserver().addOnScrollChangedListener(() -> {
            if (webView.getScrollY() == 0) {
                swipeRefreshLayout.setEnabled(true);
            } else {
                swipeRefreshLayout.setEnabled(false);
            }
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        // Enable Hardware Acceleration layer for 60fps smooth CSS/Framer Motion transitions
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setSupportMultipleWindows(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        webSettings.setGeolocationEnabled(true);

        // Append custom UserAgent so web application recognizes official Loadly Android Native App
        String defaultUserAgent = webSettings.getUserAgentString();
        webSettings.setUserAgentString(defaultUserAgent + " LoadlyApp/1.0 (Android)");

        // Cookie management for user sessions / authentication
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        // Add JavaScript Bridge for Web-to-Native notification & location interaction
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUrl(request.getUrl());
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                errorLayout.setVisibility(View.GONE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    webView.setVisibility(View.GONE);
                    errorLayout.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.GONE);
                    swipeRefreshLayout.setRefreshing(false);
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            // Handles target="_blank", window.open() popups (Google Auth, sharing, etc.)
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                WebView transportWebView = new WebView(MainActivity.this);
                transportWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request) {
                        openExternally(request.getUrl());
                        return true;
                    }
                });
                WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(transportWebView);
                resultMsg.sendToTarget();
                return true;
            }

            // Handles file uploads <input type="file">
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (pendingFileCallback != null) {
                    pendingFileCallback.onReceiveValue(null);
                }
                pendingFileCallback = filePathCallback;
                try {
                    String[] acceptTypes = fileChooserParams.getAcceptTypes();
                    String mimeType = (acceptTypes != null && acceptTypes.length > 0 && !acceptTypes[0].isEmpty())
                            ? acceptTypes[0] : "*/*";
                    fileChooserLauncher.launch(mimeType);
                } catch (Exception e) {
                    pendingFileCallback = null;
                    return false;
                }
                return true;
            }
        });

        // External handling for downloadable files
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) ->
                openExternally(Uri.parse(url)));
    }

    public class AndroidBridge {
        @JavascriptInterface
        public void showNotification(String title, String message, String targetUrl) {
            runOnUiThread(() -> sendNativeNotification(title, message, targetUrl));
        }

        @JavascriptInterface
        public void triggerLocationCheck(String city) {
            runOnUiThread(() -> handleCityDetected(city));
        }
    }

    private boolean handleUrl(Uri uri) {
        String scheme = uri.getScheme();
        if ("mailto".equals(scheme)) {
            safeStart(new Intent(Intent.ACTION_SENDTO, uri));
            return true;
        }
        if ("tel".equals(scheme)) {
            safeStart(new Intent(Intent.ACTION_DIAL, uri));
            return true;
        }
        if ("http".equals(scheme) || "https".equals(scheme)) {
            String host = uri.getHost();
            boolean isOwnSite = host != null && (host.equals(APP_HOST) || host.endsWith("." + APP_HOST));
            if (isOwnSite) {
                if (openMarketplaceNatively(uri)) {
                    return true;
                }
                return false; // keep inside app
            }
            openExternally(uri); // external links, Google OAuth, social media
            return true;
        }
        safeStart(new Intent(Intent.ACTION_VIEW, uri));
        return true;
    }

    // The website's own /marketplace route only exists for the site's own
    // logged-in users and isn't part of its public-facing navigation (kept
    // hidden from search engines/AdSense on purpose); rather than depend on
    // that route always being buildable, links to it (from the dashboard,
    // messages, favorites, notifications, etc.) are intercepted here and
    // shown with this app's own native listings/detail screens, which read
    // loads directly from Supabase and don't depend on any website page.
    private boolean openMarketplaceNatively(Uri uri) {
        List<String> segments = uri.getPathSegments();
        if (segments.size() < 2 || !"marketplace".equals(segments.get(1))) {
            return false;
        }
        if (segments.size() >= 3 && !segments.get(2).isEmpty()) {
            Intent intent = new Intent(this, LoadDetailActivity.class);
            intent.putExtra(LoadDetailActivity.EXTRA_LOAD_ID, segments.get(2));
            startActivity(intent);
        } else {
            startActivity(new Intent(this, MarketplaceActivity.class));
        }
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
        return true;
    }

    private void openExternally(Uri uri) {
        try {
            new CustomTabsIntent.Builder().build().launchUrl(this, uri);
        } catch (ActivityNotFoundException e) {
            safeStart(new Intent(Intent.ACTION_VIEW, uri));
        }
    }

    private void safeStart(Intent intent) {
        try {
            startActivity(intent);
        } catch (ActivityNotFoundException ignored) {
        }
    }

    private void setupBackPressed() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    finish();
                }
            }
        });
    }

    @Override
    protected void onNewIntent(@NonNull Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (webView != null) {
            webView.loadUrl(resolveStartUrl(intent));
        }
    }

    // A cold/new launch can arrive two ways: a local notification tap (carries a
    // "target_url" string extra) or a real https://loadlyapp.com link via App Links
    // (carries a Uri in getData(), e.g. the OAuth redirect after Google sign-in) -
    // without this, App Links would bring the user into the app but always dump
    // them on the homepage instead of wherever the link actually pointed to.
    private String resolveStartUrl(Intent intent) {
        if (intent == null) return "https://loadlyapp.com/";
        String targetUrl = intent.getStringExtra("target_url");
        if (targetUrl != null && !targetUrl.isEmpty()) {
            return targetUrl;
        }
        Uri data = intent.getData();
        if (data != null && "https".equals(data.getScheme())) {
            return data.toString();
        }
        return "https://loadlyapp.com/";
    }

    @Override
    protected void onPause() {
        if (adView != null) adView.pause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (adView != null) adView.resume();
    }

    @Override
    protected void onDestroy() {
        if (adView != null) adView.destroy();
        super.onDestroy();
    }
}

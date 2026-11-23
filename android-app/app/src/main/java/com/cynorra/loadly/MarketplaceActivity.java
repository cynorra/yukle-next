package com.cynorra.loadly;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import jp.wasabeef.recyclerview.adapters.SlideInBottomAnimationAdapter;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.cynorra.loadly.model.Load;
import com.facebook.shimmer.ShimmerFrameLayout;
import com.cynorra.loadly.network.SupabaseClient;
import com.google.android.gms.ads.AdView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Native listings screen, independent of the web app's WebView content.
 * Reads directly from Supabase (same anonymous/public 'loads' query the
 * website's own marketplace page runs) so the app can show active loads
 * regardless of what routes exist on loadlyapp.com.
 */
public class MarketplaceActivity extends AppCompatActivity {

    private static final int PAGE_SIZE = 50;

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ShimmerFrameLayout shimmerLayout;
    private LinearLayout emptyLayout;
    private TextView emptyText;
    private final SupabaseClient client = new SupabaseClient();
    private LoadAdapter adapter;
    private AdView adView;

    private EditText originFilterInput;
    private EditText destinationFilterInput;
    private Spinner truckTypeFilterSpinner;
    private EditText maxWeightFilterInput;
    // Ordered truck-type keys backing the spinner, index-aligned with its display
    // labels; index 0 is always the synthetic "all types" entry (null key = no filter).
    private final List<String> truckTypeKeys = new ArrayList<>();

    // Scope: true = only loads from the browse country (device country or the user's pick),
    // false = worldwide.
    private boolean nearbyScope = true;
    private TextView tabNearby;
    private TextView tabGlobal;
    private TextView countryChip;

    // Deep-link / notification target: https://loadlyapp.com/<locale>/marketplace[/<id>]
    private static final String APP_HOST = "loadlyapp.com";

    private LocationManager locationManager;
    private LocationListener locationListener;
    private String lastDetectedCity = "";
    private final java.util.concurrent.ExecutorService backgroundExecutor = java.util.concurrent.Executors.newSingleThreadExecutor();

    private final ActivityResultLauncher<String[]> permissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), permissions -> {
                if (Boolean.TRUE.equals(permissions.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false))
                        || Boolean.TRUE.equals(permissions.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false))) {
                    initLocationTracking();
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_marketplace);

        findViewById(R.id.movingButton).setOnClickListener(v -> {
            startActivity(new Intent(this, MovingActivity.class));
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
        });

        ImageButton notificationToggleButton = findViewById(R.id.notificationToggleButton);
        updateNotificationToggleIcon(notificationToggleButton);
        notificationToggleButton.setOnClickListener(v -> {
            boolean nowEnabled = !LoadlyApplication.isPushEnabled(this);
            LoadlyApplication.setPushEnabled(this, nowEnabled);
            updateNotificationToggleIcon(notificationToggleButton);
            Toast.makeText(this, nowEnabled
                    ? R.string.notifications_enabled_toast
                    : R.string.notifications_disabled_toast, Toast.LENGTH_SHORT).show();
        });

        recyclerView = findViewById(R.id.recyclerView);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        shimmerLayout = findViewById(R.id.shimmerLayout);
        emptyLayout = findViewById(R.id.emptyLayout);
        emptyText = findViewById(R.id.emptyText);

        adapter = new LoadAdapter(this::openDetail);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        SlideInBottomAnimationAdapter animatedAdapter = new SlideInBottomAnimationAdapter(adapter);
        animatedAdapter.setDuration(380);
        animatedAdapter.setFirstOnly(true); // animate the first screenful, then scroll normally
        recyclerView.setAdapter(animatedAdapter);

        swipeRefreshLayout.setColorSchemeResources(R.color.primary_accent);
        swipeRefreshLayout.setOnRefreshListener(this::fetchLoads);

        Button retryButton = findViewById(R.id.retryButton);
        retryButton.setOnClickListener(v -> fetchLoads());

        adView = findViewById(R.id.adView);
        AdsHelper.requestConsentThenLoadBanner(this, adView, null);

        setupFilterBar();
        setupScopeBar();
        requestAppPermissions();
        if (!handleIncomingIntent(getIntent())) fetchLoads();
    }

    @Override
    protected void onNewIntent(@NonNull Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    // Notification taps may carry target_url; App Links carry the URI in getData(). Only
    // /marketplace/<id> opens a detail screen, everything else just shows the listings.
    private boolean handleIncomingIntent(Intent intent) {
        if (intent == null) return false;
        String target = intent.getStringExtra("target_url");
        Uri data = target != null && target.startsWith("http") ? Uri.parse(target) : intent.getData();
        if (data == null || data.getHost() == null || !data.getHost().endsWith(APP_HOST)) return false;
        List<String> segments = data.getPathSegments();
        for (int i = 0; i + 1 < segments.size(); i++) {
            if ("marketplace".equals(segments.get(i)) && !segments.get(i + 1).isEmpty()) {
                Intent detail = new Intent(this, LoadDetailActivity.class);
                detail.putExtra(LoadDetailActivity.EXTRA_LOAD_ID, segments.get(i + 1));
                startActivity(detail);
                overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
                return true;
            }
        }
        return false;
    }

    private void setupScopeBar() {
        tabNearby = findViewById(R.id.tabNearby);
        tabGlobal = findViewById(R.id.tabGlobal);
        countryChip = findViewById(R.id.countryChip);
        tabNearby.setOnClickListener(v -> setScope(true));
        tabGlobal.setOnClickListener(v -> setScope(false));
        countryChip.setOnClickListener(v -> showCountryPicker());
        refreshScopeUi();
    }

    private void setScope(boolean nearby) {
        if (nearbyScope == nearby) return;
        nearbyScope = nearby;
        refreshScopeUi();
        fetchLoads();
    }

    private void refreshScopeUi() {
        styleSegment(tabNearby, nearbyScope);
        styleSegment(tabGlobal, !nearbyScope);
        countryChip.setText(getString(R.string.scope_country_format, Countries.displayName(LoadlyApplication.getBrowseCountry(this))));
    }

    /** Selected segment = solid brand pill with dark text; idle = quiet translucent pill. */
    private void styleSegment(TextView tab, boolean selected) {
        tab.setBackgroundResource(selected ? R.drawable.bg_segment_selected : R.drawable.bg_segment_idle);
        tab.setTextColor(getResources().getColor(selected ? R.color.black : R.color.text_muted, getTheme()));
    }

    private void showCountryPicker() {
        final List<String> codes = Countries.allCodes();
        String[] names = new String[codes.size()];
        for (int i = 0; i < names.length; i++) names[i] = Countries.displayName(codes.get(i));
        new AlertDialog.Builder(this)
                .setTitle(R.string.scope_pick_country)
                .setItems(names, (d, which) -> {
                    LoadlyApplication.setBrowseCountry(this, codes.get(which));
                    nearbyScope = true;
                    refreshScopeUi();
                    fetchLoads();
                })
                .show();
    }

    private void setupFilterBar() {
        originFilterInput = findViewById(R.id.originFilterInput);
        destinationFilterInput = findViewById(R.id.destinationFilterInput);
        truckTypeFilterSpinner = findViewById(R.id.truckTypeFilterSpinner);
        maxWeightFilterInput = findViewById(R.id.maxWeightFilterInput);

        Map<String, String> labels = TruckTypes.loadLabels(this);
        List<String> spinnerLabels = new ArrayList<>();
        spinnerLabels.add(getString(R.string.filter_truck_type_all));
        truckTypeKeys.add(null);
        for (Map.Entry<String, String> entry : labels.entrySet()) {
            if (!spinnerLabels.contains(entry.getValue())) {
                truckTypeKeys.add(entry.getKey());
                spinnerLabels.add(entry.getValue());
            }
        }
        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(this, R.layout.item_filter_spinner, spinnerLabels);
        spinnerAdapter.setDropDownViewResource(R.layout.item_filter_spinner_dropdown);
        truckTypeFilterSpinner.setAdapter(spinnerAdapter);

        View.OnClickListener applyFilters = v -> fetchLoads();
        findViewById(R.id.applyFilterButton).setOnClickListener(applyFilters);
        maxWeightFilterInput.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                fetchLoads();
                return true;
            }
            return false;
        });
        originFilterInput.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                fetchLoads();
                return true;
            }
            return false;
        });
        destinationFilterInput.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                fetchLoads();
                return true;
            }
            return false;
        });

        findViewById(R.id.clearFilterButton).setOnClickListener(v -> {
            originFilterInput.setText("");
            destinationFilterInput.setText("");
            maxWeightFilterInput.setText("");
            truckTypeFilterSpinner.setSelection(0);
            fetchLoads();
        });
    }

    private SupabaseClient.Filter currentFilter() {
        SupabaseClient.Filter filter = new SupabaseClient.Filter();
        if (nearbyScope) filter.originCountryCode = LoadlyApplication.getBrowseCountry(this);
        filter.originCity = originFilterInput.getText().toString();
        filter.destinationCity = destinationFilterInput.getText().toString();
        filter.truckType = truckTypeKeys.get(truckTypeFilterSpinner.getSelectedItemPosition());
        String weightText = maxWeightFilterInput.getText().toString().trim();
        if (!weightText.isEmpty()) {
            try {
                filter.maxWeightTon = Double.parseDouble(weightText);
            } catch (NumberFormatException ignored) {
                // Leave maxWeightTon unset rather than reject the input - a stray
                // non-numeric character just means "no weight filter applied".
            }
        }
        return filter;
    }

    private boolean hasActiveFilter() {
        SupabaseClient.Filter filter = currentFilter();
        return (filter.originCity != null && !filter.originCity.trim().isEmpty())
                || (filter.destinationCity != null && !filter.destinationCity.trim().isEmpty())
                || filter.truckType != null
                || filter.maxWeightTon != null;
    }

    @Override
    protected void onPause() {
        if (adView != null) adView.pause();
        stopLocationUpdates();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (adView != null) adView.resume();
        resumeLocationTrackingIfActive();
    }

    @Override
    protected void onDestroy() {
        if (adView != null) adView.destroy();
        stopLocationUpdates();
        super.onDestroy();
    }

    private void updateNotificationToggleIcon(ImageButton button) {
        boolean enabled = LoadlyApplication.isPushEnabled(this);
        button.setImageResource(enabled ? R.drawable.ic_bell : R.drawable.ic_bell_off);
    }

    private void openDetail(Load load) {
        Intent intent = new Intent(this, LoadDetailActivity.class);
        intent.putExtra(LoadDetailActivity.EXTRA_LOAD_ID, load.id);
        startActivity(intent);
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }

    private void fetchLoads() {
        emptyLayout.setVisibility(View.GONE);
        if (adapter.isEmpty()) {
            shimmerLayout.setVisibility(View.VISIBLE);
            shimmerLayout.startShimmer();
        }
        boolean filtered = hasActiveFilter();
        client.fetchActiveLoads(PAGE_SIZE, currentFilter(), new SupabaseClient.ListCallback() {
            @Override
            public void onSuccess(List<Load> result) {
                hideShimmer();
                swipeRefreshLayout.setRefreshing(false);
                // Only reorder the unfiltered "browse everything" view - once the user has
                // typed their own origin/destination, that explicit intent must win as-is.
                adapter.submitList(filtered ? result : prioritizeByDetectedCity(result));
                // A successful (non-error) fetch with zero rows is a genuine "no listings"
                // state, distinct from a failed fetch below - never conflate the two texts.
                // Also distinct from a plain empty marketplace: zero rows because of the
                // user's own filters needs its own wording, not "no listings right now".
                emptyText.setText(filtered ? R.string.filter_empty_results : R.string.marketplace_empty);
                emptyLayout.setVisibility(adapter.isEmpty() ? View.VISIBLE : View.GONE);
                recyclerView.setVisibility(adapter.isEmpty() ? View.GONE : View.VISIBLE);
            }

            @Override
            public void onError(String message) {
                hideShimmer();
                swipeRefreshLayout.setRefreshing(false);
                if (adapter.isEmpty()) {
                    // onError only ever fires for a failed request (network/server issue) -
                    // it never means "no listings", so it must not reuse that wording.
                    emptyText.setText(R.string.marketplace_load_error);
                    emptyLayout.setVisibility(View.VISIBLE);
                    recyclerView.setVisibility(View.GONE);
                }
            }
        });
    }

    // Loads only carry origin_city/origin_country text, not coordinates, so this can't
    // be a real distance sort - it's a stable partition: loads whose origin_city matches
    // the device's last geocoded city (MainActivity's location flow, persisted in
    // LoadlyApplication) move to the front, everything else keeps its original
    // (recency) order behind them. A no-op whenever location was never resolved.
    private List<Load> prioritizeByDetectedCity(List<Load> loads) {
        String city = LoadlyApplication.getLastCity(this);
        if (city == null || city.isEmpty()) return loads;

        List<Load> nearby = new ArrayList<>();
        List<Load> rest = new ArrayList<>();
        for (Load load : loads) {
            if (load.originCity != null && load.originCity.equalsIgnoreCase(city)) {
                nearby.add(load);
            } else {
                rest.add(load);
            }
        }
        if (nearby.isEmpty()) return loads;
        nearby.addAll(rest);
        return nearby;
    }

    // ---- Device location (permission is requested; without it the user picks a country) ----

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

    private void stopLocationUpdates() {
        if (locationManager != null && locationListener != null) {
            locationManager.removeUpdates(locationListener);
        }
    }

    @SuppressLint("MissingPermission")
    private void initLocationTracking() {
        try {
            locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
            if (locationManager == null) return;
            locationListener = new LocationListener() {
                @Override
                public void onLocationChanged(@NonNull Location location) {
                    processUserLocation(location.getLatitude(), location.getLongitude());
                }

                // Required on API < 30, where this method is abstract
                @Override public void onStatusChanged(String provider, int status, Bundle extras) {}
                @Override public void onProviderEnabled(@NonNull String provider) {}
                @Override public void onProviderDisabled(@NonNull String provider) {}
            };
            String provider = pickProvider();
            if (provider == null) return;
            locationManager.requestLocationUpdates(provider, 300000, 1000, locationListener);
            Location last = locationManager.getLastKnownLocation(provider);
            if (last != null) processUserLocation(last.getLatitude(), last.getLongitude());
        } catch (Exception ignored) {
        }
    }

    private String pickProvider() {
        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) return LocationManager.GPS_PROVIDER;
        if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) return LocationManager.NETWORK_PROVIDER;
        return null;
    }

    // Re-subscribes only if tracking was already active before this pause/resume cycle.
    @SuppressLint("MissingPermission")
    private void resumeLocationTrackingIfActive() {
        if (locationManager == null || locationListener == null) return;
        boolean hasLoc = ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        if (!hasLoc) return;
        String provider = pickProvider();
        if (provider != null) locationManager.requestLocationUpdates(provider, 300000, 1000, locationListener);
    }

    private void processUserLocation(double lat, double lng) {
        backgroundExecutor.execute(() -> {
            try {
                Geocoder geocoder = new Geocoder(this, Locale.getDefault());
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    geocoder.getFromLocation(lat, lng, 1, addresses -> {
                        if (!addresses.isEmpty()) handleAddressResult(addresses.get(0));
                    });
                } else {
                    List<Address> addresses = geocoder.getFromLocation(lat, lng, 1);
                    if (addresses != null && !addresses.isEmpty()) handleAddressResult(addresses.get(0));
                }
            } catch (Exception ignored) {
                // Geocoder backend may be unavailable (emulator/offline); user can still pick a country.
            }
        });
    }

    private void handleAddressResult(Address address) {
        String city = address.getLocality();
        if (city == null || city.isEmpty()) city = address.getAdminArea();
        final String detectedCity = city;
        final String countryCode = address.getCountryCode();
        runOnUiThread(() -> {
            if (isFinishing()) return;
            if (detectedCity != null && !detectedCity.isEmpty()) {
                LoadlyApplication.updateLastCity(this, detectedCity);
                if (!detectedCity.equalsIgnoreCase(lastDetectedCity)) {
                    lastDetectedCity = detectedCity;
                    sendNativeNotification(getString(R.string.location_updated_title, detectedCity),
                            getString(R.string.location_updated_body));
                }
            }
            if (countryCode != null && !countryCode.isEmpty()) {
                String before = LoadlyApplication.getBrowseCountry(this);
                LoadlyApplication.updateCountryTopic(this, countryCode);
                refreshScopeUi();
                if (nearbyScope && !before.equalsIgnoreCase(LoadlyApplication.getBrowseCountry(this))) fetchLoads();
            }
        });
    }

    private void sendNativeNotification(String title, String message) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        Intent intent = new Intent(this, MarketplaceActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, LoadlyApplication.NOTIFICATION_CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent);
        NotificationManagerCompat.from(this).notify((int) System.currentTimeMillis(), builder.build());
    }

    private void hideShimmer() {
        shimmerLayout.stopShimmer();
        shimmerLayout.setVisibility(View.GONE);
    }
}

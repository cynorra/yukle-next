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

    // Scope: 0 = Nearby, 1 = Global, 2 = Saved (offline bookmarks)
    private int scopeMode = 0;
    private boolean nearbyScope = true;
    private TextView tabNearby;
    private TextView tabGlobal;
    private TextView tabSaved;
    private TextView countryChip;
    private TextView sortButton;
    private TextView laneAlertsButton;
    private TextView postLoadButton;

    private String currentSort = "newest";
    private int currentOffset = 0;
    private boolean isLoadingMore = false;
    private boolean hasMorePages = true;

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

        View.OnClickListener openMoving = v -> {
            startActivity(new Intent(this, MovingActivity.class));
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
        };
        findViewById(R.id.movingButton).setOnClickListener(openMoving);
        View movingBanner = findViewById(R.id.movingHeroBanner);
        if (movingBanner != null) movingBanner.setOnClickListener(openMoving);

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
        AdsHelper.requestConsentThenLoadBanner(this, adView, () ->
                AdsHelper.loadNativeFeedAd(this, nativeAd -> adapter.setNativeAd(nativeAd)));

        setupFilterBar();
        setupScopeBar();
        setupProToolsBar();
        setupInfiniteScroll();
        requestAppPermissions();
        if (!handleIncomingIntent(getIntent())) fetchLoads();
        ReviewPromptHelper.maybePrompt(this);
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
        tabSaved = findViewById(R.id.tabSaved);
        countryChip = findViewById(R.id.countryChip);
        tabNearby.setOnClickListener(v -> setScopeMode(0));
        tabGlobal.setOnClickListener(v -> setScopeMode(1));
        if (tabSaved != null) tabSaved.setOnClickListener(v -> setScopeMode(2));
        countryChip.setOnClickListener(v -> showCountryPicker());
        refreshScopeUi();
    }

    private void setScopeMode(int mode) {
        if (scopeMode == mode) return;
        scopeMode = mode;
        nearbyScope = (mode == 0);
        refreshScopeUi();
        fetchLoads();
    }

    private void refreshScopeUi() {
        styleSegment(tabNearby, scopeMode == 0);
        styleSegment(tabGlobal, scopeMode == 1);
        if (tabSaved != null) {
            int savedCount = LoadPreferences.getBookmarkedLoads(this).size();
            tabSaved.setText(savedCount > 0 ? "★ " + savedCount : "★");
            styleSegment(tabSaved, scopeMode == 2);
        }
        countryChip.setText(getString(R.string.scope_country_format, Countries.displayName(LoadlyApplication.getBrowseCountry(this))));
    }

    private void setupProToolsBar() {
        sortButton = findViewById(R.id.sortButton);
        laneAlertsButton = findViewById(R.id.laneAlertsButton);
        postLoadButton = findViewById(R.id.postLoadButton);
        if (sortButton != null) {
            UiMotion.attachSpringPress(sortButton);
            sortButton.setOnClickListener(v -> showSortDialog());
        }
        if (laneAlertsButton != null) {
            UiMotion.attachSpringPress(laneAlertsButton);
            refreshLaneAlertsBadge();
            laneAlertsButton.setOnClickListener(v -> showLaneAlertsDialog());
        }
        if (postLoadButton != null) {
            UiMotion.attachSpringPress(postLoadButton);
            postLoadButton.setOnClickListener(v -> showPostLoadDialog());
        }
    }

    private void refreshLaneAlertsBadge() {
        if (laneAlertsButton == null) return;
        int n = LoadPreferences.getLaneAlerts(this).size();
        laneAlertsButton.setText(n > 0
                ? getString(R.string.pro_lane_alerts_count, n)
                : getString(R.string.pro_lane_alerts));
    }

    private void showSortDialog() {
        String[] labels = new String[]{
                getString(R.string.pro_sort_opt_newest),
                getString(R.string.pro_sort_opt_pay),
                getString(R.string.pro_sort_opt_weight)
        };
        String[] keys = {"newest", "price_desc", "weight_asc"};
        new AlertDialog.Builder(this)
                .setTitle(R.string.pro_sort_title)
                .setItems(labels, (d, which) -> {
                    currentSort = keys[which];
                    if (sortButton != null) sortButton.setText("⇅ " + labels[which]);
                    fetchLoads();
                })
                .show();
    }

    private void showLaneAlertsDialog() {
        List<LoadPreferences.LaneAlert> alerts = LoadPreferences.getLaneAlerts(this);
        String[] items = new String[alerts.size() + 1];
        for (int i = 0; i < alerts.size(); i++) {
            items[i] = "✕  " + alerts.get(i).label();
        }
        items[alerts.size()] = getString(R.string.pro_lane_alert_add);
        new AlertDialog.Builder(this)
                .setTitle(R.string.pro_lane_alerts_title)
                .setItems(items, (d, which) -> {
                    if (which == alerts.size()) {
                        showCreateLaneAlertDialog();
                    } else {
                        LoadPreferences.removeLaneAlert(this, which);
                        refreshLaneAlertsBadge();
                        Toast.makeText(this, R.string.pro_lane_alert_removed, Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton(android.R.string.cancel, null)
                .show();
    }

    private void showCreateLaneAlertDialog() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        int pad = (int) (20 * getResources().getDisplayMetrics().density);
        box.setPadding(pad, pad / 2, pad, 0);

        EditText originIn = new EditText(this);
        originIn.setHint(R.string.pro_lane_alert_origin_hint);
        originIn.setText(originFilterInput.getText().toString().trim());
        box.addView(originIn);

        EditText destIn = new EditText(this);
        destIn.setHint(R.string.pro_lane_alert_dest_hint);
        destIn.setText(destinationFilterInput.getText().toString().trim());
        box.addView(destIn);

        EditText minPayIn = new EditText(this);
        minPayIn.setHint(R.string.pro_lane_alert_min_pay_hint);
        minPayIn.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
        box.addView(minPayIn);

        new AlertDialog.Builder(this)
                .setTitle(R.string.pro_lane_alert_new_title)
                .setView(box)
                .setPositiveButton(R.string.pro_lane_alert_save, (d, w) -> {
                    String o = originIn.getText().toString().trim();
                    String dst = destIn.getText().toString().trim();
                    if (o.isEmpty() && dst.isEmpty()) {
                        Toast.makeText(this, R.string.pro_lane_alert_empty_err, Toast.LENGTH_SHORT).show();
                        return;
                    }
                    double minP = 0;
                    try {
                        String ms = minPayIn.getText().toString().trim();
                        if (!ms.isEmpty()) minP = Double.parseDouble(ms);
                    } catch (Exception ignored) {}
                    LoadPreferences.addLaneAlert(this, new LoadPreferences.LaneAlert(o, dst, minP));
                    refreshLaneAlertsBadge();
                    Toast.makeText(this, R.string.pro_lane_alert_saved, Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton(android.R.string.cancel, null)
                .show();
    }

    private void showPostLoadDialog() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        int pad = (int) (20 * getResources().getDisplayMetrics().density);
        box.setPadding(pad, pad / 2, pad, 0);

        EditText origIn = new EditText(this);
        origIn.setHint(R.string.pro_post_origin_hint);
        box.addView(origIn);

        EditText destIn = new EditText(this);
        destIn.setHint(R.string.pro_post_dest_hint);
        box.addView(destIn);

        EditText weightIn = new EditText(this);
        weightIn.setHint(R.string.pro_post_weight_hint);
        weightIn.setInputType(android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL);
        box.addView(weightIn);

        EditText priceIn = new EditText(this);
        priceIn.setHint(R.string.pro_post_rate_hint);
        priceIn.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
        box.addView(priceIn);

        EditText contactIn = new EditText(this);
        contactIn.setHint(R.string.pro_post_contact_hint);
        box.addView(contactIn);

        new AlertDialog.Builder(this)
                .setTitle(R.string.pro_post_load_title)
                .setView(box)
                .setPositiveButton(R.string.pro_post_publish, (d, w) -> {
                    String o = origIn.getText().toString().trim();
                    String dst = destIn.getText().toString().trim();
                    String desc = contactIn.getText().toString().trim();
                    if (o.isEmpty() || dst.isEmpty() || desc.isEmpty()) {
                        Toast.makeText(this, R.string.pro_post_fill_required, Toast.LENGTH_SHORT).show();
                        return;
                    }
                    double wt = 10.0;
                    try {
                        String ws = weightIn.getText().toString().trim();
                        if (!ws.isEmpty()) wt = Double.parseDouble(ws);
                    } catch (Exception ignored) {}
                    Double pr = null;
                    try {
                        String ps = priceIn.getText().toString().trim();
                        if (!ps.isEmpty()) pr = Double.parseDouble(ps);
                    } catch (Exception ignored) {}
                    String countryCode = LoadlyApplication.getBrowseCountry(this);
                    String countryName = Countries.englishName(countryCode);
                    String truck = truckTypeKeys.get(truckTypeFilterSpinner.getSelectedItemPosition());
                    if (truck == null) truck = "dry_van";
                    String title = o + " → " + dst;
                    client.postLoad(title, o, countryName, dst, countryName, truck, wt, pr, desc, new SupabaseClient.PostCallback() {
                        @Override
                        public void onSuccess() {
                            Toast.makeText(MarketplaceActivity.this, R.string.pro_post_success, Toast.LENGTH_SHORT).show();
                            fetchLoads();
                        }

                        @Override
                        public void onError(String message) {
                            Toast.makeText(MarketplaceActivity.this, R.string.pro_post_error, Toast.LENGTH_LONG).show();
                        }
                    });
                })
                .setNegativeButton(android.R.string.cancel, null)
                .show();
    }

    private void setupInfiniteScroll() {
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView rv, int dx, int dy) {
                if (dy <= 0 || scopeMode == 2 || isLoadingMore || !hasMorePages) return;
                RecyclerView.LayoutManager lm = rv.getLayoutManager();
                if (lm instanceof LinearLayoutManager) {
                    int visible = lm.getChildCount();
                    int total = lm.getItemCount();
                    int first = ((LinearLayoutManager) lm).findFirstVisibleItemPosition();
                    if ((visible + first) >= total - 6 && total >= PAGE_SIZE) {
                        loadMoreLoads();
                    }
                }
            }
        });
    }

    private void loadMoreLoads() {
        isLoadingMore = true;
        currentOffset += PAGE_SIZE;
        client.fetchActiveLoads(PAGE_SIZE, currentOffset, currentSort, currentFilter(), new SupabaseClient.ListCallback() {
            @Override
            public void onSuccess(List<Load> result) {
                isLoadingMore = false;
                List<Load> visible = filterOutTaken(result);
                if (result.size() < PAGE_SIZE) hasMorePages = false;
                if (!visible.isEmpty()) adapter.appendList(visible);
            }

            @Override
            public void onError(String message) {
                isLoadingMore = false;
                currentOffset = Math.max(0, currentOffset - PAGE_SIZE);
            }
        });
    }

    private List<Load> filterOutTaken(List<Load> source) {
        List<Load> out = new ArrayList<>();
        if (source == null) return out;
        for (Load l : source) {
            if (!LoadPreferences.isTaken(this, l.id)) out.add(l);
        }
        return out;
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
                    scopeMode = 0;
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
        if (adapter != null) adapter.destroyNativeAd();
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
        if (scopeMode == 2) {
            hideShimmer();
            swipeRefreshLayout.setRefreshing(false);
            List<Load> saved = filterOutTaken(LoadPreferences.getBookmarkedLoads(this));
            adapter.submitList(saved);
            emptyText.setText(R.string.pro_saved_empty);
            emptyLayout.setVisibility(adapter.isEmpty() ? View.VISIBLE : View.GONE);
            recyclerView.setVisibility(adapter.isEmpty() ? View.GONE : View.VISIBLE);
            return;
        }
        currentOffset = 0;
        hasMorePages = true;
        isLoadingMore = false;
        emptyLayout.setVisibility(View.GONE);
        if (adapter.isEmpty()) {
            shimmerLayout.setVisibility(View.VISIBLE);
            shimmerLayout.startShimmer();
        }
        boolean filtered = hasActiveFilter();
        client.fetchActiveLoads(PAGE_SIZE, 0, currentSort, currentFilter(), new SupabaseClient.ListCallback() {
            @Override
            public void onSuccess(List<Load> result) {
                hideShimmer();
                swipeRefreshLayout.setRefreshing(false);
                if (result.size() < PAGE_SIZE) hasMorePages = false;
                List<Load> clean = filterOutTaken(result);
                if (!filtered && !clean.isEmpty()) {
                    LoadPreferences.cacheLoads(MarketplaceActivity.this, clean);
                }
                List<Load> alertMatches = LoadPreferences.findNewAlertMatches(MarketplaceActivity.this, clean);
                if (!alertMatches.isEmpty()) {
                    Load first = alertMatches.get(0);
                    Toast.makeText(MarketplaceActivity.this,
                            getString(R.string.pro_lane_alert_match_toast, first.originCity, first.destinationCity),
                            Toast.LENGTH_LONG).show();
                }
                adapter.submitList(filtered || !"newest".equals(currentSort) ? clean : prioritizeByDetectedCity(clean));
                emptyText.setText(filtered ? R.string.filter_empty_results : R.string.marketplace_empty);
                emptyLayout.setVisibility(adapter.isEmpty() ? View.VISIBLE : View.GONE);
                recyclerView.setVisibility(adapter.isEmpty() ? View.GONE : View.VISIBLE);
            }

            @Override
            public void onError(String message) {
                hideShimmer();
                swipeRefreshLayout.setRefreshing(false);
                if (adapter.isEmpty()) {
                    List<Load> cached = filterOutTaken(LoadPreferences.getCachedLoads(MarketplaceActivity.this));
                    if (!cached.isEmpty()) {
                        adapter.submitList(cached);
                        recyclerView.setVisibility(View.VISIBLE);
                        emptyLayout.setVisibility(View.GONE);
                        Toast.makeText(MarketplaceActivity.this, R.string.pro_offline_cache_toast, Toast.LENGTH_SHORT).show();
                        return;
                    }
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

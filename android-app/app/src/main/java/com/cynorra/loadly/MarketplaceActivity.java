package com.cynorra.loadly;

import android.content.Intent;
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

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.cynorra.loadly.model.Load;
import com.facebook.shimmer.ShimmerFrameLayout;
import com.cynorra.loadly.network.SupabaseClient;
import com.google.android.gms.ads.AdView;

import java.util.ArrayList;
import java.util.List;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_marketplace);

        ImageButton backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(v -> finish());

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
        recyclerView.setAdapter(adapter);

        swipeRefreshLayout.setColorSchemeResources(R.color.primary_accent);
        swipeRefreshLayout.setOnRefreshListener(this::fetchLoads);

        Button retryButton = findViewById(R.id.retryButton);
        retryButton.setOnClickListener(v -> fetchLoads());

        adView = findViewById(R.id.adView);
        AdsHelper.requestConsentThenLoadBanner(this, adView, null);

        setupFilterBar();
        fetchLoads();
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
            truckTypeKeys.add(entry.getKey());
            spinnerLabels.add(entry.getValue());
        }
        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, spinnerLabels);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
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

    private void updateNotificationToggleIcon(ImageButton button) {
        boolean enabled = LoadlyApplication.isPushEnabled(this);
        button.setImageResource(enabled
                ? android.R.drawable.ic_popup_reminder
                : android.R.drawable.ic_lock_silent_mode);
    }

    private void openDetail(Load load) {
        Intent intent = new Intent(this, LoadDetailActivity.class);
        intent.putExtra(LoadDetailActivity.EXTRA_LOAD_ID, load.id);
        startActivity(intent);
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
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

    private void hideShimmer() {
        shimmerLayout.stopShimmer();
        shimmerLayout.setVisibility(View.GONE);
    }
}

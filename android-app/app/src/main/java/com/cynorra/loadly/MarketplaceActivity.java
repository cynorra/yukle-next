package com.cynorra.loadly;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.cynorra.loadly.model.Load;
import com.cynorra.loadly.network.SupabaseClient;

import java.util.List;

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
    private ProgressBar progressBar;
    private LinearLayout emptyLayout;
    private TextView emptyText;
    private final SupabaseClient client = new SupabaseClient();
    private LoadAdapter adapter;

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
        progressBar = findViewById(R.id.progressBar);
        emptyLayout = findViewById(R.id.emptyLayout);
        emptyText = findViewById(R.id.emptyText);

        adapter = new LoadAdapter(this::openDetail);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        swipeRefreshLayout.setColorSchemeResources(R.color.primary_accent);
        swipeRefreshLayout.setOnRefreshListener(this::fetchLoads);

        Button retryButton = findViewById(R.id.retryButton);
        retryButton.setOnClickListener(v -> fetchLoads());

        fetchLoads();
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
            progressBar.setVisibility(View.VISIBLE);
        }
        client.fetchActiveLoads(PAGE_SIZE, new SupabaseClient.ListCallback() {
            @Override
            public void onSuccess(List<Load> result) {
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                adapter.submitList(result);
                // A successful (non-error) fetch with zero rows is a genuine "no listings"
                // state, distinct from a failed fetch below - never conflate the two texts.
                emptyText.setText(R.string.marketplace_empty);
                emptyLayout.setVisibility(adapter.isEmpty() ? View.VISIBLE : View.GONE);
                recyclerView.setVisibility(adapter.isEmpty() ? View.GONE : View.VISIBLE);
            }

            @Override
            public void onError(String message) {
                progressBar.setVisibility(View.GONE);
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
}

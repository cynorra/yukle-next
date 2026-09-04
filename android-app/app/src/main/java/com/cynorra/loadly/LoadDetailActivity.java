package com.cynorra.loadly;

import android.os.Bundle;
import android.text.format.DateFormat;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.cynorra.loadly.model.Load;
import com.cynorra.loadly.network.SupabaseClient;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class LoadDetailActivity extends AppCompatActivity {

    public static final String EXTRA_LOAD_ID = "load_id";

    private ProgressBar progressBar;
    private ScrollView contentScroll;
    private LinearLayout errorLayout;
    private TextView errorText;
    private Button retryButton;
    private String loadId;
    private final SupabaseClient client = new SupabaseClient();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_load_detail);

        ImageButton backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(v -> finish());

        progressBar = findViewById(R.id.progressBar);
        contentScroll = findViewById(R.id.contentScroll);
        errorLayout = findViewById(R.id.errorLayout);
        errorText = findViewById(R.id.errorText);
        retryButton = findViewById(R.id.retryButton);
        retryButton.setOnClickListener(v -> fetchLoad(loadId));

        loadId = getIntent().getStringExtra(EXTRA_LOAD_ID);
        if (loadId == null || loadId.isEmpty()) {
            showError(false);
            return;
        }
        fetchLoad(loadId);
    }

    private void fetchLoad(String id) {
        progressBar.setVisibility(View.VISIBLE);
        errorLayout.setVisibility(View.GONE);
        client.fetchLoad(id, new SupabaseClient.DetailCallback() {
            @Override
            public void onSuccess(Load load) {
                progressBar.setVisibility(View.GONE);
                bind(load);
            }

            @Override
            public void onError(String message) {
                // "not_found" is SupabaseClient's deliberate signal for a genuinely
                // missing listing (valid request, zero rows) - any other message means
                // the request itself failed (network/server), which is not the same
                // thing and must not show "listing not found" as if it were.
                showError(!"not_found".equals(message));
            }
        });
    }

    private void showError(boolean canRetry) {
        progressBar.setVisibility(View.GONE);
        contentScroll.setVisibility(View.GONE);
        errorText.setText(canRetry ? R.string.load_detail_load_error : R.string.load_not_found);
        retryButton.setVisibility(canRetry ? View.VISIBLE : View.GONE);
        errorLayout.setVisibility(View.VISIBLE);
    }

    private void bind(Load load) {
        contentScroll.setVisibility(View.VISIBLE);

        ((TextView) findViewById(R.id.routeText)).setText(getString(R.string.route_format, load.originCity, load.destinationCity));

        TextView priceText = findViewById(R.id.priceText);
        if (load.price != null) {
            String currency = "TR".equalsIgnoreCase(load.originCountry) || "Türkiye".equalsIgnoreCase(load.originCountry) ? "₺" : "$";
            priceText.setText(getString(R.string.price_format, currency, String.format(Locale.getDefault(), "%,.0f", load.price)));
        } else {
            priceText.setText(R.string.negotiable);
        }

        ((TextView) findViewById(R.id.titleText)).setText(load.title);

        TextView descriptionText = findViewById(R.id.descriptionText);
        if (load.description != null && !load.description.isEmpty()) {
            descriptionText.setText(load.description);
            descriptionText.setVisibility(View.VISIBLE);
        } else {
            descriptionText.setVisibility(View.GONE);
        }

        String weight = load.weightTon == Math.floor(load.weightTon)
                ? String.valueOf((long) load.weightTon)
                : String.valueOf(load.weightTon);
        ((TextView) findViewById(R.id.weightText)).setText(getString(R.string.weight_detail, weight));

        TextView truckText = findViewById(R.id.truckText);
        String truckLabel = TruckTypes.loadLabels(this).get(load.requiredTruckType);
        if (truckLabel != null) {
            truckText.setText(getString(R.string.truck_type_detail, truckLabel));
            truckText.setVisibility(View.VISIBLE);
        } else {
            truckText.setVisibility(View.GONE);
        }

        TextView dateText = findViewById(R.id.dateText);
        String formattedDate = formatDate(load.createdAt);
        if (formattedDate != null) {
            dateText.setText(getString(R.string.listed_date_detail, formattedDate));
            dateText.setVisibility(View.VISIBLE);
        } else {
            dateText.setVisibility(View.GONE);
        }

        TextView shipperText = findViewById(R.id.shipperText);
        if (load.shipperName != null && !load.shipperName.isEmpty()) {
            String shipperLine = getString(R.string.shipper_detail, load.shipperName)
                    + (load.shipperVerified ? getString(R.string.shipper_verified_mark) : "");
            shipperText.setText(shipperLine);
            shipperText.setVisibility(View.VISIBLE);
        } else {
            shipperText.setVisibility(View.GONE);
        }
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }

    private String formatDate(String isoDate) {
        if (isoDate == null) return null;
        try {
            SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
            Date date = parser.parse(isoDate.length() >= 19 ? isoDate.substring(0, 19) : isoDate);
            if (date == null) return null;
            return DateFormat.getDateFormat(this).format(date);
        } catch (ParseException e) {
            return null;
        }
    }
}

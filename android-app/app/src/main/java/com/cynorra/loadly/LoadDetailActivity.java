package com.cynorra.loadly;

import android.content.Intent;
import android.os.Bundle;
import android.text.format.DateFormat;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.cynorra.loadly.model.Load;
import com.cynorra.loadly.network.SupabaseClient;
import com.facebook.shimmer.ShimmerFrameLayout;
import com.google.android.gms.ads.AdView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class LoadDetailActivity extends AppCompatActivity {

    public static final String EXTRA_LOAD_ID = "load_id";

    private ShimmerFrameLayout shimmerLayout;
    private ScrollView contentScroll;
    private LinearLayout errorLayout;
    private TextView errorText;
    private Button retryButton;
    private String loadId;
    private final SupabaseClient client = new SupabaseClient();
    private AdView adView;
    private ImageButton shareButton;
    private Load currentLoad;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_load_detail);

        ImageButton backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(v -> finish());

        shimmerLayout = findViewById(R.id.shimmerLayout);
        contentScroll = findViewById(R.id.contentScroll);
        errorLayout = findViewById(R.id.errorLayout);
        errorText = findViewById(R.id.errorText);
        retryButton = findViewById(R.id.retryButton);
        retryButton.setOnClickListener(v -> fetchLoad(loadId));

        adView = findViewById(R.id.adView);
        AdsHelper.requestConsentThenLoadBanner(this, adView, null);

        shareButton = findViewById(R.id.shareButton);
        shareButton.setOnClickListener(v -> shareCurrentLoad());

        loadId = getIntent().getStringExtra(EXTRA_LOAD_ID);
        if (loadId == null || loadId.isEmpty()) {
            showError(false);
            return;
        }

        fetchLoad(loadId);
    }

    private void fetchLoad(String id) {
        shimmerLayout.setVisibility(View.VISIBLE);
        shimmerLayout.startShimmer();
        errorLayout.setVisibility(View.GONE);
        client.fetchLoad(id, new SupabaseClient.DetailCallback() {
            @Override
            public void onSuccess(Load load) {
                hideShimmer();
                bind(load);
            }

            @Override
            public void onError(String message) {
                showError(!"not_found".equals(message));
            }
        });
    }

    private void hideShimmer() {
        shimmerLayout.stopShimmer();
        shimmerLayout.setVisibility(View.GONE);
    }

    private void showError(boolean canRetry) {
        hideShimmer();
        contentScroll.setVisibility(View.GONE);
        shareButton.setVisibility(View.GONE);
        currentLoad = null;
        errorText.setText(canRetry ? R.string.load_detail_load_error : R.string.load_not_found);
        retryButton.setVisibility(canRetry ? View.VISIBLE : View.GONE);
        errorLayout.setVisibility(View.VISIBLE);
    }

    private void shareCurrentLoad() {
        if (currentLoad == null) return;
        String text = getString(R.string.share_load_text,
                currentLoad.originCity, currentLoad.destinationCity,
                "https://loadlyapp.com/en/marketplace/" + currentLoad.id);
        Intent sendIntent = new Intent(Intent.ACTION_SEND);
        sendIntent.setType("text/plain");
        sendIntent.putExtra(Intent.EXTRA_TEXT, text);
        startActivity(Intent.createChooser(sendIntent, getString(R.string.share_load)));
    }

    private void bindContactHub(Load load) {
        Button primaryBtn = findViewById(R.id.contactShipperButton);
        Button optionsBtn = findViewById(R.id.secondaryContactButton);
        TextView summaryView = findViewById(R.id.contactSummaryText);
        TextView shipperText = findViewById(R.id.shipperText);

        ContactHelper.ContactInfo info = ContactHelper.extract(load);

        String displayShipper = info.companyName != null && !info.companyName.isEmpty()
                ? info.companyName
                : (load.shipperName != null && !load.shipperName.isEmpty() ? load.shipperName : getString(R.string.app_name));
        String maskedPerson = info.maskedContactPerson();
        if (maskedPerson != null && !maskedPerson.isEmpty()) {
            displayShipper = displayShipper + " (" + maskedPerson + ")";
        }
        String shipperLine = getString(R.string.shipper_detail, displayShipper)
                + (load.shipperVerified ? getString(R.string.shipper_verified_mark) : "");
        shipperText.setText(shipperLine);
        shipperText.setVisibility(View.VISIBLE);

        StringBuilder summary = new StringBuilder();
        String phone = info.primaryPhone();
        String email = info.primaryEmail();
        if (phone != null) summary.append(ContactHelper.maskContactPreview(phone));
        if (email != null) {
            if (summary.length() > 0) summary.append("  •  ");
            summary.append(ContactHelper.maskContactPreview(email));
        }
        if (summary.length() > 0) {
            summaryView.setText(summary.toString());
            summaryView.setVisibility(View.VISIBLE);
        } else {
            summaryView.setVisibility(View.GONE);
        }

        if (phone != null) {
            primaryBtn.setText(R.string.call_shipper);
            primaryBtn.setOnClickListener(v -> ContactHelper.dialPhone(this, phone, phone));
        } else if (email != null) {
            primaryBtn.setText(R.string.email_shipper);
            primaryBtn.setOnClickListener(v -> ContactHelper.sendEmail(this, email, load.title));
        } else {
            primaryBtn.setText(R.string.contact_shipper);
            primaryBtn.setOnClickListener(v -> ContactHelper.showContactSheet(this, load));
        }

        optionsBtn.setOnClickListener(v -> ContactHelper.showContactSheet(this, load));

        View kvkkBtn = findViewById(R.id.kvkkRemoveButton);
        if (kvkkBtn != null) {
            kvkkBtn.setOnClickListener(v -> ContactHelper.requestKvkkTakedown(
                    this, load.title, load.id, phone != null ? phone : email));
        }
    }

    private void bind(Load load) {
        contentScroll.setVisibility(View.VISIBLE);
        currentLoad = load;
        shareButton.setVisibility(View.VISIBLE);
        bindContactHub(load);

        ((TextView) findViewById(R.id.routeText)).setText(getString(R.string.route_format, load.originCity, load.destinationCity));

        TextView priceText = findViewById(R.id.priceText);
        if (load.price != null) {
            String currency = "TR".equalsIgnoreCase(load.originCountry) || "Türkiye".equalsIgnoreCase(load.originCountry) || "Turkey".equalsIgnoreCase(load.originCountry) ? "₺" : "$";
            priceText.setText(getString(R.string.price_format, currency, String.format(Locale.getDefault(), "%,.0f", load.price)));
        } else {
            priceText.setText(R.string.negotiable);
        }

        ((TextView) findViewById(R.id.titleText)).setText(load.title);

        TextView descriptionText = findViewById(R.id.descriptionText);
        if (load.description != null && !load.description.isEmpty()) {
            descriptionText.setText(ContactHelper.sanitizeDescriptionForDisplay(load.description));
            descriptionText.setVisibility(View.VISIBLE);
        } else {
            descriptionText.setVisibility(View.GONE);
        }

        String weight = load.weightTon == Math.floor(load.weightTon)
                ? String.valueOf((long) load.weightTon)
                : String.valueOf(load.weightTon);
        ((TextView) findViewById(R.id.weightText)).setText(getString(R.string.weight_detail, weight));

        TextView truckText = findViewById(R.id.truckText);
        String truckLabel = load.requiredTruckType != null
                ? TruckTypes.loadLabels(this).getOrDefault(load.requiredTruckType, load.requiredTruckType)
                : null;
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
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
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

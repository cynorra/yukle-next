package com.cynorra.loadly;

import android.content.Intent;
import android.net.Uri;
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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
                // "not_found" is SupabaseClient's deliberate signal for a genuinely
                // missing listing (valid request, zero rows) - any other message means
                // the request itself failed (network/server), which is not the same
                // thing and must not show "listing not found" as if it were.
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

    // Shares the route plus a link to the Loadly site. The website no longer has per-load
    // pages (/marketplace/<id> is a 404), so the link points at the site itself.
    private void shareCurrentLoad() {
        if (currentLoad == null) return;
        String text = getString(R.string.share_load_text,
                currentLoad.originCity, currentLoad.destinationCity,
                "https://loadlyapp.com/en");
        Intent sendIntent = new Intent(Intent.ACTION_SEND);
        sendIntent.setType("text/plain");
        sendIntent.putExtra(Intent.EXTRA_TEXT, text);
        startActivity(Intent.createChooser(sendIntent, getString(R.string.share_load)));
    }

    // Scraped listings carry the contact in the description text ("Company: X Phone: N ...").
    // Listing texts phrase the number many ways ("Phone: 541...", "Telefon: +90 224 ...",
    // "Call 305...", "reach out at 217..."), so match any digit run that looks like a phone
    // number and keep the first one with 7-15 digits (skips dates like 10/31/2026 and #ids).
    private static final Pattern PHONE = Pattern.compile("(\\+?\\d[\\d ()-]{5,}\\d)");
    private static final Pattern EMAIL = Pattern.compile("([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})");

    private static String firstPhone(String text) {
        if (text == null) return null;
        Matcher m = PHONE.matcher(text);
        while (m.find()) {
            String candidate = m.group(1).trim();
            int digits = candidate.replaceAll("\\D", "").length();
            if (digits >= 7 && digits <= 15) return candidate;
        }
        return null;
    }

    private static String firstMatch(Pattern p, String text) {
        if (text == null) return null;
        Matcher m = p.matcher(text);
        return m.find() ? m.group(1).trim() : null;
    }

    // Native hand-off: dial or e-mail the contact found in the listing. If the listing has
    // neither, the button is hidden rather than leading anywhere broken.
    private void bindContactButton(Load load) {
        Button contact = findViewById(R.id.contactShipperButton);
        String phone = firstPhone(load.description);
        String email = firstMatch(EMAIL, load.description);
        if (phone != null) {
            contact.setText(R.string.call_shipper);
            contact.setVisibility(View.VISIBLE);
            contact.setOnClickListener(v -> startActivitySafely(
                    new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + phone.replaceAll("[^0-9+]", "")))));
        } else if (email != null) {
            contact.setText(R.string.email_shipper);
            contact.setVisibility(View.VISIBLE);
            contact.setOnClickListener(v -> startActivitySafely(
                    new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:" + email))));
        } else {
            contact.setVisibility(View.GONE);
        }
    }

    private void startActivitySafely(Intent intent) {
        try {
            startActivity(intent);
        } catch (android.content.ActivityNotFoundException ignored) {
            // No dialer / mail app installed: nothing sensible to open.
        }
    }

    private void bind(Load load) {
        contentScroll.setVisibility(View.VISIBLE);
        currentLoad = load;
        shareButton.setVisibility(View.VISIBLE);
        bindContactButton(load);

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
        // Falls back to the raw value instead of hiding it - see LoadAdapter's identical
        // comment for why (scraper vocabulary vs. this map's known keys).
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

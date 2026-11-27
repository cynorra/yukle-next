package com.cynorra.loadly;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

/**
 * Carrier Verification & Documents Screen (Silent Vector).
 * Matches design/ta_y_c_belge_do_rulama/screen.png.
 */
public class CarrierVerificationActivity extends AppCompatActivity {

    public static final String EXTRA_CARRIER_NAME = "carrier_name";
    public static final String EXTRA_PRICE = "carrier_price";
    public static final String EXTRA_RATING = "carrier_rating";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_carrier_verification);

        String name = getIntent().getStringExtra(EXTRA_CARRIER_NAME);
        String price = getIntent().getStringExtra(EXTRA_PRICE);
        String rating = getIntent().getStringExtra(EXTRA_RATING);
        if (name == null || name.isEmpty()) name = "Ege Güven Lojistik";
        if (price == null || price.isEmpty()) price = "₺24.500";
        if (rating == null || rating.isEmpty()) rating = "4.9";

        final String finalName = name;
        final String finalPrice = price;
        final String finalRating = rating;

        ((TextView) findViewById(R.id.carrierNameTitle)).setText(finalName);
        ((TextView) findViewById(R.id.carrierRatingSub)).setText("★ " + finalRating + " • 184 Doğrulanmış Taşıma");
        ((TextView) findViewById(R.id.stickyPriceText)).setText(finalPrice + " (Her Şey Dahil)");

        findViewById(R.id.backBtn).setOnClickListener(v -> finish());
        findViewById(R.id.openReviewsBtn).setOnClickListener(v -> {
            Intent i = new Intent(this, CarrierReviewsActivity.class);
            i.putExtra(CarrierReviewsActivity.EXTRA_CARRIER_NAME, finalName);
            i.putExtra(CarrierReviewsActivity.EXTRA_PRICE, finalPrice);
            i.putExtra(CarrierReviewsActivity.EXTRA_RATING, finalRating);
            startActivity(i);
        });

        findViewById(R.id.sendMessageBtn).setOnClickListener(v -> {
            Toast.makeText(this, finalName + " ile korumalı sohbet açıldı.", Toast.LENGTH_SHORT).show();
            finish();
        });

        findViewById(R.id.acceptOfferBtn).setOnClickListener(v -> {
            LoadlyStore.setAcceptedIncomingId(this, "inc_1");
            Toast.makeText(this, finalName + " teklifi (" + finalPrice + ") güvenli havuz korumasıyla onaylandı!", Toast.LENGTH_LONG).show();
            finish();
        });
    }
}

package com.cynorra.loadly;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

/**
 * Carrier Reviews & Verified Photo Gallery Screen (Silent Vector).
 * Matches design/ta_y_c_de_erlendirmeleri_foto_raf_galerisi/screen.png.
 */
public class CarrierReviewsActivity extends AppCompatActivity {

    public static final String EXTRA_CARRIER_NAME = "carrier_name";
    public static final String EXTRA_PRICE = "carrier_price";
    public static final String EXTRA_RATING = "carrier_rating";
    public static final String EXTRA_COUNT = "carrier_count";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_carrier_reviews);

        String name = getIntent().getStringExtra(EXTRA_CARRIER_NAME);
        String price = getIntent().getStringExtra(EXTRA_PRICE);
        String rating = getIntent().getStringExtra(EXTRA_RATING);
        int count = getIntent().getIntExtra(EXTRA_COUNT, 184);

        if (name == null || name.isEmpty()) name = "Ege Güven Lojistik";
        if (price == null || price.isEmpty()) price = "₺24.500";
        if (rating == null || rating.isEmpty()) rating = "4.9";

        final String finalName = name;
        final String finalPrice = price;
        final String finalRating = rating;

        ((TextView) findViewById(R.id.revCarrierName)).setText(finalName);
        ((TextView) findViewById(R.id.revScoreText)).setText(finalRating + " / 5.0");
        ((TextView) findViewById(R.id.revCountText)).setText(count + " Doğrulanmış Değerlendirme");
        ((TextView) findViewById(R.id.revStickyPrice)).setText(finalPrice + " Her Şey Dahil");

        findViewById(R.id.backBtn).setOnClickListener(v -> finish());
        findViewById(R.id.openVerifyBtn).setOnClickListener(v -> {
            Intent i = new Intent(this, CarrierVerificationActivity.class);
            i.putExtra(CarrierVerificationActivity.EXTRA_CARRIER_NAME, finalName);
            i.putExtra(CarrierVerificationActivity.EXTRA_PRICE, finalPrice);
            i.putExtra(CarrierVerificationActivity.EXTRA_RATING, finalRating);
            startActivity(i);
        });

        findViewById(R.id.revAcceptBtn).setOnClickListener(v -> {
            LoadlyStore.setAcceptedIncomingId(this, "inc_1");
            Toast.makeText(this, finalName + " teklifi (" + finalPrice + ") onaylandı!", Toast.LENGTH_LONG).show();
            finish();
        });
    }
}

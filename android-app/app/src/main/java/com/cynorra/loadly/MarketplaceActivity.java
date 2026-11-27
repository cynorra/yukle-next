package com.cynorra.loadly;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import com.google.android.gms.ads.AdView;

import java.util.ArrayList;
import java.util.List;

/**
 * Silent Vector 5-Tab Main Shell Activity.
 * Hosts:
 *  0: İlanlar (ExploreFragment)
 *  1: İlan Ver (CreateListingFragment)
 *  2: Teklifler (OffersFragment — Gelen / Verdiğim / Geçmiş)
 *  3: Mesajlar (MessagesFragment)
 *  4: Profil (ProfileFragment)
 */
public class MarketplaceActivity extends AppCompatActivity {

    public static final int TAB_EXPLORE = 0;
    public static final int TAB_CREATE = 1;
    public static final int TAB_OFFERS = 2;
    public static final int TAB_MESSAGES = 3;
    public static final int TAB_PROFILE = 4;

    private static final String APP_HOST = "loadlyapp.com";

    private int currentTab = -1;
    private ImageView[] navIcons;
    private TextView[] navLabels;
    private TextView navOffersBadge;
    private TextView headerSubtitle;
    private TextView avatarHeaderBtn;
    private AdView adView;

    private final ActivityResultLauncher<String[]> permissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), permissions -> {});

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_marketplace);

        headerSubtitle = findViewById(R.id.headerSubtitle);
        avatarHeaderBtn = findViewById(R.id.avatarHeaderBtn);
        navOffersBadge = findViewById(R.id.navOffersBadge);

        avatarHeaderBtn.setText(LoadlyStore.getUserInitials(this));
        avatarHeaderBtn.setOnClickListener(v -> selectTab(TAB_PROFILE));
        findViewById(R.id.supportHeaderBtn).setOnClickListener(v -> showSupportDialog());

        navIcons = new ImageView[]{
                findViewById(R.id.navExploreIcon),
                findViewById(R.id.navCreateIcon),
                findViewById(R.id.navOffersIcon),
                findViewById(R.id.navMessagesIcon),
                findViewById(R.id.navProfileIcon)
        };
        navLabels = new TextView[]{
                findViewById(R.id.navExploreLabel),
                findViewById(R.id.navCreateLabel),
                findViewById(R.id.navOffersLabel),
                findViewById(R.id.navMessagesLabel),
                findViewById(R.id.navProfileLabel)
        };

        findViewById(R.id.navExplore).setOnClickListener(v -> selectTab(TAB_EXPLORE));
        findViewById(R.id.navCreate).setOnClickListener(v -> selectTab(TAB_CREATE));
        findViewById(R.id.navOffers).setOnClickListener(v -> selectTab(TAB_OFFERS));
        findViewById(R.id.navMessages).setOnClickListener(v -> selectTab(TAB_MESSAGES));
        findViewById(R.id.navProfile).setOnClickListener(v -> selectTab(TAB_PROFILE));

        adView = findViewById(R.id.adView);
        AdsHelper.requestConsentThenLoadBanner(this, adView, null);

        refreshOffersBadge();
        requestAppPermissions();

        if (savedInstanceState == null) {
            selectTab(TAB_EXPLORE);
        }
        handleIncomingIntent(getIntent());
        ReviewPromptHelper.maybePrompt(this);
    }

    @Override
    protected void onNewIntent(@NonNull Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

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

    public void selectTab(int tabIndex) {
        selectTab(tabIndex, 0);
    }

    public void selectTab(int tabIndex, int offersSubTab) {
        if (currentTab == tabIndex && tabIndex != TAB_OFFERS) return;
        currentTab = tabIndex;

        for (int i = 0; i < navIcons.length; i++) {
            boolean active = (i == tabIndex);
            int color = getColor(active ? R.color.sv_primary : R.color.sv_outline);
            navIcons[i].setColorFilter(color);
            navLabels[i].setTextColor(color);
            navLabels[i].setTypeface(null, active ? android.graphics.Typeface.BOLD : android.graphics.Typeface.NORMAL);
        }

        headerSubtitle.setText(tabIndex == TAB_CREATE ? "Bireysel & Kurumsal" : "Nakliye & Lojistik");

        Fragment fragment;
        switch (tabIndex) {
            case TAB_CREATE:
                fragment = new CreateListingFragment();
                break;
            case TAB_OFFERS:
                fragment = OffersFragment.newInstance(offersSubTab);
                break;
            case TAB_MESSAGES:
                fragment = new MessagesFragment();
                break;
            case TAB_PROFILE:
                fragment = new ProfileFragment();
                break;
            case TAB_EXPLORE:
            default:
                fragment = new ExploreFragment();
                break;
        }

        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit();
    }

    public void refreshOffersBadge() {
        int count = LoadlyStore.getIncomingOffers(this).size();
        navOffersBadge.setText(String.valueOf(count));
        navOffersBadge.setVisibility(count > 0 ? android.view.View.VISIBLE : android.view.View.GONE);
    }

    private void showSupportDialog() {
        new AlertDialog.Builder(this)
                .setTitle("7/24 Loadly Operasyon Desteği")
                .setMessage("Tüm taşınma ve yük operasyonlarınızda ₺1.500.000 emtia sigortası ve güvenli havuz koruması devrededir.\n\nDestek Hattı: 0850 255 44 00\nE-posta: info@loadlyapp.com")
                .setPositiveButton("Hemen Ara", (d, w) -> {
                    Intent dial = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:08502554400"));
                    startActivity(dial);
                })
                .setNeutralButton("Mesajlara Git", (d, w) -> selectTab(TAB_MESSAGES))
                .setNegativeButton("Kapat", null)
                .show();
    }

    private void requestAppPermissions() {
        List<String> needed = new ArrayList<>();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.POST_NOTIFICATIONS);
        }
        if (!needed.isEmpty()) {
            permissionLauncher.launch(needed.toArray(new String[0]));
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (adView != null) adView.resume();
    }

    @Override
    protected void onPause() {
        if (adView != null) adView.pause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (adView != null) adView.destroy();
        super.onDestroy();
    }
}

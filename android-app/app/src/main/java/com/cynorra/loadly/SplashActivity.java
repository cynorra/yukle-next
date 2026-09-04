package com.cynorra.loadly;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.animation.OvershootInterpolator;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.splashscreen.SplashScreen;

public class SplashActivity extends AppCompatActivity {

    // How long to hold the logo on screen after it finishes animating in.
    private static final long HOLD_AFTER_ANIM_MS = 700;
    // Absolute ceiling so a rendering hiccup can never strand the user on splash.
    private static final long FALLBACK_MS = 3000;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean navigated = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Must run before super.onCreate() - hands off the API 31+ system splash
        // (styled via Theme.Loadly.Splash) into this Activity. No-op on API <31.
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        ImageView logo = findViewById(R.id.splashLogo);
        logo.setAlpha(0f);
        logo.setScaleX(0.7f);
        logo.setScaleY(0.7f);

        AnimatorSet reveal = new AnimatorSet();
        reveal.playTogether(
                ObjectAnimator.ofFloat(logo, View.ALPHA, 0f, 1f),
                ObjectAnimator.ofFloat(logo, View.SCALE_X, 0.7f, 1f),
                ObjectAnimator.ofFloat(logo, View.SCALE_Y, 0.7f, 1f)
        );
        reveal.setDuration(500);
        reveal.setInterpolator(new OvershootInterpolator(1.4f));
        reveal.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                handler.postDelayed(SplashActivity.this::navigateToMain, HOLD_AFTER_ANIM_MS);
            }
        });
        reveal.start();

        handler.postDelayed(this::navigateToMain, FALLBACK_MS);
    }

    private void navigateToMain() {
        if (navigated) return;
        navigated = true;
        startActivity(new Intent(SplashActivity.this, MainActivity.class));
        finish();
        overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
    }
}

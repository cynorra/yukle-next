package com.cynorra.loadly;

import android.view.MotionEvent;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.OvershootInterpolator;

import androidx.dynamicanimation.animation.DynamicAnimation;
import androidx.dynamicanimation.animation.SpringAnimation;
import androidx.dynamicanimation.animation.SpringForce;

/**
 * 2027+ tactile micro-interactions: spring physics press feedback,
 * overshoot star pop, and smooth content reveal transitions.
 */
public final class UiMotion {

    private UiMotion() {}

    public static void attachSpringPress(View v) {
        if (v == null) return;
        final SpringAnimation sx = new SpringAnimation(v, DynamicAnimation.SCALE_X)
                .setSpring(new SpringForce(1f)
                        .setDampingRatio(SpringForce.DAMPING_RATIO_MEDIUM_BOUNCY)
                        .setStiffness(SpringForce.STIFFNESS_MEDIUM));
        final SpringAnimation sy = new SpringAnimation(v, DynamicAnimation.SCALE_Y)
                .setSpring(new SpringForce(1f)
                        .setDampingRatio(SpringForce.DAMPING_RATIO_MEDIUM_BOUNCY)
                        .setStiffness(SpringForce.STIFFNESS_MEDIUM));
        v.setOnTouchListener((view, e) -> {
            switch (e.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    sx.cancel();
                    sy.cancel();
                    view.setScaleX(0.95f);
                    view.setScaleY(0.95f);
                    break;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_CANCEL:
                    sx.start();
                    sy.start();
                    break;
                default:
                    break;
            }
            return false;
        });
    }

    public static void popStar(View v) {
        if (v == null) return;
        v.animate().cancel();
        v.setScaleX(0.75f);
        v.setScaleY(0.75f);
        v.animate()
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(260L)
                .setInterpolator(new OvershootInterpolator(2.6f))
                .start();
    }

    public static void revealSmooth(View v) {
        if (v == null) return;
        v.animate().cancel();
        v.setAlpha(0f);
        v.setTranslationY(18f);
        v.setVisibility(View.VISIBLE);
        v.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(280L)
                .setInterpolator(new DecelerateInterpolator())
                .start();
    }
}

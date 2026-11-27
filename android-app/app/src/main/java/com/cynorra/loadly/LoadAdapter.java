package com.cynorra.loadly;

import android.text.format.DateUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.RecyclerView;

import com.cynorra.loadly.model.Load;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.nativead.NativeAdView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class LoadAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private static final int VIEW_TYPE_LOAD = 0;
    private static final int VIEW_TYPE_NATIVE_AD = 1;
    private static final int AD_EVERY_N_LOADS = 8;

    public interface OnLoadClickListener {
        void onLoadClick(Load load);
    }

    private final List<Load> loads = new ArrayList<>();
    private final OnLoadClickListener listener;
    private Map<String, String> truckLabels;
    private NativeAd nativeAd;

    public LoadAdapter(OnLoadClickListener listener) {
        this.listener = listener;
    }

    public boolean isEmpty() {
        return loads.isEmpty();
    }

    public void setNativeAd(NativeAd ad) {
        if (this.nativeAd != null && this.nativeAd != ad) {
            this.nativeAd.destroy();
        }
        this.nativeAd = ad;
        notifyDataSetChanged();
    }

    public void destroyNativeAd() {
        if (this.nativeAd != null) {
            this.nativeAd.destroy();
            this.nativeAd = null;
        }
    }

    public void submitList(List<Load> incoming) {
        List<Load> newLoads = dedupe(incoming);
        loads.clear();
        loads.addAll(newLoads);
        notifyDataSetChanged();
    }

    public void appendList(List<Load> more) {
        if (more == null || more.isEmpty()) return;
        List<Load> combined = new ArrayList<>(loads);
        combined.addAll(more);
        submitList(combined);
    }

    /** The same shipment is sometimes published twice (scraper retries); show it once. */
    private static List<Load> dedupe(List<Load> source) {
        java.util.LinkedHashMap<String, Load> unique = new java.util.LinkedHashMap<>();
        for (Load l : source) {
            String key = String.valueOf(l.originCity) + '|' + l.originCountry + '|' + l.destinationCity + '|'
                    + l.destinationCountry + '|' + l.requiredTruckType + '|' + l.weightTon + '|' + l.price + '|'
                    + l.shipperName + '|' + l.description;
            if (!unique.containsKey(key)) unique.put(key, l);
        }
        return new ArrayList<>(unique.values());
    }

    private boolean isAdPosition(int position) {
        return nativeAd != null && position > 0 && ((position + 1) % (AD_EVERY_N_LOADS + 1) == 0);
    }

    private int loadIndexForPosition(int position) {
        if (nativeAd == null) return position;
        int adsBefore = position / (AD_EVERY_N_LOADS + 1);
        return position - adsBefore;
    }

    @Override
    public int getItemViewType(int position) {
        return isAdPosition(position) ? VIEW_TYPE_NATIVE_AD : VIEW_TYPE_LOAD;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == VIEW_TYPE_NATIVE_AD) {
            View adRow = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_native_ad, parent, false);
            return new NativeAdViewHolder(adRow);
        }
        if (truckLabels == null) {
            truckLabels = TruckTypes.loadLabels(parent.getContext());
        }
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_load, parent, false);
        return new LoadViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof NativeAdViewHolder) {
            ((NativeAdViewHolder) holder).bind(nativeAd);
            return;
        }
        int loadIdx = loadIndexForPosition(position);
        if (loadIdx >= 0 && loadIdx < loads.size()) {
            ((LoadViewHolder) holder).bind(loads.get(loadIdx), listener, truckLabels);
        }
    }

    @Override
    public int getItemCount() {
        if (nativeAd == null || loads.size() < AD_EVERY_N_LOADS) {
            return loads.size();
        }
        return loads.size() + (loads.size() / AD_EVERY_N_LOADS);
    }

    static class NativeAdViewHolder extends RecyclerView.ViewHolder {
        private final NativeAdView adView;
        private final TextView headline;
        private final TextView body;
        private final TextView advertiser;
        private final ImageView icon;
        private final Button cta;

        NativeAdViewHolder(@NonNull View itemView) {
            super(itemView);
            adView = itemView.findViewById(R.id.nativeAdView);
            headline = itemView.findViewById(R.id.adHeadline);
            body = itemView.findViewById(R.id.adBody);
            advertiser = itemView.findViewById(R.id.adAdvertiser);
            icon = itemView.findViewById(R.id.adAppIcon);
            cta = itemView.findViewById(R.id.adCallToAction);
            adView.setHeadlineView(headline);
            adView.setBodyView(body);
            adView.setAdvertiserView(advertiser);
            adView.setIconView(icon);
            adView.setCallToActionView(cta);
        }

        void bind(NativeAd ad) {
            if (ad == null) return;
            headline.setText(ad.getHeadline() != null ? ad.getHeadline() : "");
            if (ad.getBody() != null) {
                body.setText(ad.getBody());
                body.setVisibility(View.VISIBLE);
            } else {
                body.setVisibility(View.GONE);
            }
            if (ad.getAdvertiser() != null) {
                advertiser.setText(ad.getAdvertiser());
                advertiser.setVisibility(View.VISIBLE);
            } else {
                advertiser.setVisibility(View.GONE);
            }
            if (ad.getIcon() != null && ad.getIcon().getDrawable() != null) {
                icon.setImageDrawable(ad.getIcon().getDrawable());
                icon.setVisibility(View.VISIBLE);
            } else {
                icon.setVisibility(View.GONE);
            }
            if (ad.getCallToAction() != null) {
                cta.setText(ad.getCallToAction());
                cta.setVisibility(View.VISIBLE);
            } else {
                cta.setVisibility(View.GONE);
            }
            adView.setNativeAd(ad);
        }
    }

    private static class DiffCallback extends DiffUtil.Callback {
        private final List<Load> oldLoads;
        private final List<Load> newLoads;

        DiffCallback(List<Load> oldLoads, List<Load> newLoads) {
            this.oldLoads = oldLoads;
            this.newLoads = newLoads;
        }

        @Override
        public int getOldListSize() {
            return oldLoads.size();
        }

        @Override
        public int getNewListSize() {
            return newLoads.size();
        }

        @Override
        public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
            return java.util.Objects.equals(oldLoads.get(oldItemPosition).id, newLoads.get(newItemPosition).id);
        }

        @Override
        public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
            return oldLoads.get(oldItemPosition).equals(newLoads.get(newItemPosition));
        }
    }

    static class LoadViewHolder extends RecyclerView.ViewHolder {
        private final TextView truckChip;
        private final TextView freshBadge;
        private final TextView calledBadge;
        private final TextView bookmarkButton;
        private final TextView timeText;
        private final TextView originCity;
        private final TextView originSub;
        private final TextView destCity;
        private final TextView destSub;
        private final TextView weightChip;
        private final TextView priceText;
        private final TextView quickContactButton;
        private final RouteMapView miniRouteMap;

        LoadViewHolder(@NonNull View itemView) {
            super(itemView);
            truckChip = itemView.findViewById(R.id.truckChip);
            freshBadge = itemView.findViewById(R.id.freshBadge);
            calledBadge = itemView.findViewById(R.id.calledBadge);
            bookmarkButton = itemView.findViewById(R.id.bookmarkButton);
            timeText = itemView.findViewById(R.id.timeText);
            originCity = itemView.findViewById(R.id.originCity);
            originSub = itemView.findViewById(R.id.originSub);
            destCity = itemView.findViewById(R.id.destCity);
            destSub = itemView.findViewById(R.id.destSub);
            weightChip = itemView.findViewById(R.id.weightChip);
            priceText = itemView.findViewById(R.id.priceText);
            quickContactButton = itemView.findViewById(R.id.quickContactButton);
            miniRouteMap = itemView.findViewById(R.id.miniRouteMap);
            if (miniRouteMap != null) {
                miniRouteMap.setCompactMode(true);
            }
        }

        void bind(Load load, OnLoadClickListener listener, Map<String, String> truckLabels) {
            android.content.Context ctx = itemView.getContext();

            originCity.setText(orDash(load.originCity));
            originSub.setText(orDash(load.originCountry));
            destCity.setText(orDash(load.destinationCity));
            destSub.setText(orDash(load.destinationCountry));

            if (miniRouteMap != null) {
                miniRouteMap.setRoute(
                        load.originCity, load.originCountry,
                        load.destinationCity, load.destinationCountry,
                        FreightMetrics.isImperial(load.originCountry));
            }

            if (load.price != null && load.price > 0) {
                priceText.setText(FreightMetrics.formatPrice(ctx, load));
                priceText.setTextColor(ctx.getColor(R.color.primary_accent));
            } else {
                priceText.setText(ctx.getString(R.string.ask_for_price));
                priceText.setTextColor(ctx.getColor(R.color.text_muted));
            }

            String truckLabel = load.requiredTruckType != null
                    ? truckLabels.getOrDefault(load.requiredTruckType, load.requiredTruckType)
                    : null;
            if (truckLabel != null && !truckLabel.isEmpty()) {
                truckChip.setText(truckLabel);
                truckChip.setVisibility(View.VISIBLE);
            } else {
                truckChip.setVisibility(View.INVISIBLE);
            }

            if (freshBadge != null) {
                freshBadge.setVisibility(FreightMetrics.isFresh(load.createdAt) ? View.VISIBLE : View.GONE);
            }
            if (calledBadge != null) {
                calledBadge.setVisibility(LoadPreferences.isCalled(ctx, load.id) ? View.VISIBLE : View.GONE);
            }
            if (bookmarkButton != null) {
                boolean saved = LoadPreferences.isBookmarked(ctx, load.id);
                bookmarkButton.setText(saved ? "★" : "☆");
                bookmarkButton.setTextColor(ctx.getColor(saved ? R.color.primary_accent : R.color.text_muted));
                bookmarkButton.setOnClickListener(v -> {
                    boolean nowSaved = LoadPreferences.toggleBookmark(ctx, load);
                    bookmarkButton.setText(nowSaved ? "★" : "☆");
                    bookmarkButton.setTextColor(ctx.getColor(nowSaved ? R.color.primary_accent : R.color.text_muted));
                    UiMotion.popStar(bookmarkButton);
                });
            }

            String formattedWeight = FreightMetrics.formatWeight(ctx, load);
            weightChip.setText(formattedWeight.isEmpty() ? ctx.getString(R.string.weight_value, formatWeight(load.weightTon)) : formattedWeight);

            String relTime = relativeTime(load.createdAt);
            timeText.setText(relTime != null ? relTime : "");

            itemView.setContentDescription(ctx.getString(R.string.route_format, load.originCity, load.destinationCity));
            installSpringPress(itemView);
            itemView.setOnClickListener(v -> listener.onLoadClick(load));

            if (quickContactButton != null) {
                quickContactButton.setOnClickListener(v -> {
                    LoadPreferences.markCalled(ctx, load.id);
                    if (calledBadge != null) calledBadge.setVisibility(View.VISIBLE);
                    ContactHelper.showContactSheet(ctx, load);
                });
            }
        }

        /** Cards sink slightly on touch and spring back: feels physical, costs nothing. */
        private static void installSpringPress(View v) {
            final androidx.dynamicanimation.animation.SpringForce force = new androidx.dynamicanimation.animation.SpringForce(1f)
                    .setDampingRatio(androidx.dynamicanimation.animation.SpringForce.DAMPING_RATIO_MEDIUM_BOUNCY)
                    .setStiffness(androidx.dynamicanimation.animation.SpringForce.STIFFNESS_MEDIUM);
            final androidx.dynamicanimation.animation.SpringAnimation sx =
                    new androidx.dynamicanimation.animation.SpringAnimation(v, androidx.dynamicanimation.animation.DynamicAnimation.SCALE_X).setSpring(force);
            final androidx.dynamicanimation.animation.SpringAnimation sy =
                    new androidx.dynamicanimation.animation.SpringAnimation(v, androidx.dynamicanimation.animation.DynamicAnimation.SCALE_Y).setSpring(new androidx.dynamicanimation.animation.SpringForce(1f)
                            .setDampingRatio(androidx.dynamicanimation.animation.SpringForce.DAMPING_RATIO_MEDIUM_BOUNCY)
                            .setStiffness(androidx.dynamicanimation.animation.SpringForce.STIFFNESS_MEDIUM));
            v.setOnTouchListener((view, e) -> {
                switch (e.getActionMasked()) {
                    case android.view.MotionEvent.ACTION_DOWN:
                        sx.cancel();
                        sy.cancel();
                        view.setScaleX(0.97f);
                        view.setScaleY(0.97f);
                        break;
                    case android.view.MotionEvent.ACTION_UP:
                    case android.view.MotionEvent.ACTION_CANCEL:
                        sx.start();
                        sy.start();
                        break;
                    default:
                        break;
                }
                return false; // never swallow the click
            });
        }

        private static String orDash(String v) {
            return (v == null || v.trim().isEmpty()) ? "-" : v.trim();
        }

        private static String formatWeight(double weightTon) {
            if (weightTon == Math.floor(weightTon)) {
                return String.valueOf((long) weightTon);
            }
            return String.valueOf(weightTon);
        }

        private static String formatPrice(double price, String originCountry) {
            String currency = "TR".equalsIgnoreCase(originCountry) || "Türkiye".equalsIgnoreCase(originCountry) || "Turkey".equalsIgnoreCase(originCountry) ? "₺" : "$";
            return currency + String.format(Locale.getDefault(), "%,.0f", price);
        }

        private static String relativeTime(String isoDate) {
            if (isoDate == null) return null;
            try {
                SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
                Date date = parser.parse(isoDate.length() >= 19 ? isoDate.substring(0, 19) : isoDate);
                if (date == null) return null;
                return DateUtils.getRelativeTimeSpanString(date.getTime(), System.currentTimeMillis(), DateUtils.MINUTE_IN_MILLIS).toString();
            } catch (ParseException e) {
                return null;
            }
        }
    }
}

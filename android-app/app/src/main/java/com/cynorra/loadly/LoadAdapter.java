package com.cynorra.loadly;

import android.text.format.DateUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.RecyclerView;

import com.cynorra.loadly.model.Load;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class LoadAdapter extends RecyclerView.Adapter<LoadAdapter.LoadViewHolder> {

    public interface OnLoadClickListener {
        void onLoadClick(Load load);
    }

    private final List<Load> loads = new ArrayList<>();
    private final OnLoadClickListener listener;
    private Map<String, String> truckLabels;

    public LoadAdapter(OnLoadClickListener listener) {
        this.listener = listener;
    }

    public boolean isEmpty() {
        return loads.isEmpty();
    }

    /** Replaces the list and dispatches only the actual insert/remove/change events,
     * instead of a blanket notifyDataSetChanged() that forces every visible row to rebind. */
    public void submitList(List<Load> newLoads) {
        List<Load> oldLoads = new ArrayList<>(loads);
        DiffUtil.DiffResult diff = DiffUtil.calculateDiff(new DiffCallback(oldLoads, newLoads));
        loads.clear();
        loads.addAll(newLoads);
        diff.dispatchUpdatesTo(this);
    }

    @NonNull
    @Override
    public LoadViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (truckLabels == null) {
            truckLabels = TruckTypes.loadLabels(parent.getContext());
        }
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_load, parent, false);
        return new LoadViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull LoadViewHolder holder, int position) {
        Load load = loads.get(position);
        holder.bind(load, listener, truckLabels);
    }

    @Override
    public int getItemCount() {
        return loads.size();
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
            return oldLoads.get(oldItemPosition).id.equals(newLoads.get(newItemPosition).id);
        }

        @Override
        public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
            return oldLoads.get(oldItemPosition).equals(newLoads.get(newItemPosition));
        }
    }

    static class LoadViewHolder extends RecyclerView.ViewHolder {
        private final TextView routeText;
        private final TextView priceText;
        private final TextView titleText;
        private final TextView metaText;

        LoadViewHolder(@NonNull View itemView) {
            super(itemView);
            routeText = itemView.findViewById(R.id.routeText);
            priceText = itemView.findViewById(R.id.priceText);
            titleText = itemView.findViewById(R.id.titleText);
            metaText = itemView.findViewById(R.id.metaText);
        }

        void bind(Load load, OnLoadClickListener listener, Map<String, String> truckLabels) {
            routeText.setText(itemView.getContext().getString(R.string.route_format, load.originCity, load.destinationCity));

            if (load.price != null) {
                priceText.setText(formatPrice(load.price, load.originCountry));
            } else {
                priceText.setText(itemView.getContext().getString(R.string.negotiable));
            }

            titleText.setText(load.title);

            String truckLabel = truckLabels.get(load.requiredTruckType);
            StringBuilder meta = new StringBuilder();
            meta.append(itemView.getContext().getString(R.string.weight_value, formatWeight(load.weightTon)));
            if (truckLabel != null) {
                meta.append("  •  ").append(truckLabel);
            }
            String relTime = relativeTime(load.createdAt);
            if (relTime != null) {
                meta.append("  •  ").append(relTime);
            }
            metaText.setText(meta.toString());

            itemView.setOnClickListener(v -> listener.onLoadClick(load));
        }

        private static String formatWeight(double weightTon) {
            if (weightTon == Math.floor(weightTon)) {
                return String.valueOf((long) weightTon);
            }
            return String.valueOf(weightTon);
        }

        private static String formatPrice(double price, String originCountry) {
            String currency = "TR".equalsIgnoreCase(originCountry) || "Türkiye".equalsIgnoreCase(originCountry) ? "₺" : "$";
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

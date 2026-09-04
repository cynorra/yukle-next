package com.cynorra.loadly;

import android.content.Context;

import java.util.LinkedHashMap;
import java.util.Map;

/** Localized truck-type display labels, keyed by the `required_truck_type` value from Supabase. */
public final class TruckTypes {

    private TruckTypes() {}

    public static Map<String, String> loadLabels(Context context) {
        String[] keys = context.getResources().getStringArray(R.array.truck_type_keys);
        String[] labels = context.getResources().getStringArray(R.array.truck_type_labels);
        Map<String, String> map = new LinkedHashMap<>();
        for (int i = 0; i < keys.length && i < labels.length; i++) {
            map.put(keys[i], labels[i]);
        }
        return map;
    }
}

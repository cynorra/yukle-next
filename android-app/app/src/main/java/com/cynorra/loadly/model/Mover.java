package com.cynorra.loadly.model;

import org.json.JSONObject;

/** A moving company / mover offering service (table movers). */
public class Mover {
    public final String id;
    public final String name;
    public final String country;
    public final String city;
    public final String serviceRegions;
    public final String contact;
    public final boolean verified;

    public Mover(JSONObject o) {
        id = o.optString("id");
        name = o.optString("name");
        country = o.optString("country");
        city = o.optString("city");
        serviceRegions = o.isNull("service_regions") ? null : o.optString("service_regions", null);
        contact = o.optString("contact");
        verified = o.optBoolean("is_verified", false);
    }
}

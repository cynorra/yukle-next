package com.cynorra.loadly.model;

import org.json.JSONObject;

/** A "I have a home to move" posting (table moving_requests). */
public class MovingRequest {
    public final String id;
    public final String originCountry;
    public final String originCity;
    public final String destinationCountry;
    public final String destinationCity;
    public final String moveDate;
    public final String homeSize;
    public final String itemsNote;
    public final String contact;

    public MovingRequest(JSONObject o) {
        id = o.optString("id");
        originCountry = o.optString("origin_country");
        originCity = o.optString("origin_city");
        destinationCountry = o.optString("destination_country");
        destinationCity = o.optString("destination_city");
        moveDate = o.isNull("move_date") ? null : o.optString("move_date", null);
        homeSize = o.isNull("home_size") ? null : o.optString("home_size", null);
        itemsNote = o.isNull("items_note") ? null : o.optString("items_note", null);
        contact = o.optString("contact");
    }
}

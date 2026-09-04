package com.cynorra.loadly.model;

import org.json.JSONObject;

import java.util.Objects;

public class Load {
    public final String id;
    public final String title;
    public final String description;
    public final String originCity;
    public final String originCountry;
    public final String destinationCity;
    public final String destinationCountry;
    public final double weightTon;
    public final Double price;
    public final String requiredTruckType;
    public final String loadType;
    public final String createdAt;
    public final String shipperName;
    public final boolean shipperVerified;
    public final double shipperRating;

    public Load(String id, String title, String description, String originCity, String originCountry,
                 String destinationCity, String destinationCountry, double weightTon, Double price,
                 String requiredTruckType, String loadType, String createdAt,
                 String shipperName, boolean shipperVerified, double shipperRating) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.originCity = originCity;
        this.originCountry = originCountry;
        this.destinationCity = destinationCity;
        this.destinationCountry = destinationCountry;
        this.weightTon = weightTon;
        this.price = price;
        this.requiredTruckType = requiredTruckType;
        this.loadType = loadType;
        this.createdAt = createdAt;
        this.shipperName = shipperName;
        this.shipperVerified = shipperVerified;
        this.shipperRating = shipperRating;
    }

    public static Load fromJson(JSONObject o) {
        JSONObject shipper = o.optJSONObject("shipper");
        String shipperName = null;
        boolean shipperVerified = false;
        double shipperRating = 0;
        if (shipper != null) {
            shipperName = shipper.optString("company_name", null);
            if (shipperName == null || shipperName.isEmpty() || shipperName.equals("null")) {
                shipperName = shipper.optString("full_name", null);
            }
            shipperVerified = shipper.optBoolean("is_verified", false);
            shipperRating = shipper.optDouble("rating", 0);
        }
        Double price = o.isNull("price") ? null : o.optDouble("price");
        return new Load(
                o.optString("id"),
                o.optString("title"),
                o.optString("description", null),
                o.optString("origin_city"),
                o.optString("origin_country"),
                o.optString("destination_city"),
                o.optString("destination_country"),
                o.optDouble("weight_ton", 0),
                price,
                o.optString("required_truck_type", null),
                o.optString("load_type", null),
                o.optString("created_at"),
                shipperName,
                shipperVerified,
                shipperRating
        );
    }

    // Used by LoadAdapter's DiffUtil callback to detect real content changes
    // (e.g. a re-fetch where only the price changed) vs. an identical re-fetch.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Load)) return false;
        Load other = (Load) o;
        return Double.compare(weightTon, other.weightTon) == 0
                && shipperVerified == other.shipperVerified
                && Double.compare(shipperRating, other.shipperRating) == 0
                && Objects.equals(id, other.id)
                && Objects.equals(title, other.title)
                && Objects.equals(description, other.description)
                && Objects.equals(originCity, other.originCity)
                && Objects.equals(originCountry, other.originCountry)
                && Objects.equals(destinationCity, other.destinationCity)
                && Objects.equals(destinationCountry, other.destinationCountry)
                && Objects.equals(price, other.price)
                && Objects.equals(requiredTruckType, other.requiredTruckType)
                && Objects.equals(loadType, other.loadType)
                && Objects.equals(createdAt, other.createdAt)
                && Objects.equals(shipperName, other.shipperName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, originCity, originCountry, destinationCity,
                destinationCountry, weightTon, price, requiredTruckType, loadType, createdAt,
                shipperName, shipperVerified, shipperRating);
    }
}

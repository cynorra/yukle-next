package com.cynorra.loadly.network;

import android.os.Handler;
import android.os.Looper;

import com.cynorra.loadly.SupabaseConfig;
import com.cynorra.loadly.model.Load;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Minimal PostgREST client for Supabase, mirroring the same anonymous
 * (RLS-scoped) 'loads' queries the web app's public marketplace pages run.
 * Deliberately dependency-free (HttpURLConnection + org.json) to keep this
 * screen fully independent of the web app's Next.js code.
 */
public class SupabaseClient {

    public interface ListCallback {
        void onSuccess(List<Load> loads);
        void onError(String message);
    }

    public interface DetailCallback {
        void onSuccess(Load load);
        void onError(String message);
    }

    private static final String SHIPPER_SELECT =
            "shipper:public_profiles!loads_shipper_id_fkey(full_name,company_name,is_verified,rating)";

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    public void fetchActiveLoads(int limit, ListCallback callback) {
        executor.execute(() -> {
            try {
                String select = URLEncoder.encode("id,title,origin_city,origin_country,destination_city,destination_country,weight_ton,price,required_truck_type,load_type,created_at," + SHIPPER_SELECT, "UTF-8");
                String url = SupabaseConfig.URL + "/rest/v1/loads?select=" + select
                        + "&status=eq.active&order=created_at.desc&limit=" + limit;
                String body = get(url);
                JSONArray arr = new JSONArray(body);
                List<Load> loads = new ArrayList<>();
                for (int i = 0; i < arr.length(); i++) {
                    loads.add(Load.fromJson(arr.getJSONObject(i)));
                }
                mainHandler.post(() -> callback.onSuccess(loads));
            } catch (Exception e) {
                mainHandler.post(() -> callback.onError(e.getMessage()));
            }
        });
    }

    public void fetchLoad(String id, DetailCallback callback) {
        executor.execute(() -> {
            try {
                String select = URLEncoder.encode("*," + SHIPPER_SELECT, "UTF-8");
                String url = SupabaseConfig.URL + "/rest/v1/loads?select=" + select
                        + "&id=eq." + URLEncoder.encode(id, "UTF-8") + "&limit=1";
                String body = get(url);
                JSONArray arr = new JSONArray(body);
                if (arr.length() == 0) {
                    mainHandler.post(() -> callback.onError("not_found"));
                    return;
                }
                Load load = Load.fromJson(arr.getJSONObject(0));
                mainHandler.post(() -> callback.onSuccess(load));
            } catch (Exception e) {
                mainHandler.post(() -> callback.onError(e.getMessage()));
            }
        });
    }

    private String get(String urlString) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(urlString).openConnection();
        try {
            conn.setRequestMethod("GET");
            conn.setRequestProperty("apikey", SupabaseConfig.ANON_KEY);
            conn.setRequestProperty("Authorization", "Bearer " + SupabaseConfig.ANON_KEY);
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);

            int code = conn.getResponseCode();
            InputStream stream = (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream();
            String body = readStream(stream);
            if (code < 200 || code >= 300) {
                throw new IOException("HTTP " + code + ": " + body);
            }
            return body;
        } finally {
            conn.disconnect();
        }
    }

    private String readStream(InputStream stream) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return sb.toString();
    }
}

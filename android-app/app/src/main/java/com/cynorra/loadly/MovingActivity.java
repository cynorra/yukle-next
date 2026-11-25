package com.cynorra.loadly;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.cynorra.loadly.model.Mover;
import com.cynorra.loadly.model.MovingRequest;
import com.cynorra.loadly.network.SupabaseClient;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

/**
 * Moving ("I have a home to move") screen: movers browse requests, users browse movers
 * near them, and users post a request. Global: country = ISO2 code, city/region = free text,
 * contact = free text (no phone format or currency assumed). Backed by supabase_moving.sql.
 */
public class MovingActivity extends AppCompatActivity {

    private static final int TAB_REQUESTS = 0;
    private static final int TAB_MOVERS = 1;
    private static final int TAB_POST = 2;
    private static final int LIMIT = 50;

    private final SupabaseClient client = new SupabaseClient();
    private final RowAdapter adapter = new RowAdapter();

    private int tab = TAB_REQUESTS;
    private boolean nearbyScope = true;

    private TextView tabRequests, tabMovers, tabPost, tabNearby, tabGlobal, countryChip, emptyText;
    private View scopeBar, formScroll, emptyContainer;
    private Button emptyActionButton;
    private RecyclerView recyclerView;
    private EditText cityFilterInput;

    private TextView formOriginCountry, formDestCountry, formDate;
    private EditText formOriginCity, formDestCity, formHomeSize, formItems, formContact;
    private String originCountry, destCountry, moveDate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_moving);

        findViewById(R.id.backButton).setOnClickListener(v -> finish());
        tabRequests = findViewById(R.id.tabRequests);
        tabMovers = findViewById(R.id.tabMovers);
        tabPost = findViewById(R.id.tabPost);
        tabNearby = findViewById(R.id.tabNearby);
        tabGlobal = findViewById(R.id.tabGlobal);
        countryChip = findViewById(R.id.countryChip);
        scopeBar = findViewById(R.id.scopeBar);
        formScroll = findViewById(R.id.formScroll);
        emptyContainer = findViewById(R.id.emptyContainer);
        emptyText = findViewById(R.id.emptyText);
        emptyActionButton = findViewById(R.id.emptyActionButton);
        cityFilterInput = findViewById(R.id.cityFilterInput);
        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        tabRequests.setOnClickListener(v -> selectTab(TAB_REQUESTS));
        tabMovers.setOnClickListener(v -> selectTab(TAB_MOVERS));
        tabPost.setOnClickListener(v -> selectTab(TAB_POST));
        tabNearby.setOnClickListener(v -> setScope(true));
        tabGlobal.setOnClickListener(v -> setScope(false));
        countryChip.setOnClickListener(v -> pickCountry(code -> {
            LoadlyApplication.setBrowseCountry(this, code);
            nearbyScope = true;
            refreshScopeUi();
            load();
        }));
        cityFilterInput.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                load();
                return true;
            }
            return false;
        });

        if (emptyActionButton != null) {
            emptyActionButton.setOnClickListener(v -> selectTab(TAB_POST));
        }

        com.google.android.gms.ads.AdView adView = findViewById(R.id.adView);
        AdsHelper.requestConsentThenLoadBanner(this, adView, null);

        setupForm();
        refreshScopeUi();
        selectTab(TAB_REQUESTS);
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }

    // ---- tabs / scope ----

    private void selectTab(int t) {
        tab = t;
        highlight(tabRequests, t == TAB_REQUESTS);
        highlight(tabMovers, t == TAB_MOVERS);
        highlight(tabPost, t == TAB_POST);
        boolean form = t == TAB_POST;
        formScroll.setVisibility(form ? View.VISIBLE : View.GONE);
        scopeBar.setVisibility(form ? View.GONE : View.VISIBLE);
        cityFilterInput.setVisibility(t == TAB_MOVERS ? View.VISIBLE : View.GONE);
        recyclerView.setVisibility(form ? View.GONE : View.VISIBLE);
        if (emptyContainer != null) emptyContainer.setVisibility(View.GONE);
        if (!form) load();
    }

    private void setScope(boolean nearby) {
        if (nearbyScope == nearby) return;
        nearbyScope = nearby;
        refreshScopeUi();
        load();
    }

    /** Selected pill = solid orange brand pill with black bold text; idle = translucent pill. */
    private void highlight(TextView v, boolean on) {
        v.setBackgroundResource(on ? R.drawable.bg_segment_selected : R.drawable.bg_segment_idle);
        v.setTextColor(getResources().getColor(on ? R.color.black : R.color.text_muted, getTheme()));
    }

    private void refreshScopeUi() {
        highlight(tabNearby, nearbyScope);
        highlight(tabGlobal, !nearbyScope);
        countryChip.setText(getString(R.string.scope_country_format,
                Countries.displayName(LoadlyApplication.getBrowseCountry(this))));
    }

    private String scopeCountry() {
        return nearbyScope ? LoadlyApplication.getBrowseCountry(this) : null;
    }

    // ---- lists ----

    private void load() {
        final String country = scopeCountry();
        if (tab == TAB_REQUESTS) {
            client.fetchMovingRequests(country, LIMIT, new SupabaseClient.MovingCallback() {
                @Override public void onSuccess(List<MovingRequest> items) {
                    if (items.isEmpty() && country != null) {
                        // Auto-fallback to global requests so user never stares at a dead empty screen when global requests exist
                        client.fetchMovingRequests(null, LIMIT, new SupabaseClient.MovingCallback() {
                            @Override public void onSuccess(List<MovingRequest> globalItems) {
                                if (!globalItems.isEmpty()) {
                                    nearbyScope = false;
                                    refreshScopeUi();
                                }
                                List<Row> rows = new ArrayList<>();
                                for (MovingRequest r : globalItems) rows.add(toRow(r));
                                show(rows, R.string.moving_empty_requests);
                            }
                            @Override public void onError(String message) {
                                show(new ArrayList<>(), R.string.moving_empty_requests);
                            }
                        });
                        return;
                    }
                    List<Row> rows = new ArrayList<>();
                    for (MovingRequest r : items) rows.add(toRow(r));
                    show(rows, R.string.moving_empty_requests);
                }
                @Override public void onError(String message) { showError(); }
            });
        } else if (tab == TAB_MOVERS) {
            final String cityQuery = cityFilterInput.getText().toString();
            client.fetchMovers(country, cityQuery, LIMIT, new SupabaseClient.MoversCallback() {
                @Override public void onSuccess(List<Mover> items) {
                    if (items.isEmpty() && country != null) {
                        client.fetchMovers(null, cityQuery, LIMIT, new SupabaseClient.MoversCallback() {
                            @Override public void onSuccess(List<Mover> globalItems) {
                                if (!globalItems.isEmpty()) {
                                    nearbyScope = false;
                                    refreshScopeUi();
                                }
                                List<Row> rows = new ArrayList<>();
                                for (Mover m : globalItems) rows.add(toRow(m));
                                show(rows, R.string.moving_empty_movers);
                            }
                            @Override public void onError(String message) {
                                show(new ArrayList<>(), R.string.moving_empty_movers);
                            }
                        });
                        return;
                    }
                    List<Row> rows = new ArrayList<>();
                    for (Mover m : items) rows.add(toRow(m));
                    show(rows, R.string.moving_empty_movers);
                }
                @Override public void onError(String message) { showError(); }
            });
        }
    }

    private Row toRow(MovingRequest r) {
        Row row = new Row();
        row.title = getString(R.string.route_format,
                place(r.originCity, r.originCountry), place(r.destinationCity, r.destinationCountry));
        StringBuilder detail = new StringBuilder();
        if (r.moveDate != null && !r.moveDate.isEmpty()) detail.append(getString(R.string.moving_date_detail, r.moveDate));
        if (r.homeSize != null && !r.homeSize.isEmpty()) {
            if (detail.length() > 0) detail.append('\n');
            detail.append(getString(R.string.moving_home_size_detail, r.homeSize));
        }
        if (r.itemsNote != null && !r.itemsNote.isEmpty()) {
            if (detail.length() > 0) detail.append('\n');
            detail.append(r.itemsNote);
        }
        row.detail = detail.toString();
        row.contact = r.contact;
        row.countryCode = r.originCountry;
        return row;
    }

    private Row toRow(Mover m) {
        Row row = new Row();
        row.title = m.name + (m.verified ? getString(R.string.moving_verified) : "");
        row.subtitle = place(m.city, m.country);
        row.detail = (m.serviceRegions != null && !m.serviceRegions.isEmpty())
                ? getString(R.string.moving_serves_detail, m.serviceRegions) : "";
        row.contact = m.contact;
        row.countryCode = m.country;
        return row;
    }

    private String place(String city, String iso2) {
        return getString(R.string.moving_place_format, city, Countries.displayName(iso2));
    }

    private void show(List<Row> rows, int emptyRes) {
        adapter.submit(rows);
        emptyText.setText(emptyRes);
        if (emptyContainer != null) {
            emptyContainer.setVisibility(rows.isEmpty() ? View.VISIBLE : View.GONE);
        }
        if (emptyActionButton != null) {
            emptyActionButton.setVisibility(rows.isEmpty() ? View.VISIBLE : View.GONE);
        }
    }

    private void showError() {
        adapter.submit(new ArrayList<>());
        emptyText.setText(R.string.moving_load_error);
        if (emptyContainer != null) {
            emptyContainer.setVisibility(View.VISIBLE);
        }
        if (emptyActionButton != null) {
            emptyActionButton.setVisibility(View.GONE);
        }
    }

    // ---- post form ----

    private void setupForm() {
        formOriginCountry = findViewById(R.id.formOriginCountry);
        formDestCountry = findViewById(R.id.formDestCountry);
        formDate = findViewById(R.id.formDate);
        formOriginCity = findViewById(R.id.formOriginCity);
        formDestCity = findViewById(R.id.formDestCity);
        formHomeSize = findViewById(R.id.formHomeSize);
        formItems = findViewById(R.id.formItems);
        formContact = findViewById(R.id.formContact);

        originCountry = LoadlyApplication.getBrowseCountry(this);
        destCountry = originCountry;
        String lastCity = LoadlyApplication.getLastCity(this);
        if (lastCity != null) formOriginCity.setText(lastCity);
        refreshFormCountries();

        formOriginCountry.setOnClickListener(v -> pickCountry(code -> {
            originCountry = code;
            refreshFormCountries();
        }));
        formDestCountry.setOnClickListener(v -> pickCountry(code -> {
            destCountry = code;
            refreshFormCountries();
        }));
        formDate.setOnClickListener(v -> {
            Calendar c = Calendar.getInstance();
            new DatePickerDialog(this, (picker, y, m, d) -> {
                moveDate = String.format(Locale.US, "%04d-%02d-%02d", y, m + 1, d);
                formDate.setText(java.text.DateFormat.getDateInstance().format(new java.util.GregorianCalendar(y, m, d).getTime()));
            }, c.get(Calendar.YEAR), c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH)).show();
        });
        ((Button) findViewById(R.id.formSubmit)).setOnClickListener(v -> submit());
    }

    private void refreshFormCountries() {
        formOriginCountry.setText(getString(R.string.moving_origin_country, Countries.displayName(originCountry)));
        formDestCountry.setText(getString(R.string.moving_dest_country, Countries.displayName(destCountry)));
    }

    private void submit() {
        String originCity = formOriginCity.getText().toString().trim();
        String destCity = formDestCity.getText().toString().trim();
        String contact = formContact.getText().toString().trim();
        if (originCity.isEmpty() || destCity.isEmpty() || contact.length() < 3) {
            Toast.makeText(this, R.string.moving_required, Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            JSONObject body = new JSONObject();
            body.put("origin_country", originCountry);
            body.put("origin_city", originCity);
            body.put("destination_country", destCountry);
            body.put("destination_city", destCity);
            if (moveDate != null) body.put("move_date", moveDate);
            String size = formHomeSize.getText().toString().trim();
            if (!size.isEmpty()) body.put("home_size", size);
            String note = formItems.getText().toString().trim();
            if (!note.isEmpty()) body.put("items_note", note);
            body.put("contact", contact);

            findViewById(R.id.formSubmit).setEnabled(false);
            client.postMovingRequest(body, new SupabaseClient.PostCallback() {
                @Override public void onSuccess() {
                    findViewById(R.id.formSubmit).setEnabled(true);
                    Toast.makeText(MovingActivity.this, R.string.moving_posted, Toast.LENGTH_LONG).show();
                    formDestCity.setText("");
                    formHomeSize.setText("");
                    formItems.setText("");
                    selectTab(TAB_REQUESTS);
                }
                @Override public void onError(String message) {
                    findViewById(R.id.formSubmit).setEnabled(true);
                    Toast.makeText(MovingActivity.this, R.string.moving_post_error, Toast.LENGTH_LONG).show();
                }
            });
        } catch (Exception e) {
            Toast.makeText(this, R.string.moving_post_error, Toast.LENGTH_SHORT).show();
        }
    }

    // ---- helpers ----

    private interface CountryListener {
        void onPicked(String iso2);
    }

    private void pickCountry(CountryListener listener) {
        final List<String> codes = Countries.allCodes();
        String[] names = new String[codes.size()];
        for (int i = 0; i < names.length; i++) names[i] = Countries.displayName(codes.get(i));
        new AlertDialog.Builder(this)
                .setTitle(R.string.scope_pick_country)
                .setItems(names, (d, which) -> listener.onPicked(codes.get(which)))
                .show();
    }

    private static final class Row {
        String title;
        String subtitle;
        String detail;
        String contact;
        String countryCode;
    }

    private final class RowAdapter extends RecyclerView.Adapter<RowAdapter.VH> {
        private final List<Row> rows = new ArrayList<>();

        void submit(List<Row> newRows) {
            rows.clear();
            rows.addAll(newRows);
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            return new VH(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_moving, parent, false));
        }

        @Override
        public void onBindViewHolder(@NonNull VH h, int position) {
            Row row = rows.get(position);
            h.title.setText(row.title);
            setOrHide(h.subtitle, row.subtitle);
            setOrHide(h.detail, row.detail);
            setOrHide(h.contactValue, row.contact);
            View.OnClickListener openContact = v -> ContactHelper.showContactSheetForRaw(
                    MovingActivity.this, row.title, row.contact, row.countryCode);
            h.contactButton.setOnClickListener(openContact);
            h.itemView.setOnClickListener(openContact);
        }

        private void setOrHide(TextView v, String text) {
            if (v == null) return;
            boolean has = text != null && !text.isEmpty();
            v.setVisibility(has ? View.VISIBLE : View.GONE);
            if (has) v.setText(text);
        }

        @Override
        public int getItemCount() {
            return rows.size();
        }

        final class VH extends RecyclerView.ViewHolder {
            final TextView title, subtitle, detail, contactValue;
            final Button contactButton;

            VH(@NonNull View itemView) {
                super(itemView);
                title = itemView.findViewById(R.id.titleText);
                subtitle = itemView.findViewById(R.id.subtitleText);
                detail = itemView.findViewById(R.id.detailText);
                contactValue = itemView.findViewById(R.id.contactValueText);
                contactButton = itemView.findViewById(R.id.contactButton);
            }
        }
    }
}

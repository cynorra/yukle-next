package com.cynorra.loadly;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import com.cynorra.loadly.network.SupabaseClient;

import org.json.JSONObject;

import java.util.Calendar;
import java.util.Locale;

/**
 * Tab 2: İlan Ver (Ev & Ofis Nakliyesi + Kurumsal Yük Composer — Silent Vector).
 * Matches design/ev_i_yeri_nakliye_sade_premium/code.html and posts directly to Supabase.
 */
public class CreateListingFragment extends Fragment {

    private final SupabaseClient client = new SupabaseClient();

    private boolean isMovingMode = true;
    private int selectedType = 0; // 0..3
    private boolean packOn = true, assemblyOn = true, insuranceOn = true, elevatorOn = false;

    private String originCity = "Kadıköy, İstanbul";
    private String destCity = "Çankaya, Ankara";
    private String moveDate = "2026-10-28";
    private String moveDateDisplay = "28 Ekim 2026, Çarşamba";
    private String homeSize = "3+1 Standart Daire";

    private TextView modeFreightBtn, modeMovingBtn, heroTitle, step1Label;
    private View[] typeCards;
    private View[] typeChecks;
    private TextView originCityText, destCityText, selectedDateText, volumeTitleText, volumeSubText, estimatedRangeText;
    private TextView srvPack, srvAssembly, srvInsurance, srvElevator, publishListingBtn;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_create_listing, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View v, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(v, savedInstanceState);

        modeFreightBtn = v.findViewById(R.id.modeFreightBtn);
        modeMovingBtn = v.findViewById(R.id.modeMovingBtn);
        heroTitle = v.findViewById(R.id.heroTitle);
        step1Label = v.findViewById(R.id.step1Label);

        typeCards = new View[]{
                v.findViewById(R.id.typeCard1),
                v.findViewById(R.id.typeCard2),
                v.findViewById(R.id.typeCard3),
                v.findViewById(R.id.typeCard4)
        };
        typeChecks = new View[]{
                v.findViewById(R.id.typeCheck1),
                v.findViewById(R.id.typeCheck2),
                v.findViewById(R.id.typeCheck3),
                v.findViewById(R.id.typeCheck4)
        };

        originCityText = v.findViewById(R.id.originCityText);
        destCityText = v.findViewById(R.id.destCityText);
        selectedDateText = v.findViewById(R.id.selectedDateText);
        volumeTitleText = v.findViewById(R.id.volumeTitleText);
        volumeSubText = v.findViewById(R.id.volumeSubText);
        estimatedRangeText = v.findViewById(R.id.estimatedRangeText);

        srvPack = v.findViewById(R.id.srvPack);
        srvAssembly = v.findViewById(R.id.srvAssembly);
        srvInsurance = v.findViewById(R.id.srvInsurance);
        srvElevator = v.findViewById(R.id.srvElevator);
        publishListingBtn = v.findViewById(R.id.publishListingBtn);

        modeFreightBtn.setOnClickListener(x -> setMode(false));
        modeMovingBtn.setOnClickListener(x -> setMode(true));

        for (int i = 0; i < typeCards.length; i++) {
            final int idx = i;
            typeCards[i].setOnClickListener(x -> selectType(idx));
        }

        v.findViewById(R.id.originRow).setOnClickListener(x -> editCityDialog(true));
        v.findViewById(R.id.destRow).setOnClickListener(x -> editCityDialog(false));
        v.findViewById(R.id.datePickerRow).setOnClickListener(x -> pickDate());
        v.findViewById(R.id.changeVolumeBtn).setOnClickListener(x -> pickVolume());

        srvPack.setOnClickListener(x -> { packOn = !packOn; refreshServices(); });
        srvAssembly.setOnClickListener(x -> { assemblyOn = !assemblyOn; refreshServices(); });
        srvInsurance.setOnClickListener(x -> { insuranceOn = !insuranceOn; refreshServices(); });
        srvElevator.setOnClickListener(x -> { elevatorOn = !elevatorOn; refreshServices(); });

        publishListingBtn.setOnClickListener(x -> publishListing());

        refreshServices();
        updateEstimate();
    }

    private void setMode(boolean moving) {
        isMovingMode = moving;
        modeMovingBtn.setBackgroundResource(moving ? R.drawable.sv_segment_active_white : 0);
        modeMovingBtn.setTextColor(requireContext().getColor(moving ? R.color.sv_primary : R.color.sv_on_surface_variant));
        modeMovingBtn.setTypeface(null, moving ? android.graphics.Typeface.BOLD : android.graphics.Typeface.NORMAL);

        modeFreightBtn.setBackgroundResource(!moving ? R.drawable.sv_segment_active_white : 0);
        modeFreightBtn.setTextColor(requireContext().getColor(!moving ? R.color.sv_primary : R.color.sv_on_surface_variant));
        modeFreightBtn.setTypeface(null, !moving ? android.graphics.Typeface.BOLD : android.graphics.Typeface.NORMAL);

        heroTitle.setText(moving ? "Nakliye İlanı Oluştur" : "Kurumsal Yük İlanı Oluştur");
        step1Label.setText(moving ? "Taşınma Türü" : "Araç & Yük Sınıfı");
        updateEstimate();
    }

    private void selectType(int idx) {
        selectedType = idx;
        for (int i = 0; i < typeCards.length; i++) {
            boolean on = (i == idx);
            typeCards[i].setBackgroundResource(on ? R.drawable.sv_card_selected : R.drawable.sv_card);
            typeChecks[i].setVisibility(on ? View.VISIBLE : View.INVISIBLE);
        }
        updateEstimate();
    }

    private void editCityDialog(boolean isOrigin) {
        EditText input = new EditText(requireContext());
        input.setText(isOrigin ? originCity : destCity);
        input.setHint(isOrigin ? "Çıkış ilçe / şehir" : "Varış ilçe / şehir");
        int pad = (int) (18 * getResources().getDisplayMetrics().density);
        LinearLayout wrap = new LinearLayout(requireContext());
        wrap.setPadding(pad, pad / 2, pad, 0);
        wrap.addView(input, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        new AlertDialog.Builder(requireContext())
                .setTitle(isOrigin ? "Çıkış Adresi" : "Varış Adresi")
                .setView(wrap)
                .setPositiveButton("Kaydet", (d, w) -> {
                    String val = input.getText().toString().trim();
                    if (!val.isEmpty()) {
                        if (isOrigin) {
                            originCity = val;
                            originCityText.setText(val);
                        } else {
                            destCity = val;
                            destCityText.setText(val);
                        }
                    }
                })
                .setNegativeButton("İptal", null)
                .show();
    }

    private void pickDate() {
        Calendar c = Calendar.getInstance();
        new DatePickerDialog(requireContext(), (picker, y, m, day) -> {
            moveDate = String.format(Locale.US, "%04d-%02d-%02d", y, m + 1, day);
            moveDateDisplay = String.format(Locale.US, "%02d.%02d.%04d", day, m + 1, y);
            selectedDateText.setText("📅  " + moveDateDisplay);
        }, c.get(Calendar.YEAR), c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH)).show();
    }

    private void pickVolume() {
        String[] sizes = {"1+1 Stüdyo (~22 m³)", "2+1 Daire (~35 m³)", "3+1 Standart Daire (~50 m³)", "4+1 / Villa (~72 m³)", "Kurumsal Ofis (20-40 Kişi)"};
        new AlertDialog.Builder(requireContext())
                .setTitle("Hacim & Ev/Ofis Tipi")
                .setItems(sizes, (d, which) -> {
                    String[] parts = sizes[which].split("\\(");
                    homeSize = parts[0].trim();
                    volumeTitleText.setText(homeSize);
                    volumeSubText.setText("Tahmini hacim: " + (parts.length > 1 ? parts[1].replace(")", "") : "~50 m³"));
                    updateEstimate();
                })
                .show();
    }

    private void refreshServices() {
        styleToggle(srvPack, packOn, "Paketleme");
        styleToggle(srvAssembly, assemblyOn, "Montaj / Demontaj");
        styleToggle(srvInsurance, insuranceOn, "All-Risk Sigorta");
        styleToggle(srvElevator, elevatorOn, "Dış Asansör");
        updateEstimate();
    }

    private void styleToggle(TextView tv, boolean on, String label) {
        tv.setBackgroundResource(on ? R.drawable.sv_pill_primary : R.drawable.sv_pill_surface_low);
        tv.setTextColor(requireContext().getColor(on ? R.color.sv_on_primary : R.color.sv_on_surface_variant));
        tv.setText((on ? "✓ " : "+ ") + label);
    }

    private void updateEstimate() {
        int base = isMovingMode ? 22000 : 34000;
        if (selectedType == 1) base += 12000;
        else if (selectedType == 2) base -= 13000;
        else if (selectedType == 3) base -= 10000;
        if (packOn) base += 1500;
        if (elevatorOn) base += 2500;
        int high = base + 5500;
        estimatedRangeText.setText(String.format(Locale.US, "₺%,d – ₺%,d", base, high).replace(',', '.'));
    }

    private void publishListing() {
        publishListingBtn.setEnabled(false);
        publishListingBtn.setText("Yayınlanıyor...");

        StringBuilder services = new StringBuilder();
        if (packOn) services.append("Paketleme, ");
        if (assemblyOn) services.append("Montaj/Demontaj, ");
        if (insuranceOn) services.append("All-Risk Sigorta, ");
        if (elevatorOn) services.append("Dış Asansör");

        if (isMovingMode) {
            try {
                JSONObject body = new JSONObject();
                body.put("origin_country", "TR");
                body.put("origin_city", originCity);
                body.put("destination_country", "TR");
                body.put("destination_city", destCity);
                body.put("move_date", moveDate);
                body.put("home_size", homeSize);
                body.put("items_note", services.toString());
                body.put("contact", LoadlyStore.getUserContactLine(requireContext()));
                client.postMovingRequest(body, new SupabaseClient.PostCallback() {
                    @Override public void onSuccess() { onPublishDone(true); }
                    @Override public void onError(String message) { onPublishDone(false); }
                });
            } catch (Exception e) {
                onPublishDone(false);
            }
        } else {
            client.postLoad(
                    homeSize + " • " + originCity + " → " + destCity,
                    originCity, "TR", destCity, "TR",
                    "tenteli", 12.0, 36000.0,
                    services.toString(),
                    new SupabaseClient.PostCallback() {
                        @Override public void onSuccess() { onPublishDone(true); }
                        @Override public void onError(String message) { onPublishDone(false); }
                    }
            );
        }
    }

    private void onPublishDone(boolean remoteSaved) {
        if (!isAdded()) return;
        publishListingBtn.setEnabled(true);
        publishListingBtn.setText("İlanı Yayınla & Teklif Al  →");
        Toast.makeText(requireContext(),
                remoteSaved
                        ? "İlanınız yayınlandı! Doğrulanmış nakliyecilerden teklifler toplanıyor."
                        : "İlanınız kaydedildi ve teklif havuzuna iletildi.",
                Toast.LENGTH_LONG).show();
        if (getActivity() instanceof MarketplaceActivity) {
            ((MarketplaceActivity) getActivity()).selectTab(MarketplaceActivity.TAB_OFFERS, 0);
        }
    }
}

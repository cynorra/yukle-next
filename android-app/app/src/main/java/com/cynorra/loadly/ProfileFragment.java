package com.cynorra.loadly;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import com.google.android.material.bottomsheet.BottomSheetDialog;

/**
 * Tab 5: Profil & Ayarlar (Silent Vector).
 * Matches design/profil_ayarlar/code.html and includes the 2-step Account Deletion modal
 * shown in design/profil_ayarlar/screen.png.
 */
public class ProfileFragment extends Fragment {

    private TextView notifStatusText;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_profile, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View v, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(v, savedInstanceState);

        ((TextView) v.findViewById(R.id.profileInitials)).setText(LoadlyStore.getUserInitials(requireContext()));
        ((TextView) v.findViewById(R.id.profileName)).setText(LoadlyStore.getUserName(requireContext()));
        ((TextView) v.findViewById(R.id.profileContact)).setText(LoadlyStore.getUserContactLine(requireContext()));
        notifStatusText = v.findViewById(R.id.notifStatusText);
        updateNotifLabel();

        v.findViewById(R.id.guaranteeDetailBtn).setOnClickListener(x ->
                new AlertDialog.Builder(requireContext())
                        .setTitle("Loadly Güvenli Taşıma Garantisi")
                        .setMessage("Tüm K1/K2 yetkili taşımalar ₺1.500.000 All-Risk Emtia Sigortası ve Loadly Güvenli Havuz Hesabı ile korunur.")
                        .setPositiveButton("Tamam", null).show());

        v.findViewById(R.id.kpiActiveListings).setOnClickListener(x -> nav(MarketplaceActivity.TAB_EXPLORE, 0));
        v.findViewById(R.id.kpiIncomingOffers).setOnClickListener(x -> nav(MarketplaceActivity.TAB_OFFERS, OffersFragment.SUB_INCOMING));
        v.findViewById(R.id.kpiCompleted).setOnClickListener(x -> nav(MarketplaceActivity.TAB_OFFERS, OffersFragment.SUB_PAST));

        v.findViewById(R.id.rowActiveListings).setOnClickListener(x -> nav(MarketplaceActivity.TAB_OFFERS, OffersFragment.SUB_INCOMING));
        v.findViewById(R.id.rowPastMoves).setOnClickListener(x -> nav(MarketplaceActivity.TAB_OFFERS, OffersFragment.SUB_PAST));
        v.findViewById(R.id.rowAddresses).setOnClickListener(x ->
                Toast.makeText(requireContext(), "Kayıtlı Adresler: Ev (Fenerbahçe), Ofis (Maslak), Yazlık (Urla)", Toast.LENGTH_SHORT).show());
        v.findViewById(R.id.rowEscrow).setOnClickListener(x ->
                Toast.makeText(requireContext(), "Güvenli Havuz bakiyeniz: ₺0,00 (Aktif bloke bulunmuyor)", Toast.LENGTH_SHORT).show());
        v.findViewById(R.id.rowInsurance).setOnClickListener(x ->
                Toast.makeText(requireContext(), "Anadolu Sigorta All-Risk Poliçesi aktif.", Toast.LENGTH_SHORT).show());

        v.findViewById(R.id.rowNotifications).setOnClickListener(x -> {
            boolean nowOn = !LoadlyApplication.isPushEnabled(requireContext());
            LoadlyApplication.setPushEnabled(requireContext(), nowOn);
            updateNotifLabel();
            Toast.makeText(requireContext(), nowOn ? "Bildirimler açıldı." : "Bildirimler kapatıldı.", Toast.LENGTH_SHORT).show();
        });

        v.findViewById(R.id.rowSupportCall).setOnClickListener(x ->
                startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse("tel:08502554400"))));

        v.findViewById(R.id.rowKvkk).setOnClickListener(x ->
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://loadlyapp.com/en/privacy"))));

        v.findViewById(R.id.rowClearData).setOnClickListener(x ->
                new AlertDialog.Builder(requireContext())
                        .setTitle("Hesap Verilerini Temizle")
                        .setMessage("Yerel teklif taslakları ve mesaj önbelleği sıfırlanacaktır. Devam edilsin mi?")
                        .setPositiveButton("Temizle", (d, w) -> {
                            LoadlyStore.clearLocalData(requireContext());
                            Toast.makeText(requireContext(), "Yerel hesap verileri temizlendi.", Toast.LENGTH_SHORT).show();
                        })
                        .setNegativeButton("Vazgeç", null)
                        .show());

        v.findViewById(R.id.rowDeleteAccount).setOnClickListener(x -> showDeleteAccountSheet());
    }

    private void nav(int tab, int subTab) {
        if (getActivity() instanceof MarketplaceActivity) {
            ((MarketplaceActivity) getActivity()).selectTab(tab, subTab);
        }
    }

    private void updateNotifLabel() {
        boolean on = LoadlyApplication.isPushEnabled(requireContext());
        notifStatusText.setText("Anlık İleti & Yeni Teklif Bildirimleri: " + (on ? "Açık" : "Kapalı"));
    }

    private void showDeleteAccountSheet() {
        BottomSheetDialog dialog = new BottomSheetDialog(requireContext());
        View sheet = LayoutInflater.from(requireContext()).inflate(R.layout.dialog_delete_account, null);
        dialog.setContentView(sheet);

        EditText smsCodeInput = sheet.findViewById(R.id.smsCodeInput);
        EditText phraseInput = sheet.findViewById(R.id.confirmPhraseInput);

        sheet.findViewById(R.id.closeDeleteModal).setOnClickListener(v -> dialog.dismiss());
        sheet.findViewById(R.id.cancelDeleteBtn).setOnClickListener(v -> dialog.dismiss());
        sheet.findViewById(R.id.confirmDeleteBtn).setOnClickListener(v -> {
            String code = smsCodeInput.getText().toString().trim();
            String phrase = phraseInput.getText().toString().trim();
            if (code.length() < 6) {
                Toast.makeText(requireContext(), "Lütfen 6 haneli SMS doğrulama kodunu girin.", Toast.LENGTH_SHORT).show();
                return;
            }
            if (!"HESABIMI SİL".equalsIgnoreCase(phrase) && !"HESABIMI SIL".equalsIgnoreCase(phrase)) {
                Toast.makeText(requireContext(), "Son onay için 'HESABIMI SİL' yazmalısınız.", Toast.LENGTH_SHORT).show();
                return;
            }
            LoadlyStore.clearLocalData(requireContext());
            dialog.dismiss();
            Toast.makeText(requireContext(), "Hesap silme talebiniz KVKK kapsamında işleme alındı ve yerel veriler imha edildi.", Toast.LENGTH_LONG).show();
        });

        dialog.show();
    }
}

package com.cynorra.loadly;

import android.content.Intent;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.Gravity;
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

import java.util.List;

/**
 * Tab 3: Teklifler — Houses all 3 Silent Vector offer screens:
 *  - Sub-tab 0: Gelen Teklifler (gelen_teklifler)
 *  - Sub-tab 1: Verdiğim Teklifler (verdi_im_teklifler)
 *  - Sub-tab 2: Geçmiş Taşınmalar (ge_mi_ta_nmalar)
 */
public class OffersFragment extends Fragment {

    private static final String ARG_SUB_TAB = "sub_tab";
    public static final int SUB_INCOMING = 0;
    public static final int SUB_SENT = 1;
    public static final int SUB_PAST = 2;

    private int activeSubTab = SUB_INCOMING;
    private TextView subTabIncoming, subTabSent, subTabPast;
    private LinearLayout contentHost;
    private int sentFilter = 0; // 0 = all, 1 = counter, 2 = review

    public static OffersFragment newInstance(int subTab) {
        OffersFragment f = new OffersFragment();
        Bundle b = new Bundle();
        b.putInt(ARG_SUB_TAB, subTab);
        f.setArguments(b);
        return f;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_offers, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View v, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(v, savedInstanceState);
        if (getArguments() != null) {
            activeSubTab = getArguments().getInt(ARG_SUB_TAB, SUB_INCOMING);
        }
        subTabIncoming = v.findViewById(R.id.subTabIncoming);
        subTabSent = v.findViewById(R.id.subTabSent);
        subTabPast = v.findViewById(R.id.subTabPast);
        contentHost = v.findViewById(R.id.offersContentHost);

        subTabIncoming.setOnClickListener(x -> selectSubTab(SUB_INCOMING));
        subTabSent.setOnClickListener(x -> selectSubTab(SUB_SENT));
        subTabPast.setOnClickListener(x -> selectSubTab(SUB_PAST));

        selectSubTab(activeSubTab);
    }

    private void selectSubTab(int tab) {
        activeSubTab = tab;
        List<LoadlyStore.IncomingOffer> inc = LoadlyStore.getIncomingOffers(requireContext());
        List<LoadlyStore.SentOffer> sent = LoadlyStore.getSentOffers(requireContext());

        subTabIncoming.setText("Gelen (" + inc.size() + ")");
        subTabSent.setText("Verdiğim (" + sent.size() + ")");
        subTabPast.setText("Geçmiş (4)");

        styleSeg(subTabIncoming, tab == SUB_INCOMING, false);
        styleSeg(subTabSent, tab == SUB_SENT, true);
        styleSeg(subTabPast, tab == SUB_PAST, true);

        contentHost.removeAllViews();
        if (tab == SUB_INCOMING) renderIncoming(inc);
        else if (tab == SUB_SENT) renderSent(sent);
        else renderPast();
    }

    private void styleSeg(TextView tv, boolean active, boolean darkPill) {
        if (active) {
            tv.setBackgroundResource(darkPill ? R.drawable.sv_btn_primary : R.drawable.sv_segment_active_white);
            tv.setTextColor(requireContext().getColor(darkPill ? R.color.sv_on_primary : R.color.sv_primary));
            tv.setTypeface(null, Typeface.BOLD);
        } else {
            tv.setBackgroundResource(0);
            tv.setTextColor(requireContext().getColor(R.color.sv_on_surface_variant));
            tv.setTypeface(null, Typeface.NORMAL);
        }
    }

    // ==================== SUB-TAB 0: GELEN TEKLİFLER ====================

    private void renderIncoming(List<LoadlyStore.IncomingOffer> offers) {
        String acceptedId = LoadlyStore.getAcceptedIncomingId(requireContext());

        // Active Listing Summary Card
        LinearLayout summary = card();
        LinearLayout topRow = row();
        TextView status = txt("● Teklif Toplanıyor", 13, R.color.sv_primary, true);
        TextView rem = txt("Kalan: 14 sa 20 dk", 11, R.color.sv_outline, false);
        rem.setTypeface(Typeface.MONOSPACE);
        topRow.addView(status, weight1());
        topRow.addView(rem);
        summary.addView(topRow);

        summary.addView(marginTop(txt("Kadıköy, İst → Çankaya, Ank", 15, R.color.sv_primary, true), 6));
        summary.addView(marginTop(txt("3+1 Standart Daire • 4. Kat (Asansörlü) • 12 Mayıs", 12, R.color.sv_on_surface_variant, false), 2));

        LinearLayout marketRow = box(R.drawable.sv_surface_low_box, 10);
        marketRow.setOrientation(LinearLayout.HORIZONTAL);
        marketRow.setGravity(Gravity.CENTER_VERTICAL);
        TextView mLabel = txt("Piyasa Ortalaması: ", 12, R.color.sv_on_surface_variant, false);
        TextView mPrice = txt("₺26.200", 13, R.color.sv_primary, true);
        mPrice.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
        TextView mTag = pill("Dengeli", R.drawable.sv_pill_white, R.color.sv_on_surface_variant);
        marketRow.addView(mLabel);
        marketRow.addView(mPrice, weight1());
        marketRow.addView(mTag);
        summary.addView(marginTop(marketRow, 10));
        contentHost.addView(summary);

        // Section Header
        LinearLayout sec = row();
        sec.addView(txt("Teklifler (" + offers.size() + ")", 14, R.color.sv_primary, true), weight1());
        sec.addView(pill("⇅ En Uygun Fiyat", R.drawable.sv_pill_surface_low, R.color.sv_primary));
        contentHost.addView(marginTop(sec, 14));

        // Carrier Bid Cards
        for (LoadlyStore.IncomingOffer o : offers) {
            boolean isAccepted = o.id.equals(acceptedId);
            LinearLayout c = card();

            // Top Badge + Time
            LinearLayout top = row();
            TextView b = pill(
                    (o.badgeHighlight ? "✓ " : "") + o.badgeText,
                    o.badgeHighlight ? R.drawable.sv_pill_emerald : R.drawable.sv_pill_surface_low,
                    o.badgeHighlight ? R.color.sv_on_tertiary_fixed : R.color.sv_secondary
            );
            TextView t = txt(o.timeAgo, 11, R.color.sv_outline, false);
            t.setTypeface(Typeface.MONOSPACE);
            top.addView(b);
            top.addView(spacer());
            top.addView(t);
            c.addView(top);

            // Carrier Row + Price
            LinearLayout carrierRow = row();
            carrierRow.setGravity(Gravity.CENTER_VERTICAL);

            TextView avatar = new TextView(requireContext());
            avatar.setText(o.carrierInitials);
            avatar.setTextColor(requireContext().getColor(R.color.sv_primary));
            avatar.setTextSize(13f);
            avatar.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
            avatar.setGravity(Gravity.CENTER);
            avatar.setBackgroundResource(R.drawable.sv_surface_container_box);
            int avSize = dp(42);
            LinearLayout.LayoutParams avLp = new LinearLayout.LayoutParams(avSize, avSize);
            avLp.setMarginEnd(dp(10));
            carrierRow.addView(avatar, avLp);

            LinearLayout carrierMeta = col();
            TextView nameTv = txt(o.carrierName + " ✓", 14, R.color.sv_primary, true);
            nameTv.setOnClickListener(v -> openCarrierVerification(o));
            carrierMeta.addView(nameTv);

            LinearLayout subMeta = row();
            subMeta.setGravity(Gravity.CENTER_VERTICAL);
            TextView lic = pill(o.licenseBadge, R.drawable.sv_pill_surface_low, R.color.sv_on_surface_variant);
            lic.setOnClickListener(v -> openCarrierVerification(o));
            TextView rat = txt("  ★ " + o.rating + " (" + o.reviewCount + ")", 12, R.color.sv_primary, true);
            rat.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
            rat.setOnClickListener(v -> openCarrierReviews(o));
            subMeta.addView(lic);
            subMeta.addView(rat);
            carrierMeta.addView(marginTop(subMeta, 4));
            carrierRow.addView(carrierMeta, weight1());

            LinearLayout priceCol = col();
            priceCol.setGravity(Gravity.END);
            TextView pTv = txt(o.price, 16, R.color.sv_primary, true);
            pTv.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
            TextView pSub = txt(o.priceSub, 10, R.color.sv_outline, false);
            priceCol.addView(pTv);
            priceCol.addView(pSub);
            carrierRow.addView(priceCol);
            c.addView(marginTop(carrierRow, 10));

            // Features Box
            LinearLayout featBox = box(R.drawable.sv_surface_low_box, 12);
            for (int i = 0; i < o.features.length; i++) {
                TextView ft = txt("•  " + o.features[i], 12, R.color.sv_on_surface, false);
                featBox.addView(i == 0 ? ft : marginTop(ft, 4));
            }
            c.addView(marginTop(featBox, 10));

            if (o.insuranceLine != null) {
                TextView ins = txt("🛡  " + o.insuranceLine, 11, R.color.sv_on_surface_variant, false);
                ins.setTypeface(Typeface.MONOSPACE);
                c.addView(marginTop(ins, 8));
            }

            // Action Buttons
            LinearLayout actions = row();
            TextView acceptBtn = button(
                    isAccepted ? "✓ Rezerve Edildi" : o.primaryCtaText,
                    (isAccepted || o.primaryCta) ? R.drawable.sv_btn_primary : R.drawable.sv_btn_secondary,
                    (isAccepted || o.primaryCta) ? R.color.sv_on_primary : R.color.sv_primary
            );
            acceptBtn.setOnClickListener(v -> {
                if ("Teklifi İncele ›".equals(o.primaryCtaText)) {
                    openCarrierVerification(o);
                } else {
                    LoadlyStore.setAcceptedIncomingId(requireContext(), o.id);
                    Toast.makeText(requireContext(), o.carrierName + " teklifi onaylandı! Ödemeniz güvenli havuz korumasında.", Toast.LENGTH_LONG).show();
                    selectSubTab(SUB_INCOMING);
                }
            });
            actions.addView(acceptBtn, weight1());

            TextView msgBtn = button(o.secondaryCtaText, R.drawable.sv_btn_secondary, R.color.sv_primary);
            LinearLayout.LayoutParams msgLp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, dp(42));
            msgLp.setMarginStart(dp(8));
            msgBtn.setPadding(dp(14), 0, dp(14), 0);
            msgBtn.setOnClickListener(v -> {
                if (getActivity() instanceof MarketplaceActivity) {
                    ((MarketplaceActivity) getActivity()).selectTab(MarketplaceActivity.TAB_MESSAGES);
                }
            });
            actions.addView(msgBtn, msgLp);

            TextView verifyBtn = button("Belge", R.drawable.sv_btn_outline, R.color.sv_secondary);
            LinearLayout.LayoutParams verLp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, dp(42));
            verLp.setMarginStart(dp(6));
            verifyBtn.setPadding(dp(10), 0, dp(10), 0);
            verifyBtn.setOnClickListener(v -> openCarrierVerification(o));
            actions.addView(verifyBtn, verLp);

            c.addView(marginTop(actions, 12));
            contentHost.addView(marginTop(c, 12));
        }

        // Escrow Footer Card
        LinearLayout escrow = box(R.drawable.sv_surface_low_box, 16);
        escrow.addView(txt("🛡  Loadly Güvenli Havuz Koruması", 13, R.color.sv_primary, true));
        escrow.addView(marginTop(txt("Teklifi onayladığınızda ödemeniz güvende tutulur; eşyalarınız hasarsız ve eksiksiz teslim edilip onayınız alınana kadar nakliyeciye aktarılmaz.", 12, R.color.sv_on_surface_variant, false), 4));
        escrow.addView(marginTop(txt("Nasıl Çalışır? →   •   7/24 Operasyonel Tahkim", 11, R.color.sv_secondary, true), 8));
        contentHost.addView(marginTop(escrow, 14));
    }

    // ==================== SUB-TAB 1: VERDİĞİM TEKLİFLER ====================

    private void renderSent(List<LoadlyStore.SentOffer> offers) {
        int counterCount = 0;
        for (LoadlyStore.SentOffer s : offers) {
            if ("counter".equals(s.status)) counterCount++;
        }

        // Filter Pills
        LinearLayout filters = row();
        TextView fAll = pill("Tümü (" + offers.size() + ")", sentFilter == 0 ? R.drawable.sv_pill_primary : R.drawable.sv_pill_white, sentFilter == 0 ? R.color.sv_on_primary : R.color.sv_on_surface_variant);
        TextView fCounter = pill("Karşı Teklif Geldi (" + counterCount + ")", sentFilter == 1 ? R.drawable.sv_pill_primary : R.drawable.sv_pill_white, sentFilter == 1 ? R.color.sv_on_primary : R.color.sv_on_surface_variant);
        TextView fWait = pill("Bekleyen", sentFilter == 2 ? R.drawable.sv_pill_primary : R.drawable.sv_pill_white, sentFilter == 2 ? R.color.sv_on_primary : R.color.sv_on_surface_variant);
        fAll.setOnClickListener(v -> { sentFilter = 0; selectSubTab(SUB_SENT); });
        fCounter.setOnClickListener(v -> { sentFilter = 1; selectSubTab(SUB_SENT); });
        fWait.setOnClickListener(v -> { sentFilter = 2; selectSubTab(SUB_SENT); });
        filters.addView(fAll);
        filters.addView(marginStart(fCounter, 8));
        filters.addView(marginStart(fWait, 8));
        contentHost.addView(filters);

        for (LoadlyStore.SentOffer s : offers) {
            if (sentFilter == 1 && !"counter".equals(s.status)) continue;
            if (sentFilter == 2 && !"review".equals(s.status)) continue;

            LinearLayout c = card();
            boolean isCounter = "counter".equals(s.status);
            boolean isAccepted = "accepted".equals(s.status);

            // Status Row
            LinearLayout top = row();
            TextView stPill = pill(
                    "● " + s.statusLabel,
                    isAccepted ? R.drawable.sv_pill_emerald : (isCounter ? R.drawable.sv_pill_blue_soft : R.drawable.sv_pill_surface_low),
                    isAccepted ? R.color.sv_on_tertiary_fixed : (isCounter ? R.color.sv_secondary : R.color.sv_on_surface_variant)
            );
            TextView rightMeta = txt(s.metaRight, 11, isCounter ? R.color.sv_error : R.color.sv_outline, false);
            rightMeta.setTypeface(Typeface.MONOSPACE);
            top.addView(stPill);
            top.addView(spacer());
            top.addView(rightMeta);
            c.addView(top);

            // Route + Distance
            LinearLayout rRow = row();
            rRow.addView(txt(s.route, 15, R.color.sv_primary, true), weight1());
            TextView dist = txt(s.distance, 11, R.color.sv_outline, false);
            dist.setTypeface(Typeface.MONOSPACE);
            rRow.addView(dist);
            c.addView(marginTop(rRow, 10));

            c.addView(marginTop(txt("📅  " + s.dateAndType, 12, R.color.sv_on_surface_variant, false), 4));

            if (isCounter) {
                LinearLayout comp = box(R.drawable.sv_surface_low_box, 12);
                LinearLayout prices = row();
                LinearLayout leftP = col();
                leftP.addView(txt("BENİM TEKLİFİM", 10, R.color.sv_outline, false));
                TextView oldP = txt(s.myPrice, 14, R.color.sv_outline, false);
                oldP.setTypeface(Typeface.MONOSPACE);
                oldP.setPaintFlags(oldP.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
                leftP.addView(oldP);

                LinearLayout rightP = col();
                rightP.setGravity(Gravity.END);
                rightP.addView(txt("MÜŞTERİNİN TEKLİFİ", 10, R.color.sv_secondary, true));
                TextView newP = txt(s.counterPrice, 17, R.color.sv_secondary, true);
                newP.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
                rightP.addView(newP);

                prices.addView(leftP, weight1());
                prices.addView(rightP);
                comp.addView(prices);

                if (s.counterQuote != null && !s.counterQuote.isEmpty()) {
                    LinearLayout quoteBox = box(R.drawable.sv_card, 10);
                    TextView qt = txt(s.counterQuote, 12, R.color.sv_on_surface_variant, false);
                    qt.setTypeface(null, Typeface.ITALIC);
                    quoteBox.addView(qt);
                    comp.addView(marginTop(quoteBox, 8));
                }
                c.addView(marginTop(comp, 10));

                TextView approveBtn = button("✓  Karşı Teklifi Onayla (" + s.counterPrice + ")", R.drawable.sv_btn_primary, R.color.sv_on_primary);
                approveBtn.setOnClickListener(v -> {
                    s.status = "accepted";
                    s.statusLabel = "Onaylandı";
                    s.myPrice = s.counterPrice;
                    s.metaRight = "Sözleşme Hazır";
                    LoadlyStore.saveSentOffers(requireContext(), offers);
                    Toast.makeText(requireContext(), "Karşı teklif onaylandı! Dijital taşıma sözleşmesi oluşturuldu.", Toast.LENGTH_LONG).show();
                    selectSubTab(SUB_SENT);
                });
                c.addView(marginTop(approveBtn, 12));

                LinearLayout subActions = row();
                TextView rebidBtn = button("✎ Yeni Fiyat Ver", R.drawable.sv_btn_secondary, R.color.sv_primary);
                rebidBtn.setOnClickListener(v -> updateBidPriceDialog(offers, s));
                TextView msgBtn = button("💬 Mesaj", R.drawable.sv_btn_secondary, R.color.sv_primary);
                msgBtn.setOnClickListener(v -> {
                    if (getActivity() instanceof MarketplaceActivity) {
                        ((MarketplaceActivity) getActivity()).selectTab(MarketplaceActivity.TAB_MESSAGES);
                    }
                });
                subActions.addView(rebidBtn, weight1());
                LinearLayout.LayoutParams mp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(42));
                mp.setMarginStart(dp(8));
                msgBtn.setPadding(dp(16), 0, dp(16), 0);
                subActions.addView(msgBtn, mp);
                c.addView(marginTop(subActions, 8));
            } else {
                LinearLayout amtBox = box(R.drawable.sv_surface_low_box, 12);
                amtBox.setOrientation(LinearLayout.HORIZONTAL);
                amtBox.setGravity(Gravity.CENTER_VERTICAL);
                LinearLayout left = col();
                left.addView(txt("TEKLİF TUTARI (KDV DAHİL)", 10, R.color.sv_outline, false));
                left.addView(txt(s.detailsLine != null ? s.detailsLine : "Sigorta + Uzman Ekip", 12, R.color.sv_on_surface_variant, false));
                TextView pTv = txt(s.myPrice, 16, R.color.sv_primary, true);
                pTv.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
                amtBox.addView(left, weight1());
                amtBox.addView(pTv);
                c.addView(marginTop(amtBox, 10));

                LinearLayout meta = row();
                meta.addView(txt(s.competingNote != null ? s.competingNote : "", 11, R.color.sv_on_surface_variant, false), weight1());
                TextView code = txt(s.listingCode != null ? s.listingCode : "", 11, R.color.sv_outline, false);
                code.setTypeface(Typeface.MONOSPACE);
                meta.addView(code);
                c.addView(marginTop(meta, 8));

                if (!isAccepted) {
                    LinearLayout act = row();
                    TextView withdraw = button("× Teklifi Geri Çek", R.drawable.sv_btn_danger_soft, R.color.sv_error);
                    withdraw.setOnClickListener(v -> {
                        offers.remove(s);
                        LoadlyStore.saveSentOffers(requireContext(), offers);
                        Toast.makeText(requireContext(), "Teklifiniz geri çekildi.", Toast.LENGTH_SHORT).show();
                        selectSubTab(SUB_SENT);
                    });
                    TextView upd = button("✎ Teklifi Güncelle", R.drawable.sv_btn_secondary, R.color.sv_primary);
                    upd.setOnClickListener(v -> updateBidPriceDialog(offers, s));
                    act.addView(withdraw, weight1());
                    LinearLayout.LayoutParams upLp = weight1();
                    upLp.setMarginStart(dp(8));
                    act.addView(upd, upLp);
                    c.addView(marginTop(act, 10));
                }
            }
            contentHost.addView(marginTop(c, 12));
        }

        LinearLayout info = box(R.drawable.sv_surface_low_box, 16);
        info.addView(txt("🛡  Loadly Şeffaf İhale Güvencesi", 13, R.color.sv_primary, true));
        info.addView(marginTop(txt("Verdiğiniz teklifler müşteri tarafından kabul edilene kadar bağlayıcı taahhüt oluşturmaz. Kabul sonrası dijital nakliye sözleşmesi ve güvenli havuz hesabı devreye girer.", 12, R.color.sv_on_surface_variant, false), 4));
        contentHost.addView(marginTop(info, 14));
    }

    private void updateBidPriceDialog(List<LoadlyStore.SentOffer> offers, LoadlyStore.SentOffer s) {
        EditText input = new EditText(requireContext());
        input.setText(s.myPrice);
        input.setHint("Yeni teklif tutarı");
        new AlertDialog.Builder(requireContext())
                .setTitle("Teklif Tutarını Güncelle")
                .setView(input)
                .setPositiveButton("Güncelle", (d, w) -> {
                    String val = input.getText().toString().trim();
                    if (!val.isEmpty()) {
                        s.myPrice = val.startsWith("₺") ? val : "₺" + val;
                        s.metaRight = "Az önce güncellendi";
                        LoadlyStore.saveSentOffers(requireContext(), offers);
                        selectSubTab(SUB_SENT);
                    }
                })
                .setNegativeButton("İptal", null)
                .show();
    }

    // ==================== SUB-TAB 2: GEÇMİŞ TAŞINMALAR ====================

    private void renderPast() {
        // 3 KPI Metric Pods
        LinearLayout kpis = row();
        kpis.addView(kpiPod("Toplam", "4", "sefer"), weight1());
        LinearLayout mid = kpiPod("Hacim", "₺82.500", "");
        LinearLayout.LayoutParams midLp = weight1();
        midLp.setMarginStart(dp(8));
        midLp.setMarginEnd(dp(8));
        kpis.addView(mid, midLp);
        kpis.addView(kpiPod("★ Puan", "5.0", "Kusursuz"), weight1());
        contentHost.addView(kpis);

        // Filter Pills
        LinearLayout filters = row();
        filters.addView(pill("Tümü (4)", R.drawable.sv_pill_primary, R.color.sv_on_primary));
        filters.addView(marginStart(pill("Başarıyla Tamamlanan (4)", R.drawable.sv_pill_white, R.color.sv_on_surface_variant), 8));
        contentHost.addView(marginTop(filters, 12));

        for (LoadlyStore.PastMove m : LoadlyStore.getPastMoves()) {
            LinearLayout c = card();

            LinearLayout top = row();
            top.setGravity(Gravity.CENTER_VERTICAL);
            LinearLayout titleCol = col();
            titleCol.addView(txt((m.isOffice ? "🏢  " : "🏠  ") + m.title, 14, R.color.sv_primary, true));
            titleCol.addView(txt(m.date, 11, R.color.sv_outline, false));
            top.addView(titleCol, weight1());
            top.addView(pill("● Tamamlandı", R.drawable.sv_pill_emerald_soft, R.color.sv_emerald));
            c.addView(top);

            // Route Box
            LinearLayout routeBox = box(R.drawable.sv_surface_low_box, 12);
            LinearLayout r1 = row();
            r1.addView(txt("●  " + m.origin, 13, R.color.sv_primary, true), weight1());
            r1.addView(txt("Çıkış", 11, R.color.sv_outline, false));
            LinearLayout r2 = row();
            r2.addView(txt("●  " + m.destination, 13, R.color.sv_primary, true), weight1());
            r2.addView(txt("Teslim", 11, R.color.sv_outline, false));
            routeBox.addView(r1);
            routeBox.addView(marginTop(r2, 6));
            c.addView(marginTop(routeBox, 10));

            // Carrier + Price Row
            LinearLayout carRow = row();
            carRow.setGravity(Gravity.CENTER_VERTICAL);
            TextView av = new TextView(requireContext());
            av.setText(m.carrierInitials);
            av.setGravity(Gravity.CENTER);
            av.setBackgroundResource(R.drawable.sv_circle_surface);
            av.setTextColor(requireContext().getColor(R.color.sv_primary));
            av.setTextSize(12f);
            av.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
            LinearLayout.LayoutParams avLp = new LinearLayout.LayoutParams(dp(36), dp(36));
            avLp.setMarginEnd(dp(10));
            carRow.addView(av, avLp);

            LinearLayout carMeta = col();
            carMeta.addView(txt(m.carrierName, 13, R.color.sv_primary, true));
            carMeta.addView(txt("★ " + m.ratingSummary, 11, R.color.sv_amber, false));
            carRow.addView(carMeta, weight1());

            LinearLayout pr = col();
            pr.setGravity(Gravity.END);
            TextView prVal = txt(m.price, 15, R.color.sv_primary, true);
            prVal.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
            pr.addView(prVal);
            pr.addView(txt(m.paymentNote, 10, R.color.sv_outline, false));
            carRow.addView(pr);
            c.addView(marginTop(carRow, 12));

            if (m.quote != null) {
                LinearLayout qBox = box(R.drawable.sv_surface_low_box, 10);
                TextView qt = txt("❝ " + m.quote, 12, R.color.sv_on_surface_variant, false);
                qt.setTypeface(null, Typeface.ITALIC);
                qBox.addView(qt);
                c.addView(marginTop(qBox, 10));
            } else if (m.insuranceBadge != null) {
                LinearLayout insRow = box(R.drawable.sv_surface_low_box, 10);
                insRow.setOrientation(LinearLayout.HORIZONTAL);
                insRow.addView(txt("🛡 " + m.insuranceBadge, 11, R.color.sv_on_surface, false), weight1());
                insRow.addView(txt(m.invoiceBadge, 11, R.color.sv_primary, true));
                c.addView(marginTop(insRow, 10));
            }

            // Actions
            LinearLayout acts = row();
            TextView leftBtn = button(m.leftAction, R.drawable.sv_btn_secondary, R.color.sv_primary);
            leftBtn.setOnClickListener(v -> Toast.makeText(requireContext(), m.leftAction + " dijital arşivden hazırlandı.", Toast.LENGTH_SHORT).show());
            TextView rightBtn = button(
                    m.rightAction,
                    m.rightActionPrimary ? R.drawable.sv_btn_primary : R.drawable.sv_btn_secondary,
                    m.rightActionPrimary ? R.color.sv_on_primary : R.color.sv_primary
            );
            rightBtn.setOnClickListener(v -> {
                if (m.rightActionPrimary && getActivity() instanceof MarketplaceActivity) {
                    ((MarketplaceActivity) getActivity()).selectTab(MarketplaceActivity.TAB_CREATE);
                } else {
                    Toast.makeText(requireContext(), "E-Arşiv faturanız indirildi.", Toast.LENGTH_SHORT).show();
                }
            });
            acts.addView(leftBtn, weight1());
            LinearLayout.LayoutParams rLp = weight1();
            rLp.setMarginStart(dp(8));
            acts.addView(rightBtn, rLp);
            c.addView(marginTop(acts, 12));

            contentHost.addView(marginTop(c, 12));
        }

        // Archive Footer
        LinearLayout archive = box(R.drawable.sv_surface_low_box, 16);
        archive.addView(txt("🔒  Dijital Arşiv Garantisi  ·  10 Yıl Kasa", 13, R.color.sv_primary, true));
        archive.addView(marginTop(txt("Tamamlanan tüm taşınmaların dijital taşıma sözleşmeleri, sigorta poliçeleri ve sevk irsaliyeleri T.C. mevzuatına tam uyumlu olarak 10 yıl boyunca Loadly kasanızda güvenle saklanır.", 12, R.color.sv_on_surface_variant, false), 4));
        contentHost.addView(marginTop(archive, 14));
    }

    private void openCarrierVerification(LoadlyStore.IncomingOffer o) {
        Intent i = new Intent(requireContext(), CarrierVerificationActivity.class);
        i.putExtra(CarrierVerificationActivity.EXTRA_CARRIER_NAME, o.carrierName);
        i.putExtra(CarrierVerificationActivity.EXTRA_PRICE, o.price);
        i.putExtra(CarrierVerificationActivity.EXTRA_RATING, o.rating);
        startActivity(i);
    }

    private void openCarrierReviews(LoadlyStore.IncomingOffer o) {
        Intent i = new Intent(requireContext(), CarrierReviewsActivity.class);
        i.putExtra(CarrierReviewsActivity.EXTRA_CARRIER_NAME, o.carrierName);
        i.putExtra(CarrierReviewsActivity.EXTRA_PRICE, o.price);
        i.putExtra(CarrierReviewsActivity.EXTRA_RATING, o.rating);
        i.putExtra(CarrierReviewsActivity.EXTRA_COUNT, o.reviewCount);
        startActivity(i);
    }

    // ==================== UI BUILDER HELPERS ====================

    private int dp(int v) { return (int) (v * getResources().getDisplayMetrics().density); }
    private LinearLayout.LayoutParams weight1() { return new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f); }
    private View spacer() { View v = new View(requireContext()); v.setLayoutParams(weight1()); return v; }
    private LinearLayout row() { LinearLayout l = new LinearLayout(requireContext()); l.setOrientation(LinearLayout.HORIZONTAL); return l; }
    private LinearLayout col() { LinearLayout l = new LinearLayout(requireContext()); l.setOrientation(LinearLayout.VERTICAL); return l; }
    private LinearLayout card() { return box(R.drawable.sv_card, 16); }

    private LinearLayout box(int bgRes, int padDp) {
        LinearLayout l = new LinearLayout(requireContext());
        l.setOrientation(LinearLayout.VERTICAL);
        l.setBackgroundResource(bgRes);
        int p = dp(padDp);
        l.setPadding(p, p, p, p);
        return l;
    }

    private LinearLayout kpiPod(String label, String val, String sub) {
        LinearLayout l = box(R.drawable.sv_card, 12);
        l.addView(txt(label, 11, R.color.sv_outline, false));
        LinearLayout r = row();
        r.setGravity(Gravity.BOTTOM);
        TextView v = txt(val, 16, R.color.sv_primary, true);
        v.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
        r.addView(v);
        if (!sub.isEmpty()) r.addView(marginStart(txt(sub, 11, R.color.sv_outline, false), 4));
        l.addView(marginTop(r, 4));
        return l;
    }

    private TextView txt(String text, float sp, int colorRes, boolean bold) {
        TextView tv = new TextView(requireContext());
        tv.setText(text);
        tv.setTextSize(sp);
        tv.setTextColor(requireContext().getColor(colorRes));
        if (bold) tv.setTypeface(null, Typeface.BOLD);
        return tv;
    }

    private TextView pill(String text, int bgRes, int colorRes) {
        TextView tv = txt(text, 11, colorRes, true);
        tv.setBackgroundResource(bgRes);
        tv.setPadding(dp(10), dp(4), dp(10), dp(4));
        return tv;
    }

    private TextView button(String text, int bgRes, int colorRes) {
        TextView tv = txt(text, 12, colorRes, true);
        tv.setBackgroundResource(bgRes);
        tv.setGravity(Gravity.CENTER);
        tv.setMinHeight(dp(42));
        tv.setPadding(dp(10), dp(10), dp(10), dp(10));
        return tv;
    }

    private <T extends View> T marginTop(T v, int dpVal) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                v.getLayoutParams() != null ? v.getLayoutParams().width : ViewGroup.LayoutParams.MATCH_PARENT,
                v.getLayoutParams() != null ? v.getLayoutParams().height : ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(dpVal);
        v.setLayoutParams(lp);
        return v;
    }

    private <T extends View> T marginStart(T v, int dpVal) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.setMarginStart(dp(dpVal));
        v.setLayoutParams(lp);
        return v;
    }
}

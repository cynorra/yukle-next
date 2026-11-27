package com.cynorra.loadly;

import android.content.Intent;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
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
import java.util.Locale;

/**
 * Tab 4: Mesajlar (Protected Communication Hub — Silent Vector).
 * Matches design/mesajlar_i_leti_im/screen.png with live search, category filters,
 * quick reply dialog, and masked/protected call action.
 */
public class MessagesFragment extends Fragment {

    private LinearLayout threadsContainer;
    private EditText searchInput;
    private TextView countHeader, fAll, fActive, fSupport, fArchive;
    private String activeFilter = "all";

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_messages, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View v, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(v, savedInstanceState);
        threadsContainer = v.findViewById(R.id.threadsContainer);
        searchInput = v.findViewById(R.id.msgSearchInput);
        countHeader = v.findViewById(R.id.msgCountHeader);
        fAll = v.findViewById(R.id.msgFilterAll);
        fActive = v.findViewById(R.id.msgFilterActive);
        fSupport = v.findViewById(R.id.msgFilterSupport);
        fArchive = v.findViewById(R.id.msgFilterArchive);

        fAll.setOnClickListener(x -> setFilter("all"));
        fActive.setOnClickListener(x -> setFilter("active"));
        fSupport.setOnClickListener(x -> setFilter("support"));
        fArchive.setOnClickListener(x -> setFilter("archive"));

        v.findViewById(R.id.msgGuideCard).setOnClickListener(x ->
                new AlertDialog.Builder(requireContext())
                        .setTitle("Güvenli Taşınma Rehberi")
                        .setMessage("1. Asansör ve kat bilgilerini yazılı teyit edin.\n2. Ödemeyi yalnızca Loadly Güvenli Havuz üzerinden gerçekleştirin.\n3. Teslimat öncesi hasar kontrolü yapmadan onay vermeyin.")
                        .setPositiveButton("Anladım", null)
                        .show());

        searchInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) { render(); }
            @Override public void afterTextChanged(Editable s) {}
        });

        render();
    }

    private void setFilter(String f) {
        activeFilter = f;
        stylePill(fAll, "all".equals(f));
        stylePill(fActive, "active".equals(f));
        stylePill(fSupport, "support".equals(f));
        stylePill(fArchive, "archive".equals(f));
        render();
    }

    private void stylePill(TextView tv, boolean on) {
        tv.setBackgroundResource(on ? R.drawable.sv_pill_primary : R.drawable.sv_pill_white);
        tv.setTextColor(requireContext().getColor(on ? R.color.sv_on_primary : R.color.sv_on_surface_variant));
        tv.setTypeface(null, on ? Typeface.BOLD : Typeface.NORMAL);
    }

    private void render() {
        threadsContainer.removeAllViews();
        String q = searchInput.getText() != null ? searchInput.getText().toString().trim().toLowerCase(Locale.ROOT) : "";
        List<LoadlyStore.ChatThread> all = LoadlyStore.getMessages(requireContext());
        int shown = 0;

        for (LoadlyStore.ChatThread t : all) {
            if (!"all".equals(activeFilter) && !activeFilter.equals(t.category)) continue;
            if (!q.isEmpty()) {
                String hay = (t.senderName + " " + t.lastMessage + " " + t.contextPill1).toLowerCase(Locale.ROOT);
                if (!hay.contains(q)) continue;
            }
            shown++;
            threadsContainer.addView(buildThreadCard(t));
        }

        countHeader.setText("GELEN MESAJLAR (" + shown + ")");
        if (shown == 0) {
            TextView empty = new TextView(requireContext());
            empty.setText("Bu kategoride henüz mesaj bulunmuyor.");
            empty.setTextColor(requireContext().getColor(R.color.sv_outline));
            empty.setPadding(0, dp(24), 0, dp(24));
            empty.setGravity(Gravity.CENTER);
            threadsContainer.addView(empty);
        }
    }

    private View buildThreadCard(LoadlyStore.ChatThread t) {
        LinearLayout card = new LinearLayout(requireContext());
        card.setOrientation(LinearLayout.HORIZONTAL);
        card.setBackgroundResource(R.drawable.sv_card);
        int p = dp(14);
        card.setPadding(p, p, p, p);
        LinearLayout.LayoutParams clp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        clp.bottomMargin = dp(10);
        card.setLayoutParams(clp);

        // Avatar circle
        TextView av = new TextView(requireContext());
        av.setText(t.isOfficial ? "🎧" : t.initials);
        av.setGravity(Gravity.CENTER);
        av.setTextSize(13f);
        av.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
        boolean darkAv = t.unread || t.isOfficial;
        av.setBackgroundResource(darkAv ? R.drawable.sv_circle_primary : R.drawable.sv_circle_surface);
        av.setTextColor(requireContext().getColor(darkAv ? R.color.sv_on_primary : R.color.sv_primary));
        LinearLayout.LayoutParams avLp = new LinearLayout.LayoutParams(dp(44), dp(44));
        avLp.setMarginEnd(dp(12));
        card.addView(av, avLp);

        // Body
        LinearLayout body = new LinearLayout(requireContext());
        body.setOrientation(LinearLayout.VERTICAL);

        LinearLayout top = new LinearLayout(requireContext());
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER_VERTICAL);
        TextView name = new TextView(requireContext());
        name.setText(t.senderName + (t.verified ? " ✓" : ""));
        name.setTextColor(requireContext().getColor(R.color.sv_primary));
        name.setTextSize(14f);
        name.setTypeface(null, Typeface.BOLD);
        top.addView(name, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

        TextView time = new TextView(requireContext());
        time.setText(t.time);
        time.setTypeface(Typeface.MONOSPACE);
        time.setTextSize(11f);
        time.setTextColor(requireContext().getColor(t.unread ? R.color.sv_secondary : R.color.sv_outline));
        top.addView(time);
        body.addView(top);

        // Context pills
        LinearLayout pills = new LinearLayout(requireContext());
        pills.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams plp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        plp.topMargin = dp(6);
        pills.setLayoutParams(plp);

        TextView p1 = new TextView(requireContext());
        p1.setText(t.contextPill1);
        p1.setTextSize(10f);
        p1.setTextColor(requireContext().getColor(t.isOfficial ? R.color.sv_secondary : R.color.sv_on_surface_variant));
        p1.setBackgroundResource(R.drawable.sv_pill_surface_low);
        p1.setPadding(dp(8), dp(3), dp(8), dp(3));
        pills.addView(p1);

        if (t.contextPill2 != null && !t.contextPill2.isEmpty()) {
            TextView p2 = new TextView(requireContext());
            p2.setText(t.contextPill2);
            p2.setTextSize(10f);
            p2.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
            p2.setBackgroundResource(t.pill2Emerald ? R.drawable.sv_pill_emerald_soft : R.drawable.sv_pill_surface_low);
            p2.setTextColor(requireContext().getColor(t.pill2Emerald ? R.color.sv_emerald : R.color.sv_primary));
            p2.setPadding(dp(8), dp(3), dp(8), dp(3));
            LinearLayout.LayoutParams p2lp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            p2lp.setMarginStart(dp(6));
            pills.addView(p2, p2lp);
        }
        body.addView(pills);

        // Last message
        TextView msg = new TextView(requireContext());
        msg.setText(t.lastMessage);
        msg.setTextSize(13f);
        msg.setTextColor(requireContext().getColor(t.unread ? R.color.sv_primary : R.color.sv_on_surface_variant));
        LinearLayout.LayoutParams mlp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        mlp.topMargin = dp(6);
        body.addView(msg, mlp);

        // Quick action chips for active carrier threads
        if (!t.isOfficial) {
            LinearLayout acts = new LinearLayout(requireContext());
            acts.setOrientation(LinearLayout.HORIZONTAL);
            LinearLayout.LayoutParams alp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            alp.topMargin = dp(10);
            acts.setLayoutParams(alp);

            TextView replyBtn = new TextView(requireContext());
            replyBtn.setText("Cevap Yaz");
            replyBtn.setTextSize(11f);
            replyBtn.setTypeface(null, Typeface.BOLD);
            replyBtn.setTextColor(requireContext().getColor(R.color.sv_primary));
            replyBtn.setBackgroundResource(R.drawable.sv_pill_surface_low);
            replyBtn.setPadding(dp(12), dp(6), dp(12), dp(6));
            replyBtn.setOnClickListener(v -> showReplyDialog(t));
            acts.addView(replyBtn);

            TextView callBtn = new TextView(requireContext());
            callBtn.setText("📞 Korumalı Ara");
            callBtn.setTextSize(11f);
            callBtn.setTypeface(null, Typeface.BOLD);
            callBtn.setTextColor(requireContext().getColor(R.color.sv_primary));
            callBtn.setBackgroundResource(R.drawable.sv_pill_surface_low);
            callBtn.setPadding(dp(12), dp(6), dp(12), dp(6));
            LinearLayout.LayoutParams callLp = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            callLp.setMarginStart(dp(8));
            callBtn.setOnClickListener(v -> {
                Toast.makeText(requireContext(), "Korumalı maskeli hat bağlanıyor...", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse("tel:08502554400")));
            });
            acts.addView(callBtn, callLp);
            body.addView(acts);
        }

        card.setOnClickListener(v -> showReplyDialog(t));
        card.addView(body, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        return card;
    }

    private void showReplyDialog(LoadlyStore.ChatThread t) {
        EditText input = new EditText(requireContext());
        input.setHint("Mesajınızı yazın...");
        int pad = dp(16);
        LinearLayout wrap = new LinearLayout(requireContext());
        wrap.setOrientation(LinearLayout.VERTICAL);
        wrap.setPadding(pad, pad / 2, pad, 0);

        TextView prev = new TextView(requireContext());
        prev.setText(t.lastMessage);
        prev.setTextColor(requireContext().getColor(R.color.sv_on_surface_variant));
        prev.setTextSize(12f);
        prev.setPadding(0, 0, 0, dp(10));
        wrap.addView(prev);
        wrap.addView(input);

        new AlertDialog.Builder(requireContext())
                .setTitle(t.senderName)
                .setView(wrap)
                .setPositiveButton("Gönder", (d, w) -> {
                    String txt = input.getText().toString().trim();
                    if (!txt.isEmpty()) {
                        LoadlyStore.appendReply(requireContext(), t.id, txt);
                        render();
                    }
                })
                .setNegativeButton("Kapat", null)
                .show();
    }

    private int dp(int v) { return (int) (v * getResources().getDisplayMetrics().density); }
}

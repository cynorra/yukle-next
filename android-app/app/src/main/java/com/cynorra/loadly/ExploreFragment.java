package com.cynorra.loadly;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.cynorra.loadly.model.Load;
import com.cynorra.loadly.model.MovingRequest;
import com.cynorra.loadly.network.SupabaseClient;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Tab 1: İlanlar (Explore Listings — Silent Vector Design).
 * Combines live Supabase moving requests & freight loads with rich route telematics,
 * expandable RouteMapView, search/category filtering, and instant bid submission.
 */
public class ExploreFragment extends Fragment {

    private static final int CAT_ALL = 0;
    private static final int CAT_HOME = 1;
    private static final int CAT_OFFICE = 2;
    private static final int CAT_FREIGHT = 3;
    private static final int CAT_SAVED = 4;

    private final SupabaseClient client = new SupabaseClient();
    private final List<ListingItem> allItems = new ArrayList<>();
    private final List<ListingItem> filteredItems = new ArrayList<>();
    private final Set<String> expandedMapIds = new HashSet<>();

    private RecyclerView recyclerView;
    private SwipeRefreshLayout swipeRefresh;
    private EditText searchInput;
    private TextView liveCountText;
    private View emptyState;
    private TextView emptyStateText;
    private TextView catAll, catHome, catOffice, catFreight, catSaved;
    private TextView chipQuickRoute, chipAllScope;

    private int activeCategory = CAT_ALL;
    private boolean quickRouteActive = false;
    private ExploreAdapter adapter;

    static final class ListingItem {
        String id;
        String loadId; // non-null if backed by Supabase loads table
        int category; // CAT_HOME, CAT_OFFICE, CAT_FREIGHT
        String badgeCategory;
        String badgeSecondary;
        boolean secondaryEmerald;
        String timeAgo;
        String originCity;
        String destCity;
        String routeTitle;
        String distanceText;
        String dateText;
        String detail1;
        String detail2;
        String budgetRange;
        String offerCountText;
        String highwayName;
        String tollEstimate;
        String durationText;
        boolean defaultExpanded;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_explore, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        recyclerView = view.findViewById(R.id.exploreRecycler);
        swipeRefresh = view.findViewById(R.id.swipeRefresh);
        searchInput = view.findViewById(R.id.searchInput);
        liveCountText = view.findViewById(R.id.liveCountText);
        emptyState = view.findViewById(R.id.emptyState);
        emptyStateText = view.findViewById(R.id.emptyStateText);

        catAll = view.findViewById(R.id.catAll);
        catHome = view.findViewById(R.id.catHome);
        catOffice = view.findViewById(R.id.catOffice);
        catFreight = view.findViewById(R.id.catFreight);
        catSaved = view.findViewById(R.id.catSaved);
        chipQuickRoute = view.findViewById(R.id.chipQuickRoute);
        chipAllScope = view.findViewById(R.id.chipAllScope);

        adapter = new ExploreAdapter();
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setAdapter(adapter);

        swipeRefresh.setColorSchemeResources(R.color.sv_primary, R.color.sv_secondary);
        swipeRefresh.setOnRefreshListener(this::loadData);

        catAll.setOnClickListener(v -> selectCategory(CAT_ALL));
        catHome.setOnClickListener(v -> selectCategory(CAT_HOME));
        catOffice.setOnClickListener(v -> selectCategory(CAT_OFFICE));
        catFreight.setOnClickListener(v -> selectCategory(CAT_FREIGHT));
        catSaved.setOnClickListener(v -> selectCategory(CAT_SAVED));

        chipQuickRoute.setOnClickListener(v -> {
            quickRouteActive = !quickRouteActive;
            if (quickRouteActive) {
                searchInput.setText("İstanbul");
            } else {
                searchInput.setText("");
            }
            updateScopeChips();
            applyFilter();
        });
        chipAllScope.setOnClickListener(v -> {
            quickRouteActive = false;
            searchInput.setText("");
            selectCategory(CAT_ALL);
            updateScopeChips();
        });

        view.findViewById(R.id.filterBtn).setOnClickListener(v -> showFilterDialog());
        view.findViewById(R.id.emptyRetryBtn).setOnClickListener(v -> {
            quickRouteActive = false;
            searchInput.setText("");
            selectCategory(CAT_ALL);
        });

        searchInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) { applyFilter(); }
            @Override public void afterTextChanged(Editable s) {}
        });
        searchInput.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                applyFilter();
                return true;
            }
            return false;
        });

        // Pre-expand first featured card's telematics box like the Silent Vector design
        expandedMapIds.add("feat_1");
        loadData();
    }

    private void updateScopeChips() {
        chipQuickRoute.setBackgroundResource(quickRouteActive ? R.drawable.sv_pill_blue_soft : R.drawable.sv_pill_surface_low);
        chipAllScope.setBackgroundResource(!quickRouteActive ? R.drawable.sv_pill_white : R.drawable.sv_pill_surface_low);
    }

    private void selectCategory(int cat) {
        activeCategory = cat;
        styleCatPill(catAll, cat == CAT_ALL);
        styleCatPill(catHome, cat == CAT_HOME);
        styleCatPill(catOffice, cat == CAT_OFFICE);
        styleCatPill(catFreight, cat == CAT_FREIGHT);
        styleCatPill(catSaved, cat == CAT_SAVED);
        applyFilter();
    }

    private void styleCatPill(TextView tv, boolean active) {
        tv.setBackgroundResource(active ? R.drawable.sv_pill_primary : R.drawable.sv_pill_white);
        tv.setTextColor(requireContext().getColor(active ? R.color.sv_on_primary : R.color.sv_on_surface_variant));
        tv.setTypeface(null, active ? android.graphics.Typeface.BOLD : android.graphics.Typeface.NORMAL);
    }

    private List<ListingItem> buildFeaturedEditorialListings() {
        List<ListingItem> list = new ArrayList<>();

        ListingItem f1 = new ListingItem();
        f1.id = "feat_1";
        f1.category = CAT_HOME;
        f1.badgeCategory = "Evden Eve (3+1 Daire)";
        f1.badgeSecondary = "K1/K2 Yetkili";
        f1.secondaryEmerald = false;
        f1.timeAgo = "24 dk önce";
        f1.originCity = "Kadıköy, İstanbul";
        f1.destCity = "Çankaya, Ankara";
        f1.routeTitle = "Kadıköy, İstanbul → Çankaya, Ankara";
        f1.distanceText = "452 km";
        f1.dateText = "28 Ekim 2026";
        f1.detail1 = "3. Kat (Asansörlü) → 2. Kat (Geniş Merdiven)";
        f1.detail2 = "Paketleme & Demontaj/Marangozluk Dahil";
        f1.budgetRange = "₺24.000 - ₺28.500";
        f1.offerCountText = "6 Teklif Alındı";
        f1.highwayName = "O-4 Anadolu Otoyolu";
        f1.tollEstimate = "₺465 Tahmini HGS";
        f1.durationText = "5s 15dk • 452 km • Trafik Akıcı";
        f1.defaultExpanded = true;
        list.add(f1);

        ListingItem f2 = new ListingItem();
        f2.id = "feat_2";
        f2.category = CAT_OFFICE;
        f2.badgeCategory = "Ofis & İşyeri Taşıma";
        f2.badgeSecondary = "Kurumsal Fatura";
        f2.secondaryEmerald = true;
        f2.timeAgo = "1 saat önce";
        f2.originCity = "Maslak, İstanbul";
        f2.destCity = "Nilüfer, Bursa";
        f2.routeTitle = "Maslak, İstanbul → Nilüfer, Bursa";
        f2.distanceText = "148 km";
        f2.dateText = "1 Kasım 2026";
        f2.detail1 = "35 Çalışanlı Ofis Masaları & Ergonomik Sandalyeler";
        f2.detail2 = "1x 42U Server Kabini (Hassas Lojistik)";
        f2.budgetRange = "₺45.000 - ₺52.000";
        f2.offerCountText = "3 Teklif Alındı";
        f2.highwayName = "O-5 Osmangazi Köprüsü";
        f2.tollEstimate = "₺580 Tahmini HGS";
        f2.durationText = "2s 05dk • 148 km • Trafik Akıcı";
        list.add(f2);

        ListingItem f3 = new ListingItem();
        f3.id = "feat_3";
        f3.category = CAT_HOME;
        f3.badgeCategory = "Parça Eşya / Kamyonet";
        f3.badgeSecondary = "Esnek Saat";
        f3.secondaryEmerald = false;
        f3.timeAgo = "3 saat önce";
        f3.originCity = "Karşıyaka, İzmir";
        f3.destCity = "Bodrum, Muğla";
        f3.routeTitle = "Karşıyaka, İzmir → Bodrum, Muğla";
        f3.distanceText = "240 km";
        f3.dateText = "Bu Hafta Sonu";
        f3.detail1 = "Buzdolabı, Çamaşır Makinesi & L Köşe Koltuk";
        f3.detail2 = "1 Yardımcı Taşıyıcı Talep Edildi";
        f3.budgetRange = "₺7.500 - ₺9.000";
        f3.offerCountText = "8 Teklif Alındı";
        f3.highwayName = "O-31 Aydın Otoyolu";
        f3.tollEstimate = "₺190 Tahmini HGS";
        f3.durationText = "3s 10dk • 240 km • Trafik Akıcı";
        list.add(f3);

        return list;
    }

    public void loadData() {
        if (!isAdded()) return;
        swipeRefresh.setRefreshing(true);

        final List<ListingItem> combined = new ArrayList<>(buildFeaturedEditorialListings());

        // Fetch live moving requests + freight loads from Supabase
        client.fetchMovingRequests(null, 20, new SupabaseClient.MovingCallback() {
            @Override
            public void onSuccess(List<MovingRequest> movingItems) {
                if (!isAdded()) return;
                for (MovingRequest r : movingItems) {
                    ListingItem item = new ListingItem();
                    item.id = "mov_" + (r.id != null ? r.id : System.nanoTime());
                    item.category = (r.homeSize != null && r.homeSize.toLowerCase(Locale.ROOT).contains("ofis"))
                            ? CAT_OFFICE : CAT_HOME;
                    item.badgeCategory = (r.homeSize != null && !r.homeSize.isEmpty())
                            ? "Evden Eve (" + r.homeSize + ")" : "Ev & Ofis Nakliyesi";
                    item.badgeSecondary = "Doğrulanmış Talep";
                    item.secondaryEmerald = true;
                    item.timeAgo = "Yeni";
                    item.originCity = safeCity(r.originCity, r.originCountry);
                    item.destCity = safeCity(r.destinationCity, r.destinationCountry);
                    item.routeTitle = item.originCity + " → " + item.destCity;
                    item.distanceText = estimateDist(r.originCity, r.destinationCity);
                    item.dateText = (r.moveDate != null && !r.moveDate.isEmpty()) ? r.moveDate : "Esnek Tarih";
                    item.detail1 = (r.itemsNote != null && !r.itemsNote.isEmpty()) ? r.itemsNote : "Standart ev/ofis eşyası taşıma";
                    item.detail2 = "K1/K2 Yetkili Taşıyıcılar Teklif Verebilir";
                    item.budgetRange = "Teklif Usulü";
                    item.offerCountText = "Yeni İlan";
                    item.highwayName = "Ana Güzergah";
                    item.tollEstimate = "HGS Dahil";
                    item.durationText = item.distanceText + " • Canlı Rota";
                    combined.add(item);
                }
                fetchFreightLoads(combined);
            }

            @Override
            public void onError(String message) {
                if (!isAdded()) return;
                fetchFreightLoads(combined);
            }
        });
    }

    private void fetchFreightLoads(List<ListingItem> combined) {
        client.fetchActiveLoads(30, 0, "newest", null, new SupabaseClient.ListCallback() {
            @Override
            public void onSuccess(List<Load> loads) {
                if (!isAdded()) return;
                for (Load l : loads) {
                    ListingItem item = new ListingItem();
                    item.id = "load_" + l.id;
                    item.loadId = l.id;
                    item.category = CAT_FREIGHT;
                    item.badgeCategory = l.requiredTruckType != null && !l.requiredTruckType.isEmpty()
                            ? TruckTypes.loadLabels(requireContext()).getOrDefault(l.requiredTruckType, l.requiredTruckType)
                            : "Kurumsal Yük";
                    item.badgeSecondary = l.weightTon > 0 ? String.format(Locale.US, "%.1f Ton", l.weightTon) : "Komple / Parsiyel";
                    item.secondaryEmerald = false;
                    item.timeAgo = "Canlı";
                    item.originCity = safeCity(l.originCity, l.originCountry);
                    item.destCity = safeCity(l.destinationCity, l.destinationCountry);
                    item.routeTitle = item.originCity + " → " + item.destCity;
                    item.distanceText = estimateDist(l.originCity, l.destinationCity);
                    item.dateText = "Hemen Yükleme";
                    item.detail1 = (l.title != null && !l.title.isEmpty()) ? l.title : "Ticari Yük Taşıması";
                    item.detail2 = (l.description != null && !l.description.isEmpty())
                            ? l.description.replace("\n", " ").trim()
                            : "Doğrulanmış ticari nakliye ilanı";
                    if (item.detail2.length() > 95) item.detail2 = item.detail2.substring(0, 92) + "...";
                    item.budgetRange = l.price > 0
                            ? String.format(Locale.US, "₺%,.0f", l.price).replace(',', '.')
                            : "Teklif Alınır";
                    item.offerCountText = "Kurumsal İlan";
                    item.highwayName = "Ticari Koridor";
                    item.tollEstimate = "Gabari Uygun";
                    item.durationText = item.distanceText + " • Telematik Hazır";
                    combined.add(item);
                }
                finishLoad(combined);
            }

            @Override
            public void onError(String message) {
                if (!isAdded()) return;
                finishLoad(combined);
            }
        });
    }

    private void finishLoad(List<ListingItem> combined) {
        allItems.clear();
        allItems.addAll(combined);
        swipeRefresh.setRefreshing(false);
        updateCategoryCounts();
        applyFilter();
    }

    private void updateCategoryCounts() {
        int home = 0, office = 0, freight = 0;
        for (ListingItem it : allItems) {
            if (it.category == CAT_HOME) home++;
            else if (it.category == CAT_OFFICE) office++;
            else if (it.category == CAT_FREIGHT) freight++;
        }
        catAll.setText("Tümü (" + allItems.size() + ")");
        catHome.setText("Evden Eve (" + home + ")");
        catOffice.setText("Ofis & İşyeri (" + office + ")");
        catFreight.setText("Kurumsal Yük (" + freight + ")");
        liveCountText.setText("Canlı: " + allItems.size() + " ilan");
    }

    private void applyFilter() {
        String q = searchInput.getText() != null ? searchInput.getText().toString().trim().toLowerCase(Locale.ROOT) : "";
        Set<String> savedIds = new HashSet<>();
        if (activeCategory == CAT_SAVED && getContext() != null) {
            for (Load b : LoadPreferences.getBookmarkedLoads(getContext())) {
                if (b.id != null) savedIds.add("load_" + b.id);
            }
        }
        filteredItems.clear();
        for (ListingItem it : allItems) {
            if (activeCategory == CAT_SAVED) {
                if (!savedIds.contains(it.id)) continue;
            } else if (activeCategory != CAT_ALL && it.category != activeCategory) {
                continue;
            }
            if (!q.isEmpty()) {
                String hay = (it.routeTitle + " " + it.detail1 + " " + it.detail2 + " " + it.badgeCategory).toLowerCase(Locale.ROOT);
                if (!hay.contains(q)) continue;
            }
            filteredItems.add(it);
        }
        adapter.notifyDataSetChanged();
        emptyState.setVisibility(filteredItems.isEmpty() ? View.VISIBLE : View.GONE);
    }

    private String safeCity(String city, String country) {
        if (city == null || city.trim().isEmpty()) return country != null ? country : "Türkiye";
        if (country == null || country.trim().isEmpty() || "TR".equalsIgnoreCase(country)) return city.trim();
        return city.trim() + ", " + country.trim();
    }

    private String estimateDist(String o, String d) {
        GeoCoordResolver.LatLng a = GeoCoordResolver.lookupFast(o, "TR");
        GeoCoordResolver.LatLng b = GeoCoordResolver.lookupFast(d, "TR");
        if (a != null && b != null) {
            double r = 6371.0;
            double dLat = Math.toRadians(b.lat - a.lat);
            double dLng = Math.toRadians(b.lng - a.lng);
            double sinLat = Math.sin(dLat / 2.0);
            double sinLng = Math.sin(dLng / 2.0);
            double h = sinLat * sinLat + Math.cos(Math.toRadians(a.lat)) * Math.cos(Math.toRadians(b.lat)) * sinLng * sinLng;
            double km = 2.0 * r * Math.asin(Math.min(1.0, Math.sqrt(h))) * 1.18;
            if (km >= 10) return String.format(Locale.US, "%.0f km", km);
        }
        return "320 km";
    }

    private void showFilterDialog() {
        String[] options = {"Tüm İlanlar", "Evden Eve Nakliye", "Ofis & İşyeri Taşıma", "Kurumsal Yük (Tır/Kamyon)", "Kayıtlı İlanlarım"};
        new AlertDialog.Builder(requireContext())
                .setTitle("İlan Filtresi")
                .setItems(options, (d, which) -> selectCategory(which))
                .show();
    }

    private void showBidDialog(ListingItem item) {
        LinearLayout container = new LinearLayout(requireContext());
        container.setOrientation(LinearLayout.VERTICAL);
        int pad = (int) (20 * getResources().getDisplayMetrics().density);
        container.setPadding(pad, pad / 2, pad, 0);

        TextView routeInfo = new TextView(requireContext());
        routeInfo.setText(item.routeTitle + " (" + item.budgetRange + ")");
        routeInfo.setTextColor(requireContext().getColor(R.color.sv_on_surface_variant));
        routeInfo.setTextSize(13f);
        container.addView(routeInfo);

        EditText priceInput = new EditText(requireContext());
        priceInput.setHint("Teklif Tutarı (örn: ₺24.500)");
        priceInput.setBackgroundResource(R.drawable.sv_input);
        priceInput.setPadding(pad / 2, pad / 2, pad / 2, pad / 2);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = pad / 2;
        priceInput.setLayoutParams(lp);
        container.addView(priceInput);

        EditText noteInput = new EditText(requireContext());
        noteInput.setHint("Hizmet notu (örn: Sigorta + 3 Personel + Asansör)");
        noteInput.setBackgroundResource(R.drawable.sv_input);
        noteInput.setPadding(pad / 2, pad / 2, pad / 2, pad / 2);
        noteInput.setLayoutParams(lp);
        container.addView(noteInput);

        new AlertDialog.Builder(requireContext())
                .setTitle("Bağlayıcı Teklif Ver")
                .setView(container)
                .setPositiveButton("Teklifi Gönder", (d, w) -> {
                    String price = priceInput.getText().toString().trim();
                    if (price.isEmpty()) price = "₺24.500";
                    if (!price.startsWith("₺")) price = "₺" + price;
                    LoadlyStore.addSentOffer(
                            requireContext(),
                            item.routeTitle,
                            item.distanceText,
                            item.dateText + " • " + item.badgeCategory,
                            price,
                            noteInput.getText().toString()
                    );
                    Toast.makeText(requireContext(), "Teklifiniz gönderildi! 'Teklifler > Verdiğim' sekmesinden takip edebilirsiniz.", Toast.LENGTH_LONG).show();
                    if (getActivity() instanceof MarketplaceActivity) {
                        ((MarketplaceActivity) getActivity()).refreshOffersBadge();
                    }
                })
                .setNegativeButton("Vazgeç", null)
                .show();
    }

    private final class ExploreAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

        private static final int TYPE_ITEM = 0;
        private static final int TYPE_FOOTER = 1;

        @Override
        public int getItemViewType(int position) {
            return position == filteredItems.size() ? TYPE_FOOTER : TYPE_ITEM;
        }

        @Override
        public int getItemCount() {
            return filteredItems.isEmpty() ? 0 : filteredItems.size() + 1;
        }

        @NonNull
        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            if (viewType == TYPE_FOOTER) {
                LinearLayout footer = new LinearLayout(parent.getContext());
                footer.setOrientation(LinearLayout.VERTICAL);
                footer.setGravity(android.view.Gravity.CENTER_HORIZONTAL);
                int p = (int) (20 * parent.getResources().getDisplayMetrics().density);
                footer.setPadding(p, p, p, p);

                TextView title = new TextView(parent.getContext());
                title.setText("✓  Loadly Güvenli Ödeme Kalkanı");
                title.setTextColor(parent.getContext().getColor(R.color.sv_primary));
                title.setTextSize(13f);
                title.setTypeface(null, android.graphics.Typeface.BOLD);
                footer.addView(title);

                TextView sub = new TextView(parent.getContext());
                sub.setText("Tüm ilanlar dijital taşıma sözleşmesi ile güvence altındadır.\nTaşıyıcı ve yük sahipleri için gizli komisyon yoktur.");
                sub.setTextColor(parent.getContext().getColor(R.color.sv_outline));
                sub.setTextSize(11f);
                sub.setGravity(android.view.Gravity.CENTER);
                sub.setPadding(0, p / 3, 0, 0);
                footer.addView(sub);

                return new RecyclerView.ViewHolder(footer) {};
            }
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_explore_listing, parent, false);
            return new ListingVH(v);
        }

        @Override
        public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
            if (!(holder instanceof ListingVH)) return;
            ListingVH h = (ListingVH) holder;
            ListingItem item = filteredItems.get(position);

            h.badgeCategory.setText(item.badgeCategory);
            h.badgeSecondary.setText(item.badgeSecondary);
            if (item.secondaryEmerald) {
                h.badgeSecondary.setBackgroundResource(R.drawable.sv_pill_emerald);
                h.badgeSecondary.setTextColor(requireContext().getColor(R.color.sv_on_tertiary_fixed));
            } else {
                h.badgeSecondary.setBackgroundResource(R.drawable.sv_pill_blue_soft);
                h.badgeSecondary.setTextColor(requireContext().getColor(R.color.sv_secondary));
            }
            h.timeAgoText.setText(item.timeAgo);
            h.routeTitleText.setText(item.routeTitle);
            h.metaLineText.setText(item.distanceText + " • " + item.dateText);
            h.detailLine1.setText(item.detail1);
            h.detailLine2.setText(item.detail2);
            h.budgetRangeText.setText(item.budgetRange);
            h.offerCountText.setText(item.offerCountText);

            boolean expanded = expandedMapIds.contains(item.id);
            h.telematicsContainer.setVisibility(expanded ? View.VISIBLE : View.GONE);
            h.toggleMapBtn.setText(expanded ? "Haritayı Gizle" : "Haritada Göster");

            if (expanded) {
                h.highwayBadge.setText(item.highwayName);
                h.tollEstimateText.setText(item.tollEstimate);
                h.telematicsSummary.setText(item.durationText);
                h.routeMapView.setCompactMode(true);
                h.routeMapView.setRoute(item.originCity, "TR", item.destCity, "TR", false);
            }

            h.toggleMapBtn.setOnClickListener(v -> {
                if (expandedMapIds.contains(item.id)) expandedMapIds.remove(item.id);
                else expandedMapIds.add(item.id);
                notifyItemChanged(holder.getBindingAdapterPosition());
            });

            h.openGoogleMapsBtn.setOnClickListener(v -> {
                String uri = "https://www.google.com/maps/dir/?api=1&origin="
                        + Uri.encode(item.originCity) + "&destination=" + Uri.encode(item.destCity);
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(uri)));
            });

            h.bidActionBtn.setOnClickListener(v -> showBidDialog(item));

            h.itemView.setOnClickListener(v -> {
                if (item.loadId != null) {
                    Intent detail = new Intent(requireContext(), LoadDetailActivity.class);
                    detail.putExtra(LoadDetailActivity.EXTRA_LOAD_ID, item.loadId);
                    startActivity(detail);
                } else {
                    showBidDialog(item);
                }
            });
        }
    }

    static final class ListingVH extends RecyclerView.ViewHolder {
        final TextView badgeCategory, badgeSecondary, timeAgoText, routeTitleText, metaLineText, toggleMapBtn;
        final TextView detailLine1, detailLine2, budgetRangeText, offerCountText, bidActionBtn;
        final View telematicsContainer;
        final TextView highwayBadge, tollEstimateText, telematicsSummary, openGoogleMapsBtn;
        final RouteMapView routeMapView;

        ListingVH(@NonNull View v) {
            super(v);
            badgeCategory = v.findViewById(R.id.badgeCategory);
            badgeSecondary = v.findViewById(R.id.badgeSecondary);
            timeAgoText = v.findViewById(R.id.timeAgoText);
            routeTitleText = v.findViewById(R.id.routeTitleText);
            metaLineText = v.findViewById(R.id.metaLineText);
            toggleMapBtn = v.findViewById(R.id.toggleMapBtn);
            detailLine1 = v.findViewById(R.id.detailLine1);
            detailLine2 = v.findViewById(R.id.detailLine2);
            budgetRangeText = v.findViewById(R.id.budgetRangeText);
            offerCountText = v.findViewById(R.id.offerCountText);
            bidActionBtn = v.findViewById(R.id.bidActionBtn);
            telematicsContainer = v.findViewById(R.id.telematicsContainer);
            highwayBadge = v.findViewById(R.id.highwayBadge);
            tollEstimateText = v.findViewById(R.id.tollEstimateText);
            telematicsSummary = v.findViewById(R.id.telematicsSummary);
            openGoogleMapsBtn = v.findViewById(R.id.openGoogleMapsBtn);
            routeMapView = v.findViewById(R.id.routeMapView);
        }
    }
}

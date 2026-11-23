package com.cynorra.loadly;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/** ISO 3166 country helpers - names are localized by the device locale, nothing is hardcoded. */
public final class Countries {

    private Countries() {}

    public static List<String> allCodes() {
        List<String> codes = new ArrayList<>();
        for (String c : Locale.getISOCountries()) codes.add(c);
        Collections.sort(codes, (a, b) -> displayName(a).compareToIgnoreCase(displayName(b)));
        return codes;
    }

    public static String displayName(String iso2) {
        if (iso2 == null || iso2.isEmpty()) return "";
        String name = new Locale("", iso2).getDisplayCountry(Locale.getDefault());
        return name.isEmpty() ? iso2 : name;
    }

    /** English country name, as the scraped loads store it in origin_country. */
    public static String englishName(String iso2) {
        return new Locale("", iso2).getDisplayCountry(Locale.ENGLISH);
    }
}

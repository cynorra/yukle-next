package com.cynorra.loadly;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

import com.cynorra.loadly.model.Load;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Unified, bulletproof contact extractor & multi-channel contact action sheet
 * for both Freight Loads (LoadAdapter / LoadDetailActivity) and Moving listings.
 *
 * Fixes:
 * 1. Never mistakes 7-digit "#787950" listing IDs or "11/25/2026" dates for phone numbers.
 * 2. Extracts ALL phone numbers (mobile + landline) and email addresses from descriptions.
 * 3. Provides direct Call, WhatsApp, SMS, Email, Copy to Clipboard, and Web fallback options
 *    so the user is NEVER stuck with a silent/non-working contact button.
 */
public final class ContactHelper {

    // Matches phone numbers with optional +country code, parentheses, spaces, or hyphens
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?<![#A-Za-z0-9/])(\\+?\\d[\\d ()-]{5,}\\d)(?![/\\d])");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})");
    private static final Pattern COMPANY_PATTERN = Pattern.compile("(?:Firma Adı|Company|Shipper|Posted by):\\s*([^\\n.]+)", Pattern.CASE_INSENSITIVE);
    private static final Pattern PERSON_PATTERN = Pattern.compile("(?:Yetkili Kişi|Contact Person):\\s*([^\\n.]+)", Pattern.CASE_INSENSITIVE);

    private ContactHelper() {}

    public static final class ContactInfo {
        public final List<String> phones = new ArrayList<>();
        public final List<String> emails = new ArrayList<>();
        public String companyName;
        public String contactPerson;

        public boolean hasAnyDirectContact() {
            return !phones.isEmpty() || !emails.isEmpty();
        }

        public String primaryPhone() {
            // Prefer mobile numbers (e.g. +90 5xx or 05xx or 10+ digits) over short 444 numbers
            for (String p : phones) {
                String digits = p.replaceAll("\\D", "");
                if (digits.length() >= 10) return p;
            }
            return phones.isEmpty() ? null : phones.get(0);
        }

        public String primaryEmail() {
            return emails.isEmpty() ? null : emails.get(0);
        }
    }

    public static ContactInfo extract(Load load) {
        ContactInfo info = extractFromText(load != null ? load.description : null);
        if (load != null && (info.companyName == null || info.companyName.isEmpty())) {
            if (load.shipperName != null && !load.shipperName.isEmpty() && !"eren".equalsIgnoreCase(load.shipperName)) {
                info.companyName = load.shipperName;
            }
        }
        return info;
    }

    public static ContactInfo extractFromText(String text) {
        ContactInfo info = new ContactInfo();
        if (text == null || text.trim().isEmpty()) return info;

        Set<String> seenPhones = new LinkedHashSet<>();
        Matcher pm = PHONE_PATTERN.matcher(text);
        while (pm.find()) {
            String candidate = pm.group(1).trim();
            int start = pm.start(1);
            // Skip if preceded by '#' (e.g. Original Listing ID #787950)
            if (start > 0 && text.charAt(start - 1) == '#') continue;

            String digits = candidate.replaceAll("\\D", "");
            if (digits.length() >= 7 && digits.length() <= 15) {
                if (seenPhones.add(digits)) {
                    info.phones.add(candidate);
                }
            }
        }

        Set<String> seenEmails = new LinkedHashSet<>();
        Matcher em = EMAIL_PATTERN.matcher(text);
        while (em.find()) {
            String mail = em.group(1).trim();
            if (seenEmails.add(mail.toLowerCase())) {
                info.emails.add(mail);
            }
        }

        Matcher cm = COMPANY_PATTERN.matcher(text);
        if (cm.find()) {
            info.companyName = cm.group(1).trim();
        }
        Matcher perM = PERSON_PATTERN.matcher(text);
        if (perM.find()) {
            info.contactPerson = perM.group(1).trim();
        }

        // If raw text itself was a single phone or email (like in MovingActivity.contact)
        if (info.phones.isEmpty() && info.emails.isEmpty()) {
            String trimmed = text.trim();
            if (trimmed.contains("@")) {
                info.emails.add(trimmed);
            } else {
                String digits = trimmed.replaceAll("\\D", "");
                if (digits.length() >= 7) {
                    info.phones.add(trimmed);
                }
            }
        }

        return info;
    }

    /**
     * Opens a rich multi-option contact dialog (Call, WhatsApp, SMS, Email, Copy, Web)
     * so contacting a shipper or mover always works on every device.
     */
    public static void showContactSheet(Context context, Load load) {
        ContactInfo info = extract(load);
        String routeTitle = (load != null && load.originCity != null && load.destinationCity != null)
                ? (load.originCity + " → " + load.destinationCity)
                : context.getString(R.string.contact_shipper);
        showContactSheet(context, routeTitle, info, load != null ? load.id : null, load != null ? load.originCountry : null);
    }

    public static void showContactSheetForRaw(Context context, String title, String rawContact, String countryCode) {
        ContactInfo info = extractFromText(rawContact);
        if (info.phones.isEmpty() && info.emails.isEmpty() && rawContact != null && !rawContact.trim().isEmpty()) {
            // Free-text handle (e.g. Telegram/username/custom note) - allow copying
            copyToClipboard(context, rawContact.trim());
            return;
        }
        showContactSheet(context, title, info, null, countryCode);
    }

    public static void showContactSheet(Context context, String title, ContactInfo info, String loadId, String countryHint) {
        List<String> labels = new ArrayList<>();
        List<Runnable> actions = new ArrayList<>();

        for (String phone : info.phones) {
            final String cleanDial = sanitizePhoneForDial(phone);
            final String whatsappNum = normalizeForWhatsApp(phone, countryHint);

            labels.add(context.getString(R.string.contact_action_call, phone));
            actions.add(() -> dialPhone(context, cleanDial, phone));

            if (whatsappNum.length() >= 10) {
                labels.add(context.getString(R.string.contact_action_whatsapp, phone));
                actions.add(() -> openWhatsApp(context, whatsappNum, title));
            }

            labels.add(context.getString(R.string.contact_action_sms, phone));
            actions.add(() -> sendSms(context, cleanDial, title));
        }

        for (String email : info.emails) {
            labels.add(context.getString(R.string.contact_action_email, email));
            actions.add(() -> sendEmail(context, email, title));
        }

        String primaryToCopy = info.primaryPhone() != null ? info.primaryPhone() : info.primaryEmail();
        if (primaryToCopy != null) {
            labels.add(context.getString(R.string.contact_action_copy, primaryToCopy));
            actions.add(() -> copyToClipboard(context, primaryToCopy));
        }

        if (loadId != null && !loadId.isEmpty()) {
            labels.add(context.getString(R.string.contact_action_web));
            actions.add(() -> openUrl(context, "https://loadlyapp.com/en/marketplace/" + loadId));
        }

        if (actions.isEmpty()) {
            Toast.makeText(context, R.string.contact_not_available, Toast.LENGTH_SHORT).show();
            return;
        }

        StringBuilder dialogTitle = new StringBuilder(title != null ? title : context.getString(R.string.contact_shipper));
        if (info.companyName != null && !info.companyName.isEmpty()) {
            dialogTitle.append("\n").append(info.companyName);
        }

        new AlertDialog.Builder(context)
                .setTitle(dialogTitle.toString())
                .setItems(labels.toArray(new String[0]), (d, which) -> {
                    if (which >= 0 && which < actions.size()) {
                        actions.get(which).run();
                    }
                })
                .show();
    }

    public static void dialPhone(Context context, String rawPhone, String displayPhone) {
        String clean = sanitizePhoneForDial(rawPhone);
        if (clean.isEmpty()) return;
        try {
            Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + clean));
            context.startActivity(intent);
        } catch (Exception e) {
            copyToClipboard(context, displayPhone != null ? displayPhone : clean);
        }
    }

    public static void openWhatsApp(Context context, String phoneDigits, String routeTitle) {
        try {
            String msg = Uri.encode("Loadly: " + (routeTitle != null ? routeTitle : ""));
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/" + phoneDigits + "?text=" + msg));
            context.startActivity(intent);
        } catch (Exception e) {
            copyToClipboard(context, "+" + phoneDigits);
        }
    }

    public static void sendSms(Context context, String cleanPhone, String routeTitle) {
        try {
            Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:" + cleanPhone));
            intent.putExtra("sms_body", "Loadly: " + (routeTitle != null ? routeTitle : ""));
            context.startActivity(intent);
        } catch (Exception e) {
            copyToClipboard(context, cleanPhone);
        }
    }

    public static void sendEmail(Context context, String email, String subject) {
        try {
            Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:" + email));
            intent.putExtra(Intent.EXTRA_SUBJECT, "Loadly: " + (subject != null ? subject : ""));
            context.startActivity(intent);
        } catch (Exception e) {
            copyToClipboard(context, email);
        }
    }

    public static void openUrl(Context context, String url) {
        try {
            context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        } catch (Exception ignored) {
        }
    }

    public static void copyToClipboard(Context context, String text) {
        ClipboardManager cb = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        if (cb != null) {
            cb.setPrimaryClip(ClipData.newPlainText("contact", text));
            Toast.makeText(context, context.getString(R.string.contact_copied_toast, text), Toast.LENGTH_SHORT).show();
        }
    }

    public static String sanitizePhoneForDial(String phone) {
        if (phone == null) return "";
        String trimmed = phone.trim();
        boolean hasPlus = trimmed.startsWith("+");
        String digits = trimmed.replaceAll("\\D", "");
        return hasPlus ? ("+" + digits) : digits;
    }

    private static String normalizeForWhatsApp(String phone, String countryHint) {
        if (phone == null) return "";
        String trimmed = phone.trim();
        String digits = trimmed.replaceAll("\\D", "");
        if (trimmed.startsWith("+")) return digits;
        if (digits.startsWith("00")) return digits.substring(2);
        boolean isTr = "TR".equalsIgnoreCase(countryHint) || "Turkey".equalsIgnoreCase(countryHint) || "Türkiye".equalsIgnoreCase(countryHint);
        if (isTr && digits.length() == 11 && digits.startsWith("05")) {
            return "90" + digits.substring(1);
        }
        if (isTr && digits.length() == 10 && digits.startsWith("5")) {
            return "90" + digits;
        }
        if (digits.length() == 10 && ("US".equalsIgnoreCase(countryHint) || "United States".equalsIgnoreCase(countryHint) || "Canada".equalsIgnoreCase(countryHint))) {
            return "1" + digits;
        }
        return digits;
    }
}

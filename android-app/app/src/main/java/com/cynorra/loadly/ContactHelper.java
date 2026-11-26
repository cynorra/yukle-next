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
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Unified, KVKK/GDPR-compliant contact extractor & multi-channel contact action sheet
 * for both Freight Loads (LoadAdapter / LoadDetailActivity) and Moving listings.
 *
 * KVKK & Privacy Protections (6698 sayılı Kanun m. 4/2-ç Veri Minimizasyonu & m. 5/2-d):
 * 1. Masks natural person surnames (e.g. "Hakan Demir" -> "Hakan D.") while keeping corporate
 *    legal entity names ("Buzmavi Deniz ve Hava Taşımacılık") visible.
 * 2. Provides masked phone/email previews on passive surfaces so personal numbers are only
 *    accessed upon explicit user action ("İletişime Geç") for legitimate freight purpose.
 * 3. Includes an instant "KVKK Veri Kaldırma / İlanı Bildir" (Takedown & Report) action on
 *    every listing so data subjects can request immediate removal with 1 tap.
 */
public final class ContactHelper {

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
            for (String p : phones) {
                String digits = p.replaceAll("\\D", "");
                if (digits.length() >= 10) return p;
            }
            return phones.isEmpty() ? null : phones.get(0);
        }

        public String primaryEmail() {
            return emails.isEmpty() ? null : emails.get(0);
        }

        public String maskedContactPerson() {
            return maskPersonName(contactPerson);
        }
    }

    /**
     * KVKK Data Minimization: masks natural person surname ("Hakan Demir" -> "Hakan D.")
     * so full personal identity is not exposed in public scraped descriptions.
     */
    public static String maskPersonName(String fullName) {
        if (fullName == null) return null;
        String trimmed = fullName.trim();
        if (trimmed.isEmpty()) return null;
        String[] parts = trimmed.split("\\s+");
        if (parts.length <= 1) return trimmed;
        StringBuilder sb = new StringBuilder(parts[0]);
        for (int i = 1; i < parts.length; i++) {
            String part = parts[i];
            if (!part.isEmpty()) {
                sb.append(" ").append(Character.toUpperCase(part.charAt(0))).append(".");
            }
        }
        return sb.toString();
    }

    /**
     * Masks a phone number or email for passive card preview (e.g. "+90 532 *** 10 99" or "in***@company.com").
     * Full number is used only when the user explicitly initiates a call/message action.
     */
    public static String maskContactPreview(String raw) {
        if (raw == null || raw.trim().isEmpty()) return "";
        String trimmed = raw.trim();
        if (trimmed.contains("@")) {
            int at = trimmed.indexOf('@');
            if (at <= 2) return "***" + trimmed.substring(at);
            return trimmed.substring(0, 2) + "***" + trimmed.substring(at);
        }
        String digits = trimmed.replaceAll("\\D", "");
        if (digits.length() >= 7) {
            String prefix = trimmed.startsWith("+") ? "+" + digits.substring(0, Math.min(4, digits.length() - 3))
                    : digits.substring(0, Math.min(3, digits.length() - 3));
            String suffix = digits.substring(digits.length() - 2);
            return prefix + " *** **" + suffix;
        }
        return trimmed;
    }

    /**
     * Sanitizes a full description text for display by masking "Yetkili Kişi: Ad Soyad"
     * into "Yetkili Kişi: Ad S." per KVKK data minimization rules.
     */
    public static String sanitizeDescriptionForDisplay(String description) {
        if (description == null || description.isEmpty()) return description;
        Matcher m = PERSON_PATTERN.matcher(description);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            String rawPerson = m.group(1);
            String masked = maskPersonName(rawPerson);
            String fullMatch = m.group(0);
            String prefix = fullMatch.substring(0, fullMatch.length() - rawPerson.length());
            m.appendReplacement(sb, Matcher.quoteReplacement(prefix + (masked != null ? masked : "")));
        }
        m.appendTail(sb);
        return sb.toString();
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

        // KVKK m. 11 & Google Play UGC Compliance: 1-tap Data Removal / Report Listing
        labels.add(context.getString(R.string.kvkk_report_remove_action));
        actions.add(() -> requestKvkkTakedown(context, title, loadId, primaryToCopy));

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

    /**
     * Opens a pre-filled KVKK Article 11 Data Erasure / Listing Removal request to info@loadlyapp.com
     * and shows confirmation notice.
     */
    public static void requestKvkkTakedown(Context context, String title, String loadId, String contactRef) {
        String idPart = (loadId != null && !loadId.isEmpty()) ? (" (ID: " + loadId + ")") : "";
        String fullTitle = (title != null ? title : "-") + idPart;
        String cleanContact = (contactRef != null && !contactRef.isEmpty()) ? contactRef : "-";
        String subject = context.getString(R.string.kvkk_email_subject, fullTitle);
        String body = context.getString(R.string.kvkk_email_body, fullTitle, cleanContact);
        try {
            Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:info@loadlyapp.com"));
            intent.putExtra(Intent.EXTRA_SUBJECT, subject);
            intent.putExtra(Intent.EXTRA_TEXT, body);
            context.startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(context, R.string.kvkk_takedown_toast, Toast.LENGTH_LONG).show();
        }
    }

    public static void openPrivacyPolicy(Context context) {
        String lang = Locale.getDefault().getLanguage();
        String url = "tr".equalsIgnoreCase(lang)
                ? "https://loadlyapp.com/tr/privacy-policy"
                : "https://loadlyapp.com/en/privacy";
        openUrl(context, url);
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

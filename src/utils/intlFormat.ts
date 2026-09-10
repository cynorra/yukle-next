// Shared, cached Intl formatters for use across client components. Extracted
// from the per-file pattern in _marketplace/[id]/LoadDetailClient.tsx after
// several other pages (FavoritesPageClient, NotificationBell, PointsBadge,
// PublicProfilePageClient, ProfilePageClient, MessagesPageClient) were found
// hardcoding 'tr-TR' regardless of the viewer's actual locale — printing
// Turkish-formatted dates/numbers even under non-Turkish locales.
const numberFormatCache = new Map<string, Intl.NumberFormat>();
const dateFormatCache = new Map<string, Intl.DateTimeFormat>();
const timeFormatCache = new Map<string, Intl.DateTimeFormat>();
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();

// BCP-47 tags for the two locales that need a specific regional variant;
// every other app locale code (en, es, fr, ...) is already a valid Intl tag.
export function toFormatLocale(locale: string): string {
  if (locale === 'tr') return 'tr-TR';
  if (locale === 'en') return 'en-US';
  return locale;
}

export function formatLocaleDate(locale: string, date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const formatLocale = toFormatLocale(locale);
  const key = opts ? `${formatLocale}|${JSON.stringify(opts)}` : formatLocale;
  let f = dateFormatCache.get(key);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat(formatLocale, opts ?? { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      f = new Intl.DateTimeFormat('en-US', opts ?? { day: 'numeric', month: 'long', year: 'numeric' });
    }
    dateFormatCache.set(key, f);
  }
  return f.format(new Date(date));
}

export function formatLocaleShortDate(locale: string, date: string | Date): string {
  return formatLocaleDate(locale, date, { day: 'numeric', month: 'short' });
}

export function formatLocaleMonthYear(locale: string, date: string | Date): string {
  return formatLocaleDate(locale, date, { month: 'long', year: 'numeric' });
}

export function formatLocaleTime(locale: string, date: string | Date): string {
  const formatLocale = toFormatLocale(locale);
  let f = timeFormatCache.get(formatLocale);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat(formatLocale, { hour: '2-digit', minute: '2-digit' });
    } catch {
      f = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    timeFormatCache.set(formatLocale, f);
  }
  return f.format(new Date(date));
}

export function formatLocaleDateTime(locale: string, date: string | Date): string {
  const formatLocale = toFormatLocale(locale);
  let f = dateTimeFormatCache.get(formatLocale);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat(formatLocale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      f = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
    dateTimeFormatCache.set(formatLocale, f);
  }
  return f.format(new Date(date));
}

export function formatLocaleNumber(locale: string, value: number): string {
  const formatLocale = toFormatLocale(locale);
  let f = numberFormatCache.get(formatLocale);
  if (!f) {
    try {
      f = new Intl.NumberFormat(formatLocale);
    } catch {
      f = new Intl.NumberFormat('en-US');
    }
    numberFormatCache.set(formatLocale, f);
  }
  return f.format(value);
}

const currencyFormatCache = new Map<string, Intl.NumberFormat>();

// Same currency convention already used in _marketplace/[id]/LoadDetailClient.tsx:
// no per-load currency field exists, so it's inferred from locale (tr -> TRY,
// everything else -> USD) rather than left hardcoded to TL/TRY everywhere.
export function formatLocaleCurrency(locale: string, value: number): string {
  const formatLocale = toFormatLocale(locale);
  const currency = locale === 'tr' ? 'TRY' : 'USD';
  const key = `${formatLocale}|${currency}`;
  let f = currencyFormatCache.get(key);
  if (!f) {
    try {
      f = new Intl.NumberFormat(formatLocale, { style: 'currency', currency });
    } catch {
      f = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    }
    currencyFormatCache.set(key, f);
  }
  return f.format(value);
}

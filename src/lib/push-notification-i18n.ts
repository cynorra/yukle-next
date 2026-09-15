// Localizes the two server-sent FCM push notifications (fcm-new-load, fcm-batch),
// which were previously hardcoded Turkish regardless of which country's topic they
// went to - a German, Russian, or Arabic-speaking driver got a Turkish-titled push.
// Keyed by the same ISO 3166-1 alpha-2 codes as COUNTRY_TO_ISO2 / the FCM topic
// name itself, matching the app's own 8 supported UI languages
// (android-app/app/src/main/res/values-*). Any country not listed here falls back
// to English, same as the app's own default locale.

const LANGUAGE_BY_COUNTRY: Record<string, string> = {
  TR: 'tr',
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  IT: 'it', SM: 'it', VA: 'it',
  RO: 'ro', MD: 'ro',
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', TJ: 'ru', UZ: 'ru',
  UA: 'uk',
  SA: 'ar', AE: 'ar', EG: 'ar', IQ: 'ar', JO: 'ar', KW: 'ar', QA: 'ar',
  BH: 'ar', OM: 'ar', YE: 'ar', LB: 'ar', SY: 'ar', LY: 'ar', TN: 'ar',
  DZ: 'ar', MA: 'ar', SD: 'ar', PS: 'ar',
};

type NotificationStrings = {
  newLoadTitle: string;
  batchTitle: string;
  batchBody: (count: number) => string;
};

const STRINGS: Record<string, NotificationStrings> = {
  en: {
    newLoadTitle: 'New listing',
    batchTitle: 'New listings',
    batchBody: (n) => `${n} new listing${n === 1 ? '' : 's'} added`,
  },
  tr: {
    newLoadTitle: 'Yeni ilan',
    batchTitle: 'Yeni ilanlar',
    batchBody: (n) => `${n} yeni ilan eklendi`,
  },
  de: {
    newLoadTitle: 'Neue Ladung',
    batchTitle: 'Neue Ladungen',
    batchBody: (n) => `${n} neue Ladungen hinzugefügt`,
  },
  it: {
    newLoadTitle: 'Nuovo carico',
    batchTitle: 'Nuovi carichi',
    batchBody: (n) => `${n} nuovi carichi aggiunti`,
  },
  ro: {
    newLoadTitle: 'Cursă nouă',
    batchTitle: 'Curse noi',
    batchBody: (n) => `${n} curse noi adăugate`,
  },
  ru: {
    newLoadTitle: 'Новый груз',
    batchTitle: 'Новые грузы',
    batchBody: (n) => `Добавлено новых грузов: ${n}`,
  },
  uk: {
    newLoadTitle: 'Новий вантаж',
    batchTitle: 'Нові вантажі',
    batchBody: (n) => `Додано нових вантажів: ${n}`,
  },
  ar: {
    newLoadTitle: 'شحنة جديدة',
    batchTitle: 'شحنات جديدة',
    batchBody: (n) => `تمت إضافة ${n} شحنة جديدة`,
  },
};

export function notificationStringsForCountry(iso2: string): NotificationStrings {
  const lang = LANGUAGE_BY_COUNTRY[iso2] || 'en';
  return STRINGS[lang] || STRINGS.en;
}

import en from './find-loads-translations/en.json';
import tr from './find-loads-translations/tr.json';
import es from './find-loads-translations/es.json';
import pt from './find-loads-translations/pt.json';
import fr from './find-loads-translations/fr.json';
import it from './find-loads-translations/it.json';
import ja from './find-loads-translations/ja.json';

const map: Record<string, typeof en> = { en, tr, es, pt, fr, it, ja };

export function getFindLoadsTranslation(locale: string): typeof en {
  return map[locale] ?? en;
}

// Locales without a real translation silently fall back to English above,
// same convention as getLegalTranslation.
export function hasFindLoadsTranslation(locale: string): boolean {
  return locale in map;
}

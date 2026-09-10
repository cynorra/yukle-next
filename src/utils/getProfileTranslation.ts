import en from './profile-translations/en.json';
import tr from './profile-translations/tr.json';
import es from './profile-translations/es.json';
import pt from './profile-translations/pt.json';
import fr from './profile-translations/fr.json';
import it from './profile-translations/it.json';
import ja from './profile-translations/ja.json';

const map: Record<string, typeof en> = { en, tr, es, pt, fr, it, ja };

export function getProfileTranslation(locale: string): typeof en {
  return map[locale] ?? en;
}

// Locales without a real translation silently fall back to English above,
// same convention as getLegalTranslation.
export function hasProfileTranslation(locale: string): boolean {
  return locale in map;
}

export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template
  );
}

import en from './app-translations/en.json';
import tr from './app-translations/tr.json';
import es from './app-translations/es.json';
import pt from './app-translations/pt.json';
import fr from './app-translations/fr.json';
import it from './app-translations/it.json';
import ja from './app-translations/ja.json';

const map: Record<string, typeof en> = { en, tr, es, pt, fr, it, ja };

export function getAppTranslation(locale: string): typeof en {
  return map[locale] ?? en;
}

export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template
  );
}

import en from './legal-translations/en.json';
import tr from './legal-translations/tr.json';
import es from './legal-translations/es.json';
import pt from './legal-translations/pt.json';
import fr from './legal-translations/fr.json';
import it from './legal-translations/it.json';
import ja from './legal-translations/ja.json';

const map: Record<string, typeof en> = { en, tr, es, pt, fr, it, ja };

export function getLegalTranslation(locale: string): typeof en {
  return map[locale] ?? en;
}

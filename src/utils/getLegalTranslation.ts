import en from './legal-translations/en.json';
import tr from './legal-translations/tr.json';
import es from './legal-translations/es.json';
import pt from './legal-translations/pt.json';
import fr from './legal-translations/fr.json';
import it from './legal-translations/it.json';
import ja from './legal-translations/ja.json';

// The English file gained new privacy/terms sections (retention, children, transfers,
// last-updated...) that the other locale files do not have yet. Those pages guard every
// newer key with a truthiness check, so the older translations still render, just
// without the new sections. The cast keeps that mismatch from failing the type check.
const map = { en, tr, es, pt, fr, it, ja } as unknown as Record<string, typeof en>;

export function getLegalTranslation(locale: string): typeof en {
  return map[locale] ?? en;
}

// Locales without a real translation silently fall back to English above.
// Search-facing code (canonical URLs) uses this to avoid presenting the
// English fallback as if it were unique per-locale content.
export function hasLegalTranslation(locale: string): boolean {
  return locale in map;
}

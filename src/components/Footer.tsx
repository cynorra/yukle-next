import Logo from '@/components/Logo';
import { Link000 } from '@/components/ui/skiper-ui/skiper40';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';

export default function Footer({ locale }: { locale: Locale }) {
  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.en;
  const isTr = locale === 'tr';

  return (
    <footer className="py-20 px-4 border-t border-border-light dark:border-border-dark bg-surface-light/30 dark:bg-surface-dark/30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Logo size="small" />
          <p className="text-sm text-muted font-medium">
            {t.home.footerCopyright}
          </p>
          <p className="text-xs text-muted/50 font-medium tracking-wider">loadlyapp.com</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-muted uppercase tracking-widest">
          <Link000 href={`/${locale}/about`} className="hover:text-accent transition-colors">
            {t.nav.about}
          </Link000>
          <Link000 href={`/${locale}/contact`} className="hover:text-accent transition-colors">
            {t.nav.contact}
          </Link000>
          <Link000 href={`/${locale}/privacy-policy`} className="hover:text-accent transition-colors">
            {t.nav.kvkk}
          </Link000>
          <Link000 href={`/${locale}/privacy`} className="hover:text-accent transition-colors">
            {t.nav.privacy}
          </Link000>
          <Link000 href={`/${locale}/terms`} className="hover:text-accent transition-colors">
            {t.nav.terms}
          </Link000>
          <Link000 href={`/${locale}/advertise`} className="hover:text-accent transition-colors">
            {t.nav.reklam}
          </Link000>
          <Link000 href={`/${locale}/editorial-policy`} className="hover:text-accent transition-colors">
            {isTr ? 'Editoryal Politika' : 'Editorial Policy'}
          </Link000>
          <Link000 href={`/${locale}/accessibility`} className="hover:text-accent transition-colors">
            {isTr ? 'Erişilebilirlik' : 'Accessibility'}
          </Link000>
          <Link000 href={`/${locale}/cookie-policy`} className="hover:text-accent transition-colors">
            {isTr ? 'Çerez Politikası' : 'Cookie Policy'}
          </Link000>
          <Link000 href={`/${locale}/sitemap`} className="hover:text-accent transition-colors">
            {isTr ? 'Site Haritası' : 'Sitemap'}
          </Link000>
        </div>
      </div>
    </footer>
  );
}

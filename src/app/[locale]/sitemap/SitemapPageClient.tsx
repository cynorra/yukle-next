'use client';

import Link from 'next/link';
import { useT } from '@/hooks/useT';
import { Map } from 'lucide-react';

interface LinkItem { href: string; label: string }
interface Group { title: string; links: LinkItem[] }

const CONTENT: Record<string, { pageTitle: string; description: string; groups: Group[] }> = {
  en: {
    pageTitle: 'Sitemap',
    description: 'Every section of Loadly, in one place.',
    groups: [
      {
        title: 'Content',
        links: [
          { href: '/blog', label: 'Blog — all articles' },
          { href: '/author/eren-simsir', label: 'About the author' },
        ],
      },
      {
        title: 'Get Started',
        links: [
          { href: '/register', label: 'Create an account' },
          { href: '/login', label: 'Sign in' },
        ],
      },
      {
        title: 'Company',
        links: [
          { href: '/about', label: 'About Loadly' },
          { href: '/contact', label: 'Contact' },
          { href: '/advertise', label: 'Advertise with us' },
          { href: '/editorial-policy', label: 'Editorial Policy' },
          { href: '/accessibility', label: 'Accessibility Statement' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { href: '/privacy', label: 'Privacy Policy' },
          { href: '/privacy-policy', label: 'KVKK Disclosure' },
          { href: '/cookie-policy', label: 'Cookie Policy' },
          { href: '/terms', label: 'Terms of Service' },
        ],
      },
    ],
  },
  tr: {
    pageTitle: 'Site Haritası',
    description: "Loadly'nin her bölümü tek bir yerde.",
    groups: [
      {
        title: 'İçerik',
        links: [
          { href: '/blog', label: 'Blog — tüm makaleler' },
          { href: '/author/eren-simsir', label: 'Yazar hakkında' },
        ],
      },
      {
        title: 'Hemen Başlayın',
        links: [
          { href: '/register', label: 'Hesap oluşturun' },
          { href: '/login', label: 'Giriş yapın' },
        ],
      },
      {
        title: 'Kurumsal',
        links: [
          { href: '/about', label: 'Loadly Hakkında' },
          { href: '/contact', label: 'İletişim' },
          { href: '/advertise', label: 'Bizimle Reklam Verin' },
          { href: '/editorial-policy', label: 'Editoryal Politika' },
          { href: '/accessibility', label: 'Erişilebilirlik Beyanı' },
        ],
      },
      {
        title: 'Yasal',
        links: [
          { href: '/privacy', label: 'Gizlilik Politikası' },
          { href: '/privacy-policy', label: 'KVKK Aydınlatma Metni' },
          { href: '/cookie-policy', label: 'Çerez Politikası' },
          { href: '/terms', label: 'Kullanım Koşulları' },
        ],
      },
    ],
  },
};

export function SitemapPageClient({ locale }: { locale: string }) {
  const t = useT();
  const c = CONTENT[locale] || CONTENT.en;

  return (
    <div className={t.pageFull}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${t.heading} flex items-center gap-3`}>
            <Map size={28} className="text-[#A66700]" />
            {c.pageTitle}
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>{c.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {c.groups.map((group) => (
            <div key={group.title} className={`p-6 rounded-2xl ${t.card}`}>
              <h2 className={`text-sm font-bold uppercase tracking-widest text-[#A66700] mb-4`}>
                {group.title}
              </h2>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className={`text-sm ${t.sub} hover:text-[#A66700] transition-colors`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

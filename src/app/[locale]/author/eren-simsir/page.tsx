import type { Metadata } from 'next';
import { AuthorPageClient } from './AuthorPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

interface Props {
  params: Promise<{ locale: string }>;
}

const SUPPORTED = new Set(['en', 'tr']);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const canonicalLocale = SUPPORTED.has(rawLocale) ? rawLocale : 'en';
  return {
    title: 'Eren Şimşir, Founder and Editor of Loadly',
    description: 'Eren Şimşir founded and edits Loadly: his background, how the freight and trucking guides are written from primary sources, and where to start.',
    alternates: {
      canonical: `${SITE_URL}/${canonicalLocale}/author/eren-simsir`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/${locale}/author/eren-simsir#person`,
    name: 'Eren Şimşir',
    jobTitle: 'Founder and Editor',
    url: `${SITE_URL}/${locale}/author/eren-simsir`,
    worksFor: { '@id': `${SITE_URL}/#organization` },
    sameAs: ['https://www.linkedin.com/in/ernsmsr/'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <AuthorPageClient locale={locale} />
    </>
  );
}

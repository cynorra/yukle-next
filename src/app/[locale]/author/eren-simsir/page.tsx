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
    title: 'Eren Şimşir',
    description: 'Founder and Chief Technical Editor of Loadly.',
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
    jobTitle: 'Chief Technical Editor',
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

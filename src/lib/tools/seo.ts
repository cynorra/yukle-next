import type { ToolFaq } from '@/components/tools/ToolShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export function toolUrl(slug?: string): string {
  return `${SITE_URL}/en/tools${slug ? `/${slug}` : ''}`;
}

/** WebApplication + FAQPage + BreadcrumbList for a calculator page (all content is visible on the page). */
export function toolJsonLd(opts: { slug: string; name: string; description: string; faq: ToolFaq[] }) {
  const url = toolUrl(opts.slug);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: opts.name,
        url,
        description: opts.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any (runs in a web browser)',
        inLanguage: 'en',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'Loadly', url: SITE_URL },
      },
      {
        '@type': 'FAQPage',
        mainEntity: opts.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/en` },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: toolUrl() },
          { '@type': 'ListItem', position: 3, name: opts.name, item: url },
        ],
      },
    ],
  };
}

import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { Providers } from '../providers';
import Navbar from '@/components/Navbar';
import CookieConsent from '@/components/CookieConsent';
import AdSenseScript from '@/components/AdSenseScript';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { TRANSLATIONS, RTL_LOCALES } from '@/utils/translations';
import type { Locale } from '@/utils/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export async function generateStaticParams() {
  return (Object.keys(TRANSLATIONS) as Locale[]).map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const t = TRANSLATIONS[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${t.home.heroTitle1} ${t.home.heroTitle2} | Loadly`,
      template: `%s | Loadly`,
    },
    description: t.home.heroDesc,
    keywords: [
      'logistics',
      'shipping',
      'freight marketplace',
      'find loads',
      'truck load',
      'carrier board',
      'transport matching',
      'delivery cargo',
      'trucker network',
    ],
    authors: [{ name: 'Loadly' }],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.keys(TRANSLATIONS).reduce((acc, code) => {
        acc[code] = `/${code}`;
        return acc;
      }, { 'x-default': '/en' } as Record<string, string>),
      types: {
        'application/rss+xml': [
          { url: `${SITE_URL}/${locale}/feed.xml`, title: 'Loadly Blog RSS' },
          { url: `${SITE_URL}/loads-feed.xml`, title: 'Loadly Live Loads RSS' },
        ],
      },
    },
    robots: {
      index: true,
      follow: true,
      // Also set on the general "robots" meta tag, not just the
      // googlebot-specific one below — GEO/AEO crawlers (and audit tools)
      // that don't read the googlebot-only tag still need these directives.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      ...(process.env.GOOGLE_VERIFICATION_CODE ? { 'google-site-verification': process.env.GOOGLE_VERIFICATION_CODE } : {}),
      ...(process.env.BING_VERIFICATION_CODE ? { 'msvalidate.01': process.env.BING_VERIFICATION_CODE } : {}),
      ...(process.env.YANDEX_VERIFICATION_CODE ? { 'yandex-verification': process.env.YANDEX_VERIFICATION_CODE } : {}),
      ...(process.env.BAIDU_VERIFICATION_CODE ? { 'baidu-site-verification': process.env.BAIDU_VERIFICATION_CODE } : {}),
      ...(process.env.NAVER_VERIFICATION_CODE ? { 'naver-site-verification': process.env.NAVER_VERIFICATION_CODE } : {}),
      'shenma-site-verification': 'ee683339337a66f36029364d1a4e3c53_1787382219',
    },
    openGraph: {
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : `${locale}_${locale.toUpperCase()}`,
      siteName: 'Loadly',
      title: `${t.home.heroTitle1} ${t.home.heroTitle2}`,
      description: t.home.heroDesc,
      url: `${SITE_URL}/${locale}`,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'Loadly',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.home.heroTitle1} ${t.home.heroTitle2}`,
      description: t.home.heroDesc,
      images: ['/logo.png'],
    },
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
    appleWebApp: {
      capable: true,
      title: 'Loadly',
      statusBarStyle: 'black-translucent',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#F5A623',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export default async function LocalizedLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = (rawLocale in TRANSLATIONS) ? (rawLocale as Locale) : 'en';
  const isRtl = RTL_LOCALES.includes(locale);
  const t = TRANSLATIONS[locale];

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Loadly',
    alternateName: ['Loadly Logistics', 'Loadly App'],
    url: `${SITE_URL}/${locale}/`,
    description: t.home.heroDesc,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/marketplace?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Loadly',
    url: `${SITE_URL}/${locale}/`,
    logo: `${SITE_URL}/logo.png`,
    description: t.home.heroDesc,
    areaServed: { '@type': 'Country', name: 'Worldwide' },
    serviceType: 'Freight Marketplace',
    knowsAbout: [
      'Freight Transportation',
      'Logistics',
      'Trucking',
      'Supply Chain Management',
      'Load Boards',
      'Cargo Shipping',
    ],
    founder: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#founder`,
      name: 'Eren Şimşir',
      jobTitle: 'Chief Technical Editor',
      sameAs: ['https://www.linkedin.com/in/ernsmsr/'],
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Spanish', 'French', 'German', 'Turkish', 'Arabic'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Loadly Freight Marketplace Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Load Posting for Shippers' },
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Load Matching for Carriers & Drivers' },
        },
      ],
    },
  };

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#founder`,
    name: 'Eren Şimşir',
    jobTitle: 'Chief Technical Editor',
    worksFor: { '@id': `${SITE_URL}/#organization` },
    sameAs: ['https://www.linkedin.com/in/ernsmsr/'],
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Loadly',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: t.home.heroDesc,
    inLanguage: locale,
  };

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('yukle-theme');
                  if (t !== 'light' && t !== 'dark') t = 'dark';
                  document.documentElement.classList.add(t);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.dataLayer = window.dataLayer || [];
                function gtag(){ window.dataLayer.push(arguments); }
                window.gtag = gtag;
                var granted = false;
                try { granted = localStorage.getItem('cookie-consent') === 'accepted'; } catch (e) {}
                gtag('consent', 'default', {
                  ad_storage: granted ? 'granted' : 'denied',
                  ad_user_data: granted ? 'granted' : 'denied',
                  ad_personalization: granted ? 'granted' : 'denied',
                  analytics_storage: granted ? 'granted' : 'denied'
                });
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <link rel="alternate" type="text/plain" href={`${SITE_URL}/llms.txt`} />
      </head>
      <body className="bg-background-light dark:bg-background-dark transition-colors duration-500">
        <noscript>
          <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
            Loadly is a global freight marketplace. Please enable JavaScript to browse live loads,
            post shipments, and use the full site — or visit{' '}
            <a href={`${SITE_URL}/${locale}/marketplace`}>{SITE_URL}/{locale}/marketplace</a> for the
            latest listings.
          </div>
        </noscript>
        <AdSenseScript />
        <GoogleAnalytics />

        <Providers>
          <Navbar />

          <main>{children}</main>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

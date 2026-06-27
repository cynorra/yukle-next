import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../globals.css';
import { Providers } from '../providers';
import Navbar from '@/components/Navbar';
import CookieConsent from '@/components/CookieConsent';
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
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION_CODE || 'BING_PLACEHOLDER',
      'yandex-verification': process.env.YANDEX_VERIFICATION_CODE || 'YANDEX_PLACEHOLDER',
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
    name: 'Loadly',
    url: `${SITE_URL}/${locale}/`,
    logo: `${SITE_URL}/logo.png`,
    description: t.home.heroDesc,
    areaServed: { '@type': 'Country', name: 'Worldwide' },
    serviceType: 'Freight Marketplace',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Spanish', 'French', 'German', 'Turkish', 'Arabic'],
    },
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark transition-colors duration-500">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4674211063760769"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Providers>
          <Navbar />

          <main>{children}</main>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

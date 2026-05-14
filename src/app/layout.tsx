import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import CookieConsent from '@/components/CookieConsent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "YükLe - Türkiye'nin Nakliye İlan Platformu | Yük Bul, Nakliyeci Bul",
    template: '%s | YükLe',
  },
  description:
    'YükLe ile Türkiye genelinde nakliye ilanlarınızı ücretsiz yayınlayın. 81 ilde yük ilanı, nakliyeci eşleştirme, güzergah sistemi. TIR, kamyon, kamyonet ilanları.',
  keywords: [
    'nakliye ilanları',
    'yük taşıma',
    'lojistik',
    'kamyon ilanları',
    'nakliyeci bul',
    'yük bul',
    'Türkiye nakliye',
    'taşımacılık',
    'yük ilanı',
    'nakliye platformu',
    'TIR ilanları',
    'nakliyeci ara',
    'yük ara',
    'sevkiyat',
    'kargo',
  ],
  authors: [{ name: 'YükLe' }],
  alternates: {
    canonical: '/',
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
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'YükLe',
    title: "YükLe - Türkiye'nin Nakliye İlan Platformu",
    description:
      '81 ilde nakliye ilanı. Yük sahipleri ve nakliyeciler için ücretsiz eşleştirme platformu. Hemen kayıt ol, puan kazan.',
    url: SITE_URL,
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'YükLe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "YükLe - Türkiye'nin Nakliye İlan Platformu",
    description: '81 ilde nakliye ilanı. Ücretsiz yük ve nakliyeci eşleştirme.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    title: 'YükLe',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#F5A623',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'YükLe',
  alternateName: ['YükLe Nakliye', 'Yukle'],
  url: `${SITE_URL}/`,
  description:
    "Türkiye'nin nakliye ilan platformu. Yük sahipleri ve nakliyeciler için ücretsiz ilan ve eşleştirme hizmeti.",
  inLanguage: 'tr-TR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/pazar?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'YükLe',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  description:
    'Türkiye genelinde nakliye ilanları ve yük-nakliyeci eşleştirme platformu.',
  areaServed: { '@type': 'Country', name: 'Turkey' },
  serviceType: 'Freight Marketplace',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Turkish',
  },
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'YükLe',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
  description: "Türkiye'de nakliye ilanı vermek ve nakliyeci bulmak için ücretsiz platform.",
  inLanguage: 'tr-TR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Theme'i hydration'dan önce ayarla (FOUC önler) */}
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
        <Providers>
          <Navbar />
          <main>{children}</main>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

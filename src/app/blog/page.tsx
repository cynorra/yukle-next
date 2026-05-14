import type { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/public';
import { BookOpen, ArrowRight } from 'lucide-react';
import { BlogListClient } from './BlogListClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

export const metadata: Metadata = {
  title: 'Nakliye Pazaryeri & Lojistik Rehberi',
  description:
    "Türkiye'nin dijital nakliye pazaryeri. Yük ilanı verme, yük bulma rehberleri ve lojistik maliyet düşürme yöntemleri hakkında kapsamlı bilgiler.",
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'YükLe Blog: Nakliye & Lojistik Rehberi',
    description: 'Yük ilanı verme, yük bulma ve lojistikte maliyet düşürme rehberleri.',
    url: `${SITE_URL}/blog`,
  },
};

export const revalidate = 600; // 10 dakika

export default async function BlogListPage() {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(full_name)')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const allPosts = posts || [];

  const faqs = [
    {
      q: 'Nakliye pazaryeri nedir?',
      a: 'Nakliye pazaryeri, yük sahipleri ile nakliyecilerin dijital bir platformda buluşarak yük ilanı vermelerini ve teklif almalarını sağlayan bir ekosistemdir.',
    },
    {
      q: 'Lojistik pazaryeri nasıl avantaj sağlar?',
      a: "Zaman tasarrufu, fiyat şeffaflığı ve güvenilir nakliyecilere hızlı erişim sağlayarak lojistik maliyetlerini %30'a kadar düşürebilir.",
    },
    {
      q: 'Yük pazaryerinde güvenlik nasıl sağlanır?',
      a: 'YükLe gibi platformlarda tüm kullanıcılar belge doğrulamasından geçer ve geçmiş performansları puanlanır.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-6">
              <BookOpen size={18} />
              Lojistik & Nakliye Pazaryeri Rehberi
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-fg mb-6 leading-tight">
              Lojistik Dünyasını <span className="text-accent">Dijitalleştiriyoruz</span>
            </h1>
            <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
              YükLe{' '}
              <Link href="/yuk-ilani" className="text-accent hover:underline">
                <strong>nakliye pazaryeri</strong>
              </Link>{' '}
              ile{' '}
              <Link href="/yuk-ilani" className="text-accent hover:underline">
                yük ilanı verme
              </Link>
              ,{' '}
              <Link
                href="/blog/kamyon-tir-soforleri-yuk-bulma-rehberi"
                className="text-accent hover:underline"
              >
                yük bulma
              </Link>{' '}
              ve lojistik süreçlerini optimize etme üzerine en güncel rehberlere ulaşın.{' '}
              <Link href="/yuk-bulma" className="text-accent hover:underline">
                <strong>Lojistik pazaryeri</strong>
              </Link>{' '}
              avantajlarını keşfederek işinizi büyütün.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { label: 'Yük Bulma Rehberi', slug: 'kamyon-tir-soforleri-yuk-bulma-rehberi' },
              { label: 'Maliyet Düşürme', slug: 'sehirler-arasi-nakliye-maliyet-dusurme' },
              { label: 'Yasal Mevzuat', slug: 'evden-eve-nakliyat-yasal-mevzuat-belgeler' },
            ].map((guide, i) => (
              <Link
                key={i}
                href={`/blog/${guide.slug}`}
                className="px-6 py-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-accent/20 text-sm font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-all"
              >
                {guide.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>

          {/* Search + grid client */}
          <BlogListClient posts={allPosts as any} />

          <div className="mt-24 pt-16 border-t border-border-light dark:border-border-dark">
            <h2 className="text-3xl font-black text-fg mb-12 text-center">
              Nakliye Pazaryeri Hakkında Sık Sorulan Sorular
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-accent/20"
                >
                  <h3 className="text-xl font-bold text-accent mb-4">{faq.q}</h3>
                  <p className="text-muted">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

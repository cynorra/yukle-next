import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { BLOG_ARCHIVE_PAGE_SIZE } from '@/lib/blog-archive';
import { BlogArchivePager } from '@/components/BlogArchivePager';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadlyapp.com';

// New posts land once a day, same cadence as the blog index.
export const revalidate = 86400;

interface Props {
  params: Promise<{ locale: string; page: string }>;
}

function parsePage(raw: string): number | null {
  if (!/^\d{1,4}$/.test(raw)) return null;
  const n = parseInt(raw, 10);
  return n >= 2 ? n : null; // page 1 is /blog itself
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page: rawPage } = await params;
  const page = parsePage(rawPage) ?? 2;
  const url = `${SITE_URL}/${locale}/blog/archive/${page}`;
  const title = `Logistics Blog Archive – Page ${page} | Loadly`;
  return {
    title: { absolute: title },
    description: `Older freight and logistics guides from Loadly, page ${page} of the full article archive.`,
    alternates: { canonical: url },
    openGraph: { title, url },
  };
}

export default async function BlogArchivePage({ params }: Props) {
  const { locale, page: rawPage } = await params;
  const page = parsePage(rawPage);
  if (!page) notFound();

  const supabase = createPublicClient();
  const from = (page - 1) * BLOG_ARCHIVE_PAGE_SIZE;
  const { data: posts, count } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt, created_at', { count: 'exact' })
    .eq('published', true)
    .eq('language', locale)
    .order('created_at', { ascending: false })
    .range(from, from + BLOG_ARCHIVE_PAGE_SIZE - 1);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / BLOG_ARCHIVE_PAGE_SIZE));
  if (!posts || posts.length === 0 || page > totalPages) notFound();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-black text-fg mb-2">Blog Archive</h1>
        <p className="text-muted mb-10">
          Page {page} of {totalPages} · <Link href={`/${locale}/blog`} className="text-accent font-semibold">Latest articles</Link>
        </p>
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="pb-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-xl font-bold text-fg mb-1">
                <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-accent transition-colors">
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && <p className="text-sm text-muted leading-relaxed">{post.excerpt}</p>}
            </li>
          ))}
        </ul>
        <BlogArchivePager locale={locale} current={page} total={totalPages} />
      </div>
    </div>
  );
}

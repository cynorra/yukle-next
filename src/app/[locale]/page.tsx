import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Rss } from 'lucide-react';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { createPublicClient } from '@/lib/supabase/public';
import type { BlogPost } from '@/types/database';
import { PostImage } from './_home/PostImage';

// 300s (55 locales x up to 288 regens/day = up to ~15.8k ISR writes/day just from
// this one route) was way tighter than the content actually needs - the blog posts
// featured here only change once a day (blog-generator cron runs 09:00 daily, see
// .github/workflows/blog-generator.yml). Matched to that actual cadence instead of
// picking an arbitrary shorter number - anything under 24h regenerates for content
// that hasn't changed since the last regeneration.
export const revalidate = 86400;

// The site is English-only (2026-09-19): every other locale 301s to /en, so this
// page's copy is plain English rather than a per-locale dictionary.
const HOME_POST_COLUMNS =
  'id, title, slug, excerpt, cover_image, author_id, published, language, topic_cluster, created_at, updated_at, author:profiles(full_name)';
// 1 featured + 6 in the grid.
const HOME_POST_LIMIT = 7;

const TOPICS = ['Freight costs', 'Shipping routes', 'LTL & FTL', 'Regulations', 'Supply chain'];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : dateFormatter.format(d);
}

function initials(name: string | undefined | null): string {
  if (!name) return 'L';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

// Homepage doubles as the site's editorial front page. Falls back to English
// when a locale's translation queue hasn't caught up yet, so it's never empty.
async function fetchLatestPosts(locale: string): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('blog_posts')
    .select(HOME_POST_COLUMNS)
    .eq('published', true)
    .eq('language', locale)
    .order('created_at', { ascending: false })
    .limit(HOME_POST_LIMIT);

  if (data && data.length > 0) return data as unknown as BlogPost[];
  if (locale === 'en') return [];

  const { data: fallback } = await supabase
    .from('blog_posts')
    .select(HOME_POST_COLUMNS)
    .eq('published', true)
    .eq('language', 'en')
    .order('created_at', { ascending: false })
    .limit(HOME_POST_LIMIT);

  return (fallback as unknown as BlogPost[]) || [];
}

function PostMeta({ post }: { post: BlogPost }) {
  const author = post.author?.full_name;
  const date = formatDate(post.created_at);
  return (
    <div className="flex items-center gap-3 text-xs text-[color:var(--muted)]">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-extrabold tracking-wide text-accent"
      >
        {initials(author)}
      </span>
      <span className="truncate">
        {author && <span className="font-bold text-[color:var(--fg)]">{author}</span>}
        {author && date && <span className="mx-1.5 opacity-50">·</span>}
        {date && <time dateTime={post.created_at}>{date}</time>}
      </span>
    </div>
  );
}

function FeaturedPost({ post, locale }: { post: BlogPost; locale: string }) {
  return (
    <Link
      href={`/${post.language || locale}/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-[2rem] border border-border-light bg-surface-light shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] transition-shadow duration-500 hover:shadow-[0_30px_80px_-25px_rgba(166,103,0,0.35)] dark:border-border-dark dark:bg-surface-dark lg:grid-cols-12"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[460px]">
        <PostImage
          src={post.cover_image}
          alt={post.title}
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10" />
        <span className="absolute left-5 top-5 rounded-full bg-black/60 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md">
          Featured
        </span>
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-5 lg:p-12">
        {post.topic_cluster && (
          <p className="mb-4 line-clamp-1 text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
            {post.topic_cluster}
          </p>
        )}
        <h2 className="mb-4 line-clamp-4 font-display text-2xl font-black leading-[1.15] tracking-tight text-[color:var(--fg)] transition-colors group-hover:text-accent sm:text-3xl lg:text-[2.1rem]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-7 line-clamp-4 leading-relaxed text-[color:var(--muted)]">{post.excerpt}</p>
        )}
        <div className="mt-auto flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:mt-2">
          <PostMeta post={post} />
          <span className="inline-flex items-center gap-2 text-sm font-extrabold text-accent">
            Read article
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post, locale }: { post: BlogPost; locale: string }) {
  return (
    <Link
      href={`/${post.language || locale}/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border-light bg-surface-light transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.25)] dark:border-border-dark dark:bg-surface-dark"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <PostImage
          src={post.cover_image}
          alt={post.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.topic_cluster && (
          <p className="mb-2.5 line-clamp-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent">
            {post.topic_cluster}
          </p>
        )}
        <h3 className="mb-3 line-clamp-3 font-display text-xl font-black leading-snug tracking-tight text-[color:var(--fg)] transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-[color:var(--muted)]">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-light pt-4 dark:border-border-dark">
          <PostMeta post={post} />
          <ArrowUpRight
            size={18}
            className="shrink-0 text-[color:var(--muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>
      </div>
    </Link>
  );
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale in TRANSLATIONS ? (rawLocale as Locale) : 'en';
  const t = TRANSLATIONS[locale];

  const posts = await fetchLatestPosts(locale);
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-background-light selection:bg-accent/30 dark:bg-background-dark">
      {/* Masthead */}
      <section className="relative overflow-hidden px-4 pb-14 pt-20 sm:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(166,103,0,0.16),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-[0.35] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            The Loadly Journal
          </span>

          <h1 className="max-w-3xl font-display text-4xl font-black leading-[1.08] tracking-tight text-[color:var(--fg)] sm:text-5xl lg:text-[4rem]">
            {t.home.heroTitle1} <span className="text-accent">{t.home.heroTitle2}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] sm:text-xl">
            {t.home.heroDesc}
          </p>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-bold text-[color:var(--muted)]">
            {TOPICS.map((topic, i) => (
              <li key={topic} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent/60" />}
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="px-4 pb-6">
          <div className="mx-auto max-w-6xl">
            <FeaturedPost post={featured} locale={locale} />
          </div>
        </section>
      )}

      {/* Latest */}
      {rest.length > 0 && (
        <section className="px-4 pb-24 pt-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 border-b border-border-light pb-6 dark:border-border-dark sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-accent">Fresh off the press</p>
                <h2 className="font-display text-3xl font-black tracking-tight text-[color:var(--fg)] sm:text-4xl">
                  Latest articles
                </h2>
              </div>
              <Link
                href={`/${locale}/blog`}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-accent transition-all hover:gap-3"
              >
                View all articles <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, idx) => (
                <ScrollReveal key={post.id} delay={(idx % 3) * 0.08} className="h-full">
                  <PostCard post={post} locale={locale} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state: keeps the page useful if the DB query ever returns nothing */}
      {posts.length === 0 && (
        <section className="px-4 pb-24 pt-8">
          <div className="mx-auto max-w-2xl rounded-3xl border border-border-light bg-surface-light p-12 text-center dark:border-border-dark dark:bg-surface-dark">
            <h2 className="mb-3 font-display text-2xl font-black text-[color:var(--fg)]">New articles are on the way</h2>
            <p className="mb-6 text-[color:var(--muted)]">Browse the archive while the next guide is being finished.</p>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-7 py-3.5 text-sm font-extrabold text-white transition-transform hover:scale-105"
            >
              Open the blog <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Editor */}
      <section className="px-4 pb-24">
        <ScrollReveal>
          <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[2rem] border border-border-light bg-surface-light p-8 dark:border-border-dark dark:bg-surface-dark sm:p-12 md:grid-cols-[auto_1fr]">
            <div
              aria-hidden="true"
              className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#5c3a00] font-display text-3xl font-black text-white shadow-lg sm:h-28 sm:w-28"
            >
              ES
            </div>
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-accent">About the publication</p>
              <h2 className="mb-3 font-display text-2xl font-black tracking-tight text-[color:var(--fg)] sm:text-3xl">
                Independent freight &amp; logistics writing
              </h2>
              <p className="mb-6 max-w-2xl leading-relaxed text-[color:var(--muted)]">
                Loadly is a one-person editorial operation run by Eren Şimşir. It publishes practical guides on freight
                costs, shipping routes and industry regulations for shippers, carriers and logistics professionals.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-extrabold">
                <Link href={`/${locale}/author/eren-simsir`} className="inline-flex items-center gap-1.5 text-accent hover:underline">
                  Meet the editor <ArrowRight size={14} />
                </Link>
                <Link href={`/${locale}/editorial-policy`} className="text-[color:var(--fg)] hover:text-accent">
                  Editorial policy
                </Link>
                <Link href={`/${locale}/about`} className="text-[color:var(--fg)] hover:text-accent">
                  About
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Closing */}
      <section className="px-4 pb-28">
        <ScrollReveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#0b0b0b] px-6 py-16 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_50%_0%,rgba(166,103,0,0.45),transparent_70%)]"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                Stay ahead in freight &amp; logistics
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
                New guides on costs, routes and regulations, published regularly. Read them here or follow along by RSS.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/blog`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-9 py-4 text-base font-extrabold text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105 active:scale-95 sm:w-auto"
                >
                  Read the blog <ArrowRight size={18} />
                </Link>
                <a
                  href={`/${locale}/feed.xml`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-9 py-4 text-base font-extrabold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  <Rss size={18} /> RSS feed
                </a>
              </div>
              <p className="mt-8 text-sm text-white/50">
                Have a topic in mind?{' '}
                <a href="mailto:info@loadlyapp.com" className="font-bold text-white/80 underline-offset-4 hover:underline">
                  info@loadlyapp.com
                </a>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

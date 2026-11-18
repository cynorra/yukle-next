import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Rss, ShieldCheck, Scale, FileText, Calculator, ChevronRight } from 'lucide-react';
import { TRANSLATIONS } from '@/utils/translations';
import type { Locale } from '@/utils/translations';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { createPublicClient } from '@/lib/supabase/public';
import type { BlogPost } from '@/types/database';
import { PostImage } from './_home/PostImage';

import { CONTACT_EMAIL } from '@/lib/editorial';

export const revalidate = 86400;

const HOME_POST_COLUMNS =
  'id, title, slug, excerpt, cover_image, author_id, published, language, topic_cluster, created_at, updated_at, author:profiles(full_name)';
const HOME_POST_LIMIT = 7;

const TOPICS = [
  { label: 'Hours of service', href: '/blog/hours-of-service-limits-property-carrying-drivers-en' },
  { label: 'LTL shipping', href: '/blog/ltl-shipping-explained-vs-parcel-and-full-truckload-en' },
  { label: 'Freight brokers', href: '/blog/what-is-a-freight-broker-legal-definition-requirements-en' },
  { label: 'Weight limits', href: '/blog/federal-axle-weight-limits-bridge-formula-en' },
  { label: 'Free calculators', href: '/tools' },
];

const CORE_CLUSTERS = [
  {
    title: 'Safety & Driver Compliance',
    description: 'FMCSA driver rules, duty status limits, roadside inspection levels, and qualification archives.',
    icon: ShieldCheck,
    guides: [
      {
        title: 'Hours of Service (HOS) Limits for Property-Carrying Drivers',
        slug: 'hours-of-service-limits-property-carrying-drivers-en',
        badge: '49 CFR 395',
      },
      {
        title: 'Driver Qualification File (DQF) Contents & Retention Rules',
        slug: 'driver-qualification-file-391-51-contents-retention-en',
        badge: '49 CFR 391.51',
      },
      {
        title: 'ELD Mandate Exemptions & Malfunction Operating Procedures',
        slug: 'eld-mandate-exemptions-malfunction-procedures-en',
        badge: '49 CFR 395.22',
      },
      {
        title: 'CVSA North American Standard Out-of-Service Criteria & Decals',
        slug: 'cvsa-out-of-service-criteria-mechanisms-decals-en',
        badge: 'CVSA Criteria',
      },
      {
        title: 'Commercial Vehicle Roadside Inspections & Driver Preparation',
        slug: 'commercial-vehicle-roadside-inspections-preparation-en',
        badge: 'Levels I–VI',
      },
    ],
  },
  {
    title: 'Brokerage, Contracts & Vetting',
    description: 'Statutory rules governing brokers, bona fide dispatchers, surety bonds, and carrier screening.',
    icon: FileText,
    guides: [
      {
        title: 'What is a Freight Broker? Federal Definition & Registration',
        slug: 'what-is-a-freight-broker-legal-definition-requirements-en',
        badge: '49 U.S.C. 13102',
      },
      {
        title: 'Bona Fide Freight Dispatcher vs. Unauthorized Broker Rules',
        slug: 'bona-fide-freight-dispatcher-vs-unauthorized-broker-en',
        badge: 'FMCSA Guidance',
      },
      {
        title: 'BMC-84 Freight Broker Bond & Trust Fund Filing Explained',
        slug: 'freight-broker-bond-bmc-84-trust-fund-explained-en',
        badge: '$75k Security',
      },
      {
        title: 'How to Check a Trucking Company Safety Record Before Hiring',
        slug: 'how-to-check-a-trucking-company-before-hiring-en',
        badge: 'SAFER & SMS',
      },
      {
        title: 'Load Boards: How to Vet Loads & Brokerages Before Booking',
        slug: 'load-boards-how-to-vet-a-load-before-booking-en',
        badge: 'Due Diligence',
      },
    ],
  },
  {
    title: 'Cargo Security, Weights & Equipment',
    description: 'Bridge gross weight formulas, cargo securement standards, and freight classification.',
    icon: Scale,
    guides: [
      {
        title: 'Federal Axle Weight Limits & Bridge Gross Weight Formula',
        slug: 'federal-axle-weight-limits-bridge-formula-en',
        badge: '23 U.S.C. 127',
      },
      {
        title: 'LTL Freight Class & Shipment Density Calculation Guide',
        slug: 'ltl-freight-class-density-calculation-en',
        badge: 'NMFC Classes',
      },
      {
        title: 'Cargo Securement Tiedowns & Working Load Limit (WLL) Rules',
        slug: 'cargo-securement-tiedowns-working-load-limit-en',
        badge: '49 CFR 393',
      },
      {
        title: 'Hazmat Placarding Tables & The 1,001-Pound Aggregate Rule',
        slug: 'hazmat-placarding-tables-1001-pound-rule-en',
        badge: '49 CFR 172',
      },
      {
        title: 'Box Trucks, Cargo Vans & Pickups: Federal Rules by Gross Weight',
        slug: 'box-truck-cargo-van-pickup-federal-rules-by-weight-en',
        badge: 'Weight Limits',
      },
    ],
  },
  {
    title: 'Claims, Factoring & Driver Finance',
    description: 'Bill of lading duties, Carmack amendment claim deadlines, factoring, and compensation.',
    icon: Calculator,
    guides: [
      {
        title: 'Shipper, Carrier, and Consignee Legal Roles Under the Bill of Lading',
        slug: 'shipper-carrier-consignee-roles-bill-of-lading-en',
        badge: 'Contract Law',
      },
      {
        title: 'Carmack Amendment: Freight Claim Deadlines & Carrier Defenses',
        slug: 'freight-claims-deadlines-carrier-duties-en',
        badge: '49 U.S.C. 14706',
      },
      {
        title: 'Freight Factoring Explained: Selling Invoices vs. Direct Billing',
        slug: 'freight-factoring-explained-selling-invoices-en',
        badge: 'Cash Flow',
      },
      {
        title: 'Federal Minimum Liability Insurance for Interstate Motor Carriers',
        slug: 'federal-minimum-liability-insurance-trucks-en',
        badge: 'Form BMC-91X',
      },
      {
        title: 'Truck Driver Pay Structures & Official BLS Compensation Data',
        slug: 'truck-driver-pay-bls-data-pay-methods-en',
        badge: 'BLS Data',
      },
    ],
  },
];

const TOOLS_SHOWCASE = [
  {
    title: 'Bridge Formula Calculator',
    description: 'Calculate allowable gross vehicle weight across axle groups under 23 U.S.C. 127.',
    href: '/tools/bridge-formula-calculator',
    badge: 'Axle Limits',
  },
  {
    title: 'LTL Density & Class Calculator',
    description: 'Compute pounds per cubic foot (PCF) and determine the estimated NMFC freight class.',
    href: '/tools/ltl-density-calculator',
    badge: 'Freight Class',
  },
  {
    title: 'Dimensional Weight Calculator',
    description: 'Compare actual scale weight against volumetric billable freight dimensions.',
    href: '/tools/dimensional-weight-calculator',
    badge: 'DIM Factor',
  },
  {
    title: 'Rate Per Mile Calculator',
    description: 'Determine gross linehaul revenue per loaded mile and operational break-even targets.',
    href: '/tools/rate-per-mile-calculator',
    badge: 'Trip Pricing',
  },
  {
    title: 'Trip Fuel Cost Calculator',
    description: 'Estimate diesel expenditure based on loaded route mileage and truck fuel efficiency.',
    href: '/tools/fuel-cost-calculator',
    badge: 'Fuel Surcharge',
  },
  {
    title: 'Detention Fee Calculator',
    description: 'Calculate billable shipper/receiver detention charges past standard free time.',
    href: '/tools/detention-fee-calculator',
    badge: 'Dock Layover',
  },
];

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

async function fetchLatestPosts(locale: string): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select(HOME_POST_COLUMNS)
    .eq('published', true)
    .eq('language', locale)
    .order('created_at', { ascending: false })
    .limit(HOME_POST_LIMIT);

  if (error) throw new Error(`[home] Supabase error (${locale}): ${error.message || error.code}`);
  if (data && data.length > 0) return data as unknown as BlogPost[];
  if (locale === 'en') return [];

  const { data: fallback, error: fallbackError } = await supabase
    .from('blog_posts')
    .select(HOME_POST_COLUMNS)
    .eq('published', true)
    .eq('language', 'en')
    .order('created_at', { ascending: false })
    .limit(HOME_POST_LIMIT);

  if (fallbackError) throw new Error(`[home] Supabase fallback error: ${fallbackError.message || fallbackError.code}`);
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
      <div className="relative aspect-[1200/630] overflow-hidden lg:col-span-7 lg:self-center">
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
      <div className="relative aspect-[1200/630] overflow-hidden">
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
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-muted">
            The Loadly Journal
          </span>

          <h1 className="max-w-3xl font-display text-4xl font-black leading-[1.08] tracking-tight text-[color:var(--fg)] sm:text-5xl lg:text-[4rem]">
            {t.home.heroTitle1} <span className="text-accent">{t.home.heroTitle2}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)] sm:text-xl">
            {t.home.heroDesc}
          </p>

          <nav aria-label="Key freight topics" className="mt-9">
            <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm font-bold">
              {TOPICS.map((topic) => (
                <li key={topic.label}>
                  <Link
                    href={`/${locale}${topic.href}`}
                    className="inline-flex items-center rounded-full border border-border-light bg-surface-light/80 px-4 py-1.5 text-xs font-bold text-[color:var(--muted)] transition-all hover:border-accent hover:text-accent hover:shadow-sm dark:border-border-dark dark:bg-surface-dark/80"
                  >
                    {topic.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
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

      {/* Latest Articles */}
      {rest.length > 0 && (
        <section className="px-4 pb-20 pt-16">
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
        <section className="px-4 pb-20 pt-8">
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

      {/* Core Regulatory & Operations Hub (Direct Internal Link Mesh) */}
      <section className="border-t border-border-light bg-surface-light/40 px-4 py-20 dark:border-border-dark dark:bg-surface-dark/40">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-accent">Primary Reference Guides</p>
            <h2 className="font-display text-3xl font-black tracking-tight text-[color:var(--fg)] sm:text-4xl">
              Federal trucking &amp; freight guides by topic
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[color:var(--muted)]">
              Curated regulatory references verified against the Code of Federal Regulations and federal transport statutes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {CORE_CLUSTERS.map((cluster) => {
              const Icon = cluster.icon;
              return (
                <div
                  key={cluster.title}
                  className="flex flex-col rounded-3xl border border-border-light bg-surface-light p-7 shadow-sm transition-all hover:border-accent/40 dark:border-border-dark dark:bg-surface-dark"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-[color:var(--fg)]">{cluster.title}</h3>
                      <p className="text-xs text-[color:var(--muted)]">{cluster.description}</p>
                    </div>
                  </div>

                  <ul className="flex flex-col divide-y divide-border-light/60 dark:divide-border-dark/60">
                    {cluster.guides.map((g) => (
                      <li key={g.slug}>
                        <Link
                          href={`/${locale}/blog/${g.slug}`}
                          className="group flex items-center justify-between py-3.5 text-sm transition-colors hover:text-accent"
                        >
                          <span className="font-semibold text-[color:var(--fg)] transition-colors group-hover:text-accent">
                            {g.title}
                          </span>
                          <span className="ml-3 inline-flex shrink-0 items-center rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-accent whitespace-nowrap transition-all duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                            {g.badge}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Logistics Calculators */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 border-b border-border-light pb-6 dark:border-border-dark sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-accent">Interactive Operations</p>
              <h2 className="font-display text-3xl font-black tracking-tight text-[color:var(--fg)] sm:text-4xl">
                Free freight &amp; trucking calculators
              </h2>
            </div>
            <Link
              href={`/${locale}/tools`}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-accent transition-all hover:gap-3"
            >
              Explore all tools <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS_SHOWCASE.map((tool) => (
              <Link
                key={tool.href}
                href={`/${locale}${tool.href}`}
                className="group flex flex-col justify-between rounded-2xl border border-border-light bg-surface-light p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-accent">
                      {tool.badge}
                    </span>
                    <ChevronRight size={16} className="text-[color:var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-[color:var(--fg)] transition-colors group-hover:text-accent">
                    {tool.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[color:var(--muted)]">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editor & Publication */}
      <section className="px-4 pb-20">
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
                Loadly is a one-person editorial operation run by Eren Şimşir. It publishes sourced guides on US trucking and freight rules. Each guide starts from a primary source such as the Code of Federal Regulations and lists its sources at the end.
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
                Federal trucking rules, explained with sources
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
                Guides on hours of service, insurance, brokers and claims, each checked against the Code of Federal Regulations, plus free calculators. New guides are added over time; read them here or follow along by RSS.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/blog`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-9 py-4 text-base font-extrabold text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105 active:scale-95 sm:w-auto"
                >
                  Read the blog <ArrowRight size={18} />
                </Link>
                <a
                  href={`/${locale}/feed-1.xml`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-9 py-4 text-base font-extrabold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  <Rss size={18} /> RSS feed
                </a>
              </div>
              <p className="mt-8 text-sm text-white/50">
                Have a topic in mind?{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-white/80 underline-offset-4 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

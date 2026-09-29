import Link from 'next/link';

interface Props {
  locale: string;
  current: number; // 1 = /blog itself
  total: number;
}

const href = (locale: string, n: number) => (n === 1 ? `/${locale}/blog` : `/${locale}/blog/archive/${n}`);

export function BlogArchivePager({ locale, current, total }: Props) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav aria-label="Blog archive pages" className="mt-12 flex flex-wrap justify-center gap-2">
      {pages.map((n) =>
        n === current ? (
          <span key={n} aria-current="page" className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold">{n}</span>
        ) : (
          <Link key={n} href={href(locale, n)} className="px-4 py-2 rounded-xl border border-border-light dark:border-border-dark text-sm font-semibold text-fg hover:border-accent transition-colors">
            {n}
          </Link>
        ),
      )}
    </nav>
  );
}

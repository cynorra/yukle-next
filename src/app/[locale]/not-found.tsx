import Link from 'next/link';

export const metadata = {
  title: 'Sayfa Bulunamadı',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-accent mb-4">404</div>
        <h1 className="text-3xl font-black text-fg mb-3">Sayfa Bulunamadı</h1>
        <p className="text-muted mb-8">
          Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
          >
            Anasayfa
          </Link>
          <Link
            href="/pazar"
            className="px-8 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg font-bold rounded-xl hover:bg-background-light dark:hover:bg-background-dark transition-all"
          >
            Pazara Git
          </Link>
        </div>
      </div>
    </div>
  );
}

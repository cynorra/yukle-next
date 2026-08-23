// Root-level 404 — used only for paths outside the [locale] segment (e.g.
// /.well-known/*, malformed URLs with no locale prefix). Locale-prefixed
// paths use [locale]/not-found.tsx instead. Next.js has no root <html> to
// inherit here since app/layout.tsx is a thin pass-through, so this page
// provides its own minimal document shell.
export const metadata = {
  title: 'Page Not Found | Loadly',
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            background: '#0b0d12',
            color: '#f5f5f5',
          }}
        >
          <div style={{ fontSize: '4rem', fontWeight: 900, color: '#F5A623', marginBottom: '1rem' }}>404</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Page Not Found</h1>
          <p style={{ color: '#a3a3a3', marginBottom: '2rem', maxWidth: 420 }}>
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <a
            href="/"
            style={{
              padding: '0.75rem 2rem',
              background: '#F5A623',
              color: '#111',
              fontWeight: 700,
              borderRadius: '0.75rem',
              textDecoration: 'none',
            }}
          >
            Go to Loadly Homepage
          </a>
        </div>
      </body>
    </html>
  );
}

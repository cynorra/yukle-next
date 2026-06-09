import './globals.css';

// [locale]/layout.tsx handles the full <html lang={locale}> structure per locale.
// This root layout is a thin pass-through required by Next.js App Router.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}

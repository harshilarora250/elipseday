import type { Metadata } from 'next';
import './globals.css';
import { getSite, getHero } from '@/lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  let name = 'Portfolio';
  let tagline = 'Founder · Builder · Creator';
  try {
    const [site, hero] = await Promise.all([getSite(), getHero()]);
    name = site.name || name;
    tagline = hero.subtitle || site.tagline || tagline;
  } catch {
    // Supabase env may not be present during some build steps — fall back.
  }
  const title = `${name} — ${tagline.slice(0, 60)}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: tagline,
    openGraph: {
      title,
      description: tagline,
      url: SITE_URL,
      siteName: name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tagline,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Space+Mono:wght@400;700&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

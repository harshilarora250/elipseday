import type { Metadata } from 'next';
import { portfolio } from '@/lib/portfolio';
import './globals.css';

const description =
  'A personal portfolio template. Add a short description of your work and selected projects.';

export const metadata: Metadata = {
  title: `${portfolio.name} — Portfolio`,
  description,
  openGraph: {
    title: `${portfolio.name} — Portfolio`,
    description,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `${portfolio.name} — Portfolio`,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

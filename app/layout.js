import { Nunito } from 'next/font/google';
import './globals.css';

/**
 * Nunito is the one font in the stack that's actually licensed for the web
 * (SIL Open Font License), so it's the foundation. next/font self-hosts and
 * subsets it at build time — no request to Google, no layout shift.
 * The commercial display faces layer on top via @font-face in globals.css.
 */
const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'c³ — College access, decoded.',
    // Article pages set their own title; this frames it.
    template: '%s · c³',
  },
  description:
    "An education magazine decoding admissions, financial aid, and policy — everything you're expected to figure out alone, broken down.",
  openGraph: {
    type: 'website',
    siteName: 'c³',
    title: 'c³ — College access, decoded.',
    description:
      "An education magazine decoding admissions, financial aid, and policy.",
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'c³ — College access, decoded.',
    description:
      "An education magazine decoding admissions, financial aid, and policy.",
  },
  icons: { icon: '/c3-logo.png' },
};

export const viewport = {
  themeColor: '#FFFDF7',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}

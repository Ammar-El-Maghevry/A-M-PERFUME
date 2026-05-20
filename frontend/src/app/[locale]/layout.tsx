import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '@/styles/globals.css';
import { isLocale, locales, dir, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';

export const metadata: Metadata = {
  title: 'A&M Perfume — Maison de Parfum',
  description:
    "Maison de parfum indépendante à Nouakchott. Douze fragrances rares, composées entre l'Atlantique et l'Adrar.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const d = getDict(locale);

  return (
    <html lang={locale} dir={dir(locale)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Tajawal:wght@300;400;500;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body dir={d.dir}>{children}</body>
    </html>
  );
}

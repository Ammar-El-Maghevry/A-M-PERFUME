import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CatalogView } from './CatalogView';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const [{ locale: localeParam }, sp] = await Promise.all([params, searchParams]);
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDict(locale);

  return (
    <>
      <Navbar locale={locale} dict={dict} />
      <main className="page">
        <CatalogView locale={locale} dict={dict} initialCategory={sp.category ?? 'all'} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

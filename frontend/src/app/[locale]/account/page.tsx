import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AccountView } from './AccountView';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function AccountPage({ params, searchParams }: PageProps) {
  const [{ locale: localeParam }, sp] = await Promise.all([params, searchParams]);
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDict(locale);

  return (
    <>
      <Navbar locale={locale} dict={dict} />
      <main className="page">
        <AccountView locale={locale} dict={dict} initialTab={sp.tab ?? 'orders'} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

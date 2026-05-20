import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckoutFlow } from './CheckoutFlow';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDict(locale);

  return (
    <>
      <Navbar locale={locale} dict={dict} />
      <main className="page">
        <CheckoutFlow locale={locale} dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

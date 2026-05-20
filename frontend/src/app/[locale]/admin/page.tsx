import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';
import { AdminApp } from './AdminApp';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDict(locale);
  return <AdminApp locale={locale} dict={dict} />;
}

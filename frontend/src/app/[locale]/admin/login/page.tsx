import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { AdminLogin } from './AdminLogin';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminLoginPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  return <AdminLogin locale={locale} />;
}

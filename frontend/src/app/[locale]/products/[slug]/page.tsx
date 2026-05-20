import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS, findProductBySlug } from '@/lib/data';
import { categoryName, isLocale, productName, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductDetail } from './ProductDetail';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDict(locale);
  const product = findProductBySlug(slug);
  if (!product) notFound();

  const cat = CATEGORIES.find((c) => c.slug === product.categorySlug)!;
  const related = PRODUCTS.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <>
      <Navbar locale={locale} dict={dict} />
      <main className="page">
        <div
          className="wrap"
          style={{ paddingBlock: '32px 16px', fontSize: 12, letterSpacing: '0.12em', color: 'var(--warm-gray)' }}
        >
          <Link href={`/${locale}`}>ACCUEIL</Link> <span>/</span>{' '}
          <Link href={`/${locale}/catalog`}>{dict.nav.catalog.toUpperCase()}</Link> <span>/</span>{' '}
          <Link href={`/${locale}/catalog?category=${cat.slug}`}>
            {categoryName(cat, locale).toUpperCase()}
          </Link>{' '}
          <span>/</span>{' '}
          <span style={{ color: 'var(--charcoal)' }}>{productName(product, locale).toUpperCase()}</span>
        </div>

        <ProductDetail product={product} locale={locale} dict={dict} />

        <section style={{ background: 'var(--ivory)' }} className="py-12 md:py-20 lg:py-24">
          <div className="wrap">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-8 md:mb-12">
              <h2 className="display italic" style={{ fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 300 }}>
                {dict.product.related}
              </h2>
              <Link href={`/${locale}/catalog?category=${cat.slug}`} className="btn-ghost self-start sm:self-end">
                {categoryName(cat, locale)} →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, HUE_BG, HUE_BOTTLE, PRODUCTS } from '@/lib/data';
import { isLocale, categoryName, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Marquee } from '@/components/layout/Marquee';
import { BottleSVG } from '@/components/ui/BottleSVG';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDict(locale);
  const featured = PRODUCTS.slice(0, 6);

  return (
    <>
      <Navbar locale={locale} dict={dict} />
      <main className="page">
        {/* HERO */}
        <section style={{ borderBottom: '1px solid var(--hairline)' }}>
          <div
            className="wrap grid items-center gap-10 md:gap-16 lg:grid-cols-[1.05fr_1fr] py-12 md:py-20 lg:py-24"
          >
            <div className="flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
              <div className="row" style={{ alignItems: 'center', gap: 16 }}>
                <span style={{ width: 48, height: 1, background: 'var(--accent)' }} />
                <span className="caption" style={{ color: 'var(--accent)' }}>{dict.home.eyebrow}</span>
              </div>
              <h1
                className="display text-center lg:text-start"
                style={{
                  fontSize: 'clamp(48px, 12vw, 96px)', lineHeight: 0.98, fontWeight: 300,
                  letterSpacing: '-0.025em', whiteSpace: 'pre-line',
                  fontStyle: 'italic',
                }}
              >
                {dict.home.heroTitle}
              </h1>
              <p style={{ fontSize: 16, color: 'var(--graphite)', maxWidth: 440, lineHeight: 1.65 }}>
                {dict.home.heroSub}
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link href={`/${locale}/catalog`} className="btn btn-primary">
                  {dict.home.heroCta}
                </Link>
                <Link href={`/${locale}`} className="btn btn-ghost">
                  {dict.home.heroSecondary}
                </Link>
              </div>
              <div className="flex gap-8 md:gap-12 mt-4 md:mt-8">
                {[
                  { n: '12', l: 'Compositions' },
                  { n: '2024', l: 'Fondée' },
                  { n: '48h', l: 'Livraison NKC' },
                ].map((s) => (
                  <div key={s.l} className="col" style={{ gap: 4 }}>
                    <span className="display" style={{ fontSize: 24 }}>{s.n}</span>
                    <span className="caption" style={{ fontSize: 10 }}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }} className="order-1 lg:order-2">
              <div style={{ position: 'absolute', top: -16, right: -16, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)' }}>
                N° 04 / 12
              </div>
              <div style={{ background: HUE_BG.oud, aspectRatio: '4/5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.14), transparent 60%)' }} />
                <BottleSVG hue="oud" size="lg" name="Oud Royal" sku="AMP-004" concentration="Extrait" />
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex justify-between items-end" style={{ color: 'var(--cream)' }}>
                  <div>
                    <span className="caption" style={{ color: 'var(--accent-soft)' }}>Oriental · Extrait</span>
                    <div className="display italic" style={{ fontSize: 28, fontWeight: 300, marginTop: 4 }}>Oud Royal</div>
                  </div>
                  <Link
                    href={`/${locale}/products/oud-royal`}
                    style={{ color: 'var(--cream)', borderBottom: '1px solid var(--cream)', paddingBottom: 4, fontSize: 11, letterSpacing: '0.18em' }}
                  >
                    DÉCOUVRIR →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Marquee text={dict.home.marquee} />

        {/* FEATURED */}
        <section className="sect">
          <div className="wrap">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-10 md:mb-14">
              <div>
                <span className="caption" style={{ color: 'var(--accent)' }}>{dict.home.featured}</span>
                <h2 className="display italic mt-3" style={{ fontSize: 'clamp(32px, 7vw, 56px)', fontWeight: 300 }}>
                  Compositions récentes
                </h2>
                <p className="small" style={{ marginTop: 12, maxWidth: 380 }}>{dict.home.featuredSub}</p>
              </div>
              <Link href={`/${locale}/catalog`} className="btn-ghost self-start sm:self-end">
                {dict.home.seeAll} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 md:gap-x-8 md:gap-y-12">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </section>

        {/* BRAND STORY */}
        <section style={{ background: 'var(--ivory)' }}>
          <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center py-16 md:py-24 lg:py-32">
            <div style={{ aspectRatio: '4/5', background: 'linear-gradient(180deg, #2c2620 0%, #4a3e30 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.25, background: 'repeating-linear-gradient(45deg, rgba(245,239,230,0.04) 0 1px, transparent 1px 16px)' }} />
              <div style={{ position: 'relative', display: 'flex', gap: 24, alignItems: 'flex-end' }}>
                <div style={{ width: 80, height: 200, background: '#1a1612', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '60% 14% 12%', background: '#c9b79a', opacity: 0.9 }} />
                </div>
                <div style={{ width: 110, height: 260, background: '#0e0c0a', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '55% 14% 10%', background: '#f5efe6', opacity: 0.95 }} />
                </div>
                <div style={{ width: 70, height: 180, background: '#3a2820', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '58% 14% 12%', background: '#a07642', opacity: 0.9 }} />
                </div>
              </div>
              <span className="mono" style={{ position: 'absolute', bottom: 24, left: 24, fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent-soft)' }}>
                L&apos;ATELIER · NOUAKCHOTT · MMXXIV
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <span className="caption" style={{ color: 'var(--accent)' }}>{dict.home.story}</span>
              <h2 className="display italic text-center lg:text-start" style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 300, lineHeight: 1 }}>
                Une mémoire olfactive du désert.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--graphite)' }}>{dict.home.storyP1}</p>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--graphite)' }}>{dict.home.storyP2}</p>
              <div className="row" style={{ gap: 16, marginTop: 16 }}>
                <button className="btn btn-secondary">{dict.home.storyCta}</button>
              </div>
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--hairline)' }}>
                <p className="display italic" style={{ fontSize: 22, color: 'var(--warm-gray)' }}>
                  «&nbsp;L&apos;élégance, c&apos;est ce qui reste quand on a tout enlevé.&nbsp;»
                </p>
                <span className="caption" style={{ marginTop: 8, display: 'block' }}>
                  — Ammar El‑Maghevry, fondateur
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="sect">
          <div className="wrap">
            <SectionHeader eyebrow="UNIVERS" title={dict.home.categories} align="left" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {CATEGORIES.map((c, idx) => {
                const hue = (['rose', 'midnight', 'sand', 'oud', 'gold'] as const)[idx];
                return (
                  <Link
                    key={c.id}
                    href={`/${locale}/catalog?category=${c.slug}`}
                    style={{
                      aspectRatio: '3/4', background: HUE_BG[hue], position: 'relative',
                      overflow: 'hidden', display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between', padding: 22,
                      color: HUE_BOTTLE[hue].label, textAlign: 'left',
                    }}
                  >
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.22em' }}>0{idx + 1}</span>
                    <div>
                      <div className="display italic" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1 }}>
                        {categoryName(c, locale)}
                      </div>
                      <div style={{ marginTop: 18, fontSize: 11, letterSpacing: '0.18em' }}>EXPLORER →</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* LIMITED EDITION BANNER */}
        <section style={{ background: 'var(--charcoal)', color: 'var(--cream)' }}>
          <div className="wrap grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center py-16 md:py-24 lg:py-32">
            <div className="col gap-lg">
              <span className="caption" style={{ color: 'var(--accent-soft)' }}>N° 11 · {dict.home.newArrivals}</span>
              <h2 className="display italic" style={{ fontSize: 'clamp(48px, 12vw, 88px)', fontWeight: 300, lineHeight: 0.95 }}>
                Or et Encens
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--accent-soft)', maxWidth: 480 }}>
                {dict.home.newArrivalsSub} Composée d&apos;encens d&apos;Oman, de myrrhe et d&apos;un cœur d&apos;oud cambodgien.
              </p>
              <div className="flex flex-wrap gap-6 sm:gap-8 mt-4 pt-8" style={{ borderTop: '1px solid rgba(245,239,230,0.18)' }}>
                <div>
                  <div className="caption" style={{ color: 'var(--accent-soft)' }}>NUMÉROTATION</div>
                  <div className="mono" style={{ fontSize: 14, marginTop: 6 }}>001 / 200</div>
                </div>
                <div>
                  <div className="caption" style={{ color: 'var(--accent-soft)' }}>CONTENANCE</div>
                  <div className="mono" style={{ fontSize: 14, marginTop: 6 }}>50 ML EXTRAIT</div>
                </div>
                <div>
                  <div className="caption" style={{ color: 'var(--accent-soft)' }}>PRIX</div>
                  <div className="mono" style={{ fontSize: 14, marginTop: 6 }}>18 500 MRU</div>
                </div>
              </div>
              <div className="row" style={{ gap: 16, marginTop: 8 }}>
                <Link
                  href={`/${locale}/products/or-et-encens`}
                  className="btn btn-primary"
                  style={{ background: 'var(--accent)', color: 'var(--cream)' }}
                >
                  Découvrir l&apos;édition
                </Link>
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: HUE_BG.gold, aspectRatio: '3/4', width: '100%', maxWidth: 420, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BottleSVG hue="gold" size="lg" name="Or et Encens" sku="AMP-011" concentration="Extrait" />
                <span className="mono" style={{ position: 'absolute', top: 24, right: 24, fontSize: 10, letterSpacing: '0.22em', color: 'var(--accent-soft)' }}>
                  ★ ÉDITION LIMITÉE
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* JOURNAL */}
        <section className="sect">
          <div className="wrap">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-10 md:mb-14">
              <div>
                <span className="caption" style={{ color: 'var(--accent)' }}>JOURNAL</span>
                <h2 className="display italic mt-3" style={{ fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 300 }}>
                  Écrits de l&apos;atelier
                </h2>
              </div>
              <button className="btn-ghost self-start sm:self-end">Tous les articles →</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { tag: 'Composition', date: '14 MAI 2026', title: "Pourquoi le oud n'est pas un cliché", hue: 'oud' as const, read: '6 min' },
                { tag: 'Voyage', date: '02 MAI 2026', title: 'Chinguetti, ville de la rose ancienne', hue: 'rose' as const, read: '8 min' },
                { tag: 'Savoir‑faire', date: '21 AVR 2026', title: "L'art du conditionnement à la main", hue: 'sand' as const, read: '5 min' },
              ].map((a) => (
                <article key={a.title} style={{ cursor: 'pointer' }}>
                  <div style={{ aspectRatio: '4/3', background: HUE_BG[a.hue], position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.22, background: 'repeating-linear-gradient(45deg, rgba(245,239,230,0.06) 0 1px, transparent 1px 14px)' }} />
                    <span
                      className="mono"
                      style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, letterSpacing: '0.22em', color: HUE_BOTTLE[a.hue].label, opacity: 0.85 }}
                    >
                      {a.tag.toUpperCase()}
                    </span>
                  </div>
                  <div className="caption" style={{ marginTop: 18 }}>
                    {a.date} · {a.read} de lecture
                  </div>
                  <h4 className="display italic" style={{ fontSize: 24, fontWeight: 400, marginTop: 10 }}>{a.title}</h4>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

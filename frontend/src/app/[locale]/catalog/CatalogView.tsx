'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CATEGORIES, FAMILIES, PRODUCTS } from '@/lib/data';
import { formatPrice, type Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';
import { ProductCard } from '@/components/ui/ProductCard';

type Sort = 'newest' | 'price_asc' | 'price_desc';

interface CatalogViewProps {
  locale: Locale;
  dict: Dict;
  initialCategory: string;
}

export function CatalogView({ locale, dict, initialCategory }: CatalogViewProps) {
  const [category, setCategory] = useState(initialCategory);
  const [families, setFamilies] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(20000);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<Sort>('newest');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const filtered = useMemo(() => {
    let arr = [...PRODUCTS];
    if (category !== 'all') arr = arr.filter((p) => p.categorySlug === category);
    if (families.length) arr = arr.filter((p) => families.some((f) => p.family.includes(f)));
    arr = arr.filter((p) => p.price <= priceMax);
    if (inStock) arr = arr.filter((p) => p.stock > 0);
    if (sort === 'price_asc') arr.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [category, families, priceMax, inStock, sort]);

  const toggleFamily = (f: string) =>
    setFamilies((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  const reset = () => {
    setCategory('all');
    setFamilies([]);
    setPriceMax(20000);
    setInStock(false);
    setSort('newest');
  };

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--hairline)', background: 'var(--ivory)' }}>
        <div className="wrap py-10 md:py-16">
          <div className="caption" style={{ color: 'var(--accent)' }}>
            {filtered.length} {dict.catalog.results}
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end md:mt-4">
            <div>
              <h1 className="display italic" style={{ fontSize: 'clamp(40px, 11vw, 88px)', fontWeight: 300, lineHeight: 0.95 }}>
                {dict.catalog.title}
              </h1>
              <p style={{ marginTop: 16, color: 'var(--warm-gray)', maxWidth: 480, fontSize: 16 }}>
                {dict.catalog.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="caption hidden md:inline">{dict.catalog.sort}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="flex-1 md:flex-initial"
                style={{
                  background: 'transparent', border: 'none',
                  borderBottom: '1px solid var(--charcoal)', padding: '8px 0',
                  fontSize: 13, outline: 'none', minWidth: 0, cursor: 'pointer',
                }}
              >
                <option value="newest">{dict.catalog.sortNewest}</option>
                <option value="price_asc">{dict.catalog.sortPriceAsc}</option>
                <option value="price_desc">{dict.catalog.sortPriceDesc}</option>
              </select>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="btn btn-secondary lg:hidden"
                style={{ padding: '10px 16px' }}
              >
                {dict.catalog.filters}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16">
          <aside className="hidden lg:flex flex-col gap-10">
            <Filters
              dict={dict} locale={locale}
              category={category} setCategory={setCategory}
              families={families} toggleFamily={toggleFamily}
              priceMax={priceMax} setPriceMax={setPriceMax}
              inStock={inStock} setInStock={setInStock}
              reset={reset}
            />
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div style={{ padding: '96px 0', textAlign: 'center', color: 'var(--warm-gray)' }}>
                {dict.catalog.noResults}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 md:gap-x-8 md:gap-y-14">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div
        className="lg:hidden"
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,26,26,0.55)',
          zIndex: 100,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: '88vh',
            background: 'var(--cream)',
            display: 'flex',
            flexDirection: 'column',
            transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 340ms cubic-bezier(0.32, 0.72, 0, 1)',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
            <span style={{ width: 36, height: 4, background: 'var(--hairline)', borderRadius: 2 }} />
          </div>
          <div className="flex justify-between items-center" style={{ padding: '12px 20px 16px', borderBottom: '1px solid var(--hairline)' }}>
            <h3 className="display italic" style={{ fontSize: 24, fontWeight: 400 }}>
              {dict.catalog.filters}
            </h3>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Fermer"
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginInlineEnd: -10 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 16px' }}>
            <Filters
              dict={dict} locale={locale}
              category={category} setCategory={setCategory}
              families={families} toggleFamily={toggleFamily}
              priceMax={priceMax} setPriceMax={setPriceMax}
              inStock={inStock} setInStock={setInStock}
              reset={reset}
            />
          </div>
          <div
            style={{
              padding: '12px 20px calc(12px + env(safe-area-inset-bottom))',
              borderTop: '1px solid var(--hairline)',
              background: 'var(--cream)',
              display: 'flex',
              gap: 10,
            }}
          >
            <button
              className="btn btn-secondary"
              style={{ flex: '0 0 auto', height: 48, padding: '0 18px' }}
              onClick={reset}
            >
              {dict.catalog.clearAll}
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1, height: 48 }}
              onClick={() => setDrawerOpen(false)}
            >
              Voir {filtered.length} résultats
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface FiltersProps {
  dict: Dict;
  locale: Locale;
  category: string;
  setCategory: (c: string) => void;
  families: string[];
  toggleFamily: (f: string) => void;
  priceMax: number;
  setPriceMax: (n: number) => void;
  inStock: boolean;
  setInStock: (b: boolean) => void;
  reset: () => void;
}

function Filters({
  dict, locale, category, setCategory, families, toggleFamily,
  priceMax, setPriceMax, inStock, setInStock, reset,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-10">
      <FilterGroup title={dict.catalog.category}>
        {[
          { slug: 'all', fr: 'Tous les parfums', ar: 'كل العطور', en: 'All fragrances' },
          ...CATEGORIES.map((c) => ({ slug: c.slug as string, fr: c.fr, ar: c.ar, en: c.en })),
        ].map((c) => (
          <button
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            style={{
              textAlign: 'left', padding: '10px 0', minHeight: 44,
              borderBottom: category === c.slug ? '1px solid var(--charcoal)' : '1px solid transparent',
              color: category === c.slug ? 'var(--charcoal)' : 'var(--warm-gray)',
              fontSize: 15, alignSelf: 'flex-start',
            }}
          >
            {c[locale]}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title={dict.catalog.family}>
        {FAMILIES.slice(0, 8).map((f) => {
          const on = families.includes(f);
          return (
            <button
              key={f}
              onClick={() => toggleFamily(f)}
              style={{
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', fontSize: 15, minHeight: 44,
                color: on ? 'var(--charcoal)' : 'var(--warm-gray)',
              }}
            >
              <span style={{ width: 16, height: 16, border: '1px solid var(--charcoal)', background: on ? 'var(--charcoal)' : 'transparent', display: 'inline-block', flexShrink: 0 }} />
              {f}
            </button>
          );
        })}
      </FilterGroup>

      <FilterGroup title={dict.catalog.price}>
        <input
          type="range" min={5000} max={20000} step={500}
          value={priceMax}
          onChange={(e) => setPriceMax(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, color: 'var(--warm-gray)' }}>
          <span>5 000</span>
          <span className="mono">
            ≤ {formatPrice(priceMax, locale)} {dict.common.currency}
          </span>
        </div>
      </FilterGroup>

      <FilterGroup title="">
        <button
          onClick={() => setInStock(!inStock)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', fontSize: 15, minHeight: 44 }}
        >
          <span style={{ width: 16, height: 16, border: '1px solid var(--charcoal)', background: inStock ? 'var(--charcoal)' : 'transparent', flexShrink: 0 }} />
          {dict.catalog.inStock}
        </button>
        <button onClick={reset} className="btn-ghost hidden lg:inline-flex" style={{ marginTop: 24, alignSelf: 'flex-start' }}>
          {dict.catalog.clearAll}
        </button>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="col" style={{ gap: 14 }}>
      {title && <div className="caption">{title}</div>}
      {children}
    </div>
  );
}

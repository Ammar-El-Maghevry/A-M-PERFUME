'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CATEGORIES, findProduct } from '@/lib/data';
import { formatPrice, productName, type Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';
import { ProductImage } from '@/components/ui/ProductImage';
import { useCart } from '@/store/cartStore';

interface CartViewProps {
  locale: Locale;
  dict: Dict;
}

export function CartView({ locale, dict }: CartViewProps) {
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const enriched = items
    .map((c) => ({ ...c, product: findProduct(c.productId) }))
    .filter((c): c is { productId: number; quantity: number; product: NonNullable<typeof c.product> } => Boolean(c.product));
  const subtotal = enriched.reduce((a, c) => a + c.product.price * c.quantity, 0);

  if (!hydrated) {
    return <section style={{ paddingBlock: 160 }} />;
  }

  return (
    <>
      <section className="pt-10 pb-6 md:pt-16 md:pb-8" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <div className="wrap">
          <span className="caption" style={{ color: 'var(--accent)' }}>
            {enriched.length} {enriched.length === 1 ? dict.cart.item : dict.cart.items}
          </span>
          <h1 className="display italic" style={{ fontSize: 'clamp(36px, 9vw, 72px)', fontWeight: 300, marginTop: 12 }}>
            {dict.cart.title}
          </h1>
        </div>
      </section>

      {enriched.length === 0 ? (
        <section style={{ paddingBlock: 160, textAlign: 'center' }}>
          <div className="wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4">
              <path d="M5 8h14l-1.4 11.2A2 2 0 0 1 15.6 21H8.4a2 2 0 0 1-2-1.8L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <p className="display italic" style={{ fontSize: 32, color: 'var(--warm-gray)' }}>{dict.cart.empty}</p>
            <Link href={`/${locale}/catalog`} className="btn btn-primary">{dict.cart.emptyCta}</Link>
          </div>
        </section>
      ) : (
        <section className="py-10 md:py-16">
          <div className="wrap grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-20 items-start">
            <div>
              {enriched.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="grid grid-cols-[88px_1fr] md:grid-cols-[140px_1fr_auto_auto_auto] gap-x-4 gap-y-3 md:gap-7 py-6 md:py-7 items-center"
                  style={{ borderBottom: '1px solid var(--hairline)' }}
                >
                  <Link href={`/${locale}/products/${product.slug}`} className="md:w-[140px] row-span-2 md:row-span-1">
                    <ProductImage product={product} ratio="1/1" size="sm" />
                  </Link>
                  <div className="col" style={{ gap: 8 }}>
                    <span className="caption">
                      {CATEGORIES.find((c) => c.slug === product.categorySlug)?.fr} · {product.concentration}
                    </span>
                    <h4 className="display italic" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.15 }}>
                      {productName(product, locale)}
                    </h4>
                    <span className="small">{product.size} · {product.sku}</span>
                  </div>
                  <div className="col-start-2 md:col-start-auto flex items-center justify-between md:contents gap-4">
                    <div className="row" style={{ alignItems: 'center', border: '1px solid var(--hairline)' }}>
                      <button onClick={() => updateQty(product.id, quantity - 1)} aria-label="−" style={{ width: 44, height: 44, fontSize: 18 }}>−</button>
                      <span className="mono" style={{ width: 36, textAlign: 'center', fontSize: 14 }}>{quantity}</span>
                      <button onClick={() => updateQty(product.id, quantity + 1)} aria-label="+" style={{ width: 44, height: 44, fontSize: 18 }}>+</button>
                    </div>
                    <span className="mono" style={{ fontSize: 15, minWidth: 100, textAlign: 'right' }}>
                      {formatPrice(product.price * quantity, locale)} {dict.common.currency}
                    </span>
                    <button onClick={() => remove(product.id)} aria-label={dict.cart.remove} style={{ color: 'var(--warm-gray)', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginInlineEnd: -10 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 6l12 12M6 18L18 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <Link href={`/${locale}/catalog`} className="btn-ghost inline-block mt-8">
                ← {dict.cart.continueShopping}
              </Link>
            </div>

            <aside className="lg:sticky lg:top-24 p-6 md:p-9" style={{ background: 'var(--ivory)' }}>
              <h3 className="display italic" style={{ fontSize: 24, fontWeight: 400 }}>{dict.checkout.summary}</h3>
              <div className="col gap" style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span>{dict.cart.subtotal}</span>
                  <span className="mono">
                    {formatPrice(subtotal, locale)} {dict.common.currency}
                  </span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between', color: 'var(--warm-gray)' }}>
                  <span>{dict.cart.shipping}</span>
                  <span className="small italic">{dict.cart.toBeConfirmed}</span>
                </div>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--charcoal)', alignItems: 'baseline' }}>
                <span style={{ fontSize: 18 }}>{dict.cart.total}</span>
                <span style={{ fontSize: 24 }} className="mono">
                  {formatPrice(subtotal, locale)} {dict.common.currency}
                </span>
              </div>
              <Link href={`/${locale}/checkout`} className="btn btn-primary btn-full" style={{ marginTop: 28, height: 54 }}>
                {dict.cart.checkout} →
              </Link>
              <div style={{ marginTop: 18, fontSize: 11, letterSpacing: '0.16em', color: 'var(--warm-gray)', textAlign: 'center' }}>
                BANKILY · SEDAD · MASRVI · WHATSAPP
              </div>
            </aside>
          </div>
        </section>
      )}
    </>
  );
}

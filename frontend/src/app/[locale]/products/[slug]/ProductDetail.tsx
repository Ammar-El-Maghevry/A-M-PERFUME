'use client';

import { useState } from 'react';
import { CATEGORIES, HUE_BG, HUE_BOTTLE, type Product } from '@/lib/data';
import { categoryName, formatPrice, productName, type Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';
import { BottleSVG } from '@/components/ui/BottleSVG';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';

interface ProductDetailProps {
  product: Product;
  locale: Locale;
  dict: Dict;
}

const GALLERY = ['main', 'detail', 'macro', 'shadow'] as const;
type View = (typeof GALLERY)[number];

export function ProductDetail({ product, locale, dict }: ProductDetailProps) {
  const cat = CATEGORIES.find((c) => c.slug === product.categorySlug)!;
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState<View>('main');
  const add = useCart((s) => s.add);
  const wishIds = useWishlist((s) => s.ids);
  const toggleWish = useWishlist((s) => s.toggle);
  const isWish = wishIds.includes(product.id);

  const transformFor = (v: View) =>
    v === 'macro'
      ? 'scale(1.25)'
      : v === 'detail'
        ? 'scale(1.05) rotate(-3deg)'
        : v === 'shadow'
          ? 'scale(0.95) translateY(20px)'
          : 'scale(1)';

  return (
    <section className="pt-4 pb-24 lg:pt-8 lg:pb-24">
      <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div
            style={{
              aspectRatio: '3/4', background: HUE_BG[product.hue], position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.18), transparent 60%)' }} />
            <div style={{ transform: transformFor(active), transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)' }}>
              <BottleSVG hue={product.hue} size="lg" name={product.nameFr} sku={product.sku} concentration={product.concentration} />
            </div>
            <span className="mono" style={{ position: 'absolute', top: 24, left: 24, fontSize: 10, letterSpacing: '0.22em', color: HUE_BOTTLE[product.hue].label, opacity: 0.7 }}>
              {product.sku}
            </span>
            <span className="mono" style={{ position: 'absolute', top: 24, right: 24, fontSize: 10, letterSpacing: '0.22em', color: HUE_BOTTLE[product.hue].label, opacity: 0.7 }}>
              N° {String(product.id).padStart(2, '0')} / 12
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-1 px-1">
            {GALLERY.map((v) => (
              <button
                key={v}
                onClick={() => setActive(v)}
                style={{
                  width: 80, height: 80, flexShrink: 0,
                  background: HUE_BG[product.hue],
                  position: 'relative', overflow: 'hidden',
                  border: active === v ? '1px solid var(--charcoal)' : '1px solid transparent',
                  padding: 0,
                }}
                className="md:flex-1 md:w-auto md:h-auto md:aspect-square"
              >
                <div
                  style={{
                    transform:
                      v === 'macro'
                        ? 'scale(1.5)'
                        : v === 'detail'
                          ? 'scale(1.1) rotate(-6deg)'
                          : v === 'shadow'
                            ? 'scale(0.85)'
                            : 'scale(0.95)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
                  }}
                >
                  <BottleSVG hue={product.hue} size="sm" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="row" style={{ alignItems: 'center', gap: 14 }}>
            <span className="caption" style={{ color: 'var(--accent)' }}>
              {categoryName(cat, locale)} · {product.family}
            </span>
            {product.limited && <span className="badge bronze">Édition limitée</span>}
          </div>
          <h1 className="display italic" style={{ fontSize: 'clamp(40px, 9vw, 72px)', fontWeight: 300, lineHeight: 0.98 }}>
            {productName(product, locale)}
          </h1>
          <p className="display italic" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'var(--warm-gray)', maxWidth: 480 }}>
            {product.tagline}
          </p>
          <div className="row" style={{ alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontSize: 30, color: 'var(--accent)' }} className="mono">
              {formatPrice(product.price, locale)}
            </span>
            <span className="caption">
              {dict.common.currency} · {product.size}
            </span>
            <span className="badge" style={{ marginInlineStart: 'auto' }}>
              {product.stock > 5 ? dict.product.inStock : product.stock > 0 ? dict.product.lowStock : dict.product.outOfStock}
            </span>
          </div>
          <hr className="hr" />
          <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--graphite)' }}>{product.description}</p>

          <div style={{ marginTop: 24 }}>
            <div className="caption">{dict.product.pyramid}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 20, gap: 0 }}>
              {[
                { label: dict.product.topNotes, notes: product.notes.top },
                { label: dict.product.heartNotes, notes: product.notes.heart },
                { label: dict.product.baseNotes, notes: product.notes.base },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 16px',
                    borderInlineEnd: i < 2 ? '1px solid var(--hairline)' : 'none',
                  }}
                >
                  <span className="caption" style={{ color: 'var(--accent)' }}>{row.label}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {row.notes.map((n) => (
                      <span key={n} className="display italic" style={{ fontSize: 18, color: 'var(--graphite)' }}>{n}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 32px', marginTop: 8 }}>
            {[
              [dict.product.concentration, product.concentration],
              [dict.product.size, product.size],
              [dict.product.longevity, product.longevity],
              [dict.product.sillage, product.sillage],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', padding: '14px 0',
                  borderTop: '1px solid var(--hairline)', fontSize: 14,
                }}
              >
                <span className="caption">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>

          {/* Desktop add-to-cart inline */}
          <div className="hidden md:flex gap-4 mt-6 items-stretch">
            <div className="row" style={{ alignItems: 'center', border: '1px solid var(--charcoal)' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 50, fontSize: 18 }}>−</button>
              <div className="mono" style={{ width: 36, textAlign: 'center', fontSize: 14 }}>{qty}</div>
              <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 50, fontSize: 18 }}>+</button>
            </div>
            <button
              className="btn btn-primary"
              style={{ flex: 1, height: 50 }}
              onClick={() => add(product.id, qty)}
            >
              {dict.product.addToCart} · {formatPrice(product.price * qty, locale)} {dict.common.currency}
            </button>
            <button
              className="btn btn-secondary"
              style={{
                width: 50, height: 50, padding: 0,
                color: isWish ? 'var(--accent)' : 'var(--charcoal)',
                borderColor: isWish ? 'var(--accent)' : 'var(--charcoal)',
              }}
              onClick={() => toggleWish(product.id)}
              aria-label={dict.product.addToWishlist}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isWish ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>

          <div
            style={{
              marginTop: 16, paddingTop: 24, borderTop: '1px solid var(--hairline)',
              display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--warm-gray)',
            }}
          >
            <div className="row" style={{ gap: 12, alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="8" width="13" height="11" />
                <path d="M16 11h4l1 3v5h-5z" />
                <circle cx="7" cy="19" r="2" />
                <circle cx="17" cy="19" r="2" />
              </svg>
              {dict.product.delivery}
            </div>
            <div className="row" style={{ gap: 12, alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="6" width="18" height="12" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {dict.product.payment}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom action bar */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          inset: 'auto 0 0 0',
          background: 'var(--cream)',
          borderTop: '1px solid var(--hairline)',
          padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
          zIndex: 40,
          display: 'flex',
          gap: 8,
          alignItems: 'stretch',
        }}
      >
        <div className="row" style={{ alignItems: 'center', border: '1px solid var(--charcoal)' }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 46, fontSize: 18 }}>−</button>
          <div className="mono" style={{ width: 28, textAlign: 'center', fontSize: 13 }}>{qty}</div>
          <button onClick={() => setQty(qty + 1)} style={{ width: 36, height: 46, fontSize: 18 }}>+</button>
        </div>
        <button
          className="btn btn-primary"
          style={{ flex: 1, height: 46, padding: '0 12px', fontSize: 11 }}
          onClick={() => add(product.id, qty)}
        >
          {dict.product.addToCart} · {formatPrice(product.price * qty, locale)} {dict.common.currency}
        </button>
        <button
          className="btn btn-secondary"
          style={{
            width: 46, height: 46, padding: 0,
            color: isWish ? 'var(--accent)' : 'var(--charcoal)',
            borderColor: isWish ? 'var(--accent)' : 'var(--charcoal)',
            flexShrink: 0,
          }}
          onClick={() => toggleWish(product.id)}
          aria-label={dict.product.addToWishlist}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isWish ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>
    </section>
  );
}

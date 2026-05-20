'use client';

import Link from 'next/link';
import { CATEGORIES, type Product } from '@/lib/data';
import { categoryName, productName, formatPrice, type Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';
import { useWishlist } from '@/store/wishlistStore';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  dict: Dict;
  showFamily?: boolean;
}

export function ProductCard({ product, locale, dict, showFamily = true }: ProductCardProps) {
  const cat = CATEGORIES.find((c) => c.slug === product.categorySlug)!;
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const isWish = ids.includes(product.id);

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="product-card"
    >
      <div className="product-card-image-wrap">
        <div className="product-card-image">
          <ProductImage product={product} />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          aria-label={dict.product.addToWishlist}
          className={`product-card-wishlist ${isWish ? 'active' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isWish ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
        {product.limited && (
          <span className="badge bronze product-card-badge">
            {locale === 'ar' ? 'إصدار محدود' : locale === 'en' ? 'Limited Edition' : 'Édition limitée'}
          </span>
        )}
      </div>
      <div className="product-card-content">
        <span className="product-card-category">
          {categoryName(cat, locale)}
          {showFamily ? ` · ${product.family}` : ''}
        </span>
        <h4 className="product-card-title display">
          {productName(product, locale)}
        </h4>
        <div className="product-card-meta">
          <span className="product-card-price">
            {formatPrice(product.price, locale)} {dict.common.currency}
          </span>
          <span className="product-card-spec">
            {product.size} ·{' '}
            {product.concentration === 'Extrait de Parfum'
              ? 'EXTRAIT'
              : product.concentration === 'Eau de Toilette'
                ? 'EDT'
                : 'EDP'}
          </span>
        </div>
      </div>
    </Link>
  );
}

import { HUE_BG, HUE_BOTTLE, type Product } from '@/lib/data';
import { BottleSVG } from './BottleSVG';

interface ProductImageProps {
  product: Product;
  ratio?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProductImage({ product, ratio = '4/5', size = 'md' }: ProductImageProps) {
  const bg = HUE_BG[product.hue];
  return (
    <div style={{ aspectRatio: ratio, background: bg, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.15), transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ transform: 'translateY(8%)' }}>
        <BottleSVG hue={product.hue} size={size} sku={product.sku} name={product.nameFr} concentration={product.concentration} />
      </div>
      <div
        className="product-image-meta"
        style={{
          color: HUE_BOTTLE[product.hue].label,
        }}
      >
        <span className="product-image-sku">{product.sku}</span>
        <span>{product.size}</span>
      </div>
    </div>
  );
}

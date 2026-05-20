import { HUE_BOTTLE, type Hue } from '@/lib/data';

interface BottleProps {
  hue: Hue;
  size?: 'sm' | 'md' | 'lg';
  sku?: string;
  name?: string;
  concentration?: string;
}

export function BottleSVG({ hue, size = 'md', sku = '', name = '', concentration = '' }: BottleProps) {
  const colors = HUE_BOTTLE[hue];
  const W = size === 'lg' ? 360 : size === 'sm' ? 140 : 220;
  const H = Math.round(W * 1.45);
  return (
    <svg viewBox="0 0 220 320" width={W} height={H} aria-hidden style={{ display: 'block' }}>
      {size === 'lg' && (
        <g opacity="0.85">
          <line x1="155" y1="46" x2="195" y2="58" stroke={colors.cap} strokeWidth="2" />
          <circle cx="200" cy="62" r="14" fill={colors.cap} opacity="0.85" />
        </g>
      )}
      <rect x="86" y="14" width="48" height="38" fill={colors.cap} />
      <rect x="96" y="52" width="28" height="22" fill={colors.cap} opacity="0.9" />
      <path
        d="M60 90 Q60 74 80 74 H140 Q160 74 160 90 V286 Q160 302 144 302 H76 Q60 302 60 286 Z"
        fill={colors.liquid}
      />
      <path d="M64 96 Q64 80 82 80 V296 Q64 296 64 282 Z" fill="rgba(255,255,255,0.08)" />
      <rect x="74" y="158" width="72" height="100" fill={colors.label} opacity="0.95" />
      <rect x="80" y="164" width="60" height="88" fill="none" stroke={colors.liquid} strokeWidth="0.5" opacity="0.35" />
      <text x="110" y="186" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontWeight="500" fontSize="13" fill={colors.liquid}>A&amp;M</text>
      <line x1="92" y1="194" x2="128" y2="194" stroke={colors.liquid} strokeWidth="0.5" opacity="0.4" />
      <text x="110" y="218" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontWeight="400" fontSize="10" fill={colors.liquid} fontStyle="italic">
        {(name || '').slice(0, 18)}
      </text>
      <text x="110" y="240" textAnchor="middle" fontFamily="'Inter Tight', sans-serif" fontSize="6" letterSpacing="1.2" fill={colors.liquid} opacity="0.7">
        {concentration?.toUpperCase()}
      </text>
      <text x="110" y="252" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="5" letterSpacing="1" fill={colors.liquid} opacity="0.6">
        {sku}
      </text>
    </svg>
  );
}

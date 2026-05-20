interface LogoProps {
  size?: number;
  mark?: boolean;
  dark?: boolean;
}

export function Logo({ size = 22, mark = true, dark = true }: LogoProps) {
  const color = dark ? 'var(--charcoal)' : 'var(--cream)';
  return (
    <div className="row" style={{ alignItems: 'center', gap: 10, color }}>
      {mark && (
        <svg width={size} height={size * 1.2} viewBox="0 0 40 48" fill="none" aria-hidden>
          <rect x="14" y="2" width="12" height="6" fill="currentColor" />
          <rect x="16" y="8" width="8" height="6" fill="currentColor" />
          <path d="M8 18 Q8 14 12 14 H28 Q32 14 32 18 V40 Q32 44 28 44 H12 Q8 44 8 40 Z" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="14" y="22" width="12" height="16" fill="currentColor" />
          <circle cx="36" cy="14" r="3.5" fill="currentColor" />
          <path d="M32 10 Q34 10 36 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span className="display" style={{ fontSize: size * 1.05, fontWeight: 500, letterSpacing: '0.04em' }}>A&amp;M</span>
        <span className="caption" style={{ fontSize: size * 0.42, letterSpacing: '0.32em', marginTop: 2, color: 'inherit', opacity: 0.85 }}>PERFUME</span>
      </div>
    </div>
  );
}

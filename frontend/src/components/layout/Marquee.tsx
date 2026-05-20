interface MarqueeProps {
  text: string;
  dark?: boolean;
}

export function Marquee({ text, dark = false }: MarqueeProps) {
  const reps = Array.from({ length: 6 });
  return (
    <div
      style={{
        background: dark ? 'var(--charcoal)' : 'var(--ivory)',
        color: dark ? 'var(--cream)' : 'var(--charcoal)',
        borderBlock: '1px solid var(--hairline)',
        padding: '14px 0',
      }}
    >
      <div className="marquee">
        <div className="marquee-track" style={{ fontSize: 12, letterSpacing: '0.24em' }}>
          {reps.map((_, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 64 }}>
              {text} <span style={{ opacity: 0.4 }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

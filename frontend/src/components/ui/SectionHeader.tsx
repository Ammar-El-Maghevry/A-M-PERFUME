interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ eyebrow, title, sub, align = 'left' }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48,
        textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      {eyebrow && <span className="caption" style={{ color: 'var(--accent)' }}>{eyebrow}</span>}
      <h2 className="display" style={{ fontSize: 56, fontWeight: 300, letterSpacing: '-0.01em' }}>{title}</h2>
      {sub && <p style={{ color: 'var(--warm-gray)', maxWidth: 540, fontSize: 16 }}>{sub}</p>}
    </div>
  );
}

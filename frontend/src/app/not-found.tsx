import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="fr">
      <body style={{ background: '#F5EFE6', color: '#1A1A1A', fontFamily: "'Inter Tight', sans-serif", margin: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 48 }}>
          <span style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#6B6560' }}>404</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 300, fontStyle: 'italic' }}>Page introuvable</h1>
          <Link href="/fr" style={{ borderBottom: '1px solid #1A1A1A', paddingBottom: 4, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Retour à l&apos;accueil →
          </Link>
        </div>
      </body>
    </html>
  );
}

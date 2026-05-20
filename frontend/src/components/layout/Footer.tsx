import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import type { Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';

interface FooterProps {
  locale: Locale;
  dict: Dict;
}

export function Footer({ locale, dict }: FooterProps) {
  return (
    <footer style={{ background: 'var(--charcoal)', color: 'var(--cream)' }}>
      <div className="wrap py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr] gap-8 md:gap-12 pb-10 md:pb-16">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo size={26} dark={false} />
            <p className="small" style={{ marginTop: 28, color: 'var(--accent-soft)', maxWidth: 280, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {dict.home.footerTagline}
            </p>
          </div>
          <div className="col gap-md">
            <span className="caption" style={{ color: 'var(--accent-soft)' }}>{dict.home.footerShop}</span>
            <Link href={`/${locale}/catalog`} style={{ fontSize: 14 }}>{dict.nav.catalog}</Link>
            <Link href={`/${locale}/catalog?category=women`} style={{ fontSize: 14 }}>Pour Femme</Link>
            <Link href={`/${locale}/catalog?category=men`} style={{ fontSize: 14 }}>Pour Homme</Link>
            <Link href={`/${locale}/catalog?category=limited`} style={{ fontSize: 14 }}>Édition Limitée</Link>
          </div>
          <div className="col gap-md">
            <span className="caption" style={{ color: 'var(--accent-soft)' }}>{dict.home.footerHelp}</span>
            <span style={{ fontSize: 14 }}>Livraison</span>
            <span style={{ fontSize: 14 }}>Paiement</span>
            <span style={{ fontSize: 14 }}>Retours</span>
            <span style={{ fontSize: 14 }}>Contact</span>
          </div>
          <div className="col gap-md">
            <span className="caption" style={{ color: 'var(--accent-soft)' }}>{dict.home.footerFollow}</span>
            <span style={{ fontSize: 14 }}>Instagram</span>
            <span style={{ fontSize: 14 }}>Facebook</span>
            <span style={{ fontSize: 14 }}>TikTok</span>
            <span style={{ fontSize: 14 }}>WhatsApp</span>
          </div>
          <div className="col gap-md col-span-2 sm:col-span-3 lg:col-span-1">
            <span className="caption" style={{ color: 'var(--accent-soft)' }}>{dict.home.newsletter}</span>
            <p className="small" style={{ color: 'var(--accent-soft)', marginTop: -4 }}>{dict.home.newsletterSub}</p>
            <div className="row" style={{ borderBottom: '1px solid var(--accent-soft)', alignItems: 'center', marginTop: 4 }}>
              <input
                placeholder={dict.home.emailPlaceholder}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '10px 0', color: 'var(--cream)' }}
              />
              <button style={{ color: 'var(--cream)', fontSize: 11, letterSpacing: '0.18em' }}>
                {dict.home.newsletterCta.toUpperCase()} →
              </button>
            </div>
            <div className="row" style={{ gap: 14, marginTop: 24, alignItems: 'center' }}>
              {['Bankily', 'Sedad', 'Masrvi'].map((p) => (
                <span
                  key={p}
                  className="mono"
                  style={{ fontSize: 10, letterSpacing: '0.18em', padding: '6px 10px', border: '1px solid var(--accent-soft)', color: 'var(--accent-soft)' }}
                >
                  {p.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
        <hr className="hr" style={{ background: 'rgba(245,239,230,0.15)' }} />
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center pt-7" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--accent-soft)' }}>
          <span>© 2026 A&M PERFUME · NOUAKCHOTT, MAURITANIE</span>
          <span className="mono">EDITION N° 01 · MMXXVI</span>
        </div>
      </div>
    </footer>
  );
}

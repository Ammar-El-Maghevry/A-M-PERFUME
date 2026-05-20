'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import type { Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';

interface NavbarProps {
  locale: Locale;
  dict: Dict;
}

export function Navbar({ locale, dict }: NavbarProps) {
  const pathname = usePathname();
  const cartItems = useCart((s) => s.items);
  const wishIds = useWishlist((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const cartCount = mounted ? cartItems.reduce((a, c) => a + c.quantity, 0) : 0;
  const wishCount = mounted ? wishIds.length : 0;

  const stripped = pathname?.replace(`/${locale}`, '') || '/';
  const isCatalog = stripped.startsWith('/catalog');

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--cream)', borderBottom: '1px solid var(--hairline)' }}>
      <TopBar locale={locale} dict={dict} />
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', paddingBlock: 14, gap: 12 }}>
        {/* Left: desktop nav OR mobile hamburger */}
        <nav className="hidden lg:flex" style={{ gap: 36, fontSize: 13, letterSpacing: '0.06em' }}>
          <Link
            href={`/${locale}/catalog`}
            style={{
              borderBottom: isCatalog ? '1px solid var(--charcoal)' : '1px solid transparent',
              paddingBottom: 2,
            }}
          >
            {dict.nav.catalog}
          </Link>
          <Link href={`/${locale}/catalog?category=women`}>Pour Femme</Link>
          <Link href={`/${locale}/catalog?category=men`}>Pour Homme</Link>
          <Link href={`/${locale}/catalog?category=limited`} style={{ color: 'var(--accent)' }}>
            Édition Limitée
          </Link>
        </nav>
        <button
          aria-label="Menu"
          className="lg:hidden"
          onClick={() => setDrawerOpen(true)}
          style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', justifySelf: 'start' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="7" x2="21" y2="7" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        </button>

        {/* Center: logo */}
        <Link href={`/${locale}`} style={{ justifySelf: 'center' }}>
          <Logo size={22} />
        </Link>

        {/* Right: icons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center', fontSize: 13 }}>
          <Link href={`/${locale}/catalog`} aria-label="Recherche" className="hidden sm:inline-flex" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <Link href={`/${locale}/account`} aria-label={dict.nav.account} className="hidden sm:inline-flex" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </Link>
          <Link
            href={`/${locale}/account?tab=wishlist`}
            aria-label={dict.nav.wishlist}
            className="hidden sm:inline-flex"
            style={{ position: 'relative', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {wishCount > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 2, fontSize: 10, background: 'var(--accent)', color: 'var(--cream)', padding: '1px 5px', minWidth: 16, textAlign: 'center' }}>
                {wishCount}
              </span>
            )}
          </Link>
          <Link href={`/${locale}/cart`} aria-label={dict.nav.cart} style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 8h14l-1.4 11.2A2 2 0 0 1 15.6 21H8.4a2 2 0 0 1-2-1.8L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 2, fontSize: 10, background: 'var(--charcoal)', color: 'var(--cream)', padding: '1px 5px', minWidth: 16, textAlign: 'center' }}>
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href={`/${locale}/admin`}
            className="hidden lg:inline-flex caption"
            style={{ borderLeft: '1px solid var(--hairline)', paddingLeft: 18, marginLeft: 8, color: 'var(--warm-gray)' }}
          >
            {dict.nav.admin}
          </Link>
        </div>
      </div>

      <MobileDrawer
        locale={locale}
        dict={dict}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        wishCount={wishCount}
        cartCount={cartCount}
      />
    </header>
  );
}

interface DrawerProps {
  locale: Locale;
  dict: Dict;
  open: boolean;
  onClose: () => void;
  wishCount: number;
  cartCount: number;
}

function MobileDrawer({ locale, dict, open, onClose, wishCount, cartCount }: DrawerProps) {
  const pathname = usePathname();
  const langs = [
    { k: 'fr', label: 'FR' },
    { k: 'ar', label: 'AR' },
    { k: 'en', label: 'EN' },
  ] as const;

  const links = [
    { href: `/${locale}/catalog`, label: dict.nav.catalog },
    { href: `/${locale}/catalog?category=women`, label: 'Pour Femme' },
    { href: `/${locale}/catalog?category=men`, label: 'Pour Homme' },
    { href: `/${locale}/catalog?category=unisex`, label: 'Unisexe' },
    { href: `/${locale}/catalog?category=oriental`, label: 'Oriental' },
    { href: `/${locale}/catalog?category=limited`, label: 'Édition Limitée', accent: true },
  ];

  return (
    <>
      {/* Dark overlay */}
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,26,26,0.55)',
          zIndex: 99,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      {/* Drawer panel */}
      <aside
        aria-hidden={!open}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(86vw, 380px)',
          background: 'var(--cream)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 360ms cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: '-12px 0 40px rgba(26,26,26,0.16)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid var(--hairline)',
            flexShrink: 0,
          }}
        >
          <Link href={`/${locale}`} onClick={onClose}>
            <Logo size={22} />
          </Link>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginInlineEnd: -10 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 24px' }}>
          <nav style={{ paddingBlock: 8 }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="display italic"
                style={{
                  display: 'block',
                  fontSize: 26,
                  fontWeight: 300,
                  padding: '16px 0',
                  borderBottom: '1px solid var(--hairline)',
                  color: l.accent ? 'var(--accent)' : 'var(--charcoal)',
                  minHeight: 56,
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: 28 }}>
            <span className="caption" style={{ color: 'var(--accent)' }}>COMPTE</span>
            <div style={{ marginTop: 8 }}>
              <Link
                href={`/${locale}/account`}
                onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--hairline)', minHeight: 48 }}
              >
                <span className="caption">{dict.nav.account.toUpperCase()}</span>
              </Link>
              <Link
                href={`/${locale}/account?tab=wishlist`}
                onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--hairline)', minHeight: 48 }}
              >
                <span className="caption">{dict.nav.wishlist.toUpperCase()}</span>
                {wishCount > 0 && <span className="mono" style={{ color: 'var(--accent)' }}>{wishCount}</span>}
              </Link>
              <Link
                href={`/${locale}/cart`}
                onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--hairline)', minHeight: 48 }}
              >
                <span className="caption">{dict.nav.cart.toUpperCase()}</span>
                {cartCount > 0 && <span className="mono">{cartCount}</span>}
              </Link>
              <Link
                href={`/${locale}/admin`}
                onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--hairline)', minHeight: 48 }}
              >
                <span className="caption" style={{ color: 'var(--warm-gray)' }}>{dict.nav.admin.toUpperCase()}</span>
              </Link>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <p className="small" style={{ color: 'var(--warm-gray)', lineHeight: 1.55 }}>
              +222 38 12 04 04
              <br />
              Nouakchott — Mauritanie
            </p>
          </div>
        </div>

        {/* Language switcher pills at bottom */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--hairline)', flexShrink: 0 }}>
          <span className="caption" style={{ color: 'var(--accent)' }}>LANGUE</span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              marginTop: 12,
            }}
          >
            {langs.map((l) => {
              const next = (pathname || `/${locale}`).replace(`/${locale}`, `/${l.k}`);
              const active = locale === l.k;
              return (
                <Link
                  key={l.k}
                  href={next}
                  onClick={onClose}
                  style={{
                    padding: '12px 0',
                    fontSize: 13,
                    letterSpacing: '0.18em',
                    textAlign: 'center',
                    background: active ? 'var(--charcoal)' : 'transparent',
                    color: active ? 'var(--cream)' : 'var(--charcoal)',
                    border: '1px solid var(--charcoal)',
                    minHeight: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({ locale, dict }: { locale: Locale; dict: Dict }) {
  const pathname = usePathname();
  const langs = [
    { k: 'fr', label: 'FR' },
    { k: 'ar', label: 'AR' },
    { k: 'en', label: 'EN' },
  ] as const;

  return (
    <div className="hidden sm:block" style={{ background: 'var(--charcoal)', color: 'var(--cream)' }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBlock: 10, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        <span style={{ opacity: 0.7 }}>{dict.home.eyebrow}</span>
        <div className="row" style={{ gap: 18, alignItems: 'center' }}>
          <span style={{ opacity: 0.7 }} className="hidden md:inline">+222 38 12 04 04</span>
          <div className="row" style={{ gap: 6 }}>
            {langs.map((l) => {
              const next = (pathname || `/${locale}`).replace(`/${locale}`, `/${l.k}`);
              const active = locale === l.k;
              return (
                <Link
                  key={l.k}
                  href={next}
                  style={{
                    padding: '4px 6px',
                    opacity: active ? 1 : 0.45,
                    borderBottom: active ? '1px solid var(--cream)' : '1px solid transparent',
                    fontSize: 11,
                    letterSpacing: '0.16em',
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

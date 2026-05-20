'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DEMO_ORDERS, findProduct } from '@/lib/data';
import { formatPrice, type Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';
import { ProductImage } from '@/components/ui/ProductImage';
import { ProductCard } from '@/components/ui/ProductCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Field } from '../checkout/CheckoutFlow';
import { useWishlist } from '@/store/wishlistStore';

interface AccountViewProps {
  locale: Locale;
  dict: Dict;
  initialTab: string;
}

const TAB_KEYS = ['profile', 'orders', 'wishlist', 'addresses', 'notifications'] as const;
type Tab = (typeof TAB_KEYS)[number];

export function AccountView({ locale, dict, initialTab }: AccountViewProps) {
  const initial = (TAB_KEYS as readonly string[]).includes(initialTab) ? (initialTab as Tab) : 'orders';
  const [tab, setTab] = useState<Tab>(initial);

  const tabs: { k: Tab; label: string }[] = [
    { k: 'profile', label: dict.account.profile },
    { k: 'orders', label: dict.account.orders },
    { k: 'wishlist', label: dict.nav.wishlist },
    { k: 'addresses', label: dict.account.addresses },
    { k: 'notifications', label: dict.account.notifications },
  ];

  return (
    <>
      <section style={{ background: 'var(--ivory)', borderBottom: '1px solid var(--hairline)' }}>
        <div className="wrap pt-10 pb-8 md:pt-14 md:pb-10">
          <span className="caption" style={{ color: 'var(--accent)' }}>BIENVENUE, FATIMA</span>
          <h1 className="display italic" style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 300, marginTop: 8 }}>
            {dict.account.title}
          </h1>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-16 items-start">
          {/* Mobile: horizontal scrolling tabs */}
          <aside className="lg:hidden flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5">
            {tabs.map((tb) => (
              <button
                key={tb.k}
                onClick={() => setTab(tb.k)}
                className="caption whitespace-nowrap"
                style={{
                  padding: '10px 16px',
                  border: '1px solid',
                  borderColor: tab === tb.k ? 'var(--charcoal)' : 'var(--hairline)',
                  background: tab === tb.k ? 'var(--charcoal)' : 'transparent',
                  color: tab === tb.k ? 'var(--cream)' : 'var(--warm-gray)',
                  fontSize: 11,
                }}
              >
                {tb.label}
              </button>
            ))}
          </aside>
          {/* Desktop: vertical sidebar */}
          <aside className="hidden lg:flex flex-col gap-1">
            {tabs.map((tb) => (
              <button
                key={tb.k}
                onClick={() => setTab(tb.k)}
                style={{
                  textAlign: 'left', padding: '14px 0',
                  borderBottom: tab === tb.k ? '1px solid var(--charcoal)' : '1px solid var(--hairline)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  color: tab === tb.k ? 'var(--charcoal)' : 'var(--warm-gray)',
                }}
              >
                <span style={{ fontSize: 15 }}>{tb.label}</span>
                {tab === tb.k && <span>→</span>}
              </button>
            ))}
            <Link
              href={`/${locale}`}
              style={{ textAlign: 'left', padding: '14px 0', color: 'var(--warm-gray)', marginTop: 24 }}
            >
              ← {dict.account.logout}
            </Link>
          </aside>
          <div>
            {tab === 'orders' && <OrdersTab dict={dict} locale={locale} />}
            {tab === 'profile' && <ProfileTab dict={dict} />}
            {tab === 'wishlist' && <WishlistTab dict={dict} locale={locale} />}
            {tab === 'addresses' && <AddressesTab />}
            {tab === 'notifications' && <NotificationsTab />}
          </div>
        </div>
      </section>
    </>
  );
}

function OrdersTab({ dict, locale }: { dict: Dict; locale: Locale }) {
  return (
    <div>
      {/* Desktop header */}
      <div
        className="caption hidden md:grid"
        style={{
          gridTemplateColumns: '1.2fr 1fr 1.4fr 1fr 1fr 60px',
          gap: 16, padding: '12px 0', borderBottom: '1px solid var(--charcoal)',
        }}
      >
        <span>N°</span>
        <span>DATE</span>
        <span>ARTICLES</span>
        <span>TOTAL</span>
        <span>STATUT</span>
        <span></span>
      </div>
      {DEMO_ORDERS.map((o) => {
        const items = o.items.map((i) => ({ ...i, product: findProduct(i.productId)! }));
        const total = items.reduce((a, c) => a + c.product.price * c.quantity, 0);
        const totalQty = items.reduce((a, c) => a + c.quantity, 0);
        return (
          <div key={o.id}>
            {/* Mobile card */}
            <div
              className="md:hidden p-4 mb-3 flex flex-col gap-3"
              style={{ background: 'var(--ivory)', border: '1px solid var(--hairline)' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="mono" style={{ fontSize: 13 }}>{o.orderNumber}</span>
                  <p className="caption" style={{ marginTop: 4 }}>
                    {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <StatusBadge status={o.status} dict={dict} />
              </div>
              <div className="row" style={{ alignItems: 'center', gap: 10 }}>
                <div className="row">
                  {items.slice(0, 3).map((it, i) => (
                    <div
                      key={it.productId}
                      style={{ width: 32, marginInlineStart: i ? -10 : 0, border: '1px solid var(--cream)' }}
                    >
                      <ProductImage product={it.product} ratio="1/1" size="sm" />
                    </div>
                  ))}
                </div>
                <span className="small">{totalQty} article{totalQty > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
                <span className="mono" style={{ fontSize: 15 }}>{formatPrice(total, locale)} MRU</span>
                <button className="caption" style={{ color: 'var(--accent)' }}>
                  {dict.account.viewOrder} →
                </button>
              </div>
            </div>
            {/* Desktop row */}
            <div
              className="hidden md:grid"
              style={{
                gridTemplateColumns: '1.2fr 1fr 1.4fr 1fr 1fr 60px',
                gap: 16, padding: '20px 0', borderBottom: '1px solid var(--hairline)',
                alignItems: 'center', fontSize: 14,
              }}
            >
              <span className="mono">{o.orderNumber}</span>
              <span>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</span>
              <div className="row" style={{ alignItems: 'center', gap: 10 }}>
                <div className="row">
                  {items.slice(0, 3).map((it, i) => (
                    <div
                      key={it.productId}
                      style={{ width: 36, marginInlineStart: i ? -12 : 0, border: '1px solid var(--cream)' }}
                    >
                      <ProductImage product={it.product} ratio="1/1" size="sm" />
                    </div>
                  ))}
                </div>
                <span className="small">{totalQty} article{totalQty > 1 ? 's' : ''}</span>
              </div>
              <span className="mono">{formatPrice(total, locale)} MRU</span>
              <StatusBadge status={o.status} dict={dict} />
              <button className="btn-ghost" style={{ justifySelf: 'end' }}>
                {dict.account.viewOrder}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileTab({ dict }: { dict: Dict }) {
  return (
    <div className="p-6 md:p-10 lg:p-12" style={{ background: 'var(--ivory)' }}>
      <h3 className="display italic" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400 }}>{dict.account.profile}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mt-8">
        <Field label="Nom complet" value="Fatima Diallo" onChange={() => {}} />
        <Field label="E-mail" value="fatima.diallo@example.mr" onChange={() => {}} />
        <Field label="Téléphone" value="+222 22 33 44 55" onChange={() => {}} />
        <Field label="Date d'inscription" value="12 février 2026" onChange={() => {}} />
      </div>
      <hr className="hr" style={{ marginBlock: 40 }} />
      <h4 className="display italic" style={{ fontSize: 22, fontWeight: 400, marginBottom: 24 }}>
        Modifier le mot de passe
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
        <Field label="Mot de passe actuel" value="" onChange={() => {}} type="password" />
        <Field label="Nouveau mot de passe" value="" onChange={() => {}} type="password" />
      </div>
      <button className="btn btn-primary mt-10">Enregistrer les modifications</button>
    </div>
  );
}

function WishlistTab({ dict, locale }: { dict: Dict; locale: Locale }) {
  const ids = useWishlist((s) => s.ids);
  const items = ids.map((id) => findProduct(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (items.length === 0) {
    return (
      <div className="col" style={{ alignItems: 'flex-start', gap: 20, padding: '64px 0' }}>
        <p className="display italic" style={{ fontSize: 28, color: 'var(--warm-gray)' }}>
          Aucun favori pour le moment.
        </p>
        <Link href={`/${locale}/catalog`} className="btn btn-secondary">
          Découvrir la collection
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-8">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
      ))}
    </div>
  );
}

function AddressesTab() {
  const addresses = [
    {
      id: 1, label: 'Domicile', name: 'Fatima Diallo', phone: '+222 22 33 44 55',
      city: 'Nouakchott', district: 'Tevragh-Zeina',
      detail: 'Près de la mosquée centrale, villa beige, 2e étage',
      isDefault: true, lat: 18.079, lng: -15.965,
    },
    {
      id: 2, label: 'Bureau', name: 'Fatima Diallo', phone: '+222 22 33 44 55',
      city: 'Nouakchott', district: 'Capitale',
      detail: 'BMCI, 4e étage', isDefault: false, lat: 18.085, lng: -15.958,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {addresses.map((a) => (
        <div
          key={a.id}
          style={{
            background: 'var(--ivory)', padding: 28,
            border: a.isDefault ? '1px solid var(--charcoal)' : '1px solid var(--hairline)',
          }}
        >
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="caption">{a.label.toUpperCase()}</span>
            {a.isDefault && <span className="badge dark">PAR DÉFAUT</span>}
          </div>
          <div className="col" style={{ gap: 4, marginTop: 14 }}>
            <strong>{a.name}</strong>
            <span className="small">{a.district} · {a.city}</span>
            <span className="small" style={{ color: 'var(--warm-gray)' }}>{a.detail}</span>
            <span className="small mono">{a.lat}, {a.lng}</span>
            <span className="small">{a.phone}</span>
          </div>
          <div className="row" style={{ gap: 16, marginTop: 20 }}>
            <button className="btn-ghost">Modifier</button>
            <button className="btn-ghost" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
              Supprimer
            </button>
          </div>
        </div>
      ))}
      <button
        style={{
          border: '1px dashed var(--hairline)', padding: 40,
          color: 'var(--warm-gray)', fontSize: 14, letterSpacing: '0.12em',
        }}
      >
        + AJOUTER UNE ADRESSE
      </button>
    </div>
  );
}

function NotificationsTab() {
  const notifs = [
    { type: 'order' as const, title: 'Commande AM-2026-0041 confirmée', desc: 'Notre équipe a vérifié votre paiement Sedad. Votre commande est en préparation.', date: 'Il y a 2 heures', unread: true },
    { type: 'shipping' as const, title: 'Commande AM-2026-0040 expédiée', desc: "Votre commande a quitté l'atelier. Livraison prévue sous 48h.", date: 'Hier · 18:30', unread: true },
    { type: 'promo' as const, title: 'Édition limitée : Or et Encens', desc: '200 exemplaires numérotés. Les précommandes ouvrent vendredi 23 mai.', date: '17 mai 2026', unread: false },
    { type: 'order' as const, title: 'Commande AM-2026-0039 livrée', desc: "Merci pour votre confiance. N'hésitez pas à nous laisser votre avis.", date: '14 mai 2026', unread: false },
  ];
  const icon = { order: '📦', shipping: '✈', promo: '✦' };
  return (
    <div className="col">
      {notifs.map((n, i) => (
        <div
          key={i}
          style={{
            display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 20,
            padding: '24px 0', borderBottom: '1px solid var(--hairline)',
            alignItems: 'flex-start', opacity: n.unread ? 1 : 0.65,
          }}
        >
          <div
            style={{
              width: 40, height: 40,
              background: n.unread ? 'var(--charcoal)' : 'var(--ivory)',
              color: n.unread ? 'var(--cream)' : 'var(--charcoal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}
          >
            {icon[n.type]}
          </div>
          <div className="col" style={{ gap: 6 }}>
            <div className="row" style={{ alignItems: 'center', gap: 12 }}>
              <strong>{n.title}</strong>
              {n.unread && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
            </div>
            <p className="small" style={{ color: 'var(--graphite)' }}>{n.desc}</p>
          </div>
          <span className="caption" style={{ color: 'var(--warm-gray)' }}>{n.date}</span>
        </div>
      ))}
    </div>
  );
}

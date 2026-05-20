'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  CATEGORIES, DEMO_ORDERS, HUE_BG, HUE_BOTTLE, PAYMENT_METHODS, PRODUCTS,
  findProduct, type DemoOrder, type OrderStatus,
} from '@/lib/data';
import { formatPrice, type Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';
import { Logo } from '@/components/ui/Logo';
import { ProductImage } from '@/components/ui/ProductImage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Field } from '../checkout/CheckoutFlow';

interface AdminAppProps {
  locale: Locale;
  dict: Dict;
}

type Section = 'dashboard' | 'products' | 'orders' | 'customers' | 'categories' | 'settings';

export function AdminApp({ locale, dict }: AdminAppProps) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [section, setSection] = useState<Section>('dashboard');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<DemoOrder[]>(DEMO_ORDERS);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('adminAuthenticated') !== 'true') {
      router.replace(`/${locale}/admin/login`);
      return;
    }
    setAuthChecked(true);
  }, [router, locale]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('adminAuthenticated');
    }
    router.replace(`/${locale}/admin/login`);
  };

  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--cream)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="caption" style={{ color: 'var(--warm-gray)' }}>VÉRIFICATION…</span>
      </div>
    );
  }

  const updateOrder = (id: number, patch: Partial<DemoOrder>) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o, ...patch,
              history: patch.status
                ? [...o.history, { status: patch.status, at: new Date().toISOString() }]
                : o.history,
            }
          : o,
      ),
    );
  };

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen pb-20 lg:pb-0" style={{ background: 'var(--ivory)' }}>
      <AdminSidebar
        dict={dict} locale={locale}
        section={section}
        setSection={(s) => {
          setSection(s);
          setOrderId(null);
        }}
        orderCount={pendingCount}
        onLogout={logout}
      />
      <main className="lg:border-l" style={{ background: 'var(--cream)', borderColor: 'var(--hairline)' }}>
        <AdminTopBar dict={dict} section={section} orderId={orderId} onLogout={logout} />
        <div className="p-4 md:p-10 lg:p-14">
          {section === 'dashboard' && (
            <AdminDashboard
              dict={dict} locale={locale} orders={orders}
              onOpenOrder={(id) => {
                setSection('orders');
                setOrderId(id);
              }}
            />
          )}
          {section === 'orders' && !orderId && (
            <AdminOrders dict={dict} locale={locale} orders={orders} onOpen={setOrderId} />
          )}
          {section === 'orders' && orderId && (
            <AdminOrderDetail
              dict={dict} locale={locale}
              order={orders.find((o) => o.id === orderId)!}
              onBack={() => setOrderId(null)}
              onUpdate={(patch) => updateOrder(orderId, patch)}
            />
          )}
          {section === 'products' && <AdminProducts locale={locale} />}
          {section === 'customers' && <AdminCustomers dict={dict} />}
          {section === 'categories' && <AdminCategories dict={dict} />}
          {section === 'settings' && <AdminSettings dict={dict} />}
        </div>
      </main>
    </div>
  );
}

function AdminSidebar({
  dict, locale, section, setSection, orderCount, onLogout,
}: {
  dict: Dict; locale: Locale; section: Section;
  setSection: (s: Section) => void; orderCount: number;
  onLogout: () => void;
}) {
  const items: { k: Section; label: string; icon: IconName; badge?: number }[] = [
    { k: 'dashboard', label: dict.admin.dashboard, icon: 'grid' },
    { k: 'products', label: dict.admin.products, icon: 'box' },
    { k: 'orders', label: dict.admin.orders, icon: 'bag', badge: orderCount },
    { k: 'customers', label: dict.admin.customers, icon: 'users' },
    { k: 'categories', label: dict.admin.categories, icon: 'tag' },
    { k: 'settings', label: dict.admin.settings, icon: 'gear' },
  ];
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col sticky top-0 h-screen"
        style={{ background: 'var(--charcoal)', color: 'var(--cream)', padding: '32px 0' }}
      >
        <div style={{ padding: '0 28px 32px', borderBottom: '1px solid rgba(245,239,230,0.15)' }}>
          <Logo size={22} dark={false} />
          <span className="caption" style={{ color: 'var(--accent-soft)', marginTop: 10, display: 'block' }}>
            BACKOFFICE
          </span>
        </div>
        <nav className="col" style={{ padding: '24px 0', gap: 0, flex: 1 }}>
          {items.map((it) => {
            const on = section === it.k;
            return (
              <button
                key={it.k}
                onClick={() => setSection(it.k)}
                style={{
                  display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 14,
                  alignItems: 'center', padding: '14px 28px',
                  color: on ? 'var(--cream)' : 'var(--accent-soft)',
                  background: on ? 'rgba(245,239,230,0.06)' : 'transparent',
                  borderInlineStart: `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
                  textAlign: 'left',
                }}
              >
                <AdminIcon name={it.icon} />
                <span style={{ fontSize: 14 }}>{it.label}</span>
                {it.badge && it.badge > 0 ? (
                  <span
                    className="mono"
                    style={{ fontSize: 10, background: 'var(--accent)', color: 'var(--cream)', padding: '2px 6px' }}
                  >
                    {it.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: '24px 28px', borderTop: '1px solid rgba(245,239,230,0.15)' }}>
          <div className="row" style={{ alignItems: 'center', gap: 12 }}>
            <div
              className="display italic"
              style={{
                width: 36, height: 36, background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              A
            </div>
            <div className="col" style={{ gap: 2 }}>
              <span style={{ fontSize: 13 }}>Ammar E.</span>
              <span className="caption" style={{ color: 'var(--accent-soft)' }}>FONDATEUR</span>
            </div>
          </div>
          <Link href={`/${locale}`} className="caption" style={{ marginTop: 20, color: 'var(--accent-soft)', display: 'block' }}>
            {dict.admin.goShop}
          </Link>
          <button
            onClick={onLogout}
            className="caption"
            style={{
              marginTop: 14,
              color: 'var(--cream)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 0',
              minHeight: 40,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 17l5-5-5-5" />
              <path d="M20 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
            DÉCONNEXION
          </button>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40"
        style={{
          background: 'var(--charcoal)',
          color: 'var(--cream)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          borderTop: '1px solid rgba(245,239,230,0.15)',
        }}
      >
        <div className="grid grid-cols-6">
          {items.map((it) => {
            const on = section === it.k;
            return (
              <button
                key={it.k}
                onClick={() => setSection(it.k)}
                className="flex flex-col items-center justify-center gap-1 py-2 relative"
                style={{
                  color: on ? 'var(--cream)' : 'var(--accent-soft)',
                  borderTop: `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
                }}
              >
                <AdminIcon name={it.icon} />
                <span style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {it.label.length > 8 ? it.label.slice(0, 7) + '…' : it.label}
                </span>
                {it.badge && it.badge > 0 ? (
                  <span
                    className="mono absolute top-1 right-1"
                    style={{ fontSize: 9, background: 'var(--accent)', color: 'var(--cream)', padding: '1px 4px', minWidth: 14, textAlign: 'center' }}
                  >
                    {it.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

type IconName = 'grid' | 'box' | 'bag' | 'users' | 'tag' | 'gear';

function AdminIcon({ name }: { name: IconName }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 };
  if (name === 'grid')
    return (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    );
  if (name === 'box')
    return (
      <svg {...props}>
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 7v10l9 4 9-4V7" />
      </svg>
    );
  if (name === 'bag')
    return (
      <svg {...props}>
        <path d="M5 8h14l-1.4 11.2A2 2 0 0 1 15.6 21H8.4a2 2 0 0 1-2-1.8L5 8z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    );
  if (name === 'users')
    return (
      <svg {...props}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M14 16.5c.9-.3 1.9-.5 3-.5 2.2 0 4 1.5 4 4" />
      </svg>
    );
  if (name === 'tag')
    return (
      <svg {...props}>
        <path d="M3 12V3h9l9 9-9 9-9-9z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </svg>
    );
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function AdminTopBar({ dict, section, orderId, onLogout }: { dict: Dict; section: Section; orderId: number | null; onLogout: () => void }) {
  const crumbs =
    section === 'dashboard'
      ? [dict.admin.dashboard]
      : section === 'orders' && orderId
        ? [dict.admin.orders, '#' + orderId]
        : [dict.admin[section]];
  return (
    <header
      className="flex justify-between items-center px-4 md:px-10 lg:px-14 py-4 md:py-6"
      style={{ borderBottom: '1px solid var(--hairline)', background: 'var(--cream)' }}
    >
      <div
        className="flex items-center gap-3"
        style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            {i > 0 && <span style={{ color: 'var(--warm-gray)' }}>/</span>}
            <span style={{ color: i === crumbs.length - 1 ? 'var(--charcoal)' : 'var(--warm-gray)' }}>{c}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div
          className="hidden lg:flex items-center"
          style={{
            gap: 10, padding: '8px 14px',
            background: 'var(--ivory)', border: '1px solid var(--hairline)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            placeholder="Rechercher une commande, un produit…"
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, width: 280 }}
          />
        </div>
        <button style={{ position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <span style={{ position: 'absolute', top: -2, right: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
        </button>
        <span className="mono hidden md:inline" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--warm-gray)' }}>
          {new Date()
            .toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
            .toUpperCase()}
        </span>
        <button
          onClick={onLogout}
          aria-label="Déconnexion"
          className="lg:hidden"
          style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warm-gray)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 17l5-5-5-5" />
            <path d="M20 12H9" />
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function AdminDashboard({
  dict, locale, orders, onOpenOrder,
}: {
  dict: Dict; locale: Locale; orders: DemoOrder[]; onOpenOrder: (id: number) => void;
}) {
  const totalRev = orders
    .filter((o) => o.status !== 'REJECTED')
    .reduce(
      (a, o) =>
        a + o.items.reduce((s, i) => s + (findProduct(i.productId)?.price ?? 0) * i.quantity, 0),
      0,
    );
  const pending = orders.filter((o) => o.status === 'PENDING').length;
  const lowStock = PRODUCTS.filter((p) => p.stock < 13).length;

  return (
    <div className="col" style={{ gap: 32 }}>
      <div>
        <span className="caption" style={{ color: 'var(--accent)' }}>
          {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
        <h1 className="display italic" style={{ fontSize: 48, fontWeight: 300, marginTop: 6 }}>
          Bonjour, Ammar.
        </h1>
        <p style={{ color: 'var(--warm-gray)', marginTop: 8, fontSize: 15 }}>
          {pending} commande{pending > 1 ? 's' : ''} en attente de vérification.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label={dict.admin.totalSales} value={formatPrice(totalRev, locale) + ' MRU'} sub={dict.admin.totalSalesSub} trend="+12,4%" icon="$" />
        <StatCard label={dict.admin.newOrders} value={String(pending)} sub={dict.admin.newOrdersSub} trend={pending + ' à traiter'} icon="◐" highlight />
        <StatCard label={dict.admin.customersStat} value="87" sub={dict.admin.customersStatSub} trend="+5" icon="◯" />
        <StatCard label={dict.admin.lowStock} value={String(lowStock)} sub={dict.admin.lowStockSub} trend="vérifier" icon="!" warn />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ background: 'var(--ivory)', padding: 32 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 className="display italic" style={{ fontSize: 26, fontWeight: 400 }}>{dict.admin.recentOrders}</h3>
            <button className="btn-ghost">Voir toutes →</button>
          </div>
          <div style={{ marginTop: 20 }}>
            <div className="caption row" style={{ padding: '12px 0', borderBottom: '1px solid var(--charcoal)' }}>
              <span style={{ flex: 1.4 }}>N°</span>
              <span style={{ flex: 1.4 }}>CLIENT</span>
              <span style={{ flex: 1 }}>MÉTHODE</span>
              <span style={{ flex: 1 }}>TOTAL</span>
              <span style={{ flex: 1.2 }}>STATUT</span>
            </div>
            {orders.slice(0, 5).map((o) => {
              const total = o.items.reduce((a, i) => a + (findProduct(i.productId)?.price ?? 0) * i.quantity, 0);
              return (
                <button
                  key={o.id}
                  onClick={() => onOpenOrder(o.id)}
                  className="row"
                  style={{
                    width: '100%', padding: '16px 0', borderBottom: '1px solid var(--hairline)',
                    fontSize: 14, textAlign: 'left',
                  }}
                >
                  <span className="mono" style={{ flex: 1.4 }}>{o.orderNumber}</span>
                  <span style={{ flex: 1.4 }}>{o.customerName}</span>
                  <span style={{ flex: 1, color: 'var(--warm-gray)' }}>{o.paymentMethod}</span>
                  <span className="mono" style={{ flex: 1 }}>{formatPrice(total, locale)}</span>
                  <span style={{ flex: 1.2 }}>
                    <StatusBadge status={o.status} dict={dict} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="col gap-md">
          <div style={{ background: 'var(--ivory)', padding: 28 }}>
            <h4 className="display italic" style={{ fontSize: 22, fontWeight: 400 }}>Stock faible</h4>
            <div className="col" style={{ gap: 14, marginTop: 16 }}>
              {PRODUCTS.filter((p) => p.stock < 16)
                .slice(0, 4)
                .map((p) => (
                  <div key={p.id} className="row" style={{ gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 44 }}>
                      <ProductImage product={p} ratio="1/1" size="sm" />
                    </div>
                    <div className="col" style={{ flex: 1, gap: 2 }}>
                      <span style={{ fontSize: 13 }}>{p.nameFr}</span>
                      <span className="caption">{p.sku}</span>
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: 13,
                        color: p.stock < 8 ? 'var(--error)' : 'var(--warning)',
                      }}
                    >
                      {p.stock}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div style={{ background: 'var(--charcoal)', color: 'var(--cream)', padding: 28 }}>
            <span className="caption" style={{ color: 'var(--accent-soft)' }}>ACTION RAPIDE</span>
            <h4 className="display italic" style={{ fontSize: 26, fontWeight: 400, marginTop: 12 }}>
              Ajouter un parfum
            </h4>
            <p style={{ marginTop: 8, color: 'var(--accent-soft)', fontSize: 13 }}>
              Composition, notes, prix, stock — en 3 minutes.
            </p>
            <button className="btn" style={{ background: 'var(--cream)', color: 'var(--charcoal)', marginTop: 20 }}>
              Nouveau produit →
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--ivory)', padding: 32 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <h3 className="display italic" style={{ fontSize: 26, fontWeight: 400 }}>Ventes sur 30 jours</h3>
            <span className="caption" style={{ color: 'var(--accent)', marginTop: 6, display: 'block' }}>
              +12,4% vs mois précédent
            </span>
          </div>
          <div className="row" style={{ gap: 16 }}>
            {['7J', '30J', '12M'].map((p, i) => (
              <button
                key={p}
                className="caption"
                style={{
                  padding: '6px 14px', border: '1px solid var(--hairline)',
                  background: i === 1 ? 'var(--charcoal)' : 'transparent',
                  color: i === 1 ? 'var(--cream)' : 'var(--charcoal)',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <Sparkline />
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string; value: string; sub: string; trend: string;
  icon: string; warn?: boolean; highlight?: boolean;
}

function StatCard({ label, value, sub, trend, icon, warn, highlight }: StatCardProps) {
  const accent = warn ? 'var(--error)' : highlight ? 'var(--accent)' : 'var(--warm-gray)';
  return (
    <div
      style={{
        background: highlight ? 'var(--charcoal)' : 'var(--ivory)',
        color: highlight ? 'var(--cream)' : 'var(--charcoal)',
        padding: 24, display: 'flex', flexDirection: 'column', gap: 14,
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="caption" style={{ color: highlight ? 'var(--accent-soft)' : 'var(--warm-gray)' }}>
          {label}
        </span>
        <span
          style={{
            width: 28, height: 28, border: '1px solid currentColor',
            opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}
        >
          {icon}
        </span>
      </div>
      <div className="display italic" style={{ fontSize: 38, fontWeight: 400, lineHeight: 1 }}>{value}</div>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="small" style={{ color: highlight ? 'var(--accent-soft)' : 'var(--warm-gray)' }}>{sub}</span>
        <span className="mono" style={{ fontSize: 11, color: highlight ? 'var(--accent-soft)' : accent }}>{trend}</span>
      </div>
    </div>
  );
}

function Sparkline() {
  const data = [12, 14, 11, 18, 22, 16, 20, 24, 19, 23, 28, 25, 30, 27, 33, 36, 30, 38, 42, 36, 40, 45, 41, 48, 52, 47, 55, 58, 52, 60];
  const max = Math.max(...data);
  const w = 1080, h = 180;
  const path = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <div style={{ marginTop: 32, position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h + 30}`} width="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
        {[0.25, 0.5, 0.75].map((y) => (
          <line key={y} x1="0" x2={w} y1={h * y} y2={h * y} stroke="var(--hairline)" strokeWidth="0.5" />
        ))}
        <polygon points={`0,${h} ${path} ${w},${h}`} fill="var(--accent)" opacity="0.12" />
        <polyline points={path} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        {data.map((v, i) =>
          i % 5 === 0 ? (
            <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (v / max) * h} r="3" fill="var(--charcoal)" />
          ) : null,
        )}
        {['1 MAI', '8 MAI', '15 MAI', '22 MAI', '30 MAI'].map((l, i) => (
          <text
            key={l}
            x={(i / 4) * w}
            y={h + 20}
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="var(--warm-gray)"
            textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}
            letterSpacing="1"
          >
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}

function AdminOrders({
  dict, locale, orders, onOpen,
}: {
  dict: Dict; locale: Locale; orders: DemoOrder[]; onOpen: (id: number) => void;
}) {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const tabs: { k: OrderStatus | 'all'; label: string; n: number }[] = [
    { k: 'all', label: dict.admin.filterAll, n: orders.length },
    { k: 'PENDING', label: dict.admin.filterPending, n: orders.filter((o) => o.status === 'PENDING').length },
    { k: 'CONFIRMED', label: dict.admin.filterConfirmed, n: orders.filter((o) => o.status === 'CONFIRMED').length },
    { k: 'PREPARING', label: dict.admin.filterPreparing, n: orders.filter((o) => o.status === 'PREPARING').length },
    { k: 'SHIPPED', label: dict.admin.filterShipped, n: orders.filter((o) => o.status === 'SHIPPED').length },
    { k: 'DELIVERED', label: dict.admin.filterDelivered, n: orders.filter((o) => o.status === 'DELIVERED').length },
    { k: 'REJECTED', label: dict.admin.filterRejected, n: orders.filter((o) => o.status === 'REJECTED').length },
  ];

  return (
    <div className="col" style={{ gap: 28 }}>
      <h1 className="display italic" style={{ fontSize: 40, fontWeight: 300 }}>{dict.admin.orders}</h1>
      <div className="row" style={{ gap: 0, borderBottom: '1px solid var(--hairline)' }}>
        {tabs.map((tb) => (
          <button
            key={tb.k}
            onClick={() => setFilter(tb.k)}
            style={{
              padding: '14px 18px',
              borderBottom: filter === tb.k ? '2px solid var(--charcoal)' : '2px solid transparent',
              color: filter === tb.k ? 'var(--charcoal)' : 'var(--warm-gray)',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
            }}
          >
            {tb.label} <span className="mono" style={{ fontSize: 10, opacity: 0.6 }}>({tb.n})</span>
          </button>
        ))}
      </div>
      <div style={{ background: 'var(--ivory)' }}>
        <div className="caption row" style={{ padding: '16px 24px', borderBottom: '1px solid var(--charcoal)' }}>
          <span style={{ flex: 1.2 }}>N°</span>
          <span style={{ flex: 0.8 }}>DATE</span>
          <span style={{ flex: 1.4 }}>CLIENT</span>
          <span style={{ flex: 1.5 }}>ARTICLES</span>
          <span style={{ flex: 1 }}>MÉTHODE</span>
          <span style={{ flex: 1 }}>TOTAL</span>
          <span style={{ flex: 1.2 }}>STATUT</span>
          <span style={{ flex: 0.6 }}></span>
        </div>
        {filtered.map((o) => {
          const items = o.items.map((i) => ({ ...i, product: findProduct(i.productId)! }));
          const total = items.reduce((a, c) => a + c.product.price * c.quantity, 0);
          const totalQty = items.reduce((a, c) => a + c.quantity, 0);
          return (
            <button
              key={o.id}
              onClick={() => onOpen(o.id)}
              className="row"
              style={{
                width: '100%', padding: '20px 24px', borderBottom: '1px solid var(--hairline)',
                textAlign: 'left', alignItems: 'center', fontSize: 14,
              }}
            >
              <span className="mono" style={{ flex: 1.2, fontSize: 13 }}>{o.orderNumber}</span>
              <span style={{ flex: 0.8, color: 'var(--warm-gray)' }}>
                {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
              </span>
              <div className="col" style={{ flex: 1.4 }}>
                <span>{o.customerName}</span>
                <span className="caption" style={{ color: 'var(--warm-gray)' }}>{o.neighborhood}</span>
              </div>
              <div className="row" style={{ flex: 1.5, alignItems: 'center' }}>
                {items.slice(0, 3).map((it, i) => (
                  <div key={it.productId} style={{ width: 32, marginInlineStart: i ? -10 : 0, border: '1px solid var(--ivory)' }}>
                    <ProductImage product={it.product} ratio="1/1" size="sm" />
                  </div>
                ))}
                <span className="caption" style={{ marginInlineStart: 12 }}>{totalQty} ART.</span>
              </div>
              <span style={{ flex: 1, color: 'var(--warm-gray)' }}>{o.paymentMethod}</span>
              <span className="mono" style={{ flex: 1 }}>{formatPrice(total, locale)}</span>
              <span style={{ flex: 1.2 }}>
                <StatusBadge status={o.status} dict={dict} />
              </span>
              <span style={{ flex: 0.6, textAlign: 'end', color: 'var(--accent)' }}>→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface AdminOrderDetailProps {
  dict: Dict;
  locale: Locale;
  order: DemoOrder;
  onBack: () => void;
  onUpdate: (patch: Partial<DemoOrder>) => void;
}

function AdminOrderDetail({ dict, locale, order, onBack, onUpdate }: AdminOrderDetailProps) {
  const [zoomed, setZoomed] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const items = order.items.map((i) => ({ ...i, product: findProduct(i.productId)! }));
  const total = items.reduce((a, c) => a + c.product.price * c.quantity, 0);
  const payment = PAYMENT_METHODS.find((p) => p.key === order.paymentMethod)!;

  const reject = () => {
    if (!reason.trim()) return;
    onUpdate({ status: 'REJECTED', rejectionReason: reason });
    setRejecting(false);
    setReason('');
  };

  return (
    <div className="col" style={{ gap: 28 }}>
      <button onClick={onBack} className="btn-ghost" style={{ alignSelf: 'flex-start' }}>
        ← Toutes les commandes
      </button>

      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span className="caption" style={{ color: 'var(--accent)' }}>COMMANDE</span>
          <h1 className="mono" style={{ fontSize: 32, marginTop: 6 }}>{order.orderNumber}</h1>
          <p className="small" style={{ marginTop: 8, color: 'var(--warm-gray)' }}>
            Passée le{' '}
            {new Date(order.createdAt).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <StatusBadge status={order.status} dict={dict} />
          {order.status === 'PENDING' && (
            <>
              <button
                className="btn btn-secondary"
                style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                onClick={() => setRejecting(true)}
              >
                ✕ {dict.admin.rejectPayment}
              </button>
              <button
                className="btn btn-primary"
                style={{ background: 'var(--success)' }}
                onClick={() => onUpdate({ status: 'CONFIRMED' })}
              >
                ✓ {dict.admin.confirmPayment}
              </button>
            </>
          )}
          {order.status === 'CONFIRMED' && (
            <button className="btn btn-primary" onClick={() => onUpdate({ status: 'PREPARING' })}>
              Marquer en préparation →
            </button>
          )}
          {order.status === 'PREPARING' && (
            <button className="btn btn-primary" onClick={() => onUpdate({ status: 'SHIPPED' })}>
              Marquer expédiée →
            </button>
          )}
          {order.status === 'SHIPPED' && (
            <button className="btn btn-primary" onClick={() => onUpdate({ status: 'DELIVERED' })}>
              Marquer livrée ✓
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <div className="col" style={{ gap: 24 }}>
          <Card title={`${dict.admin.items} · ${items.length}`}>
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="row"
                style={{
                  gap: 16, alignItems: 'center', padding: '16px 0',
                  borderBottom: '1px solid var(--hairline)',
                }}
              >
                <div style={{ width: 64 }}>
                  <ProductImage product={product} ratio="1/1" size="sm" />
                </div>
                <div className="col" style={{ flex: 1, gap: 4 }}>
                  <strong>{product.nameFr}</strong>
                  <span className="caption">
                    {product.sku} · {product.concentration} · {product.size}
                  </span>
                </div>
                <span className="mono">×{quantity}</span>
                <span className="mono" style={{ minWidth: 100, textAlign: 'end' }}>
                  {formatPrice(product.price * quantity, locale)} MRU
                </span>
              </div>
            ))}
            <div className="row" style={{ justifyContent: 'space-between', padding: '20px 0 0', alignItems: 'baseline' }}>
              <span className="caption">TOTAL</span>
              <span style={{ fontSize: 28 }} className="mono">
                {formatPrice(total, locale)} MRU
              </span>
            </div>
          </Card>

          <Card title={dict.admin.paymentProof}>
            <div className="row" style={{ gap: 16, alignItems: 'center', marginBottom: 20 }}>
              <div
                className="display italic"
                style={{
                  width: 48, height: 48, background: 'var(--charcoal)', color: 'var(--cream)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {payment.initials}
              </div>
              <div className="col" style={{ gap: 2 }}>
                <strong>{payment.name}</strong>
                <span className="mono small">{payment.number}</span>
              </div>
              <span className="badge" style={{ marginInlineStart: 'auto' }}>{order.proofNote}</span>
            </div>
            <PaymentProofMock order={order} payment={payment} total={total} onZoom={() => setZoomed(true)} />
          </Card>

          <Card title={dict.admin.statusTimeline}>
            <div className="col" style={{ gap: 0 }}>
              {order.history.map((h, i) => (
                <div key={i} className="row" style={{ gap: 16, alignItems: 'flex-start', position: 'relative' }}>
                  <div className="col" style={{ alignItems: 'center', gap: 0 }}>
                    <div
                      style={{
                        width: 12, height: 12,
                        background: i === order.history.length - 1 ? 'var(--accent)' : 'var(--charcoal)',
                        borderRadius: '50%', marginTop: 4,
                      }}
                    />
                    {i < order.history.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: 'var(--hairline)', minHeight: 36 }} />
                    )}
                  </div>
                  <div className="col" style={{ gap: 2, paddingBottom: 20 }}>
                    <strong>{dict.status[h.status]}</strong>
                    <span className="caption" style={{ color: 'var(--warm-gray)' }}>
                      {new Date(h.at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {order.rejectionReason && (
              <div
                style={{
                  background: 'rgba(160,69,69,0.08)', padding: 16, marginTop: 12,
                  borderInlineStart: '3px solid var(--error)',
                }}
              >
                <span className="caption" style={{ color: 'var(--error)' }}>MOTIF DU REFUS</span>
                <p style={{ marginTop: 6, fontSize: 14 }}>{order.rejectionReason}</p>
              </div>
            )}
          </Card>
        </div>

        <div className="col" style={{ gap: 24 }}>
          <Card title={dict.admin.customer}>
            <div className="col" style={{ gap: 10 }}>
              <div className="row" style={{ alignItems: 'center', gap: 14 }}>
                <div
                  className="display italic"
                  style={{ width: 48, height: 48, background: 'var(--accent)', color: 'var(--cream)' }}
                />
                <div className="col" style={{ gap: 2 }}>
                  <strong>{order.customerName}</strong>
                  <span className="small mono">{order.customerPhone}</span>
                </div>
              </div>
              <hr className="hr" style={{ marginBlock: 12 }} />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="caption">COMMANDES</span>
                <span className="mono">4</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="caption">DEPENSES</span>
                <span className="mono">42 100 MRU</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="caption">CLIENT DEPUIS</span>
                <span className="mono">FÉV. 2026</span>
              </div>
            </div>
          </Card>

          <Card title={dict.admin.deliveryAddress}>
            <strong>{order.customerName}</strong>
            <p style={{ marginTop: 8, lineHeight: 1.6, fontSize: 14 }}>
              {order.neighborhood} · {order.city}
              <br />
              {order.details || '—'}
              <br />
              <span className="mono small">{order.lat}, {order.lng}</span>
            </p>
            <div style={{ position: 'relative', aspectRatio: '4/3', background: '#ece5d6', marginTop: 16, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '20%', background: '#c8d4dc' }} />
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <g stroke="#c8b896" strokeWidth="0.3">
                  <line x1="20" y1="22" x2="100" y2="20" />
                  <line x1="20" y1="32" x2="100" y2="34" />
                  <line x1="50" y1="0" x2="52" y2="50" />
                </g>
              </svg>
              <div style={{ position: 'absolute', left: '60%', top: '40%' }}>
                <svg width="20" height="28" viewBox="0 0 22 32">
                  <path d="M11 0 C4.9 0 0 4.9 0 11 c0 8.6 11 21 11 21 s11-12.4 11-21 c0-6.1-4.9-11-11-11 z M11 15 c-2.2 0-4-1.8-4-4 s1.8-4 4-4 s4 1.8 4 4 s-1.8 4-4 4 z" fill="var(--accent)" stroke="var(--charcoal)" strokeWidth="1" />
                </svg>
              </div>
              <span
                className="mono"
                style={{
                  position: 'absolute', bottom: 8, left: 8,
                  fontSize: 9, letterSpacing: '0.16em',
                  background: 'var(--cream)', padding: '2px 6px',
                }}
              >
                NOUAKCHOTT
              </span>
            </div>
          </Card>

          <Card title={dict.admin.paymentMethod}>
            <div className="row" style={{ alignItems: 'center', gap: 14 }}>
              <div
                className="display italic"
                style={{
                  width: 40, height: 40, background: 'var(--charcoal)', color: 'var(--cream)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {payment.initials}
              </div>
              <div className="col" style={{ gap: 2 }}>
                <strong>{payment.name}</strong>
                <span className="small mono">{payment.number}</span>
              </div>
            </div>
            <div
              className="row"
              style={{ justifyContent: 'space-between', marginTop: 16, padding: '12px 0', borderTop: '1px solid var(--hairline)' }}
            >
              <span className="caption">MONTANT ATTENDU</span>
              <span className="mono">{formatPrice(total, locale)} MRU</span>
            </div>
          </Card>
        </div>
      </div>

      {rejecting && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.6)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setRejecting(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'var(--cream)', padding: 40, maxWidth: 480, width: '90%' }}
          >
            <span className="caption" style={{ color: 'var(--error)' }}>REJET DU PAIEMENT</span>
            <h3 className="display italic" style={{ fontSize: 28, fontWeight: 400, marginTop: 8 }}>
              Motif du refus
            </h3>
            <p className="small" style={{ marginTop: 8, color: 'var(--warm-gray)' }}>
              Le client recevra une notification avec ce message.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Montant inférieur au total dû, justificatif illisible…"
              style={{
                width: '100%', marginTop: 20, padding: 14, background: 'var(--ivory)',
                border: '1px solid var(--hairline)', minHeight: 100,
                outline: 'none', fontFamily: 'inherit', fontSize: 14,
              }}
            />
            <div className="row" style={{ justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setRejecting(false)}>{dict.admin.cancel}</button>
              <button className="btn btn-primary" style={{ background: 'var(--error)' }} onClick={reject}>
                {dict.admin.submit}
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomed && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.92)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48,
          }}
          onClick={() => setZoomed(false)}
        >
          <button onClick={() => setZoomed(false)} style={{ position: 'absolute', top: 24, right: 32, color: 'var(--cream)', fontSize: 24 }}>
            ✕
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, width: '100%' }}>
            <PaymentProofMock order={order} payment={payment} total={total} large />
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ background: 'var(--ivory)', padding: 28 }}>
      <span className="caption" style={{ color: 'var(--accent)' }}>{title}</span>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

interface PaymentProofProps {
  order: DemoOrder;
  payment: (typeof PAYMENT_METHODS)[number];
  total: number;
  onZoom?: () => void;
  large?: boolean;
}

function PaymentProofMock({ order, payment, total, onZoom, large }: PaymentProofProps) {
  const palette: Record<string, { bg: string; accent: string; name: string }> = {
    BANKILY: { bg: '#1c3d2e', accent: '#d4af37', name: 'Bankily' },
    SEDAD: { bg: '#2c2a4a', accent: '#e6c3a5', name: 'Sedad' },
    MASRVI: { bg: '#3a1f1f', accent: '#c87b58', name: 'Masrvi' },
    WHATSAPP: { bg: '#075e54', accent: '#dcf8c6', name: 'WhatsApp' },
  };
  const p = palette[order.paymentMethod] || palette.BANKILY;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', cursor: onZoom ? 'zoom-in' : 'default' }} onClick={onZoom}>
      <div style={{ width: large ? 360 : 280, background: 'var(--charcoal)', padding: 12, position: 'relative' }}>
        <div
          style={{
            height: 22, display: 'flex', justifyContent: 'center', alignItems: 'center',
            color: 'var(--cream)', fontSize: 10, fontFamily: 'JetBrains Mono', letterSpacing: '0.1em',
          }}
        >
          <span style={{ marginRight: 'auto' }}>09:42</span>
          <span style={{ width: 60, height: 14, background: 'var(--cream)', opacity: 0.1, borderRadius: 8 }} />
          <span style={{ marginLeft: 'auto' }}>●●● 4G</span>
        </div>
        <div
          style={{
            background: p.bg, color: '#fff', padding: '20px 16px',
            minHeight: large ? 540 : 420,
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div className="row" style={{ alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.18)' }}>
            <div
              style={{
                width: 32, height: 32, background: p.accent, color: p.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cormorant Garamond', fontSize: 18, fontWeight: 600,
              }}
            >
              {payment.initials}
            </div>
            <div className="col" style={{ gap: 2 }}>
              <strong style={{ fontSize: 14 }}>{p.name}</strong>
              <span style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.1em' }}>TRANSACTION REÇUE</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', paddingBlock: 28 }}>
            <div
              style={{
                width: 56, height: 56, margin: '0 auto',
                border: `2px solid ${p.accent}`, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: p.accent, fontSize: 26,
              }}
            >
              ✓
            </div>
            <p style={{ marginTop: 14, fontSize: 11, opacity: 0.7, letterSpacing: '0.18em' }}>MONTANT REÇU</p>
            <p style={{ fontSize: 32, fontFamily: 'Cormorant Garamond', fontWeight: 400, marginTop: 4 }}>
              {formatPrice(total, 'fr')} <span style={{ fontSize: 14, color: p.accent }}>MRU</span>
            </p>
          </div>
          <div
            className="col"
            style={{
              gap: 12, padding: '14px 0',
              borderTop: '1px dashed rgba(255,255,255,0.2)',
              borderBottom: '1px dashed rgba(255,255,255,0.2)',
              fontSize: 11,
            }}
          >
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.65 }}>De</span>
              <span style={{ fontFamily: 'JetBrains Mono' }}>{order.customerPhone}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.65 }}>À</span>
              <span style={{ fontFamily: 'JetBrains Mono' }}>{payment.number}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.65 }}>Date</span>
              <span style={{ fontFamily: 'JetBrains Mono' }}>
                {new Date(order.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.65 }}>Réf.</span>
              <span style={{ fontFamily: 'JetBrains Mono' }}>
                {order.proofNote.match(/[A-Z0-9-]+$/)?.[0] || 'TXN8842710'}
              </span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.65 }}>Motif</span>
              <span>Achat A&M Perfume</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 18, fontSize: 10, opacity: 0.6, textAlign: 'center', letterSpacing: '0.12em' }}>
            {p.name.toUpperCase()} · CONFIRMATION SMS ENVOYÉE
          </div>
        </div>
        {onZoom && (
          <div className="caption" style={{ position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)', color: 'var(--warm-gray)' }}>
            Cliquer pour agrandir ⤢
          </div>
        )}
      </div>
    </div>
  );
}

function AdminProducts({ locale }: { locale: Locale }) {
  return (
    <div className="col" style={{ gap: 24 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h1 className="display italic" style={{ fontSize: 40, fontWeight: 300 }}>Produits</h1>
        <button className="btn btn-primary">+ Nouveau produit</button>
      </div>
      <div style={{ background: 'var(--ivory)' }}>
        <div className="caption row" style={{ padding: '16px 24px', borderBottom: '1px solid var(--charcoal)' }}>
          <span style={{ flex: 0.5 }}></span>
          <span style={{ flex: 1.8 }}>NOM</span>
          <span style={{ flex: 0.8 }}>SKU</span>
          <span style={{ flex: 1 }}>CATÉGORIE</span>
          <span style={{ flex: 0.8 }}>PRIX</span>
          <span style={{ flex: 0.6 }}>STOCK</span>
          <span style={{ flex: 0.8 }}>STATUT</span>
          <span style={{ flex: 0.4 }}></span>
        </div>
        {PRODUCTS.map((p) => {
          const cat = CATEGORIES.find((c) => c.slug === p.categorySlug)!;
          return (
            <div
              key={p.id}
              className="row"
              style={{ padding: '16px 24px', borderBottom: '1px solid var(--hairline)', alignItems: 'center', fontSize: 14 }}
            >
              <div style={{ flex: 0.5 }}>
                <div style={{ width: 44 }}>
                  <ProductImage product={p} ratio="1/1" size="sm" />
                </div>
              </div>
              <div className="col" style={{ flex: 1.8, gap: 4 }}>
                <strong>{p.nameFr}</strong>
                <span className="caption" style={{ color: 'var(--warm-gray)' }}>{p.family}</span>
              </div>
              <span className="mono" style={{ flex: 0.8, fontSize: 12, color: 'var(--warm-gray)' }}>{p.sku}</span>
              <span style={{ flex: 1 }}>{cat.fr}</span>
              <span className="mono" style={{ flex: 0.8 }}>{formatPrice(p.price, locale)}</span>
              <span
                className="mono"
                style={{
                  flex: 0.6,
                  color: p.stock < 8 ? 'var(--error)' : p.stock < 16 ? 'var(--warning)' : 'inherit',
                }}
              >
                {p.stock}
              </span>
              <span style={{ flex: 0.8 }}>
                <span className="badge success">ACTIF</span>
              </span>
              <div style={{ flex: 0.4, display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
                <button className="caption" style={{ color: 'var(--accent)' }}>ÉDITER</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminCustomers({ dict }: { dict: Dict }) {
  const customers = [
    { name: 'Fatima Diallo', email: 'fatima.diallo@example.mr', orders: 4, spent: 42100, since: 'Fév. 2026' },
    { name: 'Ahmed Ould Salem', email: 'a.salem@example.mr', orders: 6, spent: 68400, since: 'Jan. 2026' },
    { name: 'Mariem Bint Ely', email: 'mariem.ely@example.mr', orders: 3, spent: 28200, since: 'Mar. 2026' },
    { name: 'Yacoub Camara', email: 'y.camara@example.mr', orders: 5, spent: 71800, since: 'Déc. 2025' },
    { name: 'Aïcha Wane', email: 'aicha.wane@example.mr', orders: 2, spent: 14700, since: 'Avr. 2026' },
  ];
  return (
    <div className="col" style={{ gap: 24 }}>
      <h1 className="display italic" style={{ fontSize: 40, fontWeight: 300 }}>{dict.admin.customers}</h1>
      <div style={{ background: 'var(--ivory)' }}>
        <div className="caption row" style={{ padding: '16px 24px', borderBottom: '1px solid var(--charcoal)' }}>
          <span style={{ flex: 2 }}>CLIENT</span>
          <span style={{ flex: 2 }}>E-MAIL</span>
          <span style={{ flex: 1 }}>COMMANDES</span>
          <span style={{ flex: 1 }}>DEPENSES</span>
          <span style={{ flex: 1 }}>DEPUIS</span>
        </div>
        {customers.map((c) => (
          <div
            key={c.email}
            className="row"
            style={{ padding: '18px 24px', borderBottom: '1px solid var(--hairline)', alignItems: 'center' }}
          >
            <div className="row" style={{ flex: 2, gap: 12, alignItems: 'center' }}>
              <div
                className="display italic"
                style={{
                  width: 36, height: 36, background: 'var(--accent)', color: 'var(--cream)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {c.name[0]}
              </div>
              <strong>{c.name}</strong>
            </div>
            <span style={{ flex: 2, fontSize: 13, color: 'var(--warm-gray)' }}>{c.email}</span>
            <span className="mono" style={{ flex: 1 }}>{c.orders}</span>
            <span className="mono" style={{ flex: 1 }}>{formatPrice(c.spent, 'fr')} MRU</span>
            <span style={{ flex: 1, fontSize: 13, color: 'var(--warm-gray)' }}>{c.since}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCategories({ dict }: { dict: Dict }) {
  return (
    <div className="col" style={{ gap: 24 }}>
      <h1 className="display italic" style={{ fontSize: 40, fontWeight: 300 }}>{dict.admin.categories}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {CATEGORIES.map((c, i) => {
          const count = PRODUCTS.filter((p) => p.categorySlug === c.slug).length;
          const hue = (['rose', 'midnight', 'sand', 'oud', 'gold'] as const)[i];
          return (
            <div
              key={c.id}
              style={{
                background: HUE_BG[hue], aspectRatio: '3/2', padding: 24,
                color: HUE_BOTTLE[hue].label, position: 'relative',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.22em' }}>0{i + 1}</span>
              <div>
                <h3 className="display italic" style={{ fontSize: 32, fontWeight: 400 }}>{c.fr}</h3>
                <p className="caption" style={{ marginTop: 10 }}>{count} produits</p>
              </div>
              <div className="row" style={{ gap: 16 }}>
                <button className="caption" style={{ borderBottom: '1px solid currentColor', paddingBottom: 2 }}>ÉDITER</button>
                <button className="caption" style={{ opacity: 0.6 }}>VOIR</button>
              </div>
            </div>
          );
        })}
        <button
          style={{
            aspectRatio: '3/2', border: '1px dashed var(--hairline)',
            color: 'var(--warm-gray)', fontSize: 14, letterSpacing: '0.12em',
          }}
        >
          + NOUVELLE CATÉGORIE
        </button>
      </div>
    </div>
  );
}

function AdminSettings({ dict }: { dict: Dict }) {
  return (
    <div className="col" style={{ gap: 24 }}>
      <h1 className="display italic" style={{ fontSize: 40, fontWeight: 300 }}>{dict.admin.settings}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'var(--ivory)', padding: 32 }}>
          <h3 className="display italic" style={{ fontSize: 24, fontWeight: 400 }}>Identité</h3>
          <div className="col gap-md" style={{ marginTop: 24 }}>
            <Field label="Nom de la boutique" value="A&M Perfume" onChange={() => {}} />
            <Field label="Téléphone" value="+222 38 12 04 04" onChange={() => {}} />
            <Field label="E-mail" value="contact@amperfume.mr" onChange={() => {}} />
            <Field label="Adresse" value="Nouakchott, Mauritanie" onChange={() => {}} />
          </div>
        </div>
        <div style={{ background: 'var(--ivory)', padding: 32 }}>
          <h3 className="display italic" style={{ fontSize: 24, fontWeight: 400 }}>Numéros de paiement</h3>
          <div className="col gap-md" style={{ marginTop: 24 }}>
            <Field label="Bankily" value="22 33 44 55" onChange={() => {}} />
            <Field label="Sedad" value="36 11 88 22" onChange={() => {}} />
            <Field label="Masrvi" value="42 09 77 14" onChange={() => {}} />
            <Field label="WhatsApp" value="+222 38 12 04 04" onChange={() => {}} />
          </div>
        </div>
      </div>
      <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Enregistrer</button>
    </div>
  );
}

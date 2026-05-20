'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { findProduct, PAYMENT_METHODS } from '@/lib/data';
import { formatPrice, productName, type Locale } from '@/lib/i18n';
import type { Dict } from '@/lib/dict';
import { ProductImage } from '@/components/ui/ProductImage';
import { useCart } from '@/store/cartStore';

interface FlowProps {
  locale: Locale;
  dict: Dict;
}

type Step = 1 | 2 | 3 | 4;
type Payment = (typeof PAYMENT_METHODS)[number]['key'];

interface Delivery {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  neighborhood: string;
  details: string;
  lat: number | null;
  lng: number | null;
  pinX?: number;
  pinY?: number;
  useMap: boolean;
}

interface LoggedInProfile {
  fullName: string;
  phone: string;
  email: string;
}

function readLoggedInProfile(): LoggedInProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('amAccount');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LoggedInProfile>;
    if (!parsed.fullName || !parsed.phone) return null;
    return {
      fullName: parsed.fullName,
      phone: parsed.phone,
      email: parsed.email ?? '',
    };
  } catch {
    return null;
  }
}

interface Proof {
  name: string;
  size: number;
  url: string;
}

export function CheckoutFlow({ locale, dict }: FlowProps) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<LoggedInProfile | null>(null);

  useEffect(() => {
    setHydrated(true);
    setProfile(readLoggedInProfile());
  }, []);

  const enriched = items
    .map((c) => ({ ...c, product: findProduct(c.productId) }))
    .filter((c): c is { productId: number; quantity: number; product: NonNullable<typeof c.product> } => Boolean(c.product));
  const subtotal = enriched.reduce((a, c) => a + c.product.price * c.quantity, 0);

  const [step, setStep] = useState<Step>(1);
  const [delivery, setDelivery] = useState<Delivery>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Nouakchott',
    neighborhood: '',
    details: '',
    lat: null,
    lng: null,
    useMap: true,
  });

  useEffect(() => {
    if (!profile) return;
    setDelivery((d) => ({
      ...d,
      fullName: d.fullName || profile.fullName,
      phone: d.phone || profile.phone,
      email: d.email || profile.email,
    }));
  }, [profile]);
  const [payment, setPayment] = useState<Payment>('BANKILY');
  const [proof, setProof] = useState<Proof | null>(null);
  const [orderNum, setOrderNum] = useState('');

  if (!hydrated) return <section style={{ paddingBlock: 160 }} />;

  if (enriched.length === 0 && step < 4) {
    return (
      <section style={{ paddingBlock: 160, textAlign: 'center' }}>
        <p className="display italic" style={{ fontSize: 32, color: 'var(--warm-gray)' }}>{dict.cart.empty}</p>
        <Link href={`/${locale}/catalog`} className="btn btn-primary" style={{ marginTop: 24 }}>
          {dict.cart.emptyCta}
        </Link>
      </section>
    );
  }

  const placeOrder = () => {
    const num = 'AM-2026-' + String(43 + Math.floor(Math.random() * 50)).padStart(4, '0');
    setOrderNum(num);
    setStep(4);
    if (typeof window !== 'undefined') {
      try {
        const guestOrders = JSON.parse(window.localStorage.getItem('amGuestOrders') || '[]');
        guestOrders.unshift({
          orderNumber: num,
          createdAt: new Date().toISOString(),
          isGuest: !profile,
          customer: {
            name: delivery.fullName,
            phone: delivery.phone,
            email: delivery.email || null,
          },
          deliveryAddress: {
            city: delivery.city,
            neighborhood: delivery.neighborhood,
            details: delivery.details,
            lat: delivery.lat,
            lng: delivery.lng,
          },
          paymentMethod: payment,
          items: enriched.map((c) => ({ productId: c.productId, quantity: c.quantity })),
          subtotal,
        });
        window.localStorage.setItem('amGuestOrders', JSON.stringify(guestOrders.slice(0, 20)));
      } catch {
        /* storage unavailable — proceed regardless */
      }
    }
    clear();
  };

  const selectedPayment = PAYMENT_METHODS.find((p) => p.key === payment)!;

  return (
    <>
      <section style={{ borderBottom: '1px solid var(--hairline)' }}>
        <div className="wrap pt-8 pb-6 md:pt-12 md:pb-8">
          <span className="caption" style={{ color: 'var(--accent)' }}>FINALISATION</span>
          <h1 className="display italic" style={{ fontSize: 'clamp(32px, 7vw, 56px)', fontWeight: 300, marginTop: 8 }}>
            {dict.checkout.title}
          </h1>
          <Stepper step={step} dict={dict} />
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div
          className={`wrap grid grid-cols-1 gap-8 lg:gap-16 items-start ${step === 4 ? '' : 'lg:grid-cols-[1.5fr_1fr]'}`}
        >
          <div>
            {step === 1 && (
              <DeliveryStep
                dict={dict}
                delivery={delivery}
                setDelivery={setDelivery}
                isLoggedIn={Boolean(profile)}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <PaymentStep
                dict={dict} locale={locale}
                payment={payment} setPayment={setPayment}
                amount={subtotal}
                onNext={() => setStep(3)} onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <ProofStep
                dict={dict} payment={selectedPayment}
                proof={proof} setProof={setProof}
                onNext={placeOrder} onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <ConfirmedStep
                dict={dict} locale={locale}
                orderNum={orderNum} delivery={delivery} payment={selectedPayment}
                isGuest={!profile}
              />
            )}
          </div>
          {step < 4 && (
            <OrderSummaryAside
              dict={dict} locale={locale}
              items={enriched} subtotal={subtotal}
              delivery={delivery} payment={payment} step={step}
            />
          )}
        </div>
      </section>
    </>
  );
}

function Stepper({ step, dict }: { step: Step; dict: Dict }) {
  const labels = [dict.checkout.step1, dict.checkout.step2, dict.checkout.step3, dict.checkout.step4];
  return (
    <div className="flex mt-6 md:mt-9 gap-0">
      {labels.map((label, i) => {
        const idx = (i + 1) as Step;
        const done = idx < step;
        const active = idx === step;
        return (
          <div key={label} className="flex-1 flex items-center gap-2 md:gap-4" style={{ opacity: idx > step ? 0.4 : 1 }}>
            <div className="flex items-center gap-2 md:gap-4 flex-1">
              <div
                className="mono shrink-0"
                style={{
                  width: 28, height: 28, border: '1px solid',
                  borderColor: active ? 'var(--accent)' : 'var(--charcoal)',
                  background: done ? 'var(--charcoal)' : active ? 'var(--accent)' : 'transparent',
                  color: done || active ? 'var(--cream)' : 'var(--charcoal)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                }}
              >
                {done ? '✓' : '0' + idx}
              </div>
              <div className="hidden md:flex flex-col gap-0.5">
                <span className="caption" style={{ color: active ? 'var(--accent)' : 'var(--warm-gray)' }}>
                  ÉTAPE {idx}
                </span>
                <span style={{ fontSize: 14, color: active ? 'var(--charcoal)' : 'var(--warm-gray)' }}>{label}</span>
              </div>
              {i < 3 && <div className="flex-1 h-px" style={{ background: done ? 'var(--charcoal)' : 'var(--hairline)' }} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface DeliveryStepProps {
  dict: Dict;
  delivery: Delivery;
  setDelivery: (d: Delivery) => void;
  isLoggedIn: boolean;
  onNext: () => void;
}

function DeliveryStep({ dict, delivery, setDelivery, isLoggedIn, onNext }: DeliveryStepProps) {
  const canNext = delivery.fullName.trim() && delivery.phone.trim() && delivery.neighborhood.trim();
  return (
    <div className="col gap-lg p-5 md:p-10 lg:p-12" style={{ background: 'var(--ivory)' }}>
      <div>
        <span className="caption" style={{ color: 'var(--accent)' }}>01 — {dict.checkout.step1}</span>
        <h2 className="display italic" style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 300, marginTop: 10 }}>
          Vos coordonnées
        </h2>
        <p style={{ marginTop: 10, color: 'var(--warm-gray)', fontSize: 14, lineHeight: 1.6 }}>
          {isLoggedIn
            ? 'Pré‑remplies depuis votre profil — modifiables à tout moment.'
            : 'Pas de compte requis. Nous utilisons ces coordonnées uniquement pour traiter votre commande.'}
        </p>
      </div>

      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--hairline)',
          padding: 20,
          borderInlineStart: '3px solid var(--accent)',
        }}
      >
        <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span className="caption" style={{ color: 'var(--accent)' }}>
            {isLoggedIn ? 'CONNECTÉ' : 'COMMANDE INVITÉ'}
          </span>
          {!isLoggedIn && (
            <Link
              href="#"
              className="caption"
              style={{ color: 'var(--warm-gray)', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              J&apos;ai déjà un compte
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5" style={{ marginTop: 16 }}>
          <Field
            label={`${dict.checkout.fullName} *`}
            value={delivery.fullName}
            onChange={(v) => setDelivery({ ...delivery, fullName: v })}
            placeholder="Fatima Diallo"
          />
          <Field
            label={`${dict.checkout.phone} *`}
            value={delivery.phone}
            onChange={(v) => setDelivery({ ...delivery, phone: v })}
            placeholder="+222 22 33 44 55"
            type="tel"
          />
          <Field
            label="E‑mail (optionnel, confirmation de commande)"
            value={delivery.email}
            onChange={(v) => setDelivery({ ...delivery, email: v })}
            placeholder="fatima@exemple.mr"
            type="email"
            span={2}
          />
        </div>
      </div>

      <div className="col" style={{ gap: 20 }}>
        <span className="caption" style={{ color: 'var(--accent)' }}>ADRESSE DE LIVRAISON</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
          <Field label={dict.checkout.city} value={delivery.city} onChange={(v) => setDelivery({ ...delivery, city: v })} />
          <Field label={`${dict.checkout.neighborhood} *`} value={delivery.neighborhood} onChange={(v) => setDelivery({ ...delivery, neighborhood: v })} placeholder="Tevragh‑Zeina" />
          <Field
            label={dict.checkout.details}
            value={delivery.details}
            onChange={(v) => setDelivery({ ...delivery, details: v })}
            span={2}
            placeholder="Ex: Près de la mosquée centrale, villa beige, 2e étage"
          />
        </div>
      </div>

      <div className="col gap-md">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="caption">{dict.checkout.useMap}</span>
          <div className="row" style={{ background: 'var(--cream)', border: '1px solid var(--hairline)' }}>
            <button
              onClick={() => setDelivery({ ...delivery, useMap: true })}
              className="caption"
              style={{
                padding: '8px 18px',
                background: delivery.useMap ? 'var(--charcoal)' : 'transparent',
                color: delivery.useMap ? 'var(--cream)' : 'var(--charcoal)',
              }}
            >
              📍 {dict.checkout.useMap}
            </button>
            <button
              onClick={() => setDelivery({ ...delivery, useMap: false })}
              className="caption"
              style={{
                padding: '8px 18px',
                background: !delivery.useMap ? 'var(--charcoal)' : 'transparent',
                color: !delivery.useMap ? 'var(--cream)' : 'var(--charcoal)',
              }}
            >
              ✏️ {dict.checkout.useText}
            </button>
          </div>
        </div>
        {delivery.useMap && <NouakchottMap delivery={delivery} setDelivery={setDelivery} dict={dict} />}
        <p className="small">{dict.checkout.mapHint}</p>
      </div>

      <div className="row" style={{ justifyContent: 'flex-end', gap: 16, marginTop: 8 }}>
        <button className="btn btn-primary" disabled={!canNext} onClick={onNext}>
          {dict.checkout.next} →
        </button>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  span?: 1 | 2;
  placeholder?: string;
  type?: string;
}

export function Field({ label, value, onChange, span = 1, placeholder, type = 'text' }: FieldProps) {
  return (
    <div className={`field ${span === 2 ? 'md:col-span-2' : ''}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function NouakchottMap({
  delivery,
  setDelivery,
  dict,
}: {
  delivery: Delivery;
  setDelivery: (d: Delivery) => void;
  dict: Dict;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const lat = 18.1 - (y / 100) * 0.1;
    const lng = -15.99 + (x / 100) * 0.1;
    setDelivery({ ...delivery, lat: +lat.toFixed(5), lng: +lng.toFixed(5), pinX: x, pinY: y });
  };

  const neighborhoods = [
    { name: 'TEVRAGH-ZEINA', x: 40, y: 26 },
    { name: 'KSAR', x: 55, y: 22 },
    { name: 'SEBKHA', x: 38, y: 38 },
    { name: 'CAPITALE', x: 62, y: 30 },
    { name: 'RIYAD', x: 78, y: 42 },
    { name: 'ARAFAT', x: 70, y: 44 },
  ];

  return (
    <div
      ref={ref}
      onClick={handleClick}
      style={{
        position: 'relative', aspectRatio: '16/8', background: '#ece5d6',
        cursor: 'crosshair', overflow: 'hidden', border: '1px solid var(--hairline)',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '22%', background: 'linear-gradient(90deg, #b2c2cc, #c8d4dc)' }}>
        <span className="mono" style={{ position: 'absolute', left: 12, top: 14, fontSize: 9, letterSpacing: '0.2em', color: '#5a6d77' }}>
          OCÉAN ATLANTIQUE
        </span>
      </div>
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path d="M22 0 Q24 8 22 14 Q19 22 23 30 Q26 40 22 50" stroke="#a3b3bc" strokeWidth="0.4" fill="none" />
        <g stroke="#c8b896" strokeWidth="0.2">
          <line x1="22" y1="22" x2="100" y2="20" />
          <line x1="22" y1="32" x2="100" y2="34" />
          <line x1="40" y1="0" x2="42" y2="50" />
          <line x1="60" y1="0" x2="62" y2="50" />
          <line x1="78" y1="0" x2="80" y2="50" />
        </g>
        <line x1="22" y1="26" x2="100" y2="26" stroke="#9c8866" strokeWidth="0.5" />
        <path d="M30 50 Q34 42 38 40 Q44 38 48 32" stroke="#cdd6c4" strokeWidth="1.2" fill="none" />
      </svg>
      {neighborhoods.map((n) => (
        <div
          key={n.name}
          style={{ position: 'absolute', left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
        >
          <span
            className="mono"
            style={{
              fontSize: 9, letterSpacing: '0.18em', color: '#5d4f3a',
              background: 'rgba(245,239,230,0.7)', padding: '1px 4px',
            }}
          >
            {n.name}
          </span>
        </div>
      ))}
      <div style={{ position: 'absolute', top: 18, right: 18, width: 40, height: 40, border: '1px solid #5d4f3a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,239,230,0.7)' }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#5d4f3a' }}>N</span>
        <div
          style={{
            position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
            borderBottom: '8px solid #5d4f3a',
          }}
        />
      </div>
      {delivery.lat !== null && delivery.pinX !== undefined && (
        <div
          style={{
            position: 'absolute', left: `${delivery.pinX}%`, top: `${delivery.pinY}%`,
            transform: 'translate(-50%, -100%)', pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10, letterSpacing: '0.14em',
              background: 'var(--charcoal)', color: 'var(--cream)',
              padding: '4px 8px', whiteSpace: 'nowrap', marginBottom: 6,
            }}
          >
            {delivery.lat}, {delivery.lng}
          </div>
          <svg width="22" height="32" viewBox="0 0 22 32">
            <path d="M11 0 C4.9 0 0 4.9 0 11 c0 8.6 11 21 11 21 s11-12.4 11-21 c0-6.1-4.9-11-11-11 z M11 15 c-2.2 0-4-1.8-4-4 s1.8-4 4-4 s4 1.8 4 4 s-1.8 4-4 4 z" fill="var(--accent)" stroke="var(--charcoal)" strokeWidth="1" />
          </svg>
        </div>
      )}
      {delivery.lat !== null && (
        <div
          className="mono"
          style={{
            position: 'absolute', bottom: 14, left: 14,
            fontSize: 10, letterSpacing: '0.16em',
            background: 'var(--cream)', padding: '6px 10px', border: '1px solid var(--hairline)',
          }}
        >
          ✓ {dict.checkout.coordsSaved}
        </div>
      )}
    </div>
  );
}

interface PaymentStepProps {
  dict: Dict;
  locale: Locale;
  payment: Payment;
  setPayment: (p: Payment) => void;
  amount: number;
  onNext: () => void;
  onBack: () => void;
}

function PaymentStep({ dict, locale, payment, setPayment, amount, onNext, onBack }: PaymentStepProps) {
  return (
    <div className="col gap-lg p-6 md:p-10 lg:p-12" style={{ background: 'var(--ivory)' }}>
      <div>
        <span className="caption" style={{ color: 'var(--accent)' }}>02 — {dict.checkout.step2}</span>
        <h2 className="display italic" style={{ fontSize: 40, fontWeight: 300, marginTop: 10 }}>
          {dict.checkout.paymentTitle}
        </h2>
        <p style={{ marginTop: 16, color: 'var(--warm-gray)', fontSize: 15, lineHeight: 1.6 }}>
          {dict.checkout.paymentInstruction}
        </p>
      </div>

      <div
        className="p-5 md:p-7 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
        style={{ background: 'var(--charcoal)', color: 'var(--cream)' }}
      >
        <div>
          <span className="caption" style={{ color: 'var(--accent-soft)' }}>{dict.checkout.amountToSend}</span>
          <div className="mono mt-1.5" style={{ fontSize: 'clamp(28px, 7vw, 36px)' }}>
            {formatPrice(amount, locale)}{' '}
            <span style={{ fontSize: 16, color: 'var(--accent-soft)' }}>MRU</span>
          </div>
        </div>
        <div className="sm:text-right">
          <span className="caption" style={{ color: 'var(--accent-soft)' }}>RÉFÉRENCE</span>
          <div className="mono" style={{ fontSize: 14, marginTop: 6 }}>
            AM-{Date.now().toString().slice(-7)}
          </div>
        </div>
      </div>

      <div className="col gap-md">
        {PAYMENT_METHODS.map((m) => {
          const active = payment === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setPayment(m.key)}
              className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[48px_1fr_auto] gap-4 md:gap-6 items-center p-4 md:p-5 text-start cursor-pointer"
              style={{
                background: 'var(--cream)',
                border: '1px solid',
                borderColor: active ? 'var(--charcoal)' : 'var(--hairline)',
              }}
            >
              <div
                className="display italic flex items-center justify-center"
                style={{
                  width: '100%', aspectRatio: '1',
                  background: active ? 'var(--charcoal)' : 'var(--ivory)',
                  color: active ? 'var(--cream)' : 'var(--charcoal)',
                  border: '1px solid var(--charcoal)',
                }}
              >
                {m.initials}
              </div>
              <div className="col" style={{ gap: 4 }}>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <h4 className="display" style={{ fontSize: 20, fontWeight: 500 }}>{m.name}</h4>
                  <span className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>{m.number}</span>
                </div>
                <span className="small" style={{ fontSize: 12 }}>{m.sub}</span>
              </div>
              <div
                style={{
                  width: 20, height: 20, border: '1px solid var(--charcoal)', borderRadius: '50%',
                  background: active ? 'var(--charcoal)' : 'transparent', position: 'relative',
                }}
              >
                {active && (
                  <div style={{ position: 'absolute', inset: 4, background: 'var(--cream)', borderRadius: '50%' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="row"
        style={{
          background: 'rgba(184,146,74,0.08)', padding: '16px 20px',
          gap: 14, alignItems: 'center', borderInlineStart: '3px solid var(--warning)',
        }}
      >
        <span style={{ fontSize: 20 }}>⚠</span>
        <span className="small" style={{ color: 'var(--graphite)' }}>
          Envoyez <strong>exactement {formatPrice(amount, locale)} MRU</strong> au numéro affiché. Tout montant différent retardera la vérification.
        </span>
      </div>

      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={onBack}>← {dict.checkout.back}</button>
        <button className="btn btn-primary" onClick={onNext}>{dict.checkout.next} →</button>
      </div>
    </div>
  );
}

interface ProofStepProps {
  dict: Dict;
  payment: (typeof PAYMENT_METHODS)[number];
  proof: Proof | null;
  setProof: (p: Proof | null) => void;
  onNext: () => void;
  onBack: () => void;
}

function ProofStep({ dict, payment, proof, setProof, onNext, onBack }: ProofStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setProof({ name: file.name, size: file.size, url: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="col gap-lg p-6 md:p-10 lg:p-12" style={{ background: 'var(--ivory)' }}>
      <div>
        <span className="caption" style={{ color: 'var(--accent)' }}>03 — {dict.checkout.step3}</span>
        <h2 className="display italic" style={{ fontSize: 40, fontWeight: 300, marginTop: 10 }}>
          {dict.checkout.proofTitle}
        </h2>
        <p style={{ marginTop: 16, color: 'var(--warm-gray)', fontSize: 15 }}>{dict.checkout.proofHint}</p>
      </div>

      <div
        className="row"
        style={{
          gap: 16, padding: '18px 24px', background: 'var(--cream)',
          border: '1px solid var(--hairline)', alignItems: 'center',
        }}
      >
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
          <span className="caption">PAIEMENT VIA</span>
          <strong>
            {payment.name} · {payment.number}
          </strong>
        </div>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          border: '1px dashed var(--hairline)', padding: '64px 32px',
          textAlign: 'center', cursor: 'pointer', background: 'var(--cream)',
        }}
      >
        {proof ? (
          <div className="col" style={{ alignItems: 'center', gap: 14 }}>
            <img src={proof.url} alt="proof" style={{ maxHeight: 280, maxWidth: '100%', border: '1px solid var(--hairline)' }} />
            <span className="caption">
              {proof.name} · {(proof.size / 1024).toFixed(0)} KB
            </span>
            <button
              className="btn-ghost"
              onClick={(e) => {
                e.stopPropagation();
                setProof(null);
              }}
            >
              Remplacer
            </button>
          </div>
        ) : (
          <div className="col" style={{ alignItems: 'center', gap: 18 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" />
              <polyline points="3,17 9,11 15,17 21,11" />
              <circle cx="8" cy="8" r="2" />
            </svg>
            <span className="display italic" style={{ fontSize: 24 }}>{dict.checkout.uploadCta}</span>
            <span className="small">{dict.checkout.orDrop}</span>
            <span className="caption" style={{ color: 'var(--warm-gray)' }}>JPG · PNG · MAX 5 MB</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={onBack}>← {dict.checkout.back}</button>
        <button className="btn btn-primary" disabled={!proof} onClick={onNext}>
          {dict.checkout.placeOrder} →
        </button>
      </div>
    </div>
  );
}

interface ConfirmedStepProps {
  dict: Dict;
  locale: Locale;
  orderNum: string;
  delivery: Delivery;
  payment: (typeof PAYMENT_METHODS)[number];
  isGuest: boolean;
}

function ConfirmedStep({ dict, locale, orderNum, delivery, payment, isGuest }: ConfirmedStepProps) {
  const [accountCtaHidden, setAccountCtaHidden] = useState(false);
  const showAccountCta = isGuest && !accountCtaHidden;
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', paddingBlock: 32 }}>
      <div
        style={{
          width: 88, height: 88, border: '1px solid var(--accent)', borderRadius: '50%',
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.2">
          <polyline points="20,6 9,17 4,12" />
        </svg>
      </div>
      <span className="caption" style={{ color: 'var(--accent)', marginTop: 28, display: 'block' }}>
        {dict.checkout.orderNumber}
      </span>
      <h2 className="mono" style={{ fontSize: 26, marginTop: 8 }}>{orderNum}</h2>
      <h1 className="display italic" style={{ fontSize: 64, fontWeight: 300, marginTop: 24 }}>
        {dict.checkout.confirmedTitle}
      </h1>
      <p style={{ marginTop: 18, color: 'var(--warm-gray)', maxWidth: 480, marginInline: 'auto', fontSize: 16, lineHeight: 1.65 }}>
        {dict.checkout.confirmedSub}
      </p>

      <div style={{ marginTop: 56, padding: '36px 40px', background: 'var(--ivory)', textAlign: 'start' }}>
        <span className="caption">RÉCAPITULATIF</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 48px', marginTop: 20 }}>
          <div className="col" style={{ gap: 6 }}>
            <span className="caption">LIVRAISON</span>
            <strong>{delivery.fullName}</strong>
            <span className="small">{delivery.neighborhood} · {delivery.city}</span>
            <span className="small">{delivery.phone}</span>
            {delivery.lat !== null && (
              <span className="mono small">{delivery.lat}, {delivery.lng}</span>
            )}
          </div>
          <div className="col" style={{ gap: 6 }}>
            <span className="caption">PAIEMENT</span>
            <strong>{payment.name}</strong>
            <span className="small mono">{payment.number}</span>
            <span className="small">En attente de vérification</span>
          </div>
        </div>
      </div>

      {showAccountCta && (
        <div
          style={{
            marginTop: 36,
            padding: '24px 24px',
            background: 'var(--cream)',
            border: '1px dashed var(--accent)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            textAlign: 'start',
          }}
        >
          <span className="caption" style={{ color: 'var(--accent)' }}>OPTIONNEL</span>
          <h3 className="display italic" style={{ fontSize: 24, fontWeight: 400 }}>
            Créez un compte pour suivre votre commande
          </h3>
          <p className="small" style={{ color: 'var(--graphite)', lineHeight: 1.55 }}>
            Retrouvez l&apos;historique de vos commandes, gérez vos adresses et recevez les avant‑premières.
            Vos coordonnées sont déjà pré‑remplies — un seul mot de passe à choisir.
          </p>
          <div className="row" style={{ gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
            <Link href={`/${locale}/account`} className="btn btn-primary" style={{ padding: '12px 22px' }}>
              Créer mon compte →
            </Link>
            <button type="button" className="btn-ghost" onClick={() => setAccountCtaHidden(true)}>
              Non merci
            </button>
          </div>
        </div>
      )}

      <div className="row" style={{ justifyContent: 'center', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
        <Link href={`/${locale}`} className="btn btn-secondary">{dict.checkout.backHome}</Link>
        <Link href={`/${locale}/account?tab=orders`} className="btn btn-primary">
          {dict.checkout.viewOrder} →
        </Link>
      </div>
    </div>
  );
}

interface AsideProps {
  dict: Dict;
  locale: Locale;
  items: Array<{ product: NonNullable<ReturnType<typeof findProduct>>; quantity: number }>;
  subtotal: number;
  delivery: Delivery;
  payment: Payment;
  step: Step;
}

function OrderSummaryAside({ dict, locale, items, subtotal, delivery, payment, step }: AsideProps) {
  return (
    <aside style={{ background: 'var(--cream)', border: '1px solid var(--hairline)', padding: 32, position: 'sticky', top: 100 }}>
      <h3 className="display italic" style={{ fontSize: 24, fontWeight: 400 }}>{dict.checkout.summary}</h3>
      <div className="col gap-md" style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--hairline)' }}>
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="row" style={{ gap: 14, alignItems: 'center' }}>
            <div style={{ width: 60 }}>
              <ProductImage product={product} ratio="1/1" size="sm" />
            </div>
            <div className="col" style={{ flex: 1, gap: 2 }}>
              <span style={{ fontSize: 14, lineHeight: 1.3 }}>{productName(product, locale)}</span>
              <span className="caption" style={{ color: 'var(--warm-gray)' }}>
                ×{quantity} · {product.size}
              </span>
            </div>
            <span className="mono" style={{ fontSize: 13 }}>
              {formatPrice(product.price * quantity, locale)}
            </span>
          </div>
        ))}
      </div>
      <div
        className="col gap"
        style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--hairline)', fontSize: 14 }}
      >
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>{dict.cart.subtotal}</span>
          <span className="mono">{formatPrice(subtotal, locale)} MRU</span>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', color: 'var(--warm-gray)' }}>
          <span>{dict.cart.shipping}</span>
          <span className="small italic">{dict.cart.toBeConfirmed}</span>
        </div>
      </div>
      <div
        className="row"
        style={{ justifyContent: 'space-between', marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--charcoal)', alignItems: 'baseline' }}
      >
        <span style={{ fontSize: 14 }}>{dict.cart.total}</span>
        <span style={{ fontSize: 24 }} className="mono">{formatPrice(subtotal, locale)} MRU</span>
      </div>
      {step >= 1 && delivery.fullName && (
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
          <span className="caption">LIVRAISON</span>
          <p className="small" style={{ marginTop: 8, color: 'var(--graphite)', lineHeight: 1.5 }}>
            {delivery.fullName}<br />
            {delivery.neighborhood} · {delivery.city}<br />
            {delivery.phone}
          </p>
        </div>
      )}
      {step >= 2 && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
          <span className="caption">PAIEMENT</span>
          <p className="small" style={{ marginTop: 8, color: 'var(--graphite)' }}>
            {PAYMENT_METHODS.find((p) => p.key === payment)?.name}
          </p>
        </div>
      )}
    </aside>
  );
}

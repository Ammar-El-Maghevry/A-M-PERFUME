'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent } from 'react'; // useRef used in ProofStep
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

type GpsStatus = 'idle' | 'requesting' | 'success' | 'denied' | 'unavailable';

function DeliveryStep({ dict, delivery, setDelivery, isLoggedIn, onNext }: DeliveryStepProps) {
  const canNext =
    delivery.fullName.trim().length > 0 &&
    delivery.phone.trim().length > 0 &&
    delivery.city.trim().length > 0;

  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const [gpsError, setGpsError] = useState<string | null>(null);

  const requestLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsStatus('unavailable');
      setGpsError(dict.checkout.gpsUnavailable);
      return;
    }
    setGpsStatus('requesting');
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = +pos.coords.latitude.toFixed(5);
        const lng = +pos.coords.longitude.toFixed(5);
        let city = delivery.city;
        let neighborhood = delivery.neighborhood;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`,
            { headers: { Accept: 'application/json' } },
          );
          if (res.ok) {
            const data = (await res.json()) as { address?: Record<string, string> };
            const a = data.address ?? {};
            city = a.city || a.town || a.village || a.county || city;
            neighborhood =
              a.neighbourhood || a.suburb || a.quarter || a.city_district || a.residential || neighborhood;
          }
        } catch {
          /* reverse geocoding failed – keep existing city/neighborhood */
        }
        setDelivery({ ...delivery, lat, lng, city, neighborhood });
        setGpsStatus('success');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('denied');
          setGpsError(dict.checkout.gpsDenied);
        } else {
          setGpsStatus('unavailable');
          setGpsError(dict.checkout.gpsUnavailable);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <div className="col gap-lg p-5 md:p-10 lg:p-12" style={{ background: 'var(--ivory)' }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <span className="caption" style={{ color: 'var(--accent)' }}>01 — {dict.checkout.step1}</span>
        <h2 className="display italic" style={{ fontSize: 'clamp(26px, 6vw, 40px)', fontWeight: 300, marginTop: 10 }}>
          Vos coordonnées
        </h2>
        <p style={{ marginTop: 10, color: 'var(--warm-gray)', fontSize: 14, lineHeight: 1.6 }}>
          {isLoggedIn
            ? 'Pré‑remplies depuis votre profil — modifiables à tout moment.'
            : 'Pas de compte requis. Vos données servent uniquement à traiter votre commande.'}
        </p>
      </div>

      {/* ── Guest / logged-in identity block ───────────────────── */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--hairline)', padding: 20, borderInlineStart: '3px solid var(--accent)' }}>
        <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span className="caption" style={{ color: 'var(--accent)' }}>
            {isLoggedIn ? 'CONNECTÉ' : 'COMMANDE INVITÉ'}
          </span>
          {!isLoggedIn && (
            <Link href="#" className="caption" style={{ color: 'var(--warm-gray)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              J&apos;ai déjà un compte
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5" style={{ marginTop: 16 }}>
          <Field label={`${dict.checkout.fullName} *`} value={delivery.fullName} onChange={(v) => setDelivery({ ...delivery, fullName: v })} placeholder="Fatima Diallo" />
          <Field label={`${dict.checkout.phone} *`} value={delivery.phone} onChange={(v) => setDelivery({ ...delivery, phone: v })} placeholder="+222 22 33 44 55" type="tel" />
          <Field label="E‑mail (optionnel)" value={delivery.email} onChange={(v) => setDelivery({ ...delivery, email: v })} placeholder="fatima@exemple.mr" type="email" span={2} />
        </div>
      </div>

      {/* ── Address block ───────────────────────────────────────── */}
      <div className="col" style={{ gap: 20 }}>
        <span className="caption" style={{ color: 'var(--accent)' }}>ADRESSE DE LIVRAISON</span>

        {/* GPS button row */}
        <div className="col" style={{ background: 'var(--cream)', border: '1px solid var(--hairline)', padding: 16, gap: 14 }}>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="button"
              onClick={requestLocation}
              disabled={gpsStatus === 'requesting'}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', background: 'var(--charcoal)', color: 'var(--cream)',
                fontSize: 13, letterSpacing: '0.1em',
                opacity: gpsStatus === 'requesting' ? 0.6 : 1,
              }}
            >
              {gpsStatus === 'requesting'
                ? <><SpinnerIcon /> {dict.checkout.gpsRequesting}</>
                : <>{dict.checkout.gpsButton}</>}
            </button>

            {gpsStatus === 'success' && delivery.lat !== null && delivery.lng !== null && (
              <a
                href={`https://www.google.com/maps?q=${delivery.lat},${delivery.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                {dict.checkout.gpsViewMaps}
              </a>
            )}
          </div>

          {/* GPS success: map embed + detected address */}
          {gpsStatus === 'success' && delivery.lat !== null && delivery.lng !== null && (
            <div className="col" style={{ gap: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--warm-gray)' }}>
                ✓ {dict.checkout.gpsDetected}:{' '}
                <strong style={{ color: 'var(--charcoal)' }}>
                  {[delivery.neighborhood, delivery.city].filter(Boolean).join(', ') || `${delivery.lat}, ${delivery.lng}`}
                </strong>
              </p>
              <iframe
                title="map-preview"
                src={`https://www.google.com/maps?q=${delivery.lat},${delivery.lng}&z=16&output=embed`}
                style={{ width: '100%', height: 200, border: '1px solid var(--hairline)', display: 'block' }}
                loading="lazy"
              />
              <span className="mono" style={{ fontSize: 11, color: 'var(--warm-gray)' }}>
                {delivery.lat}, {delivery.lng}
              </span>
            </div>
          )}

          {/* GPS error */}
          {gpsError && gpsStatus !== 'success' && (
            <p style={{ fontSize: 13, color: 'var(--error, #a05a3c)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠</span> {gpsError}
            </p>
          )}
        </div>

        {/* City / neighborhood / details fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Field label={`${dict.checkout.city} *`} value={delivery.city} onChange={(v) => setDelivery({ ...delivery, city: v })} placeholder="Nouakchott" />
          <Field label={dict.checkout.neighborhood} value={delivery.neighborhood} onChange={(v) => setDelivery({ ...delivery, neighborhood: v })} placeholder="Tevragh‑Zeina" />
          <Field
            label={dict.checkout.details}
            value={delivery.details}
            onChange={(v) => setDelivery({ ...delivery, details: v })}
            span={2}
            placeholder="Ex: Près de la mosquée centrale, villa beige, 2e étage"
          />
        </div>
      </div>

      {/* ── Continue ─────────────────────────────────────────────── */}
      <div className="row" style={{ justifyContent: 'flex-end', gap: 16, marginTop: 8 }}>
        <button
          className="btn btn-primary"
          disabled={!canNext}
          onClick={onNext}
          style={{ opacity: canNext ? 1 : 0.45 }}
        >
          {dict.checkout.next} →
        </button>
      </div>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </svg>
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
  const selectedPaymentLink = PAYMENT_METHODS.find((m) => m.key === payment)?.link ?? null;
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

      {payment === 'WHATSAPP' && selectedPaymentLink && (
        <a
          href={selectedPaymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ background: '#075e54', alignSelf: 'flex-start', gap: 10 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.5 3.5A11 11 0 0 0 3.6 17l-1.1 4 4.1-1.1A11 11 0 1 0 20.5 3.5Zm-8.5 18a9 9 0 0 1-4.6-1.3l-.3-.2-2.4.6.6-2.3-.2-.4A9 9 0 1 1 12 21.5Zm5-6.7c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.4.2-.6.1a7.4 7.4 0 0 1-3.6-3.2c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.6l-.9-2.1c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3a10.3 10.3 0 0 0 4 3.5 13.5 13.5 0 0 0 1.4.5c.6.2 1.1.2 1.5.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.2-1.2 0-.1-.3-.2-.6-.3Z"/>
          </svg>
          Ouvrir WhatsApp →
        </a>
      )}

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
        <div className="col" style={{ gap: 2, flex: 1 }}>
          <span className="caption">PAIEMENT VIA</span>
          <strong>
            {payment.name}{payment.link ? '' : ` · ${payment.number}`}
          </strong>
        </div>
        {payment.link && (
          <a
            href={payment.link}
            target="_blank"
            rel="noopener noreferrer"
            className="caption"
            style={{
              padding: '10px 14px', background: '#075e54', color: 'var(--cream)',
              letterSpacing: '0.12em', minHeight: 44,
              display: 'inline-flex', alignItems: 'center',
            }}
          >
            OUVRIR →
          </a>
        )}
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

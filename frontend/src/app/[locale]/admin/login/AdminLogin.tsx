'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { Logo } from '@/components/ui/Logo';
import type { Locale } from '@/lib/i18n';

const ADMIN_EMAIL = 'admin@amperfume.mr';
const ADMIN_PASSWORD = 'Admin@2024';

interface AdminLoginProps {
  locale: Locale;
}

export function AdminLogin({ locale }: AdminLoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('adminAuthenticated') === 'true') {
      router.replace(`/${locale}/admin`);
    }
  }, [router, locale]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem('adminAuthenticated', 'true');
      router.replace(`/${locale}/admin`);
      return;
    }

    setSubmitting(false);
    setError('Identifiants invalides. Vérifiez votre e‑mail et mot de passe.');
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--ivory)',
          padding: 'clamp(28px, 6vw, 48px)',
          border: '1px solid var(--hairline)',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Logo size={26} />
          <div style={{ textAlign: 'center' }}>
            <span className="caption" style={{ color: 'var(--accent)' }}>BACKOFFICE</span>
            <h1 className="display italic" style={{ fontSize: 32, fontWeight: 300, marginTop: 6 }}>
              Connexion administrateur
            </h1>
            <p className="small" style={{ marginTop: 10, color: 'var(--warm-gray)' }}>
              Accès réservé à l&apos;équipe A&amp;M Perfume.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="field">
            <label htmlFor="admin-email">E‑mail</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@amperfume.mr"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Mot de passe</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: 'rgba(160,69,69,0.08)',
                borderInlineStart: '3px solid var(--error)',
                padding: '12px 14px',
                color: 'var(--error)',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
            style={{ height: 52, marginTop: 4 }}
          >
            {submitting ? 'Connexion…' : 'Se connecter →'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link href={`/${locale}`} className="caption" style={{ color: 'var(--warm-gray)' }}>
            ← Retour à la boutique
          </Link>
        </div>
      </div>

      <p className="caption" style={{ marginTop: 28, color: 'var(--warm-gray)', textAlign: 'center' }}>
        A&amp;M PERFUME · NOUAKCHOTT · MMXXIV
      </p>
    </main>
  );
}

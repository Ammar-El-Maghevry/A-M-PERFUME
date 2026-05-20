import type { Product, Category } from './data';

export const locales = ['fr', 'ar', 'en'] as const;
export const defaultLocale = 'fr' as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function productName(p: Product, lang: Locale): string {
  return lang === 'ar' ? p.nameAr : lang === 'en' ? p.nameEn : p.nameFr;
}

export function categoryName(c: Category, lang: Locale): string {
  return c[lang];
}

export function formatPrice(n: number, lang: Locale = 'fr'): string {
  return n.toLocaleString(lang === 'ar' ? 'ar-MR' : 'fr-FR');
}

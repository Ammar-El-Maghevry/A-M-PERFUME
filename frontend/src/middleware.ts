import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales, isLocale } from './lib/i18n';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split('/')[1];
  if (isLocale(first)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

export const supportedLocales = locales;

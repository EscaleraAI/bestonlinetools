import { NextRequest, NextResponse } from 'next/server';
import { i18n, type Locale } from '@/lib/i18n';

/**
 * Paths that should NOT be processed by the i18n proxy.
 */
const IGNORED_PATHS = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap',
];

function shouldIgnore(pathname: string): boolean {
  return IGNORED_PATHS.some((p) => pathname.startsWith(p)) || pathname.includes('.');
}

/**
 * Extract locale from the first path segment.
 * Returns null if the segment isn't a known locale.
 */
function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  const first = segments[0];
  if ((i18n.locales as readonly string[]).includes(first) && first !== i18n.defaultLocale) {
    return first as Locale;
  }
  return null;
}

/**
 * Parse Accept-Language header to find best matching locale.
 */
function getPreferredLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get('accept-language') || '';
  const langs = acceptLang.split(',').map((part) => {
    const [lang] = part.trim().split(';');
    return lang.split('-')[0].toLowerCase();
  });

  for (const lang of langs) {
    if ((i18n.locales as readonly string[]).includes(lang)) {
      return lang as Locale;
    }
  }
  return i18n.defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, etc.
  if (shouldIgnore(pathname)) {
    return NextResponse.next();
  }

  // Read locale cookie (set when user manually switches language)
  const cookieLocale = request.cookies.get('locale')?.value as Locale | undefined;

  // Check if path already has a non-default locale prefix
  const pathLocale = getLocaleFromPath(pathname);

  if (pathLocale) {
    // URL already has locale prefix — persist it in cookie and serve
    const response = NextResponse.next();
    response.cookies.set('locale', pathLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // No locale prefix in URL — check cookie or Accept-Language
  if (cookieLocale && (i18n.locales as readonly string[]).includes(cookieLocale) && cookieLocale !== i18n.defaultLocale) {
    // User previously chose a non-default locale → redirect
    const url = request.nextUrl.clone();
    url.pathname = `/${cookieLocale}${pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set('locale', cookieLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // Root "/" with no cookie → check Accept-Language
  if (pathname === '/') {
    const preferred = getPreferredLocale(request);
    if (preferred !== i18n.defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${preferred}`;
      return NextResponse.redirect(url);
    }
  }

  // English content or any non-locale path → serve as-is, persist default
  const response = NextResponse.next();
  response.cookies.set('locale', i18n.defaultLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

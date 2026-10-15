import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Every other page reachable by this proxy's matcher is an admin page —
  // route groups like (admin) never appear in the actual pathname, so this
  // must not try to match on '/(admin)'.
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

import { NextRequest, NextResponse } from 'next/server';
import { checkSession, SessionResponse } from '@/lib/api/serverApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivate = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
  const isAuth = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Якщо немає accessToken, але є refreshToken
  if (!accessToken && refreshToken) {
    const session: SessionResponse | null = await checkSession();

    if (!session) {
      if (isPrivate) return NextResponse.redirect(new URL('/sign-in', request.url));
      return NextResponse.next();
    }

    const response = NextResponse.next();

    if (session.accessToken) response.cookies.set('accessToken', session.accessToken, { path: '/' });
    if (session.refreshToken) response.cookies.set('refreshToken', session.refreshToken, { path: '/' });

    if (isPrivate) return NextResponse.redirect(new URL('/profile', request.url));
    return response;
  }

  // Якщо немає токена та маршрут приватний
  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо користувач авторизований, але зайшов на auth сторінку
  if (accessToken && isAuth) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}
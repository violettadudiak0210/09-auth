import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivate = PRIVATE_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  const isAuth = AUTH_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  
  if (!accessToken && refreshToken) {
    const ok = await checkSession();

   
    if (!ok && isPrivate) {
      return NextResponse.redirect(
        new URL('/sign-in', request.url)
      );
    }

   
    return NextResponse.next();
  }

  if (!accessToken && isPrivate) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url)
    );
  }

  if (accessToken && isAuth) {
    return NextResponse.redirect(
      new URL('/profile', request.url)
    );
  }

  
  return NextResponse.next();
}
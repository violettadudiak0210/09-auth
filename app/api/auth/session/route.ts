import { NextResponse } from 'next/server';
import { api } from '@/lib/api/axios';
import { parse } from 'cookie';

export async function GET(req: Request) {
  try {
    const response = await api.get('/auth/session');
    const setCookie = response.headers['set-cookie'];
    const nextRes = NextResponse.json({ success: true });

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        if (parsed.accessToken)
          nextRes.cookies.set('accessToken', parsed.accessToken, { path: '/' });
        if (parsed.refreshToken)
          nextRes.cookies.set('refreshToken', parsed.refreshToken, { path: '/' });
      }
    }

    return nextRes;
  } catch {
    return NextResponse.json({ success: false });
  }
}
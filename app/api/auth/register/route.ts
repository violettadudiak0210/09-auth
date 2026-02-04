import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api/axios';
import { parse } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('/auth/register', body);

    const setCookie = apiRes.headers['set-cookie'];
    const response = NextResponse.json(apiRes.data, { status: apiRes.status });

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        if (parsed.accessToken)
          response.cookies.set('accessToken', parsed.accessToken, { path: '/' });
        if (parsed.refreshToken)
          response.cookies.set('refreshToken', parsed.refreshToken, { path: '/' });
      }
    }

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}

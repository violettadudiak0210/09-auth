import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    // Отримуємо JSON із запиту
    const body = await req.json();

    // Перевіряємо, що обов'язкові поля є
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Надсилаємо запит на backend
    const apiRes = await api.post('/auth/register', body, {
      withCredentials: true,
    });

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path || '/',
          maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
        };

        if (parsed.accessToken)
          cookieStore.set('accessToken', parsed.accessToken, options);
        if (parsed.refreshToken)
          cookieStore.set('refreshToken', parsed.refreshToken, options);
      }
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (err) {
    if (isAxiosError(err)) {
      logErrorResponse(err.response?.data);
      return NextResponse.json(
        { error: err.message, response: err.response?.data },
        { status: err.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (err as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

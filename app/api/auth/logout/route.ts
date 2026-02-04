import { NextResponse } from 'next/server';
import { api } from '@/lib/api/axios';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    await api.post('/auth/logout'); // повідомлення бекенду
    return response;
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
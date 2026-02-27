import { NextResponse } from 'next/server';
import { handleOptions, withCors } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST() {
  const response = withCors(NextResponse.json({ message: 'Sesión cerrada' }, { status: 200 }));
  const isProduction = process.env.NODE_ENV === 'production';
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
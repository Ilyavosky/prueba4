import { NextResponse } from 'next/server';
import { env } from './env.server';

// Limpieza para evitar errores de preflight si el usuario pone '/' al final
const rawOrigin = env.FRONTEND_URL || 'http://localhost:3000';
const ALLOWED_ORIGIN = rawOrigin.replace(/\/$/, '');

export const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
};

/** Respond to OPTIONS preflight requests */
export function handleOptions() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** Add CORS headers to any NextResponse */
export function withCors(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

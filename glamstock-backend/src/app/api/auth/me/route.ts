import { NextResponse } from 'next/server';
import { withAuth } from '@/modules/auth/middleware/jwt.middleware';
import { UsuariosRepository } from '@/modules/auth/repositories/usuarios.repository';
import { isAppError } from '@/lib/errors/app-error';
import { handleOptions, withCors } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export const GET = withAuth(async (_req, payload) => {
  try {
    const usuario = await UsuariosRepository.findById(payload.userId);

    if (!usuario) {
      return withCors(NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 }));
    }

    return withCors(NextResponse.json({ usuario }, { status: 200 }));
  } catch (error) {
    if (isAppError(error)) {
      return withCors(NextResponse.json({ error: error.message }, { status: error.statusCode }));
    }
    return withCors(NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 }));
  }
});
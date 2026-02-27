import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/services/auth.service';
import { loginSchema } from '@/modules/auth/schemas/auth.schema';
import { isAppError } from '@/lib/errors/app-error';
import { handleOptions, withCors } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const resultado = loginSchema.safeParse(body);

    if (!resultado.success) {
      return withCors(NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          detalles: resultado.error.issues.map((issue) => ({
            campo: issue.path.join('.'),
            mensaje: issue.message,
          })),
        },
        { status: 400 }
      ));
    }

    const { email, password } = resultado.data;
    const loginResponse = await AuthService.login(email, password);

    const response = withCors(NextResponse.json(
      { 
        user: loginResponse.usuario,
        message: 'Inicio de sesión exitoso'
      }, 
      { status: 200 }
    ));

    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('auth_token', loginResponse.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax', // 'none' needed for Vercel <-> Railway cookies
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;

  } catch (error) {
    if (isAppError(error)) {
      return withCors(NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      ));
    }

    console.error('Error inesperado en POST /api/auth/login:', error);
    return withCors(NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    ));
  }
}

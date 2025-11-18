// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Routes protégées
  const isProfessorRoute = pathname.startsWith('/professor');
  const isStudentRoute = pathname.startsWith('/student');
  const isAssistantRoute = pathname.startsWith('/assistant');
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isProfessorRoute || isStudentRoute || isAssistantRoute || isAdminRoute) {
    if (!token) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Vérifier le user dans localStorage côté client
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/professor/:path*', '/student/:path*', '/assistant/:path*', '/admin/:path*'],
};
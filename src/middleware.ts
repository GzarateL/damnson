import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as string | undefined;
  
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isPromoterRoute = req.nextUrl.pathname.startsWith('/promoter');

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (userRole === 'ADMIN') return NextResponse.redirect(new URL('/admin', req.nextUrl));
      if (userRole === 'PROMOTOR') return NextResponse.redirect(new URL('/promoter', req.nextUrl));
      if (userRole === 'ASISTENTE') return NextResponse.redirect(new URL('/user', req.nextUrl));
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return NextResponse.next();
  }

  const isUserRoute = req.nextUrl.pathname.startsWith('/user');

  if (!isLoggedIn && (isAdminRoute || isPromoterRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isLoggedIn && isAdminRoute && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (isLoggedIn && isPromoterRoute && userRole !== 'PROMOTOR' && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
})

// Especificar en qué rutas debe correr el middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

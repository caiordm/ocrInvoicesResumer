import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");

  const protectedRoutes = ["/dashboard", "/perfil"]; // Rotas protegidas
  const authRoutes = ["/login", "/register"]; // Rotas que não devem ser bloqueadas

  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url)); // Se logado, manda pro dashboard
  }

  return NextResponse.next();
}

// Aplica o middleware apenas em rotas específicas
export const config = {
  matcher: ["/dashboard/:path*", "/perfil/:path*"],
};

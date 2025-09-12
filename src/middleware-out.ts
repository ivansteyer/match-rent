

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Bloquea si no hay sesión
  if (url.pathname.startsWith("/tenant") || url.pathname.startsWith("/landlord")) {
    if (!token) return NextResponse.redirect(new URL("/", req.url));
  }

  // Autorización por rol
  if (url.pathname.startsWith("/tenant") && token?.role !== "TENANT" && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (url.pathname.startsWith("/landlord") && token?.role !== "LANDLORD" && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
export const config = { matcher: ["/tenant/:path*", "/landlord/:path*"] };// */
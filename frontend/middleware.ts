import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = new Set(["/login", "/register"]);

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  if (!token && !publicRoutes.has(pathname)) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && publicRoutes.has(pathname)) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"]
};

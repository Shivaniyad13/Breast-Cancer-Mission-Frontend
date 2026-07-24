import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", nextUrl.pathname);
  const isLoggedIn = !!req.auth;

  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAdmin = nextUrl.pathname.startsWith("/admin");

  if (isDashboard || isAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    const role = req.auth?.user?.role;
    
    // Check if on Admin panel and user is not admin
    if (isAdmin && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl)); 
    }

    // Role-specific dashboard route protections
    if (nextUrl.pathname.startsWith("/dashboard/patient") && role !== "PATIENT" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    if (nextUrl.pathname.startsWith("/dashboard/ngo") && role !== "NGO_REP" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    if (nextUrl.pathname.startsWith("/dashboard/doctor") && role !== "DOCTOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    if (nextUrl.pathname.startsWith("/dashboard/volunteer") && role !== "VOLUNTEER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

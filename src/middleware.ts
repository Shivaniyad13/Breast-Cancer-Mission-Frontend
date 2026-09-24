import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", nextUrl.pathname);

  const tokenCookie = req.cookies.get("token")?.value;
  let isLoggedIn = false;
  let role: string | null = null;

  if (tokenCookie) {
    try {
      const parts = tokenCookie.split(".");
      if (parts.length === 3) {
        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(payloadBase64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        if (decoded && (decoded.id || decoded.email)) {
          isLoggedIn = true;
          role = decoded.role || null;
        }
      }
    } catch {
      isLoggedIn = false;
    }
  }

  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAdmin = nextUrl.pathname.startsWith("/admin");

  if (isDashboard || isAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

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
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

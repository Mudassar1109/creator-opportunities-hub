/**
 * Next.js Proxy — Auth session refresh & route protection
 *
 * (Next.js 16 renamed "middleware" → "proxy". Same API, new name.)
 *
 * Runs on every matching request to:
 *   1. Refresh the Supabase auth session (token refresh → cookies)
 *   2. Redirect unauthenticated users from protected routes to /login
 *   3. Redirect logged-in users away from /login and /signup
 *
 * IMPORTANT: Proxy creates its own Supabase client using NextRequest/
 * NextResponse cookies — NOT lib/supabase/server (uses next/headers,
 * unavailable in proxy context).
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/admin"];

// Routes that authenticated users should be redirected away from
const AUTH_ROUTES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Validate env vars — fail fast with a clear message
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  // Create a response we can modify with cookies/headers
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Set cookies on the request (for downstream server components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Create a fresh response with the updated request
          supabaseResponse = NextResponse.next({ request });

          // Set cookies and cache-control headers on the response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // Refresh the session — writes updated cookies via setAll above
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Protect: redirect unauthenticated users to /login ─────
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Admin gate: dual validation (role + email) ────────────
  if (pathname.startsWith("/admin") && user) {
    if (!isAdmin(user)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ── Auth pages: redirect logged-in users ──────────────────
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute && user) {
    const redirectUrl = isAdmin(user) ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return supabaseResponse;
}

/**
 * Only run proxy on pages — skip static assets, images,
 * API routes, and Next.js internals.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

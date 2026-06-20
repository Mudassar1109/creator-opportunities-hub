/**
 * OAuth & Email Verification Callback
 *
 * Handles the redirect from Supabase after:
 *   1. Google OAuth sign-in
 *   2. Email magic-link / email verification
 *
 * Supabase sends a `code` query parameter that we exchange for a session.
 * On success → redirect to /dashboard
 * On error   → redirect to /login with error message
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect_to") || "/dashboard";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // If Supabase returned an error (e.g. user denied OAuth)
  if (error) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", errorDescription || error);
    return NextResponse.redirect(loginUrl);
  }

  // Exchange the auth code for a session
  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const loginUrl = new URL("/login", requestUrl.origin);
      loginUrl.searchParams.set("error", exchangeError.message);
      return NextResponse.redirect(loginUrl);
    }

    // Successfully authenticated → redirect to dashboard
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
  }

  // No code and no error — likely a direct visit to this URL
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}

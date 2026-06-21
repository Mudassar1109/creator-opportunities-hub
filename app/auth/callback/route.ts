/**
 * OAuth & Email Verification Callback
 *
 * Handles the redirect from Supabase after:
 *   1. Google OAuth sign-in
 *   2. Email magic-link / email verification
 *
 * Supabase sends a `code` query parameter that we exchange for a session.
 * On success → redirect based on user role (creator → /dashboard, brand → /dashboard/opportunities)
 * On error   → redirect to /login with error message
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const roleParam = requestUrl.searchParams.get("role") as "creator" | "brand" | null;
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

    // Get user profile to determine redirect based on role
    const { data: { user } } = await supabase.auth.getUser();
    let redirectTo = "/dashboard";

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile) {
        // Redirect based on role
        if (profile.role === "brand") {
          redirectTo = "/dashboard/opportunities";
        } else {
          redirectTo = "/dashboard";
        }
      } else if (roleParam) {
        // If no profile yet but role was passed, use that
        redirectTo = roleParam === "brand" ? "/dashboard/opportunities" : "/dashboard";
      }
    }

    // Successfully authenticated → redirect based on role
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
  }

  // No code and no error — likely a direct visit to this URL
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}

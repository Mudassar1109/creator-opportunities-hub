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
        .select("role, created_at")
        .eq("id", user.id)
        .single();

      console.log("[Auth Callback] User ID:", user.id);
      console.log("[Auth Callback] Role from URL:", roleParam);
      console.log("[Auth Callback] User metadata role:", user.user_metadata?.role);
      console.log("[Auth Callback] Profile:", profile);

      // Determine the effective role from multiple sources (priority order):
      // 1. roleParam from callback URL (OAuth redirect)
      // 2. User metadata role (set during signUp)
      // 3. Existing profile role (already in database)
      // 4. Default: "creator"
      const effectiveRole =
        roleParam ??
        (user.user_metadata?.role as "creator" | "brand" | undefined) ??
        (profile?.role as "creator" | "brand" | undefined) ??
        "creator";

      console.log("[Auth Callback] Effective role:", effectiveRole);

      if (profile) {
        // Profile exists — if role doesn't match, update it
        const profileRole = profile.role as "creator" | "brand";
        if (profileRole !== effectiveRole) {
          console.log(`[Auth Callback] Role mismatch: profile=${profileRole}, effective=${effectiveRole}. Updating profile.`);
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: effectiveRole })
            .eq("id", user.id);

          if (updateError) {
            console.error("[Auth Callback] Failed to update profile role:", updateError);
          } else {
            console.log("[Auth Callback] Successfully updated profile role to:", effectiveRole);
          }
        } else {
          console.log("[Auth Callback] Role matches, no update needed:", profileRole);
        }
      } else {
        // No profile yet — this shouldn't happen (trigger creates it),
        // but handle it just in case
        console.log("[Auth Callback] No profile found, creating with role:", effectiveRole);
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: effectiveRole })
          .eq("id", user.id);

        if (updateError) {
          console.error("[Auth Callback] Failed to set profile role:", updateError);
        }
      }

      // Redirect based on effective role
      redirectTo = effectiveRole === "brand" ? "/dashboard/opportunities" : "/dashboard";
      console.log("[Auth Callback] Redirecting to:", redirectTo);
    }

    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
  }

  // No code and no error — likely a direct visit to this URL
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}

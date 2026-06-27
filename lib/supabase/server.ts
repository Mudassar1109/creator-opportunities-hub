/**
 * Supabase server client for Creator Opportunities Hub
 *
 * Use in: Server Components, Server Actions, Route Handlers
 * Creates a fresh client per request (required for SSR safety).
 *
 * Usage:
 *   import { createClient } from "@/lib/supabase/server";
 *   const supabase = await createClient();
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/admin";
import type { Database } from "@/lib/database.types";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copy .env.local.example to .env.local and fill in your Supabase project values."
    );
  }

  return { url, key };
}

export async function createClient() {
  const { url, key } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll is called from a Server Component where cookies
          // cannot be set. This is expected — the middleware handles
          // session refresh instead.
        }
      },
    },
  });
}

// ─── Convenience: get current user (server-side) ────────────

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}

// ─── Convenience: get current session (server-side) ─────────

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

// ─── Convenience: get user with profile role (server-side) ──

export async function getUserWithRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    user,
    role: (profile?.role as "creator" | "brand") ?? "creator",
  };
}

// ─── Convenience: get current user only if admin ──────────
// Uses dual validation from lib/admin.ts (role + env email whitelist).
// Future: will also verify 2FA status, session TTL, and login notification.

export async function getAdminUser() {
  const user = await getUser();
  if (!user || !isAdmin(user)) return null;

  const adminRole = user.app_metadata?.admin_role as string;
  return { user, adminRole };
}

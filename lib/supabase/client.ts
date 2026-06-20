/**
 * Supabase browser client for Creator Opportunities Hub
 *
 * Use in: Client Components ("use client")
 * Returns a singleton so auth state is shared across the app.
 *
 * Usage:
 *   import { createBrowserClient } from "@/lib/supabase/client";
 *   const supabase = createBrowserClient();
 */

import { createBrowserClient } from "@supabase/ssr";
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

export function createClient() {
  const { url, key } = getSupabaseEnv();

  return createBrowserClient<Database>(url, key, {
    isSingleton: true,
  });
}

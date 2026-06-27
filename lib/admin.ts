import type { User } from "@supabase/supabase-js";

// ─── Allowed admin roles ─────────────────────────────────────
// Only these values in app_metadata.admin_role are accepted.
export const ADMIN_ALLOWED_ROLES = ["super_admin", "admin"] as const;

// ─── Email whitelist (from env) ──────────────────────────────
// Reads ADMIN_EMAIL_WHITELIST from environment. Format:
//   ADMIN_EMAIL_WHITELIST=admin@example.com,super@example.com
// If unset or empty, everyone is rejected (deny by default).
// In development, a clear warning is printed to stdout.
function getAdminEmailWhitelist(): string[] {
  const raw = process.env.ADMIN_EMAIL_WHITELIST ?? "";
  if (!raw && process.env.NODE_ENV !== "production") {
    console.warn(
      "[ADMIN] ADMIN_EMAIL_WHITELIST is not configured. " +
      "All admin access is denied by default. " +
      "Set ADMIN_EMAIL_WHITELIST in .env.local to grant access. " +
      "Example: ADMIN_EMAIL_WHITELIST=admin@example.com"
    );
  }
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// ─── Role validator ──────────────────────────────────────────
function getAdminRole(user: User | null): string | null {
  if (!user) return null;
  const role = user.app_metadata?.admin_role as string | undefined;
  if (!role) return null;
  if (!ADMIN_ALLOWED_ROLES.includes(role as typeof ADMIN_ALLOWED_ROLES[number])) return null;
  return role;
}

// ─── Email validator ─────────────────────────────────────────
function isEmailWhitelisted(email: string | undefined): boolean {
  if (!email) return false;
  const whitelist = getAdminEmailWhitelist();
  if (whitelist.length === 0) return false;
  return whitelist.includes(email.toLowerCase());
}

// ─── Public helpers ──────────────────────────────────────────

/**
 * Returns true when BOTH conditions hold:
 *   1. user has app_metadata.admin_role in ["super_admin", "admin"]
 *   2. user.email is in the ADMIN_EMAIL_WHITELIST environment variable
 *
 * Pure sync function — safe to call from proxy.ts, server actions,
 * server components, or route handlers.
 */
export function isAdmin(user: User | null): boolean {
  const role = getAdminRole(user);
  if (!role) return false;
  return isEmailWhitelisted(user?.email);
}

/**
 * Strict superset of isAdmin — additionally requires
 * admin_role === "super_admin".
 */
export function isSuperAdmin(user: User | null): boolean {
  if (!user) return false;
  const role = getAdminRole(user);
  if (role !== "super_admin") return false;
  return isEmailWhitelisted(user.email);
}

// ═══════════════════════════════════════════════════════════════
// FUTURE ARCHITECTURE — NOT IMPLEMENTED YET
// These interfaces document the extension points for upcoming
// phases. They are type-only and have zero runtime cost.
// ═══════════════════════════════════════════════════════════════

/**
 * Phase 8+: Two-Factor Authentication config.
 *
 * Integration points:
 *   proxy.ts              — check 2FA status before /admin grant
 *   lib/supabase/server   — getAdminUser() verifies 2FA is complete
 *   app/admin/settings    — admin UI to toggle requirements
 *   supabase/migrations/  — stores config in admin_config table
 */
export interface TwoFactorConfig {
  enabled: boolean;
  /** When true, ALL admins must have 2FA enrolled. */
  required: boolean;
  /** Days before 2FA becomes mandatory after first admin login. */
  gracePeriodDays: number;
}

/**
 * Phase 10+: Audit log entry shape.
 *
 * Integration points:
 *   every admin server action   — calls logAdminAction() on mutation
 *   supabase/migrations/        — audit_logs table
 *   app/admin/audit             — searchable audit log viewer
 */
export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: "user" | "brand" | "opportunity" | "application" | "category" | "setting";
  targetId: string;
  changes: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

/**
 * Phase 8+: Session security config.
 *
 * Integration points:
 *   proxy.ts               — enforce shorter TTL on /admin/* responses
 *   getAdminUser()         — checks session age against this config
 *   app/admin/settings     — admin UI to configure values
 */
export interface SessionSecurityConfig {
  /** Admin session auto-expires after N minutes. */
  adminSessionTTLMinutes: number;
  /** Auto-logout after N minutes of inactivity. */
  idleTimeoutMinutes: number;
}

/**
 * Phase 8+: Login notification config.
 *
 * Integration points:
 *   auth/callback/route.ts  — send email on admin login
 *   lib/actions/admin/      — notify on failed admin login attempt
 *   app/admin/settings      — admin UI to toggle
 */
export interface LoginNotificationConfig {
  enabled: boolean;
  /** Email address(es) to notify on admin login. */
  notifyEmails: string[];
  /** Also notify on failed login attempts. */
  notifyOnFailedAttempts: boolean;
}

/**
 * Phase 8+: Full admin configuration (stored in DB).
 * Aggregates all future config interfaces.
 */
export interface AdminConfiguration {
  twoFactor: TwoFactorConfig;
  session: SessionSecurityConfig;
  loginNotifications: LoginNotificationConfig;
  /** When true, non-admin users see a maintenance page. */
  maintenanceMode: boolean;
}

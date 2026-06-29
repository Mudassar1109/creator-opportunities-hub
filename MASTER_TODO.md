# CreatorHub — MASTER TODO (Strictly Existing Codebase)

> **Rule**: Only files that exist in the project. No new pages, features, DB tables, themes, or architecture.
> **Status Key**: ✅ Completed | ⚠️ Partial | ❌ Not Started | 🚫 Not Required

---

## 🔴 CRITICAL — Launch Blockers

*Security vulnerabilities, broken functionality, auth issues.*

### 1. Auth Guards — Admin Server Actions

16 of 17 exported functions in `lib/actions/admin/` lack any authentication check.

| File | Function | Status | Evidence |
|------|----------|--------|----------|
| `lib/actions/admin/users.ts:22` | `getAdminUsers()` | ⚠️ Partial | No `getUser()` or `getAdminUser()` call. Line 28 starts DB query directly. |
| `lib/actions/admin/user-details.ts` | `getAdminUserById()` | ⚠️ Partial | No auth check before query. |
| `lib/actions/admin/settings.ts:90` | `getAdminSettings()` | ⚠️ Partial | Uses `createServiceClient()` directly at line 92. No user check. (`saveAdminSettings()` at line 113 DOES have `getAdminUser()` guard.) |
| `lib/actions/admin/reports.ts:26` | `getAdminReports()` | ⚠️ Partial | Line 36 uses `createServiceClient()` with no auth check. |
| `lib/actions/admin/opportunity-details.ts` | `getAdminOpportunityById()` | ⚠️ Partial | No auth check. |
| `lib/actions/admin/opportunities.ts` | `getAdminOpportunities()` | ⚠️ Partial | No auth check. |
| `lib/actions/admin/notifications.ts:87` | `getAdminNotifications()` | ⚠️ Partial | Mock data, no auth. |
| `lib/actions/admin/notifications.ts:149` | `getAdminNotificationSummary()` | ⚠️ Partial | Mock data, no auth. |
| `lib/actions/admin/brands.ts` | `getAdminBrands()` | ⚠️ Partial | No auth check. |
| `lib/actions/admin/brand-details.ts` | `getAdminBrandById()` | ⚠️ Partial | No auth check. |
| `lib/actions/admin/applications.ts` | `getAdminApplications()` | ⚠️ Partial | No auth check. |
| `lib/actions/admin/application-details.ts` | `getAdminApplicationById()` | ⚠️ Partial | No auth check. |
| `lib/actions/admin/analytics.ts` | `getAdminAnalytics()` | ⚠️ Partial | No auth check. |
| `lib/actions/admin/activity.ts:127` | `getAdminActivity()` | ⚠️ Partial | Mock data, no auth. |
| `lib/actions/admin/activity.ts:201` | `getAdminActivityById()` | ⚠️ Partial | Mock data, no auth. |
| `lib/actions/admin/activity.ts:205` | `getAdminActivitySummary()` | ⚠️ Partial | Mock data, no auth. |

**Fix**: Add `getAdminUser()` guard at the top of each function (same pattern as `saveAdminSettings` at `lib/actions/admin/settings.ts:113`).

---

### 2. `/api/diagnose` — No Auth Guard

| File | Status | Evidence |
|------|--------|----------|
| `app/api/diagnose/route.ts` | ⚠️ Partial | Line 13 creates supabase client. No auth check. Line 4 comment says "DELETE THIS FILE after debugging." Runs diagnostic queries against ALL DB tables and returns results. |

**Fix**: Remove file in production, or add `getAdminUser()` guard.

---

### 3. Login Redirect Ignored

| File | Status | Evidence |
|------|--------|----------|
| `app/login/page.tsx:96` | ⚠️ Partial | On success: `router.push("/")` — always goes to home. Never reads `searchParams` for `?redirect=`. |
| `app/auth/callback/route.ts:147` | ⚠️ Partial | Line 147 hardcodes `redirectTo = effectiveRole === "brand" ? "/dashboard/opportunities" : "/dashboard"`. Reads `code`, `ref`, `role`, `error` from searchParams (lines 18-22) but NOT `redirect`. |

**Evidence of intent**: Three other files already pass `?redirect=` to login:
- `app/dashboard/company/page.tsx:15` → `redirect("/login?redirect=/dashboard/company")`
- `app/opportunities/[slug]/apply-button.tsx:23` → `router.push(\`/login?redirect=/opportunities/${slug}\`)`
- `app/dashboard/profile/page.tsx:20` → `redirect("/login?redirect=/dashboard/profile")`

All silently dropped because login/auth-callback ignore the param.

---

### 4. `/ref/:code` Page Broken by next.config.ts Redirect

| File | Status | Evidence |
|------|--------|----------|
| `next.config.ts:23-26` | ⚠️ Partial | Lines 23-26: `source: "/ref/:code"` redirects to `/dashboard`. This fires BEFORE `app/ref/[code]/page.tsx` ever renders. |
| `app/ref/[code]/page.tsx` | ⚠️ Partial | Fully built page (272 lines) with referral landing UI, stats, CTA buttons. But unreachable due to redirect. |

**Also**: Lines 10-20 redirect `/dashboard/referrals` to `/dashboard`. Page at `app/dashboard/referrals/page.tsx` exists (7 lines, just calls `redirect("/dashboard")`).

---

### 5. SaveButton — UI Only, No Backend

| File | Status | Evidence |
|------|--------|----------|
| `components/save-button.tsx:11` | ⚠️ Partial | `onClick={() => setSaved((prev) => !prev)}` — only toggles local React `useState`. No `onSave` prop, no API call, no localStorage, no persistence of any kind. Bookmark icon visually toggles but nothing is saved anywhere. |

---

### 6. Account Delete — Insecure Client-Side Admin API Call

| File | Status | Evidence |
|------|--------|----------|
| `app/dashboard/settings/settings-form.tsx:131` | ⚠️ Partial | `await supabase.auth.admin.deleteUser(user.id)` called from client component. `supabase.auth.admin.*` requires `service_role` key — exposing it client-side is a security risk. Should be moved to a server action. |

---

## 🟡 IMPORTANT

*Pages/features that work but have incomplete sections.*

### 7. Admin Analytics — 2 of 4 Charts Are Placeholders

| File | Status | Evidence |
|------|--------|----------|
| `app/admin/analytics/page.tsx:108-109` | ⚠️ Partial | Lines 108-109: `<ChartPlaceholder title="Platform Distribution" />` and `<ChartPlaceholder title="Revenue Overview" />` — no `children` prop, so `chart-placeholder.tsx:19-38` renders empty dashed-border div with "Chart will render here" text. |
| `components/admin/analytics/chart-placeholder.tsx` | ✅ Complete | Component itself is fine (supports optional `children`). |
| `app/admin/analytics/page.tsx:90-95` | ✅ Complete | First 2 charts (User Growth, Application Growth) have real `BarChart` children. |

---

### 8. Admin Notifications & Activity — Mock Data

| File | Status | Evidence |
|------|--------|----------|
| `lib/actions/admin/notifications.ts:62-83` | ⚠️ Partial | Lines 62-83: `generateNotifications()` creates 50 mock notifications with Math.random() — fake IDs, random types, random priorities, random read status. File has no DB queries. |
| `lib/actions/admin/activity.ts:95-123` | ⚠️ Partial | Lines 95-123: `generateActivity()` creates 250 mock entries with hardcoded admin names, random IPs, random dates. File has no DB queries. |

**Note**: UI filtering works (verified in `notification-list.tsx` and `activity-table.tsx`) — but data source is entirely mock.

---

## 🟢 OPTIONAL

*Existing pages that are complete but minimal, or non-critical improvements.*

### 9. Blog Page — Static Listing Only

| File | Status | Evidence |
|------|--------|----------|
| `app/blog/page.tsx` | ✅ Completed | Line 11-17: Shows "Coming Soon" topics in a grid. Static page, no DB integration. Fully functional as a static placeholder. |

---

### 10. Careers Page — Static Listing Only

| File | Status | Evidence |
|------|--------|----------|
| `app/careers/page.tsx` | ✅ Completed | Line 11-17: Shows company perks grid. Static page. Fully functional as a static placeholder. |

---

### 11. Admin Settings — 5 of 6 `getAdminSettings()` Functions Use Service Client Without Auth

This is the same auth issue as #1 but applies to settings specifically. Already covered above.

---

### 12. `/seed` Dev Page

| File | Status | Evidence |
|------|--------|----------|
| `app/seed/page.tsx` | ✅ Complete | Client component (55 lines) with seed button. Calls `/api/seed` which requires login (verified: `/api/seed/route.ts` has `getUser()` check at line 12). Functionally complete for dev use. |

---

## ✅ FULLY COMPLETED PAGES (No Action Needed)

All pages listed below are fully functional with no known issues:

| Route | File | Status |
|-------|------|--------|
| `/` (Homepage) | `app/page.tsx` | ✅ Completed |
| `/about` | `app/about/page.tsx` | ✅ Completed |
| `/contact` | `app/contact/page.tsx` | ✅ Completed |
| `/cookies` | `app/cookies/page.tsx` | ✅ Completed |
| `/privacy` | `app/privacy/page.tsx` | ✅ Completed |
| `/terms` | `app/terms/page.tsx` | ✅ Completed |
| `/signup` | `app/signup/page.tsx` | ✅ Completed |
| `/signup/role` | `app/signup/role/page.tsx` | ✅ Completed |
| `/opportunities` | `app/opportunities/page.tsx` | ✅ Completed |
| `/opportunities/[slug]` | `app/opportunities/[slug]/page.tsx` | ✅ Completed |
| `/dashboard` | `app/dashboard/page.tsx` | ✅ Completed |
| `/dashboard/settings` | `app/dashboard/settings/page.tsx` | ✅ Completed |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | ✅ Completed |
| `/dashboard/applications` | `app/dashboard/applications/page.tsx` | ✅ Completed |
| `/dashboard/applicants` | `app/dashboard/applicants/page.tsx` | ✅ Completed |
| `/dashboard/company` | `app/dashboard/company/page.tsx` | ✅ Completed |
| `/dashboard/opportunities` | `app/dashboard/opportunities/page.tsx` | ✅ Completed |
| `/dashboard/opportunities/new` | `app/dashboard/opportunities/new/page.tsx` | ✅ Completed |
| `/dashboard/opportunities/[id]` | `app/dashboard/opportunities/[id]/page.tsx` | ✅ Completed |
| `/dashboard/opportunities/[id]/applicants` | `app/dashboard/opportunities/[id]/applicants/page.tsx` | ✅ Completed |
| `/dashboard/messages` | `app/dashboard/messages/page.tsx` | ✅ Completed |
| `/dashboard/notifications` | `app/dashboard/notifications/page.tsx` | ✅ Completed |
| `/dashboard/referrals` | `app/dashboard/referrals/page.tsx` (redirects to /dashboard) | ✅ Completed |
| `/admin` | `app/admin/page.tsx` | ✅ Completed |
| `/admin/users` | `app/admin/users/page.tsx` | ✅ Completed |
| `/admin/users/[id]` | `app/admin/users/[id]/page.tsx` | ✅ Completed |
| `/admin/applications` | `app/admin/applications/page.tsx` | ✅ Completed |
| `/admin/applications/[id]` | `app/admin/applications/[id]/page.tsx` | ✅ Completed |
| `/admin/brands` | `app/admin/brands/page.tsx` | ✅ Completed |
| `/admin/brands/[id]` | `app/admin/brands/[id]/page.tsx` | ✅ Completed |
| `/admin/opportunities` | `app/admin/opportunities/page.tsx` | ✅ Completed |
| `/admin/opportunities/[id]` | `app/admin/opportunities/[id]/page.tsx` | ✅ Completed |
| `/admin/notifications` | `app/admin/notifications/page.tsx` | ✅ Completed |
| `/admin/activity` | `app/admin/activity/page.tsx` | ✅ Completed |
| `/admin/settings` | `app/admin/settings/page.tsx` | ✅ Completed |
| `/admin/reports` | `app/admin/reports/page.tsx` | ✅ Completed |
| `/creators/[id]` | `app/creators/[id]/page.tsx` | ✅ Completed |

---

## SUMMARY

| Category | Tasks | Files Affected |
|----------|-------|----------------|
| 🔴 Critical | 6 tasks | 17 files (16 admin actions + diagnose + login + auth-callback + next.config + save-button + settings-form) |
| 🟡 Important | 2 tasks | 3 files (analytics page + notification/activity mock data) |
| 🟢 Optional | 0 tasks | — (all remaining pages are ✅ Completed) |
| **Total** | **8 actionable tasks** | **20 files with issues** |

**Recommended Start**: Fix auth guards (#1) and `/api/diagnose` (#2) — everything else is secondary until the app is secure.

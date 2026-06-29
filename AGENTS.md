<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-system -->
# Premium White Theme — Global Design System

Apply this design language to ALL NEW pages. Do NOT redesign already completed pages (Phases 1–4) unless explicitly requested.

## Design Goal

Clean premium SaaS experience inspired by Apple, Linear, Stripe, Vercel, Notion.

## Color System

| Token | Hex | Tailwind |
|-------|-----|----------|
| Main BG | `#FFFFFF` | `bg-white` |
| Secondary BG | `#F8FAFC` | `bg-slate-50` |
| Card BG | `#FFFFFF` | `bg-white` |
| Border | `#E2E8F0` | `border-slate-200` |
| Primary | `#4F46E5` | `indigo-600` |
| Primary Hover | `#4338CA` | `indigo-700` |
| Secondary Blue | `#2563EB` | `blue-600` |
| Accent | `#06B6D4` | `cyan-500` |
| Heading | `#0F172A` | `text-slate-900` |
| Body | `#64748B` | `text-slate-500` |
| Muted | `#94A3B8` | `text-slate-400` |
| Success | `#22C55E` | `emerald-500` |
| Warning | `#F59E0B` | `amber-500` |
| Danger | `#EF4444` | `rose-500` |

## Rules

- 95% of interface stays **white**. Use Indigo/Blue only for buttons, links, active nav, icons, focus states, progress, selected items.
- Avoid large colorful backgrounds, heavy gradients, rainbow cards, glassmorphism (unless extremely subtle).

## Components

- **Cards**: `rounded-2xl border border-slate-200 bg-white shadow-sm` + hover lift
- **Primary Button**: `rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition`
- **Secondary Button**: `rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition`
- **Ghost Button**: `text-sm font-bold text-slate-500 hover:text-indigo-600 transition`
- **Input**: `rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`
- **Badge/Pill**: `inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold`
- **Icons**: Minimal, single color, stroke-based
- **Shadows**: Very soft only (`shadow-sm`, `shadow-md` max)
- **Animations**: Subtle, 150–200ms, no flashy
- **Hover lift**: `hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`
- **Status badges**:
  - Pending: `bg-amber-50 text-amber-700 border-amber-200`
  - Under review: `bg-blue-50 text-blue-700 border-blue-200`
  - Accepted: `bg-emerald-50 text-emerald-700 border-emerald-200`
  - Rejected: `bg-rose-50 text-rose-700 border-rose-200`
  - Withdrawn: `bg-slate-100 text-slate-600 border-slate-200`

## Do NOT redesign

- Phase 1: Homepage
- Phase 2: Opportunities Listing
- Phase 3: Opportunity Detail
- Phase 4: Creator Dashboard

These are completed. Only apply this theme to new pages.
<!-- END:design-system -->

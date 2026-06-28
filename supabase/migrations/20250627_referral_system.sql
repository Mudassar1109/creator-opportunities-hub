-- Referral System — tables, RLS, indexes, seed data

-- ── referral_codes ──────────────────────────────────────────

create table if not exists public.referral_codes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  code        text unique not null check (char_length(code) >= 4),
  is_active   boolean default true,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

comment on table public.referral_codes is 'Unique referral codes per user';

create index if not exists idx_referral_codes_user on public.referral_codes (user_id);
create index if not exists idx_referral_codes_code on public.referral_codes (code);

alter table public.referral_codes enable row level security;

create policy "ref_codes_select_own"
  on public.referral_codes for select
  using (auth.uid() = user_id);

create policy "ref_codes_insert_own"
  on public.referral_codes for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ── referrals ───────────────────────────────────────────────

create table if not exists public.referrals (
  id                  uuid primary key default gen_random_uuid(),
  referrer_id         uuid not null references auth.users(id) on delete cascade,
  referred_id         uuid not null references auth.users(id) on delete cascade,
  referral_code_id    uuid not null references public.referral_codes(id) on delete cascade,
  status              text not null default 'pending' check (status in ('pending', 'active', 'completed')),
  xp_earned           int default 0 check (xp_earned >= 0),
  completed_at        timestamptz,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null,
  constraint unique_referral unique (referrer_id, referred_id)
);

comment on table public.referrals is 'Referral tracking records';

create index if not exists idx_referrals_referrer  on public.referrals (referrer_id);
create index if not exists idx_referrals_referred  on public.referrals (referred_id);
create index if not exists idx_referrals_status    on public.referrals (status);

alter table public.referrals enable row level security;

create policy "referrals_select_own"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_id);

create policy "referrals_insert_auth"
  on public.referrals for insert
  to authenticated
  with check (auth.uid() = referrer_id);

-- ── xp_transactions ─────────────────────────────────────────

create table if not exists public.xp_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  xp_amount     int not null check (xp_amount != 0),
  reason        text not null,
  referral_id   uuid references public.referrals(id) on delete set null,
  created_at    timestamptz default now() not null
);

comment on table public.xp_transactions is 'XP earn/spend ledger for referral rewards';

create index if not exists idx_xp_transactions_user    on public.xp_transactions (user_id);
create index if not exists idx_xp_transactions_created on public.xp_transactions (created_at desc);

alter table public.xp_transactions enable row level security;

create policy "xp_select_own"
  on public.xp_transactions for select
  using (auth.uid() = user_id);

-- ── achievements ────────────────────────────────────────────

create table if not exists public.achievements (
  id            uuid primary key default gen_random_uuid(),
  name          text unique not null,
  description   text not null,
  icon          text default '',
  target_count  int not null check (target_count > 0),
  xp_reward     int not null default 0 check (xp_reward >= 0),
  created_at    timestamptz default now() not null
);

comment on table public.achievements is 'Achievement definitions';

alter table public.achievements enable row level security;

create policy "achievements_select_all"
  on public.achievements for select
  to authenticated
  using (true);

-- Seed achievements
insert into public.achievements (name, description, icon, target_count, xp_reward) values
  ('First Referral',    'Refer your first user',         '🎯', 1,   100),
  ('Invite 10 Users',   'Refer 10 users to the platform','🌟', 10,  250),
  ('Invite 25 Users',   'Refer 25 users to the platform','🔥', 25,  500),
  ('Invite 50 Users',   'Refer 50 users to the platform','💫', 50,  1000),
  ('Invite 100 Users',  'Refer 100 users to the platform','🏆', 100, 2500),
  ('Invite 500 Users',  'Refer 500 users to the platform','👑', 500, 10000)
on conflict (name) do nothing;

-- ── user_achievements ───────────────────────────────────────

create table if not exists public.user_achievements (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  achievement_id  uuid not null references public.achievements(id) on delete cascade,
  earned_at       timestamptz default now() not null,
  constraint unique_user_achievement unique (user_id, achievement_id)
);

comment on table public.user_achievements is 'Junction: which users earned which achievements';

alter table public.user_achievements enable row level security;

create policy "user_achievements_select_own"
  on public.user_achievements for select
  using (auth.uid() = user_id);

-- ── leaderboard ─────────────────────────────────────────────

create table if not exists public.leaderboard (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  total_xp        int default 0 check (total_xp >= 0),
  successful_refs int default 0 check (successful_refs >= 0),
  rank            int,
  updated_at      timestamptz default now() not null
);

comment on table public.leaderboard is 'Leaderboard snapshot for referral rankings';

create unique index if not exists idx_leaderboard_user on public.leaderboard (user_id);
create index if not exists idx_leaderboard_rank    on public.leaderboard (rank);

alter table public.leaderboard enable row level security;

create policy "leaderboard_select_all"
  on public.leaderboard for select
  to authenticated
  using (true);

-- ── updated_at triggers ─────────────────────────────────────

create trigger set_referral_codes_updated_at
  before update on public.referral_codes
  for each row execute function public.handle_updated_at();

create trigger set_referrals_updated_at
  before update on public.referrals
  for each row execute function public.handle_updated_at();

create trigger set_leaderboard_updated_at
  before update on public.leaderboard
  for each row execute function public.handle_updated_at();

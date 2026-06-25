-- Newsletter subscriptions table
create table if not exists public.newsletter_subscriptions (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  subscribed_at timestamp with time zone not null default now(),
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.newsletter_subscriptions enable row level security;

-- Allow anyone to insert subscriptions (for public signup)
create policy "newsletter_insert_public" on public.newsletter_subscriptions
  for insert with check (true);

-- Allow service role to manage subscriptions
create policy "newsletter_manage_service" on public.newsletter_subscriptions
  for all using (auth.role() = 'service_role');

-- Index for faster lookups
create index if not exists newsletter_email_idx on public.newsletter_subscriptions(email);

-- Updated at trigger
create trigger newsletter_updated_at
  before update on public.newsletter_subscriptions
  for each row
  execute procedure public.handle_updated_at();

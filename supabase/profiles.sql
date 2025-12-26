-- Profiles table for Ghanovia professionals/customers.
-- Run this in the Supabase SQL editor before shipping.

-- Ensure gen_random_uuid() is available (enabled by default on Supabase).
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  role text not null check (role in ('customer', 'professional')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Maintain updated_at automatically.
create or replace function public.profiles_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.profiles_set_updated_at();

-- Enable RLS.
alter table public.profiles enable row level security;

-- Policies: users can manage only their own row.
create policy "Profiles: select own" on public.profiles
  for select
  using (auth.uid() = user_id);

create policy "Profiles: insert own" on public.profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Profiles: update own" on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: allow service role/admin to manage all rows (already permitted by bypassing RLS).

comment on table public.profiles is 'Public profiles linked to auth.users for Ghanovia roles.';

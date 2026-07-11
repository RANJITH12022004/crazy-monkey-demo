-- Crazy Monkey demo: staff PIN table (demo-appropriate, not production secure)
-- Run this in the Supabase SQL Editor for your project.

create table if not exists public.staff_pins (
  id uuid primary key default gen_random_uuid(),
  pin_hash text not null unique,
  role text not null check (role in ('kitchen', 'stock', 'owner')),
  display_name text not null
);

-- Demo-only: pin_hash stores the plain PIN for fast client-side lookup.
-- Replace with bcrypt hashes if this ever becomes a paid product scope.
insert into public.staff_pins (pin_hash, role, display_name) values
  ('1111', 'kitchen', 'Ravi'),
  ('2222', 'stock', 'Priya'),
  ('3333', 'owner', 'Arjun')
on conflict (pin_hash) do nothing;

alter table public.staff_pins enable row level security;

drop policy if exists "Demo anon read staff_pins" on public.staff_pins;
create policy "Demo anon read staff_pins"
  on public.staff_pins
  for select
  to anon, authenticated
  using (true);

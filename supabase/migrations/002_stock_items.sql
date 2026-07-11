-- Crazy Monkey demo: stock_items table + realistic kitchen seed data
-- Run in Supabase SQL Editor after 001_staff_pins.sql

create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  quantity numeric(10, 2) not null default 0 check (quantity >= 0),
  unit text not null,
  threshold_low numeric(10, 2) not null default 0,
  last_updated timestamptz not null default now()
);

create index if not exists stock_items_category_idx on public.stock_items (category);

-- Demo seed: ingredients aligned with Chinese / Italian / Dessert menu at Crazy Monkey
insert into public.stock_items (name, category, quantity, unit, threshold_low, last_updated) values
  ('Chicken Breast', 'Proteins', 12.00, 'kg', 15.00, now() - interval '6 hours'),
  ('Fresh Prawns', 'Proteins', 8.00, 'kg', 10.00, now() - interval '4 hours'),
  ('Paneer', 'Proteins', 18.00, 'kg', 8.00, now() - interval '1 day'),
  ('Lamb Mince', 'Proteins', 0.00, 'kg', 5.00, now() - interval '2 hours'),
  ('Roma Tomatoes', 'Vegetables', 45.50, 'kg', 10.00, now() - interval '3 hours'),
  ('Red Onions', 'Vegetables', 62.00, 'kg', 15.00, now() - interval '5 hours'),
  ('Baby Corn', 'Vegetables', 4.00, 'kg', 8.00, now() - interval '8 hours'),
  ('Button Mushrooms', 'Vegetables', 0.00, 'kg', 5.00, now() - interval '1 hour'),
  ('Bell Peppers', 'Vegetables', 14.00, 'kg', 6.00, now() - interval '7 hours'),
  ('Mozzarella', 'Dairy', 12.00, 'kg', 6.00, now() - interval '10 hours'),
  ('Parmesan Block', 'Dairy', 3.00, 'kg', 4.00, now() - interval '12 hours'),
  ('Fresh Cream', 'Dairy', 8.00, 'L', 5.00, now() - interval '6 hours'),
  ('Unsalted Butter', 'Dairy', 0.00, 'kg', 3.00, now() - interval '30 minutes'),
  ('Basmati Rice', 'Dry Goods', 2.00, 'bags', 5.00, now() - interval '1 day'),
  ('Penne Pasta', 'Dry Goods', 24.00, 'kg', 8.00, now() - interval '2 days'),
  ('Dark Soy Sauce', 'Dry Goods', 6.00, 'L', 4.00, now() - interval '3 days'),
  ('Pizza Dough Balls', 'Dry Goods', 5.00, 'pcs', 10.00, now() - interval '5 hours'),
  ('Ladyfingers', 'Dry Goods', 15.00, 'packs', 5.00, now() - interval '1 day'),
  ('All-Purpose Flour', 'Dry Goods', 35.00, 'kg', 10.00, now() - interval '2 days'),
  ('Coca-Cola Syrup', 'Beverages', 2.00, 'canisters', 3.00, now() - interval '4 hours'),
  ('Espresso Beans', 'Beverages', 4.00, 'kg', 3.00, now() - interval '1 day'),
  ('Mango Lassi Mix', 'Beverages', 6.00, 'L', 4.00, now() - interval '8 hours'),
  ('Sunflower Oil', 'Dry Goods', 4.00, 'tins', 6.00, now() - interval '6 hours')
on conflict (name) do nothing;

alter table public.stock_items enable row level security;

drop policy if exists "Demo anon read stock_items" on public.stock_items;
create policy "Demo anon read stock_items"
  on public.stock_items
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Demo anon update stock_items" on public.stock_items;
create policy "Demo anon update stock_items"
  on public.stock_items
  for update
  to anon, authenticated
  using (true)
  with check (true);

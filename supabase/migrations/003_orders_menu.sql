-- Crazy Monkey demo: menu, orders, order_items + seed data
-- Run after 001_staff_pins.sql and 002_stock_items.sql

create table if not exists public.menu_items (
  id uuid primary key,
  name text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  category text not null check (category in ('Starters', 'Mains', 'Desserts', 'Beverages')),
  image_url text,
  is_veg boolean not null default false,
  is_bestseller boolean not null default false
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  table_id text not null,
  status text not null check (status in ('received', 'preparing', 'ready')),
  created_at timestamptz not null default now(),
  special_instructions text
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id),
  quantity integer not null check (quantity > 0)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Menu aligned with Crazy Monkey Chinese / Italian / Dessert offerings
insert into public.menu_items (id, name, description, price, category, is_veg, is_bestseller) values
  ('a1000001-0000-4000-8000-000000000001', 'Veg Spring Rolls', 'Crispy rolls with cabbage & carrot', 220.00, 'Starters', true, false),
  ('a1000001-0000-4000-8000-000000000002', 'Chicken Dumplings', 'Steamed dumplings, chili oil dip', 320.00, 'Starters', false, true),
  ('a1000001-0000-4000-8000-000000000003', 'Bruschetta Trio', 'Tomato, olive & pesto on sourdough', 280.00, 'Starters', true, false),
  ('a1000001-0000-4000-8000-000000000004', 'Hakka Noodles', 'Wok-tossed veg noodles', 340.00, 'Mains', true, true),
  ('a1000001-0000-4000-8000-000000000005', 'Kung Pao Chicken', 'Peanuts, dried chili, sichuan pepper', 420.00, 'Mains', false, true),
  ('a1000001-0000-4000-8000-000000000006', 'Schezwan Fried Rice', 'Spicy wok rice with vegetables', 360.00, 'Mains', true, false),
  ('a1000001-0000-4000-8000-000000000007', 'Margherita Pizza', 'San Marzano tomato, fresh mozzarella', 480.00, 'Mains', true, true),
  ('a1000001-0000-4000-8000-000000000008', 'Penne Arrabiata', 'Spicy tomato, garlic, basil', 390.00, 'Mains', true, false),
  ('a1000001-0000-4000-8000-000000000009', 'Tiramisu', 'Espresso-soaked ladyfingers, mascarpone', 290.00, 'Desserts', true, true),
  ('a1000001-0000-4000-8000-000000000010', 'Chocolate Lava Cake', 'Warm fondant, vanilla bean gelato', 320.00, 'Desserts', true, false),
  ('a1000001-0000-4000-8000-000000000011', 'Gelato Scoop', 'Pistachio or dark chocolate', 180.00, 'Desserts', true, false),
  ('a1000001-0000-4000-8000-000000000012', 'Mango Lassi', 'Alphonso mango, cardamom', 160.00, 'Beverages', true, true),
  ('a1000001-0000-4000-8000-000000000013', 'Fresh Lime Soda', 'Sweet or salted', 120.00, 'Beverages', true, false),
  ('a1000001-0000-4000-8000-000000000014', 'Espresso', 'Double shot', 140.00, 'Beverages', true, false)
on conflict (name) do nothing;

-- Demo orders spread across the last 30 days and peak lunch/dinner hours
do $$
declare
  order_id uuid;
  day_offset int;
  hour_slot int;
  table_num int;
begin
  if exists (select 1 from public.orders limit 1) then
    return;
  end if;

  for day_offset in 0..29 loop
    for hour_slot in 1..4 loop
      order_id := gen_random_uuid();
      table_num := 4 + (day_offset % 12);

      insert into public.orders (id, table_id, status, created_at, special_instructions)
      values (
        order_id,
        'table-' || table_num,
        case (day_offset + hour_slot) % 3
          when 0 then 'received'
          when 1 then 'preparing'
          else 'ready'
        end,
        date_trunc('day', now() - (day_offset || ' days')::interval)
          + ((11 + hour_slot * 2) || ' hours')::interval
          + ((day_offset * 7 + hour_slot * 13) % 45 || ' minutes')::interval,
        case when day_offset = 0 and hour_slot = 1 then 'Less spicy please' else null end
      );

      insert into public.order_items (order_id, menu_item_id, quantity) values
        (order_id, 'a1000001-0000-4000-8000-000000000005', 1 + (day_offset % 2)),
        (order_id, 'a1000001-0000-4000-8000-000000000004', 1),
        (order_id, 'a1000001-0000-4000-8000-000000000012', 2);

      if day_offset % 3 = 0 then
        insert into public.order_items (order_id, menu_item_id, quantity)
        values (order_id, 'a1000001-0000-4000-8000-000000000007', 1);
      end if;

      if day_offset % 5 = 0 then
        insert into public.order_items (order_id, menu_item_id, quantity)
        values (order_id, 'a1000001-0000-4000-8000-000000000009', 1);
      end if;
    end loop;
  end loop;

  -- Extra orders today for a lively "today" snapshot
  for hour_slot in 1..6 loop
    order_id := gen_random_uuid();
    insert into public.orders (id, table_id, status, created_at)
    values (
      order_id,
      'table-' || (hour_slot + 2),
      'ready',
      date_trunc('day', now()) + ((11 + hour_slot) || ' hours')::interval + ((hour_slot * 11) || ' minutes')::interval
    );

    insert into public.order_items (order_id, menu_item_id, quantity) values
      (order_id, 'a1000001-0000-4000-8000-000000000005', 2),
      (order_id, 'a1000001-0000-4000-8000-000000000006', 1),
      (order_id, 'a1000001-0000-4000-8000-000000000012', 2),
      (order_id, 'a1000001-0000-4000-8000-000000000002', 1);
  end loop;
end $$;

alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Demo anon read menu_items" on public.menu_items;
create policy "Demo anon read menu_items" on public.menu_items for select to anon, authenticated using (true);

drop policy if exists "Demo anon read orders" on public.orders;
create policy "Demo anon read orders" on public.orders for select to anon, authenticated using (true);

drop policy if exists "Demo anon write orders" on public.orders;
create policy "Demo anon write orders" on public.orders for all to anon, authenticated using (true) with check (true);

drop policy if exists "Demo anon read order_items" on public.order_items;
create policy "Demo anon read order_items" on public.order_items for select to anon, authenticated using (true);

drop policy if exists "Demo anon write order_items" on public.order_items;
create policy "Demo anon write order_items" on public.order_items for all to anon, authenticated using (true) with check (true);

-- Expand menu (indian/mexican + more items), Unsplash images, stock create RLS + realtime + seed

-- Cuisine constraint expansion
alter table public.menu_items drop constraint if exists menu_items_cuisine_check;
alter table public.menu_items add constraint menu_items_cuisine_check
  check (cuisine in ('chinese', 'italian', 'dessert', 'indian', 'mexican', 'beverages'));

-- Backfill existing items with reliable Unsplash photos
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' where name = 'Veg Spring Rolls';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80' where name = 'Chicken Dumplings';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80' where name = 'Bruschetta Trio';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' where name = 'Hakka Noodles';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80' where name = 'Kung Pao Chicken';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80' where name = 'Schezwan Fried Rice';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80' where name = 'Margherita Pizza';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80' where name = 'Penne Arrabiata';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80' where name = 'Tiramisu';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80' where name = 'Chocolate Lava Cake';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80' where name = 'Gelato Scoop';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80' where name = 'Mango Lassi';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' where name = 'Fresh Lime Soda';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' where name = 'Espresso';

-- New menu items
insert into public.menu_items (id, name, description, price, category, cuisine, image_url, is_veg, is_bestseller) values
  ('a1000001-0000-4000-8000-000000000015', 'Veg Manchurian', 'Crispy veg balls in spicy gravy', 280.00, 'Starters', 'chinese', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80', true, true),
  ('a1000001-0000-4000-8000-000000000016', 'Hot & Sour Soup', 'Tangy broth with mushrooms & tofu', 190.00, 'Starters', 'chinese', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000017', 'Chili Chicken', 'Indo-Chinese dry chili toss', 380.00, 'Mains', 'chinese', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80', false, true),
  ('a1000001-0000-4000-8000-000000000018', 'Veg Fried Rice', 'Classic wok rice with greens', 300.00, 'Mains', 'chinese', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000019', 'Garlic Bread', 'Buttery garlic loaf, herbs', 180.00, 'Starters', 'italian', 'https://images.unsplash.com/photo-1619535860434-ba1d8a83fdc9?auto=format&fit=crop&w=800&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000020', 'Alfredo Pasta', 'Creamy parmesan fettuccine', 420.00, 'Mains', 'italian', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80', true, true),
  ('a1000001-0000-4000-8000-000000000021', 'Beef Lasagna', 'Layered pasta, ragu, bechamel', 480.00, 'Mains', 'italian', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80', false, true),
  ('a1000001-0000-4000-8000-000000000022', 'Caprese Salad', 'Tomato, mozzarella, basil', 260.00, 'Starters', 'italian', 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000023', 'Paneer Tikka', 'Tandoor-grilled cottage cheese', 320.00, 'Starters', 'indian', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80', true, true),
  ('a1000001-0000-4000-8000-000000000024', 'Butter Chicken', 'Creamy tomato gravy, tender chicken', 420.00, 'Mains', 'indian', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae173?auto=format&fit=crop&w=600&q=80', false, true),
  ('a1000001-0000-4000-8000-000000000025', 'Dal Makhani', 'Slow-cooked black lentils', 280.00, 'Mains', 'indian', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000026', 'Garlic Naan', 'Tandoor flatbread with garlic butter', 80.00, 'Starters', 'indian', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000027', 'Chicken Biryani', 'Fragrant basmati, spices, raita', 380.00, 'Mains', 'indian', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', false, true),
  ('a1000001-0000-4000-8000-000000000028', 'Loaded Nachos', 'Cheese, salsa, jalapeños', 290.00, 'Starters', 'mexican', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80', true, true),
  ('a1000001-0000-4000-8000-000000000029', 'Chicken Tacos', 'Soft tortillas, salsa verde', 340.00, 'Mains', 'mexican', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80', false, true),
  ('a1000001-0000-4000-8000-000000000030', 'Burrito Bowl', 'Rice, beans, veggies, guac', 360.00, 'Mains', 'mexican', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000031', 'Guacamole & Chips', 'Fresh avocado dip', 220.00, 'Starters', 'mexican', 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=800&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000032', 'Gulab Jamun', 'Warm syrup-soaked dumplings', 160.00, 'Desserts', 'dessert', 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=600&q=80', true, true),
  ('a1000001-0000-4000-8000-000000000033', 'New York Cheesecake', 'Classic baked cheesecake', 300.00, 'Desserts', 'dessert', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000034', 'Chocolate Brownie', 'Fudgy square, walnut crunch', 220.00, 'Desserts', 'dessert', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000035', 'Masala Chai', 'Spiced milk tea', 90.00, 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=600&q=80', true, true),
  ('a1000001-0000-4000-8000-000000000036', 'Cold Coffee', 'Iced espresso shake', 160.00, 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000037', 'Fresh Orange Juice', 'Freshly pressed', 140.00, 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000038', 'Soft Drink', 'Chilled cola / lemon', 80.00, 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', true, false),
  ('a1000001-0000-4000-8000-000000000039', 'Buttermilk', 'Spiced chaas', 70.00, 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', true, false)
on conflict (name) do nothing;

-- Stock INSERT policy for demo create-item
drop policy if exists "Demo anon insert stock_items" on public.stock_items;
create policy "Demo anon insert stock_items" on public.stock_items
  for insert to anon, authenticated with check (true);

-- Realtime for stock
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_items;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Extra stock seed
insert into public.stock_items (id, name, category, quantity, unit, threshold_low, last_updated) values
  (gen_random_uuid(), 'Garam Masala', 'Dry Goods', 1.2, 'kg', 0.5, now()),
  (gen_random_uuid(), 'Tortilla Wraps', 'Dry Goods', 40, 'pcs', 20, now()),
  (gen_random_uuid(), 'Naan Flour', 'Dry Goods', 8, 'kg', 5, now()),
  (gen_random_uuid(), 'Avocados', 'Vegetables', 6, 'pcs', 10, now()),
  (gen_random_uuid(), 'Jalapeños', 'Vegetables', 1.5, 'kg', 1, now()),
  (gen_random_uuid(), 'Coriander Bunch', 'Vegetables', 0, 'packs', 3, now()),
  (gen_random_uuid(), 'Yogurt', 'Dairy', 4, 'kg', 3, now()),
  (gen_random_uuid(), 'Cheddar Cheese', 'Dairy', 2.5, 'kg', 2, now()),
  (gen_random_uuid(), 'Tofu Blocks', 'Proteins', 3, 'kg', 2, now()),
  (gen_random_uuid(), 'Mutton Cubes', 'Proteins', 0, 'kg', 2, now()),
  (gen_random_uuid(), 'Salsa Mix', 'Dry Goods', 8, 'tins', 4, now()),
  (gen_random_uuid(), 'Taco Shells', 'Dry Goods', 25, 'pcs', 15, now()),
  (gen_random_uuid(), 'Black Beans', 'Dry Goods', 6, 'tins', 4, now()),
  (gen_random_uuid(), 'Mint Leaves', 'Vegetables', 2, 'packs', 3, now()),
  (gen_random_uuid(), 'Sparkling Water', 'Beverages', 18, 'bottles', 12, now())
on conflict (name) do nothing;

-- Crazy Monkey: cuisine, images, completed status, realtime, KDS backfill

-- 1a. Extend orders.status to include completed
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('received', 'preparing', 'ready', 'completed'));

-- 1b. Add cuisine to menu_items
alter table public.menu_items add column if not exists cuisine text;

update public.menu_items set cuisine = 'chinese' where name in (
  'Veg Spring Rolls', 'Chicken Dumplings', 'Hakka Noodles', 'Kung Pao Chicken', 'Schezwan Fried Rice'
);
update public.menu_items set cuisine = 'italian' where name in (
  'Bruschetta Trio', 'Margherita Pizza', 'Penne Arrabiata'
);
update public.menu_items set cuisine = 'dessert' where name in (
  'Tiramisu', 'Chocolate Lava Cake', 'Gelato Scoop'
);
update public.menu_items set cuisine = 'beverages' where name in (
  'Mango Lassi', 'Fresh Lime Soda', 'Espresso'
);

alter table public.menu_items alter column cuisine set not null;
alter table public.menu_items drop constraint if exists menu_items_cuisine_check;
alter table public.menu_items add constraint menu_items_cuisine_check
  check (cuisine in ('chinese', 'italian', 'dessert', 'beverages'));

-- 1c. Seed image_url from Stitch assets
update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxkP2WRXetxwPvAxNPJrqiYo5aC_VXXlXUvw1aXT2PKc2nQZsGKeTFfUXLsBPh9wGDL7nIE_6JqAZmscsTnDqGITvS-1UieB4WD8gFO193W-diAUF-2vD1MhH9h5Qwdk-9Im0ZXeubMj32PcIzShHYGy4B_cChtlG2TbiCpspclsSQQvqx-BRdLTyMK6OS0P63y8jI9PqCrQxTpgZZb3ZkijSid8EDrb-zMPQLbUBuOYR7Fe9aXiEjEyW2JF50lbha500Zj8T4GiJ6'
  where name = 'Schezwan Fried Rice';

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdZgjyWsTCAAJ5gPiZwqoU6md4RS-_CArLS_s9VOANyGk8FQ4kGfYDZRAqX8-ZyCpP3CaI3NlXHqogYt9oYPkpHz7xwkIkeoA-rOL3dSzbJeIMhlW7C9HHMvfkIH66q6L25XnytbMHSSEZ7EakBD0tEqEJXn-sKvICYTB3AsdhSPw5UPI_Al_boT4LsxBEAaDDaFp4eFkb4DGALsH8umHz-Jkyi_LFULzx_t8RKS08jPyNizZRyNplT1BO04tMZFq7BMEEqn_HVpwx'
  where name = 'Kung Pao Chicken';

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO-xji2H0Vb9qR63RqEafWS5evyGLQWeK3EQYfevlv8YX6NX9rLTfYAVVW3Els4t6nYidVLc9tWh_bGlnKFcLEljRDMCWsmF5NWqhHGPGSBIojhWDIm1q8RnHPae9V6toA7ze-8e6jBeU5Rm8VrSlk7SmNS4Rh2RQJAtXK6ewX4BN2pTNlswX3aJQj-djjGssWuvsowPjvzUqwm6yHQwi6A1BACmVia9b0xd3X9EzTUcewrv4z2I3B5Zo2n0H86AnX1pUNghCVVKaW'
  where name in ('Veg Spring Rolls', 'Chicken Dumplings');

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxkP2WRXetxwPvAxNPJrqiYo5aC_VXXlXUvw1aXT2PKc2nQZsGKeTFfUXLsBPh9wGDL7nIE_6JqAZmscsTnDqGITvS-1UieB4WD8gFO193W-diAUF-2vD1MhH9h5Qwdk-9Im0ZXeubMj32PcIzShHYGy4B_cChtlG2TbiCpspclsSQQvqx-BRdLTyMK6OS0P63y8jI9PqCrQxTpgZZb3ZkijSid8EDrb-zMPQLbUBuOYR7Fe9aXiEjEyW2JF50lbha500Zj8T4GiJ6'
  where name = 'Hakka Noodles';

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtmVbdFkBc0oOwplRcGrtkJ0Pv7jU2KdJMjYaX5H-2V3kVkco35LWHwmhS0lzgFPl-LaZf8_v18OU2iTju0dXhW8uNBX-ohad9nFskTJIbi4c3ympeSIQOIj02qD75-l4E0NTbdztDAfd79DRo2E59IPDvk2efLCEycsUlEXZsiSNVb6nxxaVjvDcVyjgM6_9eZwa_wiOg2FahmD8oa034EN3__Dh6Xxjy5bm3xCpVh_0km_6sPTmH8RH2Z3xh_RiS0sKBlxJuWHcN'
  where name = 'Margherita Pizza';

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuArs1D7SIektUBhBksrbwxtpTH3-ASRqKteP4mtipOLgo4pxC7ULfjozpLwovyTgMGvTsV_40DPK5xdDmlc-mev6wH92TPt-RHKz6LfR27iFexrR-JcuJoJfFiVTWFFa-28i9CX9HKOj5z03yw7uSpAdwofu1WjMWOua5LjNU6C9AksG5kI3mxlE7LmOWIONwTca3s8nTMaXl1tUdhESKFtUWHnpWT6aCe5SeZSwRj2y0r6yk9J_K1RBfDCZj4-ATbgcBlzKF9EiVic'
  where name = 'Penne Arrabiata';

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkLaTkJDqrW8LtRmFjB5V_3Mm-8y1bOCTVO6-B3FFISxfrafXlyjfne5ZrxQkTkHVst8Ewg7ptiR57DjvFabU__URdY1DLbplp2tJXrmMf_i5eNR-3-GaxZsHbYatbeKfBeeMWbmSArbLKMjnfRTGLh81L8EGdVQIIjrT3DBOmGf4G7oCPbbs_jHIzeG9wU0QZPYUOvR3zVs_KMqCGh6eW1XRDMZLnNOLgR_jtqq5iUquKfXzpqbBblFqm8RGjblv8HO9Y4rA8svoA'
  where name = 'Bruschetta Trio';

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5WbbKG7f8v7DZuXWV109TA1cHefiv3dbtFEyjEouyNUOjv89qb51Wuq-YpKE_fSUCfWOuPytgAthbca7-EkiFbEZ-5y_kuzZ6obdkjR0Gn6m6TXqDoVh8BMlm832hbsl0zYr6sCOZ4J_tgEUirmw_2kv1MtTAlqWkmPjKphkDyPPqMaVuVvn4CSArss9TGoDnFUvwfZiNrCu3zZVF23EDV5PdgnIMny_LsEEykcPlXlSnN-4DUbWWyCzmYJZkR73e19BpvAWyYH6d'
  where name = 'Tiramisu';

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLyqGMNtEtzbf5LgXuF988DDjCl66IEWe92h03L1cXlDatgcGnarP7bYkw-BLlA30qe_-pc7A29R7tR6K01UfF7FDdkHtZZczyJS_Gpdwpiuhz6rIhVHhBCVf1C8RWnYvlUOErccaaLr5nW03AryRf83fxnq28Hd_F4z6ecDxX3_Ik_yhkljFg5m3bV2MlCEgTS3GZaipPb7kPPagkSu5SH8PyVz1ClkWRzyFkGAkc700cc52HtmpLdMOd71pZ3zGU646u0uJsTgq7'
  where name = 'Chocolate Lava Cake';

update public.menu_items set image_url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz_JMB3D1gaC5FOsbnMLpGPodT_T0HOYUkLWOdsgjkGytVjVZN4a1VvHPYMS4txFkLh_u_BsvfeDY2jPJ-HQa7qUf7c4-aFvpOxHPT9awQRBAMUcw-RdnRtt_KH3TrEIzgg4fP4TTTc1K_O8yWvChuM8B3iTkz1Eo9JVCpgZ3gCjCoOJ_A7svHulg6rbcEUiejsW6lfqwJ8hJ77OVNjqbmB86cVOHU1dEygqzHccZtxCKBRc06jws6b8eLAVDNundU8U47DeeN0cts'
  where name = 'Gelato Scoop';

-- 1d. Enable Realtime publication
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 1e. Backfill historical orders to completed (keep KDS clean)
update public.orders
set status = 'completed'
where created_at < date_trunc('day', now());

-- Leave 1-2 live demo orders for today on the board
update public.orders
set status = 'received', created_at = now() - interval '3 minutes'
where id = (
  select id from public.orders
  where created_at >= date_trunc('day', now())
  order by created_at asc
  limit 1
);

update public.orders
set status = 'preparing', created_at = now() - interval '12 minutes'
where id = (
  select id from public.orders
  where created_at >= date_trunc('day', now())
    and status not in ('received')
  order by created_at asc
  limit 1
);

-- Mark remaining today's orders as completed so board isn't flooded
update public.orders
set status = 'completed'
where created_at >= date_trunc('day', now())
  and status in ('received', 'preparing', 'ready')
  and id not in (
    select id from public.orders
    where created_at >= date_trunc('day', now())
      and status in ('received', 'preparing')
    order by created_at asc
    limit 2
  );

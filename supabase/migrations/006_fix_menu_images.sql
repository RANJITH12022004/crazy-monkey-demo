-- Fix broken Unsplash image URLs for menu items

update public.menu_items set image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' where name = 'Hakka Noodles';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1619535860434-ba1d8a83fdc9?auto=format&fit=crop&w=800&q=80' where name = 'Garlic Bread';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80' where name = 'Caprese Salad';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80' where name = 'Chicken Biryani';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=800&q=80' where name = 'Guacamole & Chips';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80' where name = 'New York Cheesecake';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80' where name = 'Fresh Orange Juice';
update public.menu_items set image_url = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80' where name = 'Buttermilk';

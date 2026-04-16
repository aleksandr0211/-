-- Таблица категорий
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Таблица товаров (парфюмерия)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price decimal(10, 2) not null,
  old_price decimal(10, 2),
  image_url text,
  images text[] default '{}',
  volume text,
  brand text,
  in_stock boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Таблица настроек сайта
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Таблица заказов
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_telegram text,
  customer_email text,
  items jsonb not null default '[]',
  total decimal(10, 2) not null,
  status text default 'new',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Таблица баннеров
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  link text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Таблица страниц (для контента)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Включаем RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.banners enable row level security;
alter table public.pages enable row level security;

-- Политики для публичного чтения
create policy "Anyone can view categories" on public.categories for select using (true);
create policy "Anyone can view products" on public.products for select using (true);
create policy "Anyone can view site_settings" on public.site_settings for select using (true);
create policy "Anyone can view active banners" on public.banners for select using (is_active = true);
create policy "Anyone can view pages" on public.pages for select using (true);

-- Политика для создания заказов (любой может создать)
create policy "Anyone can create orders" on public.orders for insert with check (true);

-- Политики для админов (все операции)
create policy "Admins can do anything with categories" on public.categories for all using (
  (select (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true')
);
create policy "Admins can do anything with products" on public.products for all using (
  (select (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true')
);
create policy "Admins can do anything with site_settings" on public.site_settings for all using (
  (select (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true')
);
create policy "Admins can do anything with orders" on public.orders for all using (
  (select (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true')
);
create policy "Admins can do anything with banners" on public.banners for all using (
  (select (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true')
);
create policy "Admins can do anything with pages" on public.pages for all using (
  (select (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true')
);

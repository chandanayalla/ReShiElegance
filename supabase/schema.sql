create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  category text not null default 'Sarees',
  price numeric(10,2) not null default 0,
  original_price numeric(10,2) not null default 0,
  discount integer not null default 0,
  description text not null default '',
  fabric text,
  work text,
  occasion text,
  colors text[] not null default '{}',
  stock integer not null default 0,
  status text not null default 'In Stock',
  rating numeric(2,1) not null default 4.6,
  reviews_count integer not null default 0,
  images text[] not null default '{}',
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address jsonb not null,
  items jsonb not null,
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'Pending',
  payment_status text not null default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text not null default 'created',
  amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  image text,
  is_active boolean not null default true
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null default 'percent',
  discount_value numeric(10,2) not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image text not null,
  link text,
  is_active boolean not null default true
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_created_at_idx on public.products(created_at desc);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.categories enable row level security;
alter table public.coupons enable row level security;
alter table public.banners enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products for select using (true);

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories for select using (is_active = true);

drop policy if exists "Public can read active banners" on public.banners;
create policy "Public can read active banners" on public.banners for select using (is_active = true);

-- Product, order, payment, coupon, and banner writes are performed by the Express
-- API with SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. Do not expose that key
-- to the frontend.

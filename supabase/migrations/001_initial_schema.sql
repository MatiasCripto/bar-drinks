-- Bar Menu App - Initial Schema

-- Bares
create table bars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  address text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Categorías de productos
create table categories (
  id uuid primary key default gen_random_uuid(),
  bar_id uuid not null references bars(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Bebidas / productos
create table drinks (
  id uuid primary key default gen_random_uuid(),
  bar_id uuid not null references bars(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  available boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Pedidos
create table orders (
  id uuid primary key default gen_random_uuid(),
  bar_id uuid not null references bars(id) on delete cascade,
  table_identifier text,
  customer_note text,
  items jsonb not null,
  total numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending','preparing','ready','delivered','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table bars       enable row level security;
alter table categories enable row level security;
alter table drinks     enable row level security;
alter table orders     enable row level security;

-- bars: el dueño ve y edita solo su bar
create policy "owner_select_bar" on bars for select using (owner_id = auth.uid());
create policy "owner_insert_bar" on bars for insert with check (owner_id = auth.uid());
create policy "owner_update_bar" on bars for update using (owner_id = auth.uid());

-- categories: lectura pública, escritura solo el dueño
create policy "public_read_categories" on categories for select using (true);
create policy "owner_write_categories" on categories for all
  using (bar_id in (select id from bars where owner_id = auth.uid()));

-- drinks: lectura pública, escritura solo el dueño
create policy "public_read_drinks" on drinks for select using (true);
create policy "owner_write_drinks" on drinks for all
  using (bar_id in (select id from bars where owner_id = auth.uid()));

-- orders: cualquiera puede insertar (cliente hace pedido), dueño ve y edita los suyos
create policy "public_insert_order" on orders for insert with check (true);
create policy "owner_read_orders" on orders for select
  using (bar_id in (select id from bars where owner_id = auth.uid()));
create policy "owner_update_orders" on orders for update
  using (bar_id in (select id from bars where owner_id = auth.uid()));

-- Trigger para updated_at en orders
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Storage bucket para imágenes de productos
insert into storage.buckets (id, name, public) values ('drinks', 'drinks', true);

create policy "public_read_drinks_images" on storage.objects
  for select using (bucket_id = 'drinks');

create policy "owner_upload_drinks_images" on storage.objects
  for insert with check (
    bucket_id = 'drinks' and auth.uid() is not null
  );

-- Lumi — esquema base (Fase 2). Ver docs/database-schema.md.
-- Convenciones: uuid como PK, timestamptz en UTC, snake_case.


create type public.product_type   as enum ('individual', 'evento');
create type public.product_status as enum ('published', 'hidden');
create type public.category_kind  as enum ('evento', 'vela');
create type public.link_style     as enum ('featured', 'standard', 'compact', 'image');

-- updated_at automático
create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Administradoras autorizadas (se agregan por SQL/Dashboard; nunca desde el cliente).
create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ¿El usuario autenticado es administrador? SECURITY DEFINER para evitar recursión de RLS.
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name        text not null check (char_length(name) between 1 and 80),
  description text check (char_length(description) <= 400),
  kind        public.category_kind not null default 'evento',
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index categories_kind_sort_idx on public.categories (kind, sort_order);
create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

create table public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name        text not null check (char_length(name) between 1 and 120),
  description text check (char_length(description) <= 2000),
  type        public.product_type not null,
  price_cop   integer check (price_cop >= 0),
  status      public.product_status not null default 'hidden',
  is_featured boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- Los productos para eventos se cotizan: nunca llevan precio publicado.
  constraint products_event_no_price check (type = 'individual' or price_cop is null)
);
create index products_status_sort_idx on public.products (status, sort_order);
create index products_featured_idx on public.products (sort_order) where is_featured and status = 'published';
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products (id) on delete cascade,
  storage_path text not null check (char_length(storage_path) between 1 and 300),
  alt_text     text check (char_length(alt_text) <= 200),
  sort_order   integer not null default 0, -- 0 = portada
  created_at   timestamptz not null default now(),
  unique (product_id, storage_path)
);
create index product_images_product_idx on public.product_images (product_id, sort_order);

create table public.product_categories (
  product_id  uuid not null references public.products (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (product_id, category_id)
);
create index product_categories_category_idx on public.product_categories (category_id);

create table public.linktree_links (
  id          uuid primary key default gen_random_uuid(),
  label       text not null check (char_length(label) between 1 and 80),
  description text check (char_length(description) <= 160),
  -- Mismo criterio que src/lib/validation/url.ts: https, mailto, tel o ruta interna. Sin javascript:/data:.
  url         text not null check (
    char_length(url) <= 2048
    and url !~ '[[:space:][:cntrl:]]'
    and (url ~ '^https://[^/?#]+' or url ~ '^mailto:.+' or url ~ '^tel:.+' or (url ~ '^/' and url !~ '^//'))
  ),
  style       public.link_style not null default 'standard',
  icon        text check (icon ~ '^[a-z0-9-]{1,40}$'),  -- clave de una lista permitida en la app
  image_path  text check (char_length(image_path) <= 300),
  is_active   boolean not null default true,
  is_featured boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index linktree_links_active_sort_idx on public.linktree_links (is_active, sort_order);
create unique index linktree_links_one_featured_idx on public.linktree_links (is_featured) where is_featured;
create trigger linktree_links_updated_at before update on public.linktree_links
  for each row execute function public.set_updated_at();

create table public.catalog_versions (
  id            uuid primary key default gen_random_uuid(),
  version       integer generated always as identity unique,
  storage_path  text not null check (char_length(storage_path) between 1 and 300),
  file_size     integer check (file_size > 0),
  selection     jsonb not null default '[]'::jsonb, -- snapshot de productos/categorías/orden usados
  note          text check (char_length(note) <= 200),
  is_published  boolean not null default false,
  generated_by  uuid references auth.users (id) on delete set null,
  generated_at  timestamptz not null default now(),
  published_at  timestamptz
);
-- A lo sumo UNA versión publicada; nada se reemplaza automáticamente.
create unique index catalog_versions_one_published_idx on public.catalog_versions (is_published) where is_published;

create table public.site_settings (
  key        text primary key check (key ~ '^[a-z0-9_]{1,60}$'),
  value      jsonb not null default 'null'::jsonb,
  is_public  boolean not null default true,
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

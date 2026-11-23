-- Lumi — grants explícitos y políticas RLS. Principio: lectura pública SOLO de lo publicado;
-- escritura SOLO de administradoras (public.is_admin()). No se usa la clave service_role.

alter table public.admin_users       enable row level security;
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.product_images    enable row level security;
alter table public.product_categories enable row level security;
alter table public.linktree_links    enable row level security;
alter table public.catalog_versions  enable row level security;
alter table public.site_settings     enable row level security;

-- Grants: partimos de cero y damos lo mínimo; RLS filtra filas.
revoke all on all tables in schema public from anon, authenticated;
grant select on public.categories, public.products, public.product_images, public.product_categories,
                public.linktree_links, public.catalog_versions, public.site_settings to anon;
grant select, insert, update, delete on public.categories, public.products, public.product_images,
                public.product_categories, public.linktree_links, public.catalog_versions,
                public.site_settings to authenticated;
grant select on public.admin_users to authenticated; -- solo su propia fila (política abajo)

-- admin_users: cada persona ve únicamente su fila; nadie escribe desde la API.
create policy admin_users_select_own on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- categories
create policy categories_public_read on public.categories
  for select to anon, authenticated using (is_active);
create policy categories_admin_all on public.categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- products
create policy products_public_read on public.products
  for select to anon, authenticated using (status = 'published');
create policy products_admin_all on public.products
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- product_images: visibles si su producto está publicado
create policy product_images_public_read on public.product_images
  for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy product_images_admin_all on public.product_images
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- product_categories: visibles si producto publicado y categoría activa
create policy product_categories_public_read on public.product_categories
  for select to anon, authenticated
  using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
    and exists (select 1 from public.categories c where c.id = category_id and c.is_active)
  );
create policy product_categories_admin_all on public.product_categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- linktree_links
create policy linktree_links_public_read on public.linktree_links
  for select to anon, authenticated using (is_active);
create policy linktree_links_admin_all on public.linktree_links
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- catalog_versions: el público solo ve la versión publicada
create policy catalog_versions_public_read on public.catalog_versions
  for select to anon, authenticated using (is_published);
create policy catalog_versions_admin_all on public.catalog_versions
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- site_settings: solo claves marcadas como públicas
create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated using (is_public);
create policy site_settings_admin_all on public.site_settings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Lumi — Storage. site-media: imágenes públicas (productos y enlaces). catalogs: PDFs privados.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('site-media', 'site-media', true,  5242880,  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('catalogs',   'catalogs',   false, 31457280, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- site-media es público para lectura por URL; la escritura es solo de administradoras.
create policy site_media_admin_write on storage.objects
  for all to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()))
  with check (bucket_id = 'site-media' and (select public.is_admin()));

-- catalogs: administradoras gestionan todo; el público solo puede leer el PDF de la versión publicada.
create policy catalogs_admin_all on storage.objects
  for all to authenticated
  using (bucket_id = 'catalogs' and (select public.is_admin()))
  with check (bucket_id = 'catalogs' and (select public.is_admin()));

create policy catalogs_public_read_published on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'catalogs'
    and exists (select 1 from public.catalog_versions v where v.is_published and v.storage_path = name)
  );

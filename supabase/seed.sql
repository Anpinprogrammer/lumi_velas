-- Datos iniciales reales (no mockups). Idempotente.
-- Categorías de eventos confirmadas en el brief. Las "colecciones" del prototipo NO se siembran (sin confirmar).
insert into public.categories (slug, name, kind, sort_order) values
  ('matrimonios',    'Matrimonios',                       'evento', 10),
  ('bautizos',       'Bautizos y primeras comuniones',    'evento', 20),
  ('cumpleanos',     'Cumpleaños y quinceañeros',         'evento', 30),
  ('baby-showers',   'Baby showers',                      'evento', 40),
  ('empresariales',  'Eventos empresariales',             'evento', 50),
  ('otros-eventos',  'Otros eventos',                     'evento', 60)
on conflict (slug) do nothing;

-- Ajustes públicos. El número de WhatsApp y el Instagram se completan desde el panel (no se inventan).
insert into public.site_settings (key, value, is_public) values
  ('brand_tagline',   '"Velas · Recordatorios"', true),
  ('whatsapp_number', 'null', true),   -- formato internacional sin "+", p. ej. 573001234567
  ('instagram_url',   'null', true),
  ('contact_email',   'null', true)
on conflict (key) do nothing;

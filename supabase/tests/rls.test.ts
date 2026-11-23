/**
 * Prueba las migraciones y las políticas RLS contra un PostgreSQL real en memoria (PGlite).
 * Los esquemas auth/storage de Supabase se simulan con lo mínimo necesario; ver docs/database-schema.md.
 */
import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const root = join(process.cwd(), "supabase");
const db = new PGlite();
let admin = "";
let other = "";

async function as(role: "anon" | "authenticated", sub: string | null, sql: string) {
  await db.exec(`set role ${role}; select set_config('request.jwt.claim.sub','${sub ?? ""}',false);`);
  try {
    return { rows: (await db.query<Record<string, unknown>>(sql)).rows, error: null as string | null };
  } catch (e) {
    return { rows: [] as Record<string, unknown>[], error: (e as Error).message };
  } finally {
    await db.exec("reset role");
  }
}
async function su(sql: string) {
  try {
    await db.exec(sql);
    return "ok";
  } catch (e) {
    return (e as Error).message;
  }
}

beforeAll(async () => {
  await db.exec(`
    create role anon nologin; create role authenticated nologin;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key default gen_random_uuid(), email text);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant usage on schema public, auth, storage to anon, authenticated;
    grant select on storage.objects to anon, authenticated;`);
  for (const f of readdirSync(join(root, "migrations")).sort()) await db.exec(readFileSync(join(root, "migrations", f), "utf8"));
  const seed = readFileSync(join(root, "seed.sql"), "utf8");
  await db.exec(seed);
  await db.exec(seed); // idempotente
  admin = (await db.query<{ id: string }>("insert into auth.users(email) values('admin@x') returning id")).rows[0].id;
  other = (await db.query<{ id: string }>("insert into auth.users(email) values('otra@x') returning id")).rows[0].id;
  await db.exec(`
    insert into admin_users(user_id) values('${admin}');
    insert into products(slug,name,type,price_cop,status) values
      ('pub','Pub','individual',35000,'published'),('hid','Hid','individual',1000,'hidden'),('evt','Evt','evento',null,'published');
    insert into product_images(product_id,storage_path) select id,'a.webp' from products;
    insert into linktree_links(label,url,is_active) values('ok','https://wa.me/57300',true),('off','https://x.co',false);
    insert into catalog_versions(storage_path,is_published) values('v1.pdf',true),('v2.pdf',false);
    insert into storage.objects(bucket_id,name) values('catalogs','v1.pdf'),('catalogs','v2.pdf');`);
});

describe("lectura pública (anon)", () => {
  it("solo ve productos publicados", async () => {
    expect((await as("anon", null, "select slug from products order by slug")).rows.map((r) => r.slug)).toEqual(["evt", "pub"]);
  });
  it("solo ve imágenes de productos publicados", async () => {
    expect((await as("anon", null, "select count(*)::int c from product_images")).rows[0].c).toBe(2);
  });
  it("solo ve enlaces activos", async () => {
    expect((await as("anon", null, "select label from linktree_links")).rows.map((r) => r.label)).toEqual(["ok"]);
  });
  it("solo ve la versión de catálogo publicada y su PDF", async () => {
    expect((await as("anon", null, "select version from catalog_versions")).rows).toHaveLength(1);
    expect((await as("anon", null, "select name from storage.objects")).rows.map((r) => r.name)).toEqual(["v1.pdf"]);
  });
  it("no puede leer admin_users ni escribir", async () => {
    expect((await as("anon", null, "select * from admin_users")).error).toContain("permission denied");
    expect((await as("anon", null, "insert into products(slug,name,type) values('x','x','individual')")).error).toContain("permission denied");
  });
});

describe("usuaria autenticada que NO es administradora", () => {
  it("lee solo lo publicado", async () => {
    expect((await as("authenticated", other, "select count(*)::int c from products")).rows[0].c).toBe(2);
  });
  it("no puede insertar, actualizar ni borrar", async () => {
    expect((await as("authenticated", other, "insert into products(slug,name,type) values('x','x','individual')")).error).toContain("row-level security");
    expect((await as("authenticated", other, "update products set name='hack' returning id")).rows).toHaveLength(0);
    expect((await as("authenticated", other, "delete from products returning id")).rows).toHaveLength(0);
  });
  it("no puede auto-otorgarse permisos de administradora", async () => {
    expect((await as("authenticated", other, `insert into admin_users(user_id) values('${other}')`)).error).toContain("denied");
  });
});

describe("administradora", () => {
  it("ve todo, incluidos ocultos, versiones y PDFs no publicados", async () => {
    expect((await as("authenticated", admin, "select count(*)::int c from products")).rows[0].c).toBe(3);
    expect((await as("authenticated", admin, "select count(*)::int c from catalog_versions")).rows[0].c).toBe(2);
    expect((await as("authenticated", admin, "select count(*)::int c from storage.objects")).rows[0].c).toBe(2);
  });
  it("puede crear productos y ve su propia fila de admin_users", async () => {
    expect((await as("authenticated", admin, "insert into products(slug,name,type) values('nuevo','Nuevo','individual') returning slug")).rows[0].slug).toBe("nuevo");
    expect((await as("authenticated", admin, "select count(*)::int c from admin_users")).rows[0].c).toBe(1);
  });
});

describe("restricciones de integridad", () => {
  it("un producto de evento no puede tener precio; el precio no es negativo", async () => {
    expect(await su("insert into products(slug,name,type,price_cop) values('e2','E','evento',5)")).toContain("products_event_no_price");
    expect(await su("insert into products(slug,name,type,price_cop) values('e3','E','individual',-1)")).toContain("check");
  });
  it.each(["javascript:alert(1)", "data:text/html,x", "http://x.com", "//evil.com", "https://", "/ok /x", "vbscript:x"])(
    "rechaza el enlace %s",
    async (bad) => expect(await su(`insert into linktree_links(label,url) values('x','${bad}')`)).toContain("check"),
  );
  it.each(["https://instagram.com/lumi", "mailto:a@b.co", "tel:+573001234567", "/catalogo"])("acepta el enlace %s", async (good) =>
    expect(await su(`insert into linktree_links(label,url) values('x','${good}')`)).toBe("ok"),
  );
  it("solo una versión publicada y un enlace destacado", async () => {
    expect(await su("update catalog_versions set is_published=true where storage_path='v2.pdf'")).toContain("duplicate");
    expect(await su("update linktree_links set is_featured=true")).toContain("duplicate");
  });
  it("slug inválido rechazado y seed con 6 categorías", async () => {
    expect(await su("insert into products(slug,name,type) values('Mal Slug','x','individual')")).toContain("check");
    expect((await db.query<{ c: number }>("select count(*)::int c from categories")).rows[0].c).toBe(6);
  });
});

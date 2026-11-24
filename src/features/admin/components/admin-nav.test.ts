import { describe, expect, it } from "vitest";
import { ADMIN_NAV, isActive } from "./admin-nav";

describe("navegación del panel", () => {
  it("Resumen solo está activo en /admin exacto", () => {
    expect(isActive("/admin", "/admin")).toBe(true);
    expect(isActive("/admin/productos", "/admin")).toBe(false);
  });
  it("las secciones quedan activas también en sus subrutas", () => {
    expect(isActive("/admin/productos/nuevo", "/admin/productos")).toBe(true);
    expect(isActive("/admin/links/123", "/admin/links")).toBe(true);
    expect(isActive("/admin/linksx", "/admin/links")).toBe(false);
  });
  it("expone las cuatro secciones del panel", () => {
    expect(ADMIN_NAV.map((l) => l.label)).toEqual(["Resumen", "Productos", "Enlaces", "Catálogo PDF"]);
  });
});

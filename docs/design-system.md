# Sistema de diseño — Lumi

**Estado:** Fase 1, propuesta pendiente de aprobación. Las tipografías son **provisionales**.
Showcase en desarrollo: `npm run dev` → `/dev/design-system` (en producción devuelve 404 salvo `NEXT_PUBLIC_SHOW_DESIGN_SYSTEM=true`; siempre `noindex`).

## Identidad

- Logo oficial: `LUMI_logo_sin_fondo.webp` (raster 1254 px; no existe SVG). Descriptor oficial: **Velas · Recordatorios**.
- Assets optimizados en `public/brand/`: `lumi-logo.webp` (completo), `lumi-ilustracion.webp`, `lumi-wordmark.webp`, `lumi-wordmark-claro.webp` (para fondos oscuros).
- En web se usa la **imagen** del wordmark, no se recompone con texto.

## Color

Muestreado del logo. `(*)` = derivado para alcanzar contraste AA como texto.

| Token | Hex | Contraste sobre crema | Uso |
|---|---|---|---|
| `sage-600` (brand) | `#666C48` | 5.2 | texto, botón primario |
| `sage-700` (hover) (*) | `#4F5537` | 7.3 | hover, texto sobre rosa |
| `sage-400/300` | `#858E65` `#9CA275` | <3.5 | solo decorativo |
| `blush-200/100` (secundario) | `#FBD2CB` `#FBDDD5` | — | fondos, superficies |
| `coral-600` (foco) (*) | `#A84F3F` | 5.1 | foco, acento, "Favorita" |
| `coral-400` | `#E48F79` | 2.3 | solo decorativo |
| `amber-600` (*) / `amber-400` | `#9A5F1F` / `#D28A42` | 4.9 / 2.6 | texto de aviso / decorativo |
| `flame` | `#FCBE5C` | — | brillo, estacional |
| `cream-50/100/200`, `kraft-300` | `#FBF7F0` `#F7E3D0` `#F2D6BD` `#E9C6A9` | — | fondo y superficies cálidas |
| `brown-700` | `#452E23` | 12.6 | texto principal (marrón del tagline del logo; secundario = mismo marrón al 78 %) |
| `brown-400` | `#846852` | 4.8 | tono medio del mismo marrón |
| `ivory` | `#FEF5F1` | — | superficies (blanco cálido de la vela del logo) |

**Regla del cliente:** solo se usan colores y tonos del logo. No hay blancos puros, negros ni marrones ajenos; las temporadas también se construyen con esta paleta.

Regla: **solo** los tokens con contraste ≥4.5:1 se usan para texto. Los demás son decorativos.
Tres capas: primitivos (`--lumi-*`) → semánticos (`brand`, `text`, `border`, `focus`…) → componentes. Todo vive en `src/app/globals.css` y se expone como utilidades Tailwind v4 (`bg-sage-600`, `text-text-muted`).

## Tipografía (provisional)

| Rol | Fuente | Nota |
|---|---|---|
| Display / headings | Cormorant Garamond (300–600, cursiva) | compatible con el wordmark; **no identificada como la original** |
| Body / UI / botones / labels | DM Sans | compatible con la línea inferior del logo |

Escala fluida: `--text-h1/h2/h3`, `--text-body`, `--text-label`, `--text-caption`. Etiquetas: `.eyebrow` (mayúsculas, tracking 0.18em). Cambiar de fuente = editar `src/app/layout.tsx`.

## Otros tokens

- **Espaciado:** escala de Tailwind (base 4 px).
- **Radios:** `sm` 6 · `md` 14 · `lg` 28 · `pill`.
- **Sombras:** `shadow-soft`, `shadow-lift`, `shadow-glow` (destello de llama).
- **Movimiento:** `--ease`, `--ease-out`; `--dur-fast/base/slow` = 150/280/600 ms; con `prefers-reduced-motion` se reducen a ~0.
- **Responsive:** móvil <640 px, tablet 640–1023 px, escritorio ≥1024 px (`sm`, `lg`). Móvil primero.

## Componentes (`src/components/ui`)

| Componente | Variantes / estados |
|---|---|
| `Button` | primary, secondary, ghost, accent · sm/md/lg · loading, disabled · como enlace (`href`) |
| `IconButton` | mismas variantes; `label` obligatorio (nombre accesible) |
| `Input`, `Textarea`, `Select` | label, hint, error (`aria-invalid`, `aria-describedby`, `role=alert`), disabled |
| `Badge` | neutral, brand, blush, accent, success, warning, error |
| `Card` | surface, warm, blush, outline, dark · `interactive` |
| `ProductCard` | individual (precio COP) / evento ("Solicitar cotización") · destacada · sin imagen |
| `CategoryCard` | default / large · icono · imagen opcional |
| `Modal` | `<dialog>` nativo: foco atrapado, Esc, clic en fondo, devuelve foco |
| `Dialog` | confirmación sobre Modal; `tone="destructive"` |
| `Toast` | `ToastProvider` + `useToast()`; `aria-live`, 4 tonos, cierre en 5 s |
| `ImageGallery` | miniaturas, flechas, teclado ←/→ |
| `SectionHeading`, `Container` | alineación, nivel semántico, tamaños narrow/default/wide |
| `EmptyState`, `LoadingState`, `ErrorState` | `role=status` / `role=alert` |

Los iconos son Lucide. **Lucide ya no incluye iconos de marcas** (Instagram, WhatsApp): para el Linktree se añadirán SVG propios.

## Cómo lo usa el Linktree estacional (Fase 3)

- Es una ruta más hecha con los mismos componentes y tokens (variantes de `Card`/`CategoryCard` para jerarquías de enlaces).
- `SeasonalThemeEngine` resuelve el mes en `America/Bogota` y pone `data-season="…"` en el contenedor. Cada tema **solo sobrescribe `--season-*`** (fondo, texto, acento) y activa una capa decorativa cargada de forma diferida. Los tokens de marca nunca cambian.
- Implementado en la Fase 3: ver `docs/seasonal-theme-engine.md`. Solo Navidad (nov–dic) está habilitada.

## Pendiente de validación

1. Fuente original del logo (si existe) o aprobar la pareja provisional.
2. Logo vectorial (SVG) o de mayor resolución.
3. Paleta y derivados de contraste.
4. Fotografías reales (ninguna disponible; el showcase usa ilustraciones del logo como relleno).

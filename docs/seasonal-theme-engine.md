# SeasonalThemeEngine

**Estado (Fase 3):** implementado el motor y la temporada **Navidad (noviembre y diciembre)**. Las otras 10 ambientaciones están definidas en configuración pero **deshabilitadas** (caen al tema base). No hay editor visual de temporadas en el MVP: la configuración vive en código.

## Cómo decide
1. `getBogotaMonth(fecha)` calcula el mes en **America/Bogota** con `Intl` (no depende de la zona del servidor; el cambio ocurre a la medianoche de Bogotá, probado en los bordes 31 oct/1 nov y 31 dic/1 ene).
2. `resolveSeason` busca el tema con `enabled: true` cuyo `months` incluya ese mes; si no hay, usa el **tema base**.
3. `getActiveSeason()` (`"use cache"`, 10 min) lo entrega a las páginas. Al estar cacheado con revalidación, el tema **cambia solo al cambiar de mes**, sin tocar código ni redesplegar.

Archivos: `src/features/seasonal/` → `types.ts`, `themes.ts` (calendario), `engine.ts`, `get-season.ts`, `season-layer.tsx` + `season.css`.

## Configuración por temporada (`SeasonTheme`)
`id`, `name`, `concept`, `months`, `enabled`, `decor[]` (lights, sparkles, stars, pine, petals, hearts, fireflies, strokes), `animation`, `intensity` (low/medium/high), `heroImage?`, `message?` (badge/título/subtítulo), `palette?` y `monthOverrides?` (p. ej. noviembre = intensidad baja con "Comienza la temporada"; diciembre = alta con "Navidad Lumi").
`validateThemes` (y una prueba) garantiza que ningún mes pertenezca a dos temas, que no haya ids repetidos y que todo tema habilitado tenga `palette`.

**Cómo activar otro mes:** implementar sus decoraciones en `season-layer`/`season.css`, completar `palette`, poner `enabled: true`. Los demás componentes no cambian.

## Qué sobrescribe un tema
Solo variables de **página** (`--page-bg`, `--page-text`, `--page-muted`, `--page-accent`, `--page-surface`, `--page-on-surface`, `--page-glow`) y la capa decorativa. **Nunca** los tokens de marca (`--color-brand`, logo, tipografías).

## Navidad
- Fondo cálido `#2A2520`, texto crema, acento llama `#FCBE5C`; tarjetas crema para mantener el contraste.
- Guirnalda de 16 luces (8 en móvil) con aparición gradual escalonada y parpadeo suave, ramas de pino en las esquinas, hasta 14 destellos (según intensidad; la mitad en móvil), aureola cálida tras el arco y brillo dorado al pasar el cursor, enfocar o tocar una tarjeta.
- Parallax muy sutil de las ramas (CSS `scroll()`), solo en navegadores que lo soportan y sin movimiento reducido.
- Sin nieve (el brief pide evitar excesos); sin efectos infantiles.

## Rendimiento y accesibilidad
- **Sin JavaScript de cliente** en la capa: marcado de servidor + CSS. Sin dependencias nuevas.
- Solo `transform` y `opacity`; capa `position: fixed` con `contain`; `pointer-events: none`; `aria-hidden`.
- Medido en desarrollo (Chromium): **CLS 0.000**; 20 animaciones infinitas en escritorio (16 luces + 4 destellos visibles) y ~12 en móvil; con `prefers-reduced-motion: reduce` **0 animaciones infinitas**, luces visibles y estáticas.
- Contraste de texto sobre fondo oscuro y sobre tarjetas verificado con los tokens AA; el anillo de foco pasa a llama en temporada oscura.
- Pendiente de la Fase 7: auditoría Lighthouse/Core Web Vitals en producción y prueba en dispositivos reales.

## Previsualizar
`SEASON_OVERRIDE=navidad` (o `base`) en `.env.local` fuerza un tema en desarrollo/Preview. **Se ignora en Production.**

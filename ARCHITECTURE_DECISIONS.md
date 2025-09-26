# Architecture Decision Records (ADRs)

> Este documento consolida las principales decisiones de arquitectura del proyecto **NewIntranet**. Cada ADR incluye contexto, decisión, alternativas y consecuencias. Las ADRs pueden evolucionar (Accepted → Superseded) conforme el proyecto avance.

---

## ADR-0001 — Stack principal (Next.js 15 + React 19 + TypeScript)
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Se requiere SSR/SSG, rutas anidadas y un fuerte tipado. El proyecto ya opera con Next 15 y React 19, integrando TypeScript de forma estricta.

### Decisión
Adoptar **Next.js 15 (App Router)** + **React 19** con **TypeScript** como base del front.

### Alternativas consideradas
- React CRA/Vite + ruteo manual → pierde SSR/SSG nativo.
- Remix → sólido en rutas/SSR, pero menor adopción interna.

### Consecuencias
- Beneficios de rendimiento (SSR/SSG), convención sobre configuración y DX madura.
- Disciplina en tipos y contratos públicos.

---

## ADR-0002 — Estilos con Tailwind + Design Tokens (CSS variables) y temas `data-theme`
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Se definió una paleta y tipografías (Montserrat/Nulshock) con variantes light/dark. Se necesitan tokens consistentes y consumibles desde componentes.

### Decisión
Usar **TailwindCSS** extendido con **variables CSS** para colores/espaciados/radios/sombras y controlar el tema por `data-theme="light|dark"`.

### Alternativas consideradas
- CSS Modules/SCSS con theming manual → mayor fricción.
- Styled Components → costo de runtime y duplicado en tokens.

### Consecuencias
- Unificación visual por tokens; facilidad para catálogos e historias light/dark.
- Los componentes definen estilos base via utilities y consolidan extras en `styles.ts`.

---

## ADR-0003 — Arquitectura de componentes y patrones
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Se busca escalabilidad, testabilidad y documentación viva.

### Decisión
- Estructura por componente: `Component.tsx`, `styles.ts`, `types.ts`, `*.test.tsx`, `*.docs.mdx`/`*.stories.tsx`, subcarpetas `hooks/` y `utilities/` cuando aplique.  
- Preferir **Compound Components** y **custom hooks** sobre HOC/Render Props.  
- Seguir guías de **Controlled vs Uncontrolled** de forma explícita.

### Alternativas consideradas
- Mezclar lógica/estilos sin separación → reduce testabilidad.
- HOC/Render Props extensivos → complejidad de tipado y nesting.

### Consecuencias
- Mayor claridad, tipado y cobertura de pruebas/documentación.

---

## ADR-0004 — Gestión de estado: Context (global/local) + Zustand (stores por dominio)
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
El proyecto combina estados globales (auth, UI) con estados por dominio (requisitions, employees…).

### Decisión
- **Context** para cross-cutting UI (spinners/alerts) y contextos locales por página.  
- **Zustand** para stores por dominio, con **selectores finos** (evitar hooks “gordos”), flags por operación y utilidades desacopladas.

### Alternativas consideradas
- Redux Toolkit → robusto pero más boilerplate para el tamaño/ritmo actual.

### Consecuencias
- Simplicidad y performance; stores delgados y testeables; contratos documentados por dominio.

---

## ADR-0005 — Capa de mapeo por dominio (mappings/*)
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Para desacoplar API y UI se requiere una capa por dominio que centralice **tipos** y **mappers**.

### Decisión
Crear carpetas por dominio en `mappings/` con `*.types.ts` y `*.mapper.ts` (sin `any` implícito). Consumir siempre tipos desde `*.types.ts`.

### Alternativas consideradas
- Mapeo inline en componentes/stores → acoplamiento y duplicidad.

### Consecuencias
- Contratos claros y reemplazables; pruebas y docs por dominio; menor fragilidad ante cambios del backend.

---

## ADR-0006 — PWA & Service Worker con next-pwa (injectManifest) + Workbox
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Se necesita funcionamiento offline selectivo, caché controlada y soporte a push (Firebase Messaging).

### Decisión
- Usar **next-pwa** en modo **injectManifest** con `src/sw.ts → public/sw.js`.  
- **Workbox** con estrategias `NetworkFirst` para críticos, `StaleWhileRevalidate` para assets, límites con `ExpirationPlugin`.  
- Registrar SW dinámicamente y permitir flags como `CACHE_ONLY_MODE` desde la app.  
- Integrar **Firebase Messaging** en background.

### Alternativas consideradas
- SW manual sin Workbox → más propenso a errores.  
- `next-pwa` en modo generateSW → menos control fino.

### Consecuencias
- Control completo del SW y escalabilidad de estrategias por ruta.

---

## ADR-0007 — Estrategia de pruebas: Vitest (unit/integration) + Playwright (E2E)
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Se requiere una pirámide de testing robusta y reglas de contribución claras.

### Decisión
- **Vitest** para unit/integration con mocks globales (`vitest.setup.tsx`).  
- **Playwright** para E2E (auth, navegación, formularios, tablas, responsive, dark/light), proyectos desktop/móviles, `storageState.json` opcional.  
- Convenciones: `data-testid`, evitar `waitForTimeout`, trazas en fallo, specs independientes.

### Alternativas consideradas
- Solo unitarias → no valida flujos reales.  
- Cypress → alternativa válida, se prioriza Playwright por DX y multi-browser.

### Consecuencias
- Mayor confianza en entregables y PRs; reporte HTML publicable; menor flakiness con selectores estables.

---

## ADR-0008 — Documentación viva con Storybook (.docs.mdx)
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Necesidad de catálogo UI y documentación técnica reutilizable (componentes, hooks, contextos, utilities clave) con cobertura light/dark.

### Decisión
- Documentar cada módulo con `.docs.mdx` y/o `.stories.tsx` (CSF).  
- Requerir historias en ambos temas (decoradores).  
- Permitir módulos sin UI (p.ej. servicios) solo con `.docs.mdx`.

### Alternativas consideradas
- README por componente sin entorno aislado → menos visual, menor validación accesible.

### Consecuencias
- Alineación de diseño/UX, onboarding simple y trazabilidad por dominio.

---

## ADR-0009 — CI/CD en GitHub Actions + Firebase Hosting + Storybook publicado
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Se requiere automatizar validaciones y despliegues en **dev**, **staging** y **main** y publicar Storybook técnico.

### Decisión
- **CI**: build + lint + unit tests en PRs.  
- **CD**: despliegues automáticos a Firebase Hosting por rama (dev/staging/main), con parcheo de `NEXT_PUBLIC_MODE` y verificación previa.  
- Publicar **Storybook** en hosting dedicado.

### Alternativas consideradas
- Deploy manual → mayor riesgo operativo.  
- Un único ambiente → menor seguridad.

### Consecuencias
- Flujo predecible y auditable; fácil diagnóstico con logs y artifacts.  
- (Evolución prevista) añadir **E2E en CI** como gate con publicación de reportes.

---

## ADR-0010 — Reglas de contribución y calidad
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Mantener calidad sostenida por PR.

### Decisión
- Exigir `*.test.ts(x)`, `*.docs.mdx`/`*.stories.tsx`, `types.ts` (JSDoc), `styles.ts`.  
- Validar dominios nuevos: `mappings/*` con `*.types.ts` y `*.mapper.ts`, sin `any` implícito.  
- CHECKLIST de PR con cobertura de light/dark, tests, y versión+CHANGELOG.

### Alternativas consideradas
- Revisiones ad-hoc → heterogeneidad.

### Consecuencias
- Historia limpia y DX de equipo consistente.

---

## ADR-0011 — Protocolo de agentes (AGENTS.md)
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Se integran agentes/IA para tareas de documentación, refactor y control de calidad.

### Decisión
Definir protocolo de lectura (orden de documentos), estructura de componentes esperada, checklist de PRs y restricciones (sin `any`, historias light/dark, etc.).

### Alternativas consideradas
- Uso libre de agentes sin guía → resultados inconsistentes.

### Consecuencias
- Automatizaciones seguras, alineadas a la arquitectura y a los estándares del repo.

---

## ADR-0012 — Convenciones E2E (selectores, projects, trazas)
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Las pruebas E2E deben ser estables y legibles.

### Decisión
- Usar `data-testid` y `getByRole` accesible.  
- Proyectos: Chromium/Firefox/WebKit + móviles (Pixel/iPhone).  
- `trace/video/screenshot` solo en fallos; `storageState` para login rápido.

### Alternativas consideradas
- Selectores por clase/texto → frágiles.

### Consecuencias
- Menor flakiness y diagnósticos rápidos con reportes HTML y trazas.

---

## ADR-0013 — Documentación y pruebas por dominio (stores/utilities)
**Status:** Accepted  
**Date:** 2025-09-11

### Contexto
Los stores de Zustand y sus utilities deben ser testeables y documentados por dominio.

### Decisión
- Ubicar `utilities.test.ts` y `utilities.docs.mdx` únicos por dominio.  
- Mockear gateways en tests y documentar contratos de acciones y shape del state.

### Alternativas consideradas
- Tests dispersos/duplicados → difícil mantenimiento.

### Consecuencias
- Coherencia por dominio y foco en contratos estables.

---

## ADR-0014 — Roadmap inmediato (E2E como quality gate)
**Status:** Proposed  
**Date:** 2025-09-11

### Contexto
Se desea elevar el umbral de calidad en PRs críticos.

### Decisión (propuesta)
- Añadir job E2E a `ci.yml` que ejecute `npm run test:e2e` y publique `playwright-report/` como artifact al fallar.  
- Opcional: matriz por navegadores/temas para cobertura mínima.

### Consecuencias
- Gate más estricto; visibilidad inmediata del estado E2E en cada PR.

---

> **Mantenimiento**: Cuando una decisión cambie, crear una nueva ADR que **supersede** la previa y actualizar enlaces aquí.


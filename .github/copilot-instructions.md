## Copilot / AI agent quick instructions (repositorio NewIntranet)

Estas instrucciones son para agentes de IA que editan o generan código en este repositorio. Son concisas y referencian archivos concretos para ser inmediatamente productivos.

1. Big picture (qué y dónde)
   - Stack: Next.js (App Router, `next` 15), React 19, TypeScript. Ver `ARCHITECTURE_OVERVIEW.md` y `ARCHITECTURE_DECISIONS.md`.
   - Código fuente principal: `src/app/` (rutas, layouts, páginas). Componentes reutilizables en `src/app/components/`.
   - Estado: Contexts en `src/app/context/` y stores por dominio con Zustand en `src/app/stores/`.
   - Transformaciones: todos los mappers por dominio en `src/app/mappings/` (ej. `mappings/employees/employee.mapper.ts`).
   - PWA: `next-pwa` con `swSrc: 'src/sw.ts'` → salida `public/sw.js`. Configuración en `next.config.js`.

2. Critical workflows & commands (use these exactly)
   - Dev server: `npm run dev` (Next dev, localhost:3000)
   - Build: `npm run build`
   - Start production: `npm start`
   - Unit tests (Vitest): `npm run test` (setup in `vitest.config.ts`, global mocks in `vitest.setup.tsx`)
   - E2E (Playwright): `npm run test:e2e` (config: `playwright.config.ts`, `e2e/` specs, `webServer` runs `npm run dev` if needed)
   - Storybook: `npm run storybook` and `npm run build-storybook`; deploy via `deploy:storybook` script.
   - Lint/format: `npm run lint`, `npm run lint:fix`, `npm run format`.

3. Project-specific conventions to follow exactly
   - Component folder layout (per component):
     - `ComponentName.tsx`, `styles.ts`, `types.ts`, `ComponentName.test.tsx`, `ComponentName.stories.tsx` (if UI)
   - Tests: place `*.test.tsx` alongside the component. Vitest + Testing Library expected (`describe`, `it`, `expect`). See `vitest.config.ts`.
   - Storybook: CSF3 stories next to component and include `data-theme="light"` and `data-theme="dark"` variants when the component is theme-sensitive.
   - No `any` in exported types. Use `mappings/*` for backend → frontend transformations.
   - Stores: keep Zustand stores thin; put network logic under `stores/<domain>/utilities/*.ts` and tests in `utilities.test.ts`.
   - Gateway: use the project's `IntranetGateway` / `requireGateway` helpers and `promisifyIntranet` patterns for consistent error normalization.

4. Integration points (what you must not break)
   - Authentication: MSAL (`@azure/msal-browser`) and Firebase are used — files in `src/app/configurations/*` and `firebase.json`.
   - IndexedDB: Dexie config under `src/app/configurations/DataBase/`.
   - Service Worker: `src/sw.ts` (source) → `public/sw.js` (built). Don't remove `swSrc` in `next.config.js`.
   - CI/CD: GitHub Actions target branches `dev`, `staging`, `main`. PRs should target `dev`.

5. When editing / creating code, be explicit (mini-contract)
   - Inputs: path(s) changed and their expected shape (e.g., `mappings/employees/employee.types.ts` → EmployeeType)
   - Outputs: files created/updated and where they appear in the UI/flows (stories, tests, changelog)
   - Error modes: map API errors via `normalizeApiError` and surface a human message (follow pattern in `mappings/*` and `stores/*`).

6. Useful file references & examples
   - Architecture and ADRs: `ARCHITECTURE_OVERVIEW.md`, `ARCHITECTURE_DECISIONS.md` (high-level rationale)
   - Agent protocol / checklist: `AGENTS.md` (contains longer agent rules and PR checklist)
   - Scripts & deps: `package.json` (exact scripts to call)
   - Playwright config: `playwright.config.ts` (E2E flow, baseURL, webServer)
   - Vitest config: `vitest.config.ts` (setup file & coverage)

7. PR and commit requirements (must include)
   - Base branch: `dev`.
   - Add/Update: `*.test.tsx` and `*.stories.tsx` for UI changes; `types.ts` and `styles.ts` where applicable.
   - Update `CHANGELOG.md` and `package.json` version together in same branch for releases.
   - Commit message: short imperative title + brief Why/Where/Impact (follow template in `AGENTS.md`).

8. Constraints / forbidden actions
   - Do not introduce `any` in exported types.
   - Do not modify PWA `swSrc` behavior or remove `firebase` hooks without checking `src/sw.ts` and `firebase.json`.
   - Don’t bypass gateway/mappers — always map backend payloads through `mappings/*`.

9. If uncertain, read in this order before making code changes
   1. `ARCHITECTURE_OVERVIEW.md`
   2. `ARCHITECTURE_DECISIONS.md` (ADRs)
   3. `AGENTS.md` (agent rules & PR checklist)
   4. `package.json` (scripts you should call)

If any section is unclear or you'd like more examples (component, store, or mapper templates), tell me which area and I'll expand with a minimal, ready-to-run example.

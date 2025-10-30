# End-to-End Testing con Playwright

Usamos **Playwright** para validar flujos críticos de la intranet (auth, navegación, formularios, tablas, responsive y tema dark/light).

## Requisitos
- Node 18+ (recomendado: 20).
- Navegadores de Playwright instalados.

```bash
npm i -D @playwright/test
npx playwright install --with-deps
```

## Estructura
```
/e2e
  ├─ specs/               # suites de pruebas (auth, requisitions, smoke, etc.)
  ├─ helpers/             # selectores, utilidades, setup de sesión
  ├─ fixtures/            # storageState.json (sesión autenticada), datos
  └─ playwright.config.ts # config por proyecto (desktop, mobile)
```

## Scripts
```jsonc
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report"
  }
}
```

## Config mínima (`playwright.config.ts`)
- Levanta la app (Next) antes de correr pruebas.
- Fija `baseURL` para usar `page.goto('/')`.
- Graba `trace/video/screenshot` solo en fallos.

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } }
  ]
});
```

## Buenas prácticas de selectores
- **Evita** selectores frágiles (clases generadas, texto variable).
- **Usa** `data-testid`:

```tsx
<button data-testid="login-submit">Entrar</button>
<input data-testid="email-input" />
<input data-testid="password-input" />
```

## Primera prueba
```ts
// e2e/specs/smoke.spec.ts
import { test, expect } from '@playwright/test';

test('home renderiza', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
```

## Autenticación rápida (opcional)
- Genera `e2e/fixtures/storageState.json` con un setup de login y úsalo en tests que requieren sesión.

Variables útiles: `E2E_USER_EMAIL`, `E2E_USER_PASSWORD`

## Ejecutar
```bash
npm run test:e2e        # headless
npm run test:e2e:ui     # modo UI
npm run test:e2e:report # abrir reporte HTML
```

## Troubleshooting
- Si el servidor ya corre en `:3000`, Playwright lo reutiliza.
- Aumenta `webServer.timeout` si el build tarda más.
- Para tablas virtualizadas, asserta sobre elementos realmente renderizados.

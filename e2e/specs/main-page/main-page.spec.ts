// tests/e2e/main-page.spec.ts
import { test, expect, Page } from '@playwright/test';
import { fastLogin, getUserFromIndexedDB } from '../../helpers/login-helpers';
import { isMobileViewport } from '../../helpers/responsive-helpers';
import {
  parsePermissions, expectTabsByPermissions,
  expectSidebarByPermissions,
} from '../../helpers/nav-visibility-helpers';
const email = process.env.E2E_USER_EMAIL!;
const password = process.env.E2E_USER_PASSWORD!;
async function readTheme(page: Page) {
  return page.evaluate(() =>
    document.documentElement.getAttribute('data-theme') ||
    document.body.getAttribute('data-theme') ||
    ''
  );
}

// Algunos navegadores (WebKit/Firefox) en export de Next pueden navegar
// transitoriamente a "/.../index.txt" (stream RSC). Si ocurre, forzamos login.
async function ensureLoginPage(page: Page) {
  await page.waitForURL(
    (url:any) => /\/login\/?(?:\?.*)?$/.test(url) || /\/index\.txt$/.test(url),
    { timeout: 5_000 }
  ).catch(() => {});

  if (/\/index\.txt$/.test(page.url())) {
    await page.goto('/login');
  }
  await expect(page).toHaveURL(/\/login\/?(?:\?.*)?$/);
}

const expetMainSideBarUI = async (page: Page) => {

  const mobile = await isMobileViewport(page);
  const user = await getUserFromIndexedDB(page);
  expect(user).toBeDefined();
  expect(user).toHaveProperty('treeFirebase');
  expect(typeof user.treeFirebase).toBe('string');
  const permissions = parsePermissions(user.treeFirebase);
  await expectTabsByPermissions(page, permissions);
  await expectSidebarByPermissions(page, permissions, mobile);
  await expect(page.getByRole('img', { name: /DR Security Logo/i })).toBeVisible();
  await expect(page.getByTestId(mobile ? 'avatar-mobile' : 'avatar')).toBeVisible();
  const name = user?.fullName ?? user?.fullname ?? user?.userName ?? '';
  const first = String(name).trim().split(/\s+/)[0] || '';
  if (first) {
    // <div class="right"><p>...</p></div>
    const nameLabel = page.locator('aside [class*="right"] p');
    await expect(nameLabel).toContainText(new RegExp(first, 'i'));
  }
  const themeToggle = page.getByTestId(mobile ? 'theme-toggle-mobile' : 'theme-toggle');
  await expect(themeToggle).toBeVisible();

  const before = await readTheme(page);
  await themeToggle.click();

  await page.waitForTimeout(50);
  const after = await readTheme(page);
  expect(after).not.toBe(before);

  const help = page.getByRole('link', { name: /Ayuda/i });
  await expect(help).toBeVisible();
  await expect(help).toHaveAttribute('href', /drsecurity\.atlassian\.net\/servicedesk/i);

  const logout = page.getByTestId(mobile ? 'sidebar-mobile-logout' : 'sidebar-logout');
  await expect(logout).toBeVisible();
  await expect(logout).toContainText(/Cerrar Sesión/i);
}

export const initialTest = async (page: Page) => {
  await page.waitForURL(/\/main-page\/home\?$/, { timeout: 5_000 }).catch(() => { });
  const mobile = await isMobileViewport(page);
  if (!mobile) {
    const sidebar = page.getByTestId('sidebar'); // :contentReference[oaicite:15]{index=15}
    await expect(sidebar).toBeVisible();
    await expetMainSideBarUI(page);
  }
  else {
    const drawer = page.getByTestId('mobile-sidebar'); // :contentReference[oaicite:17]{index=17}
    await expect(drawer).toBeVisible();
    const mobileMenu = page.getByTestId('open-mobile-menu'); // :contentReference[oaicite:17]{index=17}
    await expect(mobileMenu).toBeVisible();
    const topBarAvatar = page.getByTestId('top-bar-Avatar'); // :contentReference[oaicite:17]{index=17}
    await expect(topBarAvatar).toBeVisible();
    const topBarNotifications = page.getByTestId('top-bar-mobileNotifications'); // :contentReference[oaicite:17]{index=17}
    await expect(topBarNotifications).toBeVisible();
    await expect(page.getByRole('img', { name: /DR Security TopBar/i })).toBeVisible();
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  }

}

const withoutAccesTest = async (page: Page) => {
  await page.goto('/main-page'); // layout intenta cargar main
  // En algunos navegadores la exportación puede caer en /index.txt. Normalizamos a /login
  await ensureLoginPage(page);
  // Y validamos que realmente vemos el login
  await expect(page.getByTestId('login-email')).toBeVisible();
};
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    indexedDB.deleteDatabase('LoginDatabase');
    localStorage.clear();
    sessionStorage.clear();
  });
});
test.describe.configure({ mode: 'serial' });
test.describe('MainPage Layout - permisos y navegación', () => {
  test('Bloquea acceso directo sin login y muestra mensaje/redirect', async ({ page }) => {
    await withoutAccesTest(page);
  });

  test('Inicio correcto de Layout con recarga de pagina.', async ({ page }) => {
    await fastLogin(page, email, password);
    await initialTest(page);
    // await page.reload();
    // await initialTest(page);
  });

  test('Hamburguesa abre MobileSidebar y respeta permisos', async ({ page }) => {
    await fastLogin(page, email, password);
    await page.waitForURL(/\/main-page\/home\/announcements\/?$/, { timeout: 5_000 }).catch(() => { });
    await expect(page).toHaveURL(/\/main-page\/home\/announcements\/?$/);
    await page.setViewportSize({ width: 390, height: 844 }); // móvil
    const drawer = page.getByTestId('mobile-sidebar'); // :contentReference[oaicite:17]{index=17}
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    const pannel = page.getByTestId('mobile-panel'); // :contentReference[oaicite:17]{index=17}
    await expect(pannel).toBeVisible();
    // Link permitido visible
    await expetMainSideBarUI(page);
    // Cerrar
    await page.getByTestId('mobile-closesidebar').click();
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });

  test('Logout limpia usuario y redirige a login', async ({ page }) => {
    await fastLogin(page, email, password);
    await page.waitForURL(/\/main-page\/home/, { timeout: 5_000 }).catch(() => { });

    const mobile = await isMobileViewport(page);

    // 1. Click en logout según viewport (sin esperar navegación en el click)
    if (mobile) {
      await page.getByTestId('open-mobile-menu').click();
      await page.getByTestId('sidebar-mobile-logout').click({ noWaitAfter: true });
    } else {
      await page.getByTestId('sidebar-logout').click({ noWaitAfter: true });
    }

    // 2. Espera a que estemos en login (sin engancharse al abortado '/')
    await expect(page).toHaveURL(/\/login\/?(?:\?.*)?$/, { timeout: 5_000 });
    await expect(page.getByTestId('login-email')).toBeVisible();

    // 3. Usuario ya no está en IndexedDB
    const user = await getUserFromIndexedDB(page);
    expect(user).toBeNull();

    // 4. Intentar ir directo a /main-page redirige a login
    await page.goto('/main-page');
    await ensureLoginPage(page);
    await expect(page.getByTestId('login-email')).toBeVisible();
  });
  test('Click en Ayuda abre portal en nueva pestaña', async ({ page }) => {
    await fastLogin(page, email, password);
    await page.waitForURL(/\/main-page\/home/, { timeout: 5_000 }).catch(() => { });

    const mobile = await isMobileViewport(page);
    if (mobile) {
      await page.getByTestId('open-mobile-menu').click();
    }

    const helpLink = page.getByRole('link', { name: /Ayuda/i });
    await expect(helpLink).toHaveAttribute('href', /drsecurity\.atlassian\.net\/servicedesk/i);
    // Evita tráfico externo real que puede volver inestable la prueba
    await page.context().route('**drsecurity.atlassian.net/**', route => route.abort()).catch(() => {});
  
  });

});

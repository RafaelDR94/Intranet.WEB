import { test, expect, Page } from '@playwright/test';
import { fillStable } from '../../helpers/actions-helpers';
import { isMobileViewport } from '../../helpers/responsive-helpers';

test.use({ storageState: undefined });
test.describe.configure({ mode: 'serial' });

async function expectLoginImagesByViewport(page: Page) {
  const desktopImg = page.getByAltText('Fondo DR Security (desktop)');
  const mobileImg = page.getByAltText('Fondo DR Security (mobile)');

  const mobile = await isMobileViewport(page);
  if (mobile) {
    await expect(mobileImg).toBeVisible();
    await expect(desktopImg).toBeHidden();
  } else {
    await expect(desktopImg).toBeVisible();
    await expect(mobileImg).toBeHidden();
  }
}

async function gotoLogin(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('login-email')).toBeVisible();
  await expect(page.getByTestId('login-next')).toBeVisible();
  await expectLoginImagesByViewport(page);
}

async function goToPasswordStep(page: Page, email: string) {
  await gotoLogin(page);
  await fillStable(page.getByTestId('login-email'), email);
  await page.getByTestId('login-next').click();
  await expect(page.getByTestId('login-email-masked')).toBeVisible();
  await expect(page.getByTestId('login-password')).toBeVisible();
}

test.describe('Auth/Login', () => {
  test('renderiza el paso inicial de correo', async ({ page }) => {
    await gotoLogin(page);
    await expect(page.getByPlaceholder('tu@empresa.com')).toBeVisible();
  });

  test('avanza al paso de contraseña y muestra correo enmascarado', async ({ page }) => {
    await goToPasswordStep(page, 'admin@dr.com');
    await expect(page.getByTestId('login-email-masked')).toHaveText(/ad\*+@dr\.com/i);
    await expect(page.getByTestId('login-edit-email')).toBeVisible();
  });

  test('permite volver al paso inicial para editar el correo', async ({ page }) => {
    await goToPasswordStep(page, 'admin@dr.com');
    await page.getByTestId('login-edit-email').click();
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-email')).toHaveValue('admin@dr.com');
  });

  test('inicia sesión con correo resuelto y contraseña', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL!;
    const password = process.env.E2E_USER_PASSWORD!;

    await goToPasswordStep(page, email);
    await fillStable(page.getByTestId('login-password'), password);
    await page.getByTestId('login-primary').click();

    await expect(page).toHaveURL(/\/main-page(\/|$)/, { timeout: 10_000 });
  });
});

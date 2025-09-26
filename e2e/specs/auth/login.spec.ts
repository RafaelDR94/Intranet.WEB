import { test, expect, Page, Locator } from '@playwright/test';
import { expectInputValid, expectInputInvalid, expectHelperTextWithStyle, expectPlaceholder } from '../../helpers/inputs-helpers';
import { expectSubmittingState, expectIdleState } from '../../helpers/forms-helpers';
import { clickToggle, expectTogglePresent, expectToggleChecked } from '../../helpers/toogles-helpers';
import { isMobileViewport } from '../../helpers/responsive-helpers';
import { fillStable } from '../../helpers/actions-helpers';
// Ensure we test the real login flow (no persisted session).
test.use({ storageState: undefined });
test.describe.configure({ mode: 'serial' });



async function expectLoginImagesByViewport(page: Page) {
  const desktopImg = page.getByAltText('Fondo DR Security (desktop)');
  const mobileImg = page.getByAltText('Fondo DR Security (mobile)');

  const mobile = await isMobileViewport(page);
  if (mobile) {
    await expect(mobileImg, 'En mobile la imagen mobile debe ser visible').toBeVisible();
    await expect(desktopImg, 'En mobile la imagen desktop debe estar oculta').toBeHidden();
  } else {
    await expect(desktopImg, 'En desktop la imagen desktop debe ser visible').toBeVisible();
    await expect(mobileImg, 'En desktop la imagen mobile debe estar oculta').toBeHidden();
  }
}

// Marca un input como "touched" sin modificar su valor
const touchInput = async (input: Locator) => {
  await expect(input).toBeVisible();
  await input.focus();
  await input.evaluate((el) => (el as HTMLElement).blur());
};
async function gotoLogin(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await expectIdleState(page);
  await expectHelperTextWithStyle(page, 'login-email', null);
  await expectHelperTextWithStyle(page, 'login-password', null);
  await expectPlaceholder(page, "login-email", "Escribe aquí tu correo electrónico");
  await expectPlaceholder(page, "login-password", "Escribe aquí tu contraseña");
  await expectTogglePresent(page, 'login-remeberme', /Recordarme/i);
  const forgotLink = page.getByTestId('login-forgorpassword')
    .or(page.getByRole('link', { name: /olvidaste tu contraseña/i }));
  await expect(forgotLink, 'Link de recuperación debe mostrarse').toBeVisible();
  const href = await forgotLink.getAttribute('href');
  expect(href, 'href del link de recuperación incorrecto').toBe('/login/recover-password/');
  expectLoginImagesByViewport(page);
}
export async function goToRecoverPassword(page: Page) {
  const link = page
    .getByTestId('login-forgorpassword')
    .or(page.getByRole('link', { name: /olvidaste tu contraseña/i }));

  await Promise.all([
    // tolerante al slash final
    page.waitForURL(/\/login\/recover-password\/?$/),
    link.click(),
  ]);
}
const gotoAndFillLogin = async (page: Page, email: string, password: string) => {
  await gotoLogin(page);
  const emailBox = page.getByPlaceholder('Escribe aquí tu correo electrónico');
  const passBox = page.getByPlaceholder('Escribe aquí tu contraseña');
  await fillStable(emailBox, email);
  await fillStable(passBox, password);
}
async function submitAndWaitRedirect(page: Page) {
  const btn = page.getByTestId('login-primary').or(page.getByRole('button', { name: /Iniciar sesi/i }));
  const click = btn.click();
  await expectSubmittingState(page);
  await click;
  await expect(page).toHaveURL(/\/main-page(\/|$)/, { timeout: 10_000 });
}
// Aserta estado de “enviando”: botón oculto o disabled y spinner visible


test.describe('Auth/Login', () => {
  test('inicia sesión, muestra loading y redirige a main-page', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL!;
    const password = process.env.E2E_USER_PASSWORD!;

    await gotoAndFillLogin(page, email, password);

    const emailBox = page.getByTestId('login-email').or(page.getByPlaceholder('Escribe aquí tu correo electrónico'));
    const passBox = page.getByTestId('login-password').or(page.getByPlaceholder('Escribe aquí tu contraseña'));

    await expectInputValid(emailBox);
    await expectInputValid(passBox);

    // Click → estado “enviando” (spinner / botón disabled u oculto)
    const clickPromise = page.getByTestId('login-primary')
      .or(page.getByRole('button', { name: /Iniciar sesi/i }))
      .click();

    await expectSubmittingState(page);
    await clickPromise;

    // Redirección
    await expect(page).toHaveURL(/\/main-page(\/|$)/, { timeout: 10_000 });
  });

  test('muestra error, vuelve a idle y permanece en /login (alert visible)', async ({ page }) => {
    const bogusEmail = 'pruebas@drsecurity.net';
    await gotoAndFillLogin(page, bogusEmail, 'clave-incorrecta-123');

    const btn = page.getByTestId('login-primary')
      .or(page.getByRole('button', { name: /Iniciar sesi/i }));

    // 1) Click y estado "enviando"
    await btn.click();
    await expectSubmittingState(page);           // spinner visible + botón oculto o disabled

    // 2) Se queda en /login
    await expect(page).toHaveURL(/\/login(\/|$)/);

    // 3) Vuelve a estado "idle"
    await expectIdleState(page);                 // spinner hidden + botón visible y enabled

    // 4) Alert visible
    await expect(
      page.getByTestId('login-error').or(page.getByText(/Login incorrecto/i))
    ).toBeVisible();

    // 5) Inputs siguen válidos (o al menos conservan valor)
    const emailBox = page.getByTestId('login-email').or(page.getByPlaceholder(/correo/i));
    const passBox = page.getByTestId('login-password').or(page.getByPlaceholder(/contrase/i));

    // si usas aria-invalid en FieldRenderer, puedes afirmar esto:
    const emailAria = await emailBox.getAttribute('aria-invalid');
    if (emailAria !== null) await expect(emailBox).toHaveAttribute('aria-invalid', 'false');
    const passAria = await passBox.getAttribute('aria-invalid');
    if (passAria !== null) await expect(passBox).toHaveAttribute('aria-invalid', 'false');

    // o, si prefieres solo verificar que conservan los valores:
    await expect(emailBox).toHaveValue(bogusEmail);
    await expect(passBox).toHaveValue('clave-incorrecta-123');
  });

  test('submit con ambos vacíos: ambos en rojo y mensajes', async ({ page }) => {
    await gotoLogin(page);

    const emailInput = page.getByTestId('login-email').or(page.getByPlaceholder(/correo/i));
    const passInput = page.getByTestId('login-password').or(page.getByPlaceholder(/contrase/i));

    // Click en submit
    await page.getByTestId('login-primary').or(page.getByRole('button', { name: /Iniciar sesi/i })).click();
    await page.getByTestId('login-primary').click();
    await expectInputInvalid(emailInput);
    await expectHelperTextWithStyle(page, 'login-email', /Este campo es requerido/i, 'error');
    await expectInputInvalid(passInput);
    await expectHelperTextWithStyle(page, 'login-password', /Este campo es requerido/i, 'error');
  });

  test('submit sin contraseña: email válido (verde) y password inválido (rojo) con mensaje', async ({ page }) => {
    await gotoLogin(page);

    const emailInput = page.getByTestId('login-email').or(page.getByPlaceholder(/correo/i));
    const passInput = page.getByTestId('login-password').or(page.getByPlaceholder(/contrase/i));

    // Rellena solo email
    await emailInput.fill('bruno.mendoza@drsecurity.net');

    await page.getByTestId('login-primary').or(page.getByRole('button', { name: /Iniciar sesi/i })).click();

    // Forzar "touched" en password para que se muestre como inválido
    await touchInput(passInput);

    // Email válido (si pintas verde cuando pasa)
    await expectInputValid(emailInput); // si no pintas verde, puedes al menos verificar valor
    // await expect(emailInput).toHaveValue('bruno.mendoza@drsecurity.net');

    // Password inválido + mensaje requerido
    await expectInputInvalid(passInput);
    await expectHelperTextWithStyle(page, 'login-password', /Este campo es requerido/i, 'error');
    // await expectRequiredError(page, passInput);
  });

  test('submit sin email: email inválido (rojo) y password válido (verde)', async ({ page }) => {
    await gotoLogin(page);

    const emailInput = page.getByTestId('login-email').or(page.getByPlaceholder(/correo/i));
    const passInput = page.getByTestId('login-password').or(page.getByPlaceholder(/contrase/i));

    // Rellena solo contraseña
    await passInput.fill('una-contraseña-segura');

    await page.getByTestId('login-primary').or(page.getByRole('button', { name: /Iniciar sesi/i })).click();

    // Forzar "touched" en email para que se muestre como inválido
    await touchInput(emailInput);

    // Email inválido + requerido
    await expectInputInvalid(emailInput);
    await expectHelperTextWithStyle(page, 'login-email', /Este campo es requerido/i, 'error');
    await expectInputValid(passInput);  // o al menos valor

  });

  test('remeberme', async ({ page }) => {
    await gotoLogin(page);

    const emailInput = page.getByTestId('login-email').or(page.getByPlaceholder(/correo/i));
    const passInput = page.getByTestId('login-password').or(page.getByPlaceholder(/contrase/i));

    // Rellena solo contraseña
    await passInput.fill('una-contraseña-segura');

    await page.getByTestId('login-primary').or(page.getByRole('button', { name: /Iniciar sesi/i })).click();

    // Forzar "touched" en email para que se muestre como inválido
    await touchInput(emailInput);

    // Email inválido + requerido
    await expectInputInvalid(emailInput);
    await expectHelperTextWithStyle(page, 'login-email', /Este campo es requerido/i, 'error');
    await expectInputValid(passInput);  // o al menos valor

  });

  test('Remember me: persiste credenciales al activar y las limpia al desactivar', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL!;
    const password = process.env.E2E_USER_PASSWORD!;

    // 1) Arranque: login con toggle OFF + inputs vacíos
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expectIdleState(page);

    const emailBox = page.getByTestId('login-email').or(page.getByPlaceholder(/correo/i));
    const passBox = page.getByTestId('login-password').or(page.getByPlaceholder(/contrase/i));

    await expectToggleChecked(page, 'login-remeberme', false);
    await expect(emailBox).toHaveValue('');
    await expect(passBox).toHaveValue('');

    // 2) Activo toggle -> lleno -> login -> main-page
    await clickToggle(page, 'login-remeberme', true);
    await fillStable(emailBox, email);
    await fillStable(passBox, password);
    await submitAndWaitRedirect(page);

    // 3) Vuelvo a /login → Debe venir precargado y toggle ON
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expectIdleState(page);
    await expectToggleChecked(page, 'login-remeberme', true);

    await expect(emailBox).toHaveValue(email);
    // Si tu implementación no repone la contraseña por seguridad, cambia a:
    // await expect(passBox).toHaveValue('');
    // Aceptar password restaurado o vacío (Firefox suele vaciarlo)
    const passVal = await passBox.inputValue();
    expect([password, '']).toContain(passVal);

    // 4) Desactivo toggle → vuelvo a loguear → main-page
    await clickToggle(page, 'login-remeberme', false);
    // Si la app borra al desactivar inmediatamente, re-llena por si acaso:
    if ((await emailBox.inputValue()) === '') await fillStable(emailBox, email);
    if ((await passBox.inputValue()) === '') await fillStable(passBox, password);
    await submitAndWaitRedirect(page);

    // 5) Regreso a /login → ahora debe estar todo limpio + toggle OFF
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expectIdleState(page);

    await expectToggleChecked(page, 'login-remeberme', false);
    await expect(emailBox).toHaveValue('');
    await expect(passBox).toHaveValue('');
    // (opcional) placeholders siguen correctos
    await expectPlaceholder(page, 'login-email', 'Escribe aquí tu correo electrónico');
    await expectPlaceholder(page, 'login-password', 'Escribe aquí tu contraseña');
  });
  test('link de recuperación navega a /login/recover-password', async ({ page }) => {
  await gotoLogin(page);
  await goToRecoverPassword(page);
  await expect(page).toHaveURL('/login/recover-password/');
});
});

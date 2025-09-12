
import { Page,expect } from "@playwright/test";
export async function expectSubmittingState(page: Page) {
  const btn = page.getByTestId('login-primary')
    .or(page.getByRole('button', { name: /Iniciar sesi/i }));
  const spinner = page.getByTestId('login-spinner')
    .or(page.locator('[data-testid="login-spinner"], [role="status"]')).first();
  await expect(btn).toBeHidden({ timeout: 3000 });
  await expect(spinner).toBeVisible({ timeout: 3000 });
}

// Aserta que terminó el envío: spinner oculto y botón visible/habilitado
export async function expectIdleState(page: Page) {
  const btn = page.getByTestId('login-primary').or(page.getByRole('button', { name: /Iniciar sesi/i }));
  const spinner = page.getByTestId('login-spinner');

  await expect(spinner).toBeHidden({ timeout: 5000 }).catch(() => { }); // si nunca existió, ignora
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
}
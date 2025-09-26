// e2e/setup/global.setup.ts
import { chromium, FullConfig, expect } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
  const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';
  const email = process.env.E2E_USER_EMAIL!;
  const password = process.env.E2E_USER_PASSWORD!;
  const storagePath = 'e2e/fixtures/storageState.json';

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}/login`);
  await page.getByPlaceholder('Escribe aquí tu correo electrónico').fill(email);
  await page.getByPlaceholder('Escribe aquí tu contraseña').fill(password);
  await page.getByRole('button', { name: /Iniciar sesión/i }).click();

  await expect(page).toHaveURL(new RegExp(`/main-page(\\/|$)`));

  await context.storageState({ path: storagePath });
  await browser.close();
}

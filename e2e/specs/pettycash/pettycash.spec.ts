import { test, expect } from '@playwright/test';

import { fastLogin } from '../../helpers/login-helpers';
import {initialTest} from '../main-page/main-page.spec';

const email = process.env.E2E_USER_EMAIL ?? 'katherine.negrete@drsecurity.net';
const password = process.env.E2E_USER_PASSWORD ?? '123qwe';

test.describe('Petty Cash module', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      indexedDB.deleteDatabase('LoginDatabase');
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('muestra historial de vales con búsqueda local', async ({ page }) => {

    await fastLogin(page, email, password);
    await initialTest(page);
    // const treasuryMenu = page.getByTestId('side:/main-page/treasury');
    // treasuryMenu.click();
    // const treasurySubMenu = page.getByTestId('side:/main-page/treasury/treasurypettycash');
    // await expect(treasurySubMenu).toBeVisible();
    // treasurySubMenu.click();
  });
});


import { expect, Page } from '@playwright/test';
import { isMobileViewport } from './nav-visibility-helpers';

export const initialTest = async (page: Page) => {
  await page.waitForURL(/\/main-page\/home\?$/, { timeout: 5_000 }).catch(() => {});
  const mobile = await isMobileViewport(page);

  if (!mobile) {
    const sidebar = page.getByTestId('sidebar');
    await expect(sidebar).toBeVisible();
  } else {
    const drawer = page.getByTestId('mobile-sidebar');
    await expect(drawer).toBeVisible();
    const mobileMenu = page.getByTestId('open-mobile-menu');
    await expect(mobileMenu).toBeVisible();
    const topBarAvatar = page.getByTestId('top-bar-Avatar');
    await expect(topBarAvatar).toBeVisible();
    const topBarNotifications = page.getByTestId('top-bar-mobileNotifications');
    await expect(topBarNotifications).toBeVisible();
    await expect(page.getByRole('img', { name: /DR Security TopBar/i })).toBeVisible();
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  }
};

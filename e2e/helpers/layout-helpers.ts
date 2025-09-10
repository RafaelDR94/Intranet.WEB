import { expect, Page } from '@playwright/test'

export async function gotoMainHome(page: Page) {
  await page.goto('/main-page/home')
  await page.waitForLoadState('networkidle')
  // La ruta /main-page/home redirige a announcements
  await expect(page).toHaveURL(/\/main-page\/home(\/announcements)?/)
}

export async function openMobileMenu(page: Page) {
  const btn = page.getByRole('button', { name: /Abrir men/i })
  await expect(btn).toBeVisible()
  await btn.click()
  await expect(page.getByRole('dialog', { name: /Men/i })).toBeVisible()
}

export async function closeMobileMenu(page: Page) {
  const btn = page.getByRole('button', { name: /Cerrar men/i })
  await expect(btn).toBeVisible()
  await btn.click()
  await expect(page.getByRole('dialog', { name: /Men/i })).toBeHidden()
}

export async function expectDesktopSidebarVisible(page: Page) {
  // En desktop, el logo del sidebar de escritorio está visible
  await expect(page.getByAltText('DR Security Logo')).toBeVisible()
}

export async function expectDesktopSidebarHiddenOnMobile(page: Page) {
  await expect(page.getByAltText('DR Security Logo')).toBeHidden()
}

export async function clickTopTab(page: Page, label: string | RegExp) {
  await page.getByRole('link', { name: label }).first().click()
}

export async function expectOnPath(page: Page, path: RegExp) {
  await expect(page).toHaveURL(path)
}


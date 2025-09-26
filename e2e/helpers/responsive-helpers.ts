// helpers/responsive-helpers.ts
import { Page } from '@playwright/test';

export const MD_BREAKPOINT = 768;

/** True si viewport es < 768px (coincide con md de Tailwind) */
export async function isMobileViewport(page: Page) {
  // Usa media query real para empatar exactamente la lógica de CSS
  return page.evaluate(() => matchMedia('(max-width: 767px)').matches);
}


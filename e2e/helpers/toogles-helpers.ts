// helpers/toggle-helpers.ts
import { expect, Page, Locator } from '@playwright/test';

/** Locators base */
export function toggleContainer(page: Page, dataTestId: string) {
  return page.getByTestId(dataTestId);
}

/** Resuelve el “switch” (preferimos el rol; fallback al input checkbox) */
async function resolveSwitch(
  page: Page,
  dataTestId: string,
  labelText?: string | RegExp
): Promise<Locator> {
  const scope = toggleContainer(page, dataTestId);

  // 1) Intento por rol accesible (nueva implementación recomendada)
  const byRole = scope.getByRole('switch', labelText ? { name: labelText } : {});
  if (await byRole.count()) return byRole;

  // 2) Intento por testId interno (si lo agregaste)
  const byTid = page.getByTestId(`${dataTestId}-input`);
  if (await byTid.count()) return byTid;

  // 3) Fallback: input[type=checkbox] (versión antigua)
  return scope.locator('input[type="checkbox"]');
}

/** Resuelve el label visible (texto “Recordarme” dentro del contenedor) */
function resolveLabel(page: Page, dataTestId: string, labelText: string | RegExp) {
  // Evita capturar el <span> del thumb: usa búsqueda por texto
  return toggleContainer(page, dataTestId).getByText(labelText);
}

/** Track (para validar data-state si existe) */
async function resolveTrack(page: Page, dataTestId: string): Promise<Locator | null> {
  const byTid = page.getByTestId(`${dataTestId}-track`);
  if (await byTid.count()) return byTid;
  // Fallback: primer div del track (siempre existe, pero sin data-state no validamos color)
  const scope = toggleContainer(page, dataTestId);
  const maybeTrack = scope.locator('div').first();
  return (await maybeTrack.count()) ? maybeTrack : null;
}

/** Visible + (opcional) texto del label / nombre accesible */
export async function expectTogglePresent(
  page: Page,
  dataTestId: string,
  labelText?: string | RegExp
) {
  const $container = toggleContainer(page, dataTestId);
  await expect($container, `Toggle ${dataTestId} debe estar visible`).toBeVisible();

  const $switch = await resolveSwitch(page, dataTestId, labelText);

  if (labelText) {
    // 1) Ideal: nombre accesible del switch
    try {
      await expect($switch).toHaveAccessibleName(labelText);
    } catch {
      // 2) Fallback: el texto visible del label dentro del contenedor
      await expect(resolveLabel(page, dataTestId, labelText)).toBeVisible();
    }
  }
}

/** Chequea estado checked/un-checked del control */
export async function expectToggleChecked(page: Page, dataTestId: string, checked: boolean) {
  const $switch = await resolveSwitch(page, dataTestId);
  await expect($switch, `Toggle ${dataTestId} esperado en ${checked ? 'ON' : 'OFF'}`)
    .toBeChecked({ checked });
}

/** Chequea enabled/disabled */
export async function expectToggleEnabled(page: Page, dataTestId: string, enabled = true) {
  const $switch = await resolveSwitch(page, dataTestId);
  await (enabled ? expect($switch).toBeEnabled() : expect($switch).toBeDisabled());
}

/** Click sobre el contenedor (label) y espera el nuevo estado */
export async function clickToggle(page: Page, dataTestId: string, expectTo?: boolean) {
  const $container = toggleContainer(page, dataTestId);
  const $switch = await resolveSwitch(page, dataTestId);

  const before = await $switch.isChecked();
  await $container.click(); // el <label> propaga el click

  const target = typeof expectTo === 'boolean' ? expectTo : !before;
  await expect($switch).toBeChecked({ checked: target });
}

/** Asegura el estado deseado (idempotente) */
export async function setToggle(page: Page, dataTestId: string, to: boolean) {
  const $switch = await resolveSwitch(page, dataTestId);
  if ((await $switch.isChecked()) !== to) {
    await clickToggle(page, dataTestId, to);
  }
}

/** Valida el estado visual por data-state ('on' | 'off' | 'disabled') si existe */
export async function expectToggleTrackState(
  page: Page,
  dataTestId: string,
  state: 'on' | 'off' | 'disabled'
) {
  const $track = await resolveTrack(page, dataTestId);
  if (!$track) return; // no hay data-state; nada que validar
  const ds = await $track.getAttribute('data-state');
  // Si tu versión antigua no tiene data-state, ds será null y esta verificación se omite.
  if (ds !== null) {
    await expect($track, `data-state de ${dataTestId} debía ser "${state}" y fue "${ds}"`)
      .toHaveAttribute('data-state', state);
  }
}

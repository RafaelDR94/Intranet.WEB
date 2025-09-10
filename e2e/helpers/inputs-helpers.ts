// helpers/inputs-helpers.ts
import { expect, Locator, Page } from '@playwright/test';

/** Util: obtiene tokens de clase */
async function getClassTokens(el: Locator): Promise<string[]> {
    const cls = (await el.getAttribute('class')) ?? '';
    return cls.split(/\s+/).filter(Boolean);
}
function colorRegex(color: 'red' | 'green' | 'blue' | 'yellow' | 'gray' | 'black' | 'white') {
    return new RegExp(`\\b(?:ring|border|outline)-(?:[a-z]+-)?${color}-(?:\\d{2,3}|[a-z]+)\\b`, 'i');
}
function hasAnyTokenMatching(tokens: string[], re: RegExp) {
    return tokens.some(t => re.test(t));
}

/** Busca el contenedor estándar generado por tu <Input /> */
export function inputContainer(page: Page, dataTestId: string) {
    return page.getByTestId(`${dataTestId}-container`);
}


/** Devuelve las clases (tokenizadas) del helperText */
async function getHelperTokens(page: Page, dataTestId: string): Promise<string[]> {
  const helper = page.getByTestId(`${dataTestId}-helpertext`);
  const cls = (await helper.getAttribute('class')) ?? '';
  return cls.split(/\s+/).filter(Boolean);
}

/** Regex flexible para colores tipo: text-alert-red-100, text-gray-60, etc. */
function textColorRegex(color: 'gray'|'red'|'green'|'blue'|'yellow') {
  // permite prefijo "alert-" opcional en los colores de alerta
  return new RegExp(`\\btext-(?:alert-)?${color}-(?:\\d{2,3}|[a-z]+)\\b`, 'i');
}

/**
 * Aserta que el helperText tenga:
 *  - la clase base (text-c2)
 *  - la clase de color esperada según la variante
 * 
 * Nota: en tus styles, 'disabled' NO tiene entrada en helperColors y cae en 'default' (text-gray-60).
 */
export async function expectHelperStyleByVariant(
  page: Page,
  dataTestId: string,
  variant: 'default'|'filled'|'success'|'info'|'warning'|'error'|'disabled'
) {
  const helper = page.getByTestId(`${dataTestId}-helpertext`);
  await expect(helper, `Se esperaba helperText visible en ${dataTestId}`).toBeVisible();

  const tokens = await getHelperTokens(page, dataTestId);

  // 1) Clase base
  expect(tokens.includes('text-c2'), `El helperText de ${dataTestId} debe incluir 'text-c2'; clases: ${tokens.join(' ')}`).toBe(true);

  // 2) Color por variante (mapea como en styles.ts)
  const variantToColor: Record<typeof variant, 'gray'|'green'|'blue'|'yellow'|'red'> = {
    default: 'gray',
    filled:  'gray',
    disabled:'gray',   // cae en default según helperClasses
    success: 'green',
    info:    'blue',
    warning: 'yellow',
    error:   'red',
  };

  const color = variantToColor[variant];
  const re = textColorRegex(color);
  const hasColor = tokens.some(t => re.test(t));
  expect(hasColor, `El helperText de ${dataTestId} debe tener color ${color} (coincidir con ${re}); clases: ${tokens.join(' ')}`).toBe(true);
}

/** Aserta que el label exista y tenga el texto esperado */
export async function expectLabelText(
    page: Page,
    dataTestId: string,
    expected: string | RegExp
) {
    const container = inputContainer(page, dataTestId);
    const label = container.locator('label');
    await expect(label, `Label inexistente para ${dataTestId}`).toBeVisible();
    await expect(label, `Label con texto inesperado en ${dataTestId}`).toHaveText(expected);
}

/** Aserta que el helperText exista y diga lo esperado (o que no exista si expected = null) */
/**
 * Aserta helperText: contenido y estilo por variante.
 * - Si expectedText === null → no debe existir helperText.
 */
export async function expectHelperTextWithStyle(
  page: Page,
  dataTestId: string,
  expectedText: string | RegExp | null,
  variant: 'default'|'filled'|'success'|'info'|'warning'|'error'|'disabled' = 'default'
) {
  const helper = page.getByTestId(`${dataTestId}-helpertext`);

  if (expectedText === null) {
    await expect(helper, `Se esperaba que NO hubiera helperText en ${dataTestId}`).toHaveCount(0);
    return;
  }

  await expect(helper, `Se esperaba helperText visible en ${dataTestId}`).toBeVisible();
  await expect(helper, `Se esperaba que el helperText coincidiera con: ${String(expectedText)} en ${dataTestId}`).toHaveText(expectedText);

  // Valida color + base text-c2 según la variante
  await expectHelperStyleByVariant(page, dataTestId, variant);
}
/** Aserta que aria-describedby (si existe) apunte al helperText */
export async function expectHelperLinkedWithAria(
    page: Page,
    dataTestId: string
) {
    const input = page.getByTestId(dataTestId);
    const describedBy = await input.getAttribute('aria-describedby');
    // Si lo usas, debe referenciar el helper
    if (describedBy) {
        const helper = page.locator(`#${describedBy}, [id="${describedBy}"], [data-testid="${dataTestId}-helpertext"]`);
        await expect(helper, `aria-describedby apunta a un id inexistente (${describedBy})`).toHaveCount(1);
    }
}

/** Aserta borde por color (útil para variantes) */
export async function expectBorderColor(inputOrContainer: Locator, color: 'red' | 'green' | 'blue' | 'yellow' | 'gray' | 'black' | 'white') {
    const tokens = await getClassTokens(inputOrContainer);
    expect(
        hasAnyTokenMatching(tokens, colorRegex(color)),
        `Se esperaba borde ${color}; clases: ${tokens.join(' ')}`
    ).toBe(true);
}

export async function expectNoRedBorder(inputOrContainer: Locator) {
    const tokens = await getClassTokens(inputOrContainer);
    expect(
        hasAnyTokenMatching(tokens, colorRegex('red')),
        `No se esperaba borde rojo; clases: ${tokens.join(' ')}`
    ).toBe(false);
}

/** Válido visualmente (como ya usas), con chequeo aria-invalid cuando exista */
export async function expectInputValid(inputOrContainer: Locator) {
    const tokens = await getClassTokens(inputOrContainer);
    const isGreen = hasAnyTokenMatching(tokens, colorRegex('green'));
    const isRed = hasAnyTokenMatching(tokens, colorRegex('red'));
    expect(!isRed || isGreen, `Se esperaba válido; clases: ${tokens.join(' ')}`).toBe(true);

    // Si el locator apunta al <input>, valida aria-invalid = false si existe
    const aria = await inputOrContainer.getAttribute('aria-invalid');
    if (aria !== null) {
        await expect(inputOrContainer).toHaveAttribute('aria-invalid', 'false');
    }
}

/** Inválido visualmente (rojo) + aria-invalid=true si existe */
export async function expectInputInvalid(inputOrContainer: Locator) {
    const tokens = await getClassTokens(inputOrContainer);
    expect(
        hasAnyTokenMatching(tokens, colorRegex('red')),
        `Se esperaba inválido (rojo); clases: ${tokens.join(' ')}`
    ).toBe(true);

    const aria = await inputOrContainer.getAttribute('aria-invalid');
    if (aria !== null) {
        await expect(inputOrContainer).toHaveAttribute('aria-invalid', 'true');
    }
}

/** Llenado estable (tu versión, exportada aquí para centralizar) */
export async function fillStable(input: Locator, value: string, slow = false) {
    await expect(input).toBeVisible();
    await expect(input).toBeEditable();
    await input.click();
    await input.fill('');
    if (slow) await input.pressSequentially(value, { delay: 15 });
    else await input.fill(value);

    try {
        await expect(input).toHaveValue(value, { timeout: 1200 });
    } catch {
        await input.focus();
        await input.fill('');
        await input.page().keyboard.insertText(value);
        await expect(input).toHaveValue(value);
    }
}

/** Marca touched (útil para disparar estados de error basados en touched) */
export async function touchInput(input: Locator) {
    await expect(input).toBeVisible();
    await input.focus();
    await input.evaluate(el => (el as HTMLElement).blur());
}

/** Password toggle: verifica que el botón/ícono cambie type="password" <-> "text" */
export async function expectPasswordToggle(page: Page, dataTestId: string) {
    const input = page.getByTestId(dataTestId);
    const iconBtn = page.getByTestId(`${dataTestId}-icon`);
    await expect(iconBtn, 'No hay botón de ojo para toggle').toBeVisible();

    const initialType = (await input.getAttribute('type')) ?? 'text';
    await iconBtn.click();
    const toggledType = await input.getAttribute('type');
    expect(toggledType, 'El toggle de password no cambió el type').not.toBe(initialType);

    // Vuelve al original
    await iconBtn.click();
    const backType = await input.getAttribute('type');
    expect(backType, 'El toggle no volvió al type original').toBe(initialType);
}

/** Icon button opcional: que exista y ejecute callback (si hay indicador de efecto) */
export async function expectIconButtonVisible(page: Page, dataTestId: string) {
    const iconBtn = page.getByTestId(`${dataTestId}-icon`);
    await expect(iconBtn).toBeVisible();
}
/** Aserta que el input/textarea tenga placeholder y que coincida */
export async function expectPlaceholder(
  page: Page,
  dataTestId: string,
  expected: string | RegExp
) {
  const control = page.getByTestId(dataTestId);

  // 1) Debe estar presente el atributo
  const ph = await control.getAttribute('placeholder');
  expect(ph, `Se esperaba atributo placeholder en ${dataTestId}`).not.toBeNull();

  // 2) Coincidencia con string/regex (normaliza espacios si quieres)
  if (expected instanceof RegExp) {
    expect(ph!, `El placeholder de ${dataTestId} no coincide con ${expected}`).toMatch(expected);
  } else {
    expect(ph!, `El placeholder de ${dataTestId} debía ser "${expected}" y fue "${ph}"`).toBe(
      expected
    );
  }
}

/** Aserta que NO haya atributo placeholder */
export async function expectNoPlaceholder(page: Page, dataTestId: string) {
  const control = page.getByTestId(dataTestId);
  const ph = await control.getAttribute('placeholder');
  expect(ph, `No se esperaba atributo placeholder en ${dataTestId}`).toBeNull();
}
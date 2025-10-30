import { expect,Locator } from "@playwright/test";
export const fillStable = async (input: Locator, value: string, slow = false) => {
  await expect(input).toBeVisible();
  await expect(input).toBeEditable();
  // Enfoca y limpia
  await input.click();
  await input.fill('');

  if (slow) {
    await input.pressSequentially(value, { delay: 15 });
  } else {
    await input.fill(value);
  }

  // Si por algún re-render no quedó, intenta con insertText
  try {
    await expect(input).toHaveValue(value, { timeout: 1500 });
  } catch {
    await input.focus();
    await input.fill('');               // limpia de nuevo
    await input.page().keyboard.insertText(value);
    await expect(input).toHaveValue(value);
  }
}
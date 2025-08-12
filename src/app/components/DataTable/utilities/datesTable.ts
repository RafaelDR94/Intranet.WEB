/** Intenta parsear Date | string (ISO, DD/MM/YYYY o DD-MM-YYYY). */
export function parseDateFlexible(input: string | Date | undefined | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;

  const str = String(input).trim();

  // Intento nativo (ISO u otros formatos soportados por Date.parse)
  const ts = Date.parse(str);
  if (!Number.isNaN(ts)) return new Date(ts);

  // DD/MM/YYYY o DD-MM-YYYY
  const m = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/.exec(str);
  if (m) {
    const [, dd, mm, yyyy] = m;
    // Mediodía local para evitar brincos por timezone
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), 12, 0, 0, 0);
  }

  return null;
}

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function startOfWeekMonday(d: Date) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // Lunes=0
  x.setDate(x.getDate() - day);
  return x;
}

export function endOfWeekMonday(d: Date) {
  const s = startOfWeekMonday(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  return endOfDay(e);
}

export function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

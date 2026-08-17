/// Intenta parsear Date | string (ISO, DD/MM/YYYY o DD-MM-YYYY). /
const ISO_RE =
  /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/;

export function parseDateFlexible(
  input: string | number | Date | null | undefined
): Date | null {
  if (input == null) return null;

  // Date | number
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;
  if (typeof input === "number") {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // 0) Normaliza texto y AM/PM
  const normalized = String(input)
    .trim()
    .replace(/\u00A0/g, " ")           // NBSP → espacio normal
    .replace(/\s+/g, " ")              // colapsa espacios
    .replace(/a\s*\.?\s*m\.?/gi, "AM") // a. m., am → AM
    .replace(/p\s*\.?\s*m\.?/gi, "PM");// p. m., pm → PM

  // 1) DD/MM/YYYY [HH:MM[:SS]] [AM|PM]  (también admite "-")
  const dm = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i);
  if (dm) {
    const [, dd, mm, yyyy, hh, mi, ss, mer] = dm;
    const year = Number(yyyy.length === 2 ? Number(yyyy) + 2000 : yyyy);
    const month = Number(mm) - 1; // 0-based
    const day = Number(dd);

    let hour = hh ? Number(hh) : 12; // si no hay hora → mediodía local
    const minute = mi ? Number(mi) : 0;
    const second = ss ? Number(ss) : 0;

    // Ajuste 12h → 24h si hay meridiano
    if (mer) {
      const up = mer.toUpperCase();
      if (up === "AM" && hour === 12) hour = 0;   // 12 AM → 00
      if (up === "PM" && hour !== 12) hour += 12; // 1–11 PM → +12
    }

    const d = new Date(year, month, day, hour, minute, second, 0);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // 2) Solo fecha DD/MM/YYYY (fallback, mantiene mediodía para evitar TZ shift)
  const dmOnly = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (dmOnly) {
    const [, dd, mm, yyyy] = dmOnly;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), 12, 0, 0, 0);
  }

  // 3) ISO. Para filtros de calendario usamos los componentes como fecha local
  // y evitamos que una zona horaria UTC mueva registros al dia anterior.
  const iso = normalized.match(ISO_RE);
  if (iso) {
    const [, yyyy, mm, dd, hh, mi, ss] = iso;
    const d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      hh ? Number(hh) : 12,
      mi ? Number(mi) : 0,
      ss ? Number(ss) : 0,
      0,
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // 4) Como último recurso, evita Date.parse para strings ambiguos
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

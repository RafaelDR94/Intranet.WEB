// Dateshelper.ts
// Utilidades de fechas/horas y construcción de rangos y querystrings

export type UrlsFilteredInterface = {
  onlydates: string;
  withtimefilter: string;
  withterminalfilter: string;
  onlydatesintermedial: string;
};

// 1 = lunes (coincide con la UI del Calendar)
export const WEEK_STARTS_ON = 1 as const;

// ------------------------------
// Helpers base
// ------------------------------
const pad2 = (n: number) => String(n).padStart(2, "0");

const parts = (d: Date = new Date()) => {
  const y = String(d.getFullYear());
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const H = pad2(d.getHours());
  const M = pad2(d.getMinutes());
  const S = pad2(d.getSeconds());
  return { y, m, day, H, M, S };
};

// YYYY-MM-DD
export const currentDate = (d: Date = new Date()): string => {
  const { y, m, day } = parts(d);
  return `${y}-${m}-${day}`;
};

// YYYY/MM/DD (usado por APIs/DB del proyecto)
export const currentDateDataBase = (d: Date = new Date()): string => {
  const { y, m, day } = parts(d);
  return `${y}/${m}/${day}`;
};

export const getHour = (d: Date = new Date()): string => parts(d).H;
export const getMinutes = (d: Date = new Date()): string => parts(d).M;
export const getSeconds = (d: Date = new Date()): string => parts(d).S;

// HH:mm:ss
export const getTime = (d: Date = new Date()): string => {
  const { H, M, S } = parts(d);
  return `${H}:${M}:${S}`;
};

// Para <input type="datetime-local"> → YYYY-MM-DDTHH:mm
export const getCurrentDateTime = (d: Date = new Date()): string => {
  const { y, m, day, H, M } = parts(d);
  return `${y}-${m}-${day}T${H}:${M}`;
};

// ------------------------------
// Rangos (día/semana/mes)
// ------------------------------
export const startOfDay = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const endOfDay = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

export const startOfWeek = (
  d: Date,
  weekStartsOn: number = WEEK_STARTS_ON
): Date => {
  const day = d.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  const start = new Date(d);
  start.setDate(d.getDate() - diff);
  return startOfDay(start);
};

export const endOfWeek = (
  d: Date,
  weekStartsOn: number = WEEK_STARTS_ON
): Date => {
  const start = startOfWeek(d, weekStartsOn);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return endOfDay(end);
};

export const startOfMonth = (d: Date): Date =>
  startOfDay(new Date(d.getFullYear(), d.getMonth(), 1));

export const endOfMonth = (d: Date): Date =>
  endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));

export const todayRange = (ref: Date = new Date()) => ({
  start: startOfDay(ref),
  end: endOfDay(ref),
});

export const weekRange = (
  ref: Date = new Date(),
  weekStartsOn: number = WEEK_STARTS_ON
) => ({
  start: startOfWeek(ref, weekStartsOn),
  end: endOfWeek(ref, weekStartsOn),
});

export const monthRange = (ref: Date = new Date()) => ({
  start: startOfMonth(ref),
  end: endOfMonth(ref),
});

// ------------------------------
// Formateadores amigables
// ------------------------------
export const formatDateES = (date: Date | null): string =>
  date ? date.toLocaleDateString() : "";
export const formatDate = () => {

  const d = new Date();
  if (isNaN(d.getTime())) return '—';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
};

// Acepta "YYYY-MM-DD HH:mm:ss(.fff)" o "YYYY-MM-DDTHH:mm:ss" y devuelve "YYYY-MM-DD HH:mm"
export const formatDateHour = (s: string): string => {
  if (!s) return s;
  const normalized = s.replace("T", " ").trim();
  const m = normalized.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})/);
  return m ? `${m[1]} ${m[2]}:${m[3]}` : normalized;
};

export const formatDMY = (date: Date | null): string => {
  if (!date) return "";
  const pad2 = (n: number) => String(n).padStart(2, "0");
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;
};

export const toDateInputValue = (value?: string | null) => {

  if (!value) return "";
  const newValue = value.includes("T") ? value.split("T")[0] : value;
  if(newValue.includes("/")) return newValue.replaceAll("/","-");
  return newValue
};
// ------------------------------
// Querystring helpers y filtros
// ------------------------------
const qs = (params: Record<string, string>, join: "?" | "&" = "?") =>
  `${join}${new URLSearchParams(params).toString()}`;

export const todayFilters = (d: Date = new Date()): UrlsFilteredInterface => {
  const base = currentDateDataBase(d);
  const start = `${base} 00:00:00`;
  const end = `${base} 23:59:59`;
  return {
    onlydates: qs({ StartDate: start, EndDate: end }, "?"),
    onlydatesintermedial: qs({ StartDate: start, EndDate: end }, "&"),
    withtimefilter: qs({ StartDate: start, EndDate: end, filter: "H" }, "?"),
    withterminalfilter: qs({ StartDate: start, EndDate: end, Terminals: "1" }, "?"),
  };
};

export const monthFilters = (d: Date = new Date()): UrlsFilteredInterface => {
  const { y, m } = parts(d);
  const start = `${y}/${m}/01 00:00:00`;
  const base = currentDateDataBase(d);
  const end = `${base} 23:59:59`;
  return {
    onlydates: qs({ StartDate: start, EndDate: end }, "?"),
    onlydatesintermedial: qs({ StartDate: start, EndDate: end }, "&"),
    withtimefilter: qs({ StartDate: start, EndDate: end, filter: "D" }, "?"),
    withterminalfilter: qs({ StartDate: start, EndDate: end, Terminals: "1" }, "?"),
  };
};

export const yearsFilters = (d: Date = new Date()): UrlsFilteredInterface => {
  const { y } = parts(d);
  const start = `${y}/01/01 00:00:00`;
  const base = currentDateDataBase(d);
  const end = `${base} 23:59:59`;
  return {
    onlydates: qs({ StartDate: start, EndDate: end }, "?"),
    onlydatesintermedial: qs({ StartDate: start, EndDate: end }, "&"),
    withtimefilter: qs({ StartDate: start, EndDate: end, filter: "M" }, "?"),
    withterminalfilter: qs({ StartDate: start, EndDate: end, Terminals: "1" }, "?"),
  };
};

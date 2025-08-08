import { useState, useCallback } from "react";
import { Table, UseDataTableParams } from "./types";

function parseDateFlexible(input: string | Date | undefined | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;

  // Intento nativo (ISO, etc.)
  const ts = Date.parse(input);
  if (!Number.isNaN(ts)) return new Date(ts);

  // DD/MM/YYYY
  const m = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/.exec(String(input).trim());
  if (m) {
    const [, dd, mm, yyyy] = m;
    // Mediodía local para evitar brincos por timezone
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), 12, 0, 0, 0);
  }
  return null;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function startOfWeekMonday(d: Date) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // Lunes=0
  x.setDate(x.getDate() - day);
  return x;
}
function endOfWeekMonday(d: Date) {
  const s = startOfWeekMonday(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  return endOfDay(e);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

const useDataTable = <T extends { id: string | number }>({
  onSearchChange,
  enableInternalSearch = true,
  searchableKeys,
  dateKey,
}: UseDataTableParams<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSearchChange = useCallback((valueOrEvent: unknown) => {
    const value =
      typeof valueOrEvent === "string"
        ? valueOrEvent
        : (valueOrEvent as any)?.target?.value ?? "";

    setSearchTerm(value);
    onSearchChange?.(value, startDate, endDate);
  }, [onSearchChange, startDate, endDate]);

  const handleDateChange = useCallback((start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    onSearchChange?.(searchTerm, start, end);
  }, [onSearchChange, searchTerm]);

  const getRowDate = useCallback((row: T): Date | null => {
    let v: any = undefined;

    if (dateKey) {
      v = typeof dateKey === "function" ? dateKey(row) : (row as any)[dateKey];
    } else if ("fecha" in (row as any)) {
      v = (row as any)["fecha"];
    } else if ("date" in (row as any)) {
      v = (row as any)["date"];
    }

    return parseDateFlexible(v);
  }, [dateKey]);

  const getFilteredData = useCallback((table: Table<T>): T[] => {
    const data = table.data ?? [];

    const raw = typeof searchTerm === "string" ? searchTerm : "";
    const term = raw.trim().toLowerCase();

    const keys: (keyof T)[] =
      searchableKeys ?? (Object.keys(data[0] ?? {}) as (keyof T)[]);

    return data.filter((row) => {
      // --- filtro de búsqueda ---
      const matchesSearch =
        !enableInternalSearch || !term
          ? true
          : keys.some((key) =>
              String((row as any)[key] ?? "")
                .toLowerCase()
                .includes(term)
            );

      // --- filtro de fechas ---
      const hasRange = !!startDate || !!endDate;
      let matchesDate = true;
      if (hasRange) {
        const d = getRowDate(row);
        if (d) {
          const ts = d.getTime();
          const from = startDate ? startOfDay(startDate).getTime() : -Infinity;
          const to = endDate ? endOfDay(endDate).getTime() : Infinity;
          matchesDate = ts >= from && ts <= to;
        } else {
          // Si la fila no tiene fecha, decide si la incluyes o no:
          matchesDate = true; // cámbialo a false si quieres excluirlas
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [searchTerm, searchableKeys, enableInternalSearch, startDate, endDate, getRowDate]);

  // Presets opcionales para “Hoy / Semana / Mes”
  const setQuickRange = useCallback((preset: "today" | "thisWeek" | "thisMonth") => {
    const now = new Date();
    let s: Date, e: Date;

    if (preset === "today") {
      s = startOfDay(now); e = endOfDay(now);
    } else if (preset === "thisWeek") {
      s = startOfWeekMonday(now); e = endOfWeekMonday(now);
    } else {
      s = startOfMonth(now); e = endOfMonth(now);
    }

    setStartDate(s);
    setEndDate(e);
    onSearchChange?.(searchTerm, s, e);
  }, [onSearchChange, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    startDate,
    endDate,
    handleSearchChange,
    handleDateChange,
    getFilteredData,
    setQuickRange, // opcional
  };
};

export default useDataTable;

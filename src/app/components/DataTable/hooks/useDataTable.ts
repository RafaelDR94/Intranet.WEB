// useDataTable.ts
import { useState, useCallback } from "react";

import { DataTableGroup } from "../types";
import {
  parseDateFlexible,
  startOfDay,
  endOfDay,
  startOfWeekMonday,
  endOfWeekMonday,
  startOfMonth,
  endOfMonth,
} from "../utilities/datesTable"; // ajusta la ruta segÃºn tu estructura
import { exportFiles } from "../utilities/exportations";

import { Table, UseDataTableParams } from "./types";

const useDataTable = <T extends { id: string | number }>({
  onSelectedChange,
  onSearchChange,
  enableInternalSearch = true,
  searchableKeys,
  dateKey,
}: UseDataTableParams<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<Record<number, T[]>>({})
  const handleSearchChange = useCallback(
    (valueOrEvent: unknown) => {
      const value =
        typeof valueOrEvent === "string"
          ? valueOrEvent
          : (valueOrEvent as any)?.target?.value ?? "";

      setSearchTerm(value);
      onSearchChange?.(value, startDate, endDate);
    },
    [ onSearchChange, startDate, endDate]
  );

  const handleDateChange = useCallback(
    (start: Date | null, end: Date | null) => {
      setStartDate(start);
      setEndDate(end);
      onSearchChange?.(searchTerm, start, end);
    },
    [ onSearchChange, searchTerm]
  );

  const getRowDate = useCallback(
    (row: T): Date | null => {
      let v: any = undefined;

      if (dateKey) {
        v = typeof dateKey === "function" ? dateKey(row) : (row as any)[dateKey];
      } else if ("fecha" in (row as any)) {
        v = (row as any)["fecha"];
      } else if ("date" in (row as any)) {
        v = (row as any)["date"];
      }

      return parseDateFlexible(v);
    },
    [dateKey]
  );

  const getFilteredData = useCallback(
    (table: Table<T>): T[] => {
      const data = table.data ?? [];
      if (!enableInternalSearch) return data;

      const raw = typeof searchTerm === "string" ? searchTerm : "";
      const term = raw.trim().toLowerCase();

      const keys: (keyof T)[] =
        searchableKeys ?? (Object.keys(data[0] ?? {}) as (keyof T)[]);

      return data.filter((row) => {
        // --- filtro de bÃºsqueda ---
        const matchesSearch =
          !term
            ? true
            : keys.some((key) =>
              String((row as any)[key] ?? "").toLowerCase().includes(term)
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
            matchesDate = true; // cÃ¡mbialo a false si quieres excluirlas
          }
        }

        return matchesSearch && matchesDate;
      });
    },
    [searchTerm, searchableKeys, enableInternalSearch, startDate, endDate, getRowDate]
  );

  // Presets opcionales para â€œHoy / Semana / Mesâ€
  const setQuickRange = useCallback(
    (preset: "today" | "thisWeek" | "thisMonth") => {
      const now = new Date();
      let s: Date, e: Date;

      if (preset === "today") {
        s = startOfDay(now);
        e = endOfDay(now);
      } else if (preset === "thisWeek") {
        s = startOfWeekMonday(now);
        e = endOfWeekMonday(now);
      } else {
        s = startOfMonth(now);
        e = endOfMonth(now);
      }

      setStartDate(s);
      setEndDate(e);
      onSearchChange?.(searchTerm, s, e);
    },
    [onSearchChange, searchTerm]
  );



  const handleSelectedChange = (index: number, rows: T[]) => {
    onSelectedChange?.(index, rows)
    setSelectedRows((prev) => ({ ...prev, [index]: rows }))
  }
  const handleDownload = async (kind: 'pdf' | 'excel', tables: DataTableGroup<any>[], dataTableTitle?: string, tableIndex?: number) => {
    exportFiles(kind, tables, selectedRows, tableIndex, dataTableTitle);
  };

  return {
    searchTerm,
    setSearchTerm,
    startDate,
    endDate,
    selectedRows,
    handleSearchChange,
    handleDateChange,
    getFilteredData,
    setQuickRange,
    handleSelectedChange,
    handleDownload
  };
};

export default useDataTable;


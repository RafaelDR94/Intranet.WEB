// useDataTable.ts
import { useCallback, useState } from "react";
import type { ReactNode } from "react";

import type { ColumnDefinition, DataTableGroup } from "../types";
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

import type { Table, UseDataTableParams } from "./types";

const DATE_KEY_PATTERN =
  /(date|fecha|created|updated|assignment|assigned|start|end|expedition|vigencia|vencimiento|emision|periodo)/i;

const normalizeSearchValue = (value: unknown): string =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const reactNodeToText = (node: ReactNode): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToText).join(" ");
  if (typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return reactNodeToText(props.children);
  }
  return "";
};

const collectSearchValues = (
  value: unknown,
  values: string[],
  seen = new WeakSet<object>(),
) => {
  if (value == null || typeof value === "boolean") return;

  if (value instanceof Date) {
    values.push(value.toISOString());
    values.push(value.toLocaleDateString("es-MX"));
    return;
  }

  if (typeof value === "string" || typeof value === "number") {
    values.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectSearchValues(item, values, seen));
    return;
  }

  if (typeof value === "object") {
    if (seen.has(value)) return;
    seen.add(value);
    Object.values(value as Record<string, unknown>).forEach((item) =>
      collectSearchValues(item, values, seen),
    );
  }
};

const getColumnKeys = <T,>(columns?: ColumnDefinition<T>[]): (keyof T)[] =>
  (columns ?? [])
    .filter((column) => column.invisible !== true)
    .map((column) => column.key);

const getSearchableTexts = <T,>(
  row: T,
  columns?: ColumnDefinition<T>[],
  searchableKeys?: (keyof T)[],
): string[] => {
  const values: string[] = [];
  const rowRecord = row as Record<PropertyKey, unknown>;
  const selectedKeys = new Set<keyof T>([
    ...getColumnKeys(columns),
    ...(searchableKeys ?? []),
  ]);

  selectedKeys.forEach((key) => {
    collectSearchValues(rowRecord[key as PropertyKey], values);
  });

  columns
    ?.filter((column) => column.invisible !== true && column.render)
    .forEach((column) => {
      values.push(reactNodeToText(column.render?.(row) ?? ""));
    });

  collectSearchValues(row, values);

  const joinedSelectedValues = Array.from(selectedKeys)
    .map((key) => rowRecord[key as PropertyKey])
    .filter((value) => value != null)
    .map(String)
    .join(" ");

  if (joinedSelectedValues) values.push(joinedSelectedValues);
  if (values.length) values.push(values.join(" "));

  return values;
};

const getDateCandidateKeys = <T,>(
  row: T,
  columns?: ColumnDefinition<T>[],
): (keyof T)[] => {
  const visibleDateColumns = getColumnKeys(columns).filter((key) =>
    DATE_KEY_PATTERN.test(String(key)),
  );
  const rowDateKeys = Object.keys(row as Record<string, unknown>).filter((key) =>
    DATE_KEY_PATTERN.test(key),
  ) as (keyof T)[];

  return Array.from(new Set<keyof T>([...visibleDateColumns, ...rowDateKeys]));
};

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
  const [selectedRows, setSelectedRows] = useState<Record<number, T[]>>({});
  const handleSearchChange = useCallback(
    (valueOrEvent: unknown) => {
      const inputEvent = valueOrEvent as { target?: { value?: string } };
      const value =
        typeof valueOrEvent === "string"
          ? valueOrEvent
          : inputEvent.target?.value ?? "";

      setSearchTerm(value);
      onSearchChange?.(value, startDate, endDate);
    },
    [onSearchChange, startDate, endDate]
  );

  const handleDateChange = useCallback(
    (start: Date | null, end: Date | null) => {
      setStartDate(start);
      setEndDate(end);
      onSearchChange?.(searchTerm, start, end);
    },
    [onSearchChange, searchTerm]
  );

  const getRowDate = useCallback(
    (row: T, table?: Table<T>): Date | null => {
      let v: unknown = undefined;

      if (dateKey) {
        v =
          typeof dateKey === "function"
            ? dateKey(row)
            : (row as Record<PropertyKey, unknown>)[dateKey as PropertyKey];
        return parseDateFlexible(
          v as string | number | Date | null | undefined,
        );
      }

      const rowRecord = row as Record<PropertyKey, unknown>;
      for (const key of getDateCandidateKeys(row, table?.columns)) {
        const parsed = parseDateFlexible(
          rowRecord[key as PropertyKey] as
            | string
            | number
            | Date
            | null
            | undefined,
        );
        if (parsed) return parsed;
      }

      return null;
    },
    [dateKey]
  );

  const getFilteredData = useCallback(
    (table: Table<T>): T[] => {
      const data = table.data ?? [];
      if (!enableInternalSearch) return data;

      const raw = typeof searchTerm === "string" ? searchTerm : "";
      const term = normalizeSearchValue(raw);
      const termTokens = term.split(/\s+/).filter(Boolean);

      return data.filter((row) => {
        // --- filtro de bÃºsqueda ---
        const matchesSearch = !term
          ? true
          : (() => {
              const searchableText = getSearchableTexts(
                row,
                table.columns,
                searchableKeys,
              )
                .map(normalizeSearchValue)
                .join(" ");

              return (
                searchableText.includes(term) ||
                termTokens.every((token) => searchableText.includes(token))
              );
            })();

        // --- filtro de fechas ---
        const hasRange = !!startDate || !!endDate;
        let matchesDate = true;

        if (hasRange) {
          const d = getRowDate(row, table);

          if (d) {
            const ts = d.getTime();
            const from = startDate ? startOfDay(startDate).getTime() : -Infinity;
            const to = endDate ? endOfDay(endDate).getTime() : Infinity;
            matchesDate = ts >= from && ts <= to;
          } else {
            // A range only represents rows with a valid date in that range.
            matchesDate = false;
          }
        }

        return matchesSearch && matchesDate;
      });
    },
    [
      searchTerm,
      searchableKeys,
      enableInternalSearch,
      startDate,
      endDate,
      getRowDate,
    ]
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
    onSelectedChange?.(index, rows);
    setSelectedRows((prev) => ({ ...prev, [index]: rows }));
  };
  const handleDownload = async (
    kind: "pdf" | "excel",
    tables: DataTableGroup<T>[],
    dataTableTitle?: string,
    tableIndex?: number,
  ) => {
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
    handleDownload,
  };
};

export default useDataTable;


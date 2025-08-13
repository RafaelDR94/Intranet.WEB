// hooks/useTableContent.ts
import { useEffect, useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface UseTableContentProps<T> {
  data: T[];
  defaultSortKey?: keyof T;
  defaultSortDirection?: SortDirection;
}

/** 🔹 Hook base: selección y ordenamiento */
export const useTableContent = <T extends { id: string | number }>({
  data,
  defaultSortKey,
  defaultSortDirection,
}: UseTableContentProps<T>) => {
  const [selected, setSelected] = useState<T[]>([]);
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey ?? null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection ?? null);

  const allSelected = data.length > 0 && selected.length === data.length;

  const toggleSelect = (selectedItem: T) => {
    setSelected((prev) =>
      prev.includes(selectedItem) ? prev.filter((v) => v !== selectedItem) : [...prev, selectedItem]
    );
  };

  const selectAll = (value: boolean) => {
    setSelected(value ? data : []);
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      const newDirection =
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc";
      setSortDirection(newDirection);
      if (newDirection === null) setSortKey(null);
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const isDateValue = (val: unknown) =>
    typeof val === "string" && !isNaN(Date.parse(val));

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      const isDate = isDateValue(aVal) && isDateValue(bVal);
      const valA = isDate
        ? new Date(aVal as string).getTime()
        : String(aVal).toLowerCase();
      const valB = isDate
        ? new Date(bVal as string).getTime()
        : String(bVal).toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  return {
    selected,
    allSelected,
    toggleSelect,
    selectAll,
    sortKey,
    sortDirection,
    handleSort,
    sortedData,
  };
};

/** Props adicionales para paginación/scroll */
export interface UseDataTableContentProps<T> extends UseTableContentProps<T> {
  enablePagination?: boolean;
  rowsPerPage?: number;
  totalRows?: number;
  enableInternalSearch?: boolean;
  onPageChange?: (page: number) => void;
  /** alto estimado de cada fila, en px */
  rowHeight?: number;
  /** si lo defines, este valor manda (px o cualquier CSS válido) */
  scrollMaxHeight?: number | string;
}

/** 🔹 Hook “envolvente”: usa el base y añade paginación + layout (scroll/altura) */
export const useDataTableContent = <T extends { id: string | number }>(
  {
    data,
    defaultSortKey,
    defaultSortDirection,
    enablePagination = true,
    rowsPerPage = 10,
    totalRows,
    enableInternalSearch = true,
    onPageChange,
    rowHeight = 56,
    scrollMaxHeight,
  }: UseDataTableContentProps<T>
) => {
  const {
    selected,
    allSelected,
    toggleSelect,
    selectAll,
    sortKey,
    sortDirection,
    handleSort,
    sortedData,
  } = useTableContent<T>({ data, defaultSortKey, defaultSortDirection });
  
  // paginación
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = enableInternalSearch ? sortedData.length : (totalRows ?? sortedData.length);
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  useEffect(() => {
    if (enablePagination && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [enablePagination, totalPages, currentPage]);



  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage, enablePagination]);

  const handlePage = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  // layout (scroll interno configurable)
  const showScroll =
    !enablePagination || typeof scrollMaxHeight !== "undefined";
  const computedMaxHeight =
    typeof scrollMaxHeight !== "undefined"
      ? typeof scrollMaxHeight === "number"
        ? `${scrollMaxHeight}px`
        : scrollMaxHeight
      : `${rowsPerPage * rowHeight}px`;

  return {
    // selección + orden
    selected,
    allSelected,
    toggleSelect,
    selectAll,
    sortKey,
    sortDirection,
    handleSort,
    // datos
    sortedData,
    paginatedData,
    // paginación
    currentPage,
    totalPages,
    handlePage,
    // layout
    showScroll,
    computedMaxHeight,
  };
};

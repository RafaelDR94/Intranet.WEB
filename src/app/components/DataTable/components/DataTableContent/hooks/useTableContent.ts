// hooks/useTableContent.ts
import { useEffect, useMemo, useState } from "react";

import { SortDirection,UseDataTableContentProps,UseTableContentProps } from "./types";

const haveSameIds = <T extends { id: string | number }>(a: T[], b: T[]) => {
  if (a.length !== b.length) return false;
  const ids = new Set(a.map((item) => String(item.id)));
  if (ids.size !== b.length) return false;
  return b.every((item) => ids.has(String(item.id)));
};
/** 🔹 Hook base: selección y ordenamiento */
export const useTableContent = <T extends { id: string | number }>({
  data,
  defaultSortKey,
  defaultSortDirection,
  initialSelectedIds,
}: UseTableContentProps<T>) => {
  const [selected, setSelected] = useState<T[]>([]);
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey ?? null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection ?? null);

  useEffect(() => {
    if (initialSelectedIds == null) return;
    const map = new Map(data.map((item) => [String(item.id), item]));
    const nextSelection = initialSelectedIds
      .map((id) => map.get(String(id)))
      .filter((row): row is T => Boolean(row));

    setSelected((prev) => {
      if (haveSameIds(prev, nextSelection)) {
        return prev;
      }
      return nextSelection;
    });
  }, [initialSelectedIds, data]);

  useEffect(() => {
    if (initialSelectedIds != null) return;
    if (selected.length === 0) return;

    const map = new Map(data.map((item) => [String(item.id), item]));
    const nextSelection = selected
      .map((row) => map.get(String(row.id)))
      .filter((row): row is T => Boolean(row));

    if (!haveSameIds(selected, nextSelection)) {
      setSelected(nextSelection);
    }
  }, [data, initialSelectedIds, selected]);

  const allSelected =
    data.length > 0 && data.every((row) => selected.some((item) => String(item.id) === String(row.id)));

  const toggleSelect = (selectedItem: T) => {
    setSelected((prev) => {
      const exists = prev.some((item) => String(item.id) === String(selectedItem.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(selectedItem.id));
      }
      return [...prev, selectedItem];
    });
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

  const orderedData = useMemo(() => {
    if (!selected.length) return sortedData;
    const selectedIds = new Set(selected.map((item) => String(item.id)));
    if (selectedIds.size === 0) return sortedData;
    const selectedRows = sortedData.filter((row) => selectedIds.has(String(row.id)));
    const remainingRows = sortedData.filter((row) => !selectedIds.has(String(row.id)));
    return [...selectedRows, ...remainingRows];
  }, [sortedData, selected]);

  return {
    selected,
    allSelected,
    toggleSelect,
    selectAll,
    sortKey,
    sortDirection,
    handleSort,
    sortedData: orderedData,
  };
};


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
    initialSelectedIds,
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
  } = useTableContent<T>({ data, defaultSortKey, defaultSortDirection, initialSelectedIds });
  
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

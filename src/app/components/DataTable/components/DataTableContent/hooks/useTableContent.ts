// hooks/useTableContent.ts
import { useEffect, useMemo, useState } from "react";

import { SortDirection,UseDataTableContentProps,UseTableContentProps } from "./types";

const haveSameIds = <T extends { id: string | number }>(a: T[], b: T[]) => {
  if (a.length !== b.length) return false;
  const ids = new Set(a.map((item) => String(item.id)));
  if (ids.size !== b.length) return false;
  return b.every((item) => ids.has(String(item.id)));
};
/** ðŸ”¹ Hook base: selecciÃ³n y ordenamiento */
export const useTableContent = <T extends { id: string | number }>({
  data,
  defaultSortKey,
  defaultSortDirection,
  initialSelectedIds,
  selectionMode,
}: UseTableContentProps<T>) => {
  const [selected, setSelected] = useState<T[]>([]);
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey ?? null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection ?? null);

  const isSingleSelection = selectionMode === "single";

  useEffect(() => {
    if (initialSelectedIds == null) return;
    const map = new Map(data.map((item) => [String(item.id), item]));
    let nextSelection = initialSelectedIds
      .map((id) => map.get(String(id)))
      .filter((row): row is T => Boolean(row));

    if (isSingleSelection && nextSelection.length > 1) {
      nextSelection = nextSelection.slice(0, 1);
    }

    setSelected((prev) => {
      if (haveSameIds(prev, nextSelection)) {
        return prev;
      }
      return nextSelection;
    });
  }, [initialSelectedIds, data, isSingleSelection]);

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
      return isSingleSelection ? [selectedItem] : [...prev, selectedItem];
    });
  };

  const selectAll = (value: boolean) => {
    if (isSingleSelection) {
      setSelected(value && data.length > 0 ? [data[0]] : []);
      return;
    }

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


export const useDataTableContent = <T extends { id: string | number }>(
  {
    data,
    defaultSortKey,
    defaultSortDirection,
    enablePagination = true,
    paginationMode = "client",
    rowsPerPage = 10,
    currentPage,
    totalRows,
    enableInternalSearch = true,
    onPageChange,
    rowHeight = 56,
    scrollMaxHeight,
    initialSelectedIds,
    selectionMode,
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
  } = useTableContent<T>({ data, defaultSortKey, defaultSortDirection, initialSelectedIds, selectionMode });
  const isServerPagination = paginationMode === "server";

  // paginaciÃ³n
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const resolvedCurrentPage = isServerPagination
    ? Math.max(currentPage ?? 1, 1)
    : localCurrentPage;
  const totalItems =
    isServerPagination || !enableInternalSearch
      ? (totalRows ?? sortedData.length)
      : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  useEffect(() => {
    if (!enablePagination || isServerPagination) return;
    if (localCurrentPage > totalPages) {
      setLocalCurrentPage(totalPages);
    }
  }, [enablePagination, isServerPagination, totalPages, localCurrentPage]);



  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    if (isServerPagination) return sortedData;
    const start = (resolvedCurrentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, resolvedCurrentPage, rowsPerPage, enablePagination, isServerPagination]);

  const handlePage = (page: number) => {
    if (!isServerPagination) {
      setLocalCurrentPage(page);
    }
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
    // selecciÃ³n + orden
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
    // paginaciÃ³n
    currentPage: resolvedCurrentPage,
    totalPages,
    handlePage,
    // layout
    showScroll,
    computedMaxHeight,
  };
};


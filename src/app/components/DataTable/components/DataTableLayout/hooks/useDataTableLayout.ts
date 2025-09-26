import { useCallback,useState } from "react";
import type { KeyboardEvent } from "react";

import type { TableLayoutProps } from "../types";

/** Extrae y memoiza toda la lógica/handlers del layout de tabla */
export const useDataTableLayout = (props: TableLayoutProps) => {
  const {
    onSearchChange,
    onCalendarClick,
    onDateRangeChange, // “oficial”
    onSearch,
    onFilterClick,
    onFilterChange,
    actionsRender,
    onTableActionClick,
    actionLabel = "Agregar",
    showCalendar = true,
    showFilter = false,
    showButton = true,
    onDownload,
  } = props;
 const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const closeDownloadMenu = () => setIsDownloadOpen(false);
  const handleDownload = (kind: "pdf" | "excel") => {
    onDownload?.(kind);
    closeDownloadMenu();
  };
  /** Puente único para despachar el rango hacia arriba */
  const handleDateRange = useCallback(
    (start: Date, end: Date) => {
      onDateRangeChange?.(start, end); // callback “nuevo”
      onCalendarClick?.(start, end);   // compatibilidad
    },
    [onDateRangeChange, onCalendarClick]
  );

  /** Input de búsqueda */
  const handleInputChange = useCallback(
    (value: string) => {
      onSearchChange?.(value);
    },
    [onSearchChange]
  );

  const handleSearchClick = useCallback(() => {
    onSearch?.();
  }, [onSearch]);

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSearch?.();
    },
    [onSearch]
  );

  return {
    // handlers expuestos
    handleDateRange,
    handleInputChange,
    handleSearchClick,
    handleInputKeyDown,

    // callbacks y opciones que pasan tal cual
    onFilterClick,
    actionsRender,
    onTableActionClick,
    actionLabel,
    showCalendar,
    showFilter,
    showButton,
    isDownloadOpen,
    setIsDownloadOpen,
    handleDownload
    ,
    // Passthrough view toggle
    showViewToggle: props.showViewToggle,
    isCardsView: props.isCardsView,
    onToggleView: props.onToggleView,
    onFilterChange,
    filterOptions: props.filterOptions,
    filterValue: props.filterValue,
    filterTitle: props.filterTitle
  };
};

export type UseDataTableLayoutReturn = ReturnType<typeof useDataTableLayout>;

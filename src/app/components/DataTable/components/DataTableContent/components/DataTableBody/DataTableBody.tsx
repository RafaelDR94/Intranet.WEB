import React from "react";

import { useBreakpoint } from "../../../DataTableLayout/hooks/useMediaQuery";

import { Checkbox } from "@/app/components/CheckBox/CheckBox";
import type { SelectionMode } from "@/app/components/DataTable/types";

export type TextSize = {
  /** clases para móvil: ej. 'c3' o 'text-sm' */
  mobile?: string;
  /** clases para tablet: ej. 'b3' o 'text-base' */
  tablet?: string;
  /** clases para desktop: ej. 'b2' o 'text-base' */
  desktop?: string;
};

export type Column<T> = {
  key: keyof T;
  invisible?: boolean;
  cellClass?: string;
  render?: (row: T) => React.ReactNode;
};

export type DataTableBodyProps<T extends { id: string | number }> = {
  data: T[];
  columns: Array<Column<T>>;
  enableSelection?: boolean;
  disableSelection?: boolean;
  selectionMode?: SelectionMode;
  selected: T[];
  onToggleSelect: (row: T) => void;
  /** Nuevo: controla tamaños de texto por breakpoint */
  textSize?: TextSize;
};

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export const DataTableBodyStyles = {
  bodyContainer:
    "flex items-center px-4 py-1 rounded-md hover:bg-gray-10 transition-colors",
  checkBoxContainer: "w-6 mr-4",
  // ahora como funciones con default
  tableTextMobile: (size = "c3") => cx(size, "text-gray-70", "font-medium"),
  tableTextTablet: (size = "d3") => cx(size, "text-gray-70", "font-medium"),
  tableTextDesk: (size = "b2") => cx(size, "text-gray-70", "font-medium"),
};

export const DataTableBody = <T extends { id: string | number }>({
  data,
  columns,
  enableSelection,
  selected,
  disableSelection,
  onToggleSelect,
  textSize,
}: DataTableBodyProps<T>) => {
  const {isMobile, isTablet} = useBreakpoint();
  const selectedIds = React.useMemo(
    () => new Set(selected.map((item) => String(item.id))),
    [selected],
  );

  const mobileText = DataTableBodyStyles.tableTextMobile(textSize?.mobile);
  const tabletText = DataTableBodyStyles.tableTextTablet(textSize?.tablet);
  const deskText = DataTableBodyStyles.tableTextDesk(textSize?.desktop);

  return (
    <>
      {data.map((row, index) => {
        const isSelected = selectedIds.has(String(row.id));
        return (
          <div
            key={`${row?.id}-${index}`}
            className={DataTableBodyStyles.bodyContainer}
          >
            {enableSelection && (
              <div className={DataTableBodyStyles.checkBoxContainer}>
                <Checkbox
                  checked={isSelected}
                  disabled={Boolean(disableSelection)}
                  onChange={() => {
                    if (disableSelection) return;
                    onToggleSelect(row);
                  }}
                />
              </div>
            )}
            {columns.map((col) => {
              if (col.invisible) return null;
              return (
                <div
                  key={String(col.key)}
                  className={cx(
                    isMobile ? mobileText : isTablet ? tabletText : deskText,
                    col.cellClass ?? "flex-1",
                  )}
                >
                  {col.render ? col.render(row) : String(row[col.key])}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

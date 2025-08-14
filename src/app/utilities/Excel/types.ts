import type ExcelJS from "exceljs";

/** Alignment options for Excel columns */
export type ColumnAlign = "left" | "center" | "right";

/** Supported data types for Excel columns */
export type ColumnType = "string" | "number" | "date";

/** Column definition for export */
export interface ColumnDef {
  key: string;
  header: string;
  type?: ColumnType;
  numFmt?: string;
  width?: number;
  align?: ColumnAlign;
}

/** Sheet input definition for Excel export */
export interface SheetInput {
  name?: string;
  columns: ColumnDef[];
  rows: Record<string, unknown>[];
  sumColumnKey?: string;
  sumLabel?: string;
  startRow?: number;
}

/** Metadata header for the Excel document */
export interface MetaHeader {
  title?: string;
  cliente?: string;
  mes?: string;
  proyecto?: string;
  semana?: string;
}

/** Parameters for the exportExcelPro utility */
export interface ExportExcelProParams {
  fileName: string;
  sheets: SheetInput[];
  logoBase64?: string;
  meta?: MetaHeader;

  /** Formatting and totals */
  useExcelFormulaTotals?: boolean;
  currencySymbol?: string;

  /** Sheet UX options */
  freezeHeader?: boolean;
  autoFilter?: boolean;
  zebra?: boolean;

  /**
   * Hook for each cell, allowing custom value/style without forks.
   * rowIndex: 1..N over data (excludes header).
   * colIndex: absolute index in the sheet (includes "Consecutivo" in col = 1).
   */
  onCell?: (args: {
    sheetName: string;
    rowIndex: number;
    colIndex: number;
    cell: ExcelJS.Cell;
    value: unknown;
    column?: ColumnDef;
  }) => void;

  /** Injection of saving method (browser only). In SSR returns buffer. */
  saver?: (blob: Blob, fileName: string) => void;
}

export type OnCellHook = NonNullable<ExportExcelProParams["onCell"]>;

/** Parameters for drawing the header section */
export interface HeaderPaintParams {
  sheet: ExcelJS.Worksheet;
  logoBase64?: string;
  meta?: MetaHeader;
  startCol: number;
  spanCols: number;
  startRow: number;
}

/** Parameters for rendering a table */
export interface PaintTableParams {
  sheet: ExcelJS.Worksheet;
  sheetName: string;
  columns: ColumnDef[];
  rows: Record<string, unknown>[];
  startRow: number;
  currencySymbol?: string;
  zebra?: boolean;
  onCell?: ExportExcelProParams["onCell"];
}

/** Parameters for drawing totals row */
export interface PaintTotalsParams {
  sheet: ExcelJS.Worksheet;
  sumColumnKey?: string;
  columns: ColumnDef[];
  label?: string;
  firstDataRow: number;
  lastDataRow: number;
  currencySymbol?: string;
  useExcelFormulaTotals?: boolean;
}

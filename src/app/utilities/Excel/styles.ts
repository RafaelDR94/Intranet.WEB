import type ExcelJS from "exceljs";

import type { ColumnAlign } from "./types";

/** Apply default header styling */
export const applyHeaderStyle = (row: ExcelJS.Row) => {
  row.font = { bold: true };
  row.eachCell((cell) => {
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } };
    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });
};

/** Apply borders to body rows */
export const applyBodyRowStyle = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.border = { top: { style: "hair" }, bottom: { style: "hair" }, left: { style: "hair" }, right: { style: "hair" } };
  });
};

/** Apply styling for total rows */
export const applyTotalRowStyle = (row: ExcelJS.Row, valueColIdx: number, currencySymbol?: string) => {
  row.font = { bold: true };
  row.eachCell((cell) => {
    cell.border = { top: { style: "double" }, bottom: { style: "double" }, left: { style: "thin" }, right: { style: "thin" } };
  });
  const valueCell = row.getCell(valueColIdx);
  if (!valueCell.numFmt) valueCell.numFmt = currencySymbol ? `"${currencySymbol}"#,##0.00` : "#,##0.00";
};

/** Auto size columns or keep provided width */
export const autoSizeOrWidth = (sheet: ExcelJS.Worksheet, startCol: number, endCol: number) => {
  for (let c = startCol; c <= endCol; c++) {
    const col = sheet.getColumn(c);
    if (!col.width) {
      let maxLen = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const v = String(cell.value ?? "");
        maxLen = Math.max(maxLen, v.length + 2);
      });
      col.width = Math.min(Math.max(maxLen, 12), 60);
    }
  }
};

/** Set number formatting if provided */
export const setNumFmtIfAny = (cell: ExcelJS.Cell, fmt?: string) => {
  if (fmt) cell.numFmt = fmt;
};

/** Map alignment keywords to ExcelJS alignment objects */
export const pickAlignment = (align?: ColumnAlign) => {
  switch (align) {
    case "center":
      return { horizontal: "center" as const };
    case "right":
      return { horizontal: "right" as const };
    default:
      return { horizontal: "left" as const };
  }
};

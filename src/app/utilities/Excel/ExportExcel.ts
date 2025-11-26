// src/utilities/excel/exporter.ts
import ExcelJS from "exceljs";

import {
  applyHeaderStyle,
  applyBodyRowStyle,
  applyTotalRowStyle,
  autoSizeOrWidth,
  setNumFmtIfAny,
  pickAlignment,
} from "./styles";
import type {
  ColumnType,
  ExportExcelProParams,
  HeaderPaintParams,
  PaintTableParams,
  PaintTotalsParams,
} from "./types";

export type {
  ColumnAlign,
  ColumnType,
  ColumnDef,
  SheetInput,
  MetaHeader,
  ExportExcelProParams,
  HeaderPaintParams,
  PaintTableParams,
  PaintTotalsParams,
} from "./types";

/* ========================= Helpers puros ========================= */

/**
 * Convierte un índice de columna basado en 1 a su representación en letras.
 * @param n Índice numérico de la columna (1 = A).
 */
const colIndexToLetter = (n: number) => {
  let temp = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    temp = String.fromCharCode(65 + r) + temp;
    n = Math.floor((n - r) / 26);
  }
  return temp;
};

/**
 * Normaliza un valor a número seguro para cálculos.
 * @param value Valor potencialmente numérico.
 */
const normalizeNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[\s,]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

/**
 * Determina el formato numérico por defecto según el tipo de columna.
 * @param type Tipo de la columna.
 * @param currencySymbol Símbolo de moneda opcional.
 */
const defaultNumFmtForType = (type?: ColumnType, currencySymbol?: string) => {
  if (type === "number") return currencySymbol ? `"${currencySymbol}"#,##0.00` : "#,##0.00";
  if (type === "date") return "yyyy-mm-dd";
  return undefined;
};

/* ========================= Pintado de cabecera/meta ========================= */

/**
 * Dibuja la sección de cabecera con logo y metadatos.
 * @param params Configuración de la cabecera.
 */
const paintHeader = ({ sheet, logoBase64, meta, startCol, spanCols, startRow }: HeaderPaintParams) => {
  if (logoBase64) {
    const id = sheet.workbook.addImage({ base64: logoBase64, extension: "png" });
    sheet.addImage(id, { tl: { col: 0, row: 0 }, ext: { width: 200, height: 100 } });
  }

  const title = meta?.title ?? "";
  const titleStartCol = startCol;
  const titleEndCol = startCol + spanCols - 1;

  sheet.mergeCells(startRow, titleStartCol, startRow, titleEndCol);
  const titleCell = sheet.getCell(startRow, titleStartCol);
  titleCell.value = title;
  titleCell.font = { size: 14, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDD7EE" } };

  const metaRow1 = sheet.getRow(startRow + 1);
  metaRow1.getCell(titleStartCol).value = meta?.cliente ? `CLIENTE: ${meta.cliente}` : "";
  sheet.mergeCells(startRow + 1, titleStartCol, startRow + 1, titleStartCol + Math.floor(spanCols / 2) - 1);
  metaRow1.getCell(titleEndCol).value = meta?.mes ? `MES: ${meta.mes}` : "";

  const metaRow2 = sheet.getRow(startRow + 2);
  metaRow2.getCell(titleStartCol).value = meta?.proyecto ? `PROYECTO: ${meta.proyecto}` : "";
  sheet.mergeCells(startRow + 2, titleStartCol, startRow + 2, titleStartCol + Math.floor(spanCols / 2) - 1);
  metaRow2.getCell(titleEndCol).value = meta?.semana ? `SEMANA: ${meta.semana}` : "";

  sheet.addRow([]);
  sheet.addRow([]);
  sheet.addRow([]);
};

/* ========================= Pintado de tabla (Pro) ========================= */

/**
 * Pinta las cabeceras y filas de datos en la hoja.
 * @param params Configuración de la tabla.
 */
const paintTable = ({ sheet, sheetName, columns, rows, startRow, currencySymbol, zebra, onCell }: PaintTableParams) => {
  const headerRow = sheet.getRow(startRow);
  const headers = ["Consecutivo", ...columns.map((c) => c.header)];
  headers.forEach((h, i) => (headerRow.getCell(i + 1).value = h));
  applyHeaderStyle(headerRow);

  sheet.getColumn(1).width = sheet.getColumn(1).width ?? 15;
  columns.forEach((c, idx) => {
    const col = sheet.getColumn(idx + 2);
    if (c.width) col.width = c.width;
    col.alignment = { ...pickAlignment(c.align), vertical: "middle" };
  });

  const firstDataRow = startRow + 1;
  rows.forEach((r, i) => {
    const row = sheet.getRow(firstDataRow + i);
    // consecutivo
    const consecutivo = row.getCell(1);
    consecutivo.value = i + 1;
    consecutivo.alignment = { horizontal: "center" };

    columns.forEach((c, colIdx) => {
      const cell = row.getCell(colIdx + 2);
      const v = (r as any)[c.key];

      if (c.type === "number") {
        const n = normalizeNumber(v);
        cell.value = n;
        const fmt = c.numFmt ?? defaultNumFmtForType(c.type, currencySymbol);
        setNumFmtIfAny(cell, fmt);
        cell.alignment = pickAlignment(c.align ?? "right");
      } else if (c.type === "date") {
        cell.value = v instanceof Date ? v : v ? new Date(v as any) : null;
        const fmt = c.numFmt ?? defaultNumFmtForType(c.type);
        setNumFmtIfAny(cell, fmt);
        cell.alignment = pickAlignment(c.align ?? "center");
      } else {
        cell.value = v ?? "";
        cell.alignment = pickAlignment(c.align ?? "left");
      }

      onCell?.({
        sheetName,
        rowIndex: i + 1,
        colIndex: colIdx + 2,
        cell,
        value: v,
        column: c,
      });
    });

    // zebra (opcional)
    if (zebra && (i + 1) % 2 === 0) {
      row.eachCell((c) => (c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F9FC" } }));
    }

    applyBodyRowStyle(row);
    // llama onCell también para la col 1 (consecutivo)
    onCell?.({ sheetName, rowIndex: i + 1, colIndex: 1, cell: row.getCell(1), value: i + 1 });
  });

  autoSizeOrWidth(sheet, 1, columns.length + 1);

  return {
    headerRowIndex: startRow,
    firstDataRow,
    lastDataRow: firstDataRow + rows.length - 1,
  };
};

/* ========================= Totales ========================= */

/**
 * Calcula y pinta la fila de totales de la tabla.
 * @param params Configuración de totales.
 */
const paintTotals = ({
  sheet,
  sumColumnKey,
  columns,
  label = "TOTAL",
  firstDataRow,
  lastDataRow,
  currencySymbol,
  useExcelFormulaTotals,
}: PaintTotalsParams) => {
  if (!sumColumnKey) return;

  const colIdxInColumns = columns.findIndex((c) => c.key === sumColumnKey);
  if (colIdxInColumns === -1) return;

  const valueColIdx = colIdxInColumns + 2;
  const totalRow = sheet.addRow(new Array(columns.length + 1).fill(""));

  const labelColIdx = valueColIdx - 1;
  totalRow.getCell(labelColIdx).value = label;
  totalRow.getCell(labelColIdx).alignment = { horizontal: "right" };
  totalRow.font = { bold: true };

  if (useExcelFormulaTotals && lastDataRow >= firstDataRow) {
    const colLetter = colIndexToLetter(valueColIdx);
    totalRow.getCell(valueColIdx).value = { formula: `SUM(${colLetter}${firstDataRow}:${colLetter}${lastDataRow})` };
  } else {
    let sum = 0;
    for (let r = firstDataRow; r <= lastDataRow; r++) {
      const v = sheet.getRow(r).getCell(valueColIdx).value as number | string | null;
      sum += normalizeNumber(v as any);
    }
    totalRow.getCell(valueColIdx).value = sum;
  }

  applyTotalRowStyle(totalRow, valueColIdx, currencySymbol);
  sheet.addRow([]);
};

/* ========================= API principal (Pro) ========================= */

/**
 * Genera un archivo de Excel con múltiples hojas y estilos personalizados.
 * - Totales por key (resiliente al reordenamiento de columnas).
 * - SSR-safe: no depende de file-saver; descarga solo si se provee `saver` en navegador.
 * - Extras Pro: autoFilter, zebra rows, hook `onCell`.
 * @param params Parámetros de configuración de la exportación.
 */
export const exportExcelPro = async ({
  fileName,
  sheets,
  logoBase64,
  meta,
  useExcelFormulaTotals = true,
  currencySymbol = "$",
  freezeHeader = true,
  autoFilter = true,
  zebra = false,
  onCell,
  saver,
}: ExportExcelProParams) => {
  const workbook = new ExcelJS.Workbook();

  for (const s of sheets) {
    const sheet = workbook.addWorksheet(s.name || "Hoja", { properties: { defaultRowHeight: 18 } });

    // 1) Cabecera (logo + meta)
    const headerStartRow = 2;
    const headerStartCol = 3;
    const titleSpanCols = 3;
    paintHeader({
      sheet,
      logoBase64,
      meta,
      startCol: headerStartCol,
      spanCols: titleSpanCols,
      startRow: headerStartRow,
    });

    // 2) Tabla Pro
    const startRow = s.startRow ?? headerStartRow + 5;
    const { firstDataRow, lastDataRow, headerRowIndex } = paintTable({
      sheet,
      sheetName: s.name || "Hoja",
      columns: s.columns,
      rows: s.rows,
      startRow,
      currencySymbol,
      zebra,
      onCell,
    });

    // 3) UX: freeze + autoFilter
    if (freezeHeader) sheet.views = [{ state: "frozen", ySplit: headerRowIndex }];
    if (autoFilter) {
      sheet.autoFilter = {
        from: { row: headerRowIndex, column: 1 },
        to: { row: headerRowIndex, column: s.columns.length + 1 },
      };
    }

    // 4) Totales
    paintTotals({
      sheet,
      sumColumnKey: s.sumColumnKey,
      columns: s.columns,
      label: s.sumLabel ?? "TOTAL",
      firstDataRow,
      lastDataRow,
      currencySymbol,
      useExcelFormulaTotals,
    });
  }

  // 5) Emitir buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // 6) Guardar si se inyectó saver (solo browser)
  if (typeof window !== "undefined" && saver) {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saver(blob, `${fileName}.xlsx`);
    return { buffer, blob };
  }

  return { buffer };
};

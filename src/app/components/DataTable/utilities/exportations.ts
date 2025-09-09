"use client";

import { saveAs } from "file-saver";

import { DataTableGroup } from "../types";

import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";
import { ColumnDef, SheetInput, exportExcelPro } from "@/app/utilities/Excel/ExportExcel";
import { newDocument, Table, FullDocument ,CreatePDF} from "@/app/utilities/PDF/PDF";
import { urlToBase64 } from "@/app/utilities/PicturesHelper/PictureHelper";
import Logo from "@/assets/images/LogosDR/DRLogoOficial.png";
type Column = { key: string; label: string; invisible?: boolean };

const toPdfColumns = (
  defs: Array<
    {
      key?: PropertyKey;
      label?: string;
      header?: string;
      id?: PropertyKey;
      accessorKey?: PropertyKey;
      invisible?: boolean;
      width?: number;
    }
  >
): Column[] =>
  defs
    .filter(d => !d.invisible)
    .map(d => {
      const keyPk = d.key ?? d.accessorKey ?? d.id ?? d.label ?? d.header ?? "";
      const label =
        d.label ??
        (typeof d.header === "string" ? d.header : String(d.header ?? keyPk));

      return {
        key: String(keyPk),
        label: String(label),
        invisible: !!d.invisible,
      };
    });

// cuántas filas por página
const MAX_ROWS_PER_PAGE = 10;

/** Convierte una tabla (columns + rows) a un arreglo de páginas PDF */
const buildPagesFromTable = (
  title: string,
  columns: Column[],
  rows: any[],
  orientation: "horizontal" | "vertical" = "horizontal"
): newDocument[] => {
  const visibleCols = columns.filter((c) => !c.invisible);
  const headers = visibleCols.map((c) => c.label);
  const keys = visibleCols.map((c) => c.key);

  const tableData: string[][] = rows.map((row) =>
    keys.map((k) => {
      const v = row?.[k];
      return v == null ? "" : String(v);
    })
  );

  const pages: newDocument[] = [];
  for (let i = 0; i < tableData.length || (i === 0 && tableData.length === 0); i += MAX_ROWS_PER_PAGE) {
    const chunk = tableData.slice(i, i + MAX_ROWS_PER_PAGE);
    const page: newDocument = {
      title: i === 0 ? title : "",
      folio: currentDate(),
      orientation,
      elements: [
        {
          title,
          headers,
          datatable: chunk.length ? chunk : [["Sin datos"]],
          relation: Array(headers.length).fill(1),
        } as Table,
      ],
    };
    pages.push(page);
  }
  return pages;
};

export const exportFiles = (kind: 'pdf' | 'excel', tables: DataTableGroup<any>[], selectedRows: Record<number, any[]>, tableIndex?: number, dataTableTitle?: string) => {
  let excelRows: Record<string, any>[] = []
  let excelColumns: ColumnDef[] = []
  let sheets: SheetInput[] = []
  if (typeof tableIndex === 'number') {
    excelColumns = tables[tableIndex].columns.map(col => {
      if (col.invisible) return null
      return {
        key: col.key,
        header: col.label,
      }
    }).filter(Boolean) as ColumnDef[]
    excelRows = selectedRows[tableIndex].map(row => {
      const newRow: Record<string, any> = {}
      excelColumns.forEach(col => {
        newRow[col.key] = row[col.key as keyof any]
      })
      return newRow
    })
    sheets = [
      {
        name: tables[tableIndex].title || `Sheet${tableIndex + 1}`,
        columns: excelColumns,
        rows: excelRows,
      },
    ]

  } else {
    Object.keys(selectedRows).forEach((key) => {

      excelColumns = tables[Number(key)].columns.map(col => {
        if (col.invisible) return null
        return {
          key: col.key,
          header: col.label,
        }
      }).filter(Boolean) as ColumnDef[]
      excelRows = selectedRows[Number(key)].map(row => {
        const newRow: Record<string, any> = {}
        excelColumns.forEach(col => {
          newRow[col.key] = row[col.key as keyof any]
        })
        return newRow
      })
      sheets.push({
        name: tables[Number(key)].title || `Sheet${Number(key) + 1}`,
        columns: excelColumns,
        rows: excelRows,
      })
    })
  }

  if (kind === 'excel') {

    ExportExcel(sheets, dataTableTitle ?? "Exportación de tabla");
    return;
  }
  ExportPDF(tables, selectedRows, tableIndex, dataTableTitle);
};

const ExportExcel = async (sheets: SheetInput[], dataTableTitle: string) => {
  const logo = await urlToBase64(Logo.src);
  await exportExcelPro({
    fileName: dataTableTitle,
    logoBase64: logo,
    sheets: sheets,
    meta: {
      title: dataTableTitle,
    },
    zebra: true,
    autoFilter: true,
    saver: (blob, fileName) => saveAs(blob, fileName)
  });
}
export const ExportPDF = async (
  tables: DataTableGroup<any>[],
  selectedRows: Record<number, any[]>,
  tableIndex?: number,
  fileName = "Exportación de tabla"
) => {
  const pages: newDocument[] = [];

  if (typeof tableIndex === "number") {
    const t = tables[tableIndex];
    const rows = selectedRows[tableIndex] ?? [];
    pages.push(
      ...buildPagesFromTable(
        t.title || `Tabla ${tableIndex + 1}`,
        toPdfColumns(t.columns),   // <-- aquí convertimos
        rows,
        "horizontal"
      )
    );
  } else {
    Object.keys(selectedRows).forEach((k) => {
      const idx = Number(k);
      const t = tables[idx];
      const rows = selectedRows[idx] ?? [];
      pages.push(
        ...buildPagesFromTable(
          t.title || `Tabla ${idx + 1}`,
          toPdfColumns(t.columns),
          rows,
          "horizontal"
        )
      );
    });
  }

  const doc: FullDocument = { pages };

  const setPdf = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName + `.pdf`; // Nombre del archivo descargado
    link.click(); // Simula el click en el enlace de descarga
  }
  CreatePDF(doc, setPdf);

};
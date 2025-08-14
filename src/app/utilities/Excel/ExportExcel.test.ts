import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { exportExcelPro, type SheetInput } from './ExportExcel';

describe('exportExcelPro utility', () => {
  it('generates a workbook buffer with provided sheet', async () => {
    const sheets: SheetInput[] = [{
      name: 'Test',
      columns: [{ key: 'name', header: 'Name' }],
      rows: [{ name: 'Alice' }],
    }];

    const { buffer } = await exportExcelPro({ fileName: 'file', sheets, autoFilter: false });
    expect(buffer.byteLength).toBeGreaterThan(0);

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer);
    const ws = wb.getWorksheet('Test');
    expect(ws).toBeDefined();
  });
});

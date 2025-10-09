import { mapReportDevicesExternal } from '@/app/mappings/reports/report.mapper';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';

export const mapToReportDeviceView = (raw: unknown): ReportDeviceView | null => {
  if (!raw) return null;
  const items = Array.isArray(raw) ? raw : [raw];
  const mapped = mapReportDevicesExternal(items as any[]);
  return mapped[0] ?? null;
};

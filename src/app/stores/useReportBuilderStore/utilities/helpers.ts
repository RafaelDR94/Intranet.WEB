import { reportsdb } from '@/app/configurations/DataBase/bases';
import type { ReportView } from '@/app/mappings/reports/reports.types';

export type ReportDocument = {
  id?: number;
  report: ReportView;
  dateCreated: string;
  frontId: string;
  updatedAt?: string;
};

export const findReportDocumentByFrontId = async (frontId: string): Promise<ReportDocument | undefined> => {
  if (!frontId) return undefined;
  const doc = await reportsdb.documents.filter((record) => record.frontId === frontId).first();
  return doc as ReportDocument | undefined;
};
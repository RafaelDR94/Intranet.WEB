'use client'

import type { GetReportState, SetReportState } from '../types';
import { findReportDocumentByFrontId, ReportDocument } from './helpers';

export const readReportDB = async (
  set: SetReportState,
  _get: GetReportState,
  frontId: string
): Promise<ReportDocument | null> => {
  if (!frontId) return null;

  set({ readingDB: true, succesreadingDB: false, error: undefined });

  try {
    const document = await findReportDocumentByFrontId(frontId);
    if (!document) {
      throw new Error('No se encontro ningun reporte local con el identificador proporcionado.');
    }

    const report = { ...document.report, front_identifier: frontId };
    set({
      report,
      readingDB: false,
      succesreadingDB: true,
      currentReportfrontguid: frontId,
      isReportHydrated: true,
    });

    return { ...document, report };
  } catch (error) {
    set({ readingDB: false, succesreadingDB: false, error: String(error) });
    return null;
  }
};
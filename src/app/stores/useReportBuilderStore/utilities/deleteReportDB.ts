'use client'

import { reportsdb } from '@/app/configurations/DataBase/bases';

import { createEmptyReport } from './createEmptyReport';
import type { GetReportState, SetReportState } from '../types';
import { findReportDocumentByFrontId } from './helpers';

export const deleteReportDB = async (
  set: SetReportState,
  get: GetReportState,
  frontId?: string
): Promise<boolean> => {
  const targetFrontId = frontId ?? get().currentReportfrontguid ?? get().report.front_identifier;
  if (!targetFrontId) return false;

  set({ deletingDB: true, succesdeletingDB: false, error: undefined });

  try {
    const existing = await findReportDocumentByFrontId(targetFrontId);
    if (!existing?.id) {
      throw new Error('No se encontro un reporte para eliminar.');
    }

    await reportsdb.documents.delete(existing.id);

    set({
      report: createEmptyReport(),
      deletingDB: false,
      succesdeletingDB: true,
      currentReportfrontguid: undefined,
      isReportHydrated: false,
    });

    return true;
  } catch (error) {
    set({ deletingDB: false, succesdeletingDB: false, error: String(error) });
    return false;
  }
};
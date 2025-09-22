'use client'

import { createDocument } from '@/app/configurations/DataBase/crud';
import { reportsdb } from '@/app/configurations/DataBase/bases';
import { getCurrentDateTime } from '@/app/utilities/DatesHelper/Dateshelper';
import { generateGUID } from '@/app/utilities/Generators/Generators';
import type { ReportView } from '@/app/mappings/reports/reports.types';

import type { GetReportState, SetReportState } from '../types';
import { findReportDocumentByFrontId, ReportDocument } from './helpers';

const formatNow = () => getCurrentDateTime().replace('T', ' ');

export const createReportDB = async (
  set: SetReportState,
  get: GetReportState,
  force?: boolean
): Promise<ReportDocument | null> => {
  const state = get();
  const frontIdFromState = state.currentReportfrontguid ?? state.report.front_identifier;

  set({ creatingDB: true, succescreatingDB: false, error: undefined });

  if (frontIdFromState && !force) {
    const existing = await findReportDocumentByFrontId(frontIdFromState);
    if (existing) {
      const report: ReportView = {
        ...existing.report,
        front_identifier: frontIdFromState,
      };
      set({
        report,
        creatingDB: false,
        succescreatingDB: false,
        currentReportfrontguid: frontIdFromState,
        isReportHydrated: true,
      });
      return { ...existing, report };
    }

    set({ creatingDB: false, succescreatingDB: false, error: 'No se encontro un reporte local con el identificador proporcionado.', isReportHydrated: false });
    return null;
  }

  try {
    const newGuid = generateGUID();
    const timestamp = formatNow();
    const report: ReportView = {
      ...state.report,
      front_identifier: newGuid,
    };
    const newDocument: ReportDocument = {
      report,
      dateCreated: timestamp,
      updatedAt: timestamp,
      frontId: newGuid,
    };

    const id = await createDocument(newDocument, reportsdb);
    const createdDoc: ReportDocument = { ...newDocument, id };

    set({
      report,
      creatingDB: false,
      succescreatingDB: true,
      currentReportfrontguid: newGuid,
      isReportHydrated: true,
    });

    return createdDoc;
  } catch (error) {
    set({ creatingDB: false, succescreatingDB: false, error: String(error) });
    return null;
  }
};
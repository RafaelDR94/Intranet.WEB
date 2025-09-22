'use client'

import { reportsdb } from '@/app/configurations/DataBase/bases';
import { getCurrentDateTime } from '@/app/utilities/DatesHelper/Dateshelper';

import type { GetReportState, SetReportState } from '../types';
import { createReportDB } from './createReportDB';
import { findReportDocumentByFrontId, ReportDocument } from './helpers';

const formatNow = () => getCurrentDateTime().replace('T', ' ');

export const updateReportBD = async (
  set: SetReportState,
  get: GetReportState
): Promise<ReportDocument | null> => {
  const state = get();
  const frontId = state.currentReportfrontguid ?? state.report.front_identifier;

  if (!frontId) {
    return createReportDB(set, get);
  }

  set({ updatingDB: true, succesupdatingDB: false, error: undefined });

  try {
    const existing = await findReportDocumentByFrontId(frontId);
    const timestamp = formatNow();
    const report = { ...state.report, front_identifier: frontId };

    const payload: Omit<ReportDocument, 'id'> = {
      report,
      frontId,
      dateCreated: existing?.dateCreated ?? timestamp,
      updatedAt: timestamp,
    };

    let persisted: ReportDocument;

    if (existing?.id != null) {
      await reportsdb.documents.update(existing.id, payload);
      persisted = { ...payload, id: existing.id };
    } else {
      const id = await reportsdb.documents.add(payload);
      persisted = { ...payload, id };
    }

    set({
      report,
      updatingDB: false,
      succesupdatingDB: true,
      currentReportfrontguid: frontId,
      isReportHydrated: true,
    });

    return persisted;
  } catch (error) {
    set({ updatingDB: false, succesupdatingDB: false, error: String(error) });
    return null;
  }
};
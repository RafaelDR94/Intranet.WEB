'use client'

import { reportsdb } from '@/app/configurations/DataBase/bases';
import { getCurrentDateTime } from '@/app/utilities/DatesHelper/Dateshelper';

import type { GetReportState, SetReportState } from '../types';
import { createReportDB } from './createReportDB';
import { findReportDocumentByFrontId, ReportDocument } from './helpers';

const formatNow = () => getCurrentDateTime().replace('T', ' ');
let latestPersistRequestId = 0;
let persistQueue: Promise<ReportDocument | null> = Promise.resolve(null);

export const updateReportBD = async (
  set: SetReportState,
  get: GetReportState
): Promise<ReportDocument | null> => {
  const initialState = get();
  const frontId = initialState.currentReportfrontguid ?? initialState.report.front_identifier;

  if (!frontId) {
    return createReportDB(set, get);
  }

  const requestId = ++latestPersistRequestId;
  set({ updatingDB: true, succesupdatingDB: false, error: undefined });

  const runPersist = async (): Promise<ReportDocument | null> => {
    if (requestId !== latestPersistRequestId) {
      return null;
    }

    try {
      const currentState = get();
      const currentFrontId = currentState.currentReportfrontguid ?? currentState.report.front_identifier;

      if (!currentFrontId) {
        return createReportDB(set, get);
      }

      const existing = await findReportDocumentByFrontId(currentFrontId);
      if (requestId !== latestPersistRequestId) {
        return null;
      }

      const timestamp = formatNow();
      const latestReport = {
        ...get().report,
        front_identifier: currentFrontId,
        idSpareParts: get().report.idSpareParts ?? [],
      };

      const payload: Omit<ReportDocument, 'id'> = {
        report: latestReport,
        frontId: currentFrontId,
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

      if (requestId === latestPersistRequestId) {
        set((state) => ({
          report: state.report.front_identifier
            ? state.report
            : { ...state.report, front_identifier: currentFrontId },
          updatingDB: false,
          succesupdatingDB: true,
          currentReportfrontguid: currentFrontId,
          isReportHydrated: true,
        }));
      }

      return persisted;
    } catch (error) {
      if (requestId === latestPersistRequestId) {
        set({ updatingDB: false, succesupdatingDB: false, error: String(error) });
      }
      return null;
    }
  };

  const queuedPersist = persistQueue.then(runPersist, runPersist);
  persistQueue = queuedPersist.catch(() => null);
  return queuedPersist;
};

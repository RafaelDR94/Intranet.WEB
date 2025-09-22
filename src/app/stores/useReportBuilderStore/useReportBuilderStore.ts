'use client';

import { createWithEqualityFn } from 'zustand/traditional';

import type { ReportBuilderState } from './types';
import { createEmptyReport } from './utilities/createEmptyReport';
import { createReportDB } from './utilities/createReportDB';
import { deleteReportDB } from './utilities/deleteReportDB';
import { readReportDB } from './utilities/readReportDB';
import { updateReportBD } from './utilities/updateReportBD';

export const useReportBuilderStore = createWithEqualityFn<ReportBuilderState>()((set, get) => {
  const persistIfHydrated = () => {
    if (!get().isReportHydrated) return;
    void updateReportBD(set, get);
  };

  const ensureFrontIdInState = (frontId?: string) => {
    if (!frontId) return;
    if (get().currentReportfrontguid === frontId) return;
    set((state) => ({
      currentReportfrontguid: frontId,
      report: {
        ...state.report,
        front_identifier: frontId,
      },
    }));
  };

  return {
    report: createEmptyReport(),
    currentReportfrontguid: undefined,
    isReportHydrated: false,
    creatingDB: false,
    deletingDB: false,
    updatingDB: false,
    readingDB: false,
    succescreatingDB: false,
    succesdeletingDB: false,
    succesupdatingDB: false,
    succesreadingDB: false,
    error: undefined,

    updateAdvance: ({
      ticket,
      location,
      employee,
      workposition,
      remarks,
      progress,
      diagnostic,
      solution,
      startdate,
      enddate,
      reportcategory,
    }) => {
      set((state) => ({
        report: {
          ...state.report,
          ticket: ticket ?? state.report.ticket,
          location: location ?? state.report.location,
          employe: employee ?? state.report.employe,
          workposition: workposition ?? state.report.workposition,
          remarks: remarks ?? state.report.remarks,
          progress: progress !== undefined ? String(progress) : state.report.progress,
          diagnostic: diagnostic ?? state.report.diagnostic,
          solution: solution ?? state.report.solution,
          startdate: startdate ?? state.report.startdate,
          enddate: enddate ?? state.report.enddate,
          reportcategories: reportcategory ?? state.report.reportcategories,
        },
      }));
      persistIfHydrated();
    },

    setCurrentReportfrontguid: (frontId) => {
      ensureFrontIdInState(frontId);
    },

    updateModel: ({ model, type, frontId }) => {
      set((state) => ({
        report: {
          ...state.report,
          model: model ?? state.report.model,
          type: type ?? state.report.type,
          front_identifier: frontId ?? state.report.front_identifier,
        },
      }));

      if (frontId) {
        ensureFrontIdInState(frontId);
      }

      const stateAfter = get();
      const targetFrontId = frontId ?? stateAfter.currentReportfrontguid ?? stateAfter.report.front_identifier;

      if (!targetFrontId) {
        void createReportDB(set, get);
        return;
      }

      if (!stateAfter.isReportHydrated) {
        return;
      }

      persistIfHydrated();
    },

    updateActivities: (activities) => {
      set((state) => ({ report: { ...state.report, activities } }));
      persistIfHydrated();
    },

    updateMaps: (maps) => {
      set((state) => ({ report: { ...state.report, maps } }));
      persistIfHydrated();
    },

    updateRefactions: (refactions) => {
      set((state) => ({ report: { ...state.report, refactions } }));
      persistIfHydrated();
    },

    updateClientsign: (client) => {
      set((state) => ({ report: { ...state.report, clientsign: client } }));
      persistIfHydrated();
    },

    updateSignature: (signatureUrl) => {
      set((state) => ({ report: { ...state.report, employeesignurl: signatureUrl } }));
      persistIfHydrated();
    },

    updateReportDevices: (devices) => {
      set((state) => ({ report: { ...state.report, reportDeviceView: devices } }));
      persistIfHydrated();
    },

    createReportInDB: (force) => createReportDB(set, get, force),

    readReportByFrontId: async (frontId) => {
      const document = await readReportDB(set, get, frontId);
      if (document?.frontId) {
        ensureFrontIdInState(document.frontId);
      }
      return document;
    },

    updateReportInDB: () => updateReportBD(set, get),

    deleteReportByFrontId: (frontId) => deleteReportDB(set, get, frontId),

    reset: () => {
      set({ report: createEmptyReport(), currentReportfrontguid: undefined, isReportHydrated: false });
    },

    resetflags: () => {
      set({
        creatingDB: false,
        deletingDB: false,
        updatingDB: false,
        readingDB: false,
        succescreatingDB: false,
        succesdeletingDB: false,
        succesupdatingDB: false,
        succesreadingDB: false,
        error: undefined,
      });
    },
  };
});

export default useReportBuilderStore;
import { action } from "@storybook/addon-actions";
import React, { useEffect, useMemo, useState } from "react";

import { sampleProyect, sampleReports } from "./reportFixtures";

import type { ReportView } from "@/app/mappings/reports/reports.types";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";

type ReportsStoryProviderProps = {
  children: React.ReactNode;
  initialReport?: ReportView | null;
  reports?: ReportView[];
};

export const ReportsStoryProvider: React.FC<ReportsStoryProviderProps> = ({
  children,
  initialReport = null,
  reports: reportsProp,
}) => {
  const resolvedReports = useMemo(() => reportsProp ?? sampleReports, [reportsProp]);
  const [currentReport, setCurrentReport] = useState<ReportView | null>(initialReport);

  useEffect(() => {
    setCurrentReport(initialReport ?? null);
  }, [initialReport]);

  useEffect(() => {
    const syncReport = (report: ReportView | null) => {
      action("setCurrentReport")(report);
      setCurrentReport(report ?? null);
    };

    useReportsStore.setState((prev: any) => ({
      ...prev,
      reports: resolvedReports,
      currentReport,
      loading: false,
      loadingCurrent: false,
      successGet: true,
      succesCurrent: Boolean(currentReport),
      error: undefined,
      fetchAllReportsByProyect: async () => {
        action("fetchAllReportsByProyect")(sampleProyect.id);
        return resolvedReports;
      },
      fetchReportsById: async (id: string) => {
        action("fetchReportsById")(id);
        const found = resolvedReports.find((report) => report.id === id) ?? null;
        syncReport(found);
        return found;
      },
      setCurrentReport: (report?: ReportView | null) => syncReport(report ?? null),
      clearCurrentReport: () => {
        action("clearCurrentReport")();
        syncReport(null);
      },
    }));
    return () => {
      useReportsStore.getState().reset();
    };
  }, [currentReport, resolvedReports]);

  useEffect(() => {
    const devices = resolvedReports[0]?.reportDeviceView?.map((entry, index) => ({
      id: `dev-${index + 1}`,
      fullInformation: entry.device_external_view.fullInformation,
      brand: entry.device_external_view.brand,
      model: entry.device_external_view.model,
      serialnumber: entry.device_external_view.serialnumber,
    })) ?? [];

    useProyectsStore.setState((prev) => ({
      ...prev,
      currentProyect: { ...sampleProyect, devices } as any,
    }));

    return () => {
      useProyectsStore.getState().reset();
    };
  }, [resolvedReports]);

  return <>{children}</>;
};

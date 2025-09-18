import React, { useEffect, useMemo, useState } from "react";

import { action } from "@storybook/addon-actions";

import type { ReportView } from "@/app/mappings/reports/reports.types";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";

import { sampleProyect, sampleReports } from "./reportFixtures";

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
    useReportsStore.setState((prev:any) => ({
      ...prev,
      reports: resolvedReports,
      currentReport,
      loading: false,
      successGet: true,
      fetchAllReportsByProyect: async () => {
        action("fetchAllReportsByProyect")(sampleProyect.id);
        return resolvedReports;
      },
      setCurrentReport: (report) => {
        action("setCurrentReport")(report);
        setCurrentReport(report ?? null);
      },
      clearCurrentReport: () => {
        action("clearCurrentReport")();
        setCurrentReport(null);
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

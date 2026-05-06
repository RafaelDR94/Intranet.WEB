import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport } from "../../../../../testUtils/reportFixtures";

import useDevices from "./useDevices";

let currentReportMock = createSampleReport();
let currentProyectMock: any = { devices: [] };

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
  const state = { currentReport: currentReportMock };
  return typeof selector === 'function' ? selector(state) : state;
},
}));

vi.mock("@/app/stores/useProyectsStore/useProyectsStore", () => ({
  useProyectsStore: (selector?: any) => {
  const state = { currentProyect: currentProyectMock };
  return typeof selector === 'function' ? selector(state) : state;
},
}));

describe("useDevices", () => {
  beforeEach(() => {
    currentReportMock = createSampleReport({
      reportDeviceView: [
        {
          id: "DV-9",
          device_external_view: {
            id: "DEV-9",
            brand: "Hikvision",
            model: "DS-2",
            serialnumber: "SN-9",
            fullInformation: "Hikvision DS-2 SN-9",
          },
        },
      ],
    });
    currentProyectMock = { devices: [] };
  });

  it("prefiere los dispositivos vinculados al proyecto cuando existen", () => {
    currentProyectMock = {
      devices: [
        {
          fullInformation: "",
          brand: "Axis",
          model: "P3225",
          serialnumber: "SN-1",
        },
      ],
    };

    const { result } = renderHook(() => useDevices());

    expect(result.current.rows).toEqual([
      {
        id: "1",
        index: 1,
        device: "Axis P3225 SN-1",
      },
    ]);
  });

  it("toma los dispositivos del reporte cuando el proyecto no tiene", () => {
    const { result } = renderHook(() => useDevices());

    expect(result.current.rows).toEqual([
      {
        id: "1",
        index: 1,
        device: "Hikvision DS-2 SN-9",
      },
    ]);
  });
});

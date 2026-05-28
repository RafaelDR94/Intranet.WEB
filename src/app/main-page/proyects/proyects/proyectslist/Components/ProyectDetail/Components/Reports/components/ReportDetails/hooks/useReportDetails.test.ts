import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useReportDetails from "./useReportDetails";

const fetchReportsByIdMock = vi.fn();
const fetchLocalReportByIdMock = vi.fn();
const resetFlagsMock = vi.fn();
const updateQueryMock = vi.fn();
const showAlertMock = vi.fn();

let currentReportRef: any = null;
let loadingCurrentRef = false;
let errorRef: string | undefined;
let reportIdRef: string | undefined;
let frontIdRef: string | undefined;

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: () => ({
    currentReport: currentReportRef,
    fetchReportsById: fetchReportsByIdMock,
    fetchLocalReportById: fetchLocalReportByIdMock,
    loadingCurrent: loadingCurrentRef,
    error: errorRef,
    resetFlags: resetFlagsMock,
  }),
}));

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => ({
    all: {
      reportId: reportIdRef,
      frontId: frontIdRef,
    },
    updateQuery: updateQueryMock,
  }),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: {
      showAlert: showAlertMock,
    },
  }),
}));

describe("useReportDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentReportRef = null;
    loadingCurrentRef = false;
    errorRef = undefined;
    reportIdRef = undefined;
    frontIdRef = undefined;
  });

  it("solicita el detalle remoto cuando existe reportId", async () => {
    reportIdRef = "REP-1";

    renderHook(() => useReportDetails());

    await waitFor(() => {
      expect(fetchReportsByIdMock).toHaveBeenCalledWith("REP-1", true);
    });
    expect(fetchLocalReportByIdMock).not.toHaveBeenCalled();
  });

  it("solicita el detalle local cuando no existe reportId y si frontId", async () => {
    frontIdRef = "FR-1";

    renderHook(() => useReportDetails());

    await waitFor(() => {
      expect(fetchLocalReportByIdMock).toHaveBeenCalledWith("FR-1", true);
    });
    expect(fetchReportsByIdMock).not.toHaveBeenCalled();
  });

  it("vuelve a pedir el detalle cuando cambia el reportId con el hook montado", async () => {
    reportIdRef = "REP-1";
    const { rerender } = renderHook(() => useReportDetails());

    await waitFor(() => {
      expect(fetchReportsByIdMock).toHaveBeenCalledWith("REP-1", true);
    });

    reportIdRef = "REP-2";
    rerender();

    await waitFor(() => {
      expect(fetchReportsByIdMock).toHaveBeenCalledWith("REP-2", true);
    });
    expect(fetchReportsByIdMock).toHaveBeenCalledTimes(2);
  });
});

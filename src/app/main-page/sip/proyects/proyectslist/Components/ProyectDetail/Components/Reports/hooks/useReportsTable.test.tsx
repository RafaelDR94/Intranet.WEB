import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport, sampleReports } from "../testUtils/reportFixtures";

import useReportsTable from "./useReportsTable";

const fetchAllReportsByProyectMock = vi.fn();
const setCurrentReportMock = vi.fn();

const makePictureDocumentMock = vi.fn();
const exportExcelMock = vi.fn();
const createPDFMock = vi.fn();

const showSpinnerMock = vi.fn();
const hideSpinnerMock = vi.fn();
const showAlertMock = vi.fn();

let routerReplaceMock: ReturnType<typeof vi.fn>;
let searchParamsValue = "";
let currentReportRef = createSampleReport();
let loadingRef = false;
let windowOpenSpy: ReturnType<typeof vi.spyOn>;

vi.mock("next/navigation", () => ({
  usePathname: () => "/main-page/sip/proyects/proyectslist",
  useRouter: () => ({ replace: routerReplaceMock }),
  useSearchParams: () => new URLSearchParams(searchParamsValue),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalLoading: {
      showSpinner: showSpinnerMock,
      hideSpinner: hideSpinnerMock,
    },
    usePrincipalAlert: {
      showAlert: showAlertMock,
    },
  }),
}));

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = {
      currentReport: currentReportRef,
      reports: sampleReports,
      loading: loadingRef,
      fetchAllReportsByProyect: fetchAllReportsByProyectMock,
      setCurrentReport: setCurrentReportMock,
    };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

vi.mock("./useDocument/useDocument", () => ({
  __esModule: true,
  default: () => ({
    makePictureDocument: makePictureDocumentMock,
    exportExcel: exportExcelMock,
  }),
}));

vi.mock("@/app/utilities/PDF/PDF", () => ({
  CreatePDF: (payload: unknown, resolve: (url: string) => void) => {
    createPDFMock(payload, resolve);
  },
}));

describe("useReportsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerReplaceMock = vi.fn();
    searchParamsValue = "id=PROY-1";
    currentReportRef = null as any;
    loadingRef = false;
    windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);
  });

  it("solicita los reportes del proyecto presente en la URL", async () => {
    renderHook(() => useReportsTable());

    await waitFor(() => {
      expect(fetchAllReportsByProyectMock).toHaveBeenCalledWith("PROY-1", true);
    });
    expect(hideSpinnerMock).toHaveBeenCalledTimes(1);
  });

  it("limpia el reporte actual y elimina el query reportId al cerrar detalles", () => {
    searchParamsValue = "id=PROY-1&reportId=REP-1";
    const { result } = renderHook(() => useReportsTable());

    act(() => {
      result.current.handleCloseDetails();
    });

    expect(setCurrentReportMock).toHaveBeenCalledWith(null);
    expect(routerReplaceMock).toHaveBeenCalled();
    const lastCall = routerReplaceMock.mock.calls.at(-1)?.[0] ?? "";
    expect(lastCall).toContain("id=PROY-1");
    expect(lastCall).not.toContain("reportId=");
  });

  it("sincroniza la URL cuando existe un reporte seleccionado", () => {
    currentReportRef = createSampleReport({ id: "REP-99" });
    renderHook(() => useReportsTable());

    expect(routerReplaceMock).toHaveBeenCalled();
    const lastCall = routerReplaceMock.mock.calls.at(-1)?.[0] ?? "";
    expect(lastCall).toContain("reportId=REP-99");
  });

  it("descarga el reporte fotografico mostrando mensajes en el flujo feliz", async () => {
    makePictureDocumentMock.mockReturnValue({ pages: [] });
    createPDFMock.mockImplementation((_, resolve) => resolve("blob:report"));

    const { result } = renderHook(() => useReportsTable());

    await act(async () => {
      await result.current.handleDownloadPicReport();
    });

    expect(showSpinnerMock).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Generando reporte") }));
    expect(makePictureDocumentMock).toHaveBeenCalled();
    expect(createPDFMock).toHaveBeenCalled();
    expect(windowOpenSpy).toHaveBeenCalledWith("blob:report", "_blank");
    expect(showAlertMock).toHaveBeenCalled();
    expect(hideSpinnerMock).toHaveBeenCalled();
  });

  it("notifica al exportar el reporte digital", async () => {
    exportExcelMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useReportsTable());

    await act(async () => {
      await result.current.handleDownloadDigitalReport();
    });

    expect(showSpinnerMock).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Exportando") }));
    expect(exportExcelMock).toHaveBeenCalled();
    expect(showAlertMock).toHaveBeenCalled();
    expect(hideSpinnerMock).toHaveBeenCalled();
  });

  it("expone helpers utiles para la tabla", () => {
    const { result } = renderHook(() => useReportsTable());

    expect(result.current.reports).toEqual(sampleReports);
    expect(result.current.searchableKeys).toEqual(["name", "description", "createdAt", "id"]);

    act(() => {
      result.current.setCurrent(sampleReports[0]);
    });

    expect(setCurrentReportMock).toHaveBeenCalledWith(sampleReports[0]);
  });
});


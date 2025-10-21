import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleReport, sampleReports } from "../testUtils/reportFixtures";

import useReportsTable from "./useReportsTable";

const fetchAllReportsByProyectMock = vi.fn();
const fetchLocalReportsMock = vi.fn();
const setCurrentReportMock = vi.fn();
const deleteLocalMock = vi.fn();
const deleteRemoteReportMock = vi.fn();
const setReportMock = vi.fn();
const resetReportsStoreMock = vi.fn();

const makePictureDocumentMock = vi.fn();
const exportExcelMock = vi.fn();
const createPDFMock = vi.fn();

const showSpinnerMock = vi.fn();
const hideSpinnerMock = vi.fn();
const showAlertMock = vi.fn();

let routerReplaceMock: ReturnType<typeof vi.fn>;
let searchParamsValue = "";
let currentReportRef = createSampleReport();
let localReportsRef: typeof sampleReports = [];
let loadingRef = false;
let windowOpenSpy: ReturnType<typeof vi.spyOn>;

vi.mock("next/navigation", () => ({
  usePathname: () => "/main-page/sip/proyects/proyectslist",
  useRouter: () => ({ replace: routerReplaceMock }),
  useSearchParams: () => new URLSearchParams(searchParamsValue),
  useParams: () => ({}),
}));

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({
    currentPagePermissions: { reportdetails: true },
    user: {
      idEmployee: sampleReports[0].employe.employee_id,
      fullName: sampleReports[0].employe.fullname,
      fullname: sampleReports[0].employe.fullname,
    },
  }),
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

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: () => ({
    setReport: setReportMock,
  }),
}));

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = {
      currentReport: currentReportRef,
      reports: sampleReports,
      localReports: localReportsRef,
      fetchLocalReports: fetchLocalReportsMock,
      deleteLocal: deleteLocalMock,
      deleteReport: deleteRemoteReportMock,
      loading: loadingRef,
      fetchAllReportsByProyect: fetchAllReportsByProyectMock,
      setCurrentReport: setCurrentReportMock,
      reset: resetReportsStoreMock,
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
    localReportsRef = [];
    loadingRef = false;
    fetchLocalReportsMock.mockResolvedValue(undefined);
    deleteLocalMock.mockResolvedValue(true);
    deleteRemoteReportMock.mockResolvedValue(true);
    exportExcelMock.mockResolvedValue(undefined);
    resetReportsStoreMock.mockImplementation(() => {});
    windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it("solicita los reportes del proyecto presente en la URL", async () => {
    renderHook(() => useReportsTable());

    await waitFor(() => {
      expect(fetchAllReportsByProyectMock).toHaveBeenCalledWith("PROY-1", true);
    });
    expect(fetchLocalReportsMock).toHaveBeenCalledWith(true, "PROY-1");
    expect(hideSpinnerMock).toHaveBeenCalled();
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

  it("actualiza la URL y selecciona el reporte al abrirlo", () => {
    const { result } = renderHook(() => useReportsTable());

    act(() => {
      result.current.handleSelectReportOnline(result.current.reportList[0]);
    });

    expect(setCurrentReportMock).toHaveBeenCalledWith(sampleReports[0]);
    const lastCall = routerReplaceMock.mock.calls.at(-1)?.[0] ?? "";
    expect(lastCall).toContain(`reportId=${sampleReports[0].id}`);
    expect(lastCall).toContain(`frontId=${sampleReports[0].front_identifier}`);
  });

  it("descarga el reporte fotografico mostrando mensajes en el flujo feliz", async () => {
    makePictureDocumentMock.mockReturnValue({ pages: [] });
    createPDFMock.mockImplementation((_, resolve) => resolve("blob:report"));

    const { result } = renderHook(() => useReportsTable());

    await act(async () => {
      await result.current.handleDownloadPicReport();
    });

    expect(showSpinnerMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Generando reporte") })
    );
    expect(makePictureDocumentMock).toHaveBeenCalled();
    expect(createPDFMock).toHaveBeenCalled();
    expect(windowOpenSpy).toHaveBeenCalledWith("blob:report", "_blank");
    expect(showAlertMock).toHaveBeenCalled();
    expect(hideSpinnerMock).toHaveBeenCalled();
  });

  it("notifica al exportar el reporte digital", async () => {
    const { result } = renderHook(() => useReportsTable());

    await act(async () => {
      await result.current.handleDownloadDigitalReport();
    });

    expect(showSpinnerMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Exportando") })
    );
    expect(exportExcelMock).toHaveBeenCalled();
    expect(showAlertMock).toHaveBeenCalled();
    expect(hideSpinnerMock).toHaveBeenCalled();
  });

  it("expone helpers utiles para la tabla", () => {
    const { result } = renderHook(() => useReportsTable());

    expect(result.current.reports).toEqual(sampleReports);
    expect(result.current.searchableKeys).toEqual(["name", "description", "createdAt", "id"]);

    act(() => {
      result.current.handleSelectReportOnline(result.current.reportList[0]);
    });

    expect(setCurrentReportMock).toHaveBeenCalledWith(sampleReports[0]);
  });
});
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useReportSaver from "./useReportSaver";

import { createSampleReport } from "../../../testUtils/reportFixtures";

let firebasestorageMock: { storage: unknown; uploadFile: ReturnType<typeof vi.fn> };
let showAlertMock = vi.fn();
let hideAlertMock = vi.fn();
let showSpinnerMock = vi.fn();
let hideSpinnerMock = vi.fn();
let createReportMock = vi.fn();
let updateReportMock = vi.fn();
let resetFlagsMock = vi.fn();
let updateBackIdMock = vi.fn();
let updateQueryMock = vi.fn();
let base64ToBlobMock: ReturnType<typeof vi.fn>;
let optimizeDataUrlToBlobMock: ReturnType<typeof vi.fn>;
let userMock = { idEmployee: "EMP-1", idWorkPosition: "WP-1" };
let creatingState = false;
let errorState: string | null = null;
let queryAll: Record<string, unknown> = {};

vi.mock("@/app/context/FirebaseContext/FirebaseContext", () => ({
  useFirebase: () => ({ firebasestorage: firebasestorageMock }),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: {
      showAlert: showAlertMock,
      hideAlert: hideAlertMock,
    },
    usePrincipalLoading: {
      showSpinner: showSpinnerMock,
      hideSpinner: hideSpinnerMock,
    },
  }),
}));

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: (selector?: any) => {
    const state = {
      createReport: createReportMock,
      updateReport: updateReportMock,
      resetFlags: resetFlagsMock,
      creating: creatingState,
      error: errorState,
    };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: () => ({
    updateBackId: updateBackIdMock,
  }),
}));

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => ({
    all: queryAll,
    updateQuery: updateQueryMock,
  }),
}));

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({ user: userMock }),
}));

vi.mock("@/app/utilities/PicturesHelper/PictureHelper", () => ({
  base64ToBlob: (...args: unknown[]) => base64ToBlobMock(...args),
  optimizeDataUrlToBlob: (...args: unknown[]) => optimizeDataUrlToBlobMock(...args),
}));

vi.mock("@/app/utilities/DatesHelper/Dateshelper", () => ({
  currentDate: () => "2024-05-10",
}));

vi.mock("@/app/configurations/Axios/Clients", () => ({
  isProduction: () => false,
}));

const buildReport = () => {
  const base64Image = "data:image/png;base64,AAA";
  return createSampleReport({
    id: "",
    front_identifier: "FR-NEW",
    activities: [
      {
        title: "Actividad 1",
        date: "",
        description: "Descripcion",
        urlimage: base64Image,
      },
    ],
    maps: [
      {
        title: "Mapa",
        date: "",
        description: "Mapa de prueba",
        urlimage: base64Image,
      },
    ],
    employeesignurl: base64Image,
    clientsign: {
      ...createSampleReport().clientsign,
      url: base64Image,
    },
    proyect: {
      ...createSampleReport().proyect,
      id: "",
    },
    employe: {
      ...createSampleReport().employe,
      employee_id: "",
    },
    workposition: {
      ...createSampleReport().workposition,
      workposition_id: "",
    },
    datecreate: "",
  });
};

describe("useReportSaver", () => {
  beforeEach(() => {
    showAlertMock = vi.fn();
    hideAlertMock = vi.fn();
    showSpinnerMock = vi.fn();
    hideSpinnerMock = vi.fn();
    createReportMock = vi.fn();
    updateReportMock = vi.fn();
    resetFlagsMock = vi.fn();
    updateBackIdMock = vi.fn();
    updateQueryMock = vi.fn();
    base64ToBlobMock = vi.fn(() => new Blob(["png"], { type: "image/png" }));
    optimizeDataUrlToBlobMock = vi.fn(async () => ({
      blob: new Blob(["jpeg"], { type: "image/jpeg" }),
      mime: "image/jpeg",
      width: 100,
      height: 100,
    }));
    firebasestorageMock = {
      storage: {},
      uploadFile: vi.fn(async (_, path: string) => `https://cdn.example.com/${path}`),
    };
    userMock = { idEmployee: "EMP-1", idWorkPosition: "WP-1" };
    creatingState = false;
    errorState = null;
    queryAll = { id: "PROY-123" };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("guarda un reporte nuevo subiendo imagenes base64 y notifica exito", async () => {
    const report = buildReport();
    createReportMock.mockResolvedValue({ id: "REP-999" });

    const { result } = renderHook(() => useReportSaver());

    await act(async () => {
      await result.current.SaveReport(report);
    });

    expect(showSpinnerMock).toHaveBeenCalledWith({ message: "Guardando reporte..." });
    expect(firebasestorageMock.uploadFile).toHaveBeenCalledTimes(4);
    expect(optimizeDataUrlToBlobMock).toHaveBeenCalled();
    expect(firebasestorageMock.uploadFile.mock.calls[0]?.[1]).toMatch(/\.jpg$/);

    await waitFor(() => {
      expect(createReportMock).toHaveBeenCalledTimes(1);
    });

    const payload = createReportMock.mock.calls[0]?.[0];
    expect(payload.activities[0].urlimage).toMatch(/^https:\/\/cdn\.example\.com\//);
    expect(payload.maps[0].urlimage).toMatch(/^https:\/\/cdn\.example\.com\//);
    expect(payload.employeesignurl).toMatch(/^https:\/\/cdn\.example\.com\//);
    expect(payload.clientsign.url).toMatch(/^https:\/\/cdn\.example\.com\//);
    expect(payload.proyect.id).toBe("PROY-123");
    expect(payload.employe.employee_id).toBe("EMP-1");
    expect(payload.workposition.workposition_id).toBe("WP-1");
    expect(payload.datecreate).toBe("2024-05-10");

    expect(updateBackIdMock).toHaveBeenCalledWith("REP-999");
    expect(updateQueryMock).toHaveBeenCalledWith({
      newReport: null,
      currentStep: null,
      frontId: null,
      reportId: "REP-999",
    });
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" })
    );
    expect(resetFlagsMock).toHaveBeenCalled();
    expect(hideSpinnerMock).toHaveBeenCalled();
  });

  it("notifica error cuando la configuracion de firebase es invalida", async () => {
    firebasestorageMock = { storage: null, uploadFile: vi.fn() };
    const report = buildReport();

    const { result } = renderHook(() => useReportSaver());

    await act(async () => {
      await result.current.SaveReport(report);
    });

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error de Firebase",
      })
    );
    expect(createReportMock).not.toHaveBeenCalled();
    expect(updateReportMock).not.toHaveBeenCalled();
  });

  it("actualiza un reporte existente cuando trae identificador", async () => {
    const report = buildReport();
    report.id = "REP-EXIST";
    updateReportMock.mockResolvedValue(true);

    const { result } = renderHook(() => useReportSaver());

    await act(async () => {
      await result.current.SaveReport(report);
    });

    expect(updateReportMock).toHaveBeenCalledTimes(1);
    expect(createReportMock).not.toHaveBeenCalled();
    expect(updateBackIdMock).toHaveBeenCalledWith("REP-EXIST");
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" })
    );
  });

  it("genera extensiones reales segun el mime optimizado o el blob original", async () => {
    const report = buildReport();
    createReportMock.mockResolvedValue({ id: "REP-1000" });

    optimizeDataUrlToBlobMock
      .mockResolvedValueOnce({
        blob: new Blob(["webp"], { type: "image/webp" }),
        mime: "image/webp",
        width: 100,
        height: 100,
      })
      .mockResolvedValueOnce({
        blob: new Blob(["jpeg"], { type: "image/jpeg" }),
        mime: "image/jpeg",
        width: 100,
        height: 100,
      })
      .mockRejectedValueOnce(new Error("opt failed"))
      .mockRejectedValueOnce(new Error("opt failed"));

    const { result } = renderHook(() => useReportSaver());

    await act(async () => {
      await result.current.SaveReport(report);
    });

    const uploadedPaths = firebasestorageMock.uploadFile.mock.calls.map(([, path]) => path);

    expect(uploadedPaths[0]).toMatch(/\.webp$/);
    expect(uploadedPaths[1]).toMatch(/\.jpg$/);
    expect(uploadedPaths[2]).toMatch(/\.png$/);
    expect(uploadedPaths[3]).toMatch(/\.png$/);
  });
});

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useNewReport from "./useNewReport";

import { createSampleReport } from "../../../testUtils/reportFixtures";
import type { Step } from "../types";

let showSpinnerMock = vi.fn();
let hideSpinnerMock = vi.fn();
let updateModelMock = vi.fn();
let readReportByFrontIdMock = vi.fn();
let readReportOnlineMock = vi.fn();
let createReportInDBMock = vi.fn();
let startNewReportMock = vi.fn();
let resetBuilderMock = vi.fn();
let reportState = createSampleReport({ id: "", front_identifier: "FR-LOCAL" });
let SaveReportMock = vi.fn();
let stepsState: {
  steps: Step[];
  currentStep: Step["id"];
  handleBack: ReturnType<typeof vi.fn>;
  handleNext: ReturnType<typeof vi.fn>;
  handleStepChange: ReturnType<typeof vi.fn>;
  handleBackValidChange: ReturnType<typeof vi.fn>;
  handleAdvanceValidChange: ReturnType<typeof vi.fn>;
  handleCanSaveReport: ReturnType<typeof vi.fn>;
  isBackValid: boolean;
  isAdvanceValid: boolean;
  isSaveValid: boolean;
};
let typeOptionsState = [
  { label: "Correctivo", value: "TYPE-1" },
  { label: "Preventivo", value: "TYPE-2" },
];
let selectedTypeIdState = "TYPE-1";
let typesofReportsState = [
  { id: "TYPE-1", name: "Correctivo" },
  { id: "TYPE-2", name: "Preventivo" },
];
let loadingTypesState = false;
let queryAll = { id: "PROY-1" };
let updateQueryMock = vi.fn();
let userMock = {
  idEmployee: "EMP-1",
  idWorkPosition: "WP-1",
};

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({ user: userMock }),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalLoading: {
      showSpinner: showSpinnerMock,
      hideSpinner: hideSpinnerMock,
    },
  }),
}));

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => ({
    all: queryAll,
    updateQuery: updateQueryMock,
  }),
}));

vi.mock("@/app/stores/useReportsStore/useReportsStore", () => ({
  useReportsStore: () => ({
    typesofReports: typesofReportsState,
    loadingTypes: loadingTypesState,
  }),
}));

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: () => ({
    report: reportState,
    updateModel: updateModelMock,
    readReportByFrontId: readReportByFrontIdMock,
    createReportInDB: createReportInDBMock,
    startNewReport: startNewReportMock,
    readReportOnline: readReportOnlineMock,
    reset: resetBuilderMock,
  }),
}));

vi.mock("./useReportSaver", () => ({
  __esModule: true,
  default: () => ({
    SaveReport: SaveReportMock,
  }),
}));

vi.mock("./useStepsController", () => ({
  __esModule: true,
  default: vi.fn(() => stepsState),
}));

vi.mock("./useReportTypehandler", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    typeOptions: typeOptionsState,
    selectedTypeId: selectedTypeIdState,
    handleTypeChange: vi.fn(),
  })),
}));

describe("useNewReport", () => {
  beforeEach(() => {
    showSpinnerMock = vi.fn();
    hideSpinnerMock = vi.fn();
    updateModelMock = vi.fn();
    readReportByFrontIdMock = vi.fn().mockResolvedValue(undefined);
    readReportOnlineMock = vi.fn().mockResolvedValue(undefined);
    createReportInDBMock = vi.fn().mockResolvedValue({ frontId: "FR-AUTO" });
    startNewReportMock = vi.fn();
    resetBuilderMock = vi.fn();
    SaveReportMock = vi.fn();
    stepsState = {
      steps: [
        { id: "avance", label: "Avance" },
        { id: "actividades", label: "Actividades" },
      ],
      currentStep: "avance",
      handleBack: vi.fn(),
      handleNext: vi.fn(),
      handleStepChange: vi.fn(),
      handleBackValidChange: vi.fn(),
      handleAdvanceValidChange: vi.fn(),
      handleCanSaveReport: vi.fn(),
      isBackValid: false,
      isAdvanceValid: true,
      isSaveValid: false,
    };
    typeOptionsState = [
      { label: "Correctivo", value: "TYPE-1" },
      { label: "Preventivo", value: "TYPE-2" },
    ];
    selectedTypeIdState = "TYPE-1";
    typesofReportsState = [
      { id: "TYPE-1", name: "Correctivo" },
      { id: "TYPE-2", name: "Preventivo" },
    ];
    loadingTypesState = false;
    queryAll = { id: "PROY-1" };
    updateQueryMock = vi.fn();
    userMock = { idEmployee: "EMP-1", idWorkPosition: "WP-1" };
    reportState = createSampleReport({ id: "", front_identifier: "FR-LOCAL" });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("inicia un nuevo reporte cuando no existen identificadores en la URL", async () => {
    const setTimeoutSpy = vi
      .spyOn(globalThis, "setTimeout")
      .mockImplementation(((cb: (...args: any[]) => void) => {
        cb();
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }) as any);
    const { result } = renderHook(() => useNewReport());

    expect(showSpinnerMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Obteniendo") })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(startNewReportMock).toHaveBeenCalledWith("PROY-1", "EMP-1", "WP-1");

    await act(async () => {
      await Promise.resolve();
    });
    expect(createReportInDBMock).toHaveBeenCalled();

    expect(updateQueryMock).toHaveBeenCalledWith({ frontId: "FR-AUTO" });
    expect(hideSpinnerMock).toHaveBeenCalled();

    // El tipo seleccionado debe propagar el modelo correspondiente al builder
    await act(async () => {
      await Promise.resolve();
    });
    expect(updateModelMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "TYPE-1" })
    );
    expect(result.current.currentModelName).toBe("Correctivo");
    expect(result.current.typeOptions).toEqual(typeOptionsState);
    setTimeoutSpy.mockRestore();
  });

  it("lee un reporte local cuando la URL expone un frontId", async () => {
    queryAll = { id: "PROY-1", frontId: "FR-123" };

    renderHook(() => useNewReport());

    await act(async () => {
      await Promise.resolve();
    });
    expect(readReportByFrontIdMock).toHaveBeenCalledWith("FR-123");
    expect(readReportOnlineMock).not.toHaveBeenCalled();
    await act(async () => {
      await Promise.resolve();
    });
    expect(createReportInDBMock).toHaveBeenCalled();
  });

  it("lee un reporte remoto cuando la URL expone un reportId", async () => {
    queryAll = { id: "PROY-1", reportId: "REP-555" };
    renderHook(() => useNewReport());

    await act(async () => {
      await Promise.resolve();
    });
    expect(readReportOnlineMock).toHaveBeenCalledWith("REP-555");
    expect(readReportByFrontIdMock).not.toHaveBeenCalled();
  });

  it("expone handlers que delegan en los hooks internos", () => {
    const { result } = renderHook(() => useNewReport());

    act(() => {
      result.current.handleNext();
      result.current.handleBack();
      result.current.handleSaveReport();
    });

    expect(stepsState.handleNext).toHaveBeenCalled();
    expect(stepsState.handleBack).toHaveBeenCalled();
    expect(SaveReportMock).toHaveBeenCalledWith(reportState);
  });
});

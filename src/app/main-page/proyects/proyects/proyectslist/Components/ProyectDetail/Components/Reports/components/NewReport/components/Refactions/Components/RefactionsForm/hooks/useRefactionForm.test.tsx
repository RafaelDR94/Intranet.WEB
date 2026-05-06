import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useRefactionForm from "./useRefactionForm";

import { createSampleReport } from "@/app/main-page/proyects/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

const showAlertMock = vi.fn();
const hideAlertMock = vi.fn();
const showSpinnerMock = vi.fn();
const hideSpinnerMock = vi.fn();
const updateRefactionsMock = vi.fn();

const report = createSampleReport({
  refactions: [
    {
      description: "Kit de limpieza",
      brand: "OptiClean",
      model: "OC-200",
      serialnumber: "SN-100",
      partnumber: "PN-200",
    },
  ],
});

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

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector({
          report,
          updateRefactions: updateRefactionsMock,
        })
      : { report, updateRefactions: updateRefactionsMock },
}));

describe("useRefactionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    report.refactions = [
      {
        description: "Kit de limpieza",
        brand: "OptiClean",
        model: "OC-200",
        serialnumber: "SN-100",
        partnumber: "PN-200",
      },
    ];
  });

  it("prepara valores para crear una nueva refaccion", () => {
    const { result } = renderHook(() =>
      useRefactionForm({ refactionIndex: null, onSuccess: vi.fn() })
    );

    expect(result.current.values).toEqual({
      description: "",
      brand: "",
      model: "",
      serialnumber: "",
      partnumber: "",
    });
    expect(result.current.isValid).toBe(false);
  });

  it("precarga los datos cuando se edita una refaccion existente", () => {
    const { result } = renderHook(() =>
      useRefactionForm({ refactionIndex: 0, onSuccess: vi.fn() })
    );

    expect(result.current.values.description).toBe("Kit de limpieza");
    expect(result.current.isValid).toBe(true);
  });

  it("guarda una nueva refaccion y dispara los feedbacks correspondientes", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useRefactionForm({ refactionIndex: null, onSuccess })
    );

    await act(async () => {
      await result.current.handleSubmit({
        description: " Motobomba ",
        brand: " Grundfos ",
        model: " X200 ",
        serialnumber: " SN-200 ",
        partnumber: " PN-300 ",
      });
    });

    expect(showSpinnerMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Guardando refacción..." })
    );
    expect(updateRefactionsMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ description: "Motobomba", brand: "Grundfos" }),
      ])
    );
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Refacción agregada", type: "success" })
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(hideSpinnerMock).toHaveBeenCalled();
  });

  it("actualiza una refaccion existente", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useRefactionForm({ refactionIndex: 0, onSuccess })
    );

    await act(async () => {
      await result.current.handleSubmit({
        description: "Kit actualizado",
        brand: "OptiClean",
        model: "OC-200",
        serialnumber: "SN-100",
        partnumber: "PN-200",
      });
    });

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Refacción actualizada", type: "info" })
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

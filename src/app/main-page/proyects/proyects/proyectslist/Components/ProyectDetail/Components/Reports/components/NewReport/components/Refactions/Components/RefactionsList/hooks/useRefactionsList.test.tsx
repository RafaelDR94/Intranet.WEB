import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useRefactionsList from "./useRefactionsList";

const {
  showAlertMock,
  hideAlertMock,
  showSpinnerMock,
  hideSpinnerMock,
  updateRefactionsMock,
  fetchSparePartsByProyectIdMock,
  deleteSparePartMock,
  resetFlagsMock,
  report,
  inventoryState,
  reportStoreMock,
  inventoryStoreMock,
} = vi.hoisted(() => {
  const showAlertMock = vi.fn();
  const hideAlertMock = vi.fn();
  const showSpinnerMock = vi.fn();
  const hideSpinnerMock = vi.fn();
  const updateRefactionsMock = vi.fn();
  const fetchSparePartsByProyectIdMock = vi.fn();
  const deleteSparePartMock = vi.fn();
  const resetFlagsMock = vi.fn();

  const report = {
    proyect: { id: "PROY-1" },
    idSpareParts: ["sp-1"],
    refactions: [
      {
        description: "Kit de limpieza",
        brand: "OptiClean",
        model: "OC-200",
        serialnumber: "SN-100",
        partnumber: "PN-200",
      },
    ],
    clientsign: { url: null },
  } as any;

  const inventoryState = {
    sparePartsByProyect: [
      {
        id: "sp-1",
        sku: "PN-200",
        stock: 8,
        name: "Kit de limpieza",
        brand: "OptiClean",
        model: "OC-200",
        serialNumber: "SN-100",
        characteristic: "",
        provider: "",
        website: "",
        phoneNumber: "",
        isActive: true,
      },
      {
        id: "sp-2",
        sku: "PN-900",
        stock: 2,
        name: "Bujia industrial",
        brand: "Caterpillar",
        model: "CT-2",
        serialNumber: "SN-900",
        characteristic: "",
        provider: "",
        website: "",
        phoneNumber: "",
        isActive: true,
      },
    ],
    loadingSparePartsByProyect: false,
    removing: false,
    error: undefined as string | undefined,
    fetchSparePartsByProyectId: fetchSparePartsByProyectIdMock,
    deleteSparePart: deleteSparePartMock,
    resetFlags: resetFlagsMock,
  };

  const reportStoreMock = Object.assign(
    (selector?: any) =>
      selector
        ? selector({
            report,
            updateRefactions: updateRefactionsMock,
          })
        : { report, updateRefactions: updateRefactionsMock },
    {
      getState: () => ({
        report,
        updateRefactions: updateRefactionsMock,
      }),
    },
  );

  const inventoryStoreMock = Object.assign(
    (selector?: any) => (selector ? selector(inventoryState) : inventoryState),
    {
      getState: () => inventoryState,
    },
  );

  return {
    showAlertMock,
    hideAlertMock,
    showSpinnerMock,
    hideSpinnerMock,
    updateRefactionsMock,
    fetchSparePartsByProyectIdMock,
    deleteSparePartMock,
    resetFlagsMock,
    report,
    inventoryState,
    reportStoreMock,
    inventoryStoreMock,
  };
});

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
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

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => ({
    all: { id: "PROY-1" },
  }),
}));

vi.mock("@/app/stores/useReportBuilderStore/useReportBuilderStore", () => ({
  __esModule: true,
  default: reportStoreMock,
}));

vi.mock("@/app/stores/useProyectInventoryStore/useProyectInventoryStore", () => ({
  __esModule: true,
  default: inventoryStoreMock,
}));

describe("useRefactionsList", () => {
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
    report.idSpareParts = ["sp-1"];
    inventoryState.error = undefined;
    inventoryState.loadingSparePartsByProyect = false;
    inventoryState.removing = false;
    fetchSparePartsByProyectIdMock.mockResolvedValue(inventoryState.sparePartsByProyect);
    deleteSparePartMock.mockResolvedValue(true);
  });

  it("carga refacciones del proyecto y construye filas preseleccionadas", () => {
    const { result } = renderHook(() => useRefactionsList());

    expect(fetchSparePartsByProyectIdMock).toHaveBeenCalledWith("PROY-1", true);
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0]).toMatchObject({
      id: "sp-1",
      description: "Kit de limpieza",
      partnumber: "PN-200",
    });
    expect(result.current.initialSelectedIds).toEqual(["sp-1"]);
  });

  it("sincroniza la seleccion con ids y snapshot textual", () => {
    const { result } = renderHook(() => useRefactionsList());

    act(() => {
      result.current.onSelectedChange([]);
    });

    act(() => {
      result.current.onSelectedChange([result.current.rows[1]]);
    });

    expect(updateRefactionsMock).toHaveBeenCalledWith(
      [
        {
          description: "Bujia industrial",
          brand: "Caterpillar",
          model: "CT-2",
          serialnumber: "SN-900",
          partnumber: "PN-900",
        },
      ],
      ["sp-2"],
    );
  });

  it("sincroniza el primer click cuando el reporte no trae idSpareParts", () => {
    report.idSpareParts = [];
    report.refactions = [];

    const { result } = renderHook(() => useRefactionsList());

    act(() => {
      result.current.onSelectedChange([result.current.rows[0]]);
    });

    expect(updateRefactionsMock).toHaveBeenCalledWith(
      [
        {
          description: "Kit de limpieza",
          brand: "OptiClean",
          model: "OC-200",
          serialnumber: "SN-100",
          partnumber: "PN-200",
        },
      ],
      ["sp-1"],
    );
  });

  it("elimina una refaccion del inventario y del reporte al confirmar", async () => {
    const { result, rerender } = renderHook(() => useRefactionsList());
    const row = result.current.rows[0];

    act(() => {
      result.current.deleteRow(row);
    });

    rerender();

    const popUp = result.current.confirmDeleteUI;
    expect(popUp.props.open).toBe(true);

    await act(async () => {
      await popUp.props.onPrimaryButtonClick();
    });

    expect(deleteSparePartMock).toHaveBeenCalledWith("sp-1");
    expect(fetchSparePartsByProyectIdMock).toHaveBeenLastCalledWith("PROY-1", true);
    expect(updateRefactionsMock).toHaveBeenCalledWith([], []);
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Refacción eliminada", type: "warning" }),
    );
  });

  it("no preselecciona filas para reportes legacy sin idSpareParts", () => {
    report.idSpareParts = [];

    const { result } = renderHook(() => useRefactionsList());

    expect(result.current.initialSelectedIds).toEqual([]);
  });
});

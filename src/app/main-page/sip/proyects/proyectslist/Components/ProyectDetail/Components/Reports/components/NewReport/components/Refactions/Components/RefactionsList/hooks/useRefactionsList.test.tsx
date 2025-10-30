import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useRefactionsList from "./useRefactionsList";

import { createSampleReport } from "@/app/main-page/sip/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

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
  });

  it("expone las filas mapeadas y props de soporte", () => {
    const { result } = renderHook(() => useRefactionsList());

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0]).toMatchObject({
      description: "Kit de limpieza",
      index: 0,
      id: "0",
    });
    expect(result.current.pageSize).toBeGreaterThan(0);
    expect(result.current.report).toEqual(report);
  });

  it("permite marcar una refaccion para eliminar y actualiza la lista al confirmar", async () => {
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

    expect(showSpinnerMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Eliminando") })
    );
    expect(updateRefactionsMock).toHaveBeenCalledWith([]);
    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Refacci\u00F3n eliminada", type: "warning" })
    );
    expect(hideSpinnerMock).toHaveBeenCalled();
  });
});

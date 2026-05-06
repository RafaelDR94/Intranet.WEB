import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useDevicesList from "./useDevicesList";

import { createSampleReport } from "@/app/main-page/proyects/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

const fetchDevicesMock = vi.fn();
const deleteDeviceMock = vi.fn();
const resetFlagsMock = vi.fn();
const showAlertMock = vi.fn();
const hideAlertMock = vi.fn();
const showSpinnerMock = vi.fn();
const hideSpinnerMock = vi.fn();
const updateReportDevicesMock = vi.fn();

const report = createSampleReport({
  reportDeviceView: [
    {
      id: "DEV-1",
      device_external_view: {
        id: "DEV-1",
        brand: "Axis",
        model: "M2026",
        serialnumber: "SN-1",
        idlocation: "LOC-1",
      },
    },
  ],
  location: { id: "LOC-1", name: "Edificio Norte", linkmaps: "", address: "", proyect: [] },
});

type StoreState = {
  devices: any[];
  loadingByLocation: boolean;
  removing: boolean;
  successDelete: boolean;
  error: string | null;
};

let storeState: StoreState;

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
          updateReportDevices: updateReportDevicesMock,
        })
      : { report, updateReportDevices: updateReportDevicesMock },
}));

vi.mock("@/app/stores/useReportDevicesStore/useReportDevicesStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector({
          devices: storeState.devices,
          fetchDevices: fetchDevicesMock,
          deleteDevice: deleteDeviceMock,
          loadingByLocation: storeState.loadingByLocation,
          removing: storeState.removing,
          successDelete: storeState.successDelete,
          error: storeState.error,
          resetFlags: resetFlagsMock,
        })
      : {
          devices: storeState.devices,
          fetchDevices: fetchDevicesMock,
          deleteDevice: deleteDeviceMock,
          loadingByLocation: storeState.loadingByLocation,
          removing: storeState.removing,
          successDelete: storeState.successDelete,
          error: storeState.error,
          resetFlags: resetFlagsMock,
        },
}));

describe("useDevicesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    report.reportDeviceView = [
      {
        id: "DEV-1",
        device_external_view: {
          id: "DEV-1",
          brand: "Axis",
          model: "M2026",
          serialnumber: "SN-1",
          idlocation: "LOC-1",
        },
      },
    ];
    storeState = {
      devices: [
        {
          id: "DEV-1",
          brand: "Axis",
          model: "M2026",
          serialnumber: "SN-1",
          idlocation: "LOC-1",
          is_active: true,
        },
        {
          id: "DEV-2",
          brand: "Hikvision",
          model: "DS-2",
          serialnumber: "SN-2",
          idlocation: "LOC-2",
          is_active: true,
        },
      ],
      loadingByLocation: false,
      removing: false,
      successDelete: false,
      error: null,
    };
  });

  it("filtra los dispositivos por ubicacion y calcula la seleccion inicial", () => {
    const { result } = renderHook(() => useDevicesList());

    expect(fetchDevicesMock).toHaveBeenCalled();
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0]?.id).toBe("DEV-1");
    expect(result.current.initialSelectedIds).toContain("DEV-1");
  });

  it("actualiza las refencias seleccionadas cuando cambia la lista", () => {
    const { result } = renderHook(() => useDevicesList());

    act(() => {
      result.current.onSelectedChange([]);
    });

    act(() => {
      result.current.onSelectedChange([
        {
          id: "DEV-3",
          brand: "Dahua",
          model: "X1",
          serialnumber: "SN-3",
          idlocation: "LOC-1",
          is_active: true,
        },
      ]);
    });

    expect(updateReportDevicesMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          device_external_view: expect.objectContaining({ brand: "Dahua" }),
        }),
      ])
    );
  });

  it("orquesta la eliminacion de equipos mostrando spinner y alertas", async () => {
    deleteDeviceMock.mockResolvedValue(undefined);
    const { result, rerender } = renderHook(() => useDevicesList());
    const row = result.current.rows[0];

    act(() => {
      result.current.deleteRow(row);
    });

    rerender();

    const popUpElement = result.current.confirmDeleteUI;
    expect(popUpElement.props.open).toBe(true);

    await act(async () => {
      await popUpElement.props.onPrimaryButtonClick();
    });
    expect(deleteDeviceMock).toHaveBeenCalledWith(String(row.id));

    storeState.removing = true;
    rerender();
    expect(showSpinnerMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Eliminando") })
    );

    storeState.removing = false;
    storeState.successDelete = true;
    rerender();

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Equipo eliminado", type: "warning" })
    );
    expect(resetFlagsMock).toHaveBeenCalled();
  });
});

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDeviceForm } from "./useDeviceForm";

import { createSampleReport } from "@/app/main-page/sip/proyects/proyectslist/Components/ProyectDetail/Components/Reports/testUtils/reportFixtures";

const showAlertMock = vi.fn();
const hideAlertMock = vi.fn();
const showSpinnerMock = vi.fn();
const hideSpinnerMock = vi.fn();
const onSuccessMock = vi.fn();
const createDeviceMock = vi.fn();
const updateDeviceMock = vi.fn();
const resetFlagsMock = vi.fn();

const report = createSampleReport({
  location: { id: "LOC-1", name: "Edificio Norte", linkmaps: "", address: "", proyect: [] },
});

type StoreState = {
  locationDevices: any[];
  devices: any[];
  createDevice: ReturnType<typeof vi.fn>;
  updateDevice: ReturnType<typeof vi.fn>;
  creating: boolean;
  updating: boolean;
  removing: boolean;
  successPost: boolean;
  successPut: boolean;
  error: string | null;
  resetFlags: ReturnType<typeof vi.fn>;
};

let storeState: StoreState;

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
        })
      : { report },
}));

vi.mock("@/app/stores/useReportDevicesStore/useReportDevicesStore", () => ({
  __esModule: true,
  default: (selector?: any) =>
    selector
      ? selector(storeState)
      : storeState,
}));

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => ({
    all: { id: "PROY-123" },
  }),
}));

describe("useDeviceForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onSuccessMock.mockReset();
    storeState = {
      locationDevices: [
        {
          id: "DEV-1",
          brand: "Axis",
          model: "M2026",
          serialnumber: "SN-1",
          idlocation: "LOC-1",
          is_active: true,
        },
      ],
      devices: [],
      createDevice: createDeviceMock.mockResolvedValue(undefined),
      updateDevice: updateDeviceMock.mockResolvedValue(undefined),
      creating: false,
      updating: false,
      removing: false,
      successPost: false,
      successPut: false,
      error: null,
      resetFlags: resetFlagsMock,
    };
  });

  it("expone valores iniciales para registrar un nuevo dispositivo", () => {
    const { result } = renderHook(() => useDeviceForm({ deviceId: null, onSuccess: onSuccessMock }));

    expect(result.current.values).toEqual({ brand: "", model: "", serialnumber: "" });
    expect(result.current.isValid).toBe(false);
    expect(result.current.title).toContain("Registrar");
    expect(result.current.description).toMatch(/asociarlo al reporte/i);
  });

  it("prefill los datos cuando se edita un dispositivo existente", () => {
    const { result } = renderHook(() =>
      useDeviceForm({ deviceId: "DEV-1", onSuccess: onSuccessMock })
    );

    expect(result.current.values).toEqual({
      brand: "Axis",
      model: "M2026",
      serialnumber: "SN-1",
    });
    expect(result.current.title).toContain("Editar");
  });

  it("crea un nuevo dispositivo y notifica el resultado exitoso", async () => {
    const { result, rerender } = renderHook(() =>
      useDeviceForm({ deviceId: null, onSuccess: onSuccessMock })
    );

    await act(async () => {
      await result.current.handleSubmit({
        brand: "  Axis ",
        model: " M2026 ",
        serialnumber: " SN-1 ",
      });
    });

    expect(createDeviceMock).toHaveBeenCalledWith({
      brand: "Axis",
      model: "M2026",
      serialnumber: "SN-1",
      idLocation: "LOC-1",
      idProyect: "PROY-123",
    });

    // simula cambio de flags en el store
    storeState.creating = true;
    rerender();
    expect(showSpinnerMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Guardando") })
    );

    storeState.creating = false;
    storeState.successPost = true;
    rerender();

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Equipo guardado", type: "success" })
    );
    expect(onSuccessMock).toHaveBeenCalled();
    expect(resetFlagsMock).toHaveBeenCalled();
  });

  it("actualiza un dispositivo existente y muestra el feedback correspondiente", async () => {
    storeState.devices = [
      {
        id: "DEV-2",
        brand: "Hikvision",
        model: "DS-2",
        serialnumber: "SN-2",
        idlocation: "LOC-1",
        is_active: true,
      },
    ];

    const { result, rerender } = renderHook(() =>
      useDeviceForm({ deviceId: "DEV-2", onSuccess: onSuccessMock })
    );

    await act(async () => {
      await result.current.handleSubmit({
        brand: "Hikvision",
        model: "DS-2",
        serialnumber: "SN-2",
      });
    });

    expect(updateDeviceMock).toHaveBeenCalledWith({
      brand: "Hikvision",
      model: "DS-2",
      serialnumber: "SN-2",
      idLocation: "LOC-1",
      idProyect: "PROY-123",
      id: "DEV-2",
    });

    storeState.updating = true;
    rerender();
    expect(showSpinnerMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Actualizando") })
    );

    storeState.updating = false;
    storeState.successPut = true;
    rerender();

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Equipo actualizado", type: "info" })
    );
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
  });
});

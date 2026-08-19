import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useInternalDevicesList from "./useInternalDevicesList";

const {
  showAlert,
  showSpinner,
  hideSpinner,
  updateQuery,
  getQueryState,
  setQueryState,
  getStoreState,
  setStoreState,
} = vi.hoisted(() => {
  let queryState: any;
  let storeState: any;

  return {
    showAlert: vi.fn(),
    showSpinner: vi.fn(),
    hideSpinner: vi.fn(),
    updateQuery: vi.fn(),
    getQueryState: () => queryState,
    setQueryState: (value: any) => {
      queryState = value;
    },
    getStoreState: () => storeState,
    setStoreState: (value: any) => {
      storeState = value;
    },
  };
});

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({ user: null, currentPagePermissions: {} }),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => getQueryState(),
}));

vi.mock("@/app/stores/useInternalDevicesStore/useInternalDevicesStore", () => ({
  useInternalDevicesStore: (selector: any) => selector(getStoreState()),
}));

describe("useInternalDevicesList", () => {
  beforeEach(() => {
    setQueryState({ all: { id: "device-1", view: "edit" }, updateQuery });
    setStoreState({
      devices: [],
      device: null,
      fetchDevices: vi.fn().mockResolvedValue([]),
      fetchDeviceById: vi.fn().mockResolvedValue(null),
      deleteDevice: vi.fn(),
      fetchDeviceReviewsByDeviceId: vi.fn(),
      deviceReviewsByDevice: [],
      loadingDevices: false,
      loadingDevice: false,
      loadingDeviceReviewsByDevice: false,
      creatingDeviceReview: false,
      creatingDevice: false,
      deletingDevice: false,
      activatingDevice: false,
      updatingDevice: false,
      error: undefined,
      successCreateDevice: false,
      successDeleteDevice: false,
      successActivateDevice: false,
      successUpdateDevice: false,
      successCreateDeviceReview: false,
      resetFlags: vi.fn(),
    });

    showAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    updateQuery.mockClear();
  });

  it.each(["successCreateDevice", "successUpdateDevice"])(
    "returns to the table after %s",
    (successFlag) => {
      setStoreState({ ...getStoreState(), [successFlag]: true });

      renderHook(() => useInternalDevicesList());

      expect(updateQuery).toHaveBeenCalledWith({ id: null, view: null });
      expect(getStoreState().fetchDevices).toHaveBeenCalledWith(true);
      expect(getStoreState().resetFlags).toHaveBeenCalled();
    },
  );

  it("returns to the device detail after creating a review", () => {
    setQueryState({ all: { id: "device-1", view: "review" }, updateQuery });
    setStoreState({ ...getStoreState(), successCreateDeviceReview: true });

    renderHook(() => useInternalDevicesList());

    expect(updateQuery).toHaveBeenCalledWith({ view: null });
    expect(updateQuery).not.toHaveBeenCalledWith({ id: null, view: null });
  });

  it("keeps the form open when saving fails", () => {
    setStoreState({ ...getStoreState(), error: "No se pudo guardar" });

    renderHook(() => useInternalDevicesList());

    expect(updateQuery).not.toHaveBeenCalled();
  });
});

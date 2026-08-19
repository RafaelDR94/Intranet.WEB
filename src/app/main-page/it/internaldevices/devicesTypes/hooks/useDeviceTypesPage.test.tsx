import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useDeviceTypesPage from "./useDeviceTypesPage";

const {
  updateQuery,
  getQueryState,
  setQueryState,
  getStoreState,
  setStoreState,
} = vi.hoisted(() => {
  let queryState: any;
  let storeState: any;

  return {
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

const showAlert = vi.fn();
const showSpinner = vi.fn();
const hideSpinner = vi.fn();

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => ({ currentPagePermissions: {} }),
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

describe("useDeviceTypesPage", () => {
  beforeEach(() => {
    setQueryState({ all: { id: "type-1", view: "edit" }, updateQuery });
    setStoreState({
      deviceTypes: [],
      deviceType: null,
      fetchDeviceTypes: vi.fn(),
      fetchDeviceTypeById: vi.fn(),
      deleteDeviceType: vi.fn(),
      loadingDeviceTypes: false,
      creatingDeviceType: false,
      updatingDeviceType: false,
      deletingDeviceType: false,
      activatingDeviceType: false,
      successCreateDeviceType: false,
      successUpdateDeviceType: false,
      successDeleteDeviceType: false,
      successActivateDeviceType: false,
      error: undefined,
      resetFlags: vi.fn(),
    });
    updateQuery.mockClear();
  });

  it.each(["successCreateDeviceType", "successUpdateDeviceType"])(
    "returns to the table after %s, including an update without a response body",
    (successFlag) => {
      setStoreState({ ...getStoreState(), [successFlag]: true });

      renderHook(() => useDeviceTypesPage());

      expect(updateQuery).toHaveBeenCalledWith({ id: null, view: null });
      expect(getStoreState().fetchDeviceTypes).toHaveBeenCalledWith(
        undefined,
        true,
      );
      expect(getStoreState().resetFlags).toHaveBeenCalled();
    },
  );

  it("keeps the form open when saving fails", () => {
    setStoreState({ ...getStoreState(), error: "No se pudo guardar" });

    renderHook(() => useDeviceTypesPage());

    expect(updateQuery).not.toHaveBeenCalled();
  });
});

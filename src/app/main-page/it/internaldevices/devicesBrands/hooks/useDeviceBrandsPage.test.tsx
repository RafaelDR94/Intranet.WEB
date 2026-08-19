import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useDeviceBrandsPage from "./useDeviceBrandsPage";

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

describe("useDeviceBrandsPage", () => {
  beforeEach(() => {
    setQueryState({ all: { id: "brand-1", view: "edit" }, updateQuery });
    setStoreState({
      deviceBrands: [],
      deviceBrand: null,
      fetchDeviceBrands: vi.fn(),
      fetchDeviceBrandById: vi.fn(),
      deleteDeviceBrand: vi.fn(),
      loadingDeviceBrands: false,
      creatingDeviceBrand: false,
      updatingDeviceBrand: false,
      deletingDeviceBrand: false,
      activatingDeviceBrand: false,
      successCreateDeviceBrand: false,
      successUpdateDeviceBrand: false,
      successDeleteDeviceBrand: false,
      successActivateDeviceBrand: false,
      error: undefined,
      resetFlags: vi.fn(),
    });
    updateQuery.mockClear();
  });

  it.each(["successCreateDeviceBrand", "successUpdateDeviceBrand"])(
    "returns to the table after %s, including an update without a response body",
    (successFlag) => {
      setStoreState({ ...getStoreState(), [successFlag]: true });

      renderHook(() => useDeviceBrandsPage());

      expect(updateQuery).toHaveBeenCalledWith({ id: null, view: null });
      expect(getStoreState().fetchDeviceBrands).toHaveBeenCalledWith(
        false,
        true,
      );
      expect(getStoreState().resetFlags).toHaveBeenCalled();
    },
  );

  it("keeps the form open when saving fails", () => {
    setStoreState({ ...getStoreState(), error: "No se pudo guardar" });

    renderHook(() => useDeviceBrandsPage());

    expect(updateQuery).not.toHaveBeenCalled();
  });
});

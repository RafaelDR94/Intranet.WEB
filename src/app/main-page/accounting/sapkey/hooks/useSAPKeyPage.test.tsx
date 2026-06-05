import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateQuery = vi.hoisted(() => vi.fn());
const showAlert = vi.hoisted(() => vi.fn());
const showSpinner = vi.hoisted(() => vi.fn());
const hideSpinner = vi.hoisted(() => vi.fn());

let queryState: {
  all: Record<string, string | string[] | undefined>;
  updateQuery: typeof updateQuery;
};

let storeState: any;

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  default: vi.fn(() => queryState),
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: vi.fn(() => ({
    usePrincipalAlert: { showAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  })),
}));

vi.mock("@/app/stores/useSAPKeysStore/useSAPKeysStore", () => ({
  useSAPKeysStore: vi.fn((selector: (state: any) => any) =>
    selector(storeState),
  ),
}));

import useSAPKeyPage from "./useSAPKeyPage";

describe("useSAPKeyPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    queryState = {
      all: {},
      updateQuery,
    };

    storeState = {
      sapKeys: [
        {
          id: "sap-active",
          satKey: "101",
          descriptionSatKey: "Activo",
          internalKey: "G001",
          descriptionInternalKey: "Clave activa",
          gtsType: "A",
          iva: 0.16,
          isActive: true,
        },
        {
          id: "sap-inactive",
          satKey: "102",
          descriptionSatKey: "Inactivo",
          internalKey: "G002",
          descriptionInternalKey: "Clave inactiva",
          gtsType: "O",
          iva: 0,
          isActive: false,
        },
      ],
      sapKey: undefined,
      fetchSAPKeys: vi.fn(async () => storeState.sapKeys),
      fetchSAPKeyById: vi.fn(async () => null),
      createSAPKey: vi.fn(async (payload) => ({
        id: "created-id",
        ...payload,
        isActive: true,
      })),
      updateSAPKey: vi.fn(async (payload) => payload),
      deleteSAPKey: vi.fn(async () => true),
      loadingSAPKeys: false,
      loadingSAPKey: false,
      creatingSAPKey: false,
      updatingSAPKey: false,
      deletingSAPKey: false,
      successCreateSAPKey: false,
      successUpdateSAPKey: false,
      successDeleteSAPKey: false,
      error: undefined,
      resetFlags: vi.fn(),
    };
  });

  it("loads the list on mount and filters inactive rows", async () => {
    const { result } = renderHook(() => useSAPKeyPage());

    await waitFor(() => {
      expect(storeState.fetchSAPKeys).toHaveBeenCalled();
    });

    expect(result.current.sapKeys).toEqual([storeState.sapKeys[0]]);
  });

  it("loads detail from GetById when edit view has an id", async () => {
    queryState.all = { view: "edit", id: "sap-active" };

    renderHook(() => useSAPKeyPage());

    await waitFor(() => {
      expect(storeState.fetchSAPKeyById).toHaveBeenCalledWith(
        "sap-active",
        true,
      );
    });
  });

  it("submits create payload and returns to the list", async () => {
    queryState.all = { view: "new" };

    const { result } = renderHook(() => useSAPKeyPage());

    await act(async () => {
      await result.current.handleSubmit({
        satKey: "201",
        descriptionSatKey: "Nueva clave SAT",
        internalKey: "G201",
        descriptionInternalKey: "Nueva clave",
        gtsType: "A",
        iva: 0.08,
      });
    });

    expect(storeState.createSAPKey).toHaveBeenCalledWith({
      satKey: "201",
      descriptionSatKey: "Nueva clave SAT",
      internalKey: "G201",
      descriptionInternalKey: "Nueva clave",
      gtsType: "A",
      iva: 0.08,
    });
    expect(updateQuery).toHaveBeenCalledWith({ id: null, view: null });
  });

  it("shows success alerts for create operations", async () => {
    storeState.successCreateSAPKey = true;

    renderHook(() => useSAPKeyPage());

    await waitFor(() => {
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "success",
          title: "Clave registrada",
        }),
      );
    });

    expect(storeState.resetFlags).toHaveBeenCalled();
  });
});

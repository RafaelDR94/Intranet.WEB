import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useSapOperationsPage from "./useSapOperationsPage";

const usePrincipalMock = vi.fn();
const useBillingDocumentsSAPStoreMock = vi.fn();
const useBillingCompleteProcessToSAPStoreMock = vi.fn();

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => usePrincipalMock(),
}));

vi.mock("@/app/stores/useBillingDocumentsSAPStore/useBillingDocumentsSAPStore", () => ({
  useBillingDocumentsSAPStore: (
    selector: (state: any) => unknown,
  ) => useBillingDocumentsSAPStoreMock(selector),
}));

vi.mock(
  "@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore",
  () => ({
    useBillingCompleteProcessToSAPStore: (
      selector: (state: any) => unknown,
    ) => useBillingCompleteProcessToSAPStoreMock(selector),
  }),
);

describe("useSapOperationsPage", () => {
  const fetchBillingDocumentsSAP = vi.fn();
  const resetSapFlags = vi.fn();
  const showSpinner = vi.fn();
  const hideSpinner = vi.fn();
  const showAlert = vi.fn();
  const completeProcessToSAP = vi.fn();
  const resetCompleteProcessFlags = vi.fn();

  beforeEach(() => {
    fetchBillingDocumentsSAP.mockClear();
    resetSapFlags.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    showAlert.mockClear();
    completeProcessToSAP.mockClear();
    resetCompleteProcessFlags.mockClear();

    usePrincipalMock.mockReturnValue({
      usePrincipalAlert: { showAlert },
      usePrincipalLoading: { showSpinner, hideSpinner },
    });

    useBillingDocumentsSAPStoreMock.mockImplementation((selector) =>
      selector({
        billingDocuments: [{ billingdocument_id: "1" }],
        fetchBillingDocumentsSAP,
        loading: false,
        error: null,
        resetFlags: resetSapFlags,
      }),
    );

    useBillingCompleteProcessToSAPStoreMock.mockImplementation((selector) =>
      selector({
        sending: false,
        success: false,
        completeProcessToSAP,
        error: null,
        resetFlags: resetCompleteProcessFlags,
      }),
    );
  });

  it("loads SAP documents on mount", async () => {
    renderHook(() => useSapOperationsPage());

    await waitFor(() => {
      expect(fetchBillingDocumentsSAP).toHaveBeenCalledWith(true);
    });
  });

  it("controls panel visibility when a row is selected", () => {
    const { result } = renderHook(() => useSapOperationsPage());

    act(() => {
      result.current.handleOpenDetails(
        { billingdocument_id: "7" } as any,
        true,
        false,
        false,
      );
    });

    expect(result.current.selected?.billingdocument_id).toBe("7");
    expect(result.current.panelOpen.state).toBe(true);
    expect(result.current.panelOpen.onlyText).toBe(true);
  });

  it("sends collected ids to SAP", () => {
    const { result } = renderHook(() => useSapOperationsPage());

    act(() => {
      result.current.handleMultiSelect([
        { billingdocument_id: "10" },
        { billingdocument_id: "11" },
      ] as any);
    });

    act(() => {
      result.current.handleSendToSap();
    });

    expect(completeProcessToSAP).toHaveBeenCalledWith(["10", "11"]);
  });
});

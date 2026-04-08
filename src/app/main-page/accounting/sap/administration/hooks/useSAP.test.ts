import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useSAP from "./useSAP";

const usePrincipalMock = vi.fn();
const useBillingDocumentsSAPStoreMock = vi.fn();
const useBillingCompleteProcessToSAPStoreMock = vi.fn();
const useBillingDocumentsStoreMock = vi.fn();
const updateQuery = vi.fn();

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => usePrincipalMock(),
}));

vi.mock("@/app/stores/useBillingDocumentsSAPStore/useBillingDocumentsSAPStore", () => ({
  useBillingDocumentsSAPStore: (
    selector: (state: any) => unknown,
  ) => useBillingDocumentsSAPStoreMock(selector),
}));

vi.mock("@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore", () => ({
  useBillingDocumentsStore: (
    selector: (state: any) => unknown,
  ) => useBillingDocumentsStoreMock(selector),
}));

vi.mock(
  "@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore",
  () => ({
    useBillingCompleteProcessToSAPStore: (
      selector: (state: any) => unknown,
    ) => useBillingCompleteProcessToSAPStoreMock(selector),
  }),
);

vi.mock("@/app/hooks/useQuery/useQuery", () => ({
  __esModule: true,
  default: () => ({ all: {}, updateQuery }),
}));

describe("useSAP", () => {
  const fetchBillingDocumentsSAP = vi.fn();
  const resetSapFlags = vi.fn();
  const showSpinner = vi.fn();
  const hideSpinner = vi.fn();
  const showAlert = vi.fn();
  const completeProcessToSAP = vi.fn();
  const resetCompleteProcessFlags = vi.fn();
  const fetchBillingDocumentById = vi.fn();

  beforeEach(() => {
    fetchBillingDocumentsSAP.mockClear();
    resetSapFlags.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    showAlert.mockClear();
    completeProcessToSAP.mockClear();
    resetCompleteProcessFlags.mockClear();
    fetchBillingDocumentById.mockClear();
    updateQuery.mockClear();

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

    useBillingDocumentsStoreMock.mockImplementation((selector) =>
      selector({
        fetchBillingDocumentById,
      }),
    );
  });

  it("fetches billing documents on mount", async () => {
    renderHook(() => useSAP());

    await waitFor(() => {
      expect(fetchBillingDocumentsSAP).toHaveBeenCalledWith(true);
    });
  });

  it("opens panel and sets selected record", () => {
    const { result } = renderHook(() => useSAP());

    act(() => {
      result.current.handleOpenDetails(
        {
          billingdocument_id: "2",
        } as any,
        false,
        false,
        true,
      );
    });

    expect(result.current.selected?.billingdocument_id).toBe("2");
    expect(result.current.panelOpen.state).toBe(true);
    expect(result.current.panelOpen.sendInvoiceToSap).toBe(true);
  });

  it("collects selected ids and triggers SAP processing", () => {
    const { result } = renderHook(() => useSAP());

    act(() => {
      result.current.handleMultiSelect([
        { billingdocument_id: "5" },
        { billingdocument_id: "6" },
      ] as any);
    });

    act(() => {
      result.current.handleSendToSap();
    });

    expect(completeProcessToSAP).toHaveBeenCalledWith(["5", "6"]);
  });
});

import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { vi, describe, beforeEach, it, expect } from "vitest";

import type { DetailsPanelProps } from "@/app/main-page/accounting/invoices/validateinvoices/components/DetailsPanel/types";

import { useSAPDetailsPanel } from "./useSAPDetailsPanel";

const completeProcessToSAPMock = vi.fn();
const useAuthMock = vi.fn();
const useIsMobileMock = vi.fn();

vi.mock("@/app/context/AuthContext/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock(
  "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery",
  () => ({
    useIsMobile: () => useIsMobileMock(),
  }),
);

vi.mock(
  "@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore",
  () => ({
    useBillingCompleteProcessToSAPStore: (
      selector: (state: { completeProcessToSAP: typeof completeProcessToSAPMock }) => unknown,
    ) => selector({ completeProcessToSAP: completeProcessToSAPMock }),
  }),
);

describe("useSAPDetailsPanel", () => {
  const baseProps: Pick<
    DetailsPanelProps,
    "selected" | "rejectType" | "setPanelOpen" | "operations" | "reqisition"
  > = {
    selected: {
      id: 10,
      subtotal: "100",
      iva: "16",
      total: "116",
    } as DetailsPanelProps["selected"],
    rejectType: true,
    setPanelOpen: vi.fn(),
    operations: false,
    reqisition: undefined,
  };

  beforeEach(() => {
    useAuthMock.mockReturnValue({ currentPagePermissions: { canSendToSap: false } });
    useIsMobileMock.mockReturnValue(false);
    completeProcessToSAPMock.mockClear();
  });

  it("returns permissions and media state from dependencies", () => {
    const { result } = renderHook(() => useSAPDetailsPanel(baseProps));

    expect(result.current.currentPagePermissions).toEqual({ canSendToSap: false });
    expect(result.current.isMobile).toBe(false);
  });

  it("sends selected id to SAP when handleSendToSap is executed", () => {
    const { result } = renderHook(() => useSAPDetailsPanel(baseProps));

    act(() => {
      result.current.handleSendToSap();
    });

    expect(completeProcessToSAPMock).toHaveBeenCalledWith(["10"]);
  });

  it("does not attempt to send when there is no selected id", () => {
    const { result } = renderHook(() =>
      useSAPDetailsPanel({ ...baseProps, selected: null }),
    );

    act(() => {
      result.current.handleSendToSap();
    });

    expect(completeProcessToSAPMock).not.toHaveBeenCalled();
  });

  it("updates form values when the input handler is triggered", () => {
    const { result } = renderHook(() => useSAPDetailsPanel(baseProps));

    act(() => {
      result.current.handleChange({
        target: { name: "subtotal", value: "200" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formValues.subtotal).toBe("200");
  });

  it("resets editing state after saving changes", () => {
    const { result } = renderHook(() => useSAPDetailsPanel(baseProps));

    act(() => {
      result.current.setIsEditing(true);
      result.current.handleSave();
    });

    expect(result.current.isEditing).toBe(false);
  });
});

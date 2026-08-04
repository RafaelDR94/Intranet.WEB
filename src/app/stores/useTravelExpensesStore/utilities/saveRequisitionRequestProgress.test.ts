import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  SaveRequisitionRequestProgressPayload,
  Set,
  TravelExpensesState,
} from "../types";

import { saveRequisitionRequestProgress } from "./saveRequisitionRequestProgress";

const putMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pPut: () => putMock,
}));
vi.mock("@/app/utilities/Http/normalizeApiError", () => ({
  normalizeApiError: (error: unknown) => ({ message: String(error) }),
}));

const payload: SaveRequisitionRequestProgressPayload = {
  id_billing_requisition_request: "request-1",
  progress_items: [
    {
      employee_id: "employee-1",
      employee_name: "Angel Vazquez",
      requisition_code: "REQ-001",
      motive: "Instalacion",
      start_date: "2026-05-10T00:00:00.000Z",
      end_date: "2026-05-15T00:00:00.000Z",
      subtotal: 150,
      total: 150,
      companions: [],
      calculation_concepts: [],
    },
  ],
};

const createSet =
  (state: Partial<TravelExpensesState>): Set =>
  (partial) =>
    Object.assign(
      state,
      typeof partial === "function"
        ? partial(state as TravelExpensesState)
        : partial,
    );

describe("saveRequisitionRequestProgress util", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses RequisitionRequest/SaveProgress and accepts a 204 response", async () => {
    putMock.mockResolvedValue({ status: 204 });
    const state: Partial<TravelExpensesState> = {
      savingProgress: false,
      successSaveProgress: false,
    };

    const success = await saveRequisitionRequestProgress(
      createSet(state),
      payload,
    );

    expect(putMock).toHaveBeenCalledWith(
      "/Billings/RequisitionRequest/SaveProgress",
      payload,
    );
    expect(success).toBe(true);
    expect(state.savingProgress).toBe(false);
    expect(state.successSaveProgress).toBe(true);
  });

  it("normalizes errors and clears the success flag", async () => {
    putMock.mockRejectedValue(new Error("API unavailable"));
    const state: Partial<TravelExpensesState> = {
      savingProgress: false,
      successSaveProgress: true,
    };

    const success = await saveRequisitionRequestProgress(
      createSet(state),
      payload,
    );

    expect(success).toBe(false);
    expect(state.savingProgress).toBe(false);
    expect(state.successSaveProgress).toBe(false);
    expect(state.error).toBe("Error: API unavailable");
  });
});

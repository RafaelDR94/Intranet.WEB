import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ResendRequisitionRequestAuthorizationPayload,
  Set,
  TravelExpensesState,
} from "../types";

import { resendRequisitionRequestAuthorization } from "./resendRequisitionRequestAuthorization";

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

const payload: ResendRequisitionRequestAuthorizationPayload = {
  id_billing_requisition_request: "request-1",
  id_authorizer: "authorizer-1",
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

describe("resendRequisitionRequestAuthorization util", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the requisition request and authorizer in the PUT body", async () => {
    putMock.mockResolvedValue({ status: 200 });
    const state: Partial<TravelExpensesState> = {
      sendingAuthorization: false,
      successSendAuthorization: false,
    };

    const success = await resendRequisitionRequestAuthorization(
      createSet(state),
      payload,
    );

    expect(putMock).toHaveBeenCalledWith(
      "/Billings/TravelExpenses/RequisitionRequest/ResendAuthorization",
      payload,
    );
    expect(success).toBe(true);
    expect(state.sendingAuthorization).toBe(false);
    expect(state.successSendAuthorization).toBe(true);
  });
});

import { describe, expect, it, vi } from "vitest";

import type { Set, TravelExpensesState } from "../types";

import { fetchTreasuryRequisitionRequests } from "./fetchTreasuryRequisitionRequests";

const getMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => getMock,
}));

describe("fetchTreasuryRequisitionRequests util", () => {
  it("fetches only the Treasury requisition requests", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: "request-1",
            requisition_code: "REQ-001",
            status_name: "APROBADA POR CONTABILIDAD",
            treasury_status_name: "PENDIENTE",
            date_created: "2026-07-30T12:00:00",
          },
        ],
      },
    });
    const state: Partial<TravelExpensesState> = {
      treasuryRequisitionRequests: [
        { id: "stale-request" } as TravelExpensesState["treasuryRequisitionRequests"][number],
      ],
    };
    const set: Set = (partial) => {
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );
    };

    await fetchTreasuryRequisitionRequests(set);

    expect(getMock).toHaveBeenCalledWith(
      "/Billings/RequisitionRequest?department=TESORERIA",
    );
    expect(state.treasuryRequisitionRequests?.[0]).toMatchObject({
      requisitionkey: "REQ-001",
      treasury_status_name: "PENDIENTE",
    });
    expect(state.loadingTreasuryRequisitionRequests).toBe(false);
  });

  it("clears rows and exposes the normalized error when the request fails", async () => {
    getMock.mockRejectedValueOnce(new Error("Servicio no disponible"));
    const state: Partial<TravelExpensesState> = {
      treasuryRequisitionRequests: [],
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );

    await fetchTreasuryRequisitionRequests(set);

    expect(state.treasuryRequisitionRequests).toEqual([]);
    expect(state.treasuryRequisitionRequestsError).toBeTruthy();
    expect(state.loadingTreasuryRequisitionRequests).toBe(false);
  });
});

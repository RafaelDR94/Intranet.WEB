import { describe, expect, it, vi } from "vitest";

import type { Set, TravelExpensesState } from "../types";

import { fetchOperationsRequisitionRequests } from "./fetchOperationsRequisitionRequests";

const getMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => getMock,
}));

describe("fetchOperationsRequisitionRequests util", () => {
  it("clears stale rows and fetches the unfiltered operations endpoint", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: "request-1",
            requisition_code: "REQ-001",
            status_name: "TESORERIA",
            treasury_status_name: "PENDIENTE",
            accounting_status_name: "PENDIENTE",
            image_urls: ["https://files.example/request-1.png"],
            date_created: "2026-07-30T12:00:00",
          },
        ],
      },
    });
    const state: Partial<TravelExpensesState> = {
      operationsRequisitionRequests: [
        { id: "stale-request" } as TravelExpensesState["operationsRequisitionRequests"][number],
      ],
      loadingOperationsRequisitionRequests: false,
    };
    const set: Set = (partial) => {
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );
    };

    await fetchOperationsRequisitionRequests(set);

    expect(getMock).toHaveBeenCalledWith("/Billings/RequisitionRequest");
    expect(state.operationsRequisitionRequests?.[0]).toMatchObject({
      status_name: "TESORERIA",
      status: "TESORERIA",
      treasury_status_name: "PENDIENTE",
      accounting_status_name: "PENDIENTE",
    });
  });

  it("accepts an endpoint response with a direct array", async () => {
    getMock.mockResolvedValueOnce({ data: [] });
    const state: Partial<TravelExpensesState> = {
      operationsRequisitionRequests: [],
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );

    await fetchOperationsRequisitionRequests(set);

    expect(state.operationsRequisitionRequests).toEqual([]);
  });

  it("clears rows and exposes the normalized error when the request fails", async () => {
    getMock.mockRejectedValueOnce(new Error("Servicio no disponible"));
    const state: Partial<TravelExpensesState> = {
      operationsRequisitionRequests: [],
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );

    await fetchOperationsRequisitionRequests(set);

    expect(state.operationsRequisitionRequests).toEqual([]);
    expect(state.operationsRequisitionRequestsError).toBeTruthy();
    expect(state.loadingOperationsRequisitionRequests).toBe(false);
  });
});

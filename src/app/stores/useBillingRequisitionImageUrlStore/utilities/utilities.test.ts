import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BillingRequisitionImageUrlState, Get, Set } from "../types";

import { fetchBillingRequisitionImageUrlById } from "./fetchBillingRequisitionImageUrlById";
import { updateBillingRequisitionImageUrl } from "./updateBillingRequisitionImageUrl";

const getMock = vi.fn();
const putMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => getMock,
  pPut: () => putMock,
}));
vi.mock(
  "@/app/mappings/billingRequisitionImageUrl/billingRequisitionImageUrl.map",
  () => ({
    BillingRequisitionImageUrlMap: (d: unknown) => d,
    BillingRequisitionImageUrlPutMap: (d: unknown) => d,
  }),
);

describe("BillingRequisitionImageUrl utilities", () => {
  beforeEach(() => {
    getMock.mockReset();
    putMock.mockReset();
  });

  it("fetchBillingRequisitionImageUrlById guarda la evidencia", async () => {
    const state: Partial<BillingRequisitionImageUrlState> = {
      requisitionImage: undefined,
      loading: false,
      successGet: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as BillingRequisitionImageUrlState)
          : partial,
      );
    const get: Get = () => state as BillingRequisitionImageUrlState;

    getMock.mockResolvedValue({
      data: { data: { idRequisition: "1", imageUrl: "url" } },
    });

    await fetchBillingRequisitionImageUrlById("1", set, get, true);

    expect(state.requisitionImage?.idRequisition).toBe("1");
    expect(state.loading).toBe(false);
    expect(state.successGet).toBe(true);
  });

  it("updateBillingRequisitionImageUrl actualiza la evidencia", async () => {
    const state: Partial<BillingRequisitionImageUrlState> = {
      requisitionImage: undefined,
      updating: false,
      successPut: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as BillingRequisitionImageUrlState)
          : partial,
      );
    const get: Get = () => state as BillingRequisitionImageUrlState;

    putMock.mockResolvedValue({
      data: { data: { idRequisition: "1", imageUrl: "url" } },
    });

    await updateBillingRequisitionImageUrl(set, get, {
      idRequisition: "1",
      imageUrl: "url",
    });

    expect(state.requisitionImage?.imageUrl).toBe("url");
    expect(state.updating).toBe(false);
    expect(state.successPut).toBe(true);
  });
});

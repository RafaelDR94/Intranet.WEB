import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DeviceAssignmentResponsiveUrlState, Get, Set } from "../types";

import { updateDeviceAssignmentResponsiveUrl } from "./updateDeviceAssignmentResponsiveUrl";

const putMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pPut: () => putMock,
}));
vi.mock(
  "@/app/mappings/deviceAssignmentResponsiveUrl/deviceAssignmentResponsiveUrl.map",
  () => ({
    DeviceAssignmentResponsiveUrlMap: (d: unknown) => d,
    DeviceAssignmentResponsiveUrlPutMap: (d: unknown) => d,
  }),
);

describe("DeviceAssignmentResponsiveUrl utilities", () => {
  beforeEach(() => {
    putMock.mockReset();
  });

  it("updateDeviceAssignmentResponsiveUrl actualiza la responsiva", async () => {
    const state: Partial<DeviceAssignmentResponsiveUrlState> = {
      assignmentResponsive: undefined,
      updating: false,
      successPut: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as DeviceAssignmentResponsiveUrlState)
          : partial,
      );
    const get: Get = () => state as DeviceAssignmentResponsiveUrlState;

    putMock.mockResolvedValue({
      data: { data: { idDeviceAssignment: "1", responsiveUrl: "url" } },
    });

    await updateDeviceAssignmentResponsiveUrl(set, get, {
      idDeviceAssignment: "1",
      responsiveUrl: "url",
    });

    expect(state.assignmentResponsive?.responsiveUrl).toBe("url");
    expect(state.updating).toBe(false);
    expect(state.successPut).toBe(true);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Set } from "./types";

const { fetchEnterprisesMock, fetchWorkpositionsMock } = vi.hoisted(() => {
  const enterprisesMock = vi.fn(async (set: Set) => {
    set({
      enterprises: [{ enterprise_id: "ent-1", name: "Demo", departments: [] }],
      loadingEnterprises: false,
      successGetEnterprises: true,
    });
  });

  const workpositionsMock = vi.fn(async (_enterpriseId: string | undefined, set: Set) => {
    set({
      workpositions: [
        { workposition_id: "wp-1", name: "Developer" } as any,
      ],
      loadingWorkpositions: false,
      successGetWorkpositions: true,
    });
    return [{ workposition_id: "wp-1", name: "Developer" } as any];
  });

  return {
    fetchEnterprisesMock: enterprisesMock,
    fetchWorkpositionsMock: workpositionsMock,
  };
});

vi.mock("./utilities", () => ({
  fetchEnterprises: fetchEnterprisesMock,
  fetchWorkpositions: fetchWorkpositionsMock,
}));

import { useEnterprisesStore } from "./useEnterprisesStore";

describe("useEnterprisesStore", () => {
  beforeEach(() => {
    const { reset, resetFlags } = useEnterprisesStore.getState();
    reset();
    resetFlags();
    fetchEnterprisesMock.mockClear();
    fetchWorkpositionsMock.mockClear();
  });

  it("inicia con colecciones vacias", () => {
    const state = useEnterprisesStore.getState();
    expect(state.enterprises).toEqual([]);
    expect(state.workpositions).toEqual([]);
    expect(state.workpositionsByEnterprise).toEqual({});
    expect(state.loadingEnterprises).toBe(false);
    expect(state.loadingWorkpositions).toBe(false);
  });

  it("fetchEnterprises actualiza la lista", async () => {
    await useEnterprisesStore.getState().fetchEnterprises();
    expect(fetchEnterprisesMock).toHaveBeenCalledTimes(1);
    expect(useEnterprisesStore.getState().enterprises).toEqual([
      { enterprise_id: "ent-1", name: "Demo", departments: [] },
    ]);
    expect(useEnterprisesStore.getState().successGetEnterprises).toBe(true);
  });

  it("fetchWorkpositions delega al utilitario y actualiza el estado", async () => {
    const result = await useEnterprisesStore
      .getState()
      .fetchWorkpositions("ent-1");

    expect(fetchWorkpositionsMock).toHaveBeenCalledWith(
      "ent-1",
      expect.any(Function),
      expect.any(Function),
      false
    );
    expect(result).toEqual([{ workposition_id: "wp-1", name: "Developer" }]);
    expect(useEnterprisesStore.getState().workpositions).toEqual([
      { workposition_id: "wp-1", name: "Developer" },
    ]);
    expect(useEnterprisesStore.getState().successGetWorkpositions).toBe(true);
  });
});

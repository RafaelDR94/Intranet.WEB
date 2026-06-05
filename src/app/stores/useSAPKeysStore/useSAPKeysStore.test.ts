import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Set } from "./types";

vi.mock("./utilities", () => ({
  fetchSAPKeys: vi.fn(async (set: Set) =>
    set({
      sapKeys: [{ id: "1", satKey: "86121700" } as any],
      loadingSAPKeys: false,
      successGetSAPKeys: true,
    }),
  ),
  fetchSAPKeyById: vi.fn(async () => null),
  createSAPKey: vi.fn(async () => null),
  updateSAPKey: vi.fn(async () => null),
  deleteSAPKey: vi.fn(async () => true),
}));

import { useSAPKeysStore } from "./useSAPKeysStore";

describe("useSAPKeysStore", () => {
  beforeEach(() => {
    useSAPKeysStore.setState({
      sapKeys: [],
      sapKey: undefined,
      loadingSAPKeys: false,
      loadingSAPKey: false,
      creatingSAPKey: false,
      updatingSAPKey: false,
      deletingSAPKey: false,
      successGetSAPKeys: false,
      successGetSAPKey: false,
      successCreateSAPKey: false,
      successUpdateSAPKey: false,
      successDeleteSAPKey: false,
      error: undefined,
      warning: undefined,
      fetchSAPKeys: useSAPKeysStore.getState().fetchSAPKeys,
      fetchSAPKeyById: useSAPKeysStore.getState().fetchSAPKeyById,
      createSAPKey: useSAPKeysStore.getState().createSAPKey,
      updateSAPKey: useSAPKeysStore.getState().updateSAPKey,
      deleteSAPKey: useSAPKeysStore.getState().deleteSAPKey,
      reset: useSAPKeysStore.getState().reset,
      resetFlags: useSAPKeysStore.getState().resetFlags,
    });
  });

  it("starts empty", () => {
    expect(useSAPKeysStore.getState().sapKeys).toEqual([]);
  });

  it("fills the list when fetchSAPKeys succeeds", async () => {
    await useSAPKeysStore.getState().fetchSAPKeys();

    expect(useSAPKeysStore.getState().sapKeys).toHaveLength(1);
    expect(useSAPKeysStore.getState().successGetSAPKeys).toBe(true);
  });
});

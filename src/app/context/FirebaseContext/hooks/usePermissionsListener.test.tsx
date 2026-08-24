import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const refMock = vi.hoisted(() => vi.fn());
const onValueMock = vi.hoisted(() => vi.fn());

vi.mock("firebase/database", () => ({
  ref: refMock,
  onValue: onValueMock,
}));

import { usePermissionsListener } from "./usePermissionsListener";

describe("usePermissionsListener", () => {
  afterEach(() => vi.clearAllMocks());

  it("se suscribe sólo al nodo del UID Firebase y aplica la carga inicial", async () => {
    const unsubscribe = vi.fn();
    const database = {} as never;
    let notify: ((snapshot: { exists: () => boolean; val: () => unknown }) => void) | undefined;
    onValueMock.mockImplementation((_reference, callback) => {
      notify = callback;
      return unsubscribe;
    });

    const { result, unmount } = renderHook(() =>
      usePermissionsListener(database, "firebase-uid"),
    );

    await waitFor(() => expect(onValueMock).toHaveBeenCalledOnce());

    act(() => {
      notify?.({ exists: () => true, val: () => ({ main: { Acces: true } }) });
    });

    await waitFor(() => {
      expect(result.current).toBe(JSON.stringify({ main: { Acces: true } }));
    });
    expect(refMock).toHaveBeenCalledWith(database, "permissionsByUid/firebase-uid");

    unmount();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("no crea una suscripción sin un UID Firebase autenticado", () => {
    renderHook(() => usePermissionsListener({} as never, null));
    expect(onValueMock).not.toHaveBeenCalled();
  });
});

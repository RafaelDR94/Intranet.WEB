import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";

import RequisitionsPage from "./page";

Object.assign(globalThis, { React });

const PermissionRedirect = vi.hoisted(() =>
  vi.fn(() => <div>PermissionRedirect</div>),
);

vi.mock("@/app/components/PermissionRedirect/PermissionRedirect", () => ({
  PermissionRedirect,
}));

describe("RequisitionsPage", () => {
  it("passes requisitions routes to PermissionRedirect", () => {
    render(<RequisitionsPage />);

    expect(PermissionRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        routes: [
          "/main-page/accounting/requisitions/requisitionsList",
          "/main-page/accounting/requisitions/requisitionRequest",
        ],
      }),
      undefined,
    );
  });
});

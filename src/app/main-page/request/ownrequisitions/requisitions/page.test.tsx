import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import RequisitionsPage from "./page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("./componentes/RequisitionsDetails/RequisitionDetails", () => ({
  __esModule: true,
  default: () => <div>RequisitionDetails</div>,
}));

vi.mock("./componentes/RequisitionsTable/RequisitionsTable", () => ({
  __esModule: true,
  default: () => <div>RequisitionsTable</div>,
}));

vi.mock("@/app/main-page/request/ownrequisitions/billablefiles/page", () => ({
  __esModule: true,
  default: () => <div>BillableFilesPage</div>,
}));

vi.mock("@/tutorials/engine/useTutorialAutoRun", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("ownrequisitions/requisitions page", () => {
  it("renders only the list when there is no requisition id", () => {
    render(<RequisitionsPage />);

    expect(screen.getByText("RequisitionsTable")).toBeInTheDocument();
    expect(screen.queryByText("RequisitionDetails")).not.toBeInTheDocument();
  });
});

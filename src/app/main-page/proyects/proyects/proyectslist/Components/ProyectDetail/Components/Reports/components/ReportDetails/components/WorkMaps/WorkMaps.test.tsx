import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import WorkMaps from "./WorkMaps";

const itemsMock = [{ title: "Mapa", description: "Area", image: "map.png" }];

vi.mock("./hooks/useWorkMaps", () => ({
  __esModule: true,
  default: () => ({ items: itemsMock }),
}));

vi.mock("../EmployeeName/EmployeeName", () => ({
  __esModule: true,
  default: () => <div data-testid="employee-name" />,
}));

vi.mock("@/app/components/ActivitiesViewer/ActivitiesViewer", () => ({
  __esModule: true,
  default: ({ items }: any) => <div data-testid="maps-viewer">{items.length}</div>,
}));

describe("WorkMaps component", () => {
  it("renderiza las imagenes del mapa de trabajo", () => {
    render(<WorkMaps />);

    expect(screen.getByTestId("employee-name")).toBeInTheDocument();
    expect(screen.getByTestId("maps-viewer").textContent).toBe("1");
  });
});

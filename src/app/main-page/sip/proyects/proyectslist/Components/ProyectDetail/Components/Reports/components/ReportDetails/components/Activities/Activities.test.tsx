import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import Activities from "./Activities";

const itemsMock = [{ title: "Actividad", description: "Detalle", image: "img.png" }];

vi.mock("./hooks/useActivities", () => ({
  __esModule: true,
  default: () => ({ items: itemsMock }),
}));

vi.mock("../EmployeeName/EmployeeName", () => ({
  __esModule: true,
  default: () => <div data-testid="employee-name" />,
}));

vi.mock("@/app/components/ActivitiesViewer/ActivitiesViewer", () => ({
  __esModule: true,
  default: ({ items }: any) => (
    <div data-testid="activities-viewer">{items.map((i: any) => i.title).join(",")}</div>
  ),
}));

describe("Activities component", () => {
  it("presenta el nombre del empleado y la lista de actividades", () => {
    render(<Activities />);

    expect(screen.getByTestId("employee-name")).toBeInTheDocument();
    expect(screen.getByTestId("activities-viewer").textContent).toContain("Actividad");
  });
});

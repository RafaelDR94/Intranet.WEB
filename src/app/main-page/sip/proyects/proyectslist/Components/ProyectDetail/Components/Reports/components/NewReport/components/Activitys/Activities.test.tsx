import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Activities from "./Activities";

const hookState = {
  report: { clientsign: { url: null } },
  canStart: true,
};

const addActivitiesSpy = vi.fn();

vi.mock("./hooks/useActivities", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("./components", () => ({
  __esModule: true,
  AddActivities: (props: any) => {
    addActivitiesSpy(props);
    return <div data-testid="add-activities" data-hide={props.hideAdd ? "true" : "false"} />;
  },
}));

describe("Activities", () => {
  beforeEach(() => {
    hookState.canStart = true;
    hookState.report = { clientsign: { url: null } };
    addActivitiesSpy.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("no renderiza nada cuando el flujo todavia no puede iniciar", () => {
    hookState.canStart = false;

    const { container } = render(<Activities />);

    expect(container.firstChild).toBeNull();
    expect(addActivitiesSpy).not.toHaveBeenCalled();
  });

  it("inyecta el estado del hook en AddActivities y calcula hideAdd segun la firma del cliente", () => {
    hookState.report = { clientsign: { url: "https://cdn.example.com/sign.png" } };

    render(<Activities />);

    expect(screen.getByTestId("add-activities")).toBeInTheDocument();
    expect(addActivitiesSpy).toHaveBeenCalledWith(
      expect.objectContaining({ hideAdd: true })
    );
    expect(screen.getByTestId("add-activities")).toHaveAttribute("data-hide", "true");
  });
});

import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Devices from "./Devices";

const hookState = {
  selectedRowId: null as string | null,
  handleCreate: vi.fn(),
  handleEdit: vi.fn(),
  handleCloseForm: vi.fn(),
};

const listSpy = vi.fn();
const formSpy = vi.fn();

vi.mock("./hooks/useDevices", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("./Components/DevicesList/DevicesList", () => ({
  __esModule: true,
  default: (props: any) => {
    listSpy(props);
    return <div data-testid="devices-list" />;
  },
}));

vi.mock("./Components/DevicesForm/DevicesForm", () => ({
  __esModule: true,
  default: (props: any) => {
    formSpy(props);
    return <div data-testid="devices-form" />;
  },
}));

describe("Devices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookState.selectedRowId = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("muestra la lista de equipos mientras no haya un elemento seleccionado", () => {
    render(<Devices />);

    expect(screen.getByTestId("devices-list")).toBeInTheDocument();
    expect(listSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedRowId: null,
        onCreate: hookState.handleCreate,
        onEdit: hookState.handleEdit,
      })
    );
    expect(formSpy).not.toHaveBeenCalled();
  });

  it("al seleccionar un equipo abre el formulario y oculta la lista", () => {
    hookState.selectedRowId = "DEV-1";

    render(<Devices />);

    expect(screen.queryByTestId("devices-list")).toBeNull();
    expect(screen.getByTestId("devices-form")).toBeInTheDocument();
    expect(formSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedRowId: "DEV-1",
        onClose: hookState.handleCloseForm,
        onSaved: hookState.handleCloseForm,
      })
    );
  });
});

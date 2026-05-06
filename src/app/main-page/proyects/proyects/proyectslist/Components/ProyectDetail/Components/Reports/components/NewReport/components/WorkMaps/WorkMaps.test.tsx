import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import WorkMaps from "./WorkMaps";

const hookState = {
  handleImageSelection: vi.fn(),
  handleSave: vi.fn(),
  handleCancel: vi.fn(),
  setDirection: vi.fn(),
  handleEdit: vi.fn(),
  isEditing: false,
  imagePreview: null as string | null,
  currentMap: null as any,
  direction: "",
  submitTokenRef: { current: 0 },
  report: { clientsign: { url: null } },
};

vi.mock("./hooks/useWorkMaps", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/components/Input/Input", () => ({
  Input: ({ value, onChange, helperText, ...rest }: any) => (
    <input
      data-testid="work-map-address"
      value={value}
      onChange={onChange}
      {...rest}
    />
  ),
}));

vi.mock("@/app/components/ImageUploaderExpanded/ImageUploaderExpanded", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid={props.dataTestId ?? "work-map-uploader"}>
      <button type="button" onClick={() => props.onImage?.(new File(["map"], "map.png"))}>
        subir
      </button>
    </div>
  ),
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

describe("WorkMaps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(hookState, {
      isEditing: false,
      imagePreview: null,
      currentMap: {
        urlimage: "https://cdn.example.com/map.png",
        description: "Ubicacion actual",
      },
      direction: "Ubicacion actual",
      report: { clientsign: { url: null } },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el mapa actual cuando existe uno registrado", () => {
    render(<WorkMaps />);

    expect(screen.getByAltText("Mapa guardado")).toHaveAttribute(
      "src",
      "https://cdn.example.com/map.png"
    );
  });

  it("habilita los controles de edicion cuando el usuario inicia una actualizacion", () => {
    Object.assign(hookState, { isEditing: true, imagePreview: "data:image/png;base64,new" });

    render(<WorkMaps />);

    expect(screen.getByTestId("work-map-address")).toHaveValue("Ubicacion actual");
    fireEvent.change(screen.getByTestId("work-map-address"), { target: { value: "Nueva" } });
    expect(hookState.setDirection).toHaveBeenCalledWith("Nueva");

    fireEvent.click(screen.getByText(/Guardar Mapa/i));
    expect(hookState.handleSave).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(hookState.handleCancel).toHaveBeenCalled();
  });

  it("oculta los controles de edicion cuando el reporte ya esta firmado", () => {
    hookState.report = { clientsign: { url: "https://cdn.example.com/sign.png" } };

    render(<WorkMaps />);

    expect(screen.queryByText(/Guardar Mapa/i)).toBeNull();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AddActivities from "./AddActivities";

const hookState = {
  imagePreview: null as string | null,
  formFields: [],
  viewerItems: [] as Array<{ title: string }>,
  isFormValid: false,
  hasSelection: false,
  resetForm: vi.fn(),
  handleImage: vi.fn(),
  handleFormSubmit: vi.fn(),
  handleSaveClick: vi.fn(),
  submitRef: { current: null as null | (() => void | Promise<void>) },
  fieldsVersion: 0,
  uploaderVersion: 0,
  setIsFormValid: vi.fn(),
  pendingDelete: null,
  confirmActivityDelete: vi.fn(),
  cancelActivityDelete: vi.fn(),
} as const;

const popUpSpy = vi.fn();
const uploaderSpy = vi.fn();
const dynamicFormSpy = vi.fn();
const viewerSpy = vi.fn();

vi.mock("./hooks/useAddActivities", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/components/Button/Button", () => ({
  Button: ({ children, onClick, disabled, hideIcon, ...rest }: any) => (
    <button
      type="button"
      data-testid="mock-button"
      data-disabled={disabled ? "true" : "false"}
      data-hide-icon={hideIcon ? "true" : "false"}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  __esModule: true,
  default: (props: any) => {
    dynamicFormSpy(props);
    return <form data-testid="mock-form" onSubmit={(event) => event.preventDefault()} />;
  },
}));

vi.mock("@/app/components/ImageUploaderExpanded/ImageUploaderExpanded", () => ({
  __esModule: true,
  default: (props: any) => {
    uploaderSpy(props);
    return (
      <div data-testid={props.dataTestId ?? "mock-uploader"}>
        <button type="button" onClick={() => props.onImage?.(new File(["mock"], "mock.png"))}>
          subir
        </button>
      </div>
    );
  },
}));

vi.mock("@/app/components/ActivitiesViewer/ActivitiesViewer", () => ({
  __esModule: true,
  default: (props: any) => {
    viewerSpy(props);
    return <div data-testid="mock-viewer" />;
  },
}));

vi.mock("@/app/components/PopUp/PopUp", () => ({
  PopUp: (props: any) => {
    popUpSpy(props);
    if (!props.open) return null;
    return (
      <div data-testid="mock-popup">
        <button type="button" onClick={props.onPrimaryButtonClick}>
          confirmar
        </button>
        <button type="button" onClick={props.onClose}>
          cerrar
        </button>
      </div>
    );
  },
}));

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

describe("AddActivities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(hookState, {
      imagePreview: null,
      viewerItems: [{ title: "Actividad 1" }],
      hasSelection: false,
      pendingDelete: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("muestra la lista de actividades y habilita la carga cuando no hay seleccion", () => {
    render(<AddActivities hideAdd={false} />);

    expect(screen.getByTestId("mock-viewer")).toBeInTheDocument();
    expect(viewerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ items: hookState.viewerItems })
    );
    expect(screen.getByTestId("add-activity-uploader")).toBeInTheDocument();
    expect(popUpSpy).toHaveBeenCalledWith(expect.objectContaining({ open: false }));
  });

  it("despliega el formulario de edicion cuando existe una seleccion activa", () => {
    Object.assign(hookState, { hasSelection: true, imagePreview: "data:image/png;base64,mock" });

    render(<AddActivities hideAdd={true} />);

    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
    expect(dynamicFormSpy).toHaveBeenCalled();
    expect(uploaderSpy.mock.calls.some(([props]: any[]) => props.buttonLabel === "Cambiar Imagen")).toBe(
      true
    );
  });

  it("delegates las acciones primarias del popup y botones", () => {
    Object.assign(hookState, { pendingDelete: { activity: { title: "Demo" } } });

    render(<AddActivities hideAdd={false} />);

    expect(screen.getByTestId("mock-popup")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "confirmar" }));
    expect(hookState.confirmActivityDelete).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "cerrar" }));
    expect(hookState.cancelActivityDelete).toHaveBeenCalled();
  });
});

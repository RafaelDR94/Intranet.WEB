import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Advance from "./Advance";

const hookState = {
  report: { clientsign: { url: null } },
  canStart: true,
  formFields: [{ name: "ticket", type: "input", value: "", label: "" }],
  onFormSubmit: vi.fn(),
  formId: "new-report-avance-form",
  categoriesLoading: false,
  onFormValidChange: vi.fn(),
  isStepValid: true,
  handleValuesChange: vi.fn(),
};

const dynamicFormSpy = vi.fn();

vi.mock("./hooks/useAdvanceForm", () => ({
  __esModule: true,
  default: () => hookState,
}));

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  __esModule: true,
  default: (props: any) => {
    dynamicFormSpy(props);
    return <form data-testid="advance-form" />;
  },
}));

vi.mock("@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery", () => ({
  useIsMobile: () => false,
}));

describe("Advance", () => {
  const submitRef = { current: null as null | (() => void | Promise<void>) };
  const stepValidSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(hookState, { canStart: true, isStepValid: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("omite el render cuando no existe modelo activo", () => {
    const { container } = render(
      <Advance submitRef={submitRef} currentModelName="" onStepValidChange={stepValidSpy} />
    );

    expect(container.firstChild).toBeNull();
    expect(stepValidSpy).not.toHaveBeenCalled();
  });

  it("renderiza el formulario con los props del hook y notifica la validez", () => {
    render(
      <Advance
        submitRef={submitRef}
        currentModelName="Avance"
        onStepValidChange={stepValidSpy}
      />
    );

    expect(screen.getByTestId("advance-form")).toBeInTheDocument();
    expect(dynamicFormSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        dataTestId: hookState.formId,
        fields: hookState.formFields,
        externalSubmitRef: submitRef,
      })
    );
    expect(stepValidSpy).toHaveBeenCalledWith(true);
  });

  it("bloquea el formulario cuando el reporte ya tiene firma del cliente", () => {
    hookState.report = { clientsign: { url: "https://cdn.example.com/sign.png" } };

    render(
      <Advance
        submitRef={submitRef}
        currentModelName="Avance"
        onStepValidChange={stepValidSpy}
      />
    );

    const call = dynamicFormSpy.mock.calls.at(-1)?.[0];
    expect(call?.disabled).toBe(true);
  });
});

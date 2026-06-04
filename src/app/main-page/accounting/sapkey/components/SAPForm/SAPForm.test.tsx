import { render, act } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SAPForm from "./SAPForm";

let dynamicFormProps: any;
let formsLayoutProps: any;

const showAlert = vi.hoisted(() => vi.fn());

vi.mock("@/app/components/DynamicForm/DynamicForm", () => ({
  default: (props: any) => {
    dynamicFormProps = props;
    return <div>DynamicForm</div>;
  },
}));

vi.mock("@/app/components/FormsLayout/FormsLayout", () => ({
  default: (props: any) => {
    formsLayoutProps = props;
    return <div>{props.children}</div>;
  },
}));

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: vi.fn(() => ({
    usePrincipalAlert: { showAlert },
  })),
}));

describe("SAPForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dynamicFormProps = undefined;
    formsLayoutProps = undefined;
  });

  it("builds the dynamic form without cuenta de mayor", () => {
    render(
      <SAPForm
        mode="create"
        sapKey={null}
        onBack={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const labels = dynamicFormProps.fields.map((field: any) => field.label);

    expect(formsLayoutProps.title).toBe("Nueva clave SAP y SAT");
    expect(labels).toEqual([
      "Tipo de gasto",
      "Denominación de gasto",
      "Grupo IVA",
      "Clave SAT",
      "Descripción",
      "Tipo de clave SAP",
    ]);
    expect(labels).not.toContain("Cuenta de mayor");
  });

  it("hydrates edit values for iva and gtsType", () => {
    render(
      <SAPForm
        mode="edit"
        sapKey={{
          id: "sap-1",
          satKey: "86121700",
          descriptionSatKey: "Servicio",
          internalKey: "G001",
          descriptionInternalKey: "Gasto operativo",
          gtsType: "A",
          iva: 0.16,
          isActive: true,
        }}
        onBack={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      dynamicFormProps.fields.find((field: any) => field.name === "ivaOptionId")
        .value,
    ).toBe("iva_16");
    expect(
      dynamicFormProps.fields.find((field: any) => field.name === "gtsType")
        .value,
    ).toBe("A");
  });

  it("maps dynamic form values into the post payload", async () => {
    const onSubmit = vi.fn();

    render(
      <SAPForm
        mode="create"
        sapKey={null}
        onBack={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await act(async () => {
      await dynamicFormProps.onSubmit({
        internalKey: "G201",
        descriptionInternalKey: "Nuevo gasto",
        ivaOptionId: "iva_8",
        satKey: "86121701",
        descriptionSatKey: "Servicio nuevo",
        gtsType: "O",
      });
    });

    expect(onSubmit).toHaveBeenCalledWith({
      internalKey: "G201",
      descriptionInternalKey: "Nuevo gasto",
      iva: 0.08,
      satKey: "86121701",
      descriptionSatKey: "Servicio nuevo",
      gtsType: "O",
    });
  });
});

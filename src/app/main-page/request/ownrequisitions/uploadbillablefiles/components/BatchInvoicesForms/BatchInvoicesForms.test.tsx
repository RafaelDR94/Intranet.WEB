import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BatchInvoicesForms from "./BatchInvoicesForms";

const showAlert = vi.hoisted(() => vi.fn());
const hideAlert = vi.hoisted(() => vi.fn());
const showSpinner = vi.hoisted(() => vi.fn());
const hideSpinner = vi.hoisted(() => vi.fn());
const resetFields = vi.hoisted(() => vi.fn());
const invoicePropsByFormId = vi.hoisted(
  () => new Map<string, Record<string, any>>(),
);

const FormsLayoutMock = vi.hoisted(() =>
  vi.fn(
    ({
      title,
      primaryLabel,
      primaryDisabled,
      onPrimaryClick,
      children,
    }: {
      title: string;
      primaryLabel: string;
      primaryDisabled?: boolean;
      onPrimaryClick?: () => void;
      children: React.ReactNode;
    }) => (
      <div>
        <div>{title}</div>
        <button
          type="button"
          onClick={onPrimaryClick}
          disabled={primaryDisabled}
        >
          {primaryLabel}
        </button>
        {children}
      </div>
    ),
  ),
);

const InvoicesFormMock = vi.hoisted(() =>
  vi.fn((props: Record<string, any>) => {
    invoicePropsByFormId.set(props.formId, props);
    return <div data-testid="invoice-form-mock">{props.formId}</div>;
  }),
);

vi.mock("@/app/context/PrincipalContext/PrincipalContext", () => ({
  usePrincipal: () => ({
    usePrincipalAlert: { showAlert, hideAlert },
    usePrincipalLoading: { showSpinner, hideSpinner },
  }),
}));

vi.mock("@/app/components/FormsLayout/FormsLayout", () => ({
  __esModule: true,
  default: FormsLayoutMock,
}));

vi.mock(
  "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm",
  () => ({
    __esModule: true,
    default: InvoicesFormMock,
  }),
);

vi.mock("@/app/stores/useFormFieldsStore/useFormFieldsStore", () => ({
  useFormFieldsStore: Object.assign(() => [], {
    getState: () => ({
      resetFields,
    }),
  }),
}));

const responsiveLayoutMatrix = { sm: [[10]] };

const getInvoiceProps = (formId: string) => {
  const props = invoicePropsByFormId.get(formId);
  if (!props) {
    throw new Error(`Missing props for form ${formId}`);
  }
  return props;
};

const markFormsValid = async () => {
  await act(async () => {
    Array.from(invoicePropsByFormId.values()).forEach((props) =>
      props.onValidChange?.(true),
    );
  });
};

const assignSubmitResult = (
  formId: string,
  implementation: () => Promise<{ ok: boolean; error?: string }>,
) => {
  getInvoiceProps(formId).submitRequestRef.current = implementation;
};

describe("BatchInvoicesForms", () => {
  beforeEach(() => {
    showAlert.mockClear();
    hideAlert.mockClear();
    showSpinner.mockClear();
    hideSpinner.mockClear();
    resetFields.mockClear();
    invoicePropsByFormId.clear();
    FormsLayoutMock.mockClear();
    InvoicesFormMock.mockClear();
  });

  it("renderiza un formulario inicial y mantiene el envio deshabilitado", () => {
    render(
      <BatchInvoicesForms responsiveLayoutMatrix={responsiveLayoutMatrix} />,
    );

    expect(screen.getAllByTestId("invoice-form-mock")).toHaveLength(1);
    expect(screen.getByText("Enviar archivos")).toBeDisabled();
    expect(screen.getByText("+Agregar factura")).toBeInTheDocument();
  });

  it("agrega y descarta formularios extra", async () => {
    render(
      <BatchInvoicesForms responsiveLayoutMatrix={responsiveLayoutMatrix} />,
    );

    fireEvent.click(screen.getByText("+Agregar factura"));

    expect(screen.getAllByTestId("invoice-form-mock")).toHaveLength(2);

    fireEvent.click(screen.getAllByText("Descartar")[0]);

    await waitFor(() =>
      expect(screen.getAllByTestId("invoice-form-mock")).toHaveLength(1),
    );
    expect(resetFields).toHaveBeenCalledTimes(1);
  });

  it("habilita el envio solo cuando todos los formularios son validos", async () => {
    render(
      <BatchInvoicesForms responsiveLayoutMatrix={responsiveLayoutMatrix} />,
    );

    fireEvent.click(screen.getByText("+Agregar factura"));

    const submitButton = screen.getByText("Enviar archivos");
    const [firstFormId, secondFormId] = Array.from(invoicePropsByFormId.keys());

    await act(async () => {
      getInvoiceProps(firstFormId).onValidChange(false);
      getInvoiceProps(secondFormId).onValidChange(true);
    });
    expect(submitButton).toBeDisabled();

    await act(async () => {
      getInvoiceProps(firstFormId).onValidChange(true);
    });
    expect(submitButton).toBeEnabled();
  });

  it("deja un solo formulario limpio cuando todas las facturas pasan", async () => {
    render(
      <BatchInvoicesForms responsiveLayoutMatrix={responsiveLayoutMatrix} />,
    );

    const [formId] = Array.from(invoicePropsByFormId.keys());
    assignSubmitResult(formId, vi.fn().mockResolvedValue({ ok: true }));
    await markFormsValid();

    fireEvent.click(screen.getByText("Enviar archivos"));

    await waitFor(() =>
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success" }),
      ),
    );
    expect(showSpinner).toHaveBeenCalled();
    expect(hideSpinner).toHaveBeenCalled();
    expect(screen.getAllByTestId("invoice-form-mock")).toHaveLength(1);
  });

  it("conserva solo los formularios fallidos y muestra alerta amarilla en resultado mixto", async () => {
    render(
      <BatchInvoicesForms responsiveLayoutMatrix={responsiveLayoutMatrix} />,
    );

    fireEvent.click(screen.getByText("+Agregar factura"));

    const [firstFormId, secondFormId] = Array.from(invoicePropsByFormId.keys());
    assignSubmitResult(firstFormId, vi.fn().mockResolvedValue({ ok: true }));
    assignSubmitResult(
      secondFormId,
      vi.fn().mockResolvedValue({ ok: false, error: "fallo" }),
    );
    await markFormsValid();

    fireEvent.click(screen.getByText("Enviar archivos"));

    await waitFor(() =>
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ type: "warning" }),
      ),
    );
    expect(screen.getAllByTestId("invoice-form-mock")).toHaveLength(1);
    expect(screen.getByText(secondFormId)).toBeInTheDocument();
  });

  it("mantiene todos los formularios cuando todas las facturas fallan", async () => {
    render(
      <BatchInvoicesForms responsiveLayoutMatrix={responsiveLayoutMatrix} />,
    );

    fireEvent.click(screen.getByText("+Agregar factura"));

    Array.from(invoicePropsByFormId.keys()).forEach((formId) => {
      assignSubmitResult(
        formId,
        vi.fn().mockResolvedValue({ ok: false, error: "fallo" }),
      );
    });
    await markFormsValid();

    fireEvent.click(screen.getByText("Enviar archivos"));

    await waitFor(() =>
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" }),
      ),
    );
    expect(screen.getAllByTestId("invoice-form-mock")).toHaveLength(2);
  });
});

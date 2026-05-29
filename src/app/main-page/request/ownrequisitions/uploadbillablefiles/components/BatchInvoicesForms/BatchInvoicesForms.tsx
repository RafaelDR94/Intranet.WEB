"use client";

import React from "react";

import { Button } from "@/app/components/Button/Button";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import type { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import type { InvoiceSubmitResult } from "@/app/main-page/accounting/personalInvoices/invoices/components/types";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";

type BatchInvoicesFormsProps = {
  responsiveLayoutMatrix: ResponsiveLayoutMatrix;
};

type InvoiceBatchItem = {
  id: string;
  formId: string;
  externalSubmitRef: React.RefObject<(() => void | Promise<void>) | null>;
  submitRequestRef: React.RefObject<
    (() => Promise<InvoiceSubmitResult>) | null
  >;
};

const invoiceTitle =
  "Si ya cuentas con la factura, sube aqui tus archivos XML y PDF";

let invoiceFormCounter = 0;

const createInvoiceBatchItem = (): InvoiceBatchItem => {
  invoiceFormCounter += 1;
  const suffix = invoiceFormCounter;

  return {
    id: `invoice-item-${suffix}`,
    formId: `upload-billable-invoice-form-${suffix}`,
    externalSubmitRef: React.createRef<(() => void | Promise<void>) | null>(),
    submitRequestRef: React.createRef<() => Promise<InvoiceSubmitResult>>(),
  };
};

const BatchInvoicesForms: React.FC<BatchInvoicesFormsProps> = ({
  responsiveLayoutMatrix,
}) => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const initialItemRef = React.useRef<InvoiceBatchItem | null>(null);
  if (!initialItemRef.current) {
    initialItemRef.current = createInvoiceBatchItem();
  }
  const [invoiceItems, setInvoiceItems] = React.useState<InvoiceBatchItem[]>(
    () => [initialItemRef.current as InvoiceBatchItem],
  );
  const [validityById, setValidityById] = React.useState<
    Record<string, boolean>
  >(() => ({
    [(initialItemRef.current as InvoiceBatchItem).id]: false,
  }));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const allFormsValid =
    invoiceItems.length > 0 &&
    invoiceItems.every((item) => validityById[item.id] === true);

  const removeStoredFields = React.useCallback((formId: string) => {
    useFormFieldsStore.getState().resetFields(formId);
  }, []);

  const handleValidityChange = React.useCallback(
    (itemId: string, isValid: boolean) => {
      setValidityById((prev) => ({
        ...prev,
        [itemId]: isValid,
      }));
    },
    [],
  );

  const handleAddInvoice = React.useCallback(() => {
    if (isSubmitting) return;
    const nextItem = createInvoiceBatchItem();
    setInvoiceItems((prev) => [...prev, nextItem]);
    setValidityById((prev) => ({
      ...prev,
      [nextItem.id]: false,
    }));
  }, [isSubmitting]);

  const handleDiscardInvoice = React.useCallback(
    (item: InvoiceBatchItem) => {
      if (isSubmitting) return;
      setInvoiceItems((prev) =>
        prev.length > 1 ? prev.filter((entry) => entry.id !== item.id) : prev,
      );
      setValidityById((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      removeStoredFields(item.formId);
    },
    [isSubmitting, removeStoredFields],
  );

  const buildResultAlert = React.useCallback(
    (successCount: number, failureCount: number) => {
      if (failureCount === 0) {
        showAlert({
          type: "success",
          variant: "filled",
          title: "Facturas enviadas",
          description: `Se enviaron ${successCount} factura(s) correctamente.`,
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
        });
        return;
      }

      if (successCount > 0) {
        showAlert({
          type: "warning",
          variant: "filled",
          title: "Algunas facturas no se enviaron",
          description: `Se enviaron ${successCount} factura(s) y ${failureCount} fallaron. Revisa las que permanecen en la lista.`,
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: hideAlert,
        });
        return;
      }

      showAlert({
        type: "error",
        variant: "filled",
        title: "No se pudo enviar ninguna factura",
        description: `Fallaron ${failureCount} factura(s). Revisa los formularios e intentalo de nuevo.`,
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
      });
    },
    [hideAlert, showAlert],
  );

  const handleSubmitAll = React.useCallback(async () => {
    if (!allFormsValid || isSubmitting) return;

    const snapshot = [...invoiceItems];
    const failedIds = new Set<string>();
    let successCount = 0;
    let failureCount = 0;

    setIsSubmitting(true);
    showSpinner({ message: "Subiendo facturas..." });

    try {
      for (const [index, item] of snapshot.entries()) {
        const submit = item.submitRequestRef.current;
        const result = submit
          ? await submit()
          : ({
              ok: false,
              error: "No se encontro el formulario para enviar.",
            } satisfies InvoiceSubmitResult);

        if (!result.ok) {
          failedIds.add(item.id);
          failureCount += 1;
          continue;
        }

        successCount += 1;

        if (index < snapshot.length - 1) {
          setInvoiceItems((prev) =>
            prev.filter((entry) => entry.id !== item.id),
          );
          setValidityById((prev) => {
            const next = { ...prev };
            delete next[item.id];
            return next;
          });
          removeStoredFields(item.formId);
        }
      }
    } finally {
      hideSpinner();
      setIsSubmitting(false);
    }

    if (failureCount === 0) {
      snapshot.forEach((item) => removeStoredFields(item.formId));
      const cleanItem = createInvoiceBatchItem();
      setInvoiceItems([cleanItem]);
      setValidityById({ [cleanItem.id]: false });
      buildResultAlert(successCount, failureCount);
      return;
    }

    if (successCount > 0) {
      const failedItems = snapshot.filter((item) => failedIds.has(item.id));
      snapshot
        .filter((item) => !failedIds.has(item.id))
        .forEach((item) => removeStoredFields(item.formId));
      setInvoiceItems(failedItems);
      setValidityById((prev) =>
        failedItems.reduce<Record<string, boolean>>((acc, item) => {
          acc[item.id] = prev[item.id] ?? true;
          return acc;
        }, {}),
      );
      buildResultAlert(successCount, failureCount);
      return;
    }

    buildResultAlert(successCount, failureCount);
  }, [
    allFormsValid,
    buildResultAlert,
    hideSpinner,
    invoiceItems,
    isSubmitting,
    removeStoredFields,
    showSpinner,
  ]);

  return (
    <FormsLayout
      title={invoiceTitle}
      primaryLabel="Enviar archivos"
      onPrimaryClick={handleSubmitAll}
      primaryDisabled={!allFormsValid || isSubmitting}
      enableCollapse
      showBackground={false}
      cardClassName="p-0"
      primaryButtonDataTour="uploadbillablefiles-submit-invoices"
    >
      <div className="flex w-full flex-col gap-4">
        {invoiceItems.map((item, index) => (
          <div
            key={item.id}
            className="border-gray-20 bg-white-100 rounded-lg border p-6 shadow-md"
            data-testid="uploadbillablefiles-invoice-item"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-b3 text-gray-90 font-semibold">
                Factura {index + 1}
              </div>
              {invoiceItems.length > 1 && (
                <Button
                  type="button"
                  size="small"
                  variant="outline"
                  hideIcon
                  disabled={isSubmitting}
                  onClick={() => handleDiscardInvoice(item)}
                  dataTestId="uploadbillablefiles-discard-invoice"
                >
                  Descartar
                </Button>
              )}
            </div>

            <InvoicesForm
              responsiveLayoutMatrix={responsiveLayoutMatrix}
              withoutName
              formId={item.formId}
              externalSubmitRef={item.externalSubmitRef}
              submitRequestRef={item.submitRequestRef}
              onValidChange={(isValid) =>
                handleValidityChange(item.id, isValid)
              }
            />
          </div>
        ))}

        <div className="flex justify-start">
          <Button
            type="button"
            variant="ghost"
            size="small"
            hideIcon
            disabled={isSubmitting}
            onClick={handleAddInvoice}
            dataTestId="uploadbillablefiles-add-invoice"
          >
            +Agregar facturassssss
          </Button>
        </div>
      </div>
    </FormsLayout>
  );
};

export default BatchInvoicesForms;

"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import { Button } from "@/app/components/Button/Button";
import type { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import TicketForm from "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm";
import type { InvoiceSubmitResult } from "@/app/main-page/accounting/personalInvoices/invoices/components/types";
import type { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";

import TicketsFiles from "../TicketsFiles/TicketsFiles";

type UploadSection = "invoice" | "ticket";

type BillableFilesFlowProps = {
  selectedTicket: BillingImagesTable | null;
  onSelectedTicketChange: (ticket: BillingImagesTable | null) => void;
};

type InvoiceFlowItem = {
  id: string;
  formId: string;
  externalSubmitRef: React.RefObject<(() => void | Promise<void>) | null>;
  submitRequestRef: React.RefObject<
    (() => Promise<InvoiceSubmitResult>) | null
  >;
};

const sharedLayoutTitle = "Sube aqui tus archivos";
const invoiceLayoutTitle =
  "Si ya cuentas con la factura, sube aqui tus archivos XML y PDF";

let invoiceFlowCounter = 0;

const createInvoiceFlowItem = (): InvoiceFlowItem => {
  invoiceFlowCounter += 1;

  return {
    id: `operations-billable-invoice-${invoiceFlowCounter}`,
    formId: `operations-billable-invoice-form-${invoiceFlowCounter}`,
    externalSubmitRef: React.createRef<(() => void | Promise<void>) | null>(),
    submitRequestRef: React.createRef<() => Promise<InvoiceSubmitResult>>(),
  };
};

const invoiceResponsiveLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [5, 5], [5, 5]],
  md: [
    [5, 5],
    [3.3, 3.3, 3.3],
    [2.5, 2.5, 2.5, 2.5],
  ],
  lg: [
    [5, 5],
    [3.3, 3.3, 3.3],
    [2, 2, 3, 3],
  ],
};

const ticketResponsiveLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10]],
  md: [[5, 5], [10]],
  lg: [[5, 5], [10]],
};

const normalizeUploadSection = (value: string | null): UploadSection =>
  value === "ticket" ? "ticket" : "invoice";

const extractEmployeeName = (
  label: string | null,
  employeeName: string | null,
): string | null => {
  const explicitName = employeeName?.trim();
  if (explicitName) return explicitName;

  const trimmedLabel = label?.trim();
  if (!trimmedLabel) return null;
  if (!trimmedLabel.toLowerCase().startsWith("archivos ")) return null;

  const name = trimmedLabel.slice("archivos ".length).trim();
  return name || null;
};

const BillableFilesFlow: React.FC<BillableFilesFlowProps> = ({
  selectedTicket,
  onSelectedTicketChange,
}) => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const normalizedPath = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  const employeeId = searchParams.get("idEmployee") ?? searchParams.get("id");
  const currentLabel = searchParams.get("label");
  const currentEmployeeName = searchParams.get("employeeName");
  const fetchBillingImages = useBillingImagesStore((state) => state.fetchBillingImages);
  const uploadSection = normalizeUploadSection(searchParams.get("uploadSection"));
  const hasSelectedTicket = Boolean(selectedTicket?.billing_image_id);
  const activeUploadSection: UploadSection = hasSelectedTicket
    ? "invoice"
    : uploadSection;
  const hideBeneficiaryAndProject =
    normalizedPath ===
      "/main-page/operations/expenserequisitions/beneficiaryhistory" &&
    Boolean(searchParams.get("idRequisition"));
  const initialInvoiceItemRef = React.useRef<InvoiceFlowItem | null>(null);
  if (!initialInvoiceItemRef.current) {
    initialInvoiceItemRef.current = createInvoiceFlowItem();
  }
  const [invoiceItems, setInvoiceItems] = React.useState<InvoiceFlowItem[]>(
    () => [initialInvoiceItemRef.current as InvoiceFlowItem],
  );
  const [validityById, setValidityById] = React.useState<
    Record<string, boolean>
  >(() => ({
    [(initialInvoiceItemRef.current as InvoiceFlowItem).id]: false,
  }));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const displayName = React.useMemo(
    () => extractEmployeeName(currentLabel, currentEmployeeName),
    [currentEmployeeName, currentLabel],
  );
  const allInvoiceFormsValid =
    invoiceItems.length > 0 &&
    invoiceItems.every((item) => validityById[item.id] === true);

  const removeStoredFields = React.useCallback((formId: string) => {
    useFormFieldsStore.getState().resetFields(formId);
  }, []);

  const buildPath = React.useCallback(
    (nextSection: UploadSection) => {
      const nextQuery = new URLSearchParams(queryString);
      nextQuery.set("view", "billablefiles");
      nextQuery.set("uploadSection", nextSection);

      const nextQueryString = nextQuery.toString();
      return nextQueryString ? `${pathname}?${nextQueryString}` : pathname;
    },
    [pathname, queryString],
  );

  const handleSectionChange = React.useCallback(
    (nextSection: UploadSection) => {
      if (nextSection === activeUploadSection) return;
      router.push(buildPath(nextSection));
    },
    [activeUploadSection, buildPath, router],
  );

  const handleTicketSubmitSuccess = React.useCallback(() => {
    if (!employeeId) return;
    fetchBillingImages(employeeId, true);
  }, [employeeId, fetchBillingImages]);

  const handleSelectedTicketChange = React.useCallback(
    (ticket: BillingImagesTable | null) => {
      onSelectedTicketChange(ticket);
      if (ticket && uploadSection === "ticket") {
        router.push(buildPath("invoice"));
      }
    },
    [buildPath, onSelectedTicketChange, router, uploadSection],
  );

  const handleAddInvoice = React.useCallback(() => {
    if (isSubmitting) return;
    const nextItem = createInvoiceFlowItem();
    setInvoiceItems((prev) => [...prev, nextItem]);
    setValidityById((prev) => ({
      ...prev,
      [nextItem.id]: false,
    }));
  }, [isSubmitting]);

  const handleInvoiceValidityChange = React.useCallback(
    (itemId: string, isValid: boolean) => {
      setValidityById((prev) => ({
        ...prev,
        [itemId]: isValid,
      }));
    },
    [],
  );

  const handleDiscardInvoice = React.useCallback(
    (item: InvoiceFlowItem) => {
      if (isSubmitting || invoiceItems.length <= 1) return;
      setInvoiceItems((prev) => prev.filter((entry) => entry.id !== item.id));
      setValidityById((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      removeStoredFields(item.formId);
    },
    [invoiceItems.length, isSubmitting, removeStoredFields],
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

  const handleSubmitInvoices = React.useCallback(async () => {
    if (!allInvoiceFormsValid || isSubmitting) return;

    const snapshot = [...invoiceItems];
    const failedIds = new Set<string>();
    let successCount = 0;
    let failureCount = 0;

    setIsSubmitting(true);
    showSpinner({ message: "Subiendo facturas..." });

    try {
      for (const item of snapshot) {
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
      }
    } finally {
      hideSpinner();
      setIsSubmitting(false);
    }

    if (failureCount === 0) {
      snapshot.forEach((item) => removeStoredFields(item.formId));
      const cleanItem = createInvoiceFlowItem();
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
    allInvoiceFormsValid,
    buildResultAlert,
    hideSpinner,
    invoiceItems,
    isSubmitting,
    removeStoredFields,
    showSpinner,
  ]);

  const headerContent = React.useMemo(
    () => (
      <div className="flex w-full flex-col gap-3">
        <Breadcrumbs
          activeId={activeUploadSection}
          ariaLabel="Secciones de carga"
          className="space-y-0"
          dataTestId="operations-billable-breadcrumbs"
        >
          <Breadcrumbs.Item
            id="invoice"
            label="Carga  de Facturas"
            onClick={() => handleSectionChange("invoice")}
          />
          {!hasSelectedTicket && (
            <Breadcrumbs.Item
              id="ticket"
              label="Carga de tickets"
              onClick={() => handleSectionChange("ticket")}
            />
          )}
        </Breadcrumbs>
      </div>
    ),
    [activeUploadSection, handleSectionChange, hasSelectedTicket],
  );

  return (
    <div className="flex flex-col gap-4">
      {activeUploadSection === "ticket" ? (
        <>
          <TicketForm
            responsiveLayoutMatrix={ticketResponsiveLayout}
            layoutTitle={sharedLayoutTitle}
            layoutPrimaryLabel="Subir Archivos"
            uploadFieldLabel="Imagenes de los tickets (JPG o PNG)"
            uploadFieldPlaceholder="o arrastra/selecciona las imagenes que deseas subir"
            uploadFieldButtonLabel="Seleccionar tickets"
            headerContent={headerContent}
            showInlineEmployeeName={Boolean(displayName)}
            inlineEmployeeNameValue={displayName ?? undefined}
            onSubmitSuccess={handleTicketSubmitSuccess}
          />
          <TicketsFiles
            eneableSelection={true}
            onSelectedTicketChange={handleSelectedTicketChange}
            selectedTicketId={selectedTicket?.billing_image_id ?? null}
          />
        </>
      ) : (
        <>
          <FormsLayout
            title={invoiceLayoutTitle}
            primaryLabel="Enviar archivos"
            onPrimaryClick={handleSubmitInvoices}
            primaryDisabled={!allInvoiceFormsValid || isSubmitting}
            enableCollapse
            showBackground={false}
            cardClassName="p-0"
            primaryButtonDataTour="operations-billable-submit-invoices"
          >
            <div className="bg-white-100 flex w-full flex-col gap-3 rounded-lg p-5 shadow-sm">
              {headerContent}
              {invoiceItems.map((item, index) => (
                <div
                  key={item.id}
                  className={index > 0 ? "border-gray-20 mt-6 border-t pt-6" : ""}
                  data-testid="operations-billable-invoice-item"
                >
                  <div className="mb-3 flex min-h-7 items-center justify-between gap-3">
                    <div className="text-b3 text-gray-90 font-semibold leading-none">
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
                        dataTestId="operations-billable-discard-invoice"
                      >
                        Descartar
                      </Button>
                    )}
                  </div>

                  <InvoicesForm
                    responsiveLayoutMatrix={invoiceResponsiveLayout}
                    withoutName
                    hideBeneficiaryAndProject={hideBeneficiaryAndProject}
                    formId={item.formId}
                    externalSubmitRef={item.externalSubmitRef}
                    submitRequestRef={item.submitRequestRef}
                    billingImages={index === 0 ? selectedTicket : null}
                    onCloseImage={() => onSelectedTicketChange(null)}
                    formClassName="text-c2"
                    rowClassName="!mb-2 !gap-3 items-end"
                    onValidChange={(isValid) =>
                      handleInvoiceValidityChange(item.id, isValid)
                    }
                  />
                </div>
              ))}

              {!hasSelectedTicket && (
                <div className="border-blue-40 flex justify-start border-t pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    hideIcon
                    disabled={isSubmitting}
                    onClick={handleAddInvoice}
                    dataTestId="operations-billable-add-invoice"
                    className="text-blue-80"
                  >
                    + Agregar factura
                  </Button>
                </div>
              )}
            </div>
          </FormsLayout>
          <TicketsFiles
            eneableSelection={true}
            onSelectedTicketChange={handleSelectedTicketChange}
            selectedTicketId={selectedTicket?.billing_image_id ?? null}
          />
        </>
      )}
    </div>
  );
};

export default BillableFilesFlow;

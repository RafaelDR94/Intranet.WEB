"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import type { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import TicketForm from "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm";
import type { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";

import TicketsFiles from "../TicketsFiles/TicketsFiles";

type UploadSection = "invoice" | "ticket";

type BillableFilesFlowProps = {
  selectedTicket: BillingImagesTable | null;
  onSelectedTicketChange: (ticket: BillingImagesTable | null) => void;
};

const sharedLayoutTitle = "Sube aqui tus archivos";

const invoiceResponsiveLayout: ResponsiveLayoutMatrix = {
  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
  md: [
    [5, 5],
    [5, 5],
    [2.5, 2.5, 5],
    [5, 5],
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const employeeId = searchParams.get("idEmployee") ?? searchParams.get("id");
  const currentLabel = searchParams.get("label");
  const currentEmployeeName = searchParams.get("employeeName");
  const fetchBillingImages = useBillingImagesStore((state) => state.fetchBillingImages);
  const uploadSection = normalizeUploadSection(searchParams.get("uploadSection"));
  const displayName = React.useMemo(
    () => extractEmployeeName(currentLabel, currentEmployeeName),
    [currentEmployeeName, currentLabel],
  );

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
      if (nextSection === uploadSection) return;
      router.push(buildPath(nextSection));
    },
    [buildPath, router, uploadSection],
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

  const headerContent = React.useMemo(
    () => (
      <div className="flex w-full flex-col gap-3">
        <Breadcrumbs
          activeId={uploadSection}
          ariaLabel="Secciones de carga"
          className="space-y-0"
          dataTestId="operations-billable-breadcrumbs"
        >
          <Breadcrumbs.Item
            id="invoice"
            label="Subir una Factura"
            onClick={() => handleSectionChange("invoice")}
          />
          <Breadcrumbs.Item
            id="ticket"
            label="Carga de tickets"
            onClick={() => handleSectionChange("ticket")}
          />
        </Breadcrumbs>
      </div>
    ),
    [handleSectionChange, uploadSection],
  );

  return (
    <div className="flex flex-col gap-4">
      {uploadSection === "ticket" ? (
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
          <InvoicesForm
            responsiveLayoutMatrix={invoiceResponsiveLayout}
            withoutName
            billingImages={selectedTicket}
            onCloseImage={() => onSelectedTicketChange(null)}
            layoutTitle={sharedLayoutTitle}
            headerContent={headerContent}
          />
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

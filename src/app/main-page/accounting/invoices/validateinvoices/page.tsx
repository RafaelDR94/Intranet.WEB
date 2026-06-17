"use client"
import React from "react";

import DetailsPanel from "./components/DetailsPanel/DetailsPanel";
import { useValidateInvoices } from "./hooks/useValidateInvoices";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";
import { BillingDocuments } from "@/app/mappings/billingdocuments/billingdocuments.types";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";

type BillingDocumentsTableRow = BillingDocuments & {
  empleado: string;
  requisicion: string;
};

const mapTableRows = (
  documents: BillingDocuments[],
): BillingDocumentsTableRow[] =>
  documents.map((document) => ({
    ...document,
    empleado: document.requisition?.employeename ?? "",
    requisicion: document.requisition?.requisitionkey ?? "",
  }));

const searchableKeys: (keyof BillingDocumentsTableRow)[] = [
  "empleado",
  "requisicion",
  "rfc_emisor",
  "uuid",
  "fecha",
];

const ValidateInvoices = () => {
  const {
    handleOpenDetails,
    billingDocuments,
    billingDocumentnotToday,
    panelOpen,
    setPanelOpen,
    selected,
    handleMultiSelectt1,
    handleMultiSelectt2,
    handleActionClick,
    openValidInvoice,
    setOpenValidInvoice,
    handleMultiValidate,
    multiselectedt1,
    multiselectedt2,
  } = useValidateInvoices();

  const billingDocumentsRows = React.useMemo(
    () => mapTableRows(billingDocuments),
    [billingDocuments],
  );
  const billingDocumentnotTodayRows = React.useMemo(
    () => mapTableRows(billingDocumentnotToday),
    [billingDocumentnotToday],
  );

  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();
  useTutorialAutoRun({
    moduleId: "accounting-validateinvoices",
    tutorialId: "accounting-validateinvoices:table",
  });

  const columnasDesktop: ColumnDefinition<BillingDocumentsTableRow>[] = [
    {
      key: "xml",
      label: "XML",
      render: (row) => (
        <Button
          size="xsmall"
          onClick={() => window.open(row.xml, "_blank")}
          variant="ghost"
          icon={XMLIcon}
          data-tour="accounting-validateinvoices-xml"
        />
      ),
      cellClass: "w-12 shrink-0 text-center",
      headerClass: "w-12 shrink-0 text-center",
    },
    {
      key: "pdf",
      label: "PDF",
      render: (row) => (
        <Button
          size="xsmall"
          onClick={() => window.open(row.pdf, "_blank")}
          variant="ghost"
          icon={PDFIcon}
          data-tour="accounting-validateinvoices-pdf"
        />
      ),
      cellClass: "w-12 shrink-0 text-center",
      headerClass: "w-12 shrink-0 text-center",
    },
    {
      key: "empleado",
      label: "EMPLEADO",
      cellClass: "min-w-0 flex-[1.2_1.2_0%] truncate text-center",
      headerClass: "min-w-0 flex-[1.2_1.2_0%] truncate text-center",
      render: (row) => row.empleado || "-",
    },
    {
      key: "requisicion",
      label: "REQUISICION",
      cellClass: "min-w-0 flex-[1_1_0%] truncate text-center",
      headerClass: "min-w-0 flex-[1_1_0%] truncate text-center",
      render: (row) => row.requisicion || "-",
    },
    {
      key: "rfc_emisor",
      label: "RFC EMISOR",
      cellClass: "min-w-0 flex-[1_1_0%] truncate text-center",
      headerClass: "min-w-0 flex-[1_1_0%] truncate text-center",
    },
    {
      key: "uuid",
      label: "UUID",
      cellClass: "min-w-0 flex-[1.5_1.5_0%] truncate text-center",
      headerClass: "min-w-0 flex-[1.5_1.5_0%] truncate text-center",
    },
    {
      key: "fecha",
      label: "FECHA",
      cellClass: "min-w-0 flex-[0.9_0.9_0%] truncate text-right",
      headerClass: "min-w-0 flex-[0.9_0.9_0%] truncate text-right",
    },
    {
      key: "total",
      label: "IMPORTE",
      cellClass: "min-w-0 flex-[0.8_0.8_0%] truncate text-right",
      headerClass: "min-w-0 flex-[0.8_0.8_0%] truncate text-right",
    },
    {
      key: "acciones" as unknown as keyof BillingDocumentsTableRow,
      cellClass: "w-36 shrink-0 text-center",
      headerClass: "w-36 shrink-0 text-center",
      headerRender: () => <span className="text-lg">...</span>,
      render: (row) => (
        <>
          {currentPagePermissions?.canSeeDetails && (
            <Button
              size="small"
              onClick={() => handleOpenDetails(row)}
              variant="ghost"
              hideIcon
              className="whitespace-nowrap"
              data-tour="accounting-validateinvoices-details"
            >
              Ver Detalles
            </Button>
          )}
        </>
      ),
    },
  ];

  const columnasMobile: ColumnDefinition<BillingDocumentsTableRow>[] = [
    {
      key: "rfc_emisor",
      label: "RFC EMISOR",
      cellClass: "truncate",
    },
    {
      key: "acciones" as unknown as keyof BillingDocumentsTableRow,
      headerRender: () => <span className="text-lg">...</span>,
      render: (row) => (
        <Button
          size="small"
          onClick={() => handleOpenDetails(row)}
          variant="ghost"
          hideIcon
          className="whitespace-nowrap"
        >
          Ver Detalles
        </Button>
      ),
      cellClass: "w-32 shrink-0 text-right",
      headerClass: "w-32 shrink-0 text-right",
    },
  ];

  const columnas = isMobile ? columnasMobile : columnasDesktop;

  return (
    <>
      <div className="space-y-8 overflow-auto">
        <div data-tour="accounting-validateinvoices-table-new">
          <DataTable
            showButton={false}
            enableInternalSearch
            searchableKeys={searchableKeys}
            actionsRender={() => (
              <Button
                disabled={multiselectedt1?.length == 0}
                hideIcon
                onClick={handleActionClick}
                className="flex items-center gap-2 shrink-0 text-left w-full"
                data-tour="accounting-validateinvoices-validate"
              >
                Validar Facturas
              </Button>
            )}
            showDownloadTable
            onSelectedChange={handleMultiSelectt1}
            tables={[
              {
                data: billingDocumentsRows,
                columns: columnas,
                enableSelection: true,
                title: "Nuevas Facturas",
                enableCollaps: true,
                defaultSortKey: "fecha",
                defaultSortDirection: "desc",
              },
            ]}
          />
        </div>

        <div data-tour="accounting-validateinvoices-table-pending">
          <DataTable
            showButton={false}
            enableInternalSearch
            searchableKeys={searchableKeys}
            actionsRender={() => (
              <Button
                disabled={multiselectedt2?.length == 0}
                hideIcon
                onClick={handleActionClick}
                className="flex items-center gap-2 shrink-0 text-left w-full"
                data-tour="accounting-validateinvoices-validate"
              >
                Validar Facturas
              </Button>
            )}
            showDownloadTable
            onSelectedChange={handleMultiSelectt2}
            tables={[
              {
                data: billingDocumentnotTodayRows,
                columns: columnas,
                enableSelection: true,
                title: "Facturas Pendientes por Validar",
                enableCollaps: true,
                defaultSortKey: "fecha",
                defaultSortDirection: "desc",
              },
            ]}
          />
        </div>
      </div>
      <PopUp
        open={openValidInvoice}
        title={"Desea validar la factura seleccionada?"}
        content="Esta accion confirmara la validez de los documentos marcados. Una vez validadas, no podras revertir el cambio."
        onClose={() => setOpenValidInvoice(false)}
        primaryButtonText="Validar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleMultiValidate}
        onSecondaryButtonClick={() => setOpenValidInvoice(false)}
        showPrimaryButton
        showSecondaryButton
      />

      <DetailsPanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        selected={selected}
      />
    </>
  );
};

export default ValidateInvoices;

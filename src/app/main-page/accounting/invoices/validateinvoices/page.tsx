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

  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();
  useTutorialAutoRun({
    moduleId: "accounting-validateinvoices",
    tutorialId: "accounting-validateinvoices:table",
  });
  const columnasDesktop: ColumnDefinition<BillingDocuments>[] = [
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
      cellClass: "w-12 text-center",
      headerClass: "w-12 text-center",
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
      cellClass: "w-1/12 text-center",
      headerClass: "w-1/12 text-center",
    },
    // rfc_emisor es boolean según BillingDocuments
    {
      key: "rfc_emisor",
      label: "RFC EMISOR",
      cellClass: "w-2/12 truncate text-center",
      headerClass: "w-2/12 truncate text-center",
    },
    // conceptos es un arreglo; mostramos las claves SAT concatenadas
    {
      key: "conceptos",
      label: "CLAVE SAT",
      cellClass: "w-2/12 truncate text-center",
      headerClass: "w-2/12 truncate text-center",
      render: (row) =>
        row.conceptos?.length
          ? row.conceptos
            .map((c) => c.clave_sat)
            .filter(Boolean)
            .join(", ")
          : "—",
    },
    { key: "uuid", label: "UUID", cellClass: "w-3/12 truncate text-center", headerClass: "w-3/12 truncate text-center " },
    {
      key: "fecha",
      label: "FECHA",
      cellClass: "w-2/12 truncate text-right",
      headerClass: "w-2/12 truncate text-right",
    },
    {
      key: "total",
      label: "IMPORTE",
      cellClass: "w-1/12 truncate text-right",
      headerClass: "w-1/12 truncate text-right",
    },
    {
      // columna de acciones: tipamos la key para satisfacer keyof<BillingDocuments>
      key: "acciones" as unknown as keyof BillingDocuments,
      cellClass: "w-1/12 truncate text-right",
      headerClass: "w-1/12 truncate text-right",
      headerRender: () => <span className="text-lg">⋯</span>,
      render: (row) => (
        <>
          {currentPagePermissions?.canSeeDetails && <Button
            size="small"
            onClick={() => handleOpenDetails(row)}
            variant="ghost"
            hideIcon
            data-tour="accounting-validateinvoices-details"
          >
            Ver Detalles
          </Button>}
        </>

      ),
    },
  ];

  const columnasMobile: ColumnDefinition<BillingDocuments>[] = [

    // rfc_emisor es boolean según BillingDocuments
    {
      key: "rfc_emisor",
      label: "RFC EMISOR",
      cellClass: "truncate",
    },
    {
      // columna de acciones: tipamos la key para satisfacer keyof<BillingDocuments>
      key: "acciones" as unknown as keyof BillingDocuments,
      headerRender: () => <span className="text-lg">⋯</span>,
      render: (row) => (
        <Button
          size="small"
          onClick={() => handleOpenDetails(row)}
          variant="ghost"
          hideIcon
        >
          Ver Detalles
        </Button>
      ),
      cellClass: "w-28 text-right",
      headerClass: "w-28 text-right",
    },
  ];

  const columnas = isMobile ? columnasMobile : columnasDesktop;

  return (
    <>
      <div className="space-y-8 overflow-auto">
        <div data-tour="accounting-validateinvoices-table-new">
        <DataTable
          showButton={false}
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
              data: billingDocuments,
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
              data: billingDocumentnotToday,
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
        title={"¿Desea validar la factura seleccionada?"}
        content="Esta acción confirmará la validez de los documentos marcados. Una vez validadas, no podrás revertir el cambio."
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

"use client";
import React from "react";

import DetailsPanel from "./components/DetailsPanel/DetailsPanel";
import { useValidateInvoices } from "./hooks/useValidateInvoices";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
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
  const {currentPagePermissions} = useAuth();
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
        />
      ),
      cellClass: "w-12 text-center",
      headerClass: "w-12 text-center",
    },
    // rfc_emisor es boolean según BillingDocuments
    {
      key: "rfc_emisor",
      label: "RFC EMISOR",
    },
    // conceptos es un arreglo; mostramos las claves SAT concatenadas
    {
      key: "conceptos",
      label: "CLAVE SAT",
      render: (row) =>
        row.conceptos?.length
          ? row.conceptos
            .map((c) => c.clave_sat)
            .filter(Boolean)
            .join(", ")
          : "—",
    },
    { key: "uuid", label: "UUID" },
    {
      key: "fecha",
      label: "FECHA",
    },
    {
      key: "total",
      label: "IMPORTE",
      cellClass: "text-right",
      headerClass: "text-right",
    },
    {
      // columna de acciones: tipamos la key para satisfacer keyof<BillingDocuments>
      key: "acciones" as unknown as keyof BillingDocuments,
      headerRender: () => <span className="text-lg">⋯</span>,
      render: (row) => (
        <>
          {currentPagePermissions?.canSeeDetails && <Button
            size="small"
            onClick={() => handleOpenDetails(row)}
            variant="ghost"
            hideIcon
          >
            Ver Detalles
          </Button>}
        </>

      ),
      cellClass: "w-28 text-right",
      headerClass: "w-28 text-right",
    },
  ];

  const columnasMobile: ColumnDefinition<BillingDocuments>[] = [

    // rfc_emisor es boolean según BillingDocuments
    {
      key: "rfc_emisor",
      label: "RFC EMISOR",
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
        <DataTable
          showButton={false}
          actionsRender={() => (
            <Button
              disabled={multiselectedt1?.length == 0}
              hideIcon
              onClick={handleActionClick}
              className="flex items-center gap-2 shrink-0 text-left w-full"
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

        <DataTable
          showButton={false}
          actionsRender={() => (
            <Button
              disabled={multiselectedt2?.length == 0}
              hideIcon
              onClick={handleActionClick}
              className="flex items-center gap-2 shrink-0 text-left w-full"
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

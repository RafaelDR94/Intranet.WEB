"use client"
import React, { useMemo } from "react";

import useRequisitionDetailsDocument from "./hooks/useRequisitionDetailsDocument";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
// NEW: Overlay (ruta de ejemplo)
import LoadingOverlay from "@/app/components/LoadingOverLay/LoadingOverlay";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import DetailsPanel from "@/app/main-page/accounting/invoices/validateinvoices/components/DetailsPanel/DetailsPanel";
import type { BillingDocumentDetailsTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import DowloadIcon from "@/assets/icons/acciones/download.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
/**
 * Tabla de comprobantes asociados a una requisición. Permite descargar el
 * reporte y ver detalles individuales de cada documento.
 */
const RequisitionDetailsDocument: React.FC = () => {
  const { currentPagePermissions } = useAuth();

  const {
    rows,
    selected,
    panelOpen,
    downloadRequistionResume,
    handleOpenDetails,
    setPanelOpen,
    requisitionId,
    loading,
    downloadingDocument, // NEW: lo traemos del hook
  } = useRequisitionDetailsDocument();
  const isMobile = useIsMobile();
  const sapprofile = currentPagePermissions?.sapprofile;

  const mobileColumns: ColumnDefinition<BillingDocumentDetailsTable>[] =
    useMemo(
      () => [
        { key: "fecha", label: "" },
        { key: "description", label: "DESCRIPCIÓN" },
        {
          key: "status",
          label: "",
          render: (row) => (
            <Label
              type={row.status.toLocaleLowerCase() as any}
              text={row.status}
            />
          ),
        },
        {
          key: "acciones" as unknown as keyof BillingDocumentDetailsTable,
          label: "",
          render: (row) => (
            <Button
              size="small"
              onClick={() => handleOpenDetails(row)}
              variant="ghost"
              hideIcon
            >
              ...
            </Button>
          ),
          cellClass: "w-10 text-right",
          headerClass: "w-10 text-right",
        },
      ],
      [handleOpenDetails],
    );

  const columns: ColumnDefinition<BillingDocumentDetailsTable>[] = useMemo(
    () => [
      {
        key: "xmlUrl" as unknown as keyof BillingDocumentDetailsTable,
        label: "ARCHIVOS",
        cellClass: "basis-[110px] flex-none text-left", headerClass: "basis-[110px] flex-none text-left",
        render: (row) => (
          <div className="flex items-center gap-1">
            {row.xmlUrl && (
              <Button
                iconOnly
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                onClick={() => window.open(row.xmlUrl, "_blank")}
                aria-label="Abrir XML"
              />
            )}
            {row.pdfUrl && (
              <Button
                iconOnly
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                onClick={() => window.open(row.pdfUrl, "_blank")}
                aria-label="Abrir PDF"
              />
            )}
            {row.imageUrl && (
              <Button
                iconOnly
                size="xsmall"
                variant="ghost"
                icon={ImageIcon}
                onClick={() => window.open(row.imageUrl, "_blank")}
                aria-label="Abrir Imagen"
              />
            )}
          </div>
        ),
      },
      { key: "fecha", label: "FECHA CONSUMO", cellClass: "basis-[130px] flex-none text-center", headerClass: "basis-[130px] flex-none text-center" },
      { key: "description", label: "DESCRIPCIÓN", cellClass: "basis-[220px] flex-none text-left", headerClass: "basis-[220px] flex-none text-left", },
      { key: "numpersons", label: "No. PERS.", cellClass: "basis-[90px] flex-none text-center", headerClass: "basis-[90px] flex-none text-center" },
      { key: "numnights", label: "No. NOCHES", cellClass: "basis-[100px] flex-none text-center", headerClass: "basis-[100px] flex-none text-center" },
      {
        key: "uuid",
        label: "No. FACTURA/TICKET",
        cellClass: "basis-[220px] flex-none", headerClass: "basis-[220px] flex-none"
      },
      { key: "subtotal", label: "SUBTOTAL", cellClass: "basis-[110px] flex-none", headerClass: "basis-[110px] flex-none" },
      { key: "iva", label: "IVA", cellClass: "basis-[90px] flex-none", headerClass: "basis-[90px] flex-none" },
      { key: "otherinvoices", label: "OTROS IMP.", cellClass: "basis-[110px] flex-none", headerClass: "basis-[110px] flex-none" },
      { key: "total", label: "TOTAL", cellClass: "basis-[110px] flex-none", headerClass: "basis-[110px] flex-none" },
      {
        key: "status",
        label: "STATUS",
        cellClass: "basis-[120px] flex-none", headerClass: "basis-[120px] flex-none",
        render: (row) => (
          <Label
            type={row.status.toLocaleLowerCase() as any}
            text={row.status}
          />
        ),
      },
      {
        key: "acciones" as unknown as keyof BillingDocumentDetailsTable,
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
        cellClass: "basis-[150px] flex-none whitespace-nowrap text-right", headerClass: "basis-[150px] flex-none text-right",
      },
    ],
    [handleOpenDetails],
  );

  const filteredMobileColumns = useMemo(() => {
    if (sapprofile) {
      return mobileColumns.filter((col) => col.key !== "status");
    }
    return mobileColumns;
  }, [mobileColumns, sapprofile]);

  const filteredColumns = useMemo(() => {
    return columns.filter((col) => {
      if (sapprofile && col.key === "status") return false; // quitar "status" si sapprofile es true
      if (!sapprofile && col.key === "invoiceNumber") return false; // quitar factura/ticket si sapprofile es false
      return true;
    });
  }, [columns, sapprofile]);


  const isBusy = Boolean(loading || downloadingDocument);
  const busyMessage = downloadingDocument
    ? "Generando y descargando reporte…"
    : "Cargando comprobantes…";

  return (
    // NEW: relative para anclar el overlay al contenedor
    <div className="space-y-6">
      {/* NEW: Overlay solo en el contenedor */}
      <div className="relative">
        <LoadingOverlay open={isBusy} scope="container" message={busyMessage} />
      </div>

      <DataTable
        startCollpas={false}
        actionsRender={() => (
          <>
            {currentPagePermissions?.downloadDocuments && (
              <>
                <Button
                  hideIcon
                  variant="ghost"
                  onClick={() => {
                    if (requisitionId) downloadRequistionResume(requisitionId);
                  }}
                >
                  {sapprofile
                    ? "Descargar tabla completa"
                    : "Descargar reporte"}
                </Button>
                <Button
                  icon={DowloadIcon}
                  variant="outline"
                  onClick={() => {
                    if (requisitionId) downloadRequistionResume(requisitionId);
                  }}
                />
              </>
            )}
          </>
        )}
        showButton={false}
        showCalendar={false}
        rowsPerPage={8}
        tables={[
          {
            data: rows,
            columns: isMobile ? filteredMobileColumns : filteredColumns,
            enableSelection: false,
            title: sapprofile ? "Reporte de gastos" : "Comprobantes de Consumo",
            enableCollaps: false,
            defaultSortKey: "fecha",
            defaultSortDirection: "desc",
          },
        ]}
      />

      <DetailsPanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        selected={selected}
        operations
        reqisition={requisitionId}
      />
    </div>
  );
};

export default RequisitionDetailsDocument;

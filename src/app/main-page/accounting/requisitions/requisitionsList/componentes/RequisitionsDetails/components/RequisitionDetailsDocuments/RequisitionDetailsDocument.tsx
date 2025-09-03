"use client";
import React, { useMemo } from "react";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import { Button } from "@/app/components/Button/Button";
import useRequisitionDetailsDocument from "./hooks/useRequisitionDetailsDocument";
import type { BillingDocumentDetailsTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import Label from "@/app/components/Label/Label";
import DetailsPanel from "@/app/main-page/accounting/invoices/validateinvoices/components/DetailsPanel/DetailsPanel";
import DowloadIcon from "@/assets/icons/acciones/download.svg";
// NEW: Overlay (ruta de ejemplo)
import LoadingOverlay from "@/app/components/LoadingOverLay/LoadingOverlay";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

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

  const columns: ColumnDefinition<BillingDocumentDetailsTable>[] = useMemo(
    () => [
      {
        key: "xmlUrl" as unknown as keyof BillingDocumentDetailsTable,
        label: "ARCHIVOS",
        render: (row) => (
          <div className="flex items-center gap-1">
            {row.xmlUrl && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                onClick={() => window.open(row.xmlUrl, "_blank")}
                aria-label="Abrir XML"
              />
            )}
            {row.pdfUrl && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                onClick={() => window.open(row.pdfUrl, "_blank")}
                aria-label="Abrir PDF"
              />
            )}
          </div>
        ),
      },
      { key: "fecha", label: "FECHA CONSUMO" },
      { key: "description", label: "DESCRIPCIÓN" },
      { key: "numpersons", label: "No. PERS." },
      { key: "numnights", label: "No. NOCHES" },
      { key: "subtotal", label: "SUBTOTAL" },
      { key: "iva", label: "IVA" },
      { key: "otherinvoices", label: "OTROS IMP." },
      { key: "total", label: "TOTAL" },
      {
        key: "status",
        label: "STATUS",
        render: (row) => (
          <Label type={row.status.toLocaleLowerCase() as any} text={row.status} />
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
        cellClass: "w-28 text-right",
        headerClass: "w-28 text-right",
      },
    ],
    [rows]
  );

  const isBusy = Boolean(loading || downloadingDocument);
  const busyMessage = downloadingDocument
    ? "Generando y descargando reporte…"
    : "Cargando comprobantes…";

  return (
    // NEW: relative para anclar el overlay al contenedor
    <div className=" space-y-6">
      {/* NEW: Overlay solo en el contenedor */}
      <div className="relative">
        <LoadingOverlay open={isBusy} scope="container" message={busyMessage} />
      </div>


      <DataTable
        actionsRender={() => (

          <>
            {currentPagePermissions?.downloadDocuments && <>
              <Button
                hideIcon
                variant="ghost"
                onClick={() => {
                  if (requisitionId) downloadRequistionResume(requisitionId);
                }}
              >
                Descargar reporte
              </Button>
              <Button
                icon={DowloadIcon}
                variant="outline"
                onClick={() => {
                  if (requisitionId) downloadRequistionResume(requisitionId);
                }}
              />
            </>}


          </>
        )}
        showButton={false}
        showCalendar={false}
        enablePagination={false}
        tables={[
          {
            data: rows,
            columns,
            enableSelection: false,
            title: "Comprobantes de Consumo",
            enableCollaps: true,
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

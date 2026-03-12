"use client"
import React, { useMemo } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

import useRequisitionDetailsDocument from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/components/RequisitionDetailsDocuments/hooks/useRequisitionDetailsDocument";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
// NEW: Overlay (ruta de ejemplo)
import LoadingOverlay from "@/app/components/LoadingOverLay/LoadingOverlay";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import DetailsPanel from "@/app/main-page/accounting/sap/administration/components/DetailsPanel";
import type { BillingDocumentDetailsTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import DowloadIcon from "@/assets/icons/acciones/download.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";

/**
 * Tabla de comprobantes asociados a una requisición. Permite descargar el
 * reporte y ver detalles individuales de cada documento.
 */
type RequisitionDetailsTableProps = {
  requisitionIdOverride?: string;
};

const RequisitionDetailsTable: React.FC<RequisitionDetailsTableProps> = ({
  requisitionIdOverride,
}) => {
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
  } = useRequisitionDetailsDocument(requisitionIdOverride);
  const isMobile = useIsMobile();

  const sapprofile = currentPagePermissions?.sapprofile;

  
  const renderValidationStatus = (row: BillingDocumentDetailsTable) => {
    const isApproved = Boolean(row.authorization);
    return (
      <Label
        type={isApproved ? "valido" : "pendiente"}
        text={isApproved ? "Aprobado" : "Pendiente"}
      />
    );
  };



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
          key: "authorization" as unknown as keyof BillingDocumentDetailsTable,
          label: "Estatus validación",
          render: (row) => renderValidationStatus(row),
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
              data-tour="requisitions-detail-docs-actions"
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
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
        render: (row) => {
          return (
            <div className="flex items-center gap-1">
              {row.xmlUrl && (
                <Button
                  size="xsmall"
                  variant="ghost"
                  icon={XMLIcon}
                  onClick={() => window.open(row.xmlUrl, "_blank")}
                  aria-label="Abrir XML"
                  data-tour="requisitions-detail-docs-xml"
                />
              )}
              {row.pdfUrl && (
                <Button
                  size="xsmall"
                  variant="ghost"
                  icon={PDFIcon}
                  onClick={() => window.open(row.pdfUrl, "_blank")}
                  aria-label="Abrir PDF"
                  data-tour="requisitions-detail-docs-pdf"
                />
              )}
            {row.imageUrl && (
                <Button
                  size="xsmall"
                  variant="ghost"
                  icon={ImageIcon}
                  onClick={() => window.open(row.imageUrl, "_blank")}
                  aria-label="Abrir Imagen"
                  data-tour="requisitions-detail-docs-image"
                />
              )}
            </div>
          );
        },
      },
      {
        key: "fecha",
        label: "FECHA CONSUMO",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "description",
        label: "DESCRIPCIÓN",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "numpersons",
        label: "No. PERS.",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "numnights",
        label: "No. NOCHES",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "subtotal",
        label: "SUBTOTAL",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "iva",
        label: "IVA",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "otherinvoices",
        label: "OTROS IMP.",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "total",
        label: "TOTAL.",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      {
        key: "authorization" as unknown as keyof BillingDocumentDetailsTable,
        label: "Estatus validación",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
        render: (row) => renderValidationStatus(row),
      },
      {
        key: "acciones" as unknown as keyof BillingDocumentDetailsTable,
        headerRender: () => <span className="text-lg"></span>,
        render: (row) => (
          <Button
            size="small"
            onClick={() => handleOpenDetails(row)}
            variant="ghost"
            hideIcon
            data-tour="requisitions-detail-docs-view"
          >
            Ver Detalles
          </Button>
        ),
        cellClass: "w-2/15 text-center",
        headerClass: "w-2/15 text-right",
      },
    ],
    [handleOpenDetails],
  );

  const filteredMobileColumns = useMemo(() => {
    return mobileColumns;
  }, [mobileColumns, sapprofile]);

  const filteredColumns = useMemo(() => {
    return columns.filter((col) => {
      if (!sapprofile && col.key === "invoiceNumber") return false; // quitar factura/ticket si sapprofile es false
      return true;
    });
  }, [columns, sapprofile]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => Boolean(row.xmlUrl || row.pdfUrl  || row.imageUrl));
  }, [rows]);

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
          showCalendar={true}
          textSize={{ mobile: "c2", desktop: "text-b3" }}
          startCollpas={false}
          searchDataTour="requisitions-detail-docs-search"
          calendarDataTour="requisitions-detail-docs-calendar"
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
                    data-tour="requisitions-detail-docs-download"
                  >
                    {sapprofile
                      ? "Descargar tabla completa"
                      : "Descargar reporte"}
                  </Button>
                  <Button
                    icon={DowloadIcon}
                    variant="outline"
                    size="small"
                    onClick={() => {
                      if (requisitionId) downloadRequistionResume(requisitionId);
                    }}
                    data-tour="requisitions-detail-docs-download-icon"
                  />
                </>
              )}
            </>
          )}
        showButton={false}
        enablePagination={false}
        tables={[
          {
            data: filteredRows,
            columns: isMobile ? filteredMobileColumns : filteredColumns,
            enableSelection: false,
            title: "Reporte de gastos",
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
        closeButtonDataTour="requisitions-detail-panel-close"
      />
    </div>
  );
};

export default RequisitionDetailsTable;

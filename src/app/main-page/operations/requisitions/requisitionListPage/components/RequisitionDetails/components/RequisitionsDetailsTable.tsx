"use client";
import React, { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
const RequisitionDetailsTable: React.FC = () => {
  const { currentPagePermissions } = useAuth();

  const {
    rows,
    selected,
    panelOpen,
    downloadRequistionResume,
    handleOpenDetails,
    handleOpenImage,
    setPanelOpen,
    requisitionId,
    loading,
    downloadingDocument, // NEW: lo traemos del hook
  } = useRequisitionDetailsDocument();
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const sapprofile = currentPagePermissions?.sapprofile;

  console.log('rows ', rows);
  console.log('selected ', selected);
  

  const handleUploadBillableFiles = () => {
    if (!requisitionId) return;

    const query = new URLSearchParams(searchParams.toString());
    query.set("id", requisitionId);
    const label = searchParams.get("label");
    if (label) {
      query.set("label", label);
    }
    query.set("view", "billablefiles");

    router.push(`${pathname}?${query.toString()}`);
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
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
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
            {(row.imageUrl || row.billingimages_id || row.billingdocument_id?.startsWith("ticket-")) && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={ImageIcon}
                onClick={() => handleOpenImage(row)}
                aria-label="Abrir Imagen"
              />
            )}
          </div>
        ),
      },
      {
        key: "fecha",
        label: "FECHA CONSUMO",
        cellClass: "w-2/15 text-left",
        headerClass: "w-2/15 text-left",
      },
      // {
      //   key: "fecha",
      //   label: "PROVEDOR",
      //   cellClass: "w-2/15 text-left",
      //   headerClass: "w-2/15 text-left",
      // },
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
      // {
      //   key: "fecha",
      //   label: "No. FACTURA/TICKET",
      //   cellClass: "w-2/15 text-left",
      //   headerClass: "w-2/15 text-left",
      // },
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
        key: "acciones" as unknown as keyof BillingDocumentDetailsTable,
        headerRender: () => <span className="text-lg"></span>,
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
                  size="small"
                  onClick={() => {
                    if (requisitionId) downloadRequistionResume(requisitionId);
                  }}
                />
              </>
            )}
          </>
        )}
        showButton={false}
        enablePagination={false}
        rightContent={
          <Button
            variant="solid"
            size="medium"
            hideIcon
            onClick={handleUploadBillableFiles}
          >
            Subir Archivos
          </Button>
        }
        tables={[
          {
            data: rows,
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
      />
    </div>
  );
};

export default RequisitionDetailsTable;

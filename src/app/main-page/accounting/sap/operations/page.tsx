"use client"
import React from "react";

import DetailsPanel from "./components/DetailsPanel";
import useSapOperationsPage from "./hooks/useSapOperationsPage";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { BillingDocumentsSatTableListMap } from "@/app/mappings/billingdocuments/billingdocuments.mapper";
import { BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";

const SapOperationsPage = () => {
  const {
    handleOpenDetails,
    billingDocuments,
    nonDeductibleDocuments,
    panelOpen,
    setPanelOpen,
    selected,
    multiSelected,
    multiSelectedNonDeductible,
    handleSendToSap,
    handleMultiSelect,
    handleMultiSelectNonDeductible,
  } = useSapOperationsPage();

  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();

  const formatGroupIva = (
    concept?: BillingDocumentsSatTable["conceptos"][number],
  ) => {
    if (!concept) return "";
    if (concept.grupo_iva) return concept.grupo_iva;
    if (concept.porcentajeiva != null) return `${concept.porcentajeiva}%`;
    return "";
  };

  const deductibleColumnsDesktop: ColumnDefinition<BillingDocumentsSatTable>[] = [
    {
      key: "employeename",
      label: "COLABORADOR",
      render: (row) => row.employeename ?? row.requisition?.employeename ?? "",
    },
    { key: "uuid", label: "UUID" },
    {
      key: "category",
      label: "TIPO DE GASTOS",
      render: (row) => row.conceptos?.[0]?.tipo_gasto ?? "",
    },
    {
      key: "description",
      label: "DENOMINACION DE GASTOS",
      render: (row) => row.conceptos?.[0]?.clavesat_description ?? "",
    },
    {
      key: "conceptos",
      label: "GRUPO IVA",
      render: (row) => formatGroupIva(row.conceptos?.[0]),
    },
    {
      key: "acciones" as unknown as keyof BillingDocumentsSatTable,
      headerRender: () => <></>,
      render: (row) => (
        <div className="flex">
          {!currentPagePermissions?.canSeeDetails && (
            <Button
              size="medium"
              onClick={() => handleOpenDetails(row, true, true, true)}
              variant="ghost"
              hideIcon
            >
              Ver Detalles
            </Button>
          )}
        </div>
      ),
    },
  ];

  const deductibleColumnsMobile: ColumnDefinition<BillingDocumentsSatTable>[] = [
    {
      key: "sat_codigoEstatus",
      label: "C. ESTATUS",
      render: (row) => row.sat_codigoEstatus?.split(" -")[0] ?? "",
    },
    { key: "sat_esCancelable", label: "ES CANCELABLE" },
  ];

  const nonDeductibleColumnsDesktop: ColumnDefinition<BillingDocumentsSatTable>[] = [
    {
      key: "image",
      label: "IMAGEN",
      render: (row) =>
        row.image ? (
          <Button
            size="xsmall"
            variant="ghost"
            icon={ImageIcon}
            onClick={() => window.open(row.image, "_blank")}
          />
        ) : null,
      cellClass: "w-1/12 text-center",
      headerClass: "w-1/12 text-center",
    },
    {
      key: "employeename",
      label: "COLABORADOR",
      render: (row) => row.employeename ?? row.requisition?.employeename ?? "",
    },
    {
      key: "requisition",
      label: "REQUISICION",
      render: (row) => row.requisition?.requisitionkey ?? "",
    },
    {
      key: "description",
      label: "DESCRIPCION",
      render: (row) => row.description?.name ?? row.category?.name ?? "",
    },
    { key: "fecha", label: "FECHA" },
    { key: "total", label: "IMPORTE" },
    {
      key: "acciones" as unknown as keyof BillingDocumentsSatTable,
      headerRender: () => <></>,
      render: (row) => (
        <div className="flex">
          {!currentPagePermissions?.canSeeDetails && (
            <Button
              size="medium"
              onClick={() => handleOpenDetails(row, true, true, true)}
              variant="ghost"
              hideIcon
            >
              Ver Detalles
            </Button>
          )}
        </div>
      ),
    },
  ];

  const nonDeductibleColumnsMobile: ColumnDefinition<BillingDocumentsSatTable>[] = [
    {
      key: "description",
      label: "DESCRIPCION",
      render: (row) => row.description?.name ?? row.category?.name ?? "",
    },
    {
      key: "acciones" as unknown as keyof BillingDocumentsSatTable,
      headerRender: () => <></>,
      render: (row) => (
        <Button
          size="small"
          onClick={() => handleOpenDetails(row, true, true, true)}
          variant="ghost"
          hideIcon
        >
          Ver Detalles
        </Button>
      ),
    },
  ];

  const deductibleColumns = isMobile
    ? deductibleColumnsMobile
    : deductibleColumnsDesktop;
  const nonDeductibleColumns = isMobile
    ? nonDeductibleColumnsMobile
    : nonDeductibleColumnsDesktop;

  const selectedCount =
    multiSelected.length + multiSelectedNonDeductible.length;

  return (
    <>
      <div className="space-y-6">
        <DataTable
          tables={[
            {
              title: "Gastos Administracion",
              enableCollaps: true,
              enableSelection: true,
              data: BillingDocumentsSatTableListMap(billingDocuments),
              columns: deductibleColumns,
            },
          ]}
          textSize={{ mobile: "c2", desktop: "text-c2" }}
          enableInternalSearch
          actionsRender={() => (
            <div className={isMobile ? "ml-0 w-full" : "ml-7"}>
              {!currentPagePermissions?.canSendToSap && (
                <Button
                  disabled={selectedCount === 0}
                  onClick={handleSendToSap}
                  size="medium"
                  hideIcon
                  className="w-full"
                >
                  Subir a SAP
                </Button>
              )}
            </div>
          )}
          showDownloadTable
          onSelectedChange={(_index, rows) => {
            handleMultiSelect(rows);
          }}
        />

        <DataTable
          tables={[
            {
              title: "No Deducibles",
              enableCollaps: true,
              enableSelection: true,
              data: BillingDocumentsSatTableListMap(nonDeductibleDocuments),
              columns: nonDeductibleColumns,
            },
          ]}
          textSize={{ mobile: "c2", desktop: "text-c2" }}
          enableInternalSearch
          actionsRender={() => (
            <div className={isMobile ? "ml-0 w-full" : "ml-7"}>
              {!currentPagePermissions?.canSendToSap && (
                <Button
                  disabled={selectedCount === 0}
                  onClick={handleSendToSap}
                  size="medium"
                  hideIcon
                  className="w-full"
                >
                  Subir a SAP
                </Button>
              )}
            </div>
          )}
          showDownloadTable
          onSelectedChange={(_index, rows) => {
            handleMultiSelectNonDeductible(rows);
          }}
        />
      </div>

      <DetailsPanel
        panelOpen={panelOpen.state}
        onlyText={panelOpen.onlyText}
        setPanelOpen={(state: boolean) =>
          setPanelOpen((prev) => ({ ...prev, state }))
        }
        selected={selected}
        rejectType={false}
        rejectInvoice={panelOpen.rejectInvoice}
        validInvoice={false}
        sendInvoiceToSap={panelOpen.sendInvoiceToSap}
      />
    </>
  );
};

export default SapOperationsPage;

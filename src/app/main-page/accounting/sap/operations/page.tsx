"use client";
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
import CheckIcon from "@/assets/icons/acciones/check.svg";

const SapOperationsPage = () => {
  const {
    handleOpenDetails,
    billingDocuments, // 🔹 Nuevo: solo una lista
    panelOpen,
    setPanelOpen,
    selected,
    multiSelected,
    handleSendToSap,
    handleMultiSelect,
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

  /** Columnas base sin ícono forzado */
  const baseColumnsDesktop: ColumnDefinition<BillingDocumentsSatTable>[] = [
    {
      key: "employeename",
      label: "COLABORADOR",
      render: (row) => row.employeename ?? row.requisition?.employeename ?? "",
    },
    { key: "uuid", label: "UUID" },
    {
      key: "category",
      label: "TIPO DE GASTOS",
      render: (row) =>
        row.conceptos?.[0]?.tipo_gasto ?? "",
    },
    {
      key: "description",
      label: "DENOMINACIÓN DE GASTOS",
      render: (row) =>
        row.conceptos?.[0]?.clavesat_description ?? "",
    },
    {
      key: "conceptos",
      label: "GRUPO IVA",
      render: (row) => formatGroupIva(row.conceptos?.[0]),
    },
  ];

  const baseColumnsMobile: ColumnDefinition<BillingDocumentsSatTable>[] = [
    {
      key: "sat_codigoEstatus",
      label: "C. ESTATUS",
      render: (row) => row.sat_codigoEstatus?.split(" -")[0] ?? "",
    },
    { key: "sat_esCancelable", label: "ES CANCELABLE" },
  ];

  const baseColumns = isMobile ? baseColumnsMobile : baseColumnsDesktop;

  /** 🔹 Simplificado: usamos billingDocuments directamente */
  const allBillingDocuments = billingDocuments ?? [];

  /** Helpers para crear columnas con ícono fijo */
  const withFixedIcon = (
    // Icon: React.ElementType,
    // colorClass: string,
    selectable = false,
    rejectInvoice = true,
    sendInvoiceToSap = true,
    // canComment = true,
  ): ColumnDefinition<BillingDocumentsSatTable>[] => {
    const cols: ColumnDefinition<BillingDocumentsSatTable>[] = [];
    cols.push(...baseColumns);

    if (selectable) {
      cols.push({
        key: "acciones" as unknown as keyof BillingDocumentsSatTable,
        headerRender: () => <></>,
        render: (row) => (
          <div className="flex">
            {!currentPagePermissions?.canSeeDetails && (
              <Button
                size="medium"
                onClick={() =>
                  handleOpenDetails(row, true, rejectInvoice, sendInvoiceToSap)
                }
                variant="ghost"
                hideIcon
              >
                Ver Detalles
              </Button>
            )}
          </div>
        ),
      });
    }

    return cols;
  };

  return (
    <>
      <DataTable
        tables={[
          {
            title: "Gastos Administración",
            enableCollaps: true,
            enableSelection: true,
            data: BillingDocumentsSatTableListMap(allBillingDocuments),
            columns: withFixedIcon(
              CheckIcon,
              true,
              true,
            ),
          },
        ]}
        textSize={{ mobile: "c2", desktop: "text-c2" }}
        enableInternalSearch
        actionsRender={() => (
          <div className={isMobile ? "ml-0 w-full" : "ml-7"}>
            {!currentPagePermissions?.canSendToSap && (
              <Button
                disabled={multiSelected?.length == 0}
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
        onSelectedChange={(index, rows) => {
          handleMultiSelect(rows);
        }}
      />

      {/* Panel de Detalles */}
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

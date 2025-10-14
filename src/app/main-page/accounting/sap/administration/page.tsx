// SAT.tsx
"use client";
import React from "react";

import DetailsPanel from "./components/DetailsPanel";

import useSAP from "./hooks/useSAP";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { BillingDocumentsSatTableMap } from "@/app/mappings/billingdocuments/billingdocuments.mapper";
import { BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import CrossIcon from "@/assets/icons/acciones/cancel.svg";
import CheckIcon from "@/assets/icons/acciones/check.svg";
import WarningIcon from "@/assets/icons/acciones/minus.svg";

const SAP = () => {
  const {
    handleOpenDetails,
    billingDocumentsValid,
    billingDocumentsEfos,
    billingDocumentsBadCode,
    billingDocumentsNotValid,
    panelOpen,
    setPanelOpen,
    selected,
    multiSelected,
    handleSendToSap,
    handleMultiSelect,
  } = useSAP();
  const { currentPagePermissions } = useAuth();

  const isMobile = useIsMobile();
  /** Columnas base sin ícono forzado */
  const baseColumnsDesktop: ColumnDefinition<BillingDocumentsSatTable>[] = [
    {
      key: "sat_codigoEstatus",
      label: "C. ESTATUS",
      render: (row) => row.sat_codigoEstatus?.split(" -")[0] ?? "",
    },
    { key: "uuid", label: "UUID" },
    { key: "sat_estatusCancelacion", label: "TIPO DE GASTOS" },
    { key: "sat_estatusCancelacion", label: "DENOMINACIÓN DE GASTOS" },
    { key: "sat_estatusCancelacion", label: "GRUPO IVA" },
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

  const allBillingDocuments = [
    ...billingDocumentsValid,
    ...billingDocumentsEfos,
    ...billingDocumentsBadCode,
    ...billingDocumentsNotValid,
  ];

  /** Helpers para crear columnas con ícono fijo */
  const withFixedIcon = (
    Icon: React.ElementType,
    colorClass: string,
    selectable = false,
    rejectInvoice = true,
    sendInvoiceToSap = true,
    canComment = true,
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

            {currentPagePermissions?.canAddComment && canComment && (
              <Button
                size="medium"
                onClick={() =>
                  handleOpenDetails(row, false, rejectInvoice, sendInvoiceToSap)
                }
                variant="ghost"
                hideIcon
              >
                Comentar
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
            data: BillingDocumentsSatTableMap(allBillingDocuments),
            columns: withFixedIcon(
              CheckIcon,
              "text-alert-green-100",
              true,
              true,
              true,
              false,
            ),
          },
        ]}
        textSize={{ mobile: "c2", desktop: "text-b3" }}
        enableInternalSearch
        actionsRender={() => (
          <div className={isMobile ? "ml-0, w-full" : "ml-7"}>
            {!currentPagePermissions?.canSendToSap && (
              <Button
                disabled={multiSelected?.length == 0}
                onClick={handleSendToSap}
                size="large"
                hideIcon
                className="w-full"
              >
                Enviar a SAP
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
          setPanelOpen((prev) => ({ ...prev, state: state }))
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

export default SAP;

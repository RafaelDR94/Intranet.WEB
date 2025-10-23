// SAT.tsx
"use client";
import React from "react";

import DetailsPanel from "../validateinvoices/components/DetailsPanel/DetailsPanel";

import useSAT from "./hooks/useSAT";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { BillingDocumentsSatTableListMap } from "@/app/mappings/billingdocuments/billingdocuments.mapper";
import { BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import CrossIcon from "@/assets/icons/acciones/cancel.svg";
import CheckIcon from "@/assets/icons/acciones/check.svg";
import WarningIcon from "@/assets/icons/acciones/minus.svg";

const SAT = () => {
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
  } = useSAT();
  const { currentPagePermissions } = useAuth();

  const isMobile = useIsMobile();
  /** Columnas base sin ícono forzado */
  const baseColumnsDesktop: ColumnDefinition<BillingDocumentsSatTable>[] = [
    { key: "sat_codigoEstatus", label: "C. ESTATUS" },
    { key: "sat_esCancelable", label: "ES CANCELABLE" },
    { key: "status", label: "ESTADO" },
    { key: "sat_estatusCancelacion", label: "ESTATUS CANCELACIÓN" },
    { key: "sat_efos", label: "VALIDACIÓN EFOS" },
  ];

  const baseColumnsMobile: ColumnDefinition<BillingDocumentsSatTable>[] = [
    { key: "sat_codigoEstatus", label: "C. ESTATUS" },
    { key: "sat_esCancelable", label: "ES CANCELABLE" },
  ];

  const baseColumns = isMobile ? baseColumnsMobile : baseColumnsDesktop;

  /** Helpers para crear columnas con ícono fijo */
  const withFixedIcon = (
    Icon: React.ElementType,
    colorClass: string,
    selectable = false,
    rejectInvoice = true,
    sendInvoiceToSap = true,
    canComment = true
  ): ColumnDefinition<BillingDocumentsSatTable>[] => {
    const cols: ColumnDefinition<BillingDocumentsSatTable>[] = [];

    // Solo mostrar la columna de ícono si no es mobile
    if (!isMobile) {
      cols.push({
        key: "sat_status_icon" as unknown as keyof BillingDocumentsSatTable,
        label: "",
        render: () => <Icon className={`mx-auto ${colorClass}`} />,
      });
    }

    cols.push(...baseColumns);

    if (selectable) {
      cols.push({
        key: "acciones" as unknown as keyof BillingDocumentsSatTable,
        headerRender: () => <></>,
        render: (row) => (
          <div className="flex">
            {currentPagePermissions?.canSeeDetails &&
              <Button
                size="medium"
                onClick={() =>
                  handleOpenDetails(row, true, rejectInvoice, sendInvoiceToSap)
                }
                variant="ghost"
                hideIcon
              >
                Ver Detalles
              </Button>}

            {(currentPagePermissions?.canAddComment && canComment) && (
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
            title: "CFDIs Válidos",
            enableCollaps: true,
            enableSelection: true,
            data: BillingDocumentsSatTableListMap (billingDocumentsValid),
            columns: withFixedIcon(
              CheckIcon,
              "text-alert-green-100",
              true,
              true,
              true,
              false
            ),
          },
        ]}
        enableInternalSearch
        actionsRender={() => (
          <div className={isMobile ? 'ml-0, w-full' : 'ml-7'}>
            {currentPagePermissions?.canSendToSap && 
            <Button
              disabled={multiSelected?.length == 0}
              onClick={handleSendToSap}
              size="large"
              hideIcon
              className="w-full"
            >
              Enviar a SAP
            </Button>}

          </div>
        )}
        showDownloadTable
        onSelectedChange={(index, rows) => {
          handleMultiSelect(rows);
        }}
      />

      <div className="mt-5">
        <DataTable
          enableInternalSearch
          showDownloadTable
          showButton={false}
          tables={[
            {
              enableSelection: true,
              data: BillingDocumentsSatTableListMap (billingDocumentsBadCode),
              // data: BillingDocumentsSatTableListMap (billingDocumentsValid),
              columns: withFixedIcon(
                WarningIcon,
                "text-alert-yellow-100",
                true,
                true,
                true
              ),
              title: "CFDIs con Claves Prohibidas",
              enableCollaps: true,
            },
            {
              enableSelection: true,
              data: BillingDocumentsSatTableListMap (billingDocumentsNotValid),
              // data: BillingDocumentsSatTableListMap (billingDocumentsValid),
              columns: withFixedIcon(
                CrossIcon,
                "text-alert-red-100",
                true,
                true,
                false
              ),
              title: "CFDIs con Claves Inválidas",
              enableCollaps: true,
            },

            {
              title: "EFOS",
              enableCollaps: true,
              enableSelection: true,
              data: BillingDocumentsSatTableListMap (billingDocumentsEfos),
              // data: BillingDocumentsSatTableListMap (billingDocumentsValid),
              columns: withFixedIcon(
                CrossIcon,
                "text-alert-red-100",
                true,
                true,
                false
              ),
            },
          ]}
        />
      </div>

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

export default SAT;

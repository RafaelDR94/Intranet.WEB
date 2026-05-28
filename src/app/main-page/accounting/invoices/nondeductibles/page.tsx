"use client"

import React from "react";

import DetailsPanel from "../validateinvoices/components/DetailsPanel/DetailsPanel";
import { useValidateInvoices } from "../validateinvoices/hooks/useValidateInvoices";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";
import type { BillingDocuments } from "@/app/mappings/billingdocuments/billingdocuments.types";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";

const NonDeductiblesPage = () => {
  const {
    nonDeductibleDocuments,
    pendingNonDeductibleDocuments,
    panelOpen,
    setPanelOpen,
    selected,
    handleOpenDetails,
    handleMultiSelectNonDeductibleNew,
    handleMultiSelectNonDeductiblePending,
    handleSendNonDeductibleToSap,
    handleSendSelectedNonDeductibleToSap,
    multiselectedNonDeductibleNew,
    multiselectedNonDeductiblePending,
  } = useValidateInvoices();
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();

  useTutorialAutoRun({
    moduleId: "accounting-validateinvoices",
    tutorialId: "accounting-validateinvoices:table",
  });

  const selectedRowsCount =
    (multiselectedNonDeductibleNew?.length ?? 0) +
    (multiselectedNonDeductiblePending?.length ?? 0);

  const desktopColumns: ColumnDefinition<BillingDocuments>[] = [
    {
      key: "image",
      label: "IMAGEN",
      render: (row) =>
        row.image ? (
          <Button
            size="xsmall"
            onClick={() => window.open(row.image, "_blank")}
            variant="ghost"
            icon={ImageIcon}
          />
        ) : null,
      cellClass: "w-1/12 text-center",
      headerClass: "w-1/12 text-center",
    },
    {
      key: "employeename" as unknown as keyof BillingDocuments,
      label: "COLABORADOR",
      render: (row) => row.requisition?.employeename ?? "—",
      cellClass: "w-2/12 truncate text-left",
      headerClass: "w-2/12 truncate text-left",
    },
    {
      key: "requisitionkey" as unknown as keyof BillingDocuments,
      label: "REQUISICIÓN",
      render: (row) => row.requisition?.requisitionkey ?? "—",
      cellClass: "w-2/12 truncate text-left",
      headerClass: "w-2/12 truncate text-left",
    },
    {
      key: "description",
      label: "DESCRIPCIÓN",
      render: (row) => row.description?.name ?? row.category?.name ?? "—",
      cellClass: "w-2/12 truncate text-left",
      headerClass: "w-2/12 truncate text-left",
    },
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
      key: "acciones" as unknown as keyof BillingDocuments,
      cellClass: "w-1/12 truncate text-right",
      headerClass: "w-1/12 truncate text-right",
      render: (row) =>
        currentPagePermissions?.canSeeDetails ? (
          <Button
            size="small"
            onClick={() => handleOpenDetails(row)}
            variant="ghost"
            hideIcon
          >
            Ver Detalles
          </Button>
        ) : null,
    },
  ];

  const mobileColumns: ColumnDefinition<BillingDocuments>[] = [
    {
      key: "description",
      label: "DESCRIPCIÓN",
      render: (row) => row.description?.name ?? row.category?.name ?? "—",
      cellClass: "truncate",
    },
    {
      key: "acciones" as unknown as keyof BillingDocuments,
      headerRender: () => <span className="text-lg">â‹¯</span>,
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

  const columns = isMobile ? mobileColumns : desktopColumns;

  return (
    <>
      <div className="space-y-8 overflow-auto">
        <DataTable
          showButton={false}
          enableInternalSearch
          actionsRender={() => (
            <Button
              disabled={selectedRowsCount === 0}
              hideIcon
              onClick={handleSendNonDeductibleToSap}
              className="flex w-full shrink-0 items-center gap-2 text-left"
            >
              Enviar a SAP
            </Button>
          )}
          showDownloadTable
          onSelectedChange={handleMultiSelectNonDeductibleNew}
          tables={[
            {
              data: nonDeductibleDocuments,
              columns,
              enableSelection: true,
              title: "Gastos No Deducibles",
              enableCollaps: true,
              defaultSortKey: "fecha",
              defaultSortDirection: "desc",
            },
          ]}
        />

        <DataTable
          showButton={false}
          enableInternalSearch
          actionsRender={() => (
            <Button
              disabled={selectedRowsCount === 0}
              hideIcon
              onClick={handleSendNonDeductibleToSap}
              className="flex w-full shrink-0 items-center gap-2 text-left"
            >
              Enviar a SAP
            </Button>
          )}
          showDownloadTable
          onSelectedChange={handleMultiSelectNonDeductiblePending}
          tables={[
            {
              data: pendingNonDeductibleDocuments,
              columns,
              enableSelection: true,
              title: "No Deducibles Pendientes",
              enableCollaps: true,
              defaultSortKey: "fecha",
              defaultSortDirection: "desc",
            },
          ]}
        />
      </div>

      <DetailsPanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        selected={selected}
        validInvoice={false}
        rejectInvoice
        sendInvoiceToSap
        allowSendToSapAction
        documentLabel="Archivo"
        onSendToSap={handleSendSelectedNonDeductibleToSap}
      />
    </>
  );
};

export default NonDeductiblesPage;

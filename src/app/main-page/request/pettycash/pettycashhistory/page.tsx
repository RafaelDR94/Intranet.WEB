"use client";
import React from "react";

import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext";

import SideMenu from "./components/SideMenu";

import usePettyCashHistory from "./hooks/usePettyCashHistory";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { Label } from "@/app/components/Label/Label";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";

const PettyCashHistory = () => {
  const { panelOpen, setPanelOpen, selected, setSelected, rejected, history } =
    usePettyCashHistory();
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();

  const columnsDesktop: ColumnDefinition<HistoryRow>[] = [
    {
      key: "dateCreate",
      label: "FECHA",
    },
    {
      key: "dateCreate",
      label: "CONCEPTO",
    },
    {
      key: "dateCreate",
      label: "TIPO DE VALE",
    },
    {
      key: "dateCreate",
      label: "MONTO",
    },
    {
      key: "status",
      label: "ESTATUS",
      render: (row) => (
        <Label
          type={row?.status?.toLocaleLowerCase() as any}
          text={row.status.toUpperCase()}
        />
      ),
    },
    {
      key: "details" as unknown as keyof HistoryRow,
      label: "DETALLES",
      render: (row) => (
          <Button
            size="small"
            variant="ghost"
            hideIcon
            onClick={() => {
              setSelected(row);
              setPanelOpen(true);
            }}
          >
            Ver Detalle
          </Button>
      ),
    },
  ];

  const columnsMobile: ColumnDefinition<HistoryRow>[] = [
    {
      key: "requisitionkey",
      label: "C. SOLICITUD",
    },
    {
      key: "project",
      label: "PROYECTO",
      render: (row) => (
        <span>{row.project?.proyectKey ?? row.project?.id}</span>
      ),
    },
    {
      key: 'details' as unknown as keyof HistoryRow,
      label: '',
      render: (row) => (
        <Button
          size="small"
          variant="ghost"
          hideIcon
          onClick={() => {
            setSelected(row)
            setPanelOpen(true)
          }}
        >
          Ver Detalle
        </Button>
      ),
    },
  ];

  const columns = isMobile ? columnsMobile : columnsDesktop;

  return (
    <>
      <div className="space-y-8 overflow-auto">
        <DataTable
          showCalendar={true}
          showDownloadTable
          showButton={false}
          tables={[
            {
              data: history,
              columns,
              enableSelection: true,
              title: "Historial Vales",
              enableCollaps: true,
              defaultSortKey: "dateCreate",
              defaultSortDirection: "desc",
            },
          ]}
        />
      </div>

      <InvoicesProvider>
        <SideMenu
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          selected={selected}
        />
      </InvoicesProvider>
    </>
  );
};

export default PettyCashHistory;

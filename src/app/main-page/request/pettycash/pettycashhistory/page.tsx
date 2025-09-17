"use client";
import React from "react";

import { PettyCashProvider } from "../pettycashrequest/context/PettyCashContext";
import SideMenu from "./components/SideMenu";

import usePettyCashHistory from "./hooks/usePettyCashHistory";
import { PettyCashHistoryRow } from "./types";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition } from "@/app/components/DataTable/types";
import { Label } from "@/app/components/Label/Label";

const PettyCashHistory = () => {
  const {
    panelOpen,
    setPanelOpen,
    selected,
    setSelected,
    pettyCashAsHistoryRows,
    selectedDetail,
    detailLoading,
  } = usePettyCashHistory();

  const isMobile = useIsMobile();

  // Columnas de escritorio
  const columnsDesktop: ColumnDefinition<PettyCashHistoryRow>[] = [
    {
      key: "date",
      label: "FECHA",
      render: (row) => <span>{row.date}</span>,
    },
    {
      key: "description",
      label: "CONCEPTO",
      render: (row) => <span>{row.description.name}</span>,
    },
    {
      key: "voucherType",
      label: "TIPO DE VALE",
      render: (row) => (
        <Label type={row?.voucherLabelType} text={row?.voucherType} />
      ),
    },
    {
      key: "amount",
      label: "MONTO",
      render: (row) => (
        <span>
          {typeof row.amount === "number"
            ? row.amount.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : row.amount}
        </span>
      ),
    },
    {
      key: "status",
      label: "ESTATUS",
      render: (row) => (
        <Label
          type={(row?.status ?? "").toLowerCase() as any}
          text={(row?.status ?? "").toUpperCase()}
        />
      ),
    },
    {
      key: "id",
      label: "",
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

  // Columnas móviles
  const columnsMobile: ColumnDefinition<PettyCashHistoryRow>[] = [
    {
      key: "amount",
      label: "MONTO",
      render: (row) => (
        <span>
          {typeof row.amount === "number"
            ? row.amount.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })
            : row.amount}
        </span>
      ),
    },
    {
      key: "date",
      label: "FECHA",
      render: (row) => <span>{row.date}</span>,
    },
    {
      key: "voucherType",
      label: "TIPO DE VALE",
      render: (row) => (
        <Label type={row?.voucherLabelType} text={row?.voucherType} />
      ),
    },
    {
      key: "status",
      label: "ESTATUS",
      render: (row) => (
        <Label
          type={(row?.status ?? "").toLowerCase() as any}
          text={(row?.status ?? "").toUpperCase()}
        />
      ),
    },
  ];

  const columns = isMobile ? columnsMobile : columnsDesktop;

  return (
    <>
      <div className="space-y-8 overflow-auto">
        <DataTable
          showCalendar={true}
          showFilter={true}
          showDownloadTable
          showButton={false}
          tables={[
            {
              data: pettyCashAsHistoryRows, // <-- Usa vales (FULL) proyectados a HistoryRow
              columns,
              enableSelection: true,
              title: "Historial Vales",
              enableCollaps: true,
              defaultSortKey: "date",
              defaultSortDirection: "desc",
            },
          ]}
        />
      </div>

      <PettyCashProvider>
        <SideMenu
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          selected={selected}
          detail={selectedDetail}
          isDetailLoading={detailLoading}
        />
      </PettyCashProvider>
    </>
  );
};

export default PettyCashHistory;

"use client";
import React from "react";

import { PettyCashProvider } from "../pettycashrequest/context/PettyCashContext";
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
  const {
    panelOpen,
    setPanelOpen,
    selected,
    setSelected,
    pettyCashAsHistoryRows, // <-- NUEVO: datos proyectados desde vouchers full
  } = usePettyCashHistory();

  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth(); // si lo usas para permisos, se mantiene

  console.log('pettyCashAsHistoryRows ', pettyCashAsHistoryRows);
  

  // Columnas de escritorio
  const columnsDesktop: ColumnDefinition<HistoryRow>[] = [
    {
      key: "date" as keyof HistoryRow,
      label: "FECHA",
    },
    {
      key: "concept" as keyof HistoryRow,
      label: "CONCEPTO",
    },
    {
      key: "voucherType" as unknown as keyof HistoryRow,
      label: "TIPO DE VALE",
      render: (row) => <span>{(row as any).voucherType ?? ""}</span>,
    },
    {
      key: "amount" as keyof HistoryRow,
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
      key: "status" as keyof HistoryRow,
      label: "ESTATUS",
      render: (row) => (
        <Label
          type={(row?.status ?? "").toLowerCase() as any}
          text={(row?.status ?? "").toUpperCase()}
        />
      ),
    },
    {
      key: "details" as unknown as keyof HistoryRow,
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
  const columnsMobile: ColumnDefinition<HistoryRow>[] = [
    {
      key: "amount" as keyof HistoryRow,
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
      key: "date" as keyof HistoryRow,
      label: "FECHA",
    },
    {
      key: "voucherType" as unknown as keyof HistoryRow,
      label: "TIPO DE VALE",
      render: (row) => <span>{(row as any).voucherType ?? ""}</span>,
    },
    {
      key: "status" as keyof HistoryRow,
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
              defaultSortKey: "date", // <-- Ordena por la fecha del vale
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
        />
      </PettyCashProvider>
    </>
  );
};

export default PettyCashHistory;

"use client";
import React from "react";

import { PettyCashProvider } from "../pettycashrequest/context/PettyCashContext";
import SideMenu from "./components/SideMenu";

import usePettyCashHistory from "./hooks/usePettyCashHistory";
import { PettyCashHistoryRow } from "./types";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { ColumnDefinition, ActionMenuCellProps } from "@/app/components/DataTable/types";
import { Label } from "@/app/components/Label/Label";
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg"

const ActionMenuCell: React.FC<ActionMenuCellProps> = ({
  row,
  onEdit,
  onDelete,
}) => {
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();
  const menuItems: any[] = [];
  if (currentPagePermissions?.details)
    menuItems.push({
      label: "Ver Detalle",
      icon: EditIcon,
      onClick: () => {
        onEdit(row);
      },
    });
  if (currentPagePermissions?.delete)
    menuItems.push({
      label: "Cancelar",
      icon: DeleteIcon,
      danger: true,
      onClick: () => {
        onDelete(row);
      },
    });
  return (
    <ContextMenu
      alignRight
      autoFlip
      trigger={<Button size="xsmall" variant="ghost" icon={isMobile ? RightArrowIcon : DotsIcon} />}
      items={menuItems}
    />
  );
};
const PettyCashHistory = () => {
  const {
    panelOpen,
    setPanelOpen,
    selected,
    setSelected,
    pettyCashAsHistoryRows,
    selectedDetail,
    detailLoading,
    onEdit, 
    onDelete,
  } = usePettyCashHistory();

  const isMobile = useIsMobile();

  // Columnas de escritorio
  const columnsDesktop: ColumnDefinition<PettyCashHistoryRow>[] = React.useMemo( () => [
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
    {
      key: "actions" as unknown as keyof PettyCashHistoryRow,
      label: "",
      render: (row) => (
        <div className="flex justify-end pr-2">
          <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),

      invisible: false,
    },
  ],
  [onEdit, onDelete]);

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

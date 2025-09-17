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
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { PopUp } from "@/app/components/PopUp/PopUp";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg"

type PettyCashActionMenuProps = {
  row: PettyCashHistoryRow;
  onEdit: (row: PettyCashHistoryRow) => void;
  onDelete: (row: PettyCashHistoryRow) => void;
};

const ActionMenuCell: React.FC<PettyCashActionMenuProps> = ({
  row,
  onEdit,
  onDelete,
}) => {
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleEdit = React.useCallback(() => {
    onEdit(row);
    setMenuOpen(false);
  }, [onEdit, row]);

  const handleDelete = React.useCallback(() => {
    onDelete(row);
    setMenuOpen(false);
  }, [onDelete, row]);

  const menuItems: any[] = [];
  if (currentPagePermissions?.details)
    menuItems.push({
      label: "Ver Detalle",
      icon: EditIcon,
      onClick: handleEdit,
    });
  if (currentPagePermissions?.delete)
    menuItems.push({
      label: "Cancelar",
      icon: DeleteIcon,
      danger: true,
      onClick: handleDelete,
    });
  if (!menuItems.length) return null;
  return (
    <ContextMenu
      alignRight
      autoFlip
      trigger={<Button size="xsmall" variant="ghost" icon={isMobile ? RightArrowIcon : DotsIcon} />}
      items={menuItems}
      isOpen={menuOpen}
      setIsOpen={setMenuOpen}
    />
  );
};
const PettyCashHistory = () => {
  const {
    panelOpen,
    setPanelOpen,
    selected,
    pettyCashAsHistoryRows,
    selectedDetail,
    detailLoading,
    onEdit,
    onDelete,
    confirmOpen,
    setConfirmOpen,
    rowToDelete,
    handleConfirmDelete,
    removing,
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

  const deleteTargetLabel =
    rowToDelete?.description?.name?.trim() ||
    rowToDelete?.requisitionkey?.trim() ||
    rowToDelete?.voucherType?.trim() ||
    rowToDelete?.id;

  return (
    <>
      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="¿Deseas eliminar el vale seleccionado?"
        content={
          rowToDelete
            ? `Esta acción cancelará el vale ${deleteTargetLabel}.`
            : "Esta acción cancelará el vale seleccionado."
        }
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setConfirmOpen(false)}
        showPrimaryButton
        primaryButtonText={removing ? "Eliminando…" : "Eliminar"}
        onPrimaryButtonClick={handleConfirmDelete}
      />
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

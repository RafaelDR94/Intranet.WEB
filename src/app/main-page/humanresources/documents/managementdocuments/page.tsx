"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import type { ManagementDocumentTableRow } from "@/app/mappings/documents/documents.types";
import DocIcon from "@/assets/icons/Docs/page.svg";
import type { ContextMenuItem } from "@/app/components/ContextMenu/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useManagementDocuments } from "./hooks/useManagementDocuments";
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import CancelIcon from "@/assets/icons/acciones/cancel.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";
import RightArrowIcon from "@/assets/icons/navegacion/nav-arrow-right.svg";

type ActionMenuCellProps = {
  row: ManagementDocumentTableRow;
  onEdit?: (row: ManagementDocumentTableRow) => void;
  onDelete?: (row: ManagementDocumentTableRow) => void;
};

const ActionMenuCell: React.FC<ActionMenuCellProps> = ({ row, onEdit, onDelete }) => {
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleEdit = React.useCallback(() => {
    if (!onEdit) return;

    onEdit(row);
    setMenuOpen(false);
  }, [onEdit, row]);

  const handleDelete = React.useCallback(() => {
    if (!onDelete) return;

    onDelete(row);
    setMenuOpen(false);
  }, [onDelete, row]);
  const truthyPermissionStrings = new Set([
    "true",
    "1",
    "yes",
    "y",
    "si",
    "sí",
    "allow",
  ]);
  const falsyPermissionStrings = new Set(["false", "0", "no", "deny"]);
  const cancelPermissionKeys = [
    "delete",
    "cancel",
    "cancelvoucher",
    "cancelVoucher",
    "cancelvale",
    "cancelVale",
    "cancelpettycash",
    "cancelPettycash",
    "cancel_petty_cash",
    "cancelPettyCash",
    "deleteVoucher",
    "deleteVale",
    "deletevoucher",
    "deletevale",
    "remove",
  ];
  const interpretPermission = (value: unknown): boolean | undefined => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (!normalized) return undefined;
      if (truthyPermissionStrings.has(normalized)) return true;
      if (falsyPermissionStrings.has(normalized)) return false;
    }
    return undefined;
  };
  const menuItems = React.useMemo<ContextMenuItem[]>(() => {
    const items: ContextMenuItem[] = [];
    const rawPermissions = (currentPagePermissions ?? {}) as Record<
      string,
      unknown
    >;

    const detailPermission = interpretPermission(rawPermissions.details);
    if (detailPermission !== false && onEdit) {
      items.push({
        label: "Ver Detalle",
        icon: EditIcon,
        onClick: handleEdit,
      });
    }

    if (onDelete) {
      let cancelPermission = interpretPermission(rawPermissions.delete);
      if (cancelPermission === undefined) {
        for (const key of cancelPermissionKeys) {
          if (!(key in rawPermissions)) continue;
          cancelPermission = interpretPermission(rawPermissions[key]);
          if (cancelPermission !== undefined) break;
        }
      }

      if (cancelPermission ?? true) {
        items.push({
          label: "Cancelar",
          icon: CancelIcon,
          danger: true,
          onClick: handleDelete,
        });
      }
    }

    if (!items.length) {
      items.push({
        label: "Sin acciones disponibles",
        disabled: true,
      });
    }

    return items;
  }, [currentPagePermissions, handleDelete, handleEdit, onDelete]);
  return (
    <ContextMenu
      alignRight
      autoFlip
      trigger={
        <Button
          size="xsmall"
          variant="ghost"
          icon={isMobile ? RightArrowIcon : DotsIcon}
        />
      }
      items={menuItems}
      isOpen={menuOpen}
      setIsOpen={setMenuOpen}
    />
  );
};

const ManagementDocuments = () => {
  const router = useRouter();
  const { rows, loading, error, refresh } = useManagementDocuments();

  const handleViewDocument = React.useCallback(
    (row: ManagementDocumentTableRow) => {
      if (!row.route) return;

      const targetUrl = row.route;

      if (targetUrl.startsWith("http")) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
        return;
      }

      router.push(targetUrl);
    },
    [router],
  );

  const handleRefresh = React.useCallback(() => {
    refresh();
  }, [refresh]);

  const columns: ColumnDefinition<ManagementDocumentTableRow>[] = [
    {
      key: "name",
      label: "FORMATO",
      render: (row) => (
        <DocIcon className="text-primary-400 h-8 w-8" aria-hidden />
      ),
    },
    {
      key: "datecreated",
      label: "FECHA",
      render: (row) => row.datecreated || "",
    },
    { key: "code", label: "CLAVE" },
    {
      key: "description",
      label: "DESCRIPCIÓN",
    },
    { key: "documentType", label: "TIPO" },
    {
      key: "actions" as unknown as keyof ManagementDocumentTableRow,
      label: "",
      render: (row) => (
        <div className="flex justify-end pr-2">
          <ActionMenuCell row={row} onEdit={handleViewDocument} />
        </div>
      ),

      invisible: false,
    },
  ];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-h5 font-semibold text-neutral-500">
          Documentos Gerenciales
        </h1>
        <div className="flex items-center gap-3">
          <Button
            size="medium"
            variant="outline"
            hideIcon
            onClick={handleRefresh}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            size="medium"
            variant="solid"
            hideIcon
            onClick={() =>
              router.push(
                "/main-page/humanresources/documents/documentregistry",
              )
            }
          >
            Nuevo Documento
          </Button>
        </div>
      </div>
      <DataTable<ManagementDocumentTableRow>
        tables={[
          {
            title: "",
            enableCollaps: false,
            data: rows,
            columns,
            defaultSortKey: "name",
          },
        ]}
        textSize={{ mobile: "c2", desktop: "text-c2" }}
        enableInternalSearch
        searchableKeys={[
          "name",
          "code",
          "description",
          "documentType",
          "department",
        ]}
        showCalendar={false}
        showFilter={false}
        showButton={false}
        showDownloadTable
        dateKey={(row) => row.rawDate ?? row.date}
        actionsRender={() => null}
      />

      {loading && (
        <p className="text-sm text-neutral-300">Cargando documentos…</p>
      )}
      {error && !loading && (
        <p className="text-sm text-red-400">
          Ocurrió un error al cargar los documentos: {error}
        </p>
      )}
    </section>
  );
};

export default ManagementDocuments;

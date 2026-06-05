"use client";

import React, { useMemo } from "react";

import { Button } from "@/app/components/Button/Button";
import { ContextMenu } from "@/app/components/ContextMenu/ContextMenu";
import { DataTable } from "@/app/components/DataTable/DataTable";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import type { SAPKey } from "@/app/mappings/sapkeys/sapkeys.types";
import DeleteIcon from "@/assets/icons/acciones/trash.svg";
import EditIcon from "@/assets/icons/Editor/edit-pencil.svg";
import DotsIcon from "@/assets/icons/navegacion/more-horiz.svg";

import {
  SAPKEY_SEARCHABLE_KEYS,
  getGTSTypeLabel,
  getIvaLabel,
} from "../../constants";
import type { SAPKeyRow } from "../../types";

type SAPTableProps = {
  sapKeys: SAPKey[];
  onCreate: () => void;
  onEdit: (item: SAPKey) => void;
  onDelete: (item: SAPKey) => void | Promise<void>;
  onRefresh: () => void;
};

const SAPTable = ({
  sapKeys,
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
}: SAPTableProps) => {
  const isMobile = useIsMobile();

  const rows = useMemo<SAPKeyRow[]>(
    () =>
      sapKeys.map((sapKey) => ({
        id: sapKey.id,
        internalKey: sapKey.internalKey || "-",
        descriptionInternalKey: sapKey.descriptionInternalKey || "-",
        ivaLabel: getIvaLabel(sapKey),
        satKey: sapKey.satKey || "-",
        descriptionSatKey: sapKey.descriptionSatKey || "-",
        gtsType: sapKey.gtsType || "-",
        gtsTypeLabel: getGTSTypeLabel(sapKey.gtsType),
        sapKey,
      })),
    [sapKeys],
  );

  const columnsDesktop = useMemo<ColumnDefinition<SAPKeyRow>[]>(
    () => [
      {
        key: "internalKey",
        label: "TIPO DE GASTO",
        headerClass: "w-[15%]",
        cellClass: "w-[15%]",
      },
      {
        key: "descriptionInternalKey",
        label: "DENOMINACION DE GASTO",
        headerClass: "w-[24%]",
        cellClass: "w-[24%]",
      },
      {
        key: "ivaLabel",
        label: "GRUPO IVA",
        headerClass: "w-[16%]",
        cellClass: "w-[16%]",
      },
      {
        key: "satKey",
        label: "CLAVE SAT",
        headerClass: "w-[11%]",
        cellClass: "w-[11%]",
      },
      {
        key: "descriptionSatKey",
        label: "DESCRIPCION",
        headerClass: "w-[22%]",
        cellClass: "w-[22%]",
      },
      {
        key: "gtsTypeLabel",
        label: "TIPO",
        headerClass: "w-[8%]",
        cellClass: "w-[8%]",
        render: (row) => (
          <Label
            type={row.gtsType === "O" ? "purple" : "actualizado"}
            text={row.gtsTypeLabel}
          />
        ),
      },
      {
        key: "id",
        label: "",
        headerClass: "w-[4%]",
        cellClass: "w-[4%]",
        render: (row) => (
          <ContextMenu
            alignRight
            autoFlip
            items={[
              {
                label: "Editar",
                icon: EditIcon,
                onClick: () => onEdit(row.sapKey),
              },
              {
                label: "Eliminar",
                icon: DeleteIcon,
                danger: true,
                onClick: () => void onDelete(row.sapKey),
              },
            ]}
            trigger={
              <Button
                size="xsmall"
                variant="ghost"
                icon={DotsIcon}
                aria-label="Abrir menu de acciones"
              />
            }
          />
        ),
      },
    ],
    [onDelete, onEdit],
  );

  const columnsMobile = useMemo<ColumnDefinition<SAPKeyRow>[]>(
    () => [
      {
        key: "internalKey",
        label: "GASTO",
        headerClass: "w-[30%]",
        cellClass: "w-[30%]",
      },
      {
        key: "satKey",
        label: "SAT",
        headerClass: "w-[24%]",
        cellClass: "w-[24%]",
      },
      {
        key: "gtsTypeLabel",
        label: "TIPO",
        headerClass: "w-[26%]",
        cellClass: "w-[26%]",
        render: (row) => (
          <Label
            type={row.gtsType === "O" ? "purple" : "actualizado"}
            text={row.gtsTypeLabel}
          />
        ),
      },
      {
        key: "id",
        label: "",
        headerClass: "w-[20%]",
        cellClass: "w-[20%]",
        render: (row) => (
          <ContextMenu
            alignRight
            autoFlip
            items={[
              {
                label: "Editar",
                icon: EditIcon,
                onClick: () => onEdit(row.sapKey),
              },
              {
                label: "Eliminar",
                icon: DeleteIcon,
                danger: true,
                onClick: () => void onDelete(row.sapKey),
              },
            ]}
            trigger={
              <Button
                size="xsmall"
                variant="ghost"
                icon={DotsIcon}
                aria-label="Abrir menu de acciones"
              />
            }
          />
        ),
      },
    ],
    [onDelete, onEdit],
  );

  return (
    <DataTable<SAPKeyRow>
      tables={[
        {
          title: "Catálogo de claves SAP y SAT",
          columns: isMobile ? columnsMobile : columnsDesktop,
          data: rows,
          enableCollaps: false,
          enableSelection: false,
        },
      ]}
      rightContent={
        <Button hideIcon onClick={onCreate}>
          Nueva clave
        </Button>
      }
      textSize={{ mobile: "text-d3", desktop: "text-c2" }}
      enableInternalSearch
      searchableKeys={[...SAPKEY_SEARCHABLE_KEYS]}
      showCalendar={false}
      showRefresh
      onRefreshPage={onRefresh}
      dataTableTitle="Claves SAP y SAT"
      showButton={false}
      showDownloadTable={false}
    />
  );
};

export default SAPTable;

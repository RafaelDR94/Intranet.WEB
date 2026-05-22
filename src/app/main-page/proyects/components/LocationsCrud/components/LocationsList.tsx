"use client";

import { useMemo } from "react";

import { Copy, Link2 } from "lucide-react";

import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { PopUp } from "@/app/components/PopUp/PopUp";

import { useLocationsList } from "../hooks/useLocationsList";
import type { CrudRecord, CrudScope } from "../../types";
import { Button } from "@/app/components/Button/Button";

type LocationsListProps = {
  scope: CrudScope;
};

const LocationsList = ({ scope }: LocationsListProps) => {
  const state = useLocationsList(scope);
  const isMobile = useIsMobile();

  const handleCopy = async (value?: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  const actionColumn = useMemo<ColumnDefinition<CrudRecord>>(
    () => ({
      key: "actions",
      label: "ENLACE",
      cellClass: "w-[12%] min-w-0 px-2",
      headerClass: "w-[12%] min-w-0 px-2",
      render: (row) => {
        const mapUrl = (row.linkmaps ?? row.mapLink ?? "").trim();
        const hasMapLink = mapUrl.length > 0;

        return (
          <div className="text-blue-60 flex items-center justify-end gap-3">
            {hasMapLink ? (
              <>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-6 w-6 items-center justify-center"
                  aria-label={`Abrir enlace de ${row.primary}`}
                >
                  <Link2 className="h-5 w-5" strokeWidth={1.75} />
                </a>
                <button
                  type="button"
                  onClick={() => void handleCopy(mapUrl)}
                  className="inline-flex h-6 w-6 items-center justify-center"
                  aria-label={`Copiar enlace de ${row.primary}`}
                >
                  <Copy className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </>
            ) : null}
            <ActionMenuCell
              row={row}
              editLabel="Ver mas"
              onDetails={() => state.onDetail(row.id)}
              onDelete={() => state.onRequestDelete(row)}
              permissions={{ details: true, delete: true }}
            />
          </div>
        );
      },
    }),
    [state],
  );

  const columns = useMemo<ColumnDefinition<CrudRecord>[]>(
    () =>
      isMobile
        ? [
            {
              key: "primary",
              label: "NOMBRE",
              cellClass: "w-[50%] min-w-0 px-2",
              headerClass: "w-[50%] min-w-0 px-2",
            },
            {
              ...actionColumn,
              label: "",
              cellClass: "w-[50%] min-w-0",
              headerClass: "w-[50%] min-w-0",
            },
          ]
        : [
            {
              key: "secondary",
              label: "PROYECTO",
              cellClass: "w-[21%] min-w-0 px-2",
              headerClass: "w-[21%] min-w-0 px-2",
            },
            {
              key: "primary",
              label: "NOMBRE",
              cellClass: "w-[22%] min-w-0 px-2",
              headerClass: "w-[22%] min-w-0 px-2",
            },
            {
              key: "tertiary",
              label: "DIRECCION",
              cellClass: "w-[45%] min-w-0 px-2",
              headerClass: "w-[45%] min-w-0 px-2",
            },
            actionColumn,
          ],
    [actionColumn, isMobile],
  );

  return (
    <>
      <PopUp
        open={state.popupOpen}
        onClose={state.onCloseDelete}
        title={state.popupTitle}
        content={state.popupContent}
        showPrimaryButton
        showSecondaryButton
        primaryButtonText="Eliminar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={state.onConfirmDelete}
        onSecondaryButtonClick={state.onCloseDelete}
      />

      <div data-tour="locations-crud-list">
        <DataTable
          showCalendar={false}
          showFilter={false}
          showButton={false}
          enableInternalSearch
          searchableKeys={state.searchableKeys}
          textSize={{ mobile: "text-d3", desktop: "text-b3" }}
          searchDataTour="locations-crud-list-search"
          rightContent={
            <Button
              variant="solid"
              hideIcon
              size="medium"
              onClick={state.onCreate}
              data-tour="locations-crud-list-create"
              className={isMobile ? "w-full mt-3" : ""}
            >
              Nueva ubicación
            </Button>
          }
          tables={[
            {
              data: state.rows,
              columns,
              title: state.title,
              enableCollaps: false,
            },
          ]}
        />
      </div>
    </>
  );
};

export default LocationsList;

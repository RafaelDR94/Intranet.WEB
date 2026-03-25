"use client";

import { useMemo } from "react";

import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import Label from "@/app/components/Label/Label";
import { Button } from "@/app/components/Button/Button";
import RegistDetails from "./components/RegistDetails.tsx/RegistDetails";
import { useBreakpoint } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import logInIcon from "@/assets/icons/System/System/log-in.svg";
import moreIcons from "@/assets/icons/navegacion/more-vert.svg";
import moreMenu from "@/assets/icons/navegacion/more-horiz.svg";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

import type { VehicleRegistryRow } from "./types";
import type { TransportAssignament } from "@/app/mappings/transport/transport.types";

export type VehicleRegistryListViewProps = {
  inTransitRows: VehicleRegistryRow[];
  otherRows: VehicleRegistryRow[];
  handleRefresh: () => void;
  handleCreate?: () => void;
  handleArrive?: (assignment: TransportAssignament) => void;
  searchableKeys: (keyof VehicleRegistryRow)[];
  handleCloseDetails: () => void;
  openDetailsPanel: boolean;
  handleOpenDetails: (assignment: TransportAssignament) => void;
  canCreate?: boolean;
  canRegisterArrive?: boolean;
  enableTutorial?: boolean;
};

const VehicleRegistryListView = ({
  inTransitRows,
  otherRows,
  handleRefresh,
  handleCreate,
  handleArrive,
  searchableKeys,
  handleCloseDetails,
  openDetailsPanel,
  handleOpenDetails,
  canCreate = true,
  canRegisterArrive = true,
  enableTutorial = true,
}: VehicleRegistryListViewProps) => {
  const { isMobile, isTablet } = useBreakpoint();

  useTutorialAutoRun({
    moduleId: enableTutorial ? "generalservices-vehicleregistrylist" : "",
    tutorialId: enableTutorial ? "generalservices-vehicleregistrylist:table" : "",
  });

  const allTransitColumns = useMemo<ColumnDefinition<VehicleRegistryRow>[]>(() => {
    const columns: ColumnDefinition<VehicleRegistryRow>[] = [
      { key: "departureDate", label: "SALIDA" },
      { key: "departureTime", label: "HORA SALIDA" },
      { key: "vehicle", label: "VEHICULO" },
      { key: "plates", label: "PLACA" },
      { key: "driver", label: "CONDUCTOR" },
      {
        key: "status",
        label: "ESTATUS",
        render: (row) => <Label type={"invalido"} text={row.status} />,
      },
      { key: "departureSort", label: "ORDER", invisible: true },
    ];

    if (canRegisterArrive && handleArrive) {
      columns.push({
        key: "regist" as unknown as keyof VehicleRegistryRow,
        label: "REGISTRAR",
        render: (row) => (
          <Button
            size="small"
            variant="solid"
            hideIcon
            onClick={() => handleArrive(row.assignment)}
            data-tour="vehicleregistrylist-arrive"
          >
            Llegada
          </Button>
        ),
      });
    }

    columns.push({
      key: "more" as unknown as keyof VehicleRegistryRow,
      label: "",
      render: (row) => (
        <Button
          size="small"
          variant="ghost"
          hideIcon
          onClick={() => handleOpenDetails(row.assignment)}
        >
          Ver Más
        </Button>
      ),
    });

    return columns;
  }, [canRegisterArrive, handleArrive, handleOpenDetails]);

  const allColumns = useMemo<ColumnDefinition<VehicleRegistryRow>[]>(() => [
    { key: "departureDate", label: "SALIDA" },
    { key: "departureTime", label: "HORA SALIDA" },
    { key: "arrivalDate", label: "LLEGADA" },
    { key: "arrivalTime", label: "HORA LLEGADA" },
    { key: "vehicle", label: "VEHICULO" },
    { key: "plates", label: "PLACA" },
    { key: "driver", label: "CONDUCTOR" },
    {
      key: "status",
      label: "ESTATUS",
      render: (row) => <Label type={"valido"} text={row.status} />,
    },
    { key: "departureSort", label: "ORDER", invisible: true },
    {
      key: "more" as unknown as keyof VehicleRegistryRow,
      label: "",
      render: (row) => (
        <Button
          size="small"
          variant="ghost"
          hideIcon
          onClick={() => handleOpenDetails(row.assignment)}
        >
          Ver Más
        </Button>
      ),
    },
  ], [handleOpenDetails]);

  const transitcolumns = useMemo(() => {
    if (isMobile) {
      const keys = [
        "departureDate",
        "departureTime",
        "plates",
        "status",
        ...(canRegisterArrive ? ["regist"] : []),
        "more",
      ];
      return allTransitColumns
        .filter((c) => keys.includes(c.key as string))
        .map((c) => ({
          ...c,
          render:
            (c.key as string) === "regist" && canRegisterArrive && handleArrive
              ? (row: any) => (
                  <Button
                    size="small"
                    variant="ghost"
                    icon={logInIcon}
                    onClick={() => handleArrive(row.assignment)}
                    data-tour="vehicleregistrylist-arrive"
                  ></Button>
                )
              : (c.key as string) === "more"
                ? (row: any) => (
                    <Button
                      size="small"
                      variant="ghost"
                      icon={moreIcons}
                      onClick={() => handleOpenDetails(row.assignment)}
                      data-tour="vehicleregistrylist-details"
                    ></Button>
                  )
                : c.render,
        }));
    }

    if (isTablet) {
      const keys = [
        "departureDate",
        "departureTime",
        "plates",
        "driver",
        "status",
        ...(canRegisterArrive ? ["regist"] : []),
        "more",
      ];
      return allTransitColumns
        .filter((c) => keys.includes(c.key as string))
        .map((c) => ({
          ...c,
          render:
            (c.key as string) === "more"
              ? (row: any) => (
                  <Button
                    size="small"
                    variant="ghost"
                    icon={moreMenu}
                    className="ml-5"
                    onClick={() => handleOpenDetails(row.assignment)}
                  ></Button>
                )
              : c.render,
        }));
    }

    return allTransitColumns;
  }, [isMobile, isTablet, allTransitColumns, handleArrive, handleOpenDetails, canRegisterArrive]);

  const columns = useMemo(() => {
    if (isMobile) {
      return allColumns
        .filter((c) =>
          ["departureDate", "arrivalDate", "plates", "status", "more"].includes(
            c.key as string
          )
        )
        .map((c) => ({
          ...c,
          render:
            (c.key as string) === "more"
              ? (row: any) => (
                  <Button
                    size="small"
                    variant="ghost"
                    icon={moreIcons}
                    onClick={() => handleOpenDetails(row.assignment)}
                    data-tour="vehicleregistrylist-details"
                  ></Button>
                )
              : c.render,
        }));
    }

    if (isTablet) {
      return allColumns.filter((c) =>
        [
          "departureDate",
          "departureTime",
          "arrivalDate",
          "vehicle",
          "status",
          "more",
        ].includes(c.key as string)
      );
    }

    return allColumns;
  }, [isMobile, isTablet, allColumns, handleOpenDetails]);

  return (
    <div className="flex flex-col gap-10">
      <div data-tour="vehicleregistrylist-table-transit">
        <DataTable<VehicleRegistryRow>
          tables={[
            {
              title: "Registro Vehicular en Transito",
              columns: transitcolumns,
              data: inTransitRows,
              enableCollaps: true,
              enableSelection: false,
              defaultSortKey: "departureSort",
              defaultSortDirection: "desc",
            },
          ]}
          textSize={{ mobile: "text-d3", tablet: "text-d3", desktop: "text-c2" }}
          enableInternalSearch
          searchableKeys={searchableKeys}
          showCalendar
          dateKey="departureDate"
          showFilter={false}
          showButton={false}
          showRefresh
          onRefreshPage={handleRefresh}
          rowsPerPage={5}
          dataTableTitle="Registro Vehicular en Transito"
          searchDataTour="vehicleregistrylist-search"
          calendarDataTour="vehicleregistrylist-calendar"
          refreshDataTour="vehicleregistrylist-refresh"
        />
      </div>

      <div data-tour="vehicleregistrylist-table-history">
        <DataTable<VehicleRegistryRow>
          tables={[
            {
              title: "Registro Vehicular",
              columns,
              data: otherRows,
              enableCollaps: true,
              enableSelection: false,
              defaultSortKey: "departureSort",
              defaultSortDirection: "desc",
            },
          ]}
          enableInternalSearch
          textSize={{ mobile: "text-d3", tablet: "text-d3", desktop: "text-c2" }}
          searchableKeys={searchableKeys}
          showCalendar
          dateKey="departureDate"
          showFilter={false}
          showRefresh
          onRefreshPage={handleRefresh}
          actionLabel={canCreate ? "Nuevo Registro" : undefined}
          onTableActionClick={canCreate ? handleCreate : undefined}
          rowsPerPage={5}
          dataTableTitle="Registro Vehicular"
          searchDataTour="vehicleregistrylist-search"
          calendarDataTour="vehicleregistrylist-calendar"
          refreshDataTour="vehicleregistrylist-refresh"
          actionButtonDataTour={canCreate ? "vehicleregistrylist-create" : undefined}
          showButton={canCreate}
        />
      </div>

      <RegistDetails onClose={handleCloseDetails} open={openDetailsPanel} />
    </div>
  );
};

export default VehicleRegistryListView;

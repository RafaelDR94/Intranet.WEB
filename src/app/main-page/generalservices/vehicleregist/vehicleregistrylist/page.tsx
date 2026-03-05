"use client"

import { useMemo } from "react";

import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import useVehicleRegistryList from "./hooks/useVehicleRegistryList";
import type { VehicleRegistryRow } from "./types";
import Label from "@/app/components/Label/Label";
import { Button } from "@/app/components/Button/Button";
import RegistDetails from "./components/RegistDetails.tsx/RegistDetails";
import { useBreakpoint } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import logInIcon from "@/assets/icons/System/System/log-in.svg";
import moreIcons from "@/assets/icons/navegacion/more-vert.svg";
import moreMenu from "@/assets/icons/navegacion/more-horiz.svg";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const VehicleRegistryList = () => {
  const {
    inTransitRows,
    otherRows,
    handleRefresh,
    handleCreate,
    handleArrive,
    searchableKeys,
    handleCloseDetails,
    openDetailsPanel,
    handleOpenDetails,
  } = useVehicleRegistryList();

  const { isMobile, isTablet } = useBreakpoint();

  useTutorialAutoRun({
    moduleId: "generalservices-vehicleregistrylist",
    tutorialId: "generalservices-vehicleregistrylist:table",
  });

  /**
   * 🔹 Columnas base para tránsito
   */
  const allTransitColumns = useMemo<ColumnDefinition<VehicleRegistryRow>[]>(
    () => [
      {
        key: "departureDate",
        label: "SALIDA",
      },
      {
        key: "departureTime",
        label: "HORA SALIDA",
      },
      {
        key: "vehicle",
        label: "VEHICULO",
      },
      {
        key: "plates",
        label: "PLACA",
      },
      {
        key: "driver",
        label: "CONDUCTOR",
      },
      {
        key: "status",
        label: "ESTATUS",

        render: (row) => <Label type={"invalido"} text={row.status} />,
      },
      { key: "departureSort", label: "ORDER", invisible: true },
      {
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
      },
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
    ],
    [handleArrive, handleOpenDetails],
  );

  /**
   * 🔹 Columnas base para registros (otros)
   */
  const allColumns = useMemo<ColumnDefinition<VehicleRegistryRow>[]>(
    () => [
      {
        key: "departureDate",
        label: "SALIDA",
      },
      {
        key: "departureTime",
        label: "HORA SALIDA",
      },
      {
        key: "arrivalDate",
        label: "LLEGADA",
      },
      {
        key: "arrivalTime",
        label: "HORA LLEGADA",
      },
      {
        key: "vehicle",
        label: "VEHICULO",
      },
      {
        key: "plates",
        label: "PLACA",
      },
      {
        key: "driver",
        label: "CONDUCTOR",
      },
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
    ],
    [handleOpenDetails],
  );

  /**
   * 🔸 Filtrado dinámico de columnas según dispositivo
   */
  const transitcolumns = useMemo(() => {
    if (isMobile) {
      return allTransitColumns
        .filter((c) =>
          [
            "departureDate",
            "departureTime",
            "plates",
            "status",
            "regist",
            "more",
          ].includes(c.key as string),
        )
        .map((c) => ({
          ...c,

          render:
            c.key as string === "regist"
              ? (row: any) => (
                  <Button
                    size="small"
                    variant="ghost"
                    icon={logInIcon}
                    onClick={() => handleArrive(row.assignment)}
            data-tour="vehicleregistrylist-arrive"
                  ></Button>
                )
              : c.key as string === "more"
                ? (row : any) => (
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
      return allTransitColumns.filter((c) =>
        [
          "departureDate",
          "departureTime",
          "plates",
          "vehicle",
          "driver",
          "status",
          "more",
          "regist",
        ].includes(c.key as string),
      );
    }

    // Default desktop
    return allTransitColumns;
  }, [isMobile, isTablet, allTransitColumns, handleArrive, handleOpenDetails]);

  const columns = useMemo(() => {
    if (isMobile) {
      return allColumns
        .filter((c) =>
          [
            "departureDate",
            "departureTime",
            "plates",
            "status",
            "more",
          ].includes(c.key as string),
        )
        .map((c) => ({
          ...c,

          render:
            c.key as string === "more"
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

    if (isTablet) {
      return allColumns.filter((c) =>
        [
          "departureDate",
          "departureTime",
          "arrivalDate",
          "vehicle",
          "status",
          "more",
        ].includes(c.key as string),
      );
    }

    // Default desktop
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
        actionLabel="Nuevo Registro"
        onTableActionClick={handleCreate}
        rowsPerPage={5}
        dataTableTitle="Registro Vehicular"
        searchDataTour="vehicleregistrylist-search"
        calendarDataTour="vehicleregistrylist-calendar"
        refreshDataTour="vehicleregistrylist-refresh"
        actionButtonDataTour="vehicleregistrylist-create"
      />

      </div>

      <RegistDetails onClose={handleCloseDetails} open={openDetailsPanel} />
    </div>
  );
};

export default VehicleRegistryList;

"use client"

import React from "react";

import { DataTable } from "@/app/components/DataTable/DataTable";
import DetailsPanel from "@/app/main-page/request/ownrequisitions/componentes/RequisitionsDetails/components/DetailsPanel/DetailsPanel";
import useBillableFilesPage from "./hooks";

const BillableFilesPage: React.FC = () => {
  const {
    columns,
    historyRows,
    loading,
    panelOpen,
    recentRows,
    requisitionId,
    selected,
    setPanelOpen,
    statusFilter,
    statusFilterOptions,
    setStatusFilter,
    refresh,
    handleUploadFiles,
  } = useBillableFilesPage();

  return (
    <div className="space-y-8 overflow-auto">
      <div data-tour="ownrequisitions-billablefiles-recent-table">
        <DataTable
          dataTableTitle="Archivos Recientes"
          showCalendar
          textSize={{ mobile: "c2", desktop: "text-b3" }}
          showFilter
          filterTitle="Filtrar estatus"
          filterOptions={statusFilterOptions}
          filterValue={statusFilter}
          onFilterChange={(value) => setStatusFilter(value)}
          showRefresh
          showButton
          actionLabel="Subir Archivos"
          onTableActionClick={handleUploadFiles}
          onCalendarClick={() => undefined}
          onFilterClick={() => undefined}
          onRefreshPage={refresh}
          searchableKeys={["id", "date", "category", "project", "status"]}
          searchDataTour="ownrequisitions-billablefiles-search"
          calendarDataTour="ownrequisitions-billablefiles-calendar"
          filterDataTour="ownrequisitions-billablefiles-filter"
          refreshDataTour="ownrequisitions-billablefiles-refresh"
          actionButtonDataTour="ownrequisitions-billablefiles-upload"
          tables={[
            {
              data: recentRows,
              columns,
              enableSelection: false,
              title: "Archivos Recientes",
              enableCollaps: true,
              defaultSortKey: "date",
              defaultSortDirection: "desc",
            },
          ]}
          dateKey="date"
        />
      </div>

      <div data-tour="ownrequisitions-billablefiles-history-table">
        <DataTable
          dataTableTitle="Historial"
          showCalendar
          showFilter
          filterTitle="Filtrar estatus"
          filterOptions={statusFilterOptions}
          filterValue={statusFilter}
          onFilterChange={(value) => setStatusFilter(value)}
          showRefresh
          showButton={false}
          textSize={{ mobile: "c2", desktop: "text-b3" }}
          onCalendarClick={() => undefined}
          onFilterClick={() => undefined}
          onRefreshPage={refresh}
          searchableKeys={["id", "date", "category", "project", "status"]}
          tables={[
            {
              data: historyRows,
              columns,
              enableSelection: false,
              title: "Historial",
              enableCollaps: true,
              defaultSortKey: "date",
              defaultSortDirection: "desc",
            },
          ]}
          dateKey="date"
        />
      </div>
      {loading && null}
      <DetailsPanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        selected={selected}
        operations
        reqisition={requisitionId}
      />
    </div>
  );
};

export default BillableFilesPage;

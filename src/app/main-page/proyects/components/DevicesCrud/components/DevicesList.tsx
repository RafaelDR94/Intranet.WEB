"use client";

import { DataTable } from "@/app/components/DataTable/DataTable";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useDevicesList } from "../hooks/useDevicesList";
import type { CrudScope } from "../../types";
import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";


type DevicesListProps = {
  scope: CrudScope;
};

const DevicesList = ({ scope }: DevicesListProps) => {
  const state = useDevicesList(scope);
  const isMobile = useIsMobile();

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

      <div data-tour="devices-crud-list">
        <DataTable
          showCalendar={false}
          showFilter={state.showFilter}
          showButton={false}
          filterOptions={state.filterOptions}
          filterValue={state.filterValue}
          filterTitle={state.filterTitle}
          onFilterChange={state.onFilterChange}
          enableInternalSearch
          searchableKeys={state.searchableKeys}
          textSize={{ mobile: "text-d3", desktop: "text-b3" }}
          searchDataTour="devices-crud-list-search"
          filterDataTour="devices-crud-list-filter"
          rightContent={
            <Button
              variant="solid"
              hideIcon
              size="medium"
              onClick={state.onCreate}
              data-tour="devices-crud-list-create"
              className={isMobile ? "w-full mt-3" : ""}
            >
              Nuevo equipo
            </Button>
          }
          tables={[
            {
              data: state.rows,
              columns: state.columns,
              title: state.title,
            },
          ]}
        />
      </div>
    </>
  );
};

export default DevicesList;

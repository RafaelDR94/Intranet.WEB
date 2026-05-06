'use client';

import { DataTable } from '@/app/components/DataTable/DataTable';
import { PopUp } from '@/app/components/PopUp/PopUp';
import { useDevicesList } from '../hooks/useDevicesList';
import type { CrudScope } from '../../types';

type DevicesListProps = {
  scope: CrudScope;
};

const DevicesList = ({ scope }: DevicesListProps) => {
  const state = useDevicesList(scope);

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
          showButton
          actionLabel={state.actionLabel}
          onTableActionClick={state.onCreate}
          filterOptions={state.filterOptions}
          filterValue={state.filterValue}
          filterTitle={state.filterTitle}
          onFilterChange={state.onFilterChange}
          enableInternalSearch
          searchableKeys={state.searchableKeys}
          textSize={{ mobile: 'text-d3', desktop: 'text-b3' }}
          searchDataTour="devices-crud-list-search"
          filterDataTour="devices-crud-list-filter"
          actionButtonDataTour="devices-crud-list-create"
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

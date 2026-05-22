'use client';

import { DataTable } from '@/app/components/DataTable/DataTable';
import { PopUp } from '@/app/components/PopUp/PopUp';
import type { ColumnDefinition } from '@/app/components/DataTable/types';
import type { CrudRecord } from './types';

type CrudListTemplateProps = {
  title: string;
  actionLabel: string;
  columns: ColumnDefinition<CrudRecord>[];
  rows: CrudRecord[];
  onCreate: () => void;
  popupOpen: boolean;
  popupTitle: string;
  popupContent: string;
  onConfirmDelete: () => void;
  onCloseDelete: () => void;
  dataTourPrefix: string;
};

const CrudListTemplate = ({
  title,
  actionLabel,
  columns,
  rows,
  onCreate,
  popupOpen,
  popupTitle,
  popupContent,
  onConfirmDelete,
  onCloseDelete,
  dataTourPrefix,
}: CrudListTemplateProps) => {
  return (
    <>
      <PopUp
        open={popupOpen}
        onClose={onCloseDelete}
        title={popupTitle}
        content={popupContent}
        showPrimaryButton
        showSecondaryButton
        primaryButtonText="Eliminar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={onConfirmDelete}
        onSecondaryButtonClick={onCloseDelete}
      />

      <DataTable
        onTableActionClick={onCreate}
        actionLabel={actionLabel}
        showButton
        showCalendar={false}
        showFilter={false}
        textSize={{ mobile: 'text-d3', desktop: 'text-b3' }}
        tables={[
          {
            data: rows,
            columns,
            title,
            enableCollaps: false,
          },
        ]}
        searchDataTour={`${dataTourPrefix}-search`}
        actionButtonDataTour={`${dataTourPrefix}-create`}
      />
    </>
  );
};

export default CrudListTemplate;

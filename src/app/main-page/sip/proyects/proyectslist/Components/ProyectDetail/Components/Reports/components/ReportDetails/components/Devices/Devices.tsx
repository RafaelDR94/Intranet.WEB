"use client";
import React, { useMemo } from 'react';

import EmployeeName from '../EmployeeName/EmployeeName';

import useDevices from './hooks/useDevices';
import { Row } from './types';

import { DataTable } from '@/app/components/DataTable/DataTable';
import type { ColumnDefinition } from '@/app/components/DataTable/types';

const Devices: React.FC = () => {
  const { rows } = useDevices();

  const columns = useMemo<ColumnDefinition<Row>[]>(
    () => [
      { key: 'index', label: 'CONSECUTIVO', render: (r) => r.index, cellClass: 'w-40' },
      { key: 'device', label: 'DISPOSITIVO', render: (r) => r.device },
    ],
    []
  );

  return (
    <div className="w-full mx-auto max-w-6xl">
      <EmployeeName />
      <DataTable<Row>

        tables={[
          {
            title: 'Equipos',
            columns,
            data: rows,
            enableCollaps: false,
            enableSelection: false,
            defaultSortKey: 'index' as any,
            defaultSortDirection: 'asc',
          },
        ]}
        enableInternalSearch
        showCalendar={false}
        showFilter={false}
        showButton={false}
        rowsPerPage={10}
        dataTableTitle={'Dispositivos del proyecto'}
      />
    </div>
  );
};

export default Devices;

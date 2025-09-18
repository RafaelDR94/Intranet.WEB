"use client";
import React from 'react';

import EmployeeName from '../EmployeeName/EmployeeName';

import useRefactions from './hooks/useRefactions';
import { Row } from './types';

import { DataTable } from '@/app/components/DataTable/DataTable';
import type { ColumnDefinition } from '@/app/components/DataTable/types';

const Refactions: React.FC = () => {
  const { rows, compact, containerRef } = useRefactions();
  const columns = React.useMemo<ColumnDefinition<Row>[]>(() => {
    if (compact) {
      return [
        { key: 'index', label: 'CONSECUTIVO', render: (r) => r.index, },
        { key: 'description', label: 'DESCRIPCIÓN', render: (r) => r.description },
      ];
    }
    return [
      { key: 'description', label: 'DESCRIPCIÓN', render: (r) => r.description },
      { key: 'brand', label: 'MARCA', render: (r) => r.brand,  },
      { key: 'model', label: 'MODELO', render: (r) => r.model,  },
      { key: 'serialnumber', label: 'NÚMERO DE SERIE', render: (r) => r.serialnumber,  },
      { key: 'partnumber', label: 'NÚMERO DE PARTE', render: (r) => r.partnumber, },
    ];
  }, [compact]);

  return (
    <div ref={containerRef} className="w-full mx-auto max-w-6xl">
      <EmployeeName />
      <DataTable<Row>
        tables={[
          {
            title: 'Refacciones',
            columns,
            data: rows,
            enableCollaps: false,
            enableSelection: false,
            defaultSortKey: (compact ? 'index' : 'description') as any,
            defaultSortDirection: compact ? 'asc' : 'asc',
          },
        ]}
        enableInternalSearch
        showCalendar={false}
        showFilter={false}
        showButton={false}
        rowsPerPage={10}
        dataTableTitle={'Refacciones del reporte'}
      />
    </div>
  );
};

export default Refactions;

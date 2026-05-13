"use client";

import React from "react";

import EmployeeName from "../EmployeeName/EmployeeName";

import useRefactions from "./hooks/useRefactions";
import { Row } from "./types";

import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";

const Refactions: React.FC = () => {
  const { rows, compact, containerRef } = useRefactions();

  const columns = React.useMemo<ColumnDefinition<Row>[]>(() => {
    if (compact) {
      return [
        {
          key: "index",
          label: "CONSECUTIVO",
          render: (row) => row.index,
          headerClass: "w-24",
          cellClass: "w-24",
        },
        {
          key: "compactDescription",
          label: "DESCRIPCIÓN",
          render: (row) => row.compactDescription,
          headerClass: "w-full",
          cellClass: "w-full",
        },
      ];
    }

    return [
      { key: "description", label: "DESCRIPCIÓN", render: (row) => row.description },
      { key: "brand", label: "MARCA", render: (row) => row.brand },
      { key: "model", label: "MODELO", render: (row) => row.model },
      { key: "serialnumber", label: "NÚMERO DE SERIE", render: (row) => row.serialnumber },
      { key: "partnumber", label: "NÚMERO DE PARTE", render: (row) => row.partnumber },
    ];
  }, [compact]);

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-6xl">
      <EmployeeName />
      <DataTable<Row>
        tables={[
          {
            title: "Refacciones",
            columns,
            data: rows,
            enableCollaps: false,
            enableSelection: false,
            defaultSortKey: (compact ? "index" : "description") as keyof Row,
            defaultSortDirection: "asc",
          },
        ]}
        enableInternalSearch
        showCalendar={false}
        showFilter={false}
        showButton={false}
        rowsPerPage={10}
        dataTableTitle="Refacciones del reporte"
      />
    </div>
  );
};

export default Refactions;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";

type DirectoryRow = {
  id: string;
  fullname: string;
  position: string;
  phone_number: string;
  email: string;
  employee_number: string;
  image_url: string;
  employee: EmployeeType;
};

const emptyValue = "N/D";
const getShortName = (employee: EmployeeType) => {
  const first = employee.firstname?.trim() ?? "";
  const last = employee.lastname?.trim() ?? "";
  const firstParts = first.split(" ").filter(Boolean);

  if (firstParts.length >= 2 && last) {
    return `${firstParts.slice(0, 2).join(" ")} ${last[0].toUpperCase()}.`;
  }

  const full = `${first} ${last}`.trim();
  return full || employee.fullname || emptyValue;
};

const GeneralDirectoryPage = () => {
  const { activeEmployees, loadingActive, error, fetchActiveEmployees } =
    useEmployeesStore(
      (state) => ({
        activeEmployees: state.activeEmployees,
        loadingActive: state.loadingActive,
        error: state.error,
        fetchActiveEmployees: state.fetchActiveEmployees,
      }),
      shallow,
    );

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (activeEmployees.length === 0) {
      fetchActiveEmployees();
    }
  }, [activeEmployees.length, fetchActiveEmployees]);

  const rows = useMemo<DirectoryRow[]>(
    () =>
      activeEmployees.map((employee) => ({
        id: employee.id ?? employee.employee_id,
        fullname: getShortName(employee),
        position: employee.workposition?.name ?? emptyValue,
        phone_number: employee.phone_number || emptyValue,
        email: employee.email || emptyValue,
        employee_number: employee.employee_number || emptyValue,
        image_url: employee.image_url,
        employee,
      })),
    [activeEmployees],
  );

  const columns = useMemo<ColumnDefinition<DirectoryRow>[]>(
    () => [
      {
        key: "fullname",
        label: "NOMBRE",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Avatar src={row.image_url} size="xxs" />
            <span>{row.fullname}</span>
          </div>
        ),
        cellClass: "w-3/12",
        headerClass: "w-3/12",
      },
      {
        key: "position",
        label: "PUESTO",
        cellClass: "w-5/12",
        headerClass: "w-5/12",
      },
      {
        key: "phone_number",
        label: "TELEFONO",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "email",
        label: "CORREO",
        cellClass: "w-3/12",
        headerClass: "w-3/12",
      },
      {
        key: "employee_number",
        label: "No. Empleado",
        cellClass: "w-1/12",
        headerClass: "w-1/12",
      },
      {
        key: "id",
        label: "",
        cellClass: "w-1/12 text-right",
        headerClass: "w-1/12 text-right",
        render: (row) => (
          <Button
            hideIcon
            variant="ghost"
            size="small"
            onClick={() => {
              setSelectedEmployee(row.employee);
              setIsDetailsOpen(true);
            }}
          >
            Ver mas
          </Button>
        ),
      },
    ],
    [],
  );

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedEmployee(null);
  };

  const detailEmployee = selectedEmployee;
  const detailDepartment = detailEmployee?.department;

  return (
    <div className="relative flex min-h-[calc(100vh-180px)] flex-col gap-4">
      {loadingActive && rows.length === 0 && (
        <p className="text-b3 text-gray-100">Cargando directorio...</p>
      )}
      {error && !loadingActive && (
        <p className="text-b3 text-alert-red-100">{error}</p>
      )}

      <DataTable
        showCalendar={false}
        showButton={false}
        showFilter={false}
        showDownloadTable={false}
        tables={[
          {
            title: "Directorio General",
            hidetitle: true,
            data: rows,
            columns,
          },
        ]}
        enableInternalSearch
        searchableKeys={[
          "fullname",
          "position",
          "phone_number",
          "email",
          "employee_number",
        ]}
        textSize={{ mobile: "text-d3", desktop: "text-b4" }}
      />

      <DetailsPanelLayout
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        divider={false}
      >
        {!detailEmployee ? (
          <div className="text-b3 text-gray-100">
            Selecciona un colaborador.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-s1 font-semibold text-green-100">
                {detailEmployee.fullname}
              </h2>
              <div className="bg-green-80 text-b4 w-[157px] rounded-[8px] px-[8px] py-[6px] text-white">
                Información Laboral
              </div>
            </div>

            <dl className="text-b3 space-y-2 text-gray-100">
              <div className="flex">
                <dt className="text-gray-80">EMPRESA: </dt>
                <dd>{detailDepartment?.enterprice_name || emptyValue}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-80">NO. EMPLEADO:</dt>
                <dd>{detailEmployee.employee_number || emptyValue}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-80">RESPONSABLE:</dt>
                <dd>{detailEmployee.manager_id || emptyValue}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-80">AREA:</dt>
                <dd>{detailDepartment?.name || emptyValue}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-80">POSICION DE TRABAJO:</dt>
                <dd>{detailEmployee.workposition?.name || emptyValue}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-80">TELEFONO:</dt>
                <dd>{detailEmployee.phone_number || emptyValue}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-80">CORREO:</dt>
                <dd>{detailEmployee.email || emptyValue}</dd>
              </div>
            </dl>
          </div>
        )}
      </DetailsPanelLayout>
    </div>
  );
};

export default GeneralDirectoryPage;

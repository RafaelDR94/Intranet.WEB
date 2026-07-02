"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/navigation";

import Avatar from "@/app/components/Avatar/Avatar";
import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { Button } from "@/app/components/Button/Button";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import type { OrganizationChartRouteConfig } from "../types";
import {
  organizationChartEmptyValue,
  organizationChartNameCollator,
} from "../employee.utils";
import { buildOrganizationChartDepartmentsPath } from "../routes";
import OrganizationChartEmployeeDetailsPanel from "./OrganizationChartEmployeeDetailsPanel";

type DirectoryRow = {
  id: string;
  fullname: string;
  position: string;
  phone_number: string;
  email: string;
  department: string;
  image_url: string;
  employee: EmployeeType;
};

type OrganizationChartGeneralDirectoryViewProps = {
  routeConfig: OrganizationChartRouteConfig;
};

const OrganizationChartGeneralDirectoryView = ({
  routeConfig,
}: OrganizationChartGeneralDirectoryViewProps) => {
  const router = useRouter();
  const { currentPagePermissions } = useAuth();
  const canSeeDetails = Boolean(currentPagePermissions?.canSeeDetails);
  const canSeeInformation = Boolean(
    currentPagePermissions?.canSeeInformation ??
      currentPagePermissions?.canSeeDetails,
  );
  const canEditEmployee = routeConfig.capabilities.canUpdate;
  const canDeleteEmployee = routeConfig.capabilities.canDelete;

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
  const deleteEmployee = useEmployeesStore((state) => state.deleteEmployee);
  const deletingEmployee = useEmployeesStore((state) => state.deleting);

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeType | null>(
    null,
  );
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);

  useEffect(() => {
    if (activeEmployees.length === 0) {
      fetchActiveEmployees();
    }
  }, [activeEmployees.length, fetchActiveEmployees]);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedEmployee(null);
  }, []);

  const handleOpenEmployeeDetails = useCallback((employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  }, []);

  const handleEditEmployee = useCallback(
    (employee: EmployeeType) => {
      if (!canEditEmployee) return;

      const employeeId = employee.employee_id || employee.id;
      if (!employeeId) return;

      router.push(
        buildOrganizationChartDepartmentsPath(routeConfig.basePath, {
          view: "create",
          idEmployee: String(employeeId),
          sourceDepartmentId: employee.department?.department_id ?? undefined,
          sourceDepartmentLabel: employee.department?.name ?? undefined,
        }),
      );
    },
    [canEditEmployee, routeConfig.basePath, router],
  );

  const handleOpenDeletePopUp = useCallback(
    (employee: EmployeeType) => {
      if (!canDeleteEmployee) return;
      setEmployeeToDelete(employee);
      setIsDeletePopUpOpen(true);
    },
    [canDeleteEmployee],
  );

  const handleCloseDeletePopUp = useCallback(() => {
    setIsDeletePopUpOpen(false);
    setEmployeeToDelete(null);
  }, []);

  const handleDeleteEmployee = useCallback(async () => {
    if (!canDeleteEmployee || !employeeToDelete) return;
    const employeeId = employeeToDelete.employee_id || employeeToDelete.id;
    if (!employeeId) return;
    const resolvedId = String(employeeId);

    const deleted = await deleteEmployee(resolvedId);
    if (!deleted) return;
    await fetchActiveEmployees(true);

    if (
      String(selectedEmployee?.employee_id ?? selectedEmployee?.id ?? "") ===
      resolvedId
    ) {
      handleCloseDetails();
    }

    handleCloseDeletePopUp();
  }, [
    canDeleteEmployee,
    deleteEmployee,
    employeeToDelete,
    fetchActiveEmployees,
    handleCloseDeletePopUp,
    handleCloseDetails,
    selectedEmployee,
  ]);

  const rows = useMemo<DirectoryRow[]>(() => {
    const mappedRows = activeEmployees.map((employee) => ({
      id: employee.id ?? employee.employee_id,
      fullname: employee.fullname || organizationChartEmptyValue,
      position: employee.workposition?.name ?? organizationChartEmptyValue,
      phone_number: employee.phone_number || organizationChartEmptyValue,
      email: employee.email || organizationChartEmptyValue,
      department: employee.department?.name ?? organizationChartEmptyValue,
      image_url: employee.image_url,
      employee,
    }));

    return mappedRows.sort((left, right) =>
      organizationChartNameCollator.compare(left.fullname, right.fullname),
    );
  }, [activeEmployees]);

  const columns = useMemo<ColumnDefinition<DirectoryRow>[]>(
    () => [
      {
        key: "fullname",
        label: "NOMBRE",
        render: (row) => (
          <div className="flex min-w-0 items-center gap-2">
            <Avatar src={row.image_url} size="xxs" />
            <span className="block min-w-0 flex-1 truncate" title={row.fullname}>
              {row.fullname}
            </span>
          </div>
        ),
        cellClass: "w-3/12 min-w-0 pr-6",
        headerClass: "w-3/12 min-w-0 pr-6",
      },
      {
        key: "position",
        label: "PUESTO",
        cellClass: "w-3/12 min-w-0 truncate whitespace-nowrap pr-6",
        headerClass: "w-3/12 min-w-0 pr-6",
      },
      {
        key: "phone_number",
        label: "TELEFONO",
        cellClass: "w-2/12 min-w-0 truncate whitespace-nowrap pr-6",
        headerClass: "w-2/12 min-w-0 pr-6",
      },
      {
        key: "email",
        label: "CORREO",
        cellClass: "w-3/12 min-w-0 truncate whitespace-nowrap pr-6",
        headerClass: "w-3/12 min-w-0 pr-6",
      },
      {
        key: "department",
        label: "Departamento",
        cellClass: "w-2/12 min-w-0 truncate whitespace-nowrap pr-4",
        headerClass: "w-2/12 min-w-0 pr-4",
      },
      {
        key: "id",
        label: "",
        cellClass: "w-2/12 text-right",
        headerClass: "w-2/12 text-right",
        render: (row) => (
          <Button
            hideIcon
            variant="ghost"
            size="small"
            onClick={() => handleOpenEmployeeDetails(row.employee)}
          >
            {canSeeDetails ? "Ver carpeta" : "Ver Información"}
          </Button>
        ),
      },
      ...(canEditEmployee || canDeleteEmployee
        ? [
            {
              key: "actions" as keyof DirectoryRow,
              label: "",
              cellClass: "w-1/12 text-right",
              headerClass: "w-1/12 text-right",
              render: (row: DirectoryRow) => (
                <ActionMenuCell
                  row={row.employee}
                  onEdit={handleEditEmployee}
                  onDelete={handleOpenDeletePopUp}
                  permissions={{
                    details: canSeeDetails,
                    update: canEditEmployee,
                    delete: canDeleteEmployee,
                  }}
                />
              ),
            },
          ]
        : []),
    ],
    [
      canDeleteEmployee,
      canEditEmployee,
      canSeeDetails,
      handleEditEmployee,
      handleOpenDeletePopUp,
      handleOpenEmployeeDetails,
    ],
  );

  return (
    <div className="relative flex min-h-[calc(100vh-180px)] flex-col gap-4">
      {loadingActive && rows.length === 0 ? (
        <p className="text-b3 text-gray-100">Cargando directorio...</p>
      ) : null}
      {error && !loadingActive ? (
        <p className="text-b3 text-alert-red-100">{error}</p>
      ) : null}

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
          "department",
        ]}
        textSize={{ mobile: "text-d3", desktop: "text-b4" }}
      />

      <OrganizationChartEmployeeDetailsPanel
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        employee={selectedEmployee}
        canSeeInformation={canSeeInformation}
      />
      {employeeToDelete ? (
        <PopUp
          open={isDeletePopUpOpen}
          onClose={handleCloseDeletePopUp}
          title={`Deseas eliminar el usuario de ${employeeToDelete.fullname || organizationChartEmptyValue}?`}
          content="Esta acción confirmara la eliminación del usuario"
          showPrimaryButton
          showSecondaryButton
          primaryButtonText={deletingEmployee ? "Eliminando..." : "Eliminar"}
          secondaryButtonText="Cancelar"
          onPrimaryButtonClick={handleDeleteEmployee}
          onSecondaryButtonClick={handleCloseDeletePopUp}
        />
      ) : null}
    </div>
  );
};

export default OrganizationChartGeneralDirectoryView;

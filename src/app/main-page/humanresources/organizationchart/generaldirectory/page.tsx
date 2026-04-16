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
import EmployeeDetailsPanel from "../components/EmployeeDetailsPanel/EmployeeDetailsPanel";

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
  const router = useRouter();
  const { currentPagePermissions } = useAuth();
  const canSeeDetails = Boolean(currentPagePermissions?.canSeeDetails);
  const canSeeInformation = Boolean(
    currentPagePermissions?.canSeeInformation ?? currentPagePermissions?.canSeeDetails,
  );
  const canEditEmployee = Boolean(
    currentPagePermissions?.update ?? currentPagePermissions?.canSeeDetails,
  );
  const canDeleteEmployee = Boolean(currentPagePermissions?.delete);

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
      const employeeId = employee.employee_id || employee.id;
      if (!employeeId) return;
      const params = new URLSearchParams();
      params.set("view", "create");
      params.set("idEmployee", String(employeeId));
      const sourceDepartmentId = employee.department?.department_id ?? "";
      if (sourceDepartmentId) {
        params.set("sourceDepartmentId", sourceDepartmentId);
      }
      const sourceDepartmentLabel = employee.department?.name ?? "";
      if (sourceDepartmentLabel) {
        params.set("sourceDepartmentLabel", sourceDepartmentLabel);
      }
      router.push(
        `/main-page/humanresources/organizationchart/departments?${params.toString()}`,
      );
    },
    [router],
  );

  const handleOpenDeletePopUp = useCallback((employee: EmployeeType) => {
    setEmployeeToDelete(employee);
    setIsDeletePopUpOpen(true);
  }, []);

  const handleCloseDeletePopUp = useCallback(() => {
    setIsDeletePopUpOpen(false);
    setEmployeeToDelete(null);
  }, []);

  const handleDeleteEmployee = useCallback(
    async () => {
      if (!employeeToDelete) return;
      const employeeId = employeeToDelete.employee_id || employeeToDelete.id;
      if (!employeeId) return;
      const resolvedId = String(employeeId);

      const deleted = await deleteEmployee(resolvedId);
      if (!deleted) return;
      await fetchActiveEmployees(true);

      if (String(selectedEmployee?.employee_id ?? selectedEmployee?.id ?? "") === resolvedId) {
        handleCloseDetails();
      }

      handleCloseDeletePopUp();
    },
    [
      deleteEmployee,
      employeeToDelete,
      fetchActiveEmployees,
      handleCloseDeletePopUp,
      handleCloseDetails,
      selectedEmployee,
    ],
  );

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
            onClick={() => handleOpenEmployeeDetails(row.employee)}
          >
            {canSeeDetails ? "Ver carpeta" : "Ver informacion"}
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

      <EmployeeDetailsPanel
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        employee={selectedEmployee}
        canSeeInformation={canSeeInformation}
      />
      {employeeToDelete ? (
        <PopUp
          open={isDeletePopUpOpen}
          onClose={handleCloseDeletePopUp}
          title={`Deseas eliminar el usuario de ${employeeToDelete.fullname || getShortName(employeeToDelete)}?`}
          content="Esta accion confirmara la eliminacion del usuario"
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

export default GeneralDirectoryPage;

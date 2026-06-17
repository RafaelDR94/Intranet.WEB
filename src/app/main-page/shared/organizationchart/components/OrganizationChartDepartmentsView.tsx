"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";
import { Card } from "@/app/components/Card/Card";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { Input } from "@/app/components/Input/Input";
import Pagination from "@/app/components/Pagination/Pagination";
import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { DepartmentType } from "@/app/mappings/department/department.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useDepartmentsStore } from "@/app/stores/useDepartmentsStore/useDepartmentsStore";
import SearchIcon from "@/assets/icons/organization/search.svg";
import ListIcon from "@/assets/icons/Editor/list.svg";
import GridIcon from "@/assets/icons/Layout/view-grid.svg";
import type { OrganizationChartRouteConfig } from "../types";
import { departmentsStyles } from "../styles";
import {
  type OrganizationChartEmployee,
  getDepartmentEmployeeDisplay,
} from "../employee.utils";
import { useOrganizationChartDepartments } from "../hooks/useOrganizationChartDepartments";
import {
  buildOrganizationChartDepartmentsPath,
} from "../routes";
import OrganizationChartEmployeeDetailsPanel from "./OrganizationChartEmployeeDetailsPanel";

type EmployeeRow = {
  id: string;
  fullname: string;
  position: string;
  phone: string;
  email: string;
  employeeNumber: string;
  image_url?: string;
  employee: OrganizationChartEmployee;
  actions: null;
};

type OrganizationChartDepartmentsViewProps = {
  routeConfig: OrganizationChartRouteConfig;
};

const OrganizationChartDepartmentsView = ({
  routeConfig,
}: OrganizationChartDepartmentsViewProps) => {
  const router = useRouter();
  const { currentPagePermissions } = useAuth();
  const canSeeDetails = Boolean(currentPagePermissions?.canSeeDetails);
  const showInformation = Boolean(currentPagePermissions?.showInformation);
  const showEmployeeNumber = Boolean(currentPagePermissions?.showEmployeeNumber);
  const canSeeInformation = showInformation;
  const canEditEmployee = routeConfig.capabilities.canUpdate;
  const canDeleteEmployee = routeConfig.capabilities.canDelete;
  const canCreateEmployee = routeConfig.capabilities.canCreate;
  const showActionMenu = canEditEmployee || canDeleteEmployee;
  const showActionsColumn = true;

  const renderEmployeeImage = (employee: OrganizationChartEmployee) => {
    if (employee.image_url) {
      return (
        <Image
          src={employee.image_url}
          alt={getDepartmentEmployeeDisplay(employee).fullname}
          width={100}
          height={150}
          className="h-full w-full object-cover"
        />
      );
    }

    const fullname = getDepartmentEmployeeDisplay(employee).fullname;
    const initial = fullname.trim().charAt(0).toUpperCase() || "N";

    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-20 text-b2 font-semibold text-gray-70">
        {initial}
      </div>
    );
  };

  const {
    isDetailView,
    departmentId,
    departmentLabel,
    departments,
    filteredDepartments,
    loading,
    error,
    departmentEmployees,
    loadingByDepartment,
    employeesError,
    searchValue,
    setSearchValue,
    employeeSearchValue,
    setEmployeeSearchValue,
    viewMode,
    setViewMode,
    paginatedDepartments,
    currentPage,
    totalPages,
    showPagination,
    setCurrentPage,
    resolveImageSrc,
    handleViewDepartment,
    paginatedEmployees,
    employeesPage,
    employeesTotalPages,
    showEmployeesPagination,
    setEmployeesPage,
  } = useOrganizationChartDepartments(routeConfig.basePath);

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeType | null>(
    null,
  );
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<DepartmentType | null>(null);
  const [isDeleteDepartmentPopUpOpen, setIsDeleteDepartmentPopUpOpen] = useState(false);
  const deleteEmployee = useEmployeesStore((state) => state.deleteEmployee);
  const deletingEmployee = useEmployeesStore((state) => state.deleting);
  const deleteDepartment = useDepartmentsStore((state) => state.deleteDepartment);
  const deletingDepartment = useDepartmentsStore((state) => state.updating);
  const fetchEmployeesByDepartment = useEmployeesStore(
    (state) => state.fetchEmployeesByDepartment,
  );
  const fetchDepartments = useDepartmentsStore((state) => state.fetchDepartments);

  useEffect(() => {
    if (!isDetailView) {
      setIsDetailsOpen(false);
      setSelectedEmployee(null);
      return;
    }
    setIsDetailsOpen(false);
    setSelectedEmployee(null);
  }, [departmentId, isDetailView]);

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedEmployee(null);
  };

  const handleOpenCreateView = () => {
    if (!canCreateEmployee) return;
    router.push(
      buildOrganizationChartDepartmentsPath(routeConfig.basePath, {
        view: "create",
      }),
    );
  };

  const handleOpenEmployeeDetails = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleEditEmployee = (employee: EmployeeType) => {
    if (!canEditEmployee) return;

    const employeeId = employee.employee_id || employee.id;
    if (!employeeId) return;

    router.push(
      buildOrganizationChartDepartmentsPath(routeConfig.basePath, {
        view: "create",
        idEmployee: String(employeeId),
        sourceDepartmentId:
          departmentId ?? employee.department?.department_id ?? undefined,
        sourceDepartmentLabel: departmentLabel || undefined,
      }),
    );
  };

  const handleOpenDeletePopUp = (employee: EmployeeType) => {
    if (!canDeleteEmployee) return;
    setEmployeeToDelete(employee);
    setIsDeletePopUpOpen(true);
  };

  const handleCloseDeletePopUp = () => {
    setIsDeletePopUpOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteEmployee = async () => {
    if (!canDeleteEmployee || !employeeToDelete) return;
    const employeeId = employeeToDelete.employee_id || employeeToDelete.id;
    if (!employeeId) return;
    const resolvedId = String(employeeId);

    const deleted = await deleteEmployee(resolvedId);
    if (!deleted) return;
    if (departmentId) {
      await fetchEmployeesByDepartment(departmentId, true);
    }

    if (String(selectedEmployee?.employee_id ?? "") === resolvedId) {
      handleCloseDetails();
    }

    handleCloseDeletePopUp();
  };

  const detailEmployee = selectedEmployee;
  const isEmpty = !loading && !error && departments.length === 0;
  const isFilteredEmpty =
    !loading &&
    !error &&
    departments.length > 0 &&
    filteredDepartments.length === 0;

  const handleOpenDeleteDepartmentPopUp = (department: DepartmentType) => {
    if (!canDeleteEmployee) return;
    setDepartmentToDelete(department);
    setIsDeleteDepartmentPopUpOpen(true);
  };

  const handleCloseDeleteDepartmentPopUp = () => {
    setIsDeleteDepartmentPopUpOpen(false);
    setDepartmentToDelete(null);
  };

  const handleDeleteDepartment = async () => {
    if (!canDeleteEmployee || !departmentToDelete) return;
    const deleted = await deleteDepartment(String(departmentToDelete.department_id));
    if (!deleted) return;
    await fetchDepartments(true);
    handleCloseDeleteDepartmentPopUp();
  };

  if (isDetailView) {
    const isEmployeesEmpty =
      !loadingByDepartment &&
      !employeesError &&
      departmentEmployees.length === 0;
    const isEmployeesFilteredEmpty =
      !loadingByDepartment &&
      !employeesError &&
      departmentEmployees.length > 0 &&
      paginatedEmployees.length === 0;

    const employeeRows = (
      employees: OrganizationChartEmployee[],
    ): EmployeeRow[] =>
      employees.map((employee) => {
        const display = getDepartmentEmployeeDisplay(employee);
        return {
          id: employee.employee_id || employee.id,
          fullname: display.fullname,
          position: display.position,
          phone: display.phone,
          email: display.email,
          employeeNumber: display.employeeNumber,
          image_url: employee.image_url,
          employee,
          actions: null,
        };
      });

    const columns: ColumnDefinition<EmployeeRow>[] = [
      {
        key: "fullname",
        label: "NOMBRE",
        render: (row) => (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar src={row.image_url} size="sm" />
            <span className="block min-w-0 flex-1 truncate" title={row.fullname}>
              {row.fullname}
            </span>
          </div>
        ),
        cellClass: "min-w-0 flex-[3]",
        headerClass: "min-w-0 flex-[3]",
      },
      {
        key: "position",
        label: "PUESTO",
        cellClass: "min-w-0 flex-[2] truncate whitespace-nowrap pr-6",
        headerClass: "min-w-0 flex-[2] pr-6",
      },
      {
        key: "phone",
        label: "TELEFONO",
        cellClass: "min-w-0 flex-[1.5] truncate whitespace-nowrap pr-6",
        headerClass: "min-w-0 flex-[1.5] pr-6",
      },
      {
        key: "email",
        label: "CORREO",
        cellClass: "min-w-0 flex-[2] truncate whitespace-nowrap pr-6",
        headerClass: "min-w-0 flex-[2] pr-6",
      },
      {
        key: "employeeNumber",
        label: "No. EMPLEADO",
        cellClass: "min-w-0 flex-[1] truncate whitespace-nowrap pr-4",
        headerClass: "min-w-0 flex-[1] pr-4",
      },
      ...(showActionsColumn
        ? [
            {
              key: "actions" as keyof EmployeeRow,
              label: "",
              cellClass: "min-w-0 flex-[1] text-right",
              headerClass: "min-w-0 flex-[1] text-right",
              render: (row: EmployeeRow) => (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    hideIcon
                    onClick={() => handleOpenEmployeeDetails(row.employee)}
                  >
                    {canSeeDetails ? "Ver carpeta" : "Ver información"}
                  </Button>
                  {showActionMenu ? (
                    <ActionMenuCell
                      row={row.employee}
                      onEdit={handleEditEmployee}
                      onDelete={handleOpenDeletePopUp}
                      permissions={{
                        update: canEditEmployee,
                        delete: canDeleteEmployee,
                      }}
                    />
                  ) : null}
                </div>
              ),
            },
          ]
        : []),
    ];

    const listTables = paginatedEmployees.length
      ? [
          {
            title: "Miembros del Equipo",
            data: employeeRows(paginatedEmployees as OrganizationChartEmployee[]),
            columns,
          },
        ]
      : [];
    const useGridInformationStyles = viewMode === "grid" && showInformation;

    return (
      <div className={departmentsStyles.container}>
        <div>
          <h2 className="text-h4 text-blue-60 mt-[35px] font-semibold">
            {departmentLabel}
          </h2>
          {currentPagePermissions?.showTitle ? (
            <p className="text-s2 text-gray-70 mt-2 font-semibold">
              Departamentos encargado de crear, mejorar y mantener aplicaciones,
              sistemas y herramientas tecnológicas
            </p>
          ) : null}
        </div>

        {viewMode === "grid" || viewMode === "list" ? (
          <div className={departmentsStyles.searchRow}>
            <div className={departmentsStyles.searchWrapper}>
              <div className={departmentsStyles.searchInputWrapper}>
                <Input
                  placeholder="Buscar"
                  value={employeeSearchValue}
                  onChange={(event) =>
                    setEmployeeSearchValue(event.target.value)
                  }
                  icon={SearchIcon}
                  className={departmentsStyles.searchInput}
                />
              </div>
            </div>

            <div className={departmentsStyles.viewToggle}>
              <Button
                variant="ghost"
                onClick={() => setViewMode("list")}
                aria-label="Vista de lista"
                iconOnly
                icon={ListIcon}
              />
              <Button
                variant="ghost"
                onClick={() => setViewMode("grid")}
                aria-label="Vista de mosaico"
                iconOnly
                icon={GridIcon}
              />
            </div>
          </div>
        ) : null}

        {loadingByDepartment ? (
          <div className={departmentsStyles.emptyState}>
            Cargando colaboradores...
          </div>
        ) : null}

        {!loadingByDepartment && employeesError ? (
          <div className={departmentsStyles.errorState}>{employeesError}</div>
        ) : null}

        {isEmployeesEmpty ? (
          <div className={departmentsStyles.emptyState}>
            No hay colaboradores registrados.
          </div>
        ) : null}

        {isEmployeesFilteredEmpty ? (
          <div className={departmentsStyles.emptyState}>
            No hay resultados para la busqueda.
          </div>
        ) : null}

        {viewMode === "list" && listTables.length > 0 ? (
          <DataTable
            showCalendar={false}
            showButton={false}
            showFilter={false}
            showSearch={false}
            showDownloadTable={false}
            enableInternalSearch={false}
            enablePagination={false}
            textSize={{ mobile: "c2", desktop: "text-b4" }}
            onSearchChange={(value) => setEmployeeSearchValue(value)}
            tables={listTables}
          />
        ) : null}

        {viewMode === "grid" && paginatedEmployees.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className={departmentsStyles.sectionHeader}>
              <span>Miembros del Equipo</span>
              <span className={departmentsStyles.sectionDivider} />
            </div>

            <div className={departmentsStyles.mosaicGrid}>
              {paginatedEmployees.map((employee) => (
                <div
                  key={employee.employee_id || employee.id}
                  className={
                    useGridInformationStyles
                      ? departmentsStyles.mosaicCardInformation
                      : departmentsStyles.mosaicCard
                  }
                >
                  <div
                    className={
                      useGridInformationStyles
                        ? departmentsStyles.mosaicAvatarInformation
                        : departmentsStyles.mosaicAvatar
                    }
                  >
                    {renderEmployeeImage(employee as OrganizationChartEmployee)}
                  </div>
                  <div
                    className={
                      useGridInformationStyles
                        ? departmentsStyles.mosaicInfoInformation
                        : departmentsStyles.mosaicInfo
                    }
                  >
                    <span className={departmentsStyles.mosaicCompany}>
                      {employee.department?.enterprice_name || "EMPRESA"}
                    </span>
                    <span className={departmentsStyles.mosaicName}>
                      {
                        getDepartmentEmployeeDisplay(
                          employee as OrganizationChartEmployee,
                        ).fullname
                      }
                    </span>
                    <span className={departmentsStyles.mosaicRole}>
                      {
                        getDepartmentEmployeeDisplay(
                          employee as OrganizationChartEmployee,
                        ).position
                      }
                    </span>
                    <span className={departmentsStyles.mosaicMeta}>
                      {
                        getDepartmentEmployeeDisplay(
                          employee as OrganizationChartEmployee,
                        ).phone
                      }
                    </span>
                    <span className={departmentsStyles.mosaicMeta}>
                      {
                        getDepartmentEmployeeDisplay(
                          employee as OrganizationChartEmployee,
                        ).email
                      }
                    </span>
                    {showEmployeeNumber ? (
                      <span className={departmentsStyles.mosaicMeta}>
                        No. Empleado:{" "}
                        {
                          getDepartmentEmployeeDisplay(
                            employee as OrganizationChartEmployee,
                          ).employeeNumber
                        }
                      </span>
                    ) : null}
                    {showInformation ? (
                      <Button
                        size="small"
                        hideIcon
                        className={departmentsStyles.mosaicInfoButton}
                        onClick={() => handleOpenEmployeeDetails(employee)}
                      >
                        Ver Información
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {showEmployeesPagination ? (
          <div className={departmentsStyles.pagination}>
            <Pagination
              currentPage={employeesPage}
              totalPages={employeesTotalPages}
              onPageChange={setEmployeesPage}
            />
          </div>
        ) : null}

        <OrganizationChartEmployeeDetailsPanel
          open={isDetailsOpen}
          onClose={handleCloseDetails}
          employee={detailEmployee}
          canSeeInformation={canSeeInformation}
        />
        {employeeToDelete ? (
          <PopUp
            open={isDeletePopUpOpen}
            onClose={handleCloseDeletePopUp}
            title={`Deseas eliminar el usuario de ${getDepartmentEmployeeDisplay(employeeToDelete as OrganizationChartEmployee).fullname}?`}
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
  }

  return (
    <div className={departmentsStyles.container}>
      <div className={departmentsStyles.searchRow}>
        <div className={departmentsStyles.searchWrapper}>
          <div className={departmentsStyles.searchInputWrapper}>
            <Input
              placeholder="Buscar"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              icon={SearchIcon}
              className={departmentsStyles.searchInput}
            />
          </div>
          {canCreateEmployee ? (
            <Button hideIcon onClick={handleOpenCreateView}>
              Nuevo Empleado
            </Button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className={departmentsStyles.emptyState}>
          Cargando departamentos...
        </div>
      ) : null}

      {!loading && error ? (
        <div className={departmentsStyles.errorState}>{error}</div>
      ) : null}

      {isEmpty ? (
        <div className={departmentsStyles.emptyState}>
          No hay departamentos registrados.
        </div>
      ) : null}

      {isFilteredEmpty ? (
        <div className={departmentsStyles.emptyState}>
          No hay resultados para la busqueda.
        </div>
      ) : null}

      {!loading && !error && filteredDepartments.length > 0 ? (
        <div className={departmentsStyles.listGrid}>
          {paginatedDepartments.map((department) => (
            <Card
              key={department.department_id}
              orientation="vertical"
              imageSrc={resolveImageSrc(department)}
              label="Departamento"
              title={department.name || "Sin nombre"}
              description={
                department.enterprice_name
                  ? `Empresa: ${department.enterprice_name}`
                  : ""
              }
              primaryLabel="Ver Departamento"
              onAccept={() => handleViewDepartment(department)}
              actionMenuProps={{
                row: department,
                onDelete: () => handleOpenDeleteDepartmentPopUp(department),
                permissions: {
                  delete: canDeleteEmployee,
                },
              }}
            />
          ))}
        </div>
      ) : null}

      {showPagination ? (
        <div className={departmentsStyles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : null}
      {departmentToDelete ? (
        <PopUp
          open={isDeleteDepartmentPopUpOpen}
          onClose={handleCloseDeleteDepartmentPopUp}
          title={`Deseas eliminar el departamento ${departmentToDelete.name || "seleccionado"}?`}
          content="Esta accion confirmara la eliminacion del departamento."
          showPrimaryButton
          showSecondaryButton
          primaryButtonText={deletingDepartment ? "Eliminando..." : "Eliminar"}
          secondaryButtonText="Cancelar"
          onPrimaryButtonClick={handleDeleteDepartment}
          onSecondaryButtonClick={handleCloseDeleteDepartmentPopUp}
        />
      ) : null}
    </div>
  );
};

export default OrganizationChartDepartmentsView;

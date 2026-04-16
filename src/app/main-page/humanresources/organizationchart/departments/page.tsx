"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";
import { Card } from "@/app/components/Card/Card";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import { Input } from "@/app/components/Input/Input";
import Pagination from "@/app/components/Pagination/Pagination";
import ActionMenuCell from "@/app/components/ActionMenuCell/ActionMenuCell";
import SearchIcon from "@/assets/icons/organization/search.svg";
import ListIcon from "@/assets/icons/Editor/list.svg";
import GridIcon from "@/assets/icons/Layout/view-grid.svg";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";

import { departmentsStyles } from "./styles";
import useDepartmentsPage from "./hooks/useDepartmentsPage";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import EmployeeDetailsPanel from "../components/EmployeeDetailsPanel/EmployeeDetailsPanel";
import CreateEmployee from "@/app/main-page/administration/usersmanagment/createemployee/CreateEmployee";
import { PopUp } from "@/app/components/PopUp/PopUp";

/**
 * Vista de departamentos para organigrama.
 */
const DepartmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") ?? "list";

  type EmployeeExtras = {
    employee?: string;
    name?: string;
    second_name?: string;
    father_lastname?: string;
    mother_lastname?: string;
    employee_email?: string;
    employee_phone?: string;
    workposition_name?: string;
  };

  const { currentPagePermissions } = useAuth();
  const canSeeDetails = Boolean(currentPagePermissions?.canSeeDetails);
  const showInformation = Boolean(
    currentPagePermissions?.showInformation
  );
  const canSeeInformation = showInformation;
  const canEditEmployee = Boolean(
    currentPagePermissions?.update ?? currentPagePermissions?.canSeeDetails,
  );
  const canDeleteEmployee = Boolean(currentPagePermissions?.delete);
  const showActionMenu = canEditEmployee || canDeleteEmployee;
  const showActionsColumn = true;

  const formatEmployeeName = (employee: Partial<EmployeeExtras>) => {
    const firstName = employee.name?.trim() ?? "";
    const secondName = employee.second_name?.trim() ?? "";
    const lastName = employee.father_lastname?.trim() ?? "";

    const hasTwoNames = Boolean(firstName && secondName);
    const names = [firstName, secondName].filter(Boolean).join(" ").trim();

    if (names) {
      const surname = lastName
        ? hasTwoNames
          ? `${lastName.charAt(0).toUpperCase()}.`
          : lastName
        : "";
      return `${names}${surname ? ` ${surname}` : ""}`.trim();
    }

    const fallback = employee.employee ?? "";
    const raw = (fallback || (employee as EmployeeType)?.fullname || "").trim();
    if (!raw) return "Sin nombre";

    const tokens = raw.split(/\s+/).filter(Boolean);
    if (tokens.length === 1) return tokens[0];

    const inferredNames = tokens.slice(0, 2).join(" ");
    const inferredLast = tokens[2] ?? tokens[1] ?? "";
    const inferredSurname = tokens.length > 2
      ? `${inferredLast.charAt(0).toUpperCase()}.`
      : inferredLast;

    return `${inferredNames}${inferredSurname ? ` ${inferredSurname}` : ""}`.trim();
  };

  const getEmployeeDisplay = (
    employee: EmployeeType & Partial<EmployeeExtras>,
  ) => {
    const fullname = formatEmployeeName(employee);

    return {
      fullname,
      position:
        employee.workposition?.name || employee.workposition_name || "N/D",
      phone: employee.phone_number || employee.employee_phone || "N/D",
      email: employee.email || employee.employee_email || "N/D",
      employeeNumber: employee.employee_number || employee.employee || "N/D",
    };
  };

  const renderEmployeeImage = (employee: EmployeeType & Partial<EmployeeExtras>) => {
    if (employee.image_url) {
      return (
        <Image
          src={employee.image_url}
          alt={getEmployeeDisplay(employee).fullname}
          width={100}
          height={150}
          className="h-full w-full object-cover"
        />
      );
    }

    const fullname = getEmployeeDisplay(employee).fullname;
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
    responsibleEmployee,
    paginatedEmployees,
    employeesPage,
    employeesTotalPages,
    showEmployeesPagination,
    setEmployeesPage,
  } = useDepartmentsPage();

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeType | null>(
    null,
  );
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const deleteEmployee = useEmployeesStore((state) => state.deleteEmployee);
  const deletingEmployee = useEmployeesStore((state) => state.deleting);
  const fetchEmployeesByDepartment = useEmployeesStore(
    (state) => state.fetchEmployeesByDepartment,
  );

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
    router.push("/main-page/humanresources/organizationchart/departments?view=create");
  };

  const handleBackToDepartments = () => {
    const sourceDepartmentId = searchParams.get("sourceDepartmentId");
    if (sourceDepartmentId) {
      const params = new URLSearchParams();
      params.set("view", "detail");
      params.set("id", sourceDepartmentId);
      params.set("force", "true");
      const sourceDepartmentLabel = searchParams.get("sourceDepartmentLabel");
      if (sourceDepartmentLabel) {
        params.set("label", sourceDepartmentLabel);
      }
      router.push(
        `/main-page/humanresources/organizationchart/departments?${params.toString()}`,
      );
      return;
    }
    router.push("/main-page/humanresources/organizationchart/departments");
  };

  const handleOpenEmployeeDetails = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleEditEmployee = (employee: EmployeeType) => {
    const employeeId = employee.employee_id || employee.id;
    if (!employeeId) return;
    const params = new URLSearchParams();
    params.set("view", "create");
    params.set("idEmployee", String(employeeId));
    const sourceDepartmentId =
      departmentId ?? employee.department?.department_id ?? "";
    if (sourceDepartmentId) {
      params.set("sourceDepartmentId", sourceDepartmentId);
    }
    if (departmentLabel) {
      params.set("sourceDepartmentLabel", departmentLabel);
    }
    router.push(
      `/main-page/humanresources/organizationchart/departments?${params.toString()}`,
    );
  };

  const handleOpenDeletePopUp = (employee: EmployeeType) => {
    setEmployeeToDelete(employee);
    setIsDeletePopUpOpen(true);
  };

  const handleCloseDeletePopUp = () => {
    setIsDeletePopUpOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
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

  if (currentView === "create") {
    return (
      <div className={departmentsStyles.container}>
        <CreateEmployee
          redirectOnSuccess={false}
          onSuccess={handleBackToDepartments}
        />
      </div>
    );
  }

  if (isDetailView) {
    const isEmployeesEmpty =
      !loadingByDepartment &&
      !employeesError &&
      departmentEmployees.length === 0;
    const isEmployeesFilteredEmpty =
      !loadingByDepartment &&
      !employeesError &&
      departmentEmployees.length > 0 &&
      !responsibleEmployee &&
      paginatedEmployees.length === 0;

    type EmployeeRow = {
      id: string;
      fullname: string;
      position: string;
      phone: string;
      email: string;
      employeeNumber: string;
      image_url?: string;
      employee: EmployeeType & Partial<EmployeeExtras>;
      actions: null;
    };

    const employeeRows = (
      employees: (EmployeeType & Partial<EmployeeExtras>)[],
    ): EmployeeRow[] =>
      employees.map((employee) => {
        const display = getEmployeeDisplay(employee);
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
          <div className="flex items-center gap-3">
            <Avatar src={row.image_url} size="sm" />
            <span>{row.fullname}</span>
          </div>
        ),
        cellClass: "min-w-0 flex-[3]",
        headerClass: "min-w-0 flex-[3]",
      },
      {
        key: "position",
        label: "PUESTO",
        cellClass: "min-w-0 flex-[2]",
        headerClass: "min-w-0 flex-[2]",
      },
      {
        key: "phone",
        label: "TELEFONO",
        cellClass: "min-w-0 flex-[1.5]",
        headerClass: "min-w-0 flex-[1.5]",
      },
      {
        key: "email",
        label: "CORREO",
        cellClass: "min-w-0 flex-[2]",
        headerClass: "min-w-0 flex-[2]",
      },
      {
        key: "employeeNumber",
        label: "No. EMPLEADO",
        cellClass: "min-w-0 flex-[1]",
        headerClass: "min-w-0 flex-[1]",
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

    const teamRows = employeeRows(paginatedEmployees);

    const listTables = [
      ...(teamRows.length
        ? [
            {
              title: "Miembros del Equipo",
              data: teamRows,
              columns,
            },
          ]
        : []),
    ];
    const useGridInformationStyles = viewMode === "grid" && showInformation;

    return (
      <div className={departmentsStyles.container}>
        <div>
          <h2 className="text-h4 text-blue-60 mt-[35px] font-semibold">
            {departmentLabel}
          </h2>
          {currentPagePermissions?.showTitle && (
            <p className="text-s2 text-gray-70 mt-2 font-semibold">Departamentos encargado de crear, mejorar y mantener aplicaciones, sistemas y herramientas tecnológicas</p>
          )}
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

        {viewMode === "list" && responsibleEmployee ? (
          <div className="flex flex-col gap-4">
            <div className={departmentsStyles.sectionHeader}>
              <span>Responsable de Área</span>
              <span className={departmentsStyles.sectionDivider} />
            </div>

            <div className={departmentsStyles.listCard}>
              <div
                className={`${departmentsStyles.listRow} ${departmentsStyles.listColumns}`}
              >
                <div className="flex">
                  <div className={departmentsStyles.listAvatar}>
                    <div className={departmentsStyles.listAvatar}>
                    <Avatar src={responsibleEmployee.image_url} size="lg" />
                  </div>
                  </div>
                  <div className={departmentsStyles.listInfo}>
                    <span className={departmentsStyles.listLink}>NOMBRE</span>
                    <span className={departmentsStyles.listLinkData}>
                      {getEmployeeDisplay(responsibleEmployee).fullname}
                    </span>
                  </div>
                </div>

                <div className={departmentsStyles.listInfo}>
                  <span className={departmentsStyles.listLink}>PUESTO</span>
                  <span className={departmentsStyles.listLinkData}>
                    {getEmployeeDisplay(responsibleEmployee).position}
                  </span>
                </div>

                <div className={departmentsStyles.listInfo}>
                  <span className={departmentsStyles.listLink}>TELEFONO</span>
                  <span className={departmentsStyles.listLinkData}>
                    {getEmployeeDisplay(responsibleEmployee).phone}
                  </span>
                </div>

                <div className={departmentsStyles.listInfo}>
                  <span className={departmentsStyles.listLink}>CORREO</span>
                  <span className={departmentsStyles.listLinkData}>
                    {getEmployeeDisplay(responsibleEmployee).email}
                  </span>
                </div>

                <div className={departmentsStyles.listInfo}>
                  <span className={departmentsStyles.listLink}>
                    No. EMPLEADO
                  </span>
                  <span className={departmentsStyles.listLinkData}>
                    {getEmployeeDisplay(responsibleEmployee).employeeNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    hideIcon
                    onClick={() => handleOpenEmployeeDetails(responsibleEmployee)}
                  >
                    {canSeeDetails ? "Ver carpeta" : "Ver información"}
                  </Button>
                  {showActionMenu ? (
                    <ActionMenuCell
                      row={responsibleEmployee}
                      onEdit={handleEditEmployee}
                      onDelete={handleOpenDeletePopUp}
                      permissions={{
                        update: canEditEmployee,
                        delete: canDeleteEmployee,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
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
            onSearchChange={(value) => setEmployeeSearchValue(value)}
            tables={listTables}
          />
        ) : null}

        {viewMode === "grid" && responsibleEmployee ? (
          <div className="flex flex-col gap-4">
            <div className={departmentsStyles.sectionHeader}>
              <span>Responsable de Área</span>
              <span className={departmentsStyles.sectionDivider} />
            </div>

            <div
              className={
                useGridInformationStyles
                  ? departmentsStyles.mosaicCardInformation
                  : departmentsStyles.mosaicCard
              }
            >
              <div
                className={
                  useGridInformationStyles
                    ? departmentsStyles.mosaicAvatarResponsible
                    : departmentsStyles.mosaicAvatar
                }
              >
                {renderEmployeeImage(responsibleEmployee)}
              </div>
              <div
                className={
                  useGridInformationStyles
                    ? departmentsStyles.mosaicInfoInformation
                    : departmentsStyles.mosaicInfo
                }
              >
                <span className={departmentsStyles.mosaicCompany}>
                  {responsibleEmployee.department?.enterprice_name || "EMPRESA"}
                </span>
                <span className={departmentsStyles.mosaicName}>
                  {getEmployeeDisplay(responsibleEmployee).fullname}
                </span>
                <span className={departmentsStyles.mosaicRole}>
                  {getEmployeeDisplay(responsibleEmployee).position}
                </span>
                <span className={departmentsStyles.mosaicMeta}>
                  {getEmployeeDisplay(responsibleEmployee).phone}
                </span>
                <span className={departmentsStyles.mosaicMeta}>
                  {getEmployeeDisplay(responsibleEmployee).email}
                </span>
                <span className={departmentsStyles.mosaicMeta}>
                  No. Empleado:{" "}
                  {getEmployeeDisplay(responsibleEmployee).employeeNumber}
                </span>
                {showInformation ? (
                  <Button
                    size="small"
                    hideIcon
                    className={departmentsStyles.mosaicInfoButton}
                    onClick={() =>
                      handleOpenEmployeeDetails(responsibleEmployee)
                    }
                  >
                    Ver Información
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
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
                    {renderEmployeeImage(employee)}
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
                      {getEmployeeDisplay(employee).fullname}
                    </span>
                    <span className={departmentsStyles.mosaicRole}>
                      {getEmployeeDisplay(employee).position}
                    </span>
                    <span className={departmentsStyles.mosaicMeta}>
                      {getEmployeeDisplay(employee).phone}
                    </span>
                    <span className={departmentsStyles.mosaicMeta}>
                      {getEmployeeDisplay(employee).email}
                    </span>
                    <span className={departmentsStyles.mosaicMeta}>
                      No. Empleado:{" "}
                      {getEmployeeDisplay(employee).employeeNumber}
                    </span>
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

        <EmployeeDetailsPanel
          open={isDetailsOpen}
          onClose={handleCloseDetails}
          employee={detailEmployee}
          canSeeInformation={canSeeInformation}
        />
        {employeeToDelete ? (
          <PopUp
            open={isDeletePopUpOpen}
            onClose={handleCloseDeletePopUp}
            title={`Deseas eliminar el usuario de ${getEmployeeDisplay(employeeToDelete).fullname}?`}
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
          <Button hideIcon onClick={handleOpenCreateView}>
            Nuevo Empleado
          </Button>
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
              description=""
              primaryLabel="Ver Departamento"
              onAccept={() => handleViewDepartment(department)}
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
    </div>
  );
};

export default DepartmentsPage;

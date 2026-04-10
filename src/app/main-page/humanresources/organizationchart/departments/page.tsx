"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";
import { Card } from "@/app/components/Card/Card";
import { DataTable } from "@/app/components/DataTable/DataTable";
import type { ColumnDefinition } from "@/app/components/DataTable/types";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { Input } from "@/app/components/Input/Input";
import Pagination from "@/app/components/Pagination/Pagination";
import SearchIcon from "@/assets/icons/organization/search.svg";
import ListIcon from "@/assets/icons/Editor/list.svg";
import GridIcon from "@/assets/icons/Layout/view-grid.svg";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";

import { departmentsStyles } from "./styles";
import useDepartmentsPage from "./hooks/useDepartmentsPage";

/**
 * Vista de departamentos para organigrama.
 */
const DepartmentsPage = () => {
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

  const emptyValue = "N/D";

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

  const detailEmployee = selectedEmployee;
  const detailDepartment = detailEmployee?.department;

  const isEmpty = !loading && !error && departments.length === 0;
  const isFilteredEmpty =
    !loading &&
    !error &&
    departments.length > 0 &&
    filteredDepartments.length === 0;

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

    const employeeRows = (
      employees: (EmployeeType & Partial<EmployeeExtras>)[],
    ) =>
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
        };
      });

    type EmployeeRow = ReturnType<typeof employeeRows>[number];

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
      {
        key: "id",
        label: "",
        cellClass: "min-w-0 flex-[1] text-right",
        headerClass: "min-w-0 flex-[1] text-right",
        render: (row) => (
          <Button
            variant="ghost"
            size="small"
            hideIcon
            onClick={() => {
              setSelectedEmployee(row.employee);
              setIsDetailsOpen(true);
            }}
          >
            Ver Informacion
          </Button>
        ),
      },
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

    return (
      <div className={departmentsStyles.container}>
        <div>
          <h2 className="text-h4 text-blue-60 mt-[35px] font-semibold">
            {departmentLabel}
          </h2>
        </div>

        {viewMode === "grid" || viewMode === "list" ? (
          <div className={departmentsStyles.searchRow}>
            <div className={departmentsStyles.searchWrapper}>
              <Input
                placeholder="Buscar"
                value={employeeSearchValue}
                onChange={(event) => setEmployeeSearchValue(event.target.value)}
                icon={SearchIcon}
                className={departmentsStyles.searchInput}
              />
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
                    <Avatar src={responsibleEmployee.image_url} size="sm" />
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
                <Button
                  variant="ghost"
                  size="small"
                  hideIcon
                  onClick={() => {
                    setSelectedEmployee(responsibleEmployee);
                    setIsDetailsOpen(true);
                  }}
                >
                  Ver Informacion
                </Button>
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

            <div className={departmentsStyles.mosaicCard}>
              <div className={departmentsStyles.mosaicAvatar}>
                {renderEmployeeImage(responsibleEmployee)}
              </div>
              <div className={departmentsStyles.mosaicInfo}>
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
                  className={departmentsStyles.mosaicCard}
                >
                  <div className={departmentsStyles.mosaicAvatar}>
                    {renderEmployeeImage(employee)}
                  </div>
                  <div className={departmentsStyles.mosaicInfo}>
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
                  {getEmployeeDisplay(detailEmployee).fullname}
                </h2>
                <div className="bg-green-80 text-b4 w-[157px] rounded-[8px] px-[8px] py-[6px] text-white mb-6 mt-3">
                  Información Laboral
                </div>
              </div>

              <dl className="text-b3 space-y-2 text-gray-100">
                <div className="flex">
                  <dt className="text-gray-90 font-semibold">EMPRESA:</dt>
                  <dd> {detailDepartment?.enterprice_name || emptyValue}</dd>
                </div>
                <div className="flex">
                  <dt className="text-gray-90 font-semibold">NO. EMPLEADO:</dt>
                  <dd>
                    {getEmployeeDisplay(detailEmployee).employeeNumber ||
                      emptyValue}
                  </dd>
                </div>
                <div className="flex my-6">
                  <dt className="text-gray-90 font-semibold">RESPONSABLE:</dt>
                  <dd>{detailEmployee.manager_id || emptyValue}</dd>
                </div>
                <div className="flex">
                  <dt className="text-gray-90 font-semibold">AREA:</dt>
                  <dd>{detailDepartment?.name || emptyValue}</dd>
                </div>
                <div className="flex">
                  <dt className="text-gray-90 font-semibold">POSICION DE TRABAJO:</dt>
                  <dd>
                    {detailEmployee.workposition?.name ||
                      detailEmployee.workposition_name ||
                      emptyValue}
                  </dd>
                </div>
                <div className="flex mt-6">
                  <dt className="text-gray-90 font-semibold">TELEFONO:</dt>
                  <dd>
                    {detailEmployee.phone_number ||
                      detailEmployee.employee_phone ||
                      emptyValue}
                  </dd>
                </div>
                <div className="flex">
                  <dt className="text-gray-90 font-semibold">CORREO:</dt>
                  <dd>
                    {detailEmployee.email ||
                      detailEmployee.employee_email ||
                      emptyValue}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </DetailsPanelLayout>
      </div>
    );
  }

  return (
    <div className={departmentsStyles.container}>
      <div className={departmentsStyles.searchRow}>
        <div className={departmentsStyles.searchWrapper}>
          <Input
            placeholder="Buscar"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            icon={SearchIcon}
            className={departmentsStyles.searchInput}
          />
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

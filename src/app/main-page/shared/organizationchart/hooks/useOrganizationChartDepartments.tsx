"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import { useRouter, useSearchParams } from "next/navigation";

import type { DepartmentType } from "@/app/mappings/department/department.types";
import { useDepartmentsStore } from "@/app/stores/useDepartmentsStore/useDepartmentsStore";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { getDepartmentCatalogImage } from "@/app/main-page/humanresources/departments/utilities/departmentCatalogImages";
import { buildOrganizationChartDepartmentsPath } from "../routes";

const PAGE_SIZE = 8;
const EMPLOYEES_PAGE_SIZE = 6;

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const collator = new Intl.Collator("es-MX", {
  sensitivity: "base",
  numeric: true,
});

const compareText = (left: string, right: string) =>
  collator.compare(normalizeText(left), normalizeText(right));

const buildEmployeeSearchPayload = (employee: {
  workposition_name?: string;
  workposition?: { name?: string } | null;
  employee_phone?: string | null;
  employee_email?: string | null;
  employee_number?: string | null;
}) =>
  [
    employee.workposition_name,
    employee.workposition?.name,
    employee.employee_phone,
    employee.employee_email,
    employee.employee_number,
  ]
    .filter(Boolean)
    .map((value) => normalizeText(String(value)));

export const useOrganizationChartDepartments = (basePath: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") ?? "list") as "list" | "detail";
  const departmentId = searchParams.get("id");
  const departmentLabelParam = searchParams.get("label") ?? "";
  const forceRefresh = searchParams.get("force") === "true";

  const isDetailView = view === "detail" && Boolean(departmentId);
  const hasFetched = useRef(false);
  const lastDepartmentId = useRef<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPage, setEmployeesPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [employeeSearchValue, setEmployeeSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { departments, loading, error, fetchDepartments } = useDepartmentsStore(
    (state) => ({
      departments: state.departments,
      loading: state.loading,
      error: state.error,
      fetchDepartments: state.fetchDepartments,
    }),
    shallow,
  );

  const {
    departmentEmployees,
    loadingByDepartment,
    error: employeesError,
    fetchEmployeesByDepartment,
  } = useEmployeesStore(
    (state) => ({
      departmentEmployees: state.departmentEmployees,
      loadingByDepartment: state.loadingByDepartment,
      error: state.error,
      fetchEmployeesByDepartment: state.fetchEmployeesByDepartment,
    }),
    shallow,
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchDepartments(true);
  }, [fetchDepartments]);

  useEffect(() => {
    if (!isDetailView || !departmentId) return;
    if (lastDepartmentId.current === departmentId && !forceRefresh) return;
    lastDepartmentId.current = departmentId;
    fetchEmployeesByDepartment(departmentId, true);
  }, [departmentId, fetchEmployeesByDepartment, forceRefresh, isDetailView]);

  const filteredDepartments = useMemo(() => {
    const query = searchValue.trim();
    const filtered = !query
      ? departments
      : departments.filter((department) => {
          const needle = normalizeText(query);
          const candidates = [
            department.name,
            department.enterprice_name,
            ...(department.enterprises?.map((enterprise) => enterprise.name) ??
              []),
          ]
            .filter(Boolean)
            .map((value) => normalizeText(String(value)));

          return candidates.some((value) => value.includes(needle));
        });

    return [...filtered].sort((left, right) =>
      compareText(
        left.name || left.enterprice_name || left.department_id,
        right.name || right.enterprice_name || right.department_id,
      ),
    );
  }, [departments, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  useEffect(() => {
    setEmployeesPage(1);
  }, [employeeSearchValue, viewMode]);

  useEffect(() => {
    if (!isDetailView) return;
    setEmployeeSearchValue("");
    setEmployeesPage(1);
  }, [departmentId, isDetailView]);

  const totalPages = useMemo(() => {
    if (!filteredDepartments.length) return 1;
    return Math.ceil(filteredDepartments.length / PAGE_SIZE);
  }, [filteredDepartments.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedDepartments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDepartments.slice(start, start + PAGE_SIZE);
  }, [filteredDepartments, currentPage]);

  const showPagination = filteredDepartments.length > PAGE_SIZE;

  const resolveImageSrc = useCallback(
    (department: DepartmentType) =>
      getDepartmentCatalogImage(
        department.name || department.department_id || "",
      ),
    [],
  );

  const handleViewDepartment = (department: DepartmentType) => {
    router.push(
      buildOrganizationChartDepartmentsPath(basePath, {
        view: "detail",
        id: department.department_id,
        label: department.name ?? undefined,
      }),
    );
  };

  const departmentLabel = useMemo(() => {
    if (departmentLabelParam) return departmentLabelParam;
    if (!departmentId) return "Departamento";
    const match = departments.find(
      (department) => department.department_id === departmentId,
    );
    return match?.name || "Departamento";
  }, [departmentId, departmentLabelParam, departments]);

  const filteredEmployees = useMemo(() => {
    const query = employeeSearchValue.trim();
    const filtered = !query
      ? departmentEmployees
      : departmentEmployees.filter((employee) => {
          const needle = normalizeText(query);
          return buildEmployeeSearchPayload(employee).some((value) =>
            value.includes(needle),
          );
        });

    return [...filtered].sort((left, right) =>
      compareText(
        left.employee_number || left.fullname || "",
        right.employee_number || right.fullname || "",
      ),
    );
  }, [departmentEmployees, employeeSearchValue]);

  const responsibleEmployee = filteredEmployees[0] ?? null;
  const teamEmployees = filteredEmployees;

  const employeesTotalPages = useMemo(() => {
    if (!teamEmployees.length) return 1;
    return Math.ceil(teamEmployees.length / EMPLOYEES_PAGE_SIZE);
  }, [teamEmployees.length]);

  useEffect(() => {
    if (employeesPage > employeesTotalPages) setEmployeesPage(1);
  }, [employeesPage, employeesTotalPages]);

  const paginatedEmployees = useMemo(() => {
    const start = (employeesPage - 1) * EMPLOYEES_PAGE_SIZE;
    return teamEmployees.slice(start, start + EMPLOYEES_PAGE_SIZE);
  }, [teamEmployees, employeesPage]);

  const showEmployeesPagination = teamEmployees.length > EMPLOYEES_PAGE_SIZE;

  return {
    view,
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
  };
};

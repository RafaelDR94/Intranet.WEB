"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import { useRouter, useSearchParams } from "next/navigation";

import type { DepartmentType } from "@/app/mappings/department/department.types";
import { useDepartmentsStore } from "@/app/stores/useDepartmentsStore/useDepartmentsStore";
import { useEnterprisesStore } from "@/app/stores/useEnterprisesStore/useEnterprisesStore";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

import type {
  DepartmentFormState,
  DepartmentPositionItem,
  DepartmentViewMode,
} from "../types";
import { getDepartmentCatalogImage } from "../utilities/departmentCatalogImages";

const PAGE_SIZE = 8;

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const createPositionId = (() => {
  let counter = 0;
  return () => {
    counter += 1;
    return `position-${Date.now()}-${counter}`;
  };
})();

const buildEmptyPosition = (): DepartmentPositionItem => ({
  id: createPositionId(),
  name: "",
});

const defaultFormState: DepartmentFormState = {
  name: "",
  description: "",
  enterpriseId: "",
  positions: [buildEmptyPosition()],
};

/**
 * Controla el catalogo y formulario de departamentos.
 */
const useDepartmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") ?? "list") as DepartmentViewMode;
  const departmentId = searchParams.get("id");

  const isCreateView = view === "new";
  const isEditView = view === "edit";

  const hasFetched = useRef(false);
  const hasFetchedEnterprises = useRef(false);
  const hasHydratedEdit = useRef(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [formState, setFormState] = useState<DepartmentFormState>(defaultFormState);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const {
    departments,
    loading,
    error,
    creating,
    updating,
    successPost,
    successPut,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    resetFlags,
  } = useDepartmentsStore(
    (state) => ({
      departments: state.departments,
      loading: state.loading,
      error: state.error,
      creating: state.creating,
      updating: state.updating,
      successPost: state.successPost,
      successPut: state.successPut,
      fetchDepartments: state.fetchDepartments,
      createDepartment: state.createDepartment,
      updateDepartment: state.updateDepartment,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const { enterprises, fetchEnterprises } = useEnterprisesStore(
    (state) => ({
      enterprises: state.enterprises,
      fetchEnterprises: state.fetchEnterprises,
    }),
    shallow,
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchDepartments(true);
  }, [fetchDepartments]);

  useEffect(() => {
    if (hasFetchedEnterprises.current) return;
    hasFetchedEnterprises.current = true;
    fetchEnterprises(true);
  }, [fetchEnterprises]);

  const totalPages = useMemo(() => {
    if (!departments.length) return 1;
    return Math.ceil(departments.length / PAGE_SIZE);
  }, [departments.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedDepartments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return departments.slice(start, start + PAGE_SIZE);
  }, [departments, currentPage]);

  const showPagination = departments.length > PAGE_SIZE;

  const resolveImageSrc = useCallback(
    (department: DepartmentType) =>
      getDepartmentCatalogImage(
        department.name || department.department_id || "",
      ),
    [],
  );

  const enterpriseOptions = useMemo(
    () =>
      enterprises.map((enterprise) => ({
        label: enterprise.name,
        value: enterprise.enterprise_id,
      })),
    [enterprises],
  );

  const resolveEnterpriseId = useCallback(
    (department: DepartmentType): string => {
      if (department.enterprises && department.enterprises.length > 0) {
        return department.enterprises[0]?.enterprise_id ?? "";
      }
      if (department.enterprise_id) return department.enterprise_id;
      if (department.enterprice_name) {
        const match = enterprises.find(
          (enterprise) =>
            normalizeText(enterprise.name) ===
            normalizeText(department.enterprice_name),
        );
        return match ? match.enterprise_id : "";
      }
      return "";
    },
    [enterprises],
  );

  useEffect(() => {
    if (!isEditView || !departmentId) return;
    if (hasHydratedEdit.current) return;
    const target = departments.find(
      (department) => department.department_id === departmentId,
    );
    if (!target) return;

    hasHydratedEdit.current = true;

    const positions =
      target.positions?.length
        ? target.positions.map((position) => ({
            id: createPositionId(),
            name: position.name,
          }))
        : [buildEmptyPosition()];

    setFormState({
      name: target.name ?? "",
      description: target.description ?? "",
      enterpriseId: resolveEnterpriseId(target),
      positions,
    });
  }, [
    departmentId,
    departments,
    isEditView,
    resolveEnterpriseId,
  ]);

  useEffect(() => {
    if (isEditView) return;
    hasHydratedEdit.current = false;
    setFormState(defaultFormState);
  }, [isEditView, isCreateView]);

  const handleFieldChange = (
    field: keyof DepartmentFormState,
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePositionChange = (id: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      positions: prev.positions.map((position) =>
        position.id === id ? { ...position, name: value } : position,
      ),
    }));
  };

  const handleAddPosition = () => {
    setFormState((prev) => ({
      ...prev,
      positions: [...prev.positions, buildEmptyPosition()],
    }));
  };

  useEffect(() => {
    if (creating) {
      showSpinner({ message: "Registrando departamento" });
      return;
    }
    if (updating) {
      showSpinner({ message: "Actualizando departamento" });
      return;
    }
    hideSpinner();
  }, [creating, hideSpinner, showSpinner, updating]);

  useEffect(() => {
    if (successPost || successPut) {
      showAlert({
        type: "success",
        title: successPut ? "Actualizacion exitosa" : "Registro exitoso",
        description: successPut
          ? "El departamento se actualizo correctamente."
          : "El departamento se registro correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      });
      resetFlags();
      router.push("/main-page/humanresources/departments");
      return;
    }

    if (error && (isCreateView || isEditView)) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      resetFlags();
    }
  }, [
    error,
    isCreateView,
    isEditView,
    resetFlags,
    router,
    showAlert,
    successPost,
    successPut,
  ]);

  const handleSubmit = async () => {
    if (!isCreateView && !isEditView) return;
    if (isEditView && !departmentId) return;
    const name = formState.name.trim();
    if (!name) return;
    const enterpriseId = formState.enterpriseId.trim();
    if (!enterpriseId) return;
    const workpositions = formState.positions
      .map((position) => position.name.trim())
      .filter(Boolean);

    const payload = {
      name,
      description: formState.description.trim() || undefined,
      enterprise_id: enterpriseId,
      workpositions,
    };

    if (isCreateView) {
      await createDepartment(payload);
      return;
    }

    await updateDepartment({
      ...payload,
      department_id: departmentId ?? "",
    });
  };

  const handleNewClick = () => {
    router.push("/main-page/humanresources/departments?view=new");
  };

  const handleViewDepartment = (department: DepartmentType) => {
    const params = new URLSearchParams();
    params.set("view", "edit");
    params.set("id", department.department_id);
    if (department.name) params.set("label", department.name);
    router.push(`/main-page/humanresources/departments?${params.toString()}`);
  };

  const title = isEditView
    ? `Resumen del departamento de ${formState.name || "Departamento"}`
    : "Registra aqui un nuevo departamento";

  const primaryLabel = isEditView
    ? "Guardar ajustes"
    : "Registrar departamento";

  const isReady =
    Boolean(formState.name.trim()) && Boolean(formState.enterpriseId.trim());
  const isSubmitting = creating || updating;

  return {
    view,
    isCreateView,
    isEditView,
    title,
    primaryLabel,
    isReady,
    departments,
    creating: isSubmitting,
    paginatedDepartments,
    currentPage,
    totalPages,
    showPagination,
    setCurrentPage,
    loading,
    error,
    resolveImageSrc,
    enterpriseOptions,
    formState,
    handleFieldChange,
    handlePositionChange,
    handleAddPosition,
    handleNewClick,
    handleViewDepartment,
    handleSubmit,
  };
};

export default useDepartmentsPage;

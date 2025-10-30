import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { shallow } from "zustand/shallow";

import { buildInitialFields } from "../utilities/formFieldModel";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { ProyectPost } from "@/app/mappings/proyects/proyects.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";


const formId = "sip-new-proyect";

const useNewProyect = () => {
  const submitRef = useRef<() => void | Promise<void>>(null);
  const [formReady, setFormReady] = useState(false);
  const [loadingFormInfo, setLoadingFormInfo] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams?.get("id") ?? "";

  const { fieldsByFormId, setFields, updateField, resetFields } = useFormFieldsStore();
  const fields = fieldsByFormId[formId] ?? [];

  // Principal (spinner + alert)
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  // Employees catalog
  const { employees, employeesLoading, employeesError, fetchEmployees } = useEmployeesStore(
    (s) => ({
      employees: s.employees,
      employeesLoading: s.loading,
      employeesError: s.error,
      fetchEmployees: s.fetchEmployees,
    }),
    shallow
  );

  useEffect(() => { setFields(formId, buildInitialFields()); }, [setFields]);
  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // Repoblar selects cuando haya empleados
  useEffect(() => {
    setLoadingFormInfo(employeesLoading);
    if (!employees?.length) return;
    const employeeOptions = employees.map((e) => ({ label: e.fullname, value: e.employee_id }));
    updateField(formId, "manager", { options: employeeOptions });
    updateField(formId, "collaborators", { options: employeeOptions });
  }, [employees, employeesLoading, updateField]);

  // Manejo de errores de catálogos
  useEffect(() => {
    if (!employeesError) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudo cargar la lista de empleados",
      description: String(employeesError) || "Intenta refrescar.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: "Refrescar",
      onSecondaryClick: () => { hideAlert(); fetchEmployees(); },
    });
  }, [employeesError, fetchEmployees, showAlert, hideAlert]);

  // Store de proyectos (create/update + catálogo para edición)
  const { proyects, fetchProyects, createProyect, updateProyect, creating, updating, successPost, successPut, error, resetFlags } = useProyectsStore(
    (s) => ({
      proyects: s.proyects,
      fetchProyects: s.fetchProyects,
      createProyect: s.createProyect,
      updateProyect: s.updateProyect,
      creating: s.creating,
      updating: s.updating,
      successPost: s.successPost,
      successPut: s.successPut,
      error: s.error,
      resetFlags: s.resetFlags,
    }),
    shallow
  );

  useEffect(() => { if (editId) fetchProyects(); }, [editId, fetchProyects]);

  // Prellenar para edición
  useEffect(() => {
    if (!editId) return;
    const found = proyects.find(p => p.id === editId);
    if (!found) return;
    updateField(formId, 'name', { value: found.name });
    updateField(formId, 'client', { value: found.client });
    updateField(formId, 'proyectKey', { value: found.proyectKey });
    const collabIds = (found.collaborators ?? []).map(c => c.employee_id);
    updateField(formId, 'collaborators', { value: collabIds });
    updateField(formId, 'manager', { value: collabIds[0] ?? '' });
  }, [editId, proyects, updateField]);

  // Spinner + alert según operación
  useEffect(() => {
    if (creating || updating) {
      showSpinner({ message: "Espera un momento, guardando proyecto…" });
      return;
    }
    hideSpinner();

    if (successPost || successPut) {
      setFields(formId, buildInitialFields());
      showAlert({
        type: "success",
        variant: "filled",
        title: successPost ? "Creación exitosa" : "Actualización exitosa",
        description: successPost ? "El proyecto se ha creado exitosamente" : "El proyecto se actualizó exitosamente",
        autoCloseMs: 1500,
        showPrimaryButton: false,
        showSecondaryButton: false,
        onClose: () => { resetFlags(); },
      });
    }

    if (!creating && !updating && !successPost && !successPut && error) {
      showAlert({
        type: "error",
        variant: "filled",
        title: editId ? "No se pudo actualizar el proyecto" : "No se pudo crear el proyecto",
        description: String(error) || "Ocurrió un error. Intenta de nuevo.",
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: () => { hideAlert(); resetFlags(); },
        showSecondaryButton: true,
        secondaryLabel: "Reintentar",
        onSecondaryClick: () => { hideAlert(); submitRef.current?.(); },
      });
    }
    resetFlags();
  }, [creating, updating, successPost, successPut, error, showSpinner, hideSpinner, showAlert, hideAlert, setFields, resetFlags, editId]);

  const handleSubmit = useCallback(async (values: Record<string, any>) => {
    const payload: ProyectPost = {
      name: String(values?.name ?? ""),
      proyectKey: String(values?.proyectKey ?? ""),
      client: String(values?.client ?? ""),
      collaborators: Array.isArray(values?.collaborators) ? values.collaborators : [],
      managerId: String(values?.manager ?? ""),
    };
    if (editId) {
      await updateProyect({ id: editId, ...payload });
    } else {
      await createProyect(payload);
    }
  }, [createProyect, updateProyect, editId]);

  const responsiveLayout = useMemo(() => ({
    lg: [[5, 5], [5, 5], [5]],
    md: [[10], [10], [10], [10],[10]],
    sm: [[10], [10], [10], [10],[10]],
  }), []);

  useEffect(() => () => { resetFields(formId); }, [resetFields]);

  return { responsiveLayout, submitRef, formReady, setFormReady, fields, handleSubmit, loadingFormInfo, creating: creating || updating };
}

export default useNewProyect;


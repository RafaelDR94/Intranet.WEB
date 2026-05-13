"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { ProyectPost } from "@/app/mappings/proyects/proyects.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import useProyectLocationStore from "@/app/stores/useProyectLocationStore/useProyectLocationStore";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";

const useNewProyect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("id") ?? "";
  const isEditing = editId.length > 0;

  const [client, setClient] = useState("");
  const [name, setName] = useState("");
  const [proyectKey, setProyectKey] = useState("");
  const [locationId, setLocationId] = useState("");
  const [pendingCollaboratorId, setPendingCollaboratorId] = useState("");
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>([]);
  const getEmployeeId = useCallback(
    (employee: EmployeeType): string => String(employee.employee_id ?? employee.id ?? ""),
    []
  );
  const getEmployeeUserId = useCallback(
    (employee: EmployeeType): string =>
      String(
        employee.user?.user_id ??
          (employee.user as unknown as { id?: string } | null)?.id ??
          ""
      ),
    []
  );

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const { employees, employeesLoading, employeesError, fetchEmployees } = useEmployeesStore(
    (s) => ({
      employees: s.employees,
      employeesLoading: s.loading,
      employeesError: s.error,
      fetchEmployees: s.fetchEmployees,
    }),
    shallow
  );

  const { locations, loadingLocations, locationError, fetchAllLocations, createLocation } = useProyectLocationStore(
    (s) => ({
      locations: s.locations,
      loadingLocations: s.loadingLocations,
      locationError: s.error,
      fetchAllLocations: s.fetchAllLocations,
      createLocation: s.createLocation,
    }),
    shallow
  );

  const {
    currentProyect,
    fetchProyectById,
    clearCurrentProyect,
    createProyect,
    updateProyect,
    creating,
    updating,
    successPost,
    successPut,
    error,
    resetFlags,
  } = useProyectsStore(
    (s) => ({
      currentProyect: s.currentProyect,
      fetchProyectById: s.fetchProyectById,
      clearCurrentProyect: s.clearCurrentProyect,
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

  useEffect(() => {
    void fetchEmployees();
    void fetchAllLocations();
  }, [fetchAllLocations, fetchEmployees]);

  useEffect(() => {
    if (!editId) {
      clearCurrentProyect();
      return;
    }

    void fetchProyectById(editId);
  }, [clearCurrentProyect, editId, fetchProyectById]);

  useEffect(() => {
    if (!editId || !currentProyect || currentProyect.id !== editId) return;

    setClient(currentProyect.client ?? "");
    setName(currentProyect.name ?? "");
    setProyectKey(currentProyect.proyectKey ?? "");
    setCollaboratorIds(
      (currentProyect.collaborators ?? [])
        .map((collaborator) => getEmployeeId(collaborator))
        .filter((id) => id.length > 0)
    );
  }, [currentProyect, editId, getEmployeeId]);

  useEffect(() => {
    if (!employeesError && !locationError) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudo cargar la Información del formulario",
      description: String(employeesError || locationError || "Intenta refrescar."),
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: "Refrescar",
      onSecondaryClick: () => {
        hideAlert();
        void fetchEmployees();
        void fetchAllLocations();
      },
    });
  }, [employeesError, locationError, hideAlert, showAlert, fetchEmployees, fetchAllLocations]);

  useEffect(() => {
    if (creating || updating) {
      showSpinner({ message: "Espera un momento, guardando proyecto..." });
      return;
    }

    hideSpinner();

    if (successPost || successPut) {
      showAlert({
        type: "success",
        variant: "filled",
        title: successPost ? "Creacion exitosa" : "Actualizacion exitosa",
        description: successPost
          ? "El proyecto se ha creado exitosamente"
          : "El proyecto se actualizo exitosamente",
        autoCloseMs: 1500,
        showPrimaryButton: false,
        showSecondaryButton: false,
      });

      router.push("/main-page/proyects/proyects/proyectslist");
      router.refresh();
    }

    if (!creating && !updating && !successPost && !successPut && error) {
      showAlert({
        type: "error",
        variant: "filled",
        title: editId ? "No se pudo actualizar el proyecto" : "No se pudo crear el proyecto",
        description: String(error),
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: () => {
          hideAlert();
          resetFlags();
        },
      });
    }

    resetFlags();
  }, [
    creating,
    updating,
    successPost,
    successPut,
    error,
    editId,
    hideAlert,
    hideSpinner,
    resetFlags,
    showAlert,
    showSpinner,
    router,
  ]);

  const collaboratorOptions = useMemo(
    () =>
      employees
        .map((employee) => ({ label: employee.fullname, value: getEmployeeId(employee) }))
        .filter((option) => option.value.length > 0),
    [employees, getEmployeeId]
  );

  const locationOptions = useMemo(
    () => locations.map((location) => ({ label: location.name, value: location.id })),
    [locations]
  );

  const collaborators = useMemo(
    () =>
      collaboratorIds
        .map((id) => employees.find((employee) => getEmployeeId(employee) === id))
        .filter(Boolean) as Array<(typeof employees)[number]>,
    [collaboratorIds, employees, getEmployeeId]
  );

  const collaboratorRows = useMemo(
    () =>
      collaborators.map((collaborator) => {
        const id = getEmployeeId(collaborator);
        const fullName = collaborator.fullname?.trim() || "Sin nombre";
        const avatarInitials = fullName
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("");

        return {
          id,
          fullname: fullName,
          workPosition: collaborator.workposition_name?.trim() || "Sin puesto",
          phone: collaborator.employee_phone?.trim() || collaborator.phone_number?.trim() || "N/A",
          email: collaborator.employee_email?.trim() || collaborator.email?.trim() || "N/A",
          avatarSrc: collaborator.image_url?.trim() || "",
          avatarInitials,
        };
      }),
    [collaborators, getEmployeeId]
  );

  const addCollaborator = () => {
    if (!pendingCollaboratorId) return;
    setCollaboratorIds((current) =>
      current.includes(pendingCollaboratorId) ? current : [...current, pendingCollaboratorId]
    );
    setPendingCollaboratorId("");
  };

  const removeCollaborator = (id: string) => {
    setCollaboratorIds((current) => current.filter((item) => item !== id));
  };

  const formReady = useMemo(
    () =>
      client.trim().length > 0 &&
      name.trim().length > 0 &&
      proyectKey.trim().length > 0,
    [client, name, proyectKey]
  );

  const submit = useCallback(async () => {
    if (!formReady) return;
    const managerId =
      collaborators.length > 0 ? getEmployeeUserId(collaborators[0]) : "";

    const payload: ProyectPost = {
      client: client.trim(),
      name: name.trim(),
      proyectKey: proyectKey.trim(),
      managerId,
      collaborators: collaboratorIds,
    };

    if (editId) {
      await updateProyect({ id: editId, ...payload });
      return;
    }

    await createProyect(payload);
  }, [
    client,
    collaboratorIds,
    collaborators,
    createProyect,
    editId,
    formReady,
    getEmployeeUserId,
    name,
    proyectKey,
    updateProyect,
  ]);

  const registerLocation = useCallback(
    async (payload: { name: string; address: string; linkmaps: string }) => {
      const nameValue = payload.name.trim();
      const addressValue = payload.address.trim();
      const linkmapsValue = payload.linkmaps.trim();

      if (!nameValue || !addressValue || !linkmapsValue) return false;

      showSpinner({ message: "Registrando ubicacion..." });
      const created = await createLocation({
        name: nameValue,
        address: addressValue,
        linkmaps: linkmapsValue,
      });
      hideSpinner();

      if (!created) {
        showAlert({
          type: "error",
          variant: "filled",
          title: "No se pudo registrar la ubicacion",
          description: "Intenta nuevamente.",
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: hideAlert,
        });
        return false;
      }

      await fetchAllLocations(true);
      setLocationId(created.id);
      showAlert({
        type: "success",
        variant: "filled",
        title: "Ubicacion registrada",
        description: "La ubicacion se agrego correctamente.",
        autoCloseMs: 1200,
        showPrimaryButton: false,
        showSecondaryButton: false,
      });
      return true;
    },
    [createLocation, fetchAllLocations, hideAlert, hideSpinner, showAlert, showSpinner]
  );

  return {
    client,
    name,
    proyectKey,
    locationId,
    isEditing,
    pendingCollaboratorId,
    collaborators,
    collaboratorRows,
    collaboratorOptions,
    locationOptions,
    loadingFormInfo: employeesLoading || loadingLocations,
    creating: creating || updating,
    formReady,
    setClient,
    setName,
    setProyectKey,
    setLocationId,
    setPendingCollaboratorId,
    addCollaborator,
    removeCollaborator,
    submit,
    registerLocation,
  };
};

export default useNewProyect;

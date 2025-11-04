import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useUsersStore } from "@/app/stores/useUsersStore/useUsersStore";

import type { UseShowDetailsResult } from "../types";

const formatPhoneNumber = (raw?: string | null) => {
  if (!raw) return "No phone";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3");
  }
  if (digits.length === 12) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
  }
  if (digits.length === 13) {
    return digits.replace(/(\d{3})(\d{2})(\d{4})(\d{4})/, "$1 $2 $3 $4");
  }
  return raw;
};

export const useShowDetails = (): UseShowDetailsResult => {
  const { employee, setCurrentEmployee, forceFetchEmployees } = useEmployeesStore(
    (state) => ({
      employee: state.employee,
      setCurrentEmployee: state.setCurrentEmployee,
      forceFetchEmployees: state.forceFetchEmployees,
    }),
    shallow
  );

  const {
    toggleActive: toggleUserActive,
    togglingActive,
    successToggleActive,
    error: userStoreError,
    resetFlags: resetUserFlags,
  } = useUsersStore(
    (state) => ({
      toggleActive: state.toggleActive,
      togglingActive: state.togglingActive,
      successToggleActive: state.successToggleActive,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow
  );

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const pendingStatusRef = useRef<boolean | null>(null);

  const computed = useMemo(() => {
    if (!employee) {
      return {
        initials: "",
        primaryNameLine: "",
        secondaryNameLine: "",
        companyName: "",
        position: "",
        employeeNumber: "",
        phoneNumber: "",
        email: "",
        departmentName: "",
      };
    }

    const primary = [employee.firstname, employee.secondname].filter(Boolean).join(" ");
    const secondary = [employee.lastname, employee.motherlast_name].filter(Boolean).join(" ");

    const initialsValue = (employee.firstname?.[0] ?? "") + (employee.lastname?.[0] ?? "");

    return {
      initials: initialsValue.toUpperCase(),
      primaryNameLine: primary,
      secondaryNameLine: secondary,
      companyName:
        employee.department?.enterprice_name ?? employee.department?.name ?? "Unknown company",
      position: employee.workposition?.name ?? "Role not assigned",
      employeeNumber: employee.employee_number || "No employee number",
      phoneNumber: formatPhoneNumber(employee.phone_number),
      email: employee.email || "No email",
      departmentName: employee.department?.name ?? "Sin departamento",
    };
  }, [employee]);

  const hasEmployee = Boolean(employee);
  const userId = employee?.user?.user_id ?? null;
  const currentStatus = employee?.user?.is_active ?? employee?.is_active ?? false;
  const statusType = currentStatus ? "valido" : "prohibido";
  const statusText = currentStatus ? "Activo" : "Inactivo";
  const actionLabel = currentStatus ? "Desactivar usuario" : "Activar usuario";
  const displayName = [computed.primaryNameLine, computed.secondaryNameLine].filter(Boolean).join(" ");

  const closeConfirmToggle = useCallback(() => setConfirmToggleOpen(false), []);
  const openConfirmToggle = useCallback(() => setConfirmToggleOpen(true), []);

  const handleConfirmToggle = useCallback(() => {
    if (!userId) return;
    const nextStatus = !currentStatus;
    pendingStatusRef.current = nextStatus;
    closeConfirmToggle();
    toggleUserActive({ id: userId, isActive: nextStatus });
  }, [closeConfirmToggle, currentStatus, toggleUserActive, userId]);

  useEffect(() => {
    if (pendingStatusRef.current === null) return;

    if (togglingActive) {
      showSpinner({
        message: pendingStatusRef.current ? "Activando usuario" : "Desactivando usuario",
      });
      return;
    }

    hideSpinner();

    if (successToggleActive) {
      const updatedStatus = pendingStatusRef.current;
      pendingStatusRef.current = null;

      if (employee) {
        setCurrentEmployee({
          ...employee,
          is_active: updatedStatus,
          user: employee.user
            ? { ...employee.user, is_active: updatedStatus }
            : employee.user,
        });
      }
      void forceFetchEmployees?.();

      showAlert({
        type: "success",
        title: updatedStatus ? "Usuario activado" : "Usuario desactivado",
        description: updatedStatus
          ? "El usuario se activo correctamente."
          : "El usuario se desactivo correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1400,
      });
      resetUserFlags();
    } else if (userStoreError) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description:
          typeof userStoreError === "string"
            ? userStoreError
            : "No fue posible actualizar el estado del usuario.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1600,
      });
      pendingStatusRef.current = null;
      resetUserFlags();
    }
  }, [
    employee,
    forceFetchEmployees,
    hideSpinner,
    resetUserFlags,
    setCurrentEmployee,
    showAlert,
    showSpinner,
    successToggleActive,
    togglingActive,
    userStoreError,
  ]);

  return {
    employee,
    hasEmployee,
    initials: computed.initials,
    primaryNameLine: computed.primaryNameLine,
    secondaryNameLine: computed.secondaryNameLine,
    companyName: computed.companyName,
    position: computed.position,
    employeeNumber: computed.employeeNumber,
    phoneNumber: computed.phoneNumber,
    email: computed.email,
    departmentName: computed.departmentName,
    confirmToggleOpen,
    currentStatus,
    statusType,
    statusText,
    actionLabel,
    displayName,
    userId,
    openConfirmToggle,
    closeConfirmToggle,
    handleConfirmToggle,
  };
};

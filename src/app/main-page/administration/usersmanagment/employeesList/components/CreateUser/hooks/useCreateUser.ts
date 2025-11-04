import { useCallback, useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useUsersStore } from "@/app/stores/useUsersStore/useUsersStore";

const FORM_ID = "create-user-form";

const EMPTY_FIELDS: FieldModel[] = [];

const useCreateUser = () => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const employee = useEmployeesStore((state) => state.employee);

  const {
    roles,
    fetchRoles,
    loadingRoles,
    successGetRoles,
    createUser,
    creating,
    successPost,
    error,
    resetFlags,
  } = useUsersStore(
    (state) => ({
      roles: state.roles,
      fetchRoles: state.fetchRoles,
      loadingRoles: state.loadingRoles,
      successGetRoles: state.successGetRoles,
      createUser: state.createUser,
      creating: state.creating,
      successPost: state.successPost,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow
  );

  const fields =
    useFormFieldsStore(
      (state) => state.fieldsByFormId[FORM_ID] ?? EMPTY_FIELDS) ?? EMPTY_FIELDS;
  const formVersion = useFormFieldsStore(
    (state) => state.formVersionsByFormId?.[FORM_ID] ?? 0
  );
  const setFields = useFormFieldsStore((state) => state.setFields);
  const updateField = useFormFieldsStore((state) => state.updateField);
  const resetFields = useFormFieldsStore((state) => state.resetFields);

  const [formValid, setFormValid] = useState(false);

  const hasEmployee = Boolean(employee);
  const hasRoleOptions = roles.length > 0;

  const rolesRequestedRef = useRef(false);

  useEffect(() => {
    if (rolesRequestedRef.current) return;

    if (roles.length > 0) {
      rolesRequestedRef.current = true;
      return;
    }

    if (!loadingRoles && !successGetRoles) {
      rolesRequestedRef.current = true;
      fetchRoles();
    }
  }, [roles.length, loadingRoles, successGetRoles, fetchRoles]);

  useEffect(() => () => resetFields(FORM_ID), [resetFields]);

  const employeeId = employee?.employee_id ?? "";
  const employeeEmail = employee?.email ?? "";

  useEffect(() => {
    if (!employeeId) {
      resetFields(FORM_ID);
      setFormValid(false);
      return;
    }

    const baseFields: FieldModel[] = [
      {
        type: "input",
        name: "username",
        label: "Correo del usuario",
        placeholder: "correo@empresa.com",
        value: employeeEmail,
        validations: [
          { type: "required" },
          { type: "email" },
        ],
      },
      {
        type: "password",
        name: "password",
        label: "Contrasena temporal",
        placeholder: "Ingresa una contrasena temporal",
        value: "",
        validations: [
          { type: "required" },
          { type: "minLength", value: 8 },
        ],
      },
      {
        type: "select",
        name: "roleId",
        label: "Rol",
        value: "",
        placeholder:"Seleecione un rol",
        validations: [{ type: "required" }],
      },
      {
        type: "toggle",
        name: "twoFactorEnabled",
        label: "Habilitar doble factor de autenticacion",
        value: false,
      },
      {
        type: "toggle",
        name: "changePassword",
        label: "Solicitar cambio de contrasena en el primer acceso",
        value: true,
      },
    ];

    setFields(FORM_ID, baseFields);
    setFormValid(false);
  }, [employeeId, employeeEmail, setFields, resetFields]);

  useEffect(() => {
    const nextOptions = roles.map((role) => ({
      label: role.name,
      value: role.id,
    }))
    updateField(FORM_ID, "roleId", {
      options: nextOptions,
    });
  }, [roles]);

  const resetFormValues = useCallback(() => {
    updateField(FORM_ID, "password", { value: "" });
    updateField(FORM_ID, "twoFactorEnabled", { value: false });
    updateField(FORM_ID, "changePassword", { value: true });
    updateField(FORM_ID, "roleId", { value: "" });
    if (employeeEmail) {
      updateField(FORM_ID, "username", { value: employeeEmail });
    }
    setFormValid(false);
  }, [employeeEmail, updateField]);

  useEffect(() => {
    if (creating) {
      showSpinner({ message: "Creando usuario" });
      return;
    }

    hideSpinner();

    if (error) {
      showAlert({
        type: "error",
        title: "Ocurrio un error",
        description: error,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      });
      resetFlags();
    }

    if (successPost) {
      showAlert({
        type: "success",
        title: "Usuario creado",
        description: "El usuario se genero correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1200,
      });
      resetFormValues();
      resetFlags();
    }
  }, [
    creating,
    error,
    successPost,
    showAlert,
    showSpinner,
    hideSpinner,
    resetFlags,
    resetFormValues,
  ]);

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      if (!employee) {
        showAlert({
          type: "warning",
          title: "Selecciona un empleado",
          description:
            "Debes elegir un empleado para poder crear su usuario de acceso.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1600,
        });
        return;
      }

      const payload = {
        username: String(values.username ?? "").trim(),
        password: String(values.password ?? ""),
        roleId: String(values.roleId ?? ""),
        employeeId: employee.employee_id,
        twoFactorEnabled: Boolean(values.twoFactorEnabled),
        changePassword: Boolean(values.changePassword),
      };

      await createUser(payload);
    },
    [employee, createUser, showAlert]
  );

  const handleValidChange = useCallback((valid: boolean) => {
    setFormValid(valid);
  }, []);

  return {
    fields,
    formVersion,
    loadingForm: loadingRoles || (hasEmployee && fields.length === 0),
    loadingSubmit: creating,
    handleSubmit,
    handleValidChange,
    formValid,
    canSubmit: hasEmployee && hasRoleOptions,
    hasEmployee,
  };
};

export default useCreateUser;

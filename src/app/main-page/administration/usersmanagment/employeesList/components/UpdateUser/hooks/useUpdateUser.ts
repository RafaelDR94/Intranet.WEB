import { useCallback, useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useUsersStore } from "@/app/stores/useUsersStore/useUsersStore";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

const FORM_ID = "update-user-form";


const EMPTY_FIELDS: FieldModel[] = [];

const useUpdateUser = () => {
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const employee = useEmployeesStore((state) => state.employee);
  const user = employee?.user ?? null;
  const employeeId = user?.user_id ?? "";
  const employeeEmail = user?.username ?? employee?.email ?? "";
  const employeeSignature = user?.signature ?? null;
  const userRoleId = user?.role?.id ?? user?.role_id ?? "";

  const {
    roles,
    fetchRoles,
    loadingRoles,
    successGetRoles,
    updateUser,
    updating,
    successPut,
    error,
    resetFlags,
  } = useUsersStore(
    (state) => ({
      roles: state.roles,
      fetchRoles: state.fetchRoles,
      loadingRoles: state.loadingRoles,
      successGetRoles: state.successGetRoles,
      updateUser: state.updateUser,
      updating: state.updating,
      successPut: state.successPut,
      error: state.error,
      resetFlags: state.resetFlags,
    }),
    shallow
  );

  const {
    changePassword: changeAuthPassword,
    resetFlags: resetAuthFlags,
  } = useAuthStore(
    (state) => ({
      changePassword: state.changePassword,
      resetFlags: state.resetFlags,
    }),
    shallow
  );

  const fields =
    useFormFieldsStore(
      (state) => state.fieldsByFormId[FORM_ID] ?? EMPTY_FIELDS,
    ) ?? EMPTY_FIELDS;
  const formVersion = useFormFieldsStore(
    (state) => state.formVersionsByFormId?.[FORM_ID] ?? 0
  );
  const setFields = useFormFieldsStore((state) => state.setFields);
  const updateField = useFormFieldsStore((state) => state.updateField);
  const resetFields = useFormFieldsStore((state) => state.resetFields);

  const [formValid, setFormValid] = useState(false);
  const rolesRequestedRef = useRef(false);

  const buildBaseFields = useCallback((): FieldModel[] => {
    if (!user) return [];

    return [
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
        type: "select",
        name: "roleId",
        label: "Rol",
        placeholder: "Seleecione un rol",
        value: userRoleId ?? "",
        options: [],
        validations: [{ type: "required" }],
      },
      {
        type: "toggle",
        name: "twoFactorEnabled",
        label: "Habilitar doble factor de autenticacion",
        value: Boolean(user.two_factor_enabled),
      },
      {
        type: "toggle",
        name: "changePassword",
        label: "Solicitar cambio de contrasena en el siguiente acceso",
        value: Boolean(user.change_password),
      },
      {
        type: "checkbox",
        name: "shouldUpdatePassword",
        label: "Cambiar contraseña ahora",
        value: false,
      },
      {
        type: "password",
        name: "newPassword",
        label: "Ingresa nueva contrasena",
        placeholder: "Ingresa la nueva contrasena",
        value: "",
        validations: [{ type: "minLength", value: 8 }],
        showIf: (values) => Boolean(values.shouldUpdatePassword),
      },
    ];
  }, [user, employeeEmail, userRoleId]);

  useEffect(
    () => () => {
      resetFields(FORM_ID);
      rolesRequestedRef.current = false;
      setFormValid(false);
    },
    [resetFields]
  );

  useEffect(() => {
    if (!user) {
      resetFields(FORM_ID);
      setFormValid(false);
      return;
    }

    const baseFields = buildBaseFields();
    if (baseFields.length > 0) {
      setFields(FORM_ID, baseFields);
      setFormValid(false);
    }
  }, [user, buildBaseFields, setFields, resetFields]);

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

  useEffect(() => {

    if (roles.length > 0) {
      const nextOptions = roles.map((role) => ({
        label: role.name,
        value: role.id,
      }))
      updateField(FORM_ID, "roleId", {
        options: nextOptions,
        value: userRoleId,
      });
    }
  }, [roles, updateField]);

  useEffect(() => {
    if (updating) {
      showSpinner({ message: "Actualizando usuario" });
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
        autoCloseMs: 1400,
      });
      resetFlags();
    }

    if (successPut) {
      showAlert({
        type: "success",
        title: "Usuario actualizado",
        description: "Los datos del usuario se actualizaron correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1400,
      });
      if (user) {
        setFields(FORM_ID, buildBaseFields());
      }
      setFormValid(false);
      resetFlags();
    }
  }, [
    updating,
    error,
    successPut,
    showSpinner,
    hideSpinner,
    showAlert,
    resetFlags,
    buildBaseFields,
    user,
    setFields,
  ]);

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      if (!user || !employeeId) {
        showAlert({
          type: "warning",
          title: "Selecciona un usuario",
          description:
            "Debes elegir un empleado con usuario activo para actualizarlo.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1600,
        });
        return;
      }

      const username = String(values.username ?? "").trim();
      const roleId = String(values.roleId ?? "").trim();

      if (!roleId) {
        showAlert({
          type: "warning",
          title: "Rol requerido",
          description: "Selecciona un rol para el usuario.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 1200,
        });
        return;
      }

      if (values.shouldUpdatePassword) {
        const newPassword = String(values.newPassword ?? "").trim();
        if (newPassword.length < 8) {
          showAlert({
            type: "warning",
            title: "Contraseña inválida",
            description:
              "La contraseña debe contener al menos 8 caracteres.",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 1500,
          });
          return;
        }

        showSpinner({ message: "Actualizando contraseña" });
        await changeAuthPassword({
          email: username,
          newPassword,
          changePassword: Boolean(values.changePassword),
        });
        hideSpinner();

        const authState = useAuthStore.getState();
        if (!authState.successChangePassword) {
          showAlert({
            type: "error",
            title: "Error al actualizar contraseña",
            description:
              authState.error ??
              "No se pudo actualizar la contraseña. Intenta nuevamente.",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 1600,
          });
          resetAuthFlags();
          return;
        }
        resetAuthFlags();
      }

      await updateUser({
        userId: employeeId,
        username,
        roleId,
        signature: employeeSignature,
        twoFactorEnabled: Boolean(values.twoFactorEnabled),
        changePassword: Boolean(values.changePassword),
      });
    },
    [
      user,
      employeeId,
      employeeSignature,
      showAlert,
      showSpinner,
      hideSpinner,
      changeAuthPassword,
      resetAuthFlags,
      updateUser,
    ]
  );

  const handleValidChange = useCallback((valid: boolean) => {
    setFormValid(valid);
  }, []);

  const loadingForm =
    loadingRoles ||
    (!!user && (fields.length === 0 || !successGetRoles && !roles.length));

  return {
    fields,
    formVersion,
    loadingForm,
    loadingSubmit: updating,
    handleSubmit,
    handleValidChange,
    formValid,
    canSubmit: Boolean(user),
    hasUser: Boolean(user),
  };
};

export default useUpdateUser;

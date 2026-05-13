"use client"

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import type { User } from "@/app/context/AuthContext/types";
import React from "react";

import useCreateEemployee from "./hooks/useCreatEmployee";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

export type CreateEmployeeProps = {
  /**
   * Usuario autenticado que se utilizará para autocompletar el formulario.
   * Cuando se proporciona, los campos quedarán deshabilitados.
   */
  loggedUser?: User | null;
  onConfigurations?: boolean;
  onSuccess?: () => void;
  /**
   * Cuando es `false`, evita la redirección automática al finalizar.
   */
  redirectOnSuccess?: boolean;
  /**
   * Variante visual para reutilizar el formulario en panel lateral.
   */
  variant?: "default" | "panel";
};

const CreateEmployee: React.FC<CreateEmployeeProps> = ({
  loggedUser,
  onConfigurations,
  onSuccess,
  redirectOnSuccess = true,
  variant = "default",
}) => {
  useTutorialAutoRun({
    moduleId: "administration-createemployee",
    tutorialId: "administration-createemployee:form",
  });

  const {
    loadingForm,
    fields,
    formVersion,
    submitRef,
    canStart,
    handleSubmit,
    handleValidChange,
    isReadOnly,
    isEditing,
    formCompleted,
  } = useCreateEemployee({
    loggedUser: loggedUser ?? undefined,
    onSuccess,
    redirectOnSuccess,
  });

  if (!canStart) {
    return null;
  }

  return (
    <div data-tour="createemployee-form">
    <FormsLayout
      title={isEditing ? "Actualiza la información del empleado" : "Registra aquí a un nuevo empleado"}
      primaryLabel={isEditing ? "Actualizar empleado" : "Registrar empleado"}
      enableCollapse={variant === "panel" ? false : !onConfigurations}
      showBackground={variant === "panel" ? false : true}
      showDivider={variant === "panel" ? false : true}
      showPrimaryButton={!onConfigurations}
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={isReadOnly || !formCompleted}
      primaryButtonDataTour="createemployee-submit"
    >
      {fields && (
        <DynamicForm
          responsiveLayoutMatrix={{
            sm: [
              [10],
              [10],
              [10],
              [10],
              [10],
              [10],
              [10],
              [10],
              [10],
              [10],
              [10],
            ],
            md: [
              [2.5, 2.5, 2.5, 2.5],
              [3.3, 3.3, 3.3],
              [3.33, 3.3, 3.3],
              [3.33, 3.3, 3.3],
              [3.33, 3.3, 3.3],
            ],
            lg: [
              [2.5, 2.5],
              [2.5, 2.5, 2.5, 2.5],
              [2.5, 2.5, 2.5, 2.5],
              [2.5, 2.5, 2.5, 2.5],
            ],
          }}
          onSubmit={handleSubmit}
          externalSubmitRef={submitRef}
          fields={fields}
          loadingFormInfo={loadingForm}
          onValidChange={handleValidChange}
          valuesVersion={formVersion}
          valuesVersionActive
        />
      )}
    </FormsLayout>
    </div>
  );
};

export default CreateEmployee;


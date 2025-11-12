"use client";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import type { User } from "@/app/context/AuthContext/types";
import React from "react";

import useCreateEemployee from "./hooks/useCreatEmployee";

export type CreateEmployeeProps = {
  /**
   * Usuario autenticado que se utilizará para autocompletar el formulario.
   * Cuando se proporciona, los campos quedarán deshabilitados.
   */
  loggedUser?: User | null;
  onConfigurations?: boolean;
};

const CreateEmployee: React.FC<CreateEmployeeProps> = ({
  loggedUser,
  onConfigurations,
}) => {
  const {
    loadingForm,
    fields,
    submitRef,
    canStart,
    handleSubmit,
    handleValidChange,
    formCompleted,
    isReadOnly,
  } = useCreateEemployee({ loggedUser: loggedUser ?? undefined });

  if (!canStart) {
    return null;
  }

  return (
    <FormsLayout
      title={onConfigurations ? "Ajustes de Usuario" : "Registro de empleado"}
      primaryLabel="Registrar empleado"
      enableCollapse={!onConfigurations}
      showPrimaryButton={!onConfigurations}
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={isReadOnly || !formCompleted}
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
        />
      )}
    </FormsLayout>
  );
};

export default CreateEmployee;


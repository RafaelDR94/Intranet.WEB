"use client";
import React from "react";
import type { User } from "@/app/context/AuthContext/types";
import useCreateEemployee from "./hooks/useCreatEmployee";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";

type CreateEmployeeProps = {
  /**
   * Usuario autenticado que se utilizará para autocompletar el formulario.
   * Cuando se proporciona, los campos quedarán deshabilitados.
   */
  loggedUser?: User | null;
  onConfigurations?: boolean;
};

const CreateEmployee: React.FC<CreateEmployeeProps> = ({ loggedUser, onConfigurations }) => {
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
  if (!canStart) return <></>;
  return (
    <FormsLayout
      title={onConfigurations ? "Ajustes de Usuario" : "Registro de empleado"}
      primaryLabel="Registrar empleado"
      enableCollapse={onConfigurations ? false : true}
      showPrimaryButton={onConfigurations ? false : true}
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
              [10],
              [2.5, 2.5, 2.5, 2.5],
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

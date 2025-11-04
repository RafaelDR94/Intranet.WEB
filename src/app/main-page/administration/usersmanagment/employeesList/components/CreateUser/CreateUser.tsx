import React from "react";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import useCreateUser from "./hooks/useCreateUser";

const CreateUser = () => {
  const {
    fields,
    formVersion,
    loadingForm,
    loadingSubmit,
    handleSubmit,
    handleValidChange,
    formValid,
    canSubmit,
    hasEmployee,
  } = useCreateUser();

  if (!hasEmployee) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-30 bg-white-100 p-6 text-b2 text-gray-70">
        Selecciona un empleado para generar su usuario de acceso.
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 shadow-200">
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Crear usuario"
        loading={loadingSubmit}
        loadingFormInfo={loadingForm}
        valuesVersion={formVersion}
        onValidChange={handleValidChange}
        showSubmitIf={() => formValid && canSubmit}
        disabled={loadingSubmit}
        dataTestId="create-user-form"
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10]],
          md: [[10], [10], [10], [10], [10]],
          lg: [[10], [10], [10], [10], [10]],
        }}
      />
    </div>
  );
};

export default CreateUser;

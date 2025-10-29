import React from "react";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import useUpdateUser from "./hooks/useUpdateUser";

const UpdateUser = () => {
  const {
    fields,
    formVersion,
    loadingForm,
    loadingSubmit,
    handleSubmit,
    handleValidChange,
    formValid,
    canSubmit,
    hasUser,
  } = useUpdateUser();

  if (!hasUser) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-30 bg-white-100 p-6 text-b2 text-gray-70">
        Para actualizar un usuario selecciona un empleado con cuenta asignada.
      </div>
    );
  }

  return (
    <div className="rounded-2xl ">
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Actualizar usuario"
        loading={loadingSubmit}
        loadingFormInfo={loadingForm}
        valuesVersion={formVersion}
        onValidChange={handleValidChange}
        showSubmitIf={() => formValid && canSubmit}
        disabled={loadingSubmit}
        dataTestId="update-user-form"
        responsiveLayoutMatrix={{
          sm: [[10], [10], [10], [10], [10], [10]],
          md: [[10], [10], [10], [10], [10], [10]],
          lg: [[10], [10], [10], [10], [10], [10]],
        }}
      />
    </div>
  );
};

export default UpdateUser;

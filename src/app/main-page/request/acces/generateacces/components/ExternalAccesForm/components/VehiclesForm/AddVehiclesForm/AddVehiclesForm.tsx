import DynamicForm from "@/app/components/DynamicForm/DynamicForm";

import useAddVehiclesForm from "./hooks/useAddVehiclesForm";
import type { AddVehicleFormProps } from "./types";

const AddVehiclesForm: React.FC<AddVehicleFormProps> = ({
  formId,
  currentTransport,
  onCancel,
  canUpdateForm,
}) => {
  const { fields, handleSubmit, canStart } = useAddVehiclesForm({
    formId,
    currentTransport,
  });

  if (!canStart) return null;

  return (
    <DynamicForm
      responsiveLayoutMatrix={{
        sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10]],
        md: [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10]],
        lg: [
          [3.3, 3.3, 3.3],
          [2.5, 2.5, 2.5, 2.5],
          [3.3, 3.3, 3.3],
          [3.3, 3.3],
          [3.3, 3.3, 3.3],
          [3.3, 3.3],
        ],
      }}
      onSubmit={handleSubmit}
      fields={fields}
      submitLabel={currentTransport ? "Actualizar información" : "Registrar vehículo"}
      showSecondaryButtonIf={() => !!onCancel}
      secondaryButtonLabel="Cancelar"
      showSubmitIf={() => !!canUpdateForm}
      onSecondaryButtonClick={onCancel ?? (() => { })}
      disabled={!canUpdateForm}
    />
  );
};

export default AddVehiclesForm;


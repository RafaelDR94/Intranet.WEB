"use client";

import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";

import useVehicleReassignmentTrackingForm from "./hooks/useVehicleReassignmentTrackingForm";

export type VehicleReassignmentTrackingFormProps = {
  assignmentId: string;
  reassignmentId: string;
  signature: string; // base64
  onClose: () => void;
};

const VehicleReassignmentTrackingForm: React.FC<VehicleReassignmentTrackingFormProps> = ({
  assignmentId,
  reassignmentId,
  signature,
  onClose,
}) => {
  const {
    fields,
    formVersion,
    formReady,
    setFormReady,
    submitting,
    handleSubmit,
    syncFormValues,
    submitRef,
    responsiveLayoutMatrix,
  } = useVehicleReassignmentTrackingForm({
    assignmentId,
    reassignmentId,
    signature,
    onClose,
  });

  return (
    <div className="w-full">
      <FormsLayout
        title="Préstamo vehicular"
        onPrimaryClick={() => submitRef.current?.()}
        primaryLabel="Guardar información"
        primaryDisabled={!formReady || submitting}
      >
        <div className="flex flex-col gap-8 w-full">
          <DynamicForm
            responsiveLayoutMatrix={responsiveLayoutMatrix}
            onValidChange={setFormReady}
            fields={fields}
            onSubmit={handleSubmit}
          externalSubmitRef={submitRef}
          onValuesChange={syncFormValues}
          valuesVersion={formVersion}
          valuesVersionActive={true}
          />
        </div>
      </FormsLayout>
    </div>
  );
};

export default VehicleReassignmentTrackingForm;

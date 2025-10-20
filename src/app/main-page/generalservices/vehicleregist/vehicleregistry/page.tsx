'use client';

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import useVehicleRegistry from "./hooks/useVehicleRegistry";
import { Button } from "@/app/components/Button/Button";
import ImagesComponent from "./componentes/ImagesComponent/ImagesComponent";

const VehicleRegistry = () => {
  const {
    title,
    submitLabel,
    submitRef,
    formReady,
    formIsCompleted,
    setFormReady,
    fields,
    formVersion,
    syncFormValues,
    formId,
    responsiveLayoutMatrix,
    handleSubmit,
    currentView,
    handleNext,
    handleBack,
  } = useVehicleRegistry();

  return (
    <FormsLayout
      title={title}
      onPrimaryClick={() => submitRef.current?.()}
      primaryLabel={submitLabel}
      primaryDisabled={!formIsCompleted}
    >
      <div className="flex flex-col gap-6 w-full ">
        {currentView === "form" &&
          <DynamicForm
            responsiveLayoutMatrix={responsiveLayoutMatrix}
            onValidChange={setFormReady}
            fields={fields}
            onSubmit={handleSubmit}
            externalSubmitRef={submitRef}
            onValuesChange={syncFormValues}
            valuesVersion={formVersion}
          />
        }
        {currentView === "pictures" &&
          <ImagesComponent formId={formId} />
        }
        <Button
          className="ml-auto"
          onClick={() => {
            if (currentView === "form") handleNext(); else handleBack();
          }}
          hideIcon
          disabled={currentView === "form" && !formReady}
        >
          {currentView === "form" ? "Siguiente: Cargar Fotos" : "Volver al Formulario"}
        </Button>
      </div>

    </FormsLayout >
  );
};

export default VehicleRegistry;


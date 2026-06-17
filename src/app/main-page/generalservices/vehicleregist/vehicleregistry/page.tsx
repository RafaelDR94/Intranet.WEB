"use client"
'use client';

/**
 * Pagina principal para registrar entradas o salidas vehiculares con formulario y evidencias fotograficas.
 */

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import useVehicleRegistry from "./hooks/useVehicleRegistry";
import { Button } from "@/app/components/Button/Button";
import ImagesComponent from "./componentes/ImagesComponent/ImagesComponent";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

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

  useTutorialAutoRun({
    moduleId: "generalservices-vehicleregistry",
    tutorialId: "generalservices-vehicleregistry:form",
  });

  return (
    <div data-tour="vehicleregistry-form">
    <FormsLayout
      title={title}
      onPrimaryClick={() => submitRef.current?.()}
      primaryLabel={submitLabel}
      primaryDisabled={!formIsCompleted}
      primaryButtonDataTour="vehicleregistry-submit"
    >
      <div className="flex flex-col gap-6 w-full ">
        {currentView === "form" &&
          <DynamicForm data-tour="vehicleregistry-form-fields"
            responsiveLayoutMatrix={responsiveLayoutMatrix}
            onValidChange={setFormReady}
            fields={fields}
            onSubmit={handleSubmit}
            externalSubmitRef={submitRef}
            onValuesChange={syncFormValues}
            valuesVersion={formVersion}
            valuesVersionActive={true}
          />
        }
        {currentView === "pictures" &&
          <div data-tour="vehicleregistry-photos"><ImagesComponent formId={formId} /></div>
        }
        <Button
          className="ml-auto"
          onClick={() => {
            if (currentView === "form") handleNext(); else handleBack();
          }}
          hideIcon
          variant="outline"
          disabled={currentView === "form" && !formReady}
          data-tour="vehicleregistry-next"
        >
          {currentView === "form" ? "Siguiente: Cargar Fotos" : "Regresar"}
        </Button>
      </div>

    </FormsLayout >
    </div>
  );
};

export default VehicleRegistry;


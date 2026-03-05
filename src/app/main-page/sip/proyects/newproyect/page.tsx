"use client"

import { useState } from "react";

import useNewProyect from "./hooks/useNewProyect";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { PopUp } from "@/app/components/PopUp/PopUp";


const NewProyectPage = () => {
  const { responsiveLayout, submitRef, formReady, setFormReady, fields, handleSubmit, loadingFormInfo, creating } = useNewProyect();
  useTutorialAutoRun({
    moduleId: "sip-newproyect",
    tutorialId: "sip-newproyect:form",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div data-tour="sip-newproyect-form">
    <FormsLayout
      title="Registra aquí un nuevo proyecto"
      primaryLabel="Registrar Proyecto"
      onPrimaryClick={() => setConfirmOpen(true)}
      primaryDisabled={!formReady}
      primaryButtonDataTour="sip-newproyect-submit"
    >
      <>
        <div className="w-full">
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            externalSubmitRef={submitRef}
            showSubmitIf={() => false}
            loadingFormInfo={loadingFormInfo}
            loading={creating}
            onValidChange={(valid) => setFormReady(valid)}
            responsiveLayoutMatrix={responsiveLayout}
            dataTestId="new-proyect-form"
          />
        </div>

        <PopUp
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Confirmación Nuevo Proyecto"
          content={"Se creará el nuevo proyecto. ¿Deseas continuar?"}
          showSecondaryButton
          secondaryButtonText="Cancelar"
          showPrimaryButton
          primaryButtonText="Continuar"
          onPrimaryButtonClick={() => { setConfirmOpen(false); submitRef.current?.(); }}
        />
      </>
    </FormsLayout>
    </div>
  );
};

export default NewProyectPage;


"use client";

import { useState } from "react";

import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { Input } from "@/app/components/Input/Input";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Spinner } from "@/app/components/Spinner/Spinner";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

import CollaboratorsSection from "./components/CollaboratorsSection";
import useNewProyect from "./hooks/useNewProyect";

const NewProyectPage = () => {
  const state = useNewProyect();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  const [newLocationLink, setNewLocationLink] = useState("");
  const formTitle = state.isEditing ? "Actualiza aqui un proyecto" : "Registra aqui un nuevo proyecto";
  const primaryLabel = state.isEditing ? "Actualizar Proyecto" : "Registrar Proyecto";
  const confirmTitle = state.isEditing
    ? "Confirmacion de actualizacion de proyecto"
    : "Confirmacion Nuevo Proyecto";
  const confirmContent = state.isEditing
    ? "Se actualizara el nuevo proyecto. ¿Deseas continuar?"
    : "Se creara el nuevo proyecto. ¿Deseas continuar?";

  const resetLocationModal = () => {
    setNewLocationName("");
    setNewLocationAddress("");
    setNewLocationLink("");
    setLocationModalOpen(false);
  };

  useTutorialAutoRun({
    moduleId: "proyects-newproyect",
    tutorialId: "proyects-newproyect:form",
  });

  return (
    <div data-tour="proyects-newproyect-form">
      <FormsLayout
        title={formTitle}
        primaryLabel={primaryLabel}
        onPrimaryClick={() => setConfirmOpen(true)}
        primaryDisabled={!state.formReady || state.creating || state.loadingFormInfo}
        primaryButtonDataTour="proyects-newproyect-submit"
        enableCollapse={false}
        showDivider={false}
      >
        <div className="w-full">
          {state.loadingFormInfo ? (
            <div className="flex min-h-40 items-center justify-center">
              <Spinner size="large" dataTestId="new-proyect-form-spinner" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                label="Cliente*"
                placeholder="Cliente"
                value={state.client}
                onChange={(event) => state.setClient(event.target.value)}
              />
              <Input
                label="Nombre del Proyecto*"
                placeholder="Nombre del Proyecto"
                value={state.name}
                onChange={(event) => state.setName(event.target.value)}
              />
              <Input
                label="Llave del Proyecto*"
                placeholder="Llave del Proyecto"
                value={state.proyectKey}
                onChange={(event) => state.setProyectKey(event.target.value)}
              />

              {/* <div className="md:col-span-3 mt-2 text-b4 text-blue-60">Ubicación</div> */}

              {/* <div className="md:col-span-1 grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
                <Select
                  label="Seleccionar ubicacion del proyecto"
                  placeholder="Selecciona la opcion adecuada"
                  selected={state.locationId ? [state.locationId] : []}
                  onChange={(selected) => state.setLocationId(selected[0] ?? "")}
                  options={state.locationOptions}
                />
              </div> */}

              {/* <div className="md:col-span-2 flex flex-col items-end md:justify-end">
                <div className="text-b3 text-gray-500 md:mb-1">Si no encuentras la ubicacion requerida</div>
                <Button
                  hideIcon
                  onClick={() => setLocationModalOpen(true)}
                >
                  Registrar nueva Ubicacion
                </Button>
              </div> */}
            </div>
          )}
        </div>

        <CollaboratorsSection
          pendingCollaboratorId={state.pendingCollaboratorId}
          collaboratorOptions={state.collaboratorOptions}
          collaboratorRows={state.collaboratorRows}
          setPendingCollaboratorId={state.setPendingCollaboratorId}
          addCollaborator={state.addCollaborator}
          removeCollaborator={state.removeCollaborator}
        />
      </FormsLayout>

      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmTitle}
        content={confirmContent}
        showSecondaryButton
        secondaryButtonText="Cancelar"
        showPrimaryButton
        primaryButtonText="Continuar"
        onPrimaryButtonClick={async () => {
          setConfirmOpen(false);
          await state.submit();
        }}
      />

      <PopUp
        open={locationModalOpen}
        onClose={resetLocationModal}
        title="Registrar Nueva Dirección"
        content="Escribe los datos de la ubicación que deseas registrar"
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={resetLocationModal}
        showPrimaryButton
        primaryButtonText="Aceptar"
        onPrimaryButtonClick={async () => {
          const success = await state.registerLocation({
            name: newLocationName,
            address: newLocationAddress,
            linkmaps: newLocationLink,
          });
          if (success) resetLocationModal();
        }}
      >
        <div className="mt-1 flex w-full flex-col gap-4">
          <Input
            placeholder="Nombre de la Ubicación"
            value={newLocationName}
            onChange={(event) => setNewLocationName(event.target.value)}
          />
          <Input
            placeholder="Dirección"
            value={newLocationAddress}
            onChange={(event) => setNewLocationAddress(event.target.value)}
          />
          <Input
            placeholder="Enlace de la ubicación de Maps"
            value={newLocationLink}
            onChange={(event) => setNewLocationLink(event.target.value)}
            className="mb-4"
          />
        </div>
      </PopUp>
    </div>
  );
};

export default NewProyectPage;

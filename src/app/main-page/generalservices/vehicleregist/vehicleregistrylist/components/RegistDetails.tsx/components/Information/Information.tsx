import React from "react";

import CheckBoxList from "@/app/components/CheckBoxList/CheckBoxList";
import InfoCards from "@/app/components/InfoCards/InfoCards";
import Label from "@/app/components/Label/Label";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import { Button } from "@/app/components/Button/Button";

import ChevronRight from "@/assets/icons/navegacion/nav-arrow-right.svg";
import ArrowSeparateVertical from "@/assets/icons/Connectivity/data-transfer-both.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import MediaImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";

import useInformationViewModel, {
  buildChecklistTitle,
  formatDate,
  isAcceptedOrApproved,
  toLabelType,
} from "./hooks/useInformationViewModel";

const Information: React.FC = () => {
  const {
    assignment,
    checklistDefinitions,
    active,
    setActive,
    sections,
    departureIso,
    arrivalIso,
    infoCards,
    layoutMatrix,
    historyRows,
    driverName,
    hasPendingReassignment,
    isDriver,
    changeDriverOpen,
    openChangeDriverPopUp,
    closeChangeDriverPopUp,
    changeDriverOptions,
    changeDriverSelected,
    setChangeDriverSelected,
    canChangeDriver,
    changingDriver,
    handleChangeDriver,
    downloadResponsiveForReassignment,
    openEvidenceCarousel,
  } = useInformationViewModel();

  if (!assignment) {
    return (
      <div className="w-full text-center text-gray-70 text-b3">
        Selecciona un registro para ver la información.
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="text-blue-60 text-label font-semibold">
          Fecha Salida: {formatDate(departureIso)}
        </div>
        <div className="text-blue-60 text-label font-semibold">
          Fecha Llegada: {arrivalIso ? formatDate(arrivalIso) : "--"}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-blue-60 text-label font-semibold">
          Conductor: {driverName || "--"}
        </div>
        <Button
          variant="ghost"
          size="small"
          icon={ArrowSeparateVertical}
          hideIcon={false}
          onClick={openChangeDriverPopUp}
          disabled={hasPendingReassignment || !isDriver}
          dataTestId="change-driver-open"
        >
          Hacer cambio de conductor
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className={
            active === "info"
              ? "text-green-100 text-s1 font-semibold"
              : "text-gray-60 text-s1 font-semibold"
          }
          onClick={() => setActive("info")}
        >
          Información
        </button>
        <ChevronRight className="h-5 w-5 text-gray-60" />
        <button
          type="button"
          className={
            active === "history"
              ? "text-green-100 text-s1 font-semibold"
              : "text-gray-60 text-s1 font-semibold"
          }
          onClick={() => setActive("history")}
        >
          Historial
        </button>
      </div>

      {active === "info" ? (
        <div className="space-y-6">
          <InfoCards
            cards={infoCards}
            layoutMatrix={layoutMatrix}
            dataTestId="vehicleregistry-info-cards"
          />

          {sections.map((section) => (
            <div key={`${section.id}-checklists`} className="grid gap-6 md:grid-cols-2">
              <CheckBoxList
                title={buildChecklistTitle(
                  checklistDefinitions.tools.title,
                  sections.length > 1 ? section.label : undefined
                )}
                options={checklistDefinitions.tools.options.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                value={section.data.checklistValues.tools}
              />
              <CheckBoxList
                title={buildChecklistTitle(
                  checklistDefinitions.documents.title,
                  sections.length > 1 ? section.label : undefined
                )}
                options={checklistDefinitions.documents.options.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                value={section.data.checklistValues.documents}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full rounded-xl border border-gray-20 bg-white-100 shadow-sm p-6">
          {historyRows.length === 0 ? (
            <div className="text-gray-60 text-b4">Sin historial de cambios de conductor.</div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-[180px_1fr_150px] gap-4 pb-4 border-b border-gray-20">
                <div className="text-green-100 text-b3 font-semibold">FECHA</div>
                <div className="text-green-100 text-b3 font-semibold">CONDUCTOR</div>
                <div className="text-green-100 text-b3 font-semibold"></div>
              </div>
              <div className="divide-y divide-gray-20">
                {historyRows.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[180px_1fr_150px] gap-4 py-5 items-center"
                  >
                    <div className="text-gray-60 text-b3">{formatDate(item.date_created)}</div>
                    <div className="text-gray-90 text-b3 font-semibold">
                      {item.new_employee_name ?? "--"}
                    </div>
                    <div className="flex justify-end items-center gap-3">
                      {isAcceptedOrApproved(item.status) && (
                        <>
                          <button
                            type="button"
                            className="text-blue-100 hover:opacity-80"
                            aria-label="Descargar responsiva"
                            onClick={() => {
                              void downloadResponsiveForReassignment(item);
                            }}
                          >
                            <PDFIcon className="h-7 w-7" />
                          </button>
                          <button
                            type="button"
                            className="text-blue-100 hover:opacity-80"
                            aria-label="Ver evidencias"
                            onClick={() => {
                              openEvidenceCarousel(item);
                            }}
                          >
                            <MediaImageIcon className="h-7 w-7" />
                          </button>
                        </>
                      )}
                      <Label
                        type={toLabelType(item.status)}
                        text={item.status ?? "--"}
                        className="m-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <PopUp
        open={changeDriverOpen}
        onClose={closeChangeDriverPopUp}
        title="Cambio de conductor"
        content="Ingresa el nombre del colaborador que usar¡ ahora el vehí­culo"
        showSecondaryButton
        secondaryButtonText="Cancelar"
        showPrimaryButton
        primaryButtonText={changingDriver ? "Haciendo cambio..." : "Hacer cambio"}
        onPrimaryButtonClick={() => {
          void handleChangeDriver();
        }}
      >
        <div className="space-y-2">
          <Select
            label="Colaborador"
            placeholder="Selecciona el colaborador"
            options={changeDriverOptions}
            selected={changeDriverSelected}
            onChange={setChangeDriverSelected}
            className="w-full"
          />
          <p className="text-gray-60 text-b4">
            Tu compañero debe aceptar la invitación, una vez aceptado, el cambio estará
            hecho.
          </p>
          {!canChangeDriver && changeDriverSelected.length > 0 && (
            <p className="text-gray-60 text-b4">
              Selecciona un colaborador diferente al actual para continuar.
            </p>
          )}
        </div>
      </PopUp>
    </div>
  );
};

export default Information;


import React from 'react';

import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import { Select } from '@/app/components/Select/Select';
import useNewReport from './hooks/useNewReport';
import Advance from './components/Advance/Advance';
import Activities from './components/Activitys/Activities';
import Devices from './components/Devices/Devices';
import WorkMaps from './components/WorkMaps/WorkMaps';
import Refactions from './components/Refactions/Refactions';
import Signatures from './components/Signatures/Signatures';
import { Button } from '@/app/components/Button/Button';
import { StepId } from './types';
import WarningIcon from '@/assets/icons/acciones/warning-triangle.svg'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
import clsx from 'clsx';
const NewReport = () => {
  const {
    canStart,
    steps,
    typeOptions,
    selectedTypeId,
    onTypeChange,
    loadingTypes,
    onStepChange,
    currentStep,
    handleNext,
    submitRef,
    currentModelName,
    isAdvanceValid,
    handleCanSaveReport,
    isSaveValid,
    isBackValid,
    handleSaveReport,
    handleBack,
    report
  } = useNewReport();

  const selectedTypeValues = selectedTypeId ? [selectedTypeId] : [];
  const isMobile = useIsMobile();
  const renderStepContent = (id: (typeof steps)[number]['id'], label: string) => {
    if (id === 'avance') return <Advance submitRef={submitRef} currentModelName={currentModelName} onStepValidChange={handleCanSaveReport} />
    else if (id === 'actividades') return <Activities />
    else if (id === 'equipos') return <Devices />
    else if (id === 'mapas') return <WorkMaps />
    else if (id === 'refacciones') return <Refactions />
    else if (id === 'firma') return <Signatures  isSaveValid={isSaveValid}  />
    return (
      <div className="rounded-lg border border-gray-30 bg-white-70 p-6 text-gray-80">
        {label}
      </div>
    );
  };

  if (canStart) return (
    <FormsLayout title="Registra aqui un nuevo reporte" primaryLabel="Guardar Reporte" primaryDisabled={!isSaveValid} onPrimaryClick={handleSaveReport}>

      <div className="grid w-full gap-4 md:grid-cols-2">
        <Select
          
          label="Tipo de Reporte*"
          options={typeOptions}
          placeholder={loadingTypes ? 'Cargando tipos...' : 'Selecciona un tipo'}
          selected={selectedTypeValues}
          onChange={onTypeChange}
          disabled={loadingTypes||Boolean(report?.clientsign?.url)}
        />
      </div>

      <div className={clsx("flex w-full min-h-0 flex-col gap-4", !isMobile && "h-[60vh]")}>
        {(!isSaveValid && currentStep != "avance") && <div className="flex bg-white-70  text-blue-60 font-semibold text-label">
          <WarningIcon className="mr-5" />
          {"Para poder guardar tu reporte o pasarlo a firma del cliente, asegúrate de completar la sección de Avances. Así garantizamos un registro claro y completo de este."}
        </div>}


        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white-100 p-4">
          <Breadcrumbs activeId={currentStep} onActiveChange={(id) => onStepChange(id as StepId)}>
            {steps.map((step) => (
              <Breadcrumbs.Item
                key={step.id}
                id={step.id}
                label={step.label}
                renderContent={() => <div className={clsx("w-full overflow-y-auto pr-1", !isMobile && "h-[42vh]")}>{renderStepContent(step.id, step.label)}</div>}
              />
            ))}
          </Breadcrumbs>
        </div>

        <div className={clsx("shrink-0 pt-2", !isMobile && "flex justify-end gap-5", isMobile && "flex flex-col gap-6")}>
          <Button onClick={handleBack} disabled={!isBackValid} hideIcon variant='outline'>
            Regresar
          </Button>
          <Button onClick={handleNext} disabled={!isAdvanceValid} hideIcon >
            Siguiente
          </Button>

        </div>
      </div>
    </FormsLayout>
  );
};

export default NewReport;




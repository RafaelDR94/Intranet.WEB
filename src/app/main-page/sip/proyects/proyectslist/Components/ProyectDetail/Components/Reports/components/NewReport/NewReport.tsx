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
const NewReport = () => {
  const {
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
    onAdvanceValidChange
    
  } = useNewReport();

  const selectedTypeValues = selectedTypeId ? [selectedTypeId] : [];

  const renderStepContent = (id: (typeof steps)[number]['id'], label: string) => {
    if (id === 'avance') return <Advance submitRef={submitRef} currentModelName={currentModelName} onStepValidChange={onAdvanceValidChange} />
    else if (id === 'actividades') return <Activities />
    else if (id === 'equipos') return <Devices />
    else if (id === 'mapas') return <WorkMaps />
    else if (id === 'refacciones') return <Refactions />
    else if (id === 'firma') return <Signatures />
    return (
      <div className="rounded-lg border border-gray-30 bg-white-70 p-6 text-gray-80">
        {label}
      </div>
    );
  };

  return (
    <FormsLayout title="Registra aqui un nuevo reporte" primaryLabel="Finalizar Reporte">

      <div className="grid w-full gap-4 md:grid-cols-2">
        <Select
          label="Tipo de Reporte*"
          options={typeOptions}
          placeholder={loadingTypes ? 'Cargando tipos...' : 'Selecciona un tipo'}
          selected={selectedTypeValues}
          onChange={onTypeChange}
          disabled={loadingTypes}
        />
      </div>

      <div className="w-full ">


        <Breadcrumbs activeId={currentStep} onActiveChange={(id) => onStepChange(id as StepId)}>
          {steps.map((step) => (
            <Breadcrumbs.Item
              key={step.id}
              id={step.id}
              label={step.label}
              renderContent={() => renderStepContent(step.id, step.label)}
            />
          ))}
        </Breadcrumbs>

        <div className="flex justify-end">
          <Button onClick={handleNext} disabled={currentStep === 'avance' && !isAdvanceValid} hideIcon>
            Siguiente
          </Button>
        </div>
      </div>
    </FormsLayout>
  );
};

export default NewReport;




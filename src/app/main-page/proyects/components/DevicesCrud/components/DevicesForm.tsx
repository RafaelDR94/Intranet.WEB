'use client';

import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import { Input } from '@/app/components/Input/Input';
import { Select } from '@/app/components/Select/Select';
import { Spinner } from '@/app/components/Spinner/Spinner';

import { useDevicesForm } from '../hooks/useDevicesForm';
import type { CrudScope } from '../../types';

type DevicesFormProps = {
  scope: CrudScope;
};

const DevicesForm = ({ scope }: DevicesFormProps) => {
  const state = useDevicesForm(scope);
  const { values, showErrors, formType } = state;

  const requiredHelper = (value: string, label: string) =>
    showErrors && !String(value ?? '').trim() ? `${label} es obligatorio.` : undefined;

  const equipmentHelper =
    formType === 'complete'
      ? requiredHelper(values.equipmentId, 'Equipo') ??
        (state.equipmentOptions.length === 0 && !state.loadingFormInfo
          ? 'No hay equipos genéricos disponibles para seleccionar.'
          : undefined)
      : undefined;

  return (
    <FormsLayout
      title={state.title}
      primaryLabel={state.primaryLabel}
      onPrimaryClick={state.onSubmit}
      primaryDisabled={!state.canSubmit || state.submitting || state.loadingFormInfo}
      showSecondaryButton
      secondaryLabel="Cancelar"
      onSecondaryClick={state.onCancel}
    >
      <div className="w-full" data-testid="devices-crud-form">
        {state.loadingFormInfo ? (
          <div className="flex min-h-40 items-center justify-center">
            <Spinner size="large" dataTestId="devices-crud-form-spinner" />
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {formType === 'generic' ? (
              <>
                <Input
                  label="Equipo*"
                  placeholder="Captura el tipo de equipo"
                  value={values.typeOfEquipment}
                  onChange={(event) => state.onChange('typeOfEquipment', event.target.value)}
                  helperText={requiredHelper(values.typeOfEquipment, 'Equipo')}
                  dataTestId="devices-crud-form-typeOfEquipment"
                />
                <Input
                  label="Marca*"
                  placeholder="Captura la marca"
                  value={values.brand}
                  onChange={(event) => state.onChange('brand', event.target.value)}
                  helperText={requiredHelper(values.brand, 'Marca')}
                  dataTestId="devices-crud-form-brand"
                />
                <Input
                  label="Modelo*"
                  placeholder="Captura el modelo"
                  value={values.model}
                  onChange={(event) => state.onChange('model', event.target.value)}
                  helperText={requiredHelper(values.model, 'Modelo')}
                  dataTestId="devices-crud-form-model"
                />
              </>
            ) : (
              <>
                <Select
                  label="Equipo*"
                  placeholder="Selecciona un equipo"
                  selected={values.equipmentId ? [values.equipmentId] : []}
                  onChange={(selected) => state.onChange('equipmentId', selected[0] ?? '')}
                  options={state.equipmentOptions}
                  disabled={state.completeDisabled}
                  helperText={equipmentHelper}
                />
                <Input
                  label="Marca*"
                  placeholder="Se llena automáticamente"
                  value={values.brand}
                  disabled
                  helperText={requiredHelper(values.brand, 'Marca')}
                  dataTestId="devices-crud-form-brand"
                />
                <Input
                  label="Modelo*"
                  placeholder="Se llena automáticamente"
                  value={values.model}
                  disabled
                  helperText={requiredHelper(values.model, 'Modelo')}
                  dataTestId="devices-crud-form-model"
                />
                <Input
                  label="Serie*"
                  placeholder="Captura el número de serie"
                  value={values.serial}
                  onChange={(event) => state.onChange('serial', event.target.value)}
                  helperText={requiredHelper(values.serial, 'Serie')}
                  dataTestId="devices-crud-form-serial"
                />
                <Input
                  label="Ubicación*"
                  placeholder="Captura la ubicación"
                  value={values.location}
                  onChange={(event) => state.onChange('location', event.target.value)}
                  helperText={requiredHelper(values.location, 'Ubicación')}
                  dataTestId="devices-crud-form-location"
                />
                <div className="md:col-span-2">
                  <Input
                    as="textarea"
                    label="Descripción*"
                    placeholder="Describe el dispositivo"
                    value={values.description}
                    onChange={(event) => state.onChange('description', event.target.value)}
                    helperText={requiredHelper(values.description, 'Descripción')}
                    rows={4}
                    dataTestId="devices-crud-form-description"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </FormsLayout>
  );
};

export default DevicesForm;

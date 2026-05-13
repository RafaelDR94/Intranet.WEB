'use client';

import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import { Input } from '@/app/components/Input/Input';
import { Select } from '@/app/components/Select/Select';
import { Spinner } from '@/app/components/Spinner/Spinner';
import ToolsIcon from '@/assets/icons/tools/tools/tools.svg';

import { useDevicesForm } from '../hooks/useDevicesForm';
import type { CrudScope } from '../../types';
import { Button } from '@/app/components/Button/Button';

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
          ? 'No hay equipos genÃ©ricos disponibles para seleccionar.'
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
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
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
                <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <Select
                    label="Refacciones"
                    placeholder="Seleccionar refaccion"
                    multiple
                    selected={state.selectedDraftRefactionIds}
                    onChange={state.onSelectDraftRefactions}
                    options={state.refactionOptions}
                    maxPanelHeight={160}
                  />
                  <Button
                    variant="ghost"
                    icon={ToolsIcon}
                    onClick={state.onAssignDraftRefactions}
                  >
                    Agregar refacción
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Select
                  label="Equipo"
                  placeholder="Selecciona equipo"
                  selected={values.equipmentId ? [values.equipmentId] : []}
                  onChange={(selected) => state.onChange('equipmentId', selected[0] ?? '')}
                  options={state.equipmentOptions}
                  disabled={state.completeDisabled}
                  helperText={equipmentHelper}
                />
                <Input
                  label="Marca*"
                  placeholder="Marca del equipo"
                  value={values.brand}
                  disabled
                  helperText={requiredHelper(values.brand, 'Marca')}
                  dataTestId="devices-crud-form-brand"
                />
                <Input
                  label="Modelo*"
                  placeholder="Modelo del equipo"
                  value={values.model}
                  disabled
                  helperText={requiredHelper(values.model, 'Modelo')}
                  dataTestId="devices-crud-form-model"
                />
                <Input
                  label="Número de serie"
                  placeholder="Captura el número de serie"
                  value={values.serial}
                  onChange={(event) => state.onChange('serial', event.target.value)}
                  helperText={requiredHelper(values.serial, 'Número de serie')}
                  dataTestId="devices-crud-form-serial"
                />
                <Select
                  label="Ubicación"
                  placeholder="Selecciona ubicación"
                  selected={values.location ? [values.location] : []}
                  onChange={(selected) => state.onChange('location', selected[0] ?? '')}
                  options={state.locationOptions}
                  helperText={requiredHelper(values.location, 'Ubicación')}
                />
                <Select
                  label="Estatus"
                  placeholder="Selecciona estatus"
                  selected={values.status ? [values.status] : []}
                  onChange={(selected) => state.onChange('status', selected[0] ?? '')}
                  options={state.statusOptions}
                  helperText={requiredHelper(values.status, 'Estatus')}
                />
                <div className="md:col-span-3">
                  <Input
                    label="Caracterí­sticas adicionales"
                    placeholder="Describe caracterí­sticas adicionales"
                    value={values.description}
                    onChange={(event) => state.onChange('description', event.target.value)}
                    helperText={requiredHelper(values.description, 'Caracterí­sticas adicionales')}
                    dataTestId="devices-crud-form-description"
                  />
                </div>
              </>
            )}
          </div>
        )}
        {formType === 'generic' && state.assignedRefactions.length > 0 && (
          <div className="mt-4 rounded-lg bg-white-100 p-4 shadow-md">
            <p className="mb-3 font-[12px] text-blue-60">Refacciones asignadas</p>
            <div className="space-y-2">
              {state.assignedRefactions.map((row) => (
                <div
                  key={row.sparePartId}
                  className="grid grid-cols-1 items-center gap-2 rounded-md px-2 py-2 text-c2 text-gray-80 md:grid-cols-[72px_1fr_1fr_1fr_1fr_auto]"
                >
                  <span>{row.sku}</span>
                  <span>{row.name}</span>
                  <span>{row.brand}</span>
                  <span>{row.model}</span>
                  <span className="hidden md:block">{row.sparePartId}</span>
                  <Button
                    variant="ghost"
                    hideIcon
                    onClick={() => state.onRemoveAssignedRefaction(row.sparePartId)}
                    className="justify-self-start text-c2 font-semibold text-blue-100 md:justify-self-end"
                  >
                    Eliminar refacción
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {formType === 'generic' && state.showAddRefactionForm && (
          <div className="mt-4 rounded-lg bg-white-100 p-4 shadow-md">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                label="ID / SKU"
                placeholder="0000"
                value={state.newRefactionValues.sku}
                onChange={(event) => state.onChangeNewRefaction('sku', event.target.value)}
              />
              <Input
                label="Piezas en stock"
                placeholder="0"
                value={state.newRefactionValues.stock}
                onChange={(event) => state.onChangeNewRefaction('stock', event.target.value)}
              />
              <div />
              <Input
                label="Nombre"
                placeholder="Nombre de la refacción"
                value={state.newRefactionValues.name}
                onChange={(event) => state.onChangeNewRefaction('name', event.target.value)}
              />
              <Input
                label="Marca"
                placeholder="Marca"
                value={state.newRefactionValues.brand}
                onChange={(event) => state.onChangeNewRefaction('brand', event.target.value)}
              />
              <Input
                label="Modelo"
                placeholder="Modelo"
                value={state.newRefactionValues.model}
                onChange={(event) => state.onChangeNewRefaction('model', event.target.value)}
              />
              <Input
                label="Número de Serie / Parte"
                placeholder="00000000"
                value={state.newRefactionValues.serialNumber}
                onChange={(event) => state.onChangeNewRefaction('serialNumber', event.target.value)}
              />
              <Select
                label="Estatus"
                placeholder="Selecciona una opción"
                selected={state.newRefactionValues.status ? [state.newRefactionValues.status] : []}
                onChange={(selected) => state.onChangeNewRefaction('status', selected[0] ?? '')}
                options={[
                  { label: 'Disponible', value: 'Disponible' },
                  { label: 'En uso', value: 'En uso' },
                  { label: 'Agotado', value: 'Agotado' },
                ]}
              />
              <div />
              <div className="md:col-span-3">
                <Input
                  label="Características adicionales"
                  placeholder="Características adicionales"
                  value={state.newRefactionValues.characteristic}
                  onChange={(event) => state.onChangeNewRefaction('characteristic', event.target.value)}
                />
              </div>
              <Input
                label="Proveedor"
                placeholder="Nombre del proveedor"
                value={state.newRefactionValues.provider}
                onChange={(event) => state.onChangeNewRefaction('provider', event.target.value)}
              />
              <Input
                label="Página web"
                placeholder="www..."
                value={state.newRefactionValues.website}
                onChange={(event) => state.onChangeNewRefaction('website', event.target.value)}
              />
              <Input
                label="Teléfono"
                placeholder="55 +"
                value={state.newRefactionValues.phoneNumber}
                onChange={(event) => state.onChangeNewRefaction('phoneNumber', event.target.value)}
              />
              <div className="md:col-span-3 flex justify-end">
                <Button
                  variant="solid"
                  hideIcon
                  onClick={state.onSaveNewRefaction}
                  className="rounded-xl bg-blue-100 px-6 py-2 text-c1 font-semibold text-white-100"
                >
                  Guardar refacción
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormsLayout>
  );
};

export default DevicesForm;

'use client';

import React from 'react';
import { Button } from '@/app/components/Button/Button';
import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import type { FieldModel } from '@/app/components/DynamicForm/types';

import { useDeviceForm } from './hooks/useDeviceForm';
import { NEW_DEVICE_ID } from '../../hooks/useDevices';

type Props = {
  selectedRowId: string | null;     // null => no mostrar; "__new__" => crear; otro => editar
  onClose: () => void;
  onSaved?: () => void;             // callback al guardar/actualizar
};

const DevicesForm: React.FC<Props> = ({ selectedRowId, onClose, onSaved }) => {
  const normalizedId = selectedRowId === NEW_DEVICE_ID ? null : selectedRowId;

  const {
    values,
    setValues,
    isValid,
    submitting,
    submitRef,
    handleSubmit,
    setIsValid,
  } = useDeviceForm({
    deviceId: normalizedId,
    onSuccess: onSaved ?? onClose,
  });

  // Si no hay fila seleccionada, no renderizamos nada (ni ocupamos layout)
  if (!selectedRowId) return null;

  const fields: FieldModel[] = [
    { type: 'input', name: 'brand', label: 'Marca*', placeholder: 'Marca del equipo', value: values.brand, validations: [{ type: 'required' }] },
    { type: 'input', name: 'model', label: 'Modelo*', placeholder: 'Modelo del equipo', value: values.model, validations: [{ type: 'required' }] },
    { type: 'input', name: 'serialnumber', label: 'Serie*', placeholder: 'No. de serie', value: values.serialnumber, validations: [{ type: 'required' }] },
  ];

  const layout = { sm: [[10], [10], [10]], md: [[5, 5], [10]], lg: [[5, 5], [10]] };

  return (
    <div className="flex flex-col gap-6  bg-white-100 p-6 ">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="medium" onClick={onClose} hideIcon>
            Cancelar
          </Button>
          <Button
            variant="solid"
            size="medium"
            onClick={() => submitRef.current?.()}
            disabled={!isValid || submitting}
            hideIcon
          >
            {selectedRowId === NEW_DEVICE_ID ? 'Guardar equipo' : 'Actualizar equipo'}
          </Button>
        </div>
      </div>

      <DynamicForm
        key={`devices-form-${selectedRowId}`}   // cambia entre crear/editar
        fields={fields}
        onSubmit={handleSubmit}
        onValuesChange={(v) => setValues(v as typeof values)}
        onValidChange={setIsValid}
        responsiveLayoutMatrix={layout}
        showSubmitIf={() => false}
        externalSubmitRef={submitRef}
        dataTestId="devices-form"
      />
    </div>
  );
};

export default DevicesForm;

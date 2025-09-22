'use client';

import { Button } from '@/app/components/Button/Button';
import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import type { FieldModel } from '@/app/components/DynamicForm/types';

import { useDeviceForm } from './hooks/useDeviceForm';
import { NEW_DEVICE_ID } from '../../Devices';

type Props = {
  selectedRowId: string | null;     // null => no mostrar; "__new__" => crear; otro => editar
  onClose: () => void;
  onSaved?: () => void;             // callback al guardar/actualizar
};

const DevicesForm: React.FC<Props> = ({ selectedRowId, onClose, onSaved }) => {
  // Si no hay fila seleccionada, no renderizamos nada (ni ocupamos layout)
  if (!selectedRowId) return null;

  // 👇 Toda la lógica de formulario (validación, create/update, spinners, alerts)
  const {
    values,
    setValues,
    isValid,
    submitting,
    title,
    description,
    submitRef,
    handleSubmit,
    setIsValid
  } = useDeviceForm({
    deviceId: selectedRowId === NEW_DEVICE_ID ? null : selectedRowId,
    onSuccess: onSaved ?? onClose,
  });

  const fields: FieldModel[] = [
    { type: 'input', name: 'brand', label: 'Marca*', placeholder: 'Marca del equipo', value: values.brand, validations: [{ type: 'required'  }] },
    { type: 'input', name: 'model', label: 'Modelo*', placeholder: 'Modelo del equipo', value: values.model, validations: [{ type: 'required'}] },
    { type: 'input', name: 'serialnumber', label: 'Serie*', placeholder: 'No. de serie', value: values.serialnumber, validations: [{ type: 'required' }] },
  ];

  const layout = { sm: [[10], [10], [10]], md: [[5, 5], [10]], lg: [[5, 5], [10]] };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
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

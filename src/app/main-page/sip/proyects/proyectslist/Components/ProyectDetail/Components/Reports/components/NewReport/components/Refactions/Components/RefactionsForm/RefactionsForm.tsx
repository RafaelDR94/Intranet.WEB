'use client';

import { Button } from '@/app/components/Button/Button';
import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import type { FieldModel } from '@/app/components/DynamicForm/types';

import { NEW_REFACTION_ID } from '../../Refactions';

import useRefactionForm, { RefactionFormValues } from './hooks/useRefactionForm';
import type { Props } from './types';

const layout = {
  sm: [[10], [10], [10], [10], [10]],
  md: [[10], [5, 5], [5, 5]],
  lg: [[10], [5, 5], [5, 5]],
};

const buildFields = (values: RefactionFormValues): FieldModel[] => [
  {
    type: 'input',
    name: 'description',
    label: 'Refacción*',
    placeholder: 'Nombre de la refacción',
    value: values.description,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'brand',
    label: 'Marca*',
    placeholder: 'Marca de la refacción',
    value: values.brand,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'model',
    label: 'Modelo*',
    placeholder: 'Modelo de la refacción',
    value: values.model,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'serialnumber',
    label: 'Número de Serie*',
    placeholder: 'Número de serie',
    value: values.serialnumber,
    validations: [{ type: 'required' }],
  },
  {
    type: 'input',
    name: 'partnumber',
    label: 'Número de Parte*',
    placeholder: 'Número de parte',
    value: values.partnumber,
    validations: [{ type: 'required' }],
  },
];

const RefactionsForm: React.FC<Props> = ({ selectedRowId, onClose, onSaved }) => {
  if (!selectedRowId) return null;

  const refactionIndex = selectedRowId === NEW_REFACTION_ID ? null : Number(selectedRowId);
  const { values, setValues, isValid, setIsValid, submitRef, handleSubmit } = useRefactionForm({
    refactionIndex,
    onSuccess: onSaved ?? onClose,
  });

  const fields = buildFields(values);
  const isEditing = refactionIndex !== null;

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-700">
            {isEditing ? 'Editar refacción' : 'Agregar refacción'}
          </h3>
          <p className="text-sm text-slate-500">
            {isEditing
              ? 'Actualiza la información de la refacción seleccionada.'
              : 'Completa los campos para registrar una nueva refacción.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="medium" onClick={onClose} hideIcon>
            Cancelar
          </Button>
          <Button
            variant="solid"
            size="medium"
            onClick={() => submitRef.current?.()}
            disabled={!isValid}
            hideIcon
          >
            {isEditing ? 'Actualizar refacción' : 'Guardar refacción'}
          </Button>
        </div>
      </div>

      <DynamicForm
        key={`refaction-form-${selectedRowId}`}
        fields={fields}
        onSubmit={handleSubmit}
        onValuesChange={(nextValues) => setValues(nextValues as RefactionFormValues)}
        onValidChange={setIsValid}
        responsiveLayoutMatrix={layout}
        showSubmitIf={() => false}
        externalSubmitRef={submitRef}
        dataTestId="refactions-form"
      />
    </div>
  );
};

export default RefactionsForm;

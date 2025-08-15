'use client';

import React from 'react';
import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import { useRequisitionForm, RequisitionInitialValues } from './hooks/useRequisitionsForm';

/**
 * Props for the {@link RequisitionsForm} component.
 * @property mode define si el formulario crea o edita.
 * @property initialValues valores iniciales cuando se edita.
 * @property onClose callback para cerrar panel o modal contenedor.
 */
type Props = {
  /** Define si el formulario se usa para crear o editar */
  mode?: 'create' | 'edit';
  /** Valores iniciales cuando mode === 'edit' */
  initialValues?: RequisitionInitialValues;
  /** Para cerrar panel/modal si lo usas embebido */
  onClose?: () => void;
};

/**
 * Formulario para crear o editar requisiciones.
 * Envuelve un {@link DynamicForm} dentro de {@link FormsLayout} y usa
 * {@link useRequisitionForm} para manejar estado y envío.
 */
const RequisitionsForm: React.FC<Props> = ({ mode = 'create', initialValues, onClose }) => {
  const {
    fields,
    loadingFormInfo,
    setFormReady,
    submitRef,
    handleSubmit,
    onSubmit,
    buttonDisabled,
  } = useRequisitionForm(mode, initialValues);

  return (
    <FormsLayout
      title={mode === 'create' ? 'Solicitud de Requisiciones' : 'Editar Requisición'}
      primaryLabel="Guardar"
      onPrimaryClick={onSubmit}
      primaryDisabled={buttonDisabled}
      enableCollapse={false}
      showSecondaryButton={mode === 'edit'}
      secondaryLabel='Cancelar'
      onSecondaryClick={onClose}
    >


      <DynamicForm
        loadingFormInfo={loadingFormInfo}
        fields={fields}
        layoutMatrix={[[10], [5, 5]]}
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
      />
    </FormsLayout>
  );
};

export default RequisitionsForm;

'use client';

import React from 'react';
import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import { useRequisitionForm } from './hooks/useRequisitionsForm';
import { Requisition } from '@/app/mappings/requisitions/requisitions.types';
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
  initialValues?: Requisition;
  /** Para cerrar panel/modal si lo usas embebido */
  onClose?: () => void;
  /** Para controlar la distribucion */
  layoutMatrix?: number[][]
  /** Inicia con el componente deshabilitado */
  startDisabled?: boolean
};

/**
 * Formulario para crear o editar requisiciones.
 * Envuelve un {@link DynamicForm} dentro de {@link FormsLayout} y usa
 * {@link useRequisitionForm} para manejar estado y envío.
 */
const RequisitionsForm: React.FC<Props> = ({ mode = 'create', initialValues, onClose, layoutMatrix, startDisabled }) => {
  const {
    fields,
    loadingFormInfo,
    setFormReady,
    submitRef,
    handleSubmit,
    onSubmit,
    buttonDisabled,
    currentPagePermissions,
    disableForm,
    setDisableForm
  } = useRequisitionForm(mode, initialValues, startDisabled);

  if (currentPagePermissions?.requisitionForm) return (
    <FormsLayout
      title={mode === 'create' ? 'Solicitud de Requisiciones' : 'Editar Requisición'}
      primaryLabel="Guardar"
      onPrimaryClick={onSubmit}
      primaryDisabled={buttonDisabled ||(startDisabled &&disableForm )}
      enableCollapse={false}
      showSecondaryButton={currentPagePermissions?.updaterequisitionForm && (mode === 'edit' || startDisabled)}
      secondaryLabel={disableForm ? 'Editar información' : 'Cancelar'}
      onSecondaryClick={() => { onClose?.(); setDisableForm((prev) => !prev) }}
    >


      <DynamicForm
        loadingFormInfo={loadingFormInfo}
        fields={fields}
        layoutMatrix={layoutMatrix ?? [[3.3, 3.3, 3.3], [3.3, 3.3, 3.3], [3.3, 3.3]]}
        onSubmit={handleSubmit}
        onValidChange={setFormReady}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
        disabled={disableForm}

      />
    </FormsLayout>
  );
};

export default RequisitionsForm;

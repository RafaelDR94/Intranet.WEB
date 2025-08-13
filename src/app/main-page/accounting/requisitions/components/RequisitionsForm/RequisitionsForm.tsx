// src/app/(features)/requisitions/components/RequisitionsForm/RequisitionsForm.tsx
'use client';

import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import { useRequisitionForm, RequisitionInitialValues } from './hooks/useRequisitionsForm';

type Props = {
  mode?: 'create' | 'edit';
  /** Valores iniciales cuando mode === 'edit' */
  initialValues?: RequisitionInitialValues;
  /** Para cerrar panel/modal si lo usas embebido */
  onClose?: () => void;
};

const RequisitionsForm: React.FC<Props> = ({ mode="create", initialValues, onClose }) => {
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

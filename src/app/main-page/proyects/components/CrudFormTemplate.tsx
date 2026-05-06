'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';

import DynamicForm from '@/app/components/DynamicForm/DynamicForm';
import FormsLayout from '@/app/components/FormsLayout/FormsLayout';
import type { FieldModel, ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types';

type CrudFormTemplateProps = {
  title: string;
  primaryLabel: string;
  fields: FieldModel[];
  loading: boolean;
  loadingFormInfo: boolean;
  responsiveLayout: ResponsiveLayoutMatrix;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  dataTestId: string;
  children?: React.ReactNode;
  mergeChildrenInSingleCard?: boolean;
  contentClassName?: string;
  cardClassName?: string;
  formClassName?: string;
  rowClassName?: string;
};

const CrudFormTemplate = ({
  title,
  primaryLabel,
  fields,
  loading,
  loadingFormInfo,
  responsiveLayout,
  onSubmit,
  onCancel,
  dataTestId,
  children,
  mergeChildrenInSingleCard = false,
  contentClassName,
  cardClassName,
  formClassName,
  rowClassName,
}: CrudFormTemplateProps) => {
  const submitRef = useRef<(() => void | Promise<unknown>) | null>(null);
  const [formReady, setFormReady] = useState(false);

  const formContent = (
    <div className={clsx('w-full', contentClassName)}>
      <DynamicForm
        fields={fields}
        onSubmit={onSubmit}
        externalSubmitRef={submitRef}
        showSubmitIf={() => false}
        loading={loading}
        loadingFormInfo={loadingFormInfo}
        onValidChange={setFormReady}
        responsiveLayoutMatrix={responsiveLayout}
        dataTestId={dataTestId}
        formClassName={formClassName}
        rowClassName={rowClassName}
      />
      {children}
    </div>
  );

  const standaloneForm = (
    <DynamicForm
      fields={fields}
      onSubmit={onSubmit}
      externalSubmitRef={submitRef}
      showSubmitIf={() => false}
      loading={loading}
      loadingFormInfo={loadingFormInfo}
      onValidChange={setFormReady}
      responsiveLayoutMatrix={responsiveLayout}
      dataTestId={dataTestId}
      formClassName={formClassName}
      rowClassName={rowClassName}
    />
  );

  return (
    <FormsLayout
      title={title}
      primaryLabel={primaryLabel}
      onPrimaryClick={() => submitRef.current?.()}
      primaryDisabled={!formReady}
      showSecondaryButton
      secondaryLabel="Cancelar"
      onSecondaryClick={onCancel}
      cardClassName={cardClassName}
    >
      {mergeChildrenInSingleCard ? formContent : standaloneForm}
      {!mergeChildrenInSingleCard ? children : null}
    </FormsLayout>
  );
};

export default CrudFormTemplate;

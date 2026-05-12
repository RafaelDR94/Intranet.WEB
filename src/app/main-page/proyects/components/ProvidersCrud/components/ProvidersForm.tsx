'use client';

import CrudFormTemplate from '../../CrudFormTemplate';
import { useProvidersForm } from '../hooks/useProvidersForm';
import type { CrudScope } from '../../types';

type ProvidersFormProps = {
  scope: CrudScope;
};

const ProvidersForm = ({ scope }: ProvidersFormProps) => {
  const state = useProvidersForm(scope);

  return <CrudFormTemplate {...state} />;
};

export default ProvidersForm;

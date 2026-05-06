'use client';

import CrudFormTemplate from '../../CrudFormTemplate';
import { useLocationsForm } from '../hooks/useLocationsForm';
import type { CrudScope } from '../../types';

type LocationsFormProps = {
  scope: CrudScope;
};

const LocationsForm = ({ scope }: LocationsFormProps) => {
  const state = useLocationsForm(scope);

  return <CrudFormTemplate {...state} />;
};

export default LocationsForm;

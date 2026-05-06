'use client';

import LocationsDetail from './components/LocationsDetail';
import LocationsForm from './components/LocationsForm';
import LocationsList from './components/LocationsList';
import { useLocationsCrud } from './hooks/useLocationsCrud';
import type { CrudScope } from '../types';

type LocationsCrudProps = {
  scope: CrudScope;
};

const LocationsCrud = ({ scope }: LocationsCrudProps) => {
  const { crudView } = useLocationsCrud(scope);

  if (crudView === 'form') return <LocationsForm scope={scope} />;

  return (
    <>
      <LocationsList scope={scope} />
      <LocationsDetail scope={scope} open={crudView === 'detail'} />
    </>
  );
};

export default LocationsCrud;

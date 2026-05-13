'use client';

import ProvidersDetail from './components/ProvidersDetail';
import ProvidersForm from './components/ProvidersForm';
import ProvidersList from './components/ProvidersList';
import { useProvidersCrud } from './hooks/useProvidersCrud';
import type { CrudScope } from '../types';

type ProvidersCrudProps = {
  scope: CrudScope;
};

const ProvidersCrud = ({ scope }: ProvidersCrudProps) => {
  const { crudView } = useProvidersCrud(scope);

  if (crudView === 'form') return <ProvidersForm scope={scope} />;

  return (
    <>
      <ProvidersList scope={scope} />
      <ProvidersDetail scope={scope} open={crudView === 'detail'} />
    </>
  );
};

export default ProvidersCrud;

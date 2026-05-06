'use client';

import DevicesDetail from './components/DevicesDetail';
import DevicesForm from './components/DevicesForm';
import DevicesList from './components/DevicesList';
import { useDevicesCrud } from './hooks/useDevicesCrud';
import type { CrudScope } from '../types';

type DevicesCrudProps = {
  scope: CrudScope;
};

const DevicesCrud = ({ scope }: DevicesCrudProps) => {
  const { crudView } = useDevicesCrud(scope);

  if (crudView === 'form') return <DevicesForm scope={scope} />;

  return (
    <>
          <DevicesList scope={scope} />
  

        <DevicesDetail scope={scope} open={crudView === 'detail'} />
    </>

  );
};

export default DevicesCrud;

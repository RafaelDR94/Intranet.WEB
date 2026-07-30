import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function InternalDevicesPage
() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/it/internaldevices/internaldeviceslist',
        '/main-page/it/internaldevices/devicesBrands',
        '/main-page/it/internaldevices/devicesTypes',
        '/main-page/it/internaldevices/internaldevicesasignation',
        '/main-page/it/internaldevices/devicesDeactivated',
      ]}
    />
  );
}

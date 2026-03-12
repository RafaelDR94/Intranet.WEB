import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function InternalDevicesPage
() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/it/internaldevices/internaldeviceslist',
        '/main-page/it/internaldevices/internaldevicesasignation'
      ]}
    />
  );
}

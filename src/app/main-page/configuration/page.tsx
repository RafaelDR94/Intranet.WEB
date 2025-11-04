import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function Configuration() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/configuration/userconfiguration',
      ]}
    />
  );
}

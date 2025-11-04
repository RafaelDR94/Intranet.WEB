import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function HumanResources() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/humanresources/release',
        '/main-page/humanresources/documents'
      ]}
    />
  );
}

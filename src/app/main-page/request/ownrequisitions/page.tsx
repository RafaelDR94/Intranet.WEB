import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function PettyCash() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/request/ownrequisitions/requisitions',
        '/main-page/request/ownrequisitions/billablefiles',
      ]}
    />
  );
}

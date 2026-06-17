import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function OperationsPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/operations/requisitions',
        '/main-page/operations/documentshistory',
      ]}
    />
  );
}

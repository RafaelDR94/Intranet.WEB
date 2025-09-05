import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function RequisitionsPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/accounting/requisitions/requisitions',
        '/main-page/accounting/requisitions/requisitionsList',
      ]}
    />
  );
}

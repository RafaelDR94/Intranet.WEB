import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function OperationRequisition() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/operations/requisitions/requisitionsPage',
        '/main-page/operations/requisitions/requisitionListPage'
      ]}
    />
  );
}

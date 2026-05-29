import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function RequestPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/request/pettycash',
        '/main-page/request/documents',
        '/main-page/request/ownrequisitions',
        '/main-page/request/expenserequisitions',
        '/main-page/request/vehicleassignament',
      ]}
    />
  );
}

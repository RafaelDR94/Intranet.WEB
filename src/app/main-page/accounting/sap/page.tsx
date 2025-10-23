import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function sapPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/accounting/sap/administration',
        '/main-page/accounting/sap/operations'
      ]}
    />
  );
}

import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function BillableFilesPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/billablefiles/billablefiles',
      ]}
    />
  );
}

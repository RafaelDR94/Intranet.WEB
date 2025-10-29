import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function RequestPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/request/pettycash',
        '/main-page/request/documents',
      ]}
    />
  );
}

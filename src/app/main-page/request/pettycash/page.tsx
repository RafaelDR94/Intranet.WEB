import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function PettyCash() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/request/pettycash/pettycashrequest',
        '/main-page/request/pettycash/pettycashhistory'
      ]}
    />
  );
}

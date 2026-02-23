import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function AuthrizationsPage
() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/authorizations/authorizationslist',
      ]}
    />
  );
}

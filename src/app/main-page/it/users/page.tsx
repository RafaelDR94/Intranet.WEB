import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function ItPage
() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/it/users/userslist',
        '/main-page/it/users/userspending'
      ]}
    />
  );
}

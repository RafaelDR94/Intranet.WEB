import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function proyectsPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/proyects/proyects',
        '/main-page/proyects/inventory',
      ]}
    />
  );
}

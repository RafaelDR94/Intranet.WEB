import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function RequisitionsPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/proyects/proyects/proyectslist',
        '/main-page/proyects/proyects/locations',
        '/main-page/proyects/proyects/devices',
        '/main-page/proyects/proyects/refactions',
        '/main-page/proyects/proyects/newproyect',
      ]}
    />
  );
}

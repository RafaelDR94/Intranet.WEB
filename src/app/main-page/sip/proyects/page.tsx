import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function RequisitionsPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/sip/proyects/newproyect',
        '/main-page/sip/proyects/proyectslist',
      ]}
    />
  );
}

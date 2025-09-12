import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function SIPPage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/sip/proyects',
        '/main-page/sip/devicescatalog',
        '/main-page/sip/newreport',
      ]}
    />
  );
}

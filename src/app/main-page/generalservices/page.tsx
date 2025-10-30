import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function GeneralServicePage() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/generalservices/vehicleregist',

      ]}
    />
  );
}

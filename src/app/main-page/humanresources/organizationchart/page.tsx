import { PermissionRedirect } from '@/app/components/PermissionRedirect/PermissionRedirect';

export default function OrganizationChart() {
  return (
    <PermissionRedirect
      routes={[
        '/main-page/humanresources/organizationchart/departments',
        '/main-page/humanresources/organizationchart/generaldirectory',
      ]}
    />
  );
}
